import { CheckCircle, Zap } from 'lucide-react'

const bullets = [
  '你現在看到的這個網站，是課程裡直接建出來的',
  'Google 登入 + Stripe 付款 + Vercel 部署，全部串好',
  '遇到的每個 bug、每個環境變數地獄，都在課程裡',
  '從零到上線，實際花了一個下午',
]

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} className="fill-brand-500 text-brand-500" />
              比市面上同類課程便宜 10%，內容還更實在
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              你現在看到的
              <br />
              <span className="text-brand-500">這個網站</span>
              <br />
              是 Claude Code 做的
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              不是 Todo List，不是假示範。是一個{' '}
              <strong className="text-gray-900">真的能收錢的課程銷售頁</strong>
              ——前後端 + 資料庫 + 登入 + 付款 + 部署。
              這個建站過程，就是整堂課的內容。
            </p>

            {/* Bullets */}
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

            {/* Price + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">NT$2,640</span>
                  <span className="text-gray-400 line-through text-lg">NT$5,000</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">一次買斷，永久觀看</p>
              </div>
              <a
                href="#pricing"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-600/25"
              >
                立即購課 →
              </a>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9 評分</span>
              </span>
              <span className="text-gray-300">|</span>
              <span>1,200+ 學員</span>
              <span className="text-gray-300">|</span>
              <span>🔒 7 天退費保證</span>
            </div>
          </div>

          {/* Right: Terminal mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-orange-100 rounded-3xl blur-3xl opacity-60" />
            <div className="relative bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-500 text-xs font-mono">claude — zsh</span>
              </div>
              {/* Terminal content */}
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-400">❯</span>
                  <span className="text-gray-300">
                    claude <span className="text-brand-400">&quot;幫我建立一個賣線上課程的網站，要有 Google 登入和 Stripe 付款&quot;</span>
                  </span>
                </div>
                <div className="text-gray-500 text-xs pl-4">● 分析需求，規劃 Next.js + Supabase + Stripe 架構...</div>
                <div className="text-gray-500 text-xs pl-4">● 建立 Landing Page 所有 section...</div>
                <div className="text-gray-500 text-xs pl-4">● 串接 Google OAuth 登入流程...</div>
                <div className="text-gray-500 text-xs pl-4">● 建立 Stripe Checkout API...</div>
                <div className="text-gray-500 text-xs pl-4">● 設定 Webhook + purchases 資料表...</div>
                <div className="text-gray-500 text-xs pl-4">● 部署到 Vercel...</div>
                <div className="mt-3 text-green-400 text-xs">
                  ✓ 完成！就是你現在看到的這個網站。
                </div>
                <div className="mt-1 text-gray-500 text-xs">
                  耗時 1 個下午 · 某些人要收 NT$2,940 才教這個
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-500">省下的時間</p>
              <p className="text-2xl font-black text-brand-500">數個月</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
