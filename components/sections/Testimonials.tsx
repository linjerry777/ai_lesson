const testimonials = [
  {
    name: '張小明',
    role: '前端工程師 / 新創公司',
    avatar: '張',
    quote:
      '以前買了一堆課都是教 Todo List，看完還是做不出東西。這堂課直接帶我從零把一個能收錢的網站建起來，Google 登入、Stripe 付款全部串好，第一次感覺真的學會了。',
    stars: 5,
  },
  {
    name: '林佳音',
    role: '接案工程師',
    avatar: '林',
    quote:
      'Debug 那章救了我。環境變數地獄、session 在線上消失、webhook 沒反應——這些都是我之前自學時卡最久的地方，這章全部講清楚了。部署完第一次沒踩坑。',
    stars: 5,
  },
  {
    name: '陳志偉',
    role: '後端工程師 / 電商公司',
    avatar: '陳',
    quote:
      '跟著課程一個下午就把整個網站建起來部署上線。Stripe webhook 那段講得很細，之前自己串接一直搞不定 purchases 表沒更新，這章看完三十分鐘就解決了。',
    stars: 5,
  },
  {
    name: '王建宇',
    role: '全端工程師 / 外商公司',
    avatar: '王',
    quote:
      '最後一章把整套架構拆開說明怎麼複用，直接幫我省掉下一個接案專案八成的建設時間。這堂課買的不只是知識，是一個可以一直套的模板。CP 值很高。',
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
