import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getResource } from '@/lib/content'
import { ATTRIBUTION_COOKIE, decodeAttribution } from '@/lib/attribution'
import { CONSENT_TEXT, DOWNLOAD_BUCKET, SIGNED_URL_SECONDS, parseLeadRequest } from '@/lib/leads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: '格式錯誤' }, { status: 400 }) }

  const parsed = parseLeadRequest(body)
  if (!parsed.ok) {
    // Pretend success to bots so they don't adapt; they get no download URL.
    if (parsed.bot) return NextResponse.json({ ok: true })
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const resource = getResource(parsed.value.resource)
  if (!resource) return NextResponse.json({ error: '找不到這份資源' }, { status: 404 })

  const attribution = decodeAttribution(request.cookies.get(ATTRIBUTION_COOKIE)?.value)
  const db = createServiceClient()
  const { data, error } = await db.rpc('ai_lesson_capture_lead', {
    target_email: parsed.value.email,
    target_resource: resource.slug,
    target_consent: CONSENT_TEXT,
    target_video: attribution.video ?? null,
    target_source: attribution.source ?? null,
    target_medium: attribution.medium ?? null,
    target_campaign: attribution.campaign ?? null,
    target_content: attribution.content ?? null,
    target_landing: attribution.landing ?? null,
  })
  if (error || !Array.isArray(data) || !data.length) {
    console.error('[leads] capture failed')
    return NextResponse.json({ error: '暫時無法處理，請稍後再試' }, { status: 503 })
  }

  const { data: signed, error: signError } = await db.storage.from(DOWNLOAD_BUCKET)
    .createSignedUrl(resource.file.path, SIGNED_URL_SECONDS, { download: resource.file.downloadName })
  if (signError || !signed?.signedUrl) {
    console.error('[leads] signed url failed')
    return NextResponse.json({ error: '名單已收到，但檔案暫時無法下載，請稍後再試' }, { status: 503 })
  }
  return NextResponse.json({ ok: true, url: signed.signedUrl, expiresIn: SIGNED_URL_SECONDS })
}
