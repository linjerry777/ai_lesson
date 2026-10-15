import { SITE } from './site'

export const DOWNLOAD_BUCKET = 'ai-lesson-downloads'
export const SIGNED_URL_SECONDS = 600

/** Stored verbatim with each lead so we can prove what the person agreed to. */
export const CONSENT_TEXT = `我同意${SITE.name}以此 Email 寄送這份資源，以及後續的 AI 工作流與課程更新；可隨時取消訂閱。`

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null
}

export interface LeadRequest { email: string; resource: string }

export type LeadParseResult = { ok: true; value: LeadRequest } | { ok: false; error: string; bot?: boolean }

export function parseLeadRequest(body: unknown): LeadParseResult {
  if (typeof body !== 'object' || body === null) return { ok: false, error: '格式錯誤' }
  const raw = body as Record<string, unknown>
  // Honeypot: real visitors never see or fill this field.
  if (typeof raw.website === 'string' && raw.website.trim()) return { ok: false, error: '格式錯誤', bot: true }
  const email = normalizeEmail(raw.email)
  if (!email) return { ok: false, error: '請輸入有效的 Email' }
  if (raw.consent !== true) return { ok: false, error: '請勾選同意後再下載' }
  if (typeof raw.resource !== 'string' || !/^[a-z0-9-]{1,80}$/.test(raw.resource)) return { ok: false, error: '找不到這份資源' }
  return { ok: true, value: { email, resource: raw.resource } }
}
