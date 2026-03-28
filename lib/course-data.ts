export interface Lesson {
  id: string
  title: string
  duration: string
  description: string
  keyPoints: string[]
}

export const COURSE_TITLE    = 'Claude Code 實戰工作流'
export const COURSE_SUBTITLE = '從零建立一個真實產品的完整過程'

export const lessons: Lesson[] = [
  {
    id: 'ch01',
    title: '一句話，整個網站生出來',
    duration: '約 45 分',
    description:
      '我跟 Claude Code 說：幫我建一個賣線上課程的網站，要有 Google 登入和 Stripe 付款。然後它就開始動了。\n\n' +
      'Navbar、Hero section、痛點卡片、課程大綱、學員回饋、比較表、FAQ、頁腳——一個下午全部生完。你說這是 Vibe Coding 也好，反正它跑得動。\n\n' +
      'AI 寫出什麼，取決於你說了什麼。這章教你怎麼把一個模糊的想法，拆解成 Claude Code 能直接動手的需求。這才是真正的技術。',
    keyPoints: [
      '怎麼把模糊想法拆解成 AI 能執行的需求描述',
      'Landing Page 各 section 的生成順序與調整方式',
      '版面規劃、Tailwind 設計系統的快速應用',
      '為什麼「改一點」比「重新生」更有效率',
    ],
  },
  {
    id: 'ch02',
    title: 'Google 登入：理論三行，實際兩小時',
    duration: '約 50 分',
    description:
      'Supabase 文件說，Google OAuth 三行程式就搞定。對，三行。然後我花了兩個小時在除錯。\n\n' +
      '登入完成，OAuth 的 code 跑去了首頁，不是 callback route。原因是 Supabase 的 redirect URL 白名單沒加對。你一定也會踩。\n\n' +
      'Site URL 設定、redirect URL 白名單、callback route 的 origin 問題，全部在這章。下次你串 OAuth，30 分鐘搞定。',
    keyPoints: [
      'Supabase 專案建立與 Google OAuth 完整設定流程',
      'redirect URL 白名單——最容易漏掉的一步',
      'OAuth code 為什麼跑到首頁而不是 callback',
      '本機開發與線上環境的 callback URL 同步設定',
    ],
  },
  {
    id: 'ch03',
    title: '環境變數地獄：那個 \\n 讓 Stripe 直接拒收',
    duration: '約 35 分',
    description:
      '我用 echo 把 Stripe 的 secret key 傳給 vercel env add。然後 Stripe 回傳 500，說 API key 無效。\n\n' +
      '原因是 echo 在 Windows 會在字串結尾加換行符。Stripe 拿到的 key 是 sk_test_xxx 加一個看不見的 \\n，直接拒收。\n\n' +
      '這種問題沒有任何文件會教你。這章紀錄了 echo vs printf 的差異、.env.local 的格式問題、怎麼用 debug route 確認 env 有沒有正確帶入。',
    keyPoints: [
      'echo vs printf——Windows 環境下的換行符陷阱',
      'Vercel env var 的正確設定方式（避免隱藏字元）',
      '建立 /api/debug 快速確認所有 env 狀態',
      '.env.local 本機格式與 Vercel 線上環境的同步',
    ],
  },
  {
    id: 'ch04',
    title: 'Stripe 串接：從沙盒測試到真實收款',
    duration: '約 55 分',
    description:
      '付款功能不能直接上線測。Stripe 有沙盒環境，用測試卡 4242 4242 4242 4242，打多少都不會真的扣錢。\n\n' +
      'Stripe 付款成功，但你的資料庫沒更新。原因是 webhook 沒設好。這章完整講 webhook endpoint 的建立、驗證、purchases 資料表的寫入。\n\n' +
      '付款完成跳 success 頁、webhook 打進來、purchases 表寫入、再次點購課自動跳 dashboard——這章帶你把整個收款流程驗收完畢。',
    keyPoints: [
      'Stripe 產品與 Price ID 建立，沙盒環境設定',
      'Checkout Session 生成與付款後跳轉邏輯',
      'Webhook endpoint 建立、簽名驗證、寫入資料庫',
      '用測試卡 4242 把整條付款流程端到端跑通',
    ],
  },
  {
    id: 'ch05',
    title: 'Vercel 部署：git push = 三十秒上線',
    duration: '約 30 分',
    description:
      '改完 code，git add，git commit，git push。Vercel 自動偵測到 main branch 有新 commit，三十秒內重新部署，新版上線。\n\n' +
      '但每次部署 Vercel 都給一個新的 URL，ailesson 加一串亂碼。你要設定固定的 alias，讓同一個網址永遠指向最新版本。\n\n' +
      'git init、GitHub repo 建立、Vercel 連動、固定 alias 設定，這章完整走一遍。以後你任何專案要部署，套這個流程就對了。',
    keyPoints: [
      'git init + GitHub repo 建立與推送',
      'Vercel CLI 連動與自動部署設定',
      '固定 alias 設定——讓網址永遠不變',
      'CI/CD 流程：commit → push → 自動上線全紀錄',
    ],
  },
  {
    id: 'ch06',
    title: 'Debug 實錄：500、session 消失、CORS',
    duration: '約 60 分',
    description:
      '登入成功，點購課，白畫面，500 error。Vercel log 什麼都沒顯示。這種 debug 才是真實開發的日常。\n\n' +
      '我建了一個 /api/debug，直接回傳當前的 user session、env var 狀態、Supabase 連線狀態。三十秒定位問題。這個習慣，每個專案都要有。\n\n' +
      '這章整理了這個專案踩過的所有坑：session 為什麼在線上不見了、CORS 怎麼設、Supabase cookie 在不同 domain 的行為。一章全看完，下次不用再踩。',
    keyPoints: [
      '怎麼讀 Vercel function logs——找到真正的錯誤',
      '/api/debug 的設計：30 秒確認 session 與 env 狀態',
      'session 為什麼在線上消失——cookie domain 問題',
      'CORS 設定與 Supabase 跨 domain cookie 行為',
    ],
  },
  {
    id: 'ch07',
    title: '同樣的架構，套到你自己的專案',
    duration: '約 40 分',
    description:
      '你學到的不只是這個網站。SaaS 工具、個人作品集、接案的產品原型，架構都是一樣的。學的是方法，不是模板。\n\n' +
      'Landing Page 換文案，Supabase 換資料表，Stripe 換你的商品。其他不動。你下一個專案，從這個模板開始，省掉八成的架設時間。\n\n' +
      '比市面上同類課程便宜。因為我不需要分三堂課——觀念一堂、實作一堂、部署一堂，每堂三千。你現在看到的這個網站，就是全部的課程內容。',
    keyPoints: [
      '哪些部分換掉、哪些直接套——模板拆解邏輯',
      'Supabase 資料表設計：如何對應你自己的業務需求',
      'Stripe 商品替換：從課程到任何數位產品',
      '下一步：把你自己的想法建出來',
    ],
  },
]
