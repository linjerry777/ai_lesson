'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '完全不會寫程式可以買嗎？',
    a: '可以先不要買。請先上免費的「AI 實作入門預備課」，完成最後的 checklist：能打開 terminal、知道 Git / Node / env 是什麼、能貼完整錯誤訊息給 AI。五項都能打勾，再買 Claude Code 主課會比較穩。',
  },
  {
    q: '我需要什麼程度才比較適合？',
    a: '你不需要是資深工程師，但最好知道網站是由前端、後端、資料庫、部署組成；知道什麼是 terminal、git、環境變數；願意照著 checklist 一步一步做。這堂課會教你怎麼讓 Claude Code 幫你完成大部分實作，但你仍然要能判斷每一步是否成功。',
  },
  {
    q: '課程總共包含什麼？',
    a: '目前有三段：免費預備課、Claude Code 產品實戰主課，以及 Codex + Image2 + Remotion 進階工作流。Claude Code 主課是 8 個階段的純文字 + 截圖實戰手冊，包含 50+ 個 step-by-step 操作步驟、可直接貼給 AI 的指令、每章驗收清單，以及 Google 登入、Stripe webhook、Vercel env 等常見錯誤排查。',
  },
  {
    q: '為什麼不是影片課？',
    a: '因為這類工具與後台 UI 變很快。文字課可以搜尋、複製、更新，也更適合跟著實作。之後可能會補短影片導覽，但主課程會維持文字實戰手冊，讓內容比較不容易過期。',
  },
  {
    q: '這堂課最後會做出什麼？',
    a: '你會做出一個可部署的課程/數位產品網站：有 Landing Page、Google 登入、Stripe Checkout、Webhook、購買紀錄表、Dashboard 解鎖，以及 Vercel 部署流程。這不是玩具 Todo List，而是一個可以拿去改成自己產品的模板。',
  },
  {
    q: '如果 Claude 生成的程式碼和課程不一樣怎麼辦？',
    a: '這是 AI 實作課一定會遇到的狀況，所以課程補了每章驗收點與急救格式。你不是背程式碼，而是學會檢查結果：登入是否成功、webhook 是否送達、資料庫是否寫入、線上環境是否指向正確網址。',
  },
  {
    q: '會教 MCP、Hook、Sub-Agent 嗎？',
    a: '這些會作為 AI 工作流概念提到，但本課程的核心不是高階工具大全，而是把一個可收款網站做出來。未來若要做進階 Agent 工作流，會比較適合拆成第二套課或附錄。',
  },
  {
    q: '購買後如何開始？',
    a: '如果你還不確定程度，先登入免費預備課。購買完成後，用購課時的 Email 登入即可在 Dashboard 切換已取得的課程。建議先從免費預備課或 ch00 準備工具開始，照每章最後的驗收清單確認完成，再進下一章。',
  },
  {
    q: 'Claude Code 主課和 Remotion 進階課要一起買嗎？',
    a: '不用。想做網站、接案模板、小產品，先買 Claude Code 主課。想做 AI 內容生產、角色動畫、長片工作流，再買 Codex + Image2 + Remotion。兩門課是不同路線，不是強迫加購。',
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
            先確認這堂課適不適合你
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
          <a href="mailto:donutai08@gmail.com" className="text-brand-500 hover:underline">
            直接來信
          </a>
        </p>
      </div>
    </section>
  )
}
