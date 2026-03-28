'use client'

import { useState } from 'react'
import { Copy, Check, AlertTriangle, Lightbulb } from 'lucide-react'

export interface Step {
  title: string
  body?: string
  code?: { lang: string; content: string }
  warning?: string
  tip?: string
  screenshot?: string   // 之後放實際截圖檔名
}

function CodeBlock({ lang, content }: { lang: string; content: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span className="text-[10px] font-mono text-gray-400 uppercase">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors">
          {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
          {copied ? '已複製' : '複製'}
        </button>
      </div>
      <pre className="p-4 bg-gray-950 text-sm text-gray-200 overflow-x-auto leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  )
}

export default function StepGuide({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 mb-6 text-sm">📋 操作步驟</h2>
      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Step number */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center mt-0.5">
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>

              {step.body && (
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{step.body}</p>
              )}

              {step.code && (
                <CodeBlock lang={step.code.lang} content={step.code.content} />
              )}

              {step.warning && (
                <div className="mt-3 flex gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3.5">
                  <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-xs leading-relaxed">{step.warning}</p>
                </div>
              )}

              {step.tip && (
                <div className="mt-3 flex gap-2.5 bg-brand-50 border border-brand-100 rounded-xl p-3.5">
                  <Lightbulb size={15} className="text-brand-500 flex-shrink-0 mt-0.5" />
                  <p className="text-brand-700 text-xs leading-relaxed">{step.tip}</p>
                </div>
              )}

              {step.screenshot && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={`/screenshots/${step.screenshot}`}
                    alt={step.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
