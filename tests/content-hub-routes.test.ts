import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { encodeAttribution } from '@/lib/attribution'

const state = vi.hoisted(() => ({
  rpc: vi.fn(), insert: vi.fn(), signed: vi.fn(),
}))
vi.mock('@/lib/supabase/server', () => {
  const client = {
    rpc: state.rpc,
    from: () => ({ insert: state.insert }),
    storage: { from: () => ({ createSignedUrl: state.signed }) },
  }
  return { createServiceClient: () => client, createClient: async () => client }
})

import { POST as postLead } from '@/app/api/leads/route'
import { GET as shortLink } from '@/app/v/[code]/route'

const BROWSER = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'

function leadRequest(body: unknown, cookie?: string) {
  return new NextRequest('http://localhost/api/leads', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie: `al_attr=${cookie}` } : {}) },
  })
}

beforeEach(() => {
  state.rpc.mockReset().mockResolvedValue({ data: [{ lead_id: 'x', is_new: true }], error: null })
  state.insert.mockReset().mockResolvedValue({ error: null })
  state.signed.mockReset().mockResolvedValue({ data: { signedUrl: 'https://storage.example/signed' }, error: null })
})

describe('POST /api/leads', () => {
  it('stores the lead with cookie attribution and returns a short-lived signed URL', async () => {
    const response = await postLead(leadRequest(
      { email: 'Fan@Example.com', resource: 'autovideo-prompt-pack', consent: true },
      encodeAttribution({ video: '1', source: 'youtube', medium: 'video' }),
    ))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ url: 'https://storage.example/signed', expiresIn: 600 })
    expect(state.rpc).toHaveBeenCalledWith('ai_lesson_capture_lead', expect.objectContaining({
      target_email: 'fan@example.com', target_resource: 'autovideo-prompt-pack', target_video: '1', target_source: 'youtube',
    }))
    expect(state.signed).toHaveBeenCalledWith('autovideo-prompt-pack/autovideo-prompt-pack-v1.md', 600, { download: 'ai-short-video-prompt-pack-v1.md' })
  })

  it('rejects missing consent, unknown resources and malformed bodies without touching the DB', async () => {
    expect((await postLead(leadRequest({ email: 'a@b.co', resource: 'autovideo-prompt-pack', consent: false }))).status).toBe(400)
    expect((await postLead(leadRequest({ email: 'a@b.co', resource: 'does-not-exist', consent: true }))).status).toBe(404)
    expect((await postLead(new NextRequest('http://localhost/api/leads', { method: 'POST', body: '{' }))).status).toBe(400)
    expect(state.rpc).not.toHaveBeenCalled()
  })

  it('gives bots a fake success with no URL and no write', async () => {
    const response = await postLead(leadRequest({ email: 'a@b.co', resource: 'autovideo-prompt-pack', consent: true, website: 'x' }))
    expect(await response.json()).toEqual({ ok: true })
    expect(state.rpc).not.toHaveBeenCalled()
  })

  it('returns 503 when storage or DB fails', async () => {
    state.rpc.mockResolvedValueOnce({ data: null, error: { message: 'down' } })
    expect((await postLead(leadRequest({ email: 'a@b.co', resource: 'autovideo-prompt-pack', consent: true }))).status).toBe(503)
    state.signed.mockResolvedValueOnce({ data: null, error: { message: 'missing' } })
    expect((await postLead(leadRequest({ email: 'a@b.co', resource: 'autovideo-prompt-pack', consent: true }))).status).toBe(503)
  })
})

describe('GET /v/[code]', () => {
  const call = (url: string, ua = BROWSER) => {
    const code = new URL(url).pathname.split('/').pop()!
    return shortLink(new NextRequest(url, { headers: { 'user-agent': ua } }), { params: Promise.resolve({ code }) })
  }

  it('records the click, sets attribution and redirects to the note page', async () => {
    const response = await call('http://localhost/v/1?s=yt')
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/videos/ai-short-video-factory')
    expect(state.insert).toHaveBeenCalledWith({ video_code: '1', utm_source: 'youtube', utm_campaign: null })
    expect(response.cookies.get('al_attr')?.value).toBe(encodeAttribution({ video: '1', source: 'youtube', medium: 'video', landing: '/videos/ai-short-video-factory' }))
  })

  it('does not count crawlers and sends unknown codes to the video list', async () => {
    await call('http://localhost/v/1', 'facebookexternalhit/1.1')
    expect(state.insert).not.toHaveBeenCalled()
    const response = await call('http://localhost/v/999')
    expect(response.headers.get('location')).toBe('http://localhost/videos')
  })
})
