import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Not authenticated → redirect to login
  if (!session?.user) {
    return NextResponse.redirect(
      new URL('/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
    )
  }

  // Check if already purchased
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('status', 'completed')
    .single()

  if (purchase) {
    return NextResponse.redirect(
      new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
    )
  }

  // Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      user_id: session.user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/#pricing`,
    locale: 'zh',
  })

  return NextResponse.redirect(checkoutSession.url!)
}
