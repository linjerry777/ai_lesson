import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { getLearnerCourses } from '@/lib/learner-access'
import { stripeIsLive } from '@/lib/stripe'
import { progressFromRows, validateProgressChange, type ProgressRow } from '@/lib/cloud-progress'

async function context() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) return null
  const { data, error } = await createServiceClient().from('purchases').select('product_id,tier,stripe_session_id')
    .eq('app_id', PLATFORM_APP_ID).eq('user_id', user.id).eq('status', 'completed')
  if (error) throw new Error('Entitlement unavailable')
  return { db, user, entitled: getLearnerCourses(data ?? [], stripeIsLive()).map(course => course.slug) }
}
const disabled = () => NextResponse.json({ error: 'Cloud progress is not enabled' }, { status: 503 })
const unavailable = () => NextResponse.json({ error: 'Progress unavailable' }, { status: 503 })

export async function GET() {
  if (process.env.AI_LESSON_CLOUD_PROGRESS_ENABLED !== 'true') return disabled()
  try {
    const ctx = await context()
    if (!ctx) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    const { data, error } = await ctx.db.from('ai_lesson_progress').select('product_id,lesson_id,completed,last_opened_at')
      .eq('app_id', PLATFORM_APP_ID).eq('user_id', ctx.user.id).in('product_id', ctx.entitled)
    if (error) return unavailable()
    const rows = (data ?? []) as ProgressRow[]
    return NextResponse.json({ progress: progressFromRows(rows), trackedCourses: [...new Set(rows.map(row => row.product_id))] }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return unavailable() }
}

export async function PATCH(request: NextRequest) {
  if (process.env.AI_LESSON_CLOUD_PROGRESS_ENABLED !== 'true') return disabled()
  // Browser writes require a same-origin request. No user ID is accepted.
  if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  let change
  try { change = validateProgressChange(await request.json()) } catch { change = null }
  if (!change) return NextResponse.json({ error: 'Invalid progress change' }, { status: 400 })
  try {
    const ctx = await context()
    if (!ctx) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    if (!ctx.entitled.includes(change.courseSlug)) return NextResponse.json({ error: 'Course access required' }, { status: 403 })
    const { data, error } = await ctx.db.rpc('ai_lesson_save_progress', {
      target_product: change.courseSlug, target_lesson: change.lessonId,
      target_completed: change.completed ?? null, target_opened: change.opened,
    })
    if (error || !data?.length) return unavailable()
    return NextResponse.json({ saved: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return unavailable() }
}
