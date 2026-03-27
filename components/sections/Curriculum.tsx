const stages = [
  {
    num: '01',
    title: 'AI 工程思維建立',
    desc: '理解 Claude Code 的底層設計邏輯，跳脫傳統 AI 工具使用框架，建立能放大成果的工程師 AI 協作心態。',
    items: ['Claude Code 的設計理念與 Coding Agent 能力邊界', '與傳統 AI 工具的根本差異', '高效 AI 協作的核心心智模型'],
  },
  {
    num: '02',
    title: '核心工作流與 Context 設計',
    desc: '掌握讓 AI 真正「看懂你的專案」的關鍵技術，避免幻覺、穩定產出高品質程式碼。',
    items: ['Plan Mode 與 Ultra Think 的使用時機', 'Memory 系統、檔案參照與模型切換', '避免幻覺的 Context 設計技巧', '需求拆解的正確方法'],
  },
  {
    num: '03',
    title: '完整專案實戰開發',
    desc: '從需求到部署，完整走一次前端 + 後端 + 資料庫的全端開發流程，讓 AI 做大部分工作。',
    items: ['架構規劃與技術選型', '前端 UI 實作與元件設計', '後端 API 與資料庫開發', '自動化測試與 Debug 流程', 'Github Pages / Vercel 部署'],
  },
  {
    num: '04',
    title: 'MCP 整合應用',
    desc: '從原理到實作，打造屬於你自己的可擴充 AI 開發系統，串接你最常用的工具。',
    items: ['MCP Server 的原理與架構', '串接 Playwright、資料庫、API 工具', '打造自己的 MCP Server', '用 MCP 實現真正的工程自動化'],
  },
  {
    num: '05',
    title: 'Hook 與自動化工程',
    desc: '用事件驅動的方式建立自動化流程，讓 Claude Code 在關鍵時刻自動執行對的動作。',
    items: ['Hook 機制的設計原則', '自動化測試與 CI/CD 整合', '用 Playwright + MCP 自動化驗收', '資安預先檢查與敏感資訊防護'],
  },
  {
    num: '06',
    title: 'Sub-Agent 多代理協作',
    desc: '進入高階應用——讓 AI 管理 AI，設計多代理協作系統，實現真正的工程自動化。',
    items: ['Sub-Agent 的設計原則與使用時機', '任務分工與平行處理架構', 'Skills 客製化與工具鏈建立', '用 AI 管理 AI 的進階工作流'],
  },
  {
    num: '07',
    title: '團隊落地與成本控管',
    desc: '讓整個團隊 AI 戰力翻倍——從個人效率到組織層級的 AI-first 開發流程導入。',
    items: ['AI-first 開發流程設計', 'Token 消耗控管的五大技巧', '模型選擇與 Sub-Agent 成本優化', '資安最佳實踐與企業導入指南'],
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
            完整 7 階段學習路徑
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            從觀念建立到高階應用，完整走一遍真實工程師的 AI 開發工作流。
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
