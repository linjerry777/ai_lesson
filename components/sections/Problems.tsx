import { AlertCircle } from 'lucide-react'

const problems = [
  {
    title: '花了錢，學完還是做不出東西',
    desc: '全是工具介紹和指令大全，沒有一個完整的真實專案。看完等於沒學，做作品時還是一片茫然。',
  },
  {
    title: '示範永遠是 Todo List',
    desc: '他們的「實戰」是一個假資料的前端頁面。你的需求是做一個能登入、能收錢、能部署的東西。',
  },
  {
    title: '踩到地雷自己查，講師說「這超出範圍」',
    desc: '環境變數設錯、API 金鑰有換行符、Webhook 沒反應——這些才是真正會卡住你的問題，但課裡不教。',
  },
  {
    title: '「Vibe Coding」聽起來很潮，但你學完在 vibe 什麼？',
    desc: '對，氛圍很好，截圖很漂亮。但能不能告訴我 Stripe 的 webhook 怎麼接，購買記錄怎麼存進資料庫？',
  },
  {
    title: '貴，而且還要再買下一堂才學得完',
    desc: '第一堂教「觀念」，第二堂才教「實作」，第三堂才教「部署」。每堂 NT$2,940 起跳，當你是冤大頭。',
  },
]

export default function Problems() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            你買過這種課嗎？
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            市面上的 AI 課程有個共同特色——
            <strong className="text-gray-800">教你怎麼用工具，但不告訴你怎麼做出東西。</strong>
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {problems.slice(0, 3).map((problem) => (
            <ProblemCard key={problem.title} {...problem} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {problems.slice(3).map((problem) => (
            <ProblemCard key={problem.title} {...problem} />
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            這堂課的答案很簡單——<strong className="text-gray-700">直接帶你做出一個真的能用的產品。</strong> ↓
          </p>
        </div>
      </div>
    </section>
  )
}

function ProblemCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}
