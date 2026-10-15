'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyButton({ text, label = '複製' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState('done')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button type="button" onClick={copy} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-medium text-[#d9d5cc] transition hover:border-[#f0a65a] hover:text-[#f0a65a]" aria-live="polite">
      {state === 'done' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {state === 'done' ? '已複製' : state === 'failed' ? '請手動選取複製' : label}
    </button>
  )
}
