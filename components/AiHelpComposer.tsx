'use client'

import { useId, useState } from 'react'
import { ArrowRight, Check, Copy, Sparkles } from 'lucide-react'
import { buildHelpBrief } from '@/lib/ai-help-brief'

export default function AiHelpComposer({ lessonTitle }: { lessonTitle: string }) {
  const id = useId()
  const [goal, setGoal] = useState('')
  const [attempted, setAttempted] = useState('')
  const [observed, setObserved] = useState('')
  const [brief, setBrief] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [copying, setCopying] = useState(false)

  function update(setter: (value: string) => void, value: string) {
    setter(value)
    setBrief(null)
    setStatus('')
  }

  async function copy() {
    if (!brief) return
    setCopying(true)
    try {
      await navigator.clipboard.writeText(brief)
      setStatus('已複製。可貼到你使用的 AI 工具繼續除錯。')
    } catch {
      setStatus('無法存取剪貼簿，請在下方手動選取求助單。')
    } finally {
      setCopying(false)
    }
  }

  return (
    <section aria-label="AI 求助單整理器" className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Sparkles size={16} className="text-brand-700" aria-hidden="true" />AI 求助單</h2>
        <span className="text-[10px] text-gray-500">只在本頁整理</span>
      </div>
      <form className="space-y-4 p-5" onSubmit={(event) => {
        event.preventDefault()
        const result = buildHelpBrief({ lessonTitle, goal, attempted, observed })
        setBrief(result)
        setStatus(result ? '求助單已整理好，請確認內容後再複製。' : '請填寫目標與實際結果。')
      }}>
        <div>
          <label htmlFor={`${id}-goal`} className="mb-2 block text-xs font-semibold text-gray-700">想完成什麼？ <span className="font-normal text-gray-500">必填</span></label>
          <input id={`${id}-goal`} value={goal} onChange={(event) => update(setGoal, event.target.value)} required maxLength={500} placeholder="例如：讓課程首頁在本機開啟" className="min-h-11 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-gray-900" />
        </div>
        <div>
          <label htmlFor={`${id}-attempted`} className="mb-2 block text-xs font-semibold text-gray-700">已經試過的操作 <span className="font-normal text-gray-500">選填</span></label>
          <input id={`${id}-attempted`} value={attempted} onChange={(event) => update(setAttempted, event.target.value)} maxLength={1000} placeholder="例如：在專案目錄執行 npm run dev" className="min-h-11 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-gray-900" />
        </div>
        <div>
          <label htmlFor={`${id}-observed`} className="mb-2 block text-xs font-semibold text-gray-700">實際結果或錯誤訊息 <span className="font-normal text-gray-500">必填</span></label>
          <textarea id={`${id}-observed`} value={observed} onChange={(event) => update(setObserved, event.target.value)} required maxLength={4000} rows={3} placeholder="例如：終端機顯示 Missing script: dev" className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-gray-900" />
          <p className="mt-2 text-[11px] leading-5 text-gray-500">請先移除錯誤訊息裡的密碼、金鑰與個人資料。</p>
        </div>
        <button type="submit" disabled={!goal.trim() || !observed.trim()} className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#1c343b] px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40">整理成 AI 求助單<ArrowRight size={15} aria-hidden="true" /></button>
        {brief && <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor={`${id}-result`} className="flex items-center gap-2 text-xs font-semibold text-emerald-900"><Check size={14} aria-hidden="true" />整理結果</label>
            <button type="button" onClick={() => void copy()} disabled={copying} className="flex min-h-11 items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 text-xs font-medium text-emerald-900"><Copy size={13} aria-hidden="true" />{copying ? '複製中…' : '複製求助單'}</button>
          </div>
          <textarea id={`${id}-result`} readOnly value={brief} rows={10} className="w-full resize-y rounded border border-emerald-100 bg-white p-3 text-xs leading-6 text-gray-800" />
        </div>}
        <p role="status" className="text-xs leading-5 text-gray-600">{status}</p>
      </form>
    </section>
  )
}
