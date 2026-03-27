import { AlertCircle } from 'lucide-react'

const problems = [
  {
    title: 'AI 寫得出片段，整合進專案就爆炸',
    desc: 'Context 不完整，AI 看不懂你的專案架構，產出的程式碼無法直接使用，還要花更多時間修正。',
  },
  {
    title: '對話一長，AI 開始幻覺越修越亂',
    desc: '上下文越給越多，Claude 開始亂改不相關的程式碼，一個 bug 修好三個 bug 跑出來。',
  },
  {
    title: '只會零碎 copy/paste，沒有系統流程',
    desc: '每次開發都靠感覺，沒有可複製、可擴展的工作流，導致效率低落，無法規模化。',
  },
  {
    title: 'MCP、Hook、Sub-Agent 完全不知從哪入手',
    desc: '聽說很強大，但文件難懂，不知道如何整合進自己的開發流程，停留在基礎功能用法。',
  },
  {
    title: '導入 AI 後，程式碼品質反而更難控管',
    desc: '團隊各自用 AI，Context 不一致，Code Review 困難，技術債暴增，成本失控。',
  },
]

export default function Problems() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            你是不是也遇過這些問題？
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            大多數工程師用 AI 的方式都是錯的——結果 AI 反而變成負擔。
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
            這堂課就是專門為以上問題設計的 ↓
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
