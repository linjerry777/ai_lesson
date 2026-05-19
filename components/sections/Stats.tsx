const stats = [
  { value: '4', label: '免費入門章節' },
  { value: '8', label: '主課完整階段' },
  { value: '50+', label: 'step-by-step 操作步驟' },
  { value: '1', label: '可上線的真實產品' },
]

export default function Stats() {
  return (
    <section className="py-8 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
