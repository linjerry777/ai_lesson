// Spoken / pinned-comment short link: /v/12 or /v/12?s=yt
// Records a click, remembers which video sent the visitor, then redirects to the note page.

import { NextRequest, NextResponse } from 'next/server'
import { getVideoByCode } from '@/lib/content'
import { createServiceClient } from '@/lib/supabase/server'
import {
  ATTRIBUTION_COOKIE, attributionCookieOptions, encodeAttribution, isLikelyBot, sanitizeAttribution,
} from '@/lib/attribution'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const video = getVideoByCode(code)
  if (!video) return NextResponse.redirect(new URL('/videos', request.url))

  const search = request.nextUrl.searchParams
  const attribution = sanitizeAttribution({
    video: video.code,
    source: search.get('s') ?? search.get('utm_source'),
    medium: search.get('utm_medium') ?? 'video',
    campaign: search.get('utm_campaign'),
    content: search.get('utm_content'),
    landing: `/videos/${video.slug}`,
  })

  if (!isLikelyBot(request.headers.get('user-agent'))) {
    const { error } = await createServiceClient().from('ai_lesson_clicks').insert({
      video_code: video.code, utm_source: attribution.source ?? null, utm_campaign: attribution.campaign ?? null,
    })
    if (error) console.error('[v] click insert failed')
  }

  const response = NextResponse.redirect(new URL(`/videos/${video.slug}`, request.url))
  response.cookies.set(ATTRIBUTION_COOKIE, encodeAttribution(attribution), attributionCookieOptions)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
