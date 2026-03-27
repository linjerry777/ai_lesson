import { Check, X } from 'lucide-react'

const rows = [
  { label: '費用', self: '免費', coach: 'NT$30,000+', course: 'NT$2,640' },
  { label: '時間投入', self: '3–6 個月', coach: '2–4 週', course: '6 小時' },
  { label: '方法論完整性', self: false, coach: '有限', course: true },
  { label: '業界實戰案例', self: false, coach: '視情況', course: true },
  { label: '高階工具 (MCP/Hook)', self: false, coach: false, course: true },
  { label: '永久觀看 + 更新', self: false, coach: false, course: true },
  { label: '立即可用的工作流', self: false, coach: '需整理', course: true },
]

export default function Comparison() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            為什麼選這堂課？
          </h2>
          <p className="text-gray-400">
            跟其他學習路徑相比，你能更快、更便宜地真正掌握 AI 開發工作流。
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-400 text-sm font-normal pb-4 pr-6 w-1/4" />
                <th className="text-center pb-4 px-4">
                  <div className="text-gray-400 text-sm">自學摸索</div>
                </th>
                <th className="text-center pb-4 px-4">
                  <div className="text-gray-400 text-sm">找顧問 / 培訓</div>
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
