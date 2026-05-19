import { Bug, CreditCard, FileStack, Rocket } from 'lucide-react'

const scenarios = [
  {
    title: '你不是缺更多 AI 工具，而是缺一條能跑完的路線',
    role: '適合：想做產品網站的人',
    icon: Rocket,
    quote:
      '很多課教你用 AI 產生漂亮頁面，但沒有帶你處理登入、付款、購買紀錄、Dashboard、部署。這堂主課把路線收斂成一個可上線網站。',
  },
  {
    title: '你會卡在 env、OAuth、Webhook，不是卡在語法',
    role: '適合：自學時常被環境問題卡住的人',
    icon: Bug,
    quote:
      '課程把環境變數、Google redirect URI、Stripe webhook secret、Vercel logs 放進正式章節，不把真正會卡住的地方藏在「自行排除」。',
  },
  {
    title: '你需要知道付款成功後，資料到底寫到哪裡',
    role: '適合：想把 AI 生成網站變成可收款產品的人',
    icon: CreditCard,
    quote:
      '不是只跳出 Stripe Checkout 就算完成。主課要求你跑完付款成功、webhook 收到、purchases 寫入、Dashboard 解鎖的端到端流程。',
  },
  {
    title: '你最後拿到的不是知識點，而是一個可複用模板',
    role: '適合：想把同一套架構換成下一個產品的人',
    icon: FileStack,
    quote:
      '最後會拆解 Landing、Auth、Payment、Dashboard 四個模組，讓你知道下一個專案要換文案、換資料表、換價格，哪些地方不用重做。',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            學完能解決的問題
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            你會在這幾個情境裡看到自己
          </h2>
          <p className="text-gray-500 text-sm">下方是課程針對的 4 種典型卡點</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {scenarios.map((scenario) => (
            <div
              key={scenario.title}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <scenario.icon size={20} />
              </div>
              <h3 className="mb-2 text-base font-black text-gray-900">{scenario.title}</h3>
              <p className="mb-4 text-xs font-semibold text-brand-500">{scenario.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{scenario.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
