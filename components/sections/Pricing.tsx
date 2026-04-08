import { CheckCircle, Shield, RefreshCw, Infinity } from 'lucide-react'

const includes = [
  '7 章完整課程，真實建站全過程',
  'Landing Page → 登入 → 付款 → 部署，一條龍',
  'Google OAuth 完整串接與踩坑紀錄',
  '金流串接完整實作 + 台灣付款方案踩坑',
  'Vercel 自動部署 CI/CD 流程',
  '完整 Debug 實錄：500、session 消失、env 地獄',
  '可複用架構模板，下一個專案直接套',
  '每章附詳細操作步驟 + 可複製 Claude 指令',
  '永久觀看，未來更新免費獲取',
]

const badges = [
  { icon: Shield, text: '安全付款', sub: 'Gumroad 加密保護' },
  { icon: RefreshCw, text: '7 天退費', sub: '未觀看全額退款' },
  { icon: Infinity, text: '永久觀看', sub: '課程持續更新' },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            立即開始
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            現在加入，開始你的 AI 工程師之旅
          </h2>
          <p className="text-gray-500">一次投資，永久提升你的工程師競爭力。</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="border-2 border-brand-500 rounded-3xl overflow-hidden shadow-xl shadow-brand-500/10">
            {/* Top banner */}
            <div className="bg-brand-500 text-center py-3">
              <p className="text-white text-sm font-semibold">
                🔥 限時早鳥優惠 · 即將恢復原價
              </p>
            </div>

            <div className="bg-white p-8">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-3 mb-1">
                  <span className="text-5xl font-black text-gray-900">£66</span>
                  <span className="text-lg text-gray-400">≈ NT$2,640</span>
                </div>
                <p className="text-gray-400">
                  原價 <span className="line-through">£125</span>
                  <span className="ml-2 text-green-600 font-semibold">限時優惠</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">一次買斷，永久觀看</p>
              </div>

              {/* Includes */}
              <ul className="space-y-3 mb-8">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/api/checkout"
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-center font-bold py-4 px-6 rounded-xl text-base transition-colors shadow-lg shadow-brand-500/25"
              >
                立即購課 →
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                點擊後跳轉至安全付款頁面，支援所有信用卡
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-8">
            {badges.map((badge) => (
              <div key={badge.text} className="text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <badge.icon size={18} className="text-gray-500" />
                </div>
                <p className="text-xs font-semibold text-gray-700">{badge.text}</p>
                <p className="text-xs text-gray-400">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
