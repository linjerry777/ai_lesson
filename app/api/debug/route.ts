import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    return NextResponse.json({
      user: user ? { id: user.id, email: user.email } : null,
      authError: error?.message ?? null,
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        stripeKey: process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING',
        priceId: process.env.STRIPE_PRICE_ID ?? 'MISSING',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'MISSING',
      },
    })
  } catch (e) {
    return NextResponse.json({ fatalError: String(e) }, { status: 500 })
  }
}
