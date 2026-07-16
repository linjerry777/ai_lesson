import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { buildStripePurchaseRecord, purchaseUpsert } from '@/lib/purchase-entitlements'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook/stripe] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    let upsert
    try {
      upsert = purchaseUpsert(buildStripePurchaseRecord(session))
    } catch (error) {
      console.error('[webhook/stripe] invalid entitlement metadata:', error)
      return NextResponse.json({ error: 'Invalid entitlement metadata' }, { status: 400 })
    }

    const { error } = await createServiceClient()
      .from('purchases')
      .upsert(upsert.values, upsert.options)

    if (error) {
      console.error('[webhook/stripe] db insert error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
