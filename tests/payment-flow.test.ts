import { beforeEach, describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { getLearnerCourses } from '@/lib/learner-access'
import { execFileSync } from 'node:child_process'

const pgContainer = process.env.LESSON_VERIFY_PG_CONTAINER
if (pgContainer && pgContainer !== 'ai-lesson-verify-20260930') throw new Error('Unexpected local verification container')
function localQuery(sql: string) {
  return execFileSync('docker', ['exec', '-i', pgContainer!, 'psql', '-U', 'postgres', '-d', 'lesson_verify', '-v', 'ON_ERROR_STOP=1', '-Atc', sql], { encoding: 'utf8' }).trim()
}
const quote = (value: unknown) => value === null || value === undefined ? 'NULL' : typeof value === 'number' ? String(value) : `'${String(value).replaceAll("'", "''")}'`

const state = vi.hoisted(() => ({
  rows: [] as Record<string, unknown>[], session: {} as Record<string, unknown>, dbError: false,
  user: { id: '11111111-1111-4111-8111-111111111111' }, retrieved: vi.fn(), created: vi.fn(),
  price: {} as Record<string, unknown>, queries: [] as Record<string, unknown>[], realDb: false,
  revocations: {} as Record<string, string>,
}))

vi.mock('@/lib/stripe', async () => {
  const { default: RealStripe } = await import('stripe')
  const stripe = new RealStripe('sk_test_local_synthetic')
  stripe.checkout.sessions.retrieve = state.retrieved
  stripe.checkout.sessions.create = state.created
  Object.defineProperty(stripe.paymentIntents, 'retrieve', { value: vi.fn(async () => ({ ...state.session.payment_intent as object, livemode: false })) })
  Object.defineProperty(stripe.prices, 'retrieve', { value: vi.fn(async () => state.price) })
  return { getStripe: () => stripe, stripeIsLive: () => false }
})

vi.mock('@/lib/supabase/server', () => {
  const db = { rpc: async (name: string, args: Record<string, unknown>) => {
    if (state.dbError) return { data: null, error: { code: 'local_failure' } }
    if (state.realDb) {
      const order = name === 'ai_lesson_fulfill_payment' ? ['target_user','target_session','target_intent','target_amount','target_currency','target_product','target_tier','target_live'] : ['target_intent','target_live','target_status','target_event']
      const call = `public.${name}(${order.map(key => args[key] === false ? 'false' : args[key] === true ? 'true' : quote(args[key])).join(',')})`
      const data = name === 'ai_lesson_fulfill_payment' ? JSON.parse(localQuery(`select json_agg(p) from ${call} p`)) : localQuery(`select ${call}`)
      return { data, error: null }
    }
    if (name === 'ai_lesson_revoke_payment') {
      const intent = String(args.target_intent)
      state.revocations[intent] = state.revocations[intent] === 'disputed' ? 'disputed' : String(args.target_status)
      for (const row of state.rows) if (row.app_id === 'ai-lesson' && row.stripe_payment_intent === intent && row.status === 'completed') row.status = state.revocations[intent]
      return { data: state.revocations[intent], error: null }
    }
    const values = { app_id: 'ai-lesson', user_id: args.target_user, stripe_session_id: args.target_session, stripe_payment_intent: args.target_intent,
      amount: args.target_amount, currency: args.target_currency, product_id: args.target_product, tier: args.target_tier }
    let row = state.rows.find(item => item.app_id === 'ai-lesson' && item.stripe_session_id === values.stripe_session_id)
    if (row && Object.entries(values).some(([key, value]) => row![key] !== value)) return { data: null, error: { code: 'identity_conflict' } }
    if (!row) { row = { ...values, status: state.revocations[String(args.target_intent)] ?? 'completed' }; state.rows.push(row) }
    return { data: [{ purchase_status: row.status }], error: null }
  }, from: () => {
    const filters: Record<string, unknown> = {}
    let update: Record<string, unknown> | null = null
    const query = {
      select: () => query, eq: (key: string, value: unknown) => { filters[key] = value; return query },
      or: () => query, limit: () => query,
      update: (values: Record<string, unknown>) => { update = values; return query },
      upsert: async (values: Record<string, unknown>, options: { ignoreDuplicates: boolean }) => {
        if (state.dbError) return { error: { code: 'local_failure' } }
        if (state.realDb) {
          const keys = Object.keys(values)
          localQuery(`insert into public.purchases (${keys.join(',')}) values (${keys.map(key => quote(values[key])).join(',')}) on conflict(app_id,stripe_session_id) do nothing`)
        }
        const existing = state.rows.find(row => row.app_id === values.app_id && row.stripe_session_id === values.stripe_session_id)
        if (!existing) state.rows.push({ ...values })
        else if (!options.ignoreDuplicates) Object.assign(existing, values)
        return { error: null }
      },
      maybeSingle: async () => {
        state.queries.push(filters)
        const data = state.realDb ? JSON.parse(localQuery(`select coalesce((select row_to_json(p) from public.purchases p where ${Object.entries(filters).map(([key, value]) => `${key}=${quote(value)}`).join(' and ')} limit 1)::text,'null')`)) : state.rows.find(row => Object.entries(filters).every(([key, value]) => row[key] === value)) ?? null
        return { data, error: state.dbError ? { code: 'local_failure' } : null }
      },
      then: (resolve: (value: unknown) => unknown) => {
        if (update && !state.dbError) for (const row of state.rows) if (Object.entries(filters).every(([key, value]) => row[key] === value)) Object.assign(row, update)
        return Promise.resolve({ error: state.dbError ? { code: 'local_failure' } : null }).then(resolve)
      },
    }
    return query
  } }
  return { createServiceClient: () => db, createClient: async () => ({ ...db, auth: { getUser: async () => ({ data: { user: state.user } }) } }) }
})
import { POST } from '@/app/api/webhooks/stripe/route'
import { GET } from '@/app/api/checkout/route'

const secret = 'whsec_local_synthetic_only'
const signer = new Stripe('sk_test_local_synthetic')
function signed(type = 'checkout.session.completed', object: Record<string, unknown> = state.session, live = false, timestamp = Math.floor(Date.now() / 1000)) {
  const payload = JSON.stringify({ id: 'evt_local', object: 'event', type, livemode: live, data: { object } })
  return new NextRequest('http://localhost:3004/api/webhooks/stripe', { method: 'POST', body: payload, headers: { 'stripe-signature': signer.webhooks.generateTestHeaderString({ payload, secret, timestamp, scheme: 'v1', signature: '', cryptoProvider: Stripe.createNodeCryptoProvider() }) } })
}
beforeEach(() => {
  vi.stubEnv('AI_LESSON_PAYMENTS_ENABLED', 'true')
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_local_synthetic')
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', secret)
  vi.stubEnv('STRIPE_PRICE_ID', 'price_local')
  vi.stubEnv('STRIPE_PRICE_ID_CODEX_REMOTION', 'price_other')
  state.rows = []; state.queries = []; state.dbError = false; state.realDb = false; state.revocations = {}
  state.price = { id: 'price_local', active: true, currency: 'twd', unit_amount: 99000, type: 'one_time', livemode: false }
  state.session = {
    id: 'cs_test_local', mode: 'payment', status: 'complete', payment_status: 'paid', livemode: false,
    amount_total: 99000, currency: 'twd', client_reference_id: state.user.id,
    metadata: { app_id: 'ai-lesson', user_id: state.user.id, product_id: 'claude-code', tier: 'self' },
    line_items: { has_more: false, data: [{ quantity: 1, amount_total: 99000, price: state.price }] },
    payment_intent: { id: 'pi_local', metadata: { app_id: 'ai-lesson', user_id: state.user.id, product_id: 'claude-code', tier: 'self' }, status: 'succeeded', latest_charge: { refunded: false, disputed: false, amount_refunded: 0 } },
  }
  state.retrieved.mockReset().mockImplementation(async () => state.session)
  state.created.mockReset().mockResolvedValue({ url: 'https://checkout.stripe.com/synthetic' })
})
describe('local synthetic payment flow (real Stripe signature SDK, simulated API/store)', () => {
  it.runIf(Boolean(pgContainer))('round-trips the actual signed handler through isolated PostgreSQL and learner selection', async () => {
    state.realDb = true
    localQuery("delete from public.purchases where app_id='ai-lesson' and stripe_session_id='cs_test_local'")
    localQuery("delete from public.ai_lesson_payment_revocations where payment_intent='pi_local'")
    expect((await GET(new NextRequest('http://localhost:3004/api/checkout?product=claude-code&tier=self'))).status).toBe(307)
    expect((await POST(signed())).status).toBe(200)
    expect((await POST(signed())).status).toBe(200)
    const purchases = JSON.parse(localQuery("select coalesce(json_agg(p),'[]') from public.purchases p where app_id='ai-lesson' and user_id='11111111-1111-4111-8111-111111111111' and status='completed'"))
    expect(purchases.filter((row: { stripe_session_id: string }) => row.stripe_session_id === 'cs_test_local')).toHaveLength(1)
    expect(getLearnerCourses(purchases, false).map(course => course.slug)).toEqual(['starter-free', 'claude-code'])
    expect(localQuery("set role authenticated; select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false); select count(*) from public.purchases where stripe_session_id='cs_test_local'").split('\n').at(-1)).toBe('0')
    expect((await POST(signed('charge.refunded', { payment_intent: 'pi_local' }))).status).toBe(200)
    expect((await (await POST(signed())).json()).fulfilled).toBe(false)
    expect(localQuery("select status from public.purchases where stripe_session_id='cs_test_local'")).toBe('refunded')
  }, 30000) // Docker/psql process startup is slower than the in-memory unit tests.
  it('creates checkout with authenticated identity, verifies webhook, reads entitlement and exposes only the bought course', async () => {
    const checkout = await GET(new NextRequest('http://localhost:3004/api/checkout?product=claude-code&tier=self'))
    expect(checkout.status).toBe(307)
    expect(state.created).toHaveBeenCalledWith(expect.objectContaining({ client_reference_id: state.user.id, metadata: { app_id: 'ai-lesson', user_id: state.user.id, product_id: 'claude-code', tier: 'self' } }), expect.objectContaining({ idempotencyKey: expect.any(String) }))
    expect((await POST(signed())).status).toBe(200)
    expect((await POST(signed())).status).toBe(200)
    expect(state.rows).toHaveLength(1)
    expect(state.rows[0].amount).toBe(99000)
    expect(state.queries.at(-1)).toMatchObject({ app_id: 'ai-lesson', stripe_session_id: 'cs_test_local' })
    expect(getLearnerCourses(state.rows, false).map(course => course.slug)).toEqual(['starter-free', 'claude-code'])
  })
  it('rejects absent, fake and stale signatures without retrieving Stripe or granting access', async () => {
    for (const signature of [null, 't=1,v1=fake']) {
      const headers = signature ? { 'stripe-signature': signature } : undefined
      expect((await POST(new NextRequest('http://localhost/api/webhooks/stripe', { method: 'POST', body: '{}', headers }))).status).toBe(400)
    }
    expect(state.retrieved).not.toHaveBeenCalled(); expect(state.rows).toHaveLength(0)
    expect((await POST(signed('checkout.session.completed', state.session, false, 1))).status).toBe(400)
  })
  it('rejects modified signed body', async () => {
    const request = signed()
    const body = (await request.text()).replace('99000', '990')
    expect((await POST(new NextRequest(request.url, { method: 'POST', body, headers: request.headers }))).status).toBe(400)
    expect(state.rows).toHaveLength(0)
  })
  it.each(['amount', 'currency', 'product', 'app', 'user', 'price', 'intent-metadata'])('rejects a paid session with wrong %s', async defect => {
    if (defect === 'amount') state.session.amount_total = 990
    if (defect === 'currency') state.session.currency = 'usd'
    if (defect === 'product') state.session.metadata = { ...(state.session.metadata as object), product_id: 'starter-free' }
    if (defect === 'app') state.session.metadata = { ...(state.session.metadata as object), app_id: 'another-app' }
    if (defect === 'user') state.session.client_reference_id = 'another-user'
    if (defect === 'price') state.price.id = 'price_forged'
    if (defect === 'intent-metadata') state.session.payment_intent = { ...state.session.payment_intent as object, metadata: { app_id: 'other-app' } }
    expect((await POST(signed())).status).toBe(400); expect(state.rows).toHaveLength(0)
  })
  it('does not fulfill unpaid, foreign-mode, or unrelated events', async () => {
    expect((await POST(signed('checkout.session.completed', { ...state.session, payment_status: 'unpaid' }))).status).toBe(200)
    expect((await POST(signed('checkout.session.completed', state.session, true))).status).toBe(400)
    expect((await POST(signed('customer.created'))).status).toBe(200)
    expect(state.rows).toHaveLength(0)
  })
  it('does not overwrite a conflicting user and returns retryable failure on storage error', async () => {
    state.rows = [{ ...state.session.metadata as object, app_id: 'ai-lesson', stripe_session_id: 'cs_test_local', user_id: 'someone-else', status: 'completed' }]
    expect((await POST(signed())).status).toBe(500)
    expect(state.rows[0].user_id).toBe('someone-else')
    state.rows = []; state.dbError = true
    expect((await POST(signed())).status).toBe(500); expect(state.rows).toHaveLength(0)
    state.dbError = false
    expect((await POST(signed())).status).toBe(200)
  })
  it('revokes only this app payment on refund and dispute', async () => {
    await POST(signed())
    state.rows.push({ ...state.rows[0], app_id: 'other-app' })
    expect((await POST(signed('charge.refunded', { payment_intent: 'pi_local' }))).status).toBe(200)
    expect(state.rows.map(row => row.status)).toEqual(['refunded', 'completed'])
    state.rows[0].status = 'completed'
    await POST(signed('charge.dispute.created', { payment_intent: 'pi_local' }))
    expect(state.rows[0].status).toBe('disputed')
  })
  it('retains a refund arriving before checkout and acknowledges duplicates without restoring access', async () => {
    expect((await POST(signed('charge.refunded', { payment_intent: 'pi_local' }))).status).toBe(200)
    expect((await (await POST(signed())).json()).fulfilled).toBe(false)
    expect((await (await POST(signed())).json()).fulfilled).toBe(false)
    expect(state.rows).toHaveLength(1); expect(state.rows[0].status).toBe('refunded')
  })
  it('acknowledges an already refunded canonical charge without granting access', async () => {
    state.session.payment_intent = { ...state.session.payment_intent as object, latest_charge: { refunded: true, disputed: false, amount_refunded: 99000 } }
    expect((await (await POST(signed())).json()).fulfilled).toBe(false); expect(state.rows).toHaveLength(0)
    expect(state.revocations.pi_local).toBe('refunded')
  })
  it('revokes a previous grant when a repeated checkout reads a refunded canonical charge', async () => {
    await POST(signed())
    state.session.payment_intent = { ...state.session.payment_intent as object, latest_charge: { refunded: true, disputed: false, amount_refunded: 99000 } }
    expect((await (await POST(signed())).json()).fulfilled).toBe(false)
    expect(state.rows[0].status).toBe('refunded')
  })
  it('blocks paused payment before calling Stripe and rejects unknown products', async () => {
    vi.stubEnv('AI_LESSON_PAYMENTS_ENABLED', 'false')
    expect((await GET(new NextRequest('http://localhost/api/checkout?product=claude-code'))).headers.get('location')).toContain('payments_unavailable')
    expect((await GET(new NextRequest('http://localhost/api/checkout?product=toString'))).status).toBe(400)
    expect(state.created).not.toHaveBeenCalled()
  })
})
