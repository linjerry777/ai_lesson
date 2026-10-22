// Content model for video notes and free resources.
//
// Source of truth: `content/videos/*.json` and `content/free/*.json`.
// The video pipeline (or Claude) writes these files; see docs/content-contract.md.
// Every file is validated on load so a bad file fails the build, not a visitor.

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { getProduct } from './products'
import { CHANNELS, type PlatformKey } from './site'

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const CODE_RE = /^[a-z0-9]{1,16}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/
const BVID_RE = /^BV[0-9A-Za-z]{10}$/

export type ContentStatus = 'draft' | 'published'

export interface VideoNote {
  slug: string
  code: string
  title: string
  channel: string
  publishedAt: string
  status: ContentStatus
  summary: string
  /** youtube = 11-char video id, bilibili = BV id, others = full https URLs. */
  platforms: Partial<Record<PlatformKey, string>>
  sections: { heading: string; body: string }[]
  prompts: { title: string; text: string }[]
  tools: { name: string; url: string; note?: string }[]
  /** 'free' → a free resource (email-gated download); 'product' → a shop product page. */
  cta: { kind: 'free' | 'product'; slug: string; pitch?: string }
}

export interface FreeResource {
  slug: string
  title: string
  summary: string
  status: ContentStatus
  format: string
  bullets: string[]
  /** Object path inside the private `ai-lesson-downloads` bucket. */
  file: { path: string; downloadName: string }
}

export class ContentError extends Error {}

type Raw = Record<string, unknown>

function fail(file: string, message: string): never {
  throw new ContentError(`${file}: ${message}`)
}
function str(raw: Raw, key: string, file: string, max = 2000): string {
  const value = raw[key]
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(file, `"${key}" must be a non-empty string ≤ ${max} chars`)
  return value.trim()
}
function optStr(raw: Raw, key: string, file: string, max = 2000): string | undefined {
  return raw[key] === undefined ? undefined : str(raw, key, file, max)
}
function arr(raw: Raw, key: string, file: string): Raw[] {
  const value = raw[key] ?? []
  if (!Array.isArray(value) || value.some(item => typeof item !== 'object' || item === null)) fail(file, `"${key}" must be an array of objects`)
  return value as Raw[]
}
function status(raw: Raw, file: string): ContentStatus {
  if (raw.status !== 'draft' && raw.status !== 'published') fail(file, '"status" must be draft or published')
  return raw.status
}
function httpsUrl(value: string, file: string, key: string) {
  try {
    if (new URL(value).protocol === 'https:') return value
  } catch { /* fall through */ }
  fail(file, `"${key}" must be an https URL`)
}

export function parseVideo(input: unknown, file: string): VideoNote {
  if (typeof input !== 'object' || input === null) fail(file, 'must be a JSON object')
  const raw = input as Raw
  const slug = str(raw, 'slug', file, 80)
  if (!SLUG_RE.test(slug)) fail(file, '"slug" must be kebab-case a-z0-9')
  const code = str(raw, 'code', file, 16).toLowerCase()
  if (!CODE_RE.test(code)) fail(file, '"code" must be 1–16 chars a-z0-9')
  const channel = str(raw, 'channel', file, 40)
  if (!CHANNELS.some(item => item.key === channel)) fail(file, `unknown channel "${channel}"`)
  const publishedAt = str(raw, 'publishedAt', file, 10)
  if (!DATE_RE.test(publishedAt) || Number.isNaN(Date.parse(publishedAt))) fail(file, '"publishedAt" must be YYYY-MM-DD')

  const platformsRaw = (raw.platforms ?? {}) as Raw
  if (typeof platformsRaw !== 'object' || Array.isArray(platformsRaw)) fail(file, '"platforms" must be an object')
  const platforms: VideoNote['platforms'] = {}
  for (const [key, value] of Object.entries(platformsRaw)) {
    if (value === '' || value === null) continue
    if (typeof value !== 'string') fail(file, `platforms.${key} must be a string`)
    if (key === 'youtube') {
      if (!YOUTUBE_ID_RE.test(value)) fail(file, 'platforms.youtube must be an 11-char video id')
    } else if (key === 'bilibili') {
      if (!BVID_RE.test(value)) fail(file, 'platforms.bilibili must be a BV id')
    } else if (['instagram', 'threads', 'facebook', 'tiktok'].includes(key)) {
      httpsUrl(value, file, `platforms.${key}`)
    } else fail(file, `unknown platform "${key}"`)
    platforms[key as PlatformKey] = value
  }

  const ctaRaw = raw.cta as Raw | undefined
  if (!ctaRaw || (ctaRaw.kind !== 'free' && ctaRaw.kind !== 'product')) fail(file, '"cta.kind" must be "free" or "product"')
  const ctaSlug = str(ctaRaw, 'slug', file, 80)

  return {
    slug, code, channel, publishedAt, status: status(raw, file),
    title: str(raw, 'title', file, 120),
    summary: str(raw, 'summary', file, 400),
    platforms,
    sections: arr(raw, 'sections', file).map(item => ({ heading: str(item, 'heading', file, 120), body: str(item, 'body', file, 4000) })),
    prompts: arr(raw, 'prompts', file).map(item => ({ title: str(item, 'title', file, 120), text: str(item, 'text', file, 6000) })),
    tools: arr(raw, 'tools', file).map(item => ({
      name: str(item, 'name', file, 80),
      url: httpsUrl(str(item, 'url', file, 500), file, 'tools.url'),
      note: optStr(item, 'note', file, 200),
    })),
    cta: { kind: ctaRaw.kind as 'free' | 'product', slug: ctaSlug, pitch: optStr(ctaRaw, 'pitch', file, 200) },
  }
}

export function parseFreeResource(input: unknown, file: string): FreeResource {
  if (typeof input !== 'object' || input === null) fail(file, 'must be a JSON object')
  const raw = input as Raw
  const slug = str(raw, 'slug', file, 80)
  if (!SLUG_RE.test(slug)) fail(file, '"slug" must be kebab-case a-z0-9')
  const bullets = raw.bullets
  if (!Array.isArray(bullets) || !bullets.length || bullets.some(item => typeof item !== 'string' || !item.trim())) fail(file, '"bullets" must be non-empty strings')
  const fileRaw = raw.file as Raw | undefined
  if (!fileRaw) fail(file, '"file" is required')
  const objectPath = str(fileRaw, 'path', file, 200)
  if (!/^[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(objectPath) || objectPath.includes('..')) fail(file, '"file.path" must look like <slug>/<filename>')
  const downloadName = str(fileRaw, 'downloadName', file, 120)
  if (!/^[A-Za-z0-9._-]+$/.test(downloadName)) fail(file, '"file.downloadName" must be ASCII a-z0-9._-')
  return {
    slug, status: status(raw, file),
    title: str(raw, 'title', file, 120),
    summary: str(raw, 'summary', file, 400),
    format: str(raw, 'format', file, 80),
    bullets: (bullets as string[]).map(item => item.trim()),
    file: { path: objectPath, downloadName },
  }
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

function readDir<T>(dir: string, parse: (raw: unknown, file: string) => T): T[] {
  const full = path.join(CONTENT_DIR, dir)
  return readdirSync(full)
    .filter(name => name.endsWith('.json'))
    .sort()
    .map(name => {
      const file = `content/${dir}/${name}`
      let raw: unknown
      try { raw = JSON.parse(readFileSync(path.join(full, name), 'utf8')) } catch { fail(file, 'invalid JSON') }
      return parse(raw, file)
    })
}

/** Cross-file checks: unique slugs/codes and CTA targets that exist. */
export function validateLibrary(videos: VideoNote[], resources: FreeResource[]) {
  const seen = new Set<string>()
  for (const video of videos) {
    for (const key of [`slug:${video.slug}`, `code:${video.code}`]) {
      if (seen.has(key)) throw new ContentError(`duplicate video ${key}`)
      seen.add(key)
    }
    if (video.cta.kind === 'product') {
      if (!getProduct(video.cta.slug)) throw new ContentError(`video ${video.slug}: cta product "${video.cta.slug}" is not in the shop`)
      continue
    }
    const target = resources.find(item => item.slug === video.cta.slug)
    if (!target) throw new ContentError(`video ${video.slug}: cta.slug "${video.cta.slug}" not found`)
    if (video.status === 'published' && target.status !== 'published') throw new ContentError(`video ${video.slug}: cta resource is not published`)
  }
  const resourceSlugs = new Set<string>()
  for (const resource of resources) {
    if (resourceSlugs.has(resource.slug)) throw new ContentError(`duplicate resource slug ${resource.slug}`)
    resourceSlugs.add(resource.slug)
  }
}

let cache: { videos: VideoNote[]; resources: FreeResource[] } | null = null

export function loadLibrary() {
  if (cache && process.env.NODE_ENV === 'production') return cache
  const videos = readDir('videos', parseVideo)
  const resources = readDir('free', parseFreeResource)
  validateLibrary(videos, resources)
  videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug))
  cache = { videos, resources }
  return cache
}

export function getPublishedVideos() {
  return loadLibrary().videos.filter(video => video.status === 'published')
}
export function getVideo(slug: string) {
  return getPublishedVideos().find(video => video.slug === slug) ?? null
}
export function getVideoByCode(code: string) {
  const normalized = code.toLowerCase()
  return getPublishedVideos().find(video => video.code === normalized) ?? null
}
export function getPublishedResources() {
  return loadLibrary().resources.filter(resource => resource.status === 'published')
}
export function getResource(slug: string) {
  return getPublishedResources().find(resource => resource.slug === slug) ?? null
}
