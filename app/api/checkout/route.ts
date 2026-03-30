import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Not authenticated → redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', SITE_URL))
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

    // Not purchased → send to Gumroad to buy
    return NextResponse.redirect('https://3638974706248.gumroad.com/l/apwvvk')
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.redirect(new URL('/?error=checkout_failed', SITE_URL))
  }
}
