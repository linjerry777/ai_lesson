import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify'
const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID!

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 })
  }

  const { licenseKey } = await req.json()
  if (!licenseKey || typeof licenseKey !== 'string') {
    return NextResponse.json({ error: '請輸入 License Key' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  // 確認這個 user 還沒啟用過
  const { data: existing } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: '此帳號已啟用課程' }, { status: 400 })
  }

  // 確認這個 license key 沒有被其他人用過
  const { data: keyUsed } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('stripe_session_id', `gumroad_${licenseKey}`)
    .maybeSingle()

  if (keyUsed) {
    return NextResponse.json({ error: '此 License Key 已被使用' }, { status: 400 })
  }

  // 打 Gumroad API 驗證
  const body = new URLSearchParams({
    product_id: PRODUCT_ID,
    license_key: licenseKey,
    increment_uses_count: 'false',
  })

  let gumroadRes: Response
  try {
    gumroadRes = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
  } catch {
    return NextResponse.json({ error: '無法連線驗證，請稍後再試' }, { status: 502 })
  }

  const gumroadData = await gumroadRes.json()

  if (!gumroadData.success) {
    return NextResponse.json({ error: 'License Key 無效，請確認輸入是否正確' }, { status: 400 })
  }

  // 寫入 purchases
  const { error: insertError } = await serviceClient
    .from('purchases')
    .insert({
      user_id: user.id,
      stripe_session_id: `gumroad_${licenseKey}`,
      amount: 2640,
      currency: 'twd',
      status: 'completed',
    })

  if (insertError) {
    return NextResponse.json({ error: '啟用失敗，請聯繫客服' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
