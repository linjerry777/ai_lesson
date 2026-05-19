const stages = [
  {
    num: 'FREE',
    title: '免費預備課：新手先補 AI 實作基礎',
    desc: '先理解 terminal、Node、Git、專案結構、.env.local 與錯誤求救格式，確認自己適不適合進主課。',
    items: ['工具地圖', '專案結構', 'env 安全', 'AI 求救格式'],
  },
  {
    num: '00',
    title: '準備工作：帳號與本機環境',
    desc: '先把 Claude Code Desktop、Node.js、Git、Vercel CLI、Stripe CLI 準備好，並確認哪些指令該在本機執行。',
    items: ['帳號清單', '本機工具安裝', 'Claude Code 分頁差異', '開工前驗收'],
  },
  {
    num: '01',
    title: '從想法到 Landing Page',
    desc: '把模糊需求拆成 Claude Code 能執行的指令，產出首頁、課程大綱、價格、FAQ 等基本銷售頁。',
    items: ['需求描述', 'Next.js 專案', 'Tailwind 視覺', '首頁驗收'],
  },
  {
    num: '02',
    title: 'Google 登入：Supabase Auth 實作',
    desc: '完成 Supabase 專案、Google OAuth、callback route、Site URL 與 redirect URL 設定。',
    items: ['Supabase keys', 'Google OAuth', 'Callback URL', '登入驗收'],
  },
  {
    num: '03',
    title: '環境變數與 /api/debug',
    desc: '整理本機與線上 env 差異，避開 Windows 換行符地獄，建立安全的 debug route。',
    items: ['.env.local', 'Vercel env', '不洩漏 secret', 'debug 驗收'],
  },
  {
    num: '04',
    title: 'Stripe Checkout + Webhook',
    desc: '建立 TWD 990 商品、Checkout Session、Webhook handler、purchases 表，並用測試卡完整跑通。',
    items: ['Stripe 商品', 'Webhook 簽名', 'purchases 表', '付款解鎖驗收'],
  },
  {
    num: '05',
    title: 'Vercel 部署與正式環境設定',
    desc: '推上 GitHub，連接 Vercel，補線上 env，更新 Supabase Site URL 與 Stripe 正式 webhook。',
    items: ['GitHub repo', 'Vercel 部署', '線上 env', '正式版驗收'],
  },
  {
    num: '06',
    title: 'Debug 急救包',
    desc: '用 Vercel logs、/api/debug、Stripe Webhooks、Supabase 設定定位常見問題，並學會把錯誤貼給 Claude 修。',
    items: ['500 error', 'Session 消失', '付款沒解鎖', '求助格式'],
  },
  {
    num: '07',
    title: '把模板改成你的第二個產品',
    desc: '拆解 Landing、Auth、Payment、Dashboard 四個模組，學會複製架構到下一個產品。',
    items: ['模板拆解', '換文案', '換資料表', '新專案 checklist'],
  },
]

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            課程大綱
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            免費預備課 + 8 個階段，做出一個可收款產品網站
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            這不是工具功能清單，而是一條從開發環境、頁面、登入、付款、部署到 debug 的完整交付流程。
          </p>
        </div>

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
