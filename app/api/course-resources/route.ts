import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { getLearnerCourses } from '@/lib/learner-access'
import { stripeIsLive } from '@/lib/stripe'

export const runtime = 'nodejs'
export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get('course')
  if (course !== 'codex-remotion') return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const { data, error } = await createServiceClient().from('purchases').select('product_id,tier,stripe_session_id')
    .eq('app_id', PLATFORM_APP_ID).eq('user_id', user.id).eq('product_id', course).eq('status', 'completed')
  if (error) return NextResponse.json({ error: 'Resource unavailable' }, { status: 503 })
  if (!getLearnerCourses(data ?? [], stripeIsLive()).some(item => item.slug === course)) return NextResponse.json({ error: 'Course access required' }, { status: 403 })
  try {
    const file = await readFile(path.join(process.cwd(), 'course-resources', 'codex-remotion-lab.zip'))
    return new Response(new Uint8Array(file), { headers: { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="codex-remotion-lab.zip"', 'Cache-Control': 'private, no-store' } })
  } catch { return NextResponse.json({ error: 'Resource unavailable' }, { status: 503 }) }
}
