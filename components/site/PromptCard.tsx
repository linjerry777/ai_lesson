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

/**
 * Copy text, falling back to a hidden textarea where the Clipboard API is blocked
 * (IG / LINE in-app browsers, some embedded views). Returns whether it worked.
 */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    area.setSelectionRange(0, text.length)
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}

/** Small copy button for secondary prompts (the rescue prompt). */
function CopyText({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  async function copy() {
    // If both copy methods are blocked, the text is visible above and can be selected by hand.
    if (!(await copyText(text))) return
    setDone(true)
    window.setTimeout(() => setDone(false), 2500)
  }
  return (
    <button type="button" onClick={copy} aria-live="polite" className="mt-2 inline-flex min-h-10 items-center gap-1.5 border-2 border-[var(--ink)] bg-white px-3 text-sm font-black">
      {done ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{done ? '已複製' : label}
    </button>
  )
}

/** One copy-paste prompt: what it is for, the prompt, one big copy button and a tip. */
export default function PromptCard({ index, name, when, prompt, tip, example, exampleImage, success, rescue, target = 'ChatGPT' }: {
  index: string
  name: string
  when?: string
  prompt: string
  tip?: string
  example?: string
  exampleImage?: string
  success?: string[]
  rescue?: string
  /** Where the prompt gets pasted, for the "copied" message. */
  target?: string
}) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')

  async function copy() {
    const ok = await copyText(prompt)
    setState(ok ? 'done' : 'failed')
    window.setTimeout(() => setState('idle'), ok ? 2500 : 6000)
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
          {state === 'done' ? `已複製！貼到 ${target} 吧` : state === 'failed' ? '複製失敗，請長按文字手動複製' : '複製這段指令'}
        </button>
        {success && success.length > 0 && (
          <div className="mt-3 border-2 border-[#0e9f6e] bg-[#ecfdf5] px-3 py-2.5">
            <p className="text-sm font-black text-[#065f46]">✅ 成功長這樣</p>
            <ul className="mt-1 space-y-1 text-[14px] leading-6">
              {success.map(item => <li key={item}>□ {item}</li>)}
            </ul>
          </div>
        )}
        {tip && <p className="mt-3 text-sm leading-6 text-[var(--ink-2)]">💡 {tip}</p>}
        {exampleImage && (
          <figure className="mt-3 border border-[var(--ink)] bg-[#f3f0e8] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={exampleImage} alt={`${name} 實際畫出來的圖`} loading="lazy" className="w-full" />
            <figcaption className="mt-1.5 text-[12px] text-[var(--ink-2)]">實際丟進 AI 畫出來的圖（同一段指令，每次畫的都會不太一樣）</figcaption>
          </figure>
        )}
        {example && (
          <details className="group mt-3 border border-[var(--ink)] bg-[#f3f0e8]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-black">
              看 AI 回覆範例 <span className="font-mono text-xs transition group-open:rotate-45">＋</span>
            </summary>
            <pre className="whitespace-pre-wrap break-words border-t border-[var(--ink)] px-3 py-3 font-[family-name:var(--font-tc)] text-[13px] leading-6">{example}</pre>
          </details>
        )}
        {rescue && (
          <details className="group mt-3 border border-[var(--red)] bg-[#fff1f0]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-black text-[#b42318]">
              🆘 卡住救援 <span className="font-mono text-xs transition group-open:rotate-45">＋</span>
            </summary>
            <div className="border-t border-[var(--red)] px-3 py-3">
              <pre className="whitespace-pre-wrap break-words font-[family-name:var(--font-tc)] text-[13px] leading-6"><Highlighted text={rescue} /></pre>
              <CopyText text={rescue} label="複製救援指令" />
            </div>
          </details>
        )}
      </div>
    </article>
  )
}
