import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id

    if (userId && session.payment_status === 'paid') {
      const supabase = createServiceClient()
      await supabase.from('purchases').upsert({
        user_id: userId,
        stripe_session_id: session.id,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency,
        status: 'completed',
        created_at: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}
