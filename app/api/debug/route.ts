import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Query purchases with service client (bypasses RLS)
    const serviceClient = createServiceClient()
    const { data: allPurchases, error: purchaseError } = await serviceClient
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Query just for current user
    const { data: myPurchase } = user
      ? await serviceClient
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .maybeSingle()
      : { data: null }

    return NextResponse.json({
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError?.message ?? null,
      myPurchase,
      allPurchases,
      purchaseError: purchaseError?.message ?? null,
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        stripeKey: process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING',
        priceId: process.env.STRIPE_PRICE_ID ?? 'MISSING',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'MISSING',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      },
    })
  } catch (e) {
    return NextResponse.json({ fatalError: String(e) }, { status: 500 })
  }
}
