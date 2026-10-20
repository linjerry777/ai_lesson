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
import { PRODUCTS, getProduct, type Product } from '@/lib/products'

export const KIT_URL_SECONDS = 600
const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/

export type VerifiedOrder = {
  sessionId: string
  product: Product
  email: string | null
  amountTotal: number
  currency: string
  livemode: boolean
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
  return PRODUCTS.find(product => product.paymentLinkId && product.paymentLinkId === linkId)?.slug ?? null
}

export function checkSession(session: Stripe.Checkout.Session): VerifyResult {
  if (session.status !== 'complete' || session.payment_status !== 'paid') return { ok: false, reason: 'unpaid' }
  const slug = productSlugOf(session)
  const product = slug ? getProduct(slug) : null
  if (!product?.file) return { ok: false, reason: 'unknown_product' }
  if (product.price !== null && session.currency === 'twd' && (session.amount_total ?? 0) < product.price * 100) {
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

export async function signedKitUrl(order: VerifiedOrder): Promise<string | null> {
  const file = order.product.file
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
