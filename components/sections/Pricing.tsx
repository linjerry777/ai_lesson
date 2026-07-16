import { BookOpen, CheckCircle, FileSearch, Infinity, Shield, Sparkles, Video } from 'lucide-react'
import { resolveStripePriceId } from '@/lib/courses'

const products = [
  {
    slug: 'starter-free',
    eyebrow: '免費預備課',
    title: 'AI 實作入門預備課',
    description: '先補終端機、Git、env、專案結構與 AI 求救格式，再決定要不要進主課。',
    price: '免費',
    icon: BookOpen,
    href: '/login?next=%2Fdashboard%3Fcourse%3Dstarter-free',
    cta: '免費開始',
    badge: '先從這裡開始',
    tone: 'quiet',
    includes: [
      '4 章新手預備課',
      'Terminal、Node、Git、.env.local 基礎地圖',
      '看懂 app、components、lib 的專案分工',
      '遇到錯誤時可直接複製的 AI 求救格式',
      '適合完全新手先判斷自己要補哪些基礎',
    ],
  },
  {
    slug: 'claude-code',
    eyebrow: '入門主課',
    title: 'Claude Code 實戰課',
    description: '從零做出可部署的 SaaS：登入、資料庫、付款、部署與 debug 流程。',
    price: 'NT$990',
    icon: Sparkles,
    href: '/api/checkout?product=claude-code&tier=self',
    cta: '取得主課',
    badge: '最推薦',
    tone: 'featured',
    includes: [
      '8 章完整實作課程',
      'Landing page、Google OAuth、Supabase、Stripe、Vercel',
      'Windows 本機環境與 Claude Code 開發流程',
      '50+ step-by-step 操作與可直接貼上的 AI 指令',
      '適合想把 AI pair programming 變成可交付作品的人',
    ],
  },
  {
    slug: 'codex-remotion',
    eyebrow: '創作進階',
    title: 'Codex + Image2 + Remotion 角色動畫工作流',
    description: '把 Codex、Image2、CliRelay、Remotion 串成可重複生產的長片系統。',
    price: 'NT$1,490',
    icon: Video,
    href: '/api/checkout?product=codex-remotion&tier=self',
    cta: '取得進階課',
    badge: '進階路線',
    tone: 'quiet',
    includes: [
      '從題材、腳本、角色圖到分段 render 的完整流程',
      'Image2 圖生圖、reference 控制與安全區設計',
      'CliRelay OpenAI-compatible bridge 設定觀念',
      'Remotion 字幕、鏡頭、資訊卡、segment render 與 concat',
      '適合想做 YouTube 長片、角色動畫或 AI 內容工廠的人',
    ],
  },
]

const badges = [
  { icon: Shield, text: 'Stripe Sandbox', sub: '測試流程，不會扣款' },
  { icon: FileSearch, text: '文字實作手冊', sub: '可搜尋、複製與更新' },
  { icon: Infinity, text: '永久存取', sub: '課程更新可回看' },
]

export default function Pricing() {
  const isStripeSandbox = process.env.STRIPE_SECRET_KEY?.trim().startsWith('sk_test_') ?? false
  const paymentsEnabled = process.env.AI_LESSON_PAYMENTS_ENABLED === 'true'

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
            課程方案
          </p>
          <h2 className="mb-4 text-3xl font-black text-gray-900 sm:text-4xl">
            選一條你現在真的走得完的路線
          </h2>
          <p className="text-gray-500">
            完全新手先走免費預備課。想做產品網站，選 Claude Code 主課。已經能操作本機工具、想做 AI 影片工作流，再選進階課。
          </p>
          {!paymentsEnabled && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              目前可直接使用免費預備課；付費課已定價，但付款入口暫停，尚未開放正式收款。
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => {
            const isFree = product.slug === 'starter-free'
            const hasCheckout = isFree || (
              paymentsEnabled && Boolean(resolveStripePriceId(product.slug, 'self'))
            )
            const ctaLabel = isFree
              ? product.cta
              : hasCheckout && isStripeSandbox
                ? 'Sandbox 測試結帳'
                : product.cta

            return (
            <article
              key={product.slug}
              className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-white ${
                product.tone === 'featured'
                  ? 'border-brand-400 shadow-2xl shadow-brand-500/15'
                  : 'border-brand-100 shadow-xl shadow-brand-500/5'
              }`}
            >
              <div
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                  product.tone === 'featured'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-brand-600 ring-1 ring-brand-200'
                }`}
              >
                {product.badge}
              </div>
              <div className="flex items-center gap-3 border-b border-brand-100 bg-brand-50 px-8 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white">
                  <product.icon size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                    {product.eyebrow}
                  </p>
                  <h3 className="text-xl font-black text-gray-900">{product.title}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <p className="mb-6 text-sm leading-6 text-gray-500">{product.description}</p>

                <div className="mb-8">
                  <div className="mb-1 flex items-end gap-3">
                    <span className="text-5xl font-black text-gray-900">{product.price}</span>
                  </div>
                  {isFree ? (
                    <p className="text-sm font-semibold text-green-600">登入後立即閱讀</p>
                  ) : hasCheckout ? (
                    <p className="text-sm font-semibold text-amber-700">
                      {isStripeSandbox ? 'Sandbox 展示價，不會實際扣款' : '一次買斷'}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-gray-500">付款入口設定中</p>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {product.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-brand-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                {hasCheckout ? (
                  <a
                    href={product.href}
                    className="block w-full rounded-xl bg-brand-500 px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
                  >
                    {ctaLabel}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="block w-full cursor-not-allowed rounded-xl bg-gray-100 px-6 py-4 text-center text-base font-bold text-gray-500"
                  >
                    尚未開放
                  </span>
                )}
              </div>
            </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {badges.map((badge) => (
            <div key={badge.text} className="text-center">
              <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <badge.icon size={18} className="text-gray-500" />
              </div>
              <p className="text-xs font-semibold text-gray-700">{badge.text}</p>
              <p className="text-xs text-gray-400">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
