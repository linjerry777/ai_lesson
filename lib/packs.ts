// Copy-paste packs are delivered as a web page. The content lives as JSON in the
// private `ai-lesson-downloads` bucket (source: the private jerry-ai-kits repo), so
// this public repo never contains the paid text.
import { createServiceClient } from '@/lib/supabase/server'
import { DOWNLOAD_BUCKET } from '@/lib/leads'

export interface PackItem {
  name: string
  when: string
  prompt: string
  tip?: string
  /** What the AI typically replies (collapsible). */
  example?: string
  /** Course levels: what success looks like, and a prompt to paste when stuck. */
  success?: string[]
  rescue?: string
}
export interface Pack {
  slug: string
  version: string
  /** 'course' packs are step-by-step levels for Claude Code; default is a prompt pack for any chat AI. */
  kind?: 'pack' | 'course'
  title: string
  intro: string
  quickstart: string[]
  /** Where the example replies came from (shown once near the top). */
  exampleNote?: string
  /** Buttons under the quickstart (defaults to ChatGPT / Gemini / Claude). */
  links?: { name: string; url: string }[]
  sections: { title: string; items: PackItem[] }[]
}

export function isPack(value: unknown): value is Pack {
  const pack = value as Pack
  return Boolean(pack && typeof pack.title === 'string' && Array.isArray(pack.quickstart) && Array.isArray(pack.sections) &&
    pack.sections.every(section => typeof section.title === 'string' && Array.isArray(section.items) &&
      section.items.every(item => typeof item.name === 'string' && typeof item.prompt === 'string')))
}

export async function loadPack(path: string): Promise<Pack | null> {
  const db = createServiceClient()
  const { data, error } = await db.storage.from(DOWNLOAD_BUCKET).download(path)
  if (error || !data) {
    console.error('[packs] download failed')
    return null
  }
  try {
    const parsed: unknown = JSON.parse(await data.text())
    return isPack(parsed) ? parsed : null
  } catch {
    return null
  }
}
