const stages = [
  {
    num: '01',
    title: '從想法到 Landing Page，一個指令',
    desc: '你現在看到的整個課程銷售頁——Hero、Pain Points、課程大綱、學員回饋、定價、FAQ——全部是這樣生出來的。',
    items: ['需求描述怎麼寫 AI 才看得懂', '版面結構規劃與 Tailwind 設計系統', '每個 Section 的生成與調整過程', '為什麼「改一點」比「重新生」更快'],
  },
  {
    num: '02',
    title: 'Supabase 登入：Google OAuth 踩坑全記錄',
    desc: '理論上三行程式就能搞定，實際上你會踩到 redirect URL 白名單、Site URL 設定錯、cookie 沒帶到。我們全踩過。',
    items: ['Supabase 專案建立與 Vercel 整合', 'Google OAuth Client 設定（正確姿勢）', 'Callback URL 為什麼一直跑到首頁', 'Magic Link 備用方案'],
  },
  {
    num: '03',
    title: '環境變數地獄：那個 \\n 差點毀了一切',
    desc: '用 echo 把 API key 傳給 Vercel，結果 key 的結尾多了一個換行符。Stripe 直接拒收，回傳 500。全過程在這章。',
    items: ['echo vs printf 的差異（血淚教訓）', 'Vercel env var 的正確設定方式', '怎麼用 debug route 診斷 env 問題', '本機 .env.local 與線上環境的同步'],
  },
  {
    num: '04',
    title: 'Stripe Checkout：沙盒測試到真實收款',
    desc: '建 product、設 price、接 webhook、存進資料庫。整個付款流程從零開始，包含你一定會碰到的那些錯誤。',
    items: ['Stripe 產品與價格 API 建立', 'Checkout Session 生成與跳轉', 'Webhook 接收與 purchases 資料表', '用測試卡 4242 4242 4242 4242 驗收'],
  },
  {
    num: '05',
    title: 'Vercel 部署：push code = 自動更新',
    desc: '從 git init 到 GitHub 連動到 Vercel 自動部署，加上固定域名設定。每次改完 code 一個 push 就上線。',
    items: ['git init + GitHub repo 建立', 'vercel CLI 部署與環境綁定', '固定 alias vs 每次換 URL 的差異', 'CI/CD：commit → push → 自動部署'],
  },
  {
    num: '06',
    title: '完整 Debug 實錄：500、CORS、Session 消失',
    desc: '這是其他課不敢教的部分。我們遇到的每一個錯誤——500 on /api/checkout、session 沒帶到、domain 設錯——全在這章。',
    items: ['怎麼讀 Vercel function logs', '500 error 的三種來源', 'Session cookie 為什麼在線上不見了', 'debug route 的設計與使用'],
  },
  {
    num: '07',
    title: '同樣的方法，套到你自己的專案',
    desc: '這整套流程不只能做課程網站。SaaS、作品集、工具型產品——你學到的是一個可以複製的建站方法論。',
    items: ['架構模板的複用邏輯', '哪些部分換掉、哪些直接套', '從 landing page 到完整產品的延伸路徑', '下一步：把你自己的想法建出來'],
  },
]

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            課程大綱
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            7 章，從零到一個真實產品
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            不是理論，不是假示範。每一章都是建這個網站時實際發生的過程。
          </p>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage) => (
            <StageCard key={stage.num} {...stage} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StageCard({
  num,
  title,
  desc,
  items,
}: {
  num: string
  title: string
  desc: string
  items: string[]
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group">
      <div className="flex gap-5">
        <div className="flex-shrink-0">
          <span className="text-3xl font-black text-brand-500/30 group-hover:text-brand-500/60 transition-colors font-mono">
            {num}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm mb-3">{desc}</p>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="text-xs bg-gray-100 group-hover:bg-brand-100 text-gray-600 group-hover:text-brand-700 px-2.5 py-1 rounded-full transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
