const stats = [
  { value: '1,200+', label: '工程師學員' },
  { value: '4.9', label: '課程評分', suffix: '/ 5.0' },
  { value: '6+', label: '小時精華內容' },
  { value: '40+', label: '實戰單元' },
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
                {stat.suffix && (
                  <span className="text-gray-400 text-sm">{stat.suffix}</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
