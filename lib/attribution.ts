// Last-touch traffic attribution: which video / platform sent this visitor.
//
// Written by `/v/[code]` and by the proxy whenever a page is opened with utm_*
// params; read by the lead API. Everything is sanitized on the way in and out,
// because the cookie is client-controlled.

// Same rule as CODE_RE in lib/content.ts; kept local so the proxy doesn't load node:fs.
const CODE_RE = /^[a-z0-9]{1,16}$/

export const ATTRIBUTION_COOKIE = 'al_attr'
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30

export interface Attribution {
  video?: string
  source?: string
  medium?: string
  campaign?: string
  content?: string
  landing?: string
}

/** Short aliases that are easy to put in a pinned comment: /v/12?s=yt */
export const SOURCE_ALIASES: Record<string, string> = {
  yt: 'youtube', bili: 'bilibili', ig: 'instagram', th: 'threads', fb: 'facebook', tt: 'tiktok',
}

const TOKEN_RE = /^[a-z0-9._-]{1,64}$/

function token(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return TOKEN_RE.test(normalized) ? normalized : undefined
}
function landingPath(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.length > 200) return undefined
  return /^[A-Za-z0-9/_.-]+$/.test(value) ? value : undefined
}

export function sanitizeAttribution(input: Partial<Record<keyof Attribution, unknown>>): Attribution {
  const video = token(input.video)
  const source = token(input.source)
  const result: Attribution = {
    video: video && CODE_RE.test(video) ? video : undefined,
    source: source ? SOURCE_ALIASES[source] ?? source : undefined,
    medium: token(input.medium),
    campaign: token(input.campaign),
    content: token(input.content),
    landing: landingPath(input.landing),
  }
  for (const key of Object.keys(result) as (keyof Attribution)[]) if (result[key] === undefined) delete result[key]
  return result
}

/** Pull attribution from a URL's query string. Returns null when nothing is tagged. */
export function attributionFromSearch(params: URLSearchParams, pathname: string): Attribution | null {
  const tagged = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'v', 's'].some(key => params.has(key))
  if (!tagged) return null
  const result = sanitizeAttribution({
    video: params.get('v'),
    source: params.get('utm_source') ?? params.get('s'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    landing: pathname,
  })
  return Object.keys(result).length > 1 || !result.landing ? result : null
}

export function encodeAttribution(value: Attribution): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

export function decodeAttribution(raw: string | undefined | null): Attribution {
  if (!raw || raw.length > 1024) return {}
  try {
    const parsed: unknown = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    return typeof parsed === 'object' && parsed !== null ? sanitizeAttribution(parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export const attributionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: ATTRIBUTION_MAX_AGE,
}

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|whatsapp|telegram|discord|line-poker|headless/i

export function isLikelyBot(userAgent: string | null) {
  return !userAgent || BOT_RE.test(userAgent)
}
