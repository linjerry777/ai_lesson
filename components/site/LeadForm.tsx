'use client'

import { useState } from 'react'
import { ArrowRight, Download, Loader2 } from 'lucide-react'
import { CONSENT_TEXT } from '@/lib/leads'

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; url: string }

interface Props {
  resource: string
  title: string
  submitLabel?: string
}

/** Email-gated download (POST /api/leads → short-lived signed URL). Ink-on-paper style. */
export default function LeadForm({ resource, title, submitLabel = '免費取得' }: Props) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!consent) { setState({ kind: 'error', message: '請勾選同意後再下載' }); return }
    setState({ kind: 'sending' })
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resource, consent, website }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || typeof data.url !== 'string') {
        setState({ kind: 'error', message: typeof data.error === 'string' ? data.error : '暫時無法處理，請稍後再試' })
        return
      }
      setState({ kind: 'ready', url: data.url })
      window.location.assign(data.url)
    } catch {
      setState({ kind: 'error', message: '網路連線失敗，請稍後再試' })
    }
  }

  if (state.kind === 'ready') {
    return (
      <div className="border-2 border-[var(--ink)] bg-[var(--white)] p-5" role="status">
        <p className="text-sm font-bold">已開始下載「{title}」</p>
        <p className="mt-2 text-xs leading-6 text-[var(--ink-2)]">沒有自動下載的話，點下面的按鈕。連結 10 分鐘內有效；之後用同一個 Email 再填一次即可重新下載新版。</p>
        <a href={state.url} className="mt-4 inline-flex min-h-11 items-center gap-2 bg-[var(--ink)] px-5 text-sm font-bold text-[var(--paper)]">
          <Download size={16} aria-hidden="true" />下載檔案
        </a>
      </div>
    )
  }

  const sending = state.kind === 'sending'
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div className="flex flex-col gap-2.5">
        <label className="sr-only" htmlFor={`lead-email-${resource}`}>Email</label>
        <input
          id={`lead-email-${resource}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="你的 Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="min-h-12 w-full min-w-0 border-2 border-[var(--ink)] bg-[var(--white)] px-4 text-base placeholder:text-[#8d887c] focus:outline-none focus:ring-4 focus:ring-[#121212]/15"
        />
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] px-7 text-sm font-bold tracking-[.06em] text-[var(--paper)] shadow-[4px_4px_0_var(--red)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--red)] disabled:opacity-60"
        >
          {sending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {sending ? '處理中…' : submitLabel}
          {!sending && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
        </button>
      </div>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={event => setWebsite(event.target.value)} className="hidden" />
      <label className="flex items-start gap-2.5 text-xs leading-6 text-[var(--ink-2)]">
        <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1.5 h-4 w-4 shrink-0 accent-[#121212]" />
        <span>{CONSENT_TEXT}<a href="/privacy" className="ml-1 text-[var(--ink)] underline underline-offset-2">隱私權政策</a></span>
      </label>
      {state.kind === 'error' && <p className="text-sm font-medium text-[#c4291f]" role="alert">{state.message}</p>}
    </form>
  )
}
