'use client'

import { useState } from 'react'
import { Copy, Check, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react'

export interface Step {
  title: string
  body?: string
  link?: { text: string; url: string }   // 直接連到設定頁面
  claude?: string                         // 給 Claude 的 prompt
  code?: { lang: string; content: string }
  warning?: string
  tip?: string
  screenshot?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors flex-shrink-0"
    >
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? '已複製' : '複製'}
    </button>
  )
}

function CodeBlock({ lang, content }: { lang: string; content: string }) {
  return (
    <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span className="text-[10px] font-mono text-gray-400 uppercase">{lang}</span>
        <CopyButton text={content} />
      </div>
      <pre className="p-4 bg-gray-950 text-sm text-gray-200 overflow-x-auto leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  )
}

function ClaudePrompt({ content }: { content: string }) {
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-purple-200">
      <div className="flex items-center justify-between px-4 py-2 bg-purple-50 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">貼給 Claude 的指令</span>
        </div>
        <CopyButton text={content} />
      </div>
      <pre className="p-4 bg-white text-sm text-gray-800 overflow-x-auto leading-relaxed whitespace-pre-wrap font-sans">
        {content}
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
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center mt-0.5">
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>

              {step.body && (
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{step.body}</p>
              )}

              {step.link && (
                <a
                  href={step.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={11} />
                  {step.link.text}
                </a>
              )}

              {step.claude && <ClaudePrompt content={step.claude} />}

              {step.code && <CodeBlock lang={step.code.lang} content={step.code.content} />}

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
