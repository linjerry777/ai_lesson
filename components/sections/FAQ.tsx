'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '需要什麼程度的程式基礎才能上這堂課？',
    a: '建議至少有基礎程式能力（能讀懂程式碼的大致邏輯、用過 npm/git 等工具即可）。本課程針對「有一定開發經驗但想用 AI 大幅提升效率」的工程師設計，不適合完全零基礎的學習者。',
  },
  {
    q: '課程總共多長？學習節奏怎麼安排？',
    a: '課程共 6+ 小時，包含 40+ 個單元。每個單元約 8–15 分鐘，可以按照自己的節奏學習。建議搭配實作進行，邊學邊做效果最好。購買後永久觀看，不必擔心時間壓力。',
  },
  {
    q: '這堂課和市面上其他 Claude Code 課程有什麼不同？',
    a: '大多數課程是「工具功能大全」——教你每個按鈕怎麼按。本課程的核心是「方法論」——教你用 AI 完成一件真實的事情的完整流程。從架構設計、Context 設計、到 MCP/Hook/Sub-Agent 高階應用，每個技術點都放在「你如何用 AI 完成一件事」的脈絡裡。',
  },
  {
    q: '有退費政策嗎？',
    a: '有。購買後 7 天內，如果你還沒有觀看超過 20% 的內容，可以申請全額退費，無需任何理由。我們對課程品質有信心，這個保證是真的。',
  },
  {
    q: '課程內容會跟著 Claude Code 更新嗎？',
    a: '會。Claude Code 本身持續演進，課程內容也會跟著更新。購買後可以免費獲得所有未來新增或更新的內容，不需要再付費。',
  },
  {
    q: '購買後怎麼觀看課程？支援哪些裝置？',
    a: '購買完成後，用購課時的 Email 登入帳號即可立即開始觀看所有課程內容。支援手機、平板、桌機等各種裝置，隨時隨地都能學習。',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            常見問題
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            你可能想問的問題
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          還有其他問題？{' '}
          <a href="mailto:contact@example.com" className="text-brand-500 hover:underline">
            聯絡我們
          </a>
        </p>
      </div>
    </section>
  )
}
