import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/debug/purchase — manually inserts a test purchase for the logged-in user
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    const { data, error } = await serviceClient
      .from('purchases')
      .insert({
        user_id: user.id,
        stripe_session_id: 'debug_test_' + Date.now(),
        amount: 2640,
        currency: 'twd',
        status: 'completed',
      })
      .select()

    return NextResponse.json({
      inserted: data,
      error: error?.message ?? null,
      hint: error?.hint ?? null,
      details: error?.details ?? null,
      userId: user.id,
    })
  } catch (e) {
    return NextResponse.json({ fatalError: String(e) }, { status: 500 })
  }
}
