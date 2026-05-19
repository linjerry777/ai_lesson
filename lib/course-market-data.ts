import {
  Bot,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clapperboard,
  CloudCog,
  type LucideIcon,
  LockKeyhole,
  ShieldCheck,
  Users,
} from 'lucide-react'

export interface MarketSignal {
  title: string
  demand: string
  whyItSells: string
  courseAngle: string
  buildPath: string[]
  risk: string
  icon: LucideIcon
}

export interface ResearchSource {
  title: string
  publisher: string
  url: string
  note: string
}

export const marketSignals: MarketSignal[] = [
  {
    title: 'AI 實作與工作流自動化',
    demand: '最高',
    whyItSells:
      '企業與個人都在找「能立刻省時間」的 AI 用法。單純提示詞課變便宜，能做出作品、流程、代理或自動化的課更有溢價。',
    courseAngle:
      '不要賣「AI 工具大全」，要賣「用 AI 做出一個可驗收結果」：網站、報表、內容管線、客服流程、營運儀表板。',
    buildPath: [
      '先定義一個明確職能場景，例如行銷企劃、工程實作、行政自動化',
      '用一個可展示作品作為終點，而不是只教工具介面',
      '每章設計 checkpoint：輸入、AI 操作、人工判斷、產出物',
      '補一章風險：幻覺、資料外洩、版本變動、成本控管',
    ],
    risk: '泛 AI 課競爭極高，必須綁定垂直場景與作品集。',
    icon: Bot,
  },
  {
    title: 'AI 治理、資安與安全使用',
    demand: '高',
    whyItSells:
      'AI 進公司後，員工會把資料丟進不該用的工具，主管需要政策、訓練與演練。這類課有 B2B 需求。',
    courseAngle:
      '做成「公司導入 AI 的安全手冊」：哪些資料不能貼、如何評估工具、如何設計內部 SOP、如何做 phishing/deepfake 演練。',
    buildPath: [
      '整理常見 AI 使用風險：敏感資料、版權、錯誤決策、自動化權限',
      '設計角色化案例：員工、主管、法務、工程、行銷',
      '提供 policy template、檢查清單、情境測驗',
      '加上企業導入路線：試點、治理、內訓、稽核',
    ],
    risk: '需要避免法律/資安保證式承諾，內容要以風險教育與流程設計為主。',
    icon: ShieldCheck,
  },
  {
    title: '資料分析、Excel/SQL、AI 輔助商業決策',
    demand: '高',
    whyItSells:
      '資料素養仍是求職與公司內部升遷的硬需求。AI 讓初學者更快產生圖表與解釋，但仍需要判斷資料是否可信。',
    courseAngle:
      '做「非工程師資料分析實戰」：Excel/Sheets + SQL 基礎 + AI 解釋 + 商業簡報，最後產出一份可展示案例。',
    buildPath: [
      '用真實感資料集，不要只做玩具表格',
      '先教問題定義，再教工具操作',
      '每章都產出一個 dashboard、查詢或商業洞察',
      '最後加履歷/作品集包裝：截圖、故事、決策建議',
    ],
    risk: '市場很多免費內容，付費點要放在案例、批改、作品集與職涯轉換。',
    icon: ChartNoAxesCombined,
  },
  {
    title: '資安入門與 AI 時代防詐/防釣魚',
    demand: '高',
    whyItSells:
      'AI 讓釣魚信、偽造語音、深偽內容更便宜，個人和公司都需要更實戰的安全訓練。',
    courseAngle:
      '做「一般人也看得懂的 AI 資安課」或「小公司資安基本盤」：帳號安全、MFA、釣魚演練、資料備份、權限管理。',
    buildPath: [
      '從日常風險開始：Email、LINE、雲端硬碟、付款連結',
      '設計可互動辨識題：真假郵件、真假登入頁、真假付款通知',
      '教最小防護組合：密碼管理器、MFA、備份、權限分層',
      '提供公司可用的一頁式內訓教材',
    ],
    risk: '不要做成駭客炫技課；入門市場更買單的是可保護帳號與公司流程。',
    icon: LockKeyhole,
  },
  {
    title: '雲端、DevOps、部署與小型 SaaS 實作',
    demand: '中高',
    whyItSells:
      'AI 會寫 code 之後，更多人卡在部署、環境變數、資料庫、付款、觀測。能把產品送上線的課有明確價值。',
    courseAngle:
      '這正是 ai_lesson 目前主課位置：不是教語法，而是教一條能上線、能收款、能 debug 的產品路線。',
    buildPath: [
      '維持文字-first，讓學員可複製指令與錯誤格式',
      '強化「錯誤排查」與「線上環境」章節',
      '加入免費預備課降低新手流失',
      '後續可加企業版：內部工具、CRM、報名系統、知識庫',
    ],
    risk: '完全零基礎會被環境卡住，所以要用免費課篩選與補底。',
    icon: CloudCog,
  },
  {
    title: 'AI 內容生產、短影音、角色 IP、Remotion',
    demand: '中高',
    whyItSells:
      '創作者想要穩定產出，但已經不缺單點工具教學；缺的是可重複的企劃、素材、剪輯、發布流程。',
    courseAngle:
      '把 Codex + Image2 + Remotion 課定位成「AI 內容工廠」而不是單純動畫課：從題材研究到分段 render 和發布檢查。',
    buildPath: [
      '先教一支影片的企劃拆解，不急著做酷炫效果',
      '把素材、腳本、字幕、render manifest 做成標準格式',
      '用案例證明：同一套流程能做不同題材',
      '加上發布前 metadata、標題、縮圖、留存率檢查',
    ],
    risk: '視覺品質容易被模型波動影響，課程要把 Image2 當美術、Remotion 當穩定剪輯層。',
    icon: Clapperboard,
  },
  {
    title: 'AI 時代的職涯、履歷、作品集與面試',
    demand: '中高',
    whyItSells:
      '求職者不只想學技能，還想把技能轉成面試機會。能產生作品集與可驗證成果的課更容易成交。',
    courseAngle:
      '做「用 AI 做出可展示作品集」：每週一個小作品，最後整理成履歷、LinkedIn、GitHub、面試故事。',
    buildPath: [
      '鎖定一個角色：轉職工程、資料分析、AI 行銷、產品營運',
      '每章產出一個可截圖、可連結、可解釋的成果',
      '提供履歷描述模板：問題、行動、結果、工具',
      '加上面試問答：如何說明你不是只按 AI 產生',
    ],
    risk: '不能承諾保證錄取；要承諾作品品質與求職表達能力提升。',
    icon: BriefcaseBusiness,
  },
  {
    title: '人類技能：領導、溝通、批判思考、AI 協作',
    demand: '中',
    whyItSells:
      'AI 讓純執行型技能貶值，但判斷、溝通、跨部門協作仍是企業訓練需求。這類課適合 B2B 或 cohort。',
    courseAngle:
      '不要做抽象心靈雞湯，要做「AI 導入後主管怎麼帶團隊」：決策、檢核、授權、風險溝通。',
    buildPath: [
      '用工作場景設計案例：績效、專案延誤、AI 產出品質爭議',
      '提供會議模板、決策模板、回饋模板',
      '設計情境演練與 peer review',
      '用 cohort 或企業工作坊提高單價',
    ],
    risk: '純錄播難賣高價，最好搭配工作坊、討論或作業回饋。',
    icon: Users,
  },
]

export const researchSources: ResearchSource[] = [
  {
    title: '2026 Global Learning & Skills Trends Report',
    publisher: 'Udemy Business',
    url: 'https://business.udemy.com/2026-global-learning-skills-trends-report/',
    note: 'AI upskilling 持續高速成長，並強調 AI fluency 與 adaptive skills。',
  },
  {
    title: 'Job Skills Report 2026',
    publisher: 'Coursera',
    url: 'https://www.coursera.org/skills-reports/job-skills',
    note: '以企業學習者資料觀察 GenAI、cloud、cybersecurity、data、DevOps 等職能需求。',
  },
  {
    title: '2026 Fastest-Growing Skills and Learning Trends',
    publisher: 'Coursera Blog',
    url: 'https://blog.coursera.org/2026s-fastest-growing-skills-and-top-learning-trends-from-2025/',
    note: '指出 GenAI、cybersecurity、project management、leadership、data literacy 等持續升溫。',
  },
  {
    title: 'Skills on the Rise 2026',
    publisher: 'LinkedIn News',
    url: 'https://news.linkedin.com/2026/Skills-on-the-rise-2026',
    note: '顯示 AI 與協作/判斷等 human skills 同時成為職場技能訊號。',
  },
  {
    title: '250 Most Popular Online Courses 2026',
    publisher: 'Class Central',
    url: 'https://www.classcentral.com/report/most-popular-courses-2026/',
    note: '熱門公開課中 AI、教育、職涯技能與可證明成果的課程持續佔位。',
  },
  {
    title: 'AI for Online Learning: 2026 Report',
    publisher: 'Thinkific',
    url: 'https://www.thinkific.com/resources/plus-ai-for-online-learning-2026-report/',
    note: '課程建立者使用 AI 加速內容、互動與規模化，但仍需連到學習成效。',
  },
]

export const courseBuildPrinciples = [
  '賣 outcome，不賣工具名：學員要的是作品、升遷、轉職、節省時間或降低風險。',
  '課程終點要可展示：網站、報表、影片、SOP、作品集、內訓包，比「學會概念」更容易成交。',
  '每章都要有 checkpoint：學員知道現在該看到什麼，卡住時能貼什麼給 AI。',
  '免費課負責降門檻，付費課負責交付結果，不要把主課稀釋成零基礎百科。',
  '高價課要有回饋或 cohort；低價課要高度自助、文字可搜尋、範本可複製。',
]
