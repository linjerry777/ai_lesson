import { Check, X } from 'lucide-react'

const rows = [
  { label: '費用', self: '免費但耗時', coach: 'NT$30,000+', course: 'NT$990' },
  { label: '學習方式', self: '自己撞牆', coach: '有人帶', course: '照流程做' },
  { label: '交付結果', self: '不一定完成', coach: '看教練品質', course: '可收款網站模板' },
  { label: '登入 / 金流 / 部署', self: false, coach: true, course: true },
  { label: '每章驗收清單', self: false, coach: '不一定', course: true },
  { label: 'Debug 急救格式', self: false, coach: '不一定', course: true },
  { label: '適合完全零基礎', self: false, coach: '可能', course: false },
]

export default function Comparison() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            你不是缺工具清單，是缺一條可驗收的流程
          </h2>
          <p className="text-gray-400">
            這堂課不承諾零基礎無痛變工程師，而是把 AI 實作流程整理成可以跟做、可以檢查、可以 debug 的產品路線。
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-400 text-sm font-normal pb-4 pr-6 w-1/4" />
                <th className="text-center pb-4 px-4">
                  <div className="text-gray-400 text-sm">自己摸索</div>
                </th>
                <th className="text-center pb-4 px-4">
                  <div className="text-gray-400 text-sm">一對一教練</div>
                </th>
                <th className="text-center pb-4 px-4">
                  <div className="bg-brand-500 rounded-xl px-4 py-2">
                    <div className="text-white font-bold text-sm">這堂課</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="py-4 pr-6 text-gray-400 text-sm">{row.label}</td>
                  <td className="py-4 px-4 text-center">
                    <CellValue value={row.self} neutral />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CellValue value={row.coach} neutral />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CellValue value={row.course} highlight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function CellValue({
  value,
  highlight,
  neutral,
}: {
  value: string | boolean
  highlight?: boolean
  neutral?: boolean
}) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${highlight ? 'bg-brand-500' : 'bg-green-500/20'}`}>
          <Check size={12} className={highlight ? 'text-white' : 'text-green-400'} />
        </div>
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
          <X size={12} className="text-gray-600" />
        </div>
      </div>
    )
  }
  return (
    <span className={`text-sm ${highlight ? 'text-brand-400 font-bold' : neutral ? 'text-gray-500' : 'text-gray-300'}`}>
      {value}
    </span>
  )
}
