import { NextRequest, NextResponse } from 'next/server'
import { recordOrder, signedKitUrl, verifySession } from '@/lib/kit-orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /api/kit-download?session_id=cs_… → 303 to a 10-minute signed download URL. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id') ?? ''
  const result = await verifySession(sessionId)
  if (!result.ok) {
    const status = result.reason === 'unavailable' ? 503 : result.reason === 'unpaid' ? 402 : 404
    return NextResponse.json({ error: '找不到這筆已付款的訂單' }, { status })
  }
  await recordOrder(result.order, 'success_page')
  const url = await signedKitUrl(result.order)
  if (!url) return NextResponse.json({ error: '檔案暫時無法下載，請稍後再試或來信' }, { status: 503 })
  return NextResponse.redirect(url, 303)
}
