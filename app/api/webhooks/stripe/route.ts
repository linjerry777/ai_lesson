import { NextRequest, NextResponse } from 'next/server'
import { getStripe, stripeIsLive } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { resolveStripePriceId } from '@/lib/courses'
import { InvalidCheckoutError, RevokedCheckoutError, validatePaidCheckout } from '@/lib/stripe-fulfillment'
import { PLATFORM_APP_ID } from '@/lib/platform'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment configuration unavailable' }, { status: 503 })
  }
  let stripe
  try { stripe = getStripe() } catch {
    return NextResponse.json({ error: 'Payment configuration unavailable' }, { status: 503 })
  }
  let event
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  if (event.livemode !== stripeIsLive()) {
    return NextResponse.json({ error: 'Wrong payment mode' }, { status: 400 })
  }
  if (event.type === 'charge.refunded' || event.type === 'charge.dispute.created') {
    const intent = event.data.object.payment_intent
    const intentId = typeof intent === 'string' ? intent : intent?.id
    if (!intentId) return NextResponse.json({ error: 'Missing payment identity' }, { status: 400 })
    try {
      const payment = await stripe.paymentIntents.retrieve(intentId)
      if (payment.metadata.app_id !== PLATFORM_APP_ID) return NextResponse.json({ received: true })
      if (payment.livemode !== stripeIsLive()) return NextResponse.json({ error: 'Wrong payment mode' }, { status: 400 })
      const { data, error } = await createServiceClient().rpc('ai_lesson_revoke_payment', {
        target_intent: intentId, target_live: stripeIsLive(),
        target_status: event.type === 'charge.refunded' ? 'refunded' : 'disputed', target_event: event.id,
      })
      if (error || !data) throw new Error('Revocation persistence failed')
      return NextResponse.json({ received: true })
    } catch {
      return NextResponse.json({ error: 'Revocation unavailable' }, { status: 500 })
    }
  }
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ received: true })
  }
  if (event.data.object.payment_status !== 'paid') return NextResponse.json({ received: true, fulfilled: false })

  try {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, { expand: ['line_items.data.price', 'payment_intent.latest_charge'] })
    const productId = session.metadata?.product_id
    const tier = session.metadata?.tier
    const price = tier === 'self' && productId ? resolveStripePriceId(productId, tier) : null
    if (!price) throw new InvalidCheckoutError('No configured offer')
    const record = validatePaidCheckout(session, price.priceId, stripeIsLive())
    const db = createServiceClient()
    const { data: saved, error } = await db.rpc('ai_lesson_fulfill_payment', {
      target_user: record.user_id, target_session: record.stripe_session_id,
      target_intent: record.stripe_payment_intent, target_amount: record.amount, target_currency: record.currency,
      target_product: record.product_id, target_tier: record.tier, target_live: stripeIsLive(),
    })
    if (error || !saved?.length) throw new Error('Purchase persistence failed')
    const { data: purchase, error: readError } = await db.from('purchases')
      .select('user_id,product_id,tier,status')
      .eq('app_id', PLATFORM_APP_ID).eq('stripe_session_id', session.id).maybeSingle()
    if (readError || !purchase || purchase.user_id !== record.user_id || purchase.product_id !== record.product_id ||
      purchase.tier !== record.tier || !['completed', 'refunded', 'disputed'].includes(purchase.status)) throw new Error('Purchase read-back failed')
    return NextResponse.json({ received: true, fulfilled: purchase.status === 'completed' })
  } catch (error) {
    if (error instanceof RevokedCheckoutError) {
      const { data, error: revokeError } = await createServiceClient().rpc('ai_lesson_revoke_payment', {
        target_intent: error.purchase.stripe_payment_intent, target_live: stripeIsLive(),
        target_status: error.status, target_event: event.id,
      })
      return revokeError || !data ? NextResponse.json({ error: 'Revocation unavailable' }, { status: 500 }) :
        NextResponse.json({ received: true, fulfilled: false })
    }
    if (error instanceof InvalidCheckoutError) return NextResponse.json({ error: 'Invalid checkout' }, { status: 400 })
    console.error('[webhook/stripe] fulfillment failed')
    return NextResponse.json({ error: 'Fulfillment unavailable' }, { status: 500 })
  }
}
