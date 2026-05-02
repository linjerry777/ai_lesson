import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import {
  DEFAULT_PRODUCT,
  DEFAULT_TIER,
  isValidProduct,
  isValidTier,
  resolveStripePriceId,
} from '@/lib/courses'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET(request: NextRequest) {
  try {
    // ── 1. Resolve which product + tier the user is buying ──────────────
    const url = new URL(request.url)
    const rawProduct = url.searchParams.get('product')
    const rawTier = url.searchParams.get('tier')

    const productId = isValidProduct(rawProduct) ? rawProduct : DEFAULT_PRODUCT
    const tier = isValidTier(rawTier) ? rawTier : DEFAULT_TIER

    const priceLookup = resolveStripePriceId(productId, tier)
    if (!priceLookup) {
      console.error(`[checkout] no price configured for ${productId}/${tier}`)
      return NextResponse.redirect(
        new URL(`/?error=price_unavailable&product=${productId}`, SITE_URL),
      )
    }

    // ── 2. Auth ────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const next = `/api/checkout?product=${productId}&tier=${tier}`
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, SITE_URL))
    }

    // ── 3. Already purchased this product? → dashboard ─────────────────
    const { data: purchase } = await createServiceClient()
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .maybeSingle()

    if (purchase) {
      return NextResponse.redirect(new URL('/dashboard', SITE_URL))
    }

    // ── 4. Stripe Checkout Session ─────────────────────────────────────
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: priceLookup.priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        product_id: productId,
        tier,
      },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#pricing`,
    })

    return NextResponse.redirect(session.url!)
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.redirect(new URL('/?error=checkout_failed', SITE_URL))
  }
}
