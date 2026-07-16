import Image from 'next/image'
import { BookOpen, Bot, CreditCard, PanelsTopLeft } from 'lucide-react'

const credentials = [
  { icon: PanelsTopLeft, text: 'Next.js、Supabase、Vercel 全端實作' },
  { icon: CreditCard, text: 'Stripe Checkout 與 Webhook 串接' },
  { icon: Bot, text: 'AI 自動化與內容工作流開發' },
  { icon: BookOpen, text: '用真實 code path 編寫文字實作課' },
]

export default function Instructor() {
  return (
    <section id="instructor" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            關於講師
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            你的課程講師
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src="/instructor.png"
                  alt="Jerry Lin"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  Jerry Lin / 林帛賢
                </h3>
                <p className="text-brand-500 font-semibold text-sm mb-4">
                  全端工程師 / AI 自動化實作者
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  我把自己實際開發產品時會碰到的登入、資料庫、付款、Webhook、部署與除錯流程，
                  整理成可以搜尋、複製、逐步驗收的文字課。課程不是把 AI 產生的畫面當成果，
                  而是要求每個關鍵 code path 都能說清楚、跑得通，最後留下可繼續改造成下一個產品的架構。
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {credentials.map((cred) => (
                    <div key={cred.text} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <cred.icon size={14} className="text-brand-600" />
                      </div>
                      <span className="text-gray-700 text-xs">{cred.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
