import { CheckCircle, Infinity, RefreshCw, Shield, Sparkles, Video } from 'lucide-react'

const products = [
  {
    slug: 'claude-code',
    eyebrow: '入門主課',
    title: 'Claude Code 實戰課',
    description: '從零做出可部署的 SaaS：登入、資料庫、付款、部署與 debug 流程。',
    price: 'NT$990',
    original: 'NT$2,640',
    icon: Sparkles,
    href: '/api/checkout?product=claude-code&tier=self',
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
    original: 'NT$3,600',
    icon: Video,
    href: '/api/checkout?product=codex-remotion&tier=self',
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
  { icon: Shield, text: 'Stripe 安全付款', sub: '正式金流與 webhook' },
  { icon: RefreshCw, text: '7 天退款', sub: '不適合就退款' },
  { icon: Infinity, text: '永久存取', sub: '課程更新可回看' },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
            課程方案
          </p>
          <h2 className="mb-4 text-3xl font-black text-gray-900 sm:text-4xl">
            先學會把 AI 做成作品，再把作品做成系統
          </h2>
          <p className="text-gray-500">
            兩堂課走不同路線：一堂教你用 AI 寫出可部署產品，一堂教你做可重複生產的角色動畫內容流程。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.slug}
              className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-brand-100 bg-white shadow-xl shadow-brand-500/5"
            >
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
                  <p className="text-sm text-gray-400">
                    原價 <span className="line-through">{product.original}</span>
                    <span className="ml-2 font-semibold text-green-600">早鳥一次買斷</span>
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {product.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-brand-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={product.href}
                  className="block w-full rounded-xl bg-brand-500 px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
                >
                  立即取得課程
                </a>
              </div>
            </article>
          ))}
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
