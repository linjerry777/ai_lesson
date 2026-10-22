// Paid kit delivery for Stripe Payment Links.
//
// Flow: Payment Link → Stripe Checkout → redirect to /thanks?session_id=cs_…
// The server re-reads that session from Stripe with a restricted key
// (STRIPE_KIT_KEY: Checkout Sessions + Payment Links read only), checks it is
// paid and which product it was for, records the order, and only then hands out
// a short-lived signed download URL. The course checkout in lib/stripe.ts is
// separate and untouched.
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { DOWNLOAD_BUCKET } from '@/lib/leads'
import { deliverables, findByPaymentLink, findProduct, isDeliverable, type Product } from '@/lib/products'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { purchaseUpsert } from '@/lib/purchase-entitlements'

export const KIT_URL_SECONDS = 600
const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/

export type VerifiedOrder = {
  sessionId: string
  product: Product
  email: string | null
  amountTotal: number
  currency: string
  livemode: boolean
  /** Unix seconds when the checkout was created. */
  createdAt?: number
}

export type VerifyResult = { ok: true; order: VerifiedOrder } | { ok: false; reason: 'invalid' | 'unpaid' | 'unknown_product' | 'unavailable' }

function kitStripe() {
  const key = process.env.STRIPE_KIT_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { typescript: true })
}

export function isSessionId(value: unknown): value is string {
  return typeof value === 'string' && SESSION_RE.test(value)
}

/** Product slug for a session: Payment Link metadata.product_slug, else the product whose paymentLinkId matches. */
export function productSlugOf(session: Pick<Stripe.Checkout.Session, 'payment_link' | 'metadata'>): string | null {
  const link = session.payment_link
  if (link && typeof link === 'object' && link.metadata?.product_slug) return link.metadata.product_slug
  if (session.metadata?.product_slug) return session.metadata.product_slug
  const linkId = typeof link === 'string' ? link : link?.id
  return linkId ? findByPaymentLink(linkId)?.slug ?? null : null
}

export function checkSession(session: Stripe.Checkout.Session): VerifyResult {
  // 'no_payment_required' = a 100% promotion code (gifts, reviewers, end-to-end tests).
  if (session.status !== 'complete' || !['paid', 'no_payment_required'].includes(session.payment_status)) return { ok: false, reason: 'unpaid' }
  const discounted = (session.total_details?.amount_discount ?? 0) > 0
  const slug = productSlugOf(session)
  const product = slug ? findProduct(slug) : null
  if (!product || !isDeliverable(product)) return { ok: false, reason: 'unknown_product' }
  if (!discounted && product.price !== null && session.currency === 'twd' && (session.amount_total ?? 0) < product.price * 100) {
    // Paid less than the listed price (e.g. a mis-configured link): do not deliver automatically.
    return { ok: false, reason: 'unknown_product' }
  }
  return {
    ok: true,
    order: {
      sessionId: session.id,
      product,
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'twd',
      livemode: session.livemode,
      createdAt: session.created,
    },
  }
}

export async function verifySession(sessionId: string): Promise<VerifyResult> {
  if (!isSessionId(sessionId)) return { ok: false, reason: 'invalid' }
  const stripe = kitStripe()
  if (!stripe) return { ok: false, reason: 'unavailable' }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_link'] })
    return checkSession(session)
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) return { ok: false, reason: 'invalid' }
    console.error('[kit-orders] stripe read failed')
    return { ok: false, reason: 'unavailable' }
  }
}

/**
 * Every paid order made with this email, read straight from Stripe (so it also finds
 * buyers who closed the window before reaching /thanks). Newest first. The caller must
 * have verified that the visitor owns this email (signed in with it).
 */
export async function ordersForEmail(email: string): Promise<VerifiedOrder[] | null> {
  const stripe = kitStripe()
  if (!stripe) return null
  try {
    // Stripe matches the email exactly; try the lower-cased spelling too.
    const spellings = [...new Set([email, email.toLowerCase()])]
    const pages = await Promise.all(spellings.map(value => stripe.checkout.sessions.list({ customer_details: { email: value }, limit: 100, expand: ['data.payment_link'] })))
    const seen = new Set<string>()
    return pages.flatMap(page => page.data)
      .filter(session => !seen.has(session.id) && Boolean(seen.add(session.id)))
      .sort((a, b) => b.created - a.created)
      .map(checkSession)
      .flatMap(result => (result.ok ? [result.order] : []))
  } catch {
    console.error('[kit-orders] stripe list failed')
    return null
  }
}

export async function recordOrder(order: VerifiedOrder, via: 'success_page' | 'webhook') {
  const db = createServiceClient()
  const { error } = await db.from('ai_lesson_kit_orders').upsert({
    session_id: order.sessionId,
    product_slug: order.product.slug,
    email: order.email,
    amount_total: order.amountTotal,
    currency: order.currency,
    livemode: order.livemode,
    first_seen_via: via,
  }, { onConflict: 'session_id', ignoreDuplicates: true })
  if (error) console.error('[kit-orders] record failed')
}

/** Signed URL for one downloadable item of the order (the product itself or a bundle member). */
export async function signedKitUrl(order: VerifiedOrder, itemSlug?: string): Promise<string | null> {
  const items = deliverables(order.product)
  const item = itemSlug ? items.find(candidate => candidate.slug === itemSlug) : items.find(candidate => candidate.file)
  const file = item?.file
  if (!file) return null
  const db = createServiceClient()
  const { data, error } = await db.storage.from(DOWNLOAD_BUCKET)
    .createSignedUrl(file.path, KIT_URL_SECONDS, { download: file.downloadName })
  if (error || !data?.signedUrl) {
    console.error('[kit-orders] signed url failed')
    return null
  }
  const { data: row } = await db.from('ai_lesson_kit_orders').select('download_count').eq('session_id', order.sessionId).maybeSingle()
  await db.from('ai_lesson_kit_orders')
    .update({ download_count: (row?.download_count ?? 0) + 1, last_download_at: new Date().toISOString() })
    .eq('session_id', order.sessionId)
  return data.signedUrl
}

/**
 * Unlock /dashboard courses bought through Payment Links. Called after Google
 * login (verified email): every recorded order for that email whose product
 * (or bundle member) grants a course becomes a `purchases` row. Idempotent via
 * the app/session unique key.
 */
export async function claimKitCourses(userId: string, email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return 0
  const db = createServiceClient()
  const { data, error } = await db.from('ai_lesson_kit_orders')
    .select('session_id,product_slug,amount_total,currency').ilike('email', normalized)
  if (error) throw error
  let granted = 0
  for (const row of data ?? []) {
    const product = findProduct(row.product_slug)
    if (!product) continue
    for (const item of deliverables(product)) {
      if (!item.grantsCourse) continue
      const upsert = purchaseUpsert({
        app_id: PLATFORM_APP_ID,
        user_id: userId,
        stripe_session_id: `link:${row.session_id}:${item.grantsCourse}`,
        amount: row.amount_total,
        currency: row.currency,
        status: 'completed',
        product_id: item.grantsCourse,
        tier: 'self',
        updated_at: new Date().toISOString(),
      })
      const { error: upsertError } = await db.from('purchases').upsert(upsert.values, upsert.options)
      if (upsertError) throw upsertError
      granted += 1
    }
  }
  return granted
}
