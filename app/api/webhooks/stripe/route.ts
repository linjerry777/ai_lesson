import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

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
    const userId = session.metadata?.user_id

    if (!userId) {
      console.error('[webhook/stripe] missing user_id in metadata')
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const { error } = await createServiceClient()
      .from('purchases')
      .upsert({
        user_id: userId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
      }, { onConflict: 'stripe_session_id' })

    if (error) {
      console.error('[webhook/stripe] db insert error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
