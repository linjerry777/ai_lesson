export interface Lesson {
  id: string
  title: string
  duration: string         // 預估時長
  youtubeId: string        // YouTube video ID，空字串 = 尚未上傳
  description: string
  keyPoints: string[]
}

export const COURSE_TITLE = 'Claude Code 實戰工作流'
export const COURSE_SUBTITLE = '從零建立一個真實產品的完整過程'

export const lessons: Lesson[] = [
  {
    id: 'ch01',
    title: '從想法到 Landing Page，一個指令',
    duration: '約 45 分',
    youtubeId: '',  // TODO: 填入 YouTube ID
    description:
      '你現在看到的整個課程銷售頁——Hero、Pain Points、課程大綱、學員回饋、定價、FAQ——全部是這樣生出來的。這章教你怎麼把一個模糊的想法，拆解成 Claude Code 能直接動手的需求描述。',
    keyPoints: [
      '需求描述怎麼寫 AI 才看得懂',
      '版面結構規劃與 Tailwind 設計系統',
      '每個 Section 的生成與調整過程',
      '為什麼「改一點」比「重新生」更快',
    ],
  },
  {
    id: 'ch02',
    title: 'Supabase 登入：Google OAuth 踩坑全記錄',
    duration: '約 50 分',
    youtubeId: '',
    description:
      '理論上三行程式就能搞定，實際上你會踩到 redirect URL 白名單、Site URL 設定錯、code 跑去首頁不跑 callback。我們全踩過，這章全紀錄。',
    keyPoints: [
      'Supabase 專案建立與 Vercel 整合',
      'Google OAuth Client 設定（正確姿勢）',
      'Callback URL 為什麼一直跑到首頁',
      'Magic Link 備用方案',
    ],
  },
  {
    id: 'ch03',
    title: '環境變數地獄：那個 \\n 差點毀了一切',
    duration: '約 35 分',
    youtubeId: '',
    description:
      '用 echo 把 API key 傳給 Vercel，結果 key 的結尾多了一個換行符。Stripe 直接拒收，回傳 500。這章紀錄了這種沒有文件會教你的問題，以及怎麼系統性地診斷。',
    keyPoints: [
      'echo vs printf 的差異（血淚教訓）',
      'Vercel env var 的正確設定方式',
      '用 /api/debug 診斷 env 問題',
      '本機 .env.local 與線上環境同步',
    ],
  },
  {
    id: 'ch04',
    title: 'Stripe Checkout：沙盒測試到真實收款',
    duration: '約 55 分',
    youtubeId: '',
    description:
      '建 product、設 price、接 webhook、存進資料庫。整個付款流程從零開始，包含你一定會碰到的錯誤。最後用測試卡把整條流程跑通。',
    keyPoints: [
      'Stripe 產品與價格 API 建立',
      'Checkout Session 生成與跳轉',
      'Webhook 接收與 purchases 資料表',
      '用測試卡 4242 4242 4242 4242 驗收',
    ],
  },
  {
    id: 'ch05',
    title: 'Vercel 部署：push code = 自動更新',
    duration: '約 30 分',
    youtubeId: '',
    description:
      '從 git init 到 GitHub 連動到 Vercel 自動部署，加上固定域名設定。每次改完 code 一個 push 就上線，三十秒內。',
    keyPoints: [
      'git init + GitHub repo 建立',
      'vercel CLI 部署與環境綁定',
      '固定 alias vs 每次換 URL 的差異',
      'CI/CD：commit → push → 自動部署',
    ],
  },
  {
    id: 'ch06',
    title: '完整 Debug 實錄：500、CORS、Session 消失',
    duration: '約 60 分',
    youtubeId: '',
    description:
      '這是其他課不敢教的部分。登入成功點購課白畫面 500、session 在線上不見了、domain 設錯——這章整理了整個專案踩過的所有坑。',
    keyPoints: [
      '怎麼讀 Vercel function logs',
      '500 error 的三種來源',
      'Session cookie 為什麼在線上不見了',
      'debug route 的設計與使用',
    ],
  },
  {
    id: 'ch07',
    title: '同樣的方法，套到你自己的專案',
    duration: '約 40 分',
    youtubeId: '',
    description:
      '這整套流程不只能做課程網站。SaaS、作品集、工具型產品——你學到的是一個可以複製的建站方法論。這章帶你把模板拆開，重新組裝成你自己的需求。',
    keyPoints: [
      '架構模板的複用邏輯',
      '哪些部分換掉、哪些直接套',
      '從 landing page 到完整產品的延伸',
      '下一步：把你自己的想法建出來',
    ],
  },
]
