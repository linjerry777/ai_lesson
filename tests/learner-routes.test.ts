import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'

const state = vi.hoisted(() => ({
  user: { id: '11111111-1111-4111-8111-111111111111' } as { id: string } | null,
  purchases: [] as Record<string, unknown>[], progress: [] as Record<string, unknown>[],
  queries: [] as { table: string; filters: Record<string, unknown> }[], error: false, rpc: vi.fn(),
}))
vi.mock('next/navigation', () => ({ redirect: (url: string) => { throw new Error(`redirect:${url}`) } }))
vi.mock('@/lib/stripe', () => ({ stripeIsLive: () => process.env.AI_LESSON_STRIPE_MODE === 'live' }))
vi.mock('@/lib/supabase/server', () => {
  const client = {
    auth: { getUser: async () => ({ data: { user: state.user } }) }, rpc: state.rpc,
    from: (table: string) => {
      const filters: Record<string, unknown> = {}
      state.queries.push({ table, filters })
      const rows = () => (table === 'purchases' ? state.purchases : state.progress).filter(row => Object.entries(filters).every(([key, value]) => Array.isArray(value) ? value.includes(row[key]) : row[key] === value))
      const query = {
        select: () => query,
        eq: (key: string, value: unknown) => { filters[key] = value; return query },
        in: (key: string, value: unknown) => { filters[key] = value; return query },
        maybeSingle: async () => ({ data: rows()[0] ?? null, error: state.error }),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: rows(), error: state.error }).then(resolve),
      }
      return query
    },
  }
  return { createClient: async () => client, createServiceClient: () => client }
})
import { GET as resource } from '@/app/api/course-resources/route'
import { GET as progress, PATCH } from '@/app/api/progress/route'
import SuccessPage from '@/app/success/page'

beforeEach(() => {
  vi.stubEnv('AI_LESSON_CLOUD_PROGRESS_ENABLED', 'true'); vi.stubEnv('AI_LESSON_STRIPE_MODE', 'sandbox')
  state.user = { id: '11111111-1111-4111-8111-111111111111' }; state.purchases = []; state.progress = []; state.queries = []; state.error = false
  state.rpc.mockReset().mockResolvedValue({ data: [{}], error: null })
})
const purchase = (product = 'codex-remotion') => ({ app_id: 'ai-lesson', user_id: state.user!.id, product_id: product, tier: 'self', stripe_session_id: 'cs_test_real123', status: 'completed' })
const change = (body: unknown, origin = 'http://localhost:3004') => new NextRequest('http://localhost:3004/api/progress', { method: 'PATCH', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

describe('authorized learning resources and progress routes', () => {
  it('blocks anonymous, unbought, other-product, refunded, other-user and other-app downloads', async () => {
    const request = () => new NextRequest('http://localhost:3004/api/course-resources?course=codex-remotion')
    state.user = null; expect((await resource(request())).status).toBe(401)
    state.user = { id: '11111111-1111-4111-8111-111111111111' }
    for (const rows of [[], [purchase('claude-code')], [{ ...purchase(), status: 'refunded' }], [{ ...purchase(), user_id: 'another-user' }], [{ ...purchase(), app_id: 'other-app' }]]) {
      state.purchases = rows; expect((await resource(request())).status).toBe(403)
    }
    expect((await resource(new NextRequest('http://localhost/api/course-resources?course=../../secret'))).status).toBe(404)
  })
  it('returns the real ZIP only to the entitled learner and separates test/live modes', async () => {
    state.purchases = [purchase()]
    const request = () => new NextRequest('http://localhost:3004/api/course-resources?course=codex-remotion')
    const response = await resource(request())
    expect(response.status).toBe(200); expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(Buffer.from(await response.arrayBuffer()).subarray(0, 2).toString()).toBe('PK')
    vi.stubEnv('AI_LESSON_STRIPE_MODE', 'live'); expect((await resource(request())).status).toBe(403)
    state.error = true; expect((await resource(request())).status).toBe(503)
  })
  it('uses authenticated app scope and filters out unbought cloud progress', async () => {
    state.progress = ['starter-free', 'claude-code'].map(product_id => ({ app_id: 'ai-lesson', user_id: state.user!.id, product_id, lesson_id: product_id === 'starter-free' ? 'start00' : 'ch00', completed: true, last_opened_at: null }))
    const response = await progress()
    expect(await response.json()).toMatchObject({ trackedCourses: ['starter-free'], progress: { completed: ['starter-free:start00'] } })
    expect(state.queries.every(query => query.filters.app_id === 'ai-lesson' && query.filters.user_id === state.user!.id)).toBe(true)
  })
  it('rejects disabled, anonymous, cross-origin, invalid lesson and unbought writes', async () => {
    vi.stubEnv('AI_LESSON_CLOUD_PROGRESS_ENABLED', 'false'); expect((await progress()).status).toBe(503)
    vi.stubEnv('AI_LESSON_CLOUD_PROGRESS_ENABLED', 'true'); state.user = null; expect((await progress()).status).toBe(401)
    state.user = { id: '11111111-1111-4111-8111-111111111111' }
    expect((await PATCH(change({ courseSlug: 'starter-free', lessonId: 'start00', completed: true }, 'https://attacker.invalid'))).status).toBe(403)
    expect((await PATCH(change({ courseSlug: 'starter-free', lessonId: 'ch00', completed: true }))).status).toBe(400)
    expect((await PATCH(change({ courseSlug: 'claude-code', lessonId: 'ch00', completed: true }))).status).toBe(403)
    expect(state.rpc).not.toHaveBeenCalled()
  })
  it('calls the invoker RPC without accepting a caller-supplied user ID; failed persistence is not saved', async () => {
    const response = await PATCH(change({ courseSlug: 'starter-free', lessonId: 'start00', completed: false, opened: true, user_id: 'another-user' }))
    expect(response.status).toBe(200)
    expect(state.rpc).toHaveBeenCalledWith('ai_lesson_save_progress', { target_product: 'starter-free', target_lesson: 'start00', target_completed: false, target_opened: true })
    state.rpc.mockResolvedValue({ data: null, error: { code: 'db_failure' } })
    expect((await PATCH(change({ courseSlug: 'starter-free', lessonId: 'start00', completed: true }))).status).toBe(503)
  })
})
describe('success page reads verified purchases; URL never grants access', () => {
  it('redirects anonymous users while preserving the Session return path', async () => {
    state.user = null
    await expect(SuccessPage({ searchParams: Promise.resolve({ session_id: 'cs_test_real123' }) })).rejects.toThrow('redirect:/login?next=%2Fsuccess%3Fsession_id%3Dcs_test_real123')
    expect(state.queries).toHaveLength(0)
  })
  it('shows pending for forged, refunded, other-user, other-app and wrong-mode purchases', async () => {
    for (const rows of [[], [{ ...purchase(), status: 'refunded' }], [{ ...purchase(), user_id: 'other-user' }], [{ ...purchase(), app_id: 'other-app' }]]) {
      state.purchases = rows
      const page = await SuccessPage({ searchParams: Promise.resolve({ session_id: 'cs_test_real123' }) })
      expect(renderToStaticMarkup(page)).toContain('尚未確認課程權限')
    }
    state.purchases = [purchase()]; vi.stubEnv('AI_LESSON_STRIPE_MODE', 'live')
    expect(renderToStaticMarkup(await SuccessPage({ searchParams: Promise.resolve({ session_id: 'cs_test_real123' }) }))).toContain('尚未確認課程權限')
  })
  it('opens only the course found in the current user app-scoped completed purchase', async () => {
    state.purchases = [purchase()]
    const html = renderToStaticMarkup(await SuccessPage({ searchParams: Promise.resolve({ session_id: 'cs_test_real123' }) }))
    expect(html).toContain('課程權限已確認'); expect(html).toContain('/dashboard?course=codex-remotion')
    expect(state.queries[0].filters).toMatchObject({ app_id: 'ai-lesson', user_id: state.user!.id, stripe_session_id: 'cs_test_real123', status: 'completed' })
  })
})
