import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// TapPay webhook backup — in case /api/pay's DB insert failed
// TapPay retries if we don't return HTTP 200
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { status, rec_trade_id, order_number, amount } = body as {
    status: number
    rec_trade_id?: string
    order_number?: string
    amount?: number
  }

  // Only process successful payments
  if (status !== 0 || !rec_trade_id) {
    return NextResponse.json({ received: true })
  }

  console.log('[webhook/tappay] received:', { rec_trade_id, order_number, amount })

  // TapPay webhook doesn't carry user_id — we use rec_trade_id to find the purchase
  // If /api/pay already inserted the record, upsert is a no-op (conflict on stripe_session_id)
  const serviceClient = createServiceClient()
  const { data: existing } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('stripe_session_id', rec_trade_id)
    .maybeSingle()

  if (!existing) {
    console.warn('[webhook/tappay] purchase not found for rec_trade_id:', rec_trade_id)
    // Can't insert without user_id — log for manual recovery
  }

  return NextResponse.json({ received: true })
}
