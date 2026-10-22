import { describe, expect, it } from 'vitest'
import {
  ContentError, loadLibrary, parseFreeResource, parseVideo, validateLibrary, getVideoByCode,
} from '@/lib/content'
import {
  attributionFromSearch, decodeAttribution, encodeAttribution, isLikelyBot, sanitizeAttribution,
} from '@/lib/attribution'
import { normalizeEmail, parseLeadRequest } from '@/lib/leads'
import { isAdminEmail } from '@/lib/admin'

const video = {
  slug: 'demo-video', code: '7', title: 'Demo', channel: 'nailao', publishedAt: '2026-10-01', status: 'published',
  summary: 'summary', platforms: { youtube: 'dQw4w9WgXcQ', bilibili: 'BV1xx411c7mD' },
  sections: [{ heading: 'h', body: 'b' }], prompts: [{ title: 't', text: 'p' }],
  tools: [{ name: 'Git', url: 'https://git-scm.com/' }], cta: { kind: 'free', slug: 'pack' },
}
const resource = {
  slug: 'pack', title: 'Pack', summary: 's', status: 'published', format: 'MD', bullets: ['a'],
  file: { path: 'pack/pack-v1.md', downloadName: 'pack-v1.md' },
}

describe('content files', () => {
  it('every checked-in content file is valid and cross-referenced', () => {
    const { videos, resources } = loadLibrary()
    expect(videos.length).toBeGreaterThan(0)
    expect(resources.length).toBeGreaterThan(0)
    // Drafts are parsed and validated but never reachable from the site.
    for (const draft of videos.filter(video => video.status === 'draft')) expect(getVideoByCode(draft.code)).toBeNull()
  })

  it('parses a valid video and resource', () => {
    expect(parseVideo(video, 'v.json').platforms.youtube).toBe('dQw4w9WgXcQ')
    expect(parseFreeResource(resource, 'r.json').file.path).toBe('pack/pack-v1.md')
  })

  it.each([
    [{ slug: 'Bad Slug' }, 'slug'],
    [{ code: 'has space' }, 'code'],
    [{ channel: 'nope' }, 'channel'],
    [{ publishedAt: '2026/10/01' }, 'publishedAt'],
    [{ status: 'live' }, 'status'],
    [{ platforms: { youtube: 'https://youtu.be/x' } }, 'youtube'],
    [{ platforms: { instagram: 'http://insecure' } }, 'instagram'],
    [{ platforms: { myspace: 'https://x' } }, 'unknown platform'],
    [{ tools: [{ name: 'x', url: 'javascript:alert(1)' }] }, 'https'],
    [{ cta: { kind: 'course', slug: 'x' } }, 'cta'],
  ])('rejects invalid video %o', (patch, message) => {
    expect(() => parseVideo({ ...video, ...patch }, 'v.json')).toThrow(message)
  })

  it.each([
    [{ file: { path: '../secret', downloadName: 'a.md' } }],
    [{ file: { path: 'pack/a.md', downloadName: '中文.md' } }],
    [{ bullets: [] }],
  ])('rejects invalid resource %o', patch => {
    expect(() => parseFreeResource({ ...resource, ...patch }, 'r.json')).toThrow(ContentError)
  })

  it('rejects duplicate codes and missing or unpublished CTA targets', () => {
    const v = parseVideo(video, 'v.json')
    const r = parseFreeResource(resource, 'r.json')
    expect(() => validateLibrary([v, { ...v, slug: 'other' }], [r])).toThrow('duplicate video code')
    expect(() => validateLibrary([v], [])).toThrow('not found')
    expect(() => validateLibrary([v], [{ ...r, status: 'draft' }])).toThrow('not published')
    // A note can point at a shop product instead of a free resource.
    expect(() => validateLibrary([{ ...v, cta: { kind: 'product', slug: 'image-prompt-pack' } }], [])).not.toThrow()
    expect(() => validateLibrary([{ ...v, cta: { kind: 'product', slug: 'claude-code-course' } }], [])).toThrow('not in the shop')
  })
})

describe('attribution', () => {
  it('maps short source aliases and drops unsafe values', () => {
    expect(sanitizeAttribution({ video: '12', source: 'YT', medium: 'video', campaign: '<script>', landing: '//evil.com' }))
      .toEqual({ video: '12', source: 'youtube', medium: 'video' })
  })

  it('reads utm params and ignores untagged visits', () => {
    expect(attributionFromSearch(new URLSearchParams('utm_source=bili&utm_campaign=ep12'), '/free/pack'))
      .toEqual({ source: 'bilibili', campaign: 'ep12', landing: '/free/pack' })
    expect(attributionFromSearch(new URLSearchParams('q=1'), '/')).toBeNull()
    expect(attributionFromSearch(new URLSearchParams('utm_source=%3Cx%3E'), '/')).toBeNull()
  })

  it('round-trips through the cookie and tolerates tampering', () => {
    const value = { video: '3', source: 'threads' }
    expect(decodeAttribution(encodeAttribution(value))).toEqual(value)
    expect(decodeAttribution('not-base64-json')).toEqual({})
    expect(decodeAttribution(Buffer.from('{"video":"../x","source":"ok"}').toString('base64url'))).toEqual({ source: 'ok' })
  })

  it('flags crawlers and link previews', () => {
    expect(isLikelyBot('facebookexternalhit/1.1')).toBe(true)
    expect(isLikelyBot(null)).toBe(true)
    expect(isLikelyBot('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(false)
  })
})

describe('lead requests', () => {
  it('normalizes email and requires explicit consent', () => {
    expect(normalizeEmail('  Jerry@Example.COM ')).toBe('jerry@example.com')
    expect(normalizeEmail('nope')).toBeNull()
    expect(parseLeadRequest({ email: 'a@b.co', resource: 'pack', consent: true })).toEqual({ ok: true, value: { email: 'a@b.co', resource: 'pack' } })
    expect(parseLeadRequest({ email: 'a@b.co', resource: 'pack', consent: 'yes' })).toMatchObject({ ok: false })
    expect(parseLeadRequest({ email: 'a@b.co', resource: '../x', consent: true })).toMatchObject({ ok: false })
  })

  it('marks honeypot submissions as bots', () => {
    expect(parseLeadRequest({ email: 'a@b.co', resource: 'pack', consent: true, website: 'spam' })).toMatchObject({ ok: false, bot: true })
  })
})

describe('admin gate', () => {
  it('requires a confirmed, listed email', () => {
    expect(isAdminEmail('Jerry@x.com', true, 'a@b.com, jerry@x.com')).toBe(true)
    expect(isAdminEmail('jerry@x.com', false, 'jerry@x.com')).toBe(false)
    expect(isAdminEmail('other@x.com', true, 'jerry@x.com')).toBe(false)
    expect(isAdminEmail('jerry@x.com', true, '')).toBe(false)
  })
})
