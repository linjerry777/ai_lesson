'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** Render 【placeholders】 as highlighted chips so first-timers see what to replace. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(【[^】]*】)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('【') ? (
          <mark key={i} className="rounded bg-[#ffd6e3] px-1 font-bold text-[#b0124a]">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/** One copy-paste prompt: what it is for, the prompt, one big copy button and a tip. */
export default function PromptCard({ index, name, when, prompt, tip }: { index: string; name: string; when?: string; prompt: string; tip?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setState('done')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 2500)
  }

  return (
    <article className="border-2 border-[var(--ink)] bg-[var(--white)] shadow-[5px_5px_0_var(--ink)]">
      <header className="flex items-start justify-between gap-3 border-b-2 border-[var(--ink)] px-4 py-3 sm:px-5">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--ink-2)]">#{index}</p>
          <h3 className="text-lg font-black leading-snug">{name}</h3>
          {when && <p className="mt-0.5 text-sm text-[var(--ink-2)]">什麼時候用：{when}</p>}
        </div>
      </header>
      <pre className="whitespace-pre-wrap break-words px-4 py-4 font-[family-name:var(--font-tc)] text-[15px] leading-7 sm:px-5">
        <Highlighted text={prompt} />
      </pre>
      <div className="border-t-2 border-[var(--ink)] p-3 sm:px-5">
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={`flex min-h-12 w-full items-center justify-center gap-2 text-[15px] font-black transition ${state === 'done' ? 'bg-[#0e9f6e] text-white' : 'bg-[var(--ink)] text-[var(--paper)] hover:bg-[#333]'}`}
        >
          {state === 'done' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {state === 'done' ? '已複製！貼到 ChatGPT 吧' : state === 'failed' ? '複製失敗，請長按文字手動複製' : '複製這段指令'}
        </button>
        {tip && <p className="mt-3 text-sm leading-6 text-[var(--ink-2)]">💡 {tip}</p>}
      </div>
    </article>
  )
}
