import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Not authenticated → redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login?next=/api/checkout', SITE_URL))
    }

    // Already purchased → go to dashboard
    const { data: purchase } = await createServiceClient()
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .maybeSingle()

    if (purchase) {
      return NextResponse.redirect(new URL('/dashboard', SITE_URL))
    }

    // Create Stripe Checkout Session
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      metadata: { user_id: user.id },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#pricing`,
    })

    return NextResponse.redirect(session.url!)
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.redirect(new URL('/?error=checkout_failed', SITE_URL))
  }
}
