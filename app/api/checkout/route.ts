import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Not authenticated → redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', SITE_URL))
    }

    // Check if already purchased (ignore errors if table not ready)
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .maybeSingle()

    if (purchase) {
      return NextResponse.redirect(new URL('/success', SITE_URL))
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#pricing`,
      locale: 'zh',
    })

    return NextResponse.redirect(checkoutSession.url!)
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.redirect(new URL('/?error=checkout_failed', SITE_URL))
  }
}
