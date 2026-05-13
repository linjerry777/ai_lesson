import { CheckCircle, Zap } from 'lucide-react'

const bullets = [
  '從 Landing Page 到 Google 登入、Stripe 付款、Vercel 部署',
  '每章都有「做到這裡應該看到什麼」驗收清單',
  '附錯誤排查格式，讓你知道怎麼把問題貼給 Claude 修',
  '不是零基礎神課，而是帶你做出一個真的能收款的產品網站',
]

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} className="fill-brand-500 text-brand-500" />
              適合有一點工程基礎，想用 AI 真的交付產品的人
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              用 Claude Code
              <br />
              <span className="text-brand-500">做出可收款網站</span>
              <br />
              而不是只看工具教學
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              這是一堂文字版實戰課。你會照著流程，用 Claude Code 建出一個
              <strong className="text-gray-900"> 有登入、金流、購買紀錄、Dashboard、部署流程 </strong>
              的真實產品網站。遇到 bug 也不跳過，直接把 debug 方法放進課程。
            </p>

            <ul className="space-y-3 mb-8">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-brand-500 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-gray-700 text-sm">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">NT$990</span>
                  <span className="text-gray-400 line-through text-lg">NT$2,640</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">文字實戰版，購買後永久存取</p>
              </div>
              <a
                href="#pricing"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-600/25"
              >
                開始學習
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>8 階段完整流程</span>
              <span className="text-gray-300">|</span>
              <span>50+ 操作步驟</span>
              <span className="text-gray-300">|</span>
              <span>每章驗收清單</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-orange-100 rounded-3xl blur-3xl opacity-60" />
            <div className="relative bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-500 text-xs font-mono">claude - project workspace</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">
                    claude <span className="text-brand-400">&quot;幫我建立一個賣線上課程的網站，要有 Google 登入和 Stripe 付款&quot;</span>
                  </span>
                </div>
                <div className="text-gray-500 text-xs pl-4">分析需求，規劃 Next.js + Supabase + Stripe...</div>
                <div className="text-gray-500 text-xs pl-4">建立 Landing Page 與價格區塊...</div>
                <div className="text-gray-500 text-xs pl-4">串接 Google OAuth callback...</div>
                <div className="text-gray-500 text-xs pl-4">建立 Stripe Checkout API...</div>
                <div className="text-gray-500 text-xs pl-4">寫入 purchases 表，解鎖 dashboard...</div>
                <div className="text-gray-500 text-xs pl-4">部署到 Vercel，補線上 env 與 webhook...</div>
                <div className="mt-3 text-green-400 text-xs">
                  done: first paid product workflow is live
                </div>
                <div className="mt-1 text-gray-500 text-xs">
                  next: run the chapter checklist before shipping
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-500">課程定位</p>
              <p className="text-2xl font-black text-brand-500">實戰交付</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
