import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { getStripe, stripeIsLive } from '@/lib/stripe'
import { getSaleOffer, isValidProduct, isValidTier, resolveStripePriceId } from '@/lib/courses'
import { resolveCheckoutSelection } from '@/lib/checkout-selection'
import { validateCheckoutPrice } from '@/lib/stripe-fulfillment'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET(request: NextRequest) {
  try {
    // ── 1. Resolve which product + tier the user is buying ──────────────
    const url = new URL(request.url)
    const rawProduct = url.searchParams.get('product')
    const rawTier = url.searchParams.get('tier')

    if ((rawProduct && !isValidProduct(rawProduct)) || (rawTier && !isValidTier(rawTier))) {
      return NextResponse.json({ error: 'Invalid product or tier' }, { status: 400 })
    }

    const { productId, tier, course } = resolveCheckoutSelection(rawProduct, rawTier)

    if (course.isFree) {
      return NextResponse.redirect(new URL(`/dashboard?course=${productId}`, SITE_URL))
    }

    if (process.env.AI_LESSON_PAYMENTS_ENABLED !== 'true') {
      return NextResponse.redirect(
        new URL(`/?error=payments_unavailable&product=${productId}#pricing`, SITE_URL),
      )
    }

    const offer = getSaleOffer(productId, tier)
    if (!offer) return NextResponse.json({ error: 'This offer is not available' }, { status: 400 })

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
    const { data: purchase, error: purchaseError } = await createServiceClient()
      .from('purchases')
      .select('id')
      .eq('app_id', PLATFORM_APP_ID)
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .or(`stripe_session_id.like.${stripeIsLive() ? 'cs_live_' : 'cs_test_'}%,stripe_session_id.like.external:%`)
      .limit(1)
      .maybeSingle()

    if (purchaseError) throw new Error('Cannot verify existing purchase')

    if (purchase) {
      return NextResponse.redirect(new URL(`/dashboard?course=${productId}`, SITE_URL))
    }

    // ── 4. Stripe Checkout Session ─────────────────────────────────────
    const stripe = getStripe()
    validateCheckoutPrice(await stripe.prices.retrieve(priceLookup.priceId), offer.amountMinor, stripeIsLive())
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: priceLookup.priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: {
        app_id: PLATFORM_APP_ID,
        user_id: user.id,
        product_id: productId,
        tier,
      },
      payment_intent_data: { metadata: { app_id: PLATFORM_APP_ID, user_id: user.id, product_id: productId, tier } },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#pricing`,
    }, { idempotencyKey: `${PLATFORM_APP_ID}:${user.id}:${productId}:${tier}:${priceLookup.priceId}:${Math.floor(Date.now() / 1800000)}` })

    if (!session.url) throw new Error('Stripe did not return a Checkout URL')
    return NextResponse.redirect(session.url)
  } catch {
    console.error('[checkout] creation failed')
    return NextResponse.redirect(new URL('/?error=checkout_failed', SITE_URL))
  }
}
