const testimonials = [
  {
    name: '張小明',
    role: '前端工程師 / 新創公司',
    avatar: '張',
    quote:
      '以前用 AI 是在浪費時間，copy/paste 完還要花更多時間修。上完這堂課之後，Context 設計那章直接讓我的 AI 產出品質上了好幾個檔次，現在開發速度至少快了 70%。',
    stars: 5,
  },
  {
    name: '林佳音',
    role: '接案工程師',
    avatar: '林',
    quote:
      'MCP 那章改變了我的工作方式。我現在把 Playwright 整進工作流後，驗收測試完全自動化，一個人可以接以前三倍的案量。這堂課的 CP 值真的超高。',
    stars: 5,
  },
  {
    name: '陳志偉',
    role: 'Tech Lead / 金融科技公司',
    avatar: '陳',
    quote:
      '第七章的團隊導入內容對我們幫助最大。帶著整個工程團隊走一遍 AI-first 工作流之後，每個 sprint 的產出效率明顯提升。成本控管那段也很實用。',
    stars: 5,
  },
  {
    name: '王建宇',
    role: '全端工程師 / 外商公司',
    avatar: '王',
    quote:
      '終於有一套完整的方法論，不再靠感覺用 AI。Sub-Agent 那章讓我大開眼界，原來可以讓 AI 幫你管理 AI，自動完成整個開發流程。強烈推薦。',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            學員回饋
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            真實學員回饋
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-yellow-400 text-base">★★★★★</span>
              <span className="font-semibold text-gray-900">4.9</span> 平均評分
            </span>
            <span className="text-gray-300">·</span>
            <span>1,200+ 學員見證</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              {/* Stars */}
              <div className="text-yellow-400 text-sm mb-3">
                {'★'.repeat(t.stars)}
              </div>
              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
