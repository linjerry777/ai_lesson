import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { payByPrime } from '@/lib/tappay'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
const AMOUNT = 2640
const CURRENCY = 'TWD'

export async function POST(req: NextRequest) {
  // ── 1. Auth check ──────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 })
  }

  // ── 2. Already purchased? (idempotent) ─────────────────────────
  const serviceClient = createServiceClient()
  const { data: existing } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: '你已購買過此課程' }, { status: 400 })
  }

  // ── 3. Parse body ──────────────────────────────────────────────
  const { prime, email } = await req.json()
  if (!prime) {
    return NextResponse.json({ error: '缺少付款 token，請重試' }, { status: 400 })
  }

  // ── 4. Call TapPay Pay-by-Prime ────────────────────────────────
  const result = await payByPrime({
    prime,
    amount: AMOUNT,
    currency: CURRENCY,
    details: '網課小韭菜 — AI 工具課程（7 章全程）',
    cardholder: {
      phone_number: '',
      name: user.user_metadata?.full_name ?? '學員',
      email: email ?? user.email ?? '',
    },
    backend_notify_url: `${SITE_URL}/api/webhooks/tappay`,
  })

  if (result.status !== 0) {
    console.error('[pay] TapPay error:', result)
    return NextResponse.json(
      { error: result.msg || '付款失敗，請稍後再試' },
      { status: 400 }
    )
  }

  // ── 5. Record purchase ─────────────────────────────────────────
  const { error: insertError } = await serviceClient.from('purchases').insert({
    user_id: user.id,
    stripe_session_id: result.rec_trade_id ?? '',   // reusing column for TapPay trade ID
    amount: AMOUNT,
    currency: CURRENCY,
    status: 'completed',
  })

  if (insertError) {
    console.error('[pay] insert error:', insertError)
    // Payment succeeded but DB write failed — log for manual recovery
    // Still return success to avoid confusing the user
  }

  return NextResponse.json({ rec_trade_id: result.rec_trade_id })
}
