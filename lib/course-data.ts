import type { Step } from '@/app/dashboard/StepGuide'
import { attachWorkbook } from './course-workbooks'

export interface Lesson {
  id: string
  title: string
  duration: string
  description: string
  keyPoints: string[]
  steps: Step[]
}

export const COURSE_TITLE    = 'Claude Code 實戰工作流'
export const COURSE_SUBTITLE = '從零建立一個真實產品的完整過程'

const baseLessons: Lesson[] = [

  // ── ch00 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch00',
    title: '準備工作：帳號申請 + 環境安裝',
    duration: '約 20 分',
    description:
      '開始之前，你需要五個帳號和幾個工具。這章把每個步驟都整理好了，照著做就能把環境準備好。\n\n' +
      '先確認各服務的帳號資格與目前方案。Claude 使用方案、API、主機與交易處理可能另計費，課程費用不含這些支出。練習先使用本機與 Sandbox，看到付費或合約步驟先停下來確認。',
    keyPoints: [
      '五個必要帳號：Google、GitHub、Claude、Supabase、Vercel',
      '安裝 Claude Code Desktop（GUI 介面，比 CLI 更直觀）',
      '用 Claude Code Desktop 安裝 Node.js 和 Git',
      '安裝 Vercel CLI（npm 安裝）和 Stripe CLI（Windows 用 scoop 或 winget 另外裝，不是 npm）',
    ],
    steps: [
      {
        title: '依序申請這五個帳號',
        body: '全部用同一個 Google 帳號串起來，方便管理。依序開這些網址：',
        code: {
          lang: 'text',
          content: `① Google：https://accounts.google.com
   → 這個帳號會用來登入後面所有服務

② GitHub：https://github.com/signup
   → 建立 GitHub 帳號並完成官方驗證

③ Claude：https://claude.ai
   → 用 Google 帳號登入建立

④ Supabase：https://supabase.com
   → 用 Google 帳號登入

⑤ Vercel：https://vercel.com/signup
   → 用 GitHub 帳號登入`,
        },
        tip: 'Stripe 帳號在 ch04 才會用到，現在不用急著申請。',
      },
      {
        title: '下載並安裝 Claude Code Desktop',
        body: '去官方網站下載，選你的作業系統版本安裝。裝完開啟，用你的 Claude 帳號登入。',
        link: { text: '下載 Claude Code Desktop', url: 'https://claude.ai/download' },
        tip: 'Desktop 的登入方式與可用方案以官方頁面和你的帳號為準；訂閱與 API 計費分開。先確認可用 Code 工作階段，再開始課程，不要因教材自行升級方案。',
      },
      {
        title: '切換到 Code 模式，選一個資料夾',
        body: 'Claude Code Desktop 有三個分頁：Chat、Cowork、Code。\n\n這堂課全程使用 Code 分頁——它讓 Claude 直接操作你電腦上的檔案，寫程式碼、建專案都在這裡。\n\n點上方的「Code」切換過去，然後點左下角「Select folder」選一個你要放專案的資料夾（例如桌面或 Documents）。',
        warning: '如果切到 Code 分頁出現紅色錯誤訊息「Git is required for local sessions」——這表示 Git 還沒有裝。\n\n去這裡下載安裝 Git for Windows：https://git-scm.com/download/win\n\n安裝完之後重新開啟 Claude Code Desktop，再切到 Code 分頁就可以了。',
        tip: '注意：Chat 分頁的 Claude 是跑在 Linux 雲端容器裡，不是你的 Windows 電腦。所以 winget、scoop 這些 Windows 工具在 Chat 裡無法使用。只有 Code 分頁是直接在你的本機執行的。',
      },
      {
        title: '確認 Node.js 有沒有裝',
        body: '選好資料夾後，在 Code 分頁貼這段讓 Claude 幫你確認：',
        claude: `請幫我確認開發環境：
1. 執行 node -v 確認有沒有裝 Node.js
2. 如果沒有裝，告訴我去哪裡下載（選 LTS 版本）
3. 確認好之後告訴我可以開始了`,
        warning: 'Node.js 如果沒有裝，Claude 會給你下載連結，照著裝完重開終端機之後，重新貼一次這段確認。',
      },
      {
        title: '安裝 Vercel CLI',
        body: '在 Code 分頁貼這段：',
        claude: `請幫我安裝 Vercel CLI：
1. 執行 npm install -g vercel
2. 安裝完執行 vercel --version 確認有沒有成功
告訴我結果。`,
      },
      {
        title: '安裝 Stripe CLI',
        body: 'Stripe CLI 在本機 ch04 的 webhook 測試才會用到。先讀官方安裝頁，選與你的 Windows 環境相符的方式；安裝後在 PowerShell 確認版本。',
        link: { text: 'Stripe CLI 官方安裝說明', url: 'https://docs.stripe.com/stripe-cli' },
        code: {
          lang: 'powershell',
          content: `stripe --version
# 尚未安裝時，按官方頁面選 Windows 方式；不要猜套件名稱。`,
        },
        warning: '先確認目前終端機的 OS 與工作目錄；遠端工作階段不一定是你的 Windows 本機。登入 Stripe CLI 前也要確認使用正確帳號及 Sandbox。',
        tip: 'Stripe CLI 在 ch04 本機測試 Webhook 才會用到（stripe listen --forward-to localhost:3000/api/webhooks/stripe）。安裝完執行 stripe --version 確認成功，到時候直接用。',
      },
      {
        title: '認識指令、內建技能與第三方外掛的差別',
        body: '在 Code 工作階段輸入 / 檢視此版本可用專案。指令、內建技能、自訂技能與外掛不是同一件事；第三方專案不保證已安裝。這門課以基本開發流程為主，不需要安裝設計外掛才能完成。',
        code: {
          lang: 'text',
          content: `1. 輸入 /，只使用目前清單中確實存在的專案。
2. /ui-ux-pro-max 等第三方名稱需要另外安裝，不是通用內建指令。
3. 沒有某個技能時，直接描述任務、限制與驗收方式也能練習。
4. 安裝外掛之前，先讀來源、所需許可權與費用。`,
        },
        tip: '技能會持續更新。直接在 Claude Code 輸入 / 檢視最新的完整清單，每個技能都有說明。不用背，需要的時候查就好。',
      },
      {
        title: '本章驗收：你準備好開工了嗎？',
        body: '進入下一章前，請先確認下面每一項都完成。少一項都先停下來補，不然後面遇到錯誤時會很難判斷是程式碼問題，還是環境還沒準備好。',
        code: {
          lang: 'text',
          content: `□ 可以開啟 Claude Code Desktop，並切到 Code 分頁
□ Code 分頁已經選好一個專案資料夾
□ Claude 可以在本機執行 node -v，並看到版本號
□ Git 已安裝，Code 分頁不再顯示 Git is required
□ vercel --version 可以正常顯示版本
□ stripe --version 可以在 Windows 終端機正常顯示版本
□ 你知道 Chat 分頁不是本機，Windows 指令要在 Code 分頁或 PowerShell 執行`,
        },
        warning: '如果你是完全沒有程式背景的人，這章是第一個門檻。卡住時不要硬往下做，先把錯誤訊息完整貼給 Claude，請它用「Windows 新手」的角度一步一步帶你檢查。',
      },
    ],
  },

  // ── ch01 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch01',
    title: '從需求單到可驗收的產品首頁',
    duration: '約 45 分',
    description:
      '我跟 Claude Code 說：幫我建一個賣線上課程的網站，要有 Google 登入和 Stripe 付款。然後它就開始動了。\n\n' +
      '先完成主視覺、課程大綱、價格、FAQ 與頁尾。沒有真實來源就不加學員回饋、獲利數字或成果保證。\n\n' +
      'AI 寫出什麼，取決於你說了什麼。這章教你怎麼把一個模糊的想法，拆解成 Claude Code 能直接動手的需求。',
    keyPoints: [
      '怎麼把模糊想法拆解成 AI 能執行的需求描述',
      'Landing Page 各 section 的生成順序與調整方式',
      '版面規劃、Tailwind 設計系統的快速應用',
      '為什麼「改一點」比「重新生」更有效率',
    ],
    steps: [
      {
        title: '先寫一頁需求單，不要直接叫 AI 開工',
        body: '新手最容易失敗的地方，是一開始只說「幫我做一個網站」。Claude 會猜很多東西，猜錯之後你也不知道哪裡錯。先用下面這份需求單，把產品、受眾、頁面區塊和驗收標準寫清楚。',
        code: {
          lang: 'text',
          content: `產品名稱：
這個產品賣給誰：
學員/客戶最想解決的問題：
首頁需要哪些區塊：
價格：
付款後要看到什麼：
這一章完成後，我應該看到什麼：`,
        },
        claude: `我想做一個線上課程銷售網站。請先幫我把需求整理成一頁規格，不要寫程式。

請包含：
1. 首頁需要哪些 section
2. 每個 section 的目的
3. 第一版只需要做到哪些功能
4. 什麼算完成，什麼先不要做`,
        tip: '如果這份需求單寫不出來，不要急著進 Next.js。先把受眾、價格、付款後交付內容想清楚，後面會少很多返工。',
      },
      {
        title: '建立 Next.js 專案',
        body: '開啟 Claude Code Desktop，選一個你想放專案的資料夾，然後貼這段給它：',
        claude: `幫我建立一個 Next.js 16 的專案，名稱叫 ai-lesson。
問到設定的時候 TypeScript 選 Yes、Tailwind 選 Yes，其他都選預設值。
建完之後進入專案資料夾，告訴我成功了。`,
        tip: '先看 package.json：本課參考站是 Next.js 16 + Tailwind v3，保留 tailwind.config.ts；新建專案可能使用 v4。v4 的 @import 與 @theme 不能直接貼進 v3 專案。請 AI 先辨識已安裝版本，再提供相符設定。',
      },
      {
        title: '告訴 Claude 你要什麼樣的網站',
        body: '專案建好之後，繼續在 Claude Code Desktop 貼這段：',
        claude: `照我剛才的需求單，幫我建一個課程銷售首頁，由上到下：
1. Hero：大標題、一句副標、「立即購買」按鈕
2. 你會學到什麼：3–6 個重點
3. 課程大綱：每章一行標題＋一句說明
4. 價格：一個方案、價格、包含什麼、不包含什麼
5. FAQ：5 題
6. 頁尾：聯絡方式、隱私權、退費政策連結

品牌主色用 [你選的顏色]，在 Tailwind 設定裡定義成 brand-50 到 brand-900，全站只用這組主色。
手機版要先能看。建完之後告訴我怎麼在瀏覽器預覽。`,
        warning: '不要一次叫它做太多。先讓它建好整體、能在瀏覽器看到之後，再慢慢調整細節。如果 build 出現「找不到 brand-500」，告訴 Claude：「依照目前安裝的 Tailwind 版本，把 brand-50 到 brand-900 定義成我的主色」（v3 寫在 tailwind.config.ts，v4 寫在 globals.css 的 @theme）。',
        tip: '先描述版面與閱讀需求，再逐區調整。設計外掛是選用工具，只有在已安裝、已理解許可權時使用。',
      },
      {
        title: '想改哪裡，直接描述給 Claude',
        body: '看到不滿意的地方，不要自己去改程式碼，繼續告訴 Claude：',
        claude: `Hero 的大標題改成這樣：
第一行「你現在看到的」
第二行「這個網站」（用主色 brand-500）
第三行「是 Claude Code 做的」

        然後在 Hero 右側加一個深色 terminal 風格的裝飾方塊，裡面顯示幾行假的 claude 指令輸出，讓人一看就知道這是 AI 生的。`,
        tip: '每次改完你覺得沒問題，就執行一次 git commit 存檔。改壞了還能 revert 回來。',
      },
      {
        title: '本章驗收：首頁真的跑起來',
        body: '這章不要求你一次做出完美設計，只要求你有一個能在瀏覽器開啟、能被 Claude 繼續修改的 Next.js 專案。',
        code: {
          lang: 'text',
          content: `□ npm run dev 可以正常啟動
□ 瀏覽器開啟 http://localhost:3000 可以看到首頁
□ 首頁至少有 Hero、課程大綱、價格、FAQ 幾個區塊
□ 改一段文案後，瀏覽器會熱更新
□ 執行 git status 可以看到你改過的檔案
□ 已經做過一次 git add / git commit 存檔`,
        },
        claude: `請幫我檢查目前 Next.js 專案是否已經達到第一章驗收標準：
1. npm run dev 能不能跑
2. 首頁有哪些 section
3. 有沒有明顯的 console error 或 build error
4. 哪些檔案應該先 git commit

請不要重寫整個專案，只做檢查與必要修正。`,
      },
    ],
  },

  // ── ch02 ─────────────────────────────────────────────────────────────────
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
    steps: [
      {
        title: '建立 Supabase 專案',
        body: '登入 Supabase（帳號在 ch00 已建好），點右上角「New project」建一個新專案。建完之後點左側「Project Settings → API Keys」，把這三個值複製起來：\n\n• Project URL（長得像 https://xxx.supabase.co）\n• Publishable key（sb_publishable_ 開頭，可以放前端）\n• Secret key（sb_secret_ 開頭，許可權最高，只能放後端）\n\n舊專案可能只看到「Legacy API keys」分頁的 anon / service_role（eyJ 開頭的長字串），一樣可以用；但 Supabase 已公告舊格式會在 2026 年底前淘汰，新專案請用新格式。',
        link: { text: '開啟 Supabase Dashboard', url: 'https://supabase.com/dashboard' },
        screenshot: 'supabase-api-keys.png',
        warning: 'Secret key（或舊的 service_role key）絕對不能公開！只能在後端用，不能 commit 到 git，不能放到前端程式碼。Secret key 從瀏覽器呼叫會被 Supabase 直接拒絕（401），這是正常的保護。',
      },
      {
        title: '把 Supabase 的 key 存到專案',
        body: '在專案根目錄建立 .env.local 檔案，把剛才複製的值填進去：',
        code: {
          lang: 'bash',
          content: `NEXT_PUBLIC_SUPABASE_URL=https://你的專案id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...（Publishable key；舊專案是 eyJ 開頭的 anon key）
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...（Secret key；舊專案是 eyJ 開頭的 service_role key）
NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
        },
      },
      {
        title: '叫 Claude 把 Google 登入接起來',
        claude: `幫我加 Google 登入功能，用 Supabase Auth。

登入頁沿用首頁的主色和字體，置中一張卡片就好。

我要的效果：
- 有一個 /login 頁面，上面有「用 Google 登入」按鈕
- 點按鈕後跳出 Google 登入視窗
- 登入成功後跳到 /dashboard 頁面
- 導覽列右上角：還沒登入顯示「登入」按鈕，登入後顯示我的 email 和「登出」按鈕

.env.local 裡已經有 Supabase 的設定了。`,
        warning: '需要互動的登出按鈕放 Client Component；服務端以 getUser 驗證身分。Cookie 的 setAll 型別請沿用已安裝 @supabase/ssr 的 SetAllCookies 型別，例如 Parameters<SetAllCookies>[0]，不要把 Cookie options 隨意改成 object。Next.js 16 使用 proxy.ts；舊版 middleware.ts 請依實際 Next 版本處理。',
      },
      {
        title: '去 Google Cloud Console 開 OAuth 憑證',
        body: '1. 開啟 Google Cloud Console\n2. 左上角選或建立一個專案\n3. 左側選單 → APIs & Services → Credentials\n4. 點「+ CREATE CREDENTIALS」→「OAuth client ID」\n5. Application type 選「Web application」\n6. Authorized redirect URIs 現在先加本機這一個就好：',
        link: { text: '開啟 Google Cloud Console', url: 'https://console.cloud.google.com/apis/credentials' },
        code: {
          lang: 'text',
          content: `https://你的Supabase專案.supabase.co/auth/v1/callback`,
        },
        screenshot: 'google-cloud-oauth-credentials.png',
        warning: '經由 Supabase 的 Google OAuth，Google Console 的 Authorized redirect URI 要填 Supabase provider 顯示的 /auth/v1/callback。網站的 /api/auth/callback 則填在 Supabase Redirect URLs；這是兩個不同的跳轉，不要混用。',
      },
      {
        title: '在 Supabase 啟用 Google 登入',
        body: '1. Supabase Dashboard → Authentication → Providers\n2. 找到 Google，點開啟用\n3. 把 Client ID 和 Client Secret 貼進去\n4. 存檔',
        link: { text: '開啟 Supabase Auth Providers', url: 'https://supabase.com/dashboard/project/_/auth/providers' },
        screenshot: 'supabase-google-provider.png',
        tip: 'Supabase 這個頁面也會給你一個 Callback URL（格式是 https://xxx.supabase.co/auth/v1/callback），這個也要加回到 Google Cloud Console 的 redirect URIs 裡。',
      },
      {
        title: '設定 Supabase Site URL（最多人忘記的一步）',
        body: '這個沒設好，登入完成後 OAuth code 會跑到錯的地方。\n\n→ Authentication → URL Configuration\n→ Site URL 現在填 http://localhost:3000（本機開發用）\n→ Redirect URLs 加入 http://localhost:3000/api/auth/callback',
        link: { text: '開啟 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        screenshot: 'supabase-site-url.png',
        warning: '⚠️ 現在先填 localhost。部署到 Vercel 後（ch05），一定要回來把 Site URL 改成你的 Vercel 網址，並在 Redirect URLs 補加 https://你的網址.vercel.app/api/auth/callback，否則線上登入會一直 redirect 回 localhost。',
      },
      {
        title: '本章驗收：Google 登入跑完一次',
        body: '不要只看按鈕有出現。一定要真的按 Google 登入，完成授權，再回到你的網站。',
        code: {
          lang: 'text',
          content: `□ /login 頁面有 Google 登入按鈕
□ 點 Google 登入後會跳到 Google 授權畫面
□ Supabase 完成 Google 回呼後轉到 http://localhost:3000/api/auth/callback
□ 最後會進入 /dashboard 或顯示已登入狀態
□ Navbar 或 dashboard 能顯示你的 email
□ Supabase Auth > Users 裡看得到這個使用者`,
        },
        claude: `我的 Google 登入流程卡住了。請你用系統化方式幫我檢查：
1. Supabase URL / anon key / service role key 是否正確
2. Google Cloud redirect URI 是否與 Supabase 的 /auth/v1/callback 完全一致
3. Supabase Provider 裡的 Client ID / Secret 是否正確
4. Supabase Site URL 和 Redirect URLs 是否正確
5. auth callback route 是否正確處理 code exchange

請先列出最可能的 3 個原因，再逐項檢查，不要直接重寫整個 auth。`,
      },
    ],
  },

  // ── ch03 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch03',
    title: '環境變數地獄：那個 \\n 讓 Stripe 直接拒收',
    duration: '約 35 分',
    description:
      '我用 echo 把 Stripe 的 secret key 傳給 vercel env add。然後 Stripe 回傳 500，說 API key 無效。\n\n' +
      '原因是 echo 在 Windows 會在字串結尾加換行符。Stripe 拿到的 key 是 sk_test_xxx 加一個看不見的 \\n，直接拒收。\n\n' +
      '這種問題沒有任何文件會教你。這章紀錄了正確的設定方式，以及怎麼用 debug route 快速確認 env 有沒有帶入。',
    keyPoints: [
      'echo 在 Windows 會加換行符——用 Vercel Dashboard 貼才安全',
      'Vercel env var 的正確設定方式',
      '建立 /api/debug 快速確認所有 env 狀態',
      '本機 .env.local 與 Vercel 線上環境的差異',
    ],
    steps: [
      {
        title: '.env.local 正確格式',
        body: '在專案根目錄建立這個檔案。Supabase 的 key 現在就能填，Stripe 的 key 等 ch04 建好帳號後再補進來：',
        code: {
          lang: 'bash',
          content: `# ── 現在填（從 Supabase Dashboard 複製）──
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ── ch04 填（建好 Stripe 商品後再補）──
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...`,
        },
        warning: '.env.local 絕對不能 commit 到 git！確認專案裡的 .gitignore 有包含 .env.local 這一行。',
      },
      {
        title: '⚠️ 之後加到 Vercel 時——一定要用 Dashboard 手動貼，不要用指令',
        body: '⚠️ 這步是給 ch05 部署時的提醒，現在不需要操作。Vercel 專案在 ch05 才會建立。\n\n記住一個原則：以後把 env var 加到 Vercel 時，一律用 Vercel 網站手動貼，不要用終端機指令。\n\n操作方式（ch05 部署完再做）：\n1. 開啟你的 Vercel 專案\n2. 點上方 Settings → Environment Variables\n3. 一個一個手動加，直接複製貼上值',
        link: { text: '開啟 Vercel Dashboard（ch05 部署後再開）', url: 'https://vercel.com/dashboard' },
        screenshot: 'vercel-env-vars.png',
        warning: '⚠️ 換行符地獄警告：絕對不要用終端機指令（echo、printf、pipe）把值傳給 Vercel。Windows 的 echo 會在字串尾端自動加上換行符 \\n，Stripe 拿到帶換行符的 key 會直接拒收，錯誤訊息是 Invalid character in header。一律手動在 Vercel Dashboard 貼上，貼完確認值的結尾沒有 ¶ 符號。',
      },
      {
        title: '換行符地獄：Stripe 連線直接炸掉',
        body: '我在這個坑裡踩了整個下午。\n\n用 CLI 指令把 STRIPE_SECRET_KEY 推到 Vercel，然後 Stripe 回傳：\n\nStripeConnectionError: Invalid character in header content ["Authorization"]\n\n錯誤訊息說 Authorization header 有非法字元。原因是用 CLI pipe 的方式（echo 或 printf）設定 env var，Windows 環境會在字串尾端自動加上換行符 \\n。Stripe 把 key 直接塞進 HTTP header，換行符在 header 裡是非法字元，直接拒收。\n\n你可以在 Vercel Dashboard 編輯 env var 的時候看到它——值的最後會有一個 ¶ 符號，就是那個換行符。\n\n解法：一律用 Vercel Dashboard 手動貼值，不要用指令。',
        code: {
          lang: 'text',
          content: `// 你在 Vercel Function Logs 看到的錯誤長這樣：
StripeConnectionError: An error occurred with our connection to Stripe.
  detail: TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["Authorization"]

// 排查順序：
1. Vercel Dashboard → Settings → Environment Variables
2. 點開 STRIPE_SECRET_KEY 編輯
3. 看值的最後有沒有 ¶ 符號（換行符）
4. 有的話刪掉重新手動貼，不要用 CLI 指令`,
        },
        tip: '如果你真的想用 CLI，可以請 Claude 在程式碼裡自動幫 Stripe key 去掉前後空白，這樣就算不小心帶了換行符也不會炸。',
      },
      {
        title: '叫 Claude 建立診斷頁面，方便你隨時檢查',
        body: '遇到問題的時候，開啟這個頁面就能馬上知道哪裡出錯。貼給 Claude：',
        claude: `幫我建一個 /api/debug 診斷頁面。

開啟這個頁面，我要能直接看到：
- 現在有沒有登入、是哪個帳號
- 這個帳號有沒有購買紀錄
- 所有環境變數有沒有設定好

環境變數只顯示「已設定」或「未設定」就好，不要把實際的值顯示出來。`,
        warning: '/api/debug 會透露登入狀態和購買紀錄，上線前請 Claude 加上保護：只有你的 Email 登入時才回應，其他人一律 404；正式對外前也可以直接刪掉。',
        tip: '部署完之後，遇到任何問題先開啟 /api/debug 看。沒登入或 env 顯示「未設定」，就知道問題在哪了。\n\n⚠️ 現在開啟 /api/debug，「購買紀錄」那欄可能會顯示查詢錯誤——這是正常的，因為 purchases 資料表要在 ch04 才會建立。env 和登入狀態正常就沒問題了。',
      },
      {
        title: '本機測試 vs 線上環境的差異',
        body: '這幾個 env 在本機和線上要填不同的值：',
        code: {
          lang: 'text',
          content: `本機 .env.local：
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...（測試模式）
STRIPE_WEBHOOK_SECRET=whsec_...（stripe listen 產生的本機版）

Vercel 線上環境：
NEXT_PUBLIC_SITE_URL=https://你的網址.vercel.app
STRIPE_SECRET_KEY=sk_test_...（線上驗收仍用 Sandbox）
STRIPE_WEBHOOK_SECRET=whsec_...（同一 Sandbox 的線上 endpoint secret）
AI_LESSON_PAYMENTS_ENABLED=false
AI_LESSON_STRIPE_MODE=sandbox
# 線上部署不等於切 live；商家資格與完整驗收後才自行啟用。`,
        },
      },
      {
        title: '本章驗收：env 可以被安全檢查',
        body: '這章的重點不是把所有第三方服務接完，而是讓你有一個安全的檢查工具。之後任何錯誤，先看 /api/debug。',
        code: {
          lang: 'text',
          content: `□ .env.local 存在，而且沒有被 commit
□ .gitignore 有包含 .env.local
□ /api/debug 可以開啟
□ /api/debug 不會顯示任何完整 secret，只顯示 SET / MISSING
□ Supabase 相關 env 都是 SET
□ Stripe 相關 env 如果還沒到 ch04，可以先是 MISSING
□ 你知道本機 webhook secret 和線上 webhook secret 是不同的`,
        },
        warning: '如果 /api/debug 直接把 key 印出來，立刻叫 Claude 改掉。debug 頁只能顯示狀態，不能顯示實際金鑰。',
      },
    ],
  },

  // ── ch04 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch04',
    title: '金流串接：Stripe Checkout + Webhook 完整實作',
    duration: '約 50 分',
    description:
      '付款功能不能直接上線測。Stripe 有沙盒環境，用測試卡 4242 4242 4242 4242，打多少都不會真的扣錢。\n\n' +
      'Stripe 付款成功，但你的資料庫沒更新。原因是 webhook 沒設好。這章完整講 webhook endpoint 的建立、驗證、purchases 資料表的寫入。\n\n' +
      '跑完這章，你的網站能完整走完：按購課 → Stripe 付款頁 → 付款成功 → purchases 寫入 → 進入 Dashboard。',
    keyPoints: [
      'Stripe 產品與 Price ID 建立，沙盒環境設定',
      'Checkout Session 生成與付款後跳轉邏輯',
      'Webhook endpoint 建立、簽名驗證、寫入資料庫',
      '用測試卡 4242 把整條付款流程端到端跑通',
    ],
    steps: [
      {
        title: '先建立 Stripe 帳號，並確認你在 Test mode',
        body: '如果你還沒有 Stripe 帳號，先到 stripe.com 註冊。這章先用測試模式，不需要真的收款，也不需要馬上完成正式營業資料審核。登入後請確認 Dashboard 左下角或上方切換在 Test mode。',
        link: { text: '開啟 Stripe Dashboard', url: 'https://dashboard.stripe.com/' },
        warning: '本章只做 Sandbox 驗收。不要拿 live secret key 測試，不要把任何 key 貼給 AI。線上 endpoint 可以仍屬 Sandbox，必須核對模式與帳號。',
        tip: '註冊資格與要求依國家、商家及帳號而異。需要新條款、公司資料或付費時先自行評估；無法啟用 Sandbox 可先做明確標示的本機合成測試，不能假稱 Stripe 端已通過。',
      },
      {
        title: '在 Stripe 建立商品和價格',
        body: '1. 開啟 Stripe Dashboard（確認左下角是 Test mode）\n2. 左側 Product catalog → + Add product\n3. 填入課程名稱\n4. 價格填你的售價（例如 490），幣別選 TWD，選「One time」\n5. 建立後點進商品，複製 Price ID（格式是 price_xxx）',
        link: { text: '開啟 Stripe Product Catalog', url: 'https://dashboard.stripe.com/test/products' },
        screenshot: 'stripe-create-product.png',
        warning: 'Dashboard 的售價填 NT$490；Stripe Price.unit_amount 和 session.amount_total 使用最小貨幣單位，TWD 收款 NT$490 = 49000。TWD 的整數規則針對 payouts，不能套用到 charges。資料庫存 49000 整數，顯示時才轉成 NT$490。',
      },
      {
        title: '把 Stripe keys 補入 .env.local',
        body: 'ch03 建好的 .env.local 裡，ch04 區段填入這兩行（去 Stripe Dashboard → Developers → API keys 複製 Secret key）：',
        link: { text: '開啟 Stripe API Keys', url: 'https://dashboard.stripe.com/test/apikeys' },
        code: {
          lang: 'bash',
          content: `STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...（剛才複製的 Price ID）`,
        },
      },
      {
        title: '在 Supabase 建立購買紀錄資料表',
        body: '以下是全新個人 Sandbox 專案的範例。先讀 schema 與許可權；共享或已有 purchases 的資料庫要寫增量 migration，不能直接重建表。購買由驗簽後的服務端寫入，學員只能讀自己的紀錄。',
        link: { text: '開啟 Supabase SQL Editor', url: 'https://supabase.com/dashboard/project/_/sql/new' },
        code: {
          lang: 'sql',
          content: `create table public.purchases (
  id                uuid primary key default gen_random_uuid(),
  app_id            text not null default 'ai-lesson' check (app_id = 'ai-lesson'),
  user_id           uuid references auth.users(id) not null,
  stripe_session_id text not null,
  stripe_payment_intent text,
  product_id        text not null,
  tier              text not null,
  amount            integer,
  currency          text,
  status            text not null default 'completed',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique (app_id, stripe_session_id)
);

alter table public.purchases enable row level security;
revoke all on public.purchases from anon, authenticated;
grant select on public.purchases to authenticated;
grant all on public.purchases to service_role;

create policy "Users can view own purchases"
  on public.purchases for select to authenticated
  using (app_id = 'ai-lesson' and (select auth.uid()) = user_id);`,
        },
        tip: '共享 Jerry Platform 還有 membership 政策，請以專案已存在的 schema 為準。本例沒有把任何學員設成可寫購買紀錄。',
      },
      {
        title: '叫 Claude 把 Stripe 付款接起來',
        claude: `幫我把 Stripe 付款接起來（Checkout Session ＋ Webhook）。

我要的功能：
1. 點「購課」按鈕 → 跳到 Stripe 付款頁
2. 返回 /success 後，服務端查目前帳號及該 Session 的購買紀錄；沒有已驗證紀錄只顯示等待確認
3. Webhook 驗簽後讀回付清狀態、金額、幣別、Price、app/product/tier/user，原子寫入並回讀 Supabase；退款先到、事件重送也不能重新開通
4. 已買過的使用者再點購課按鈕，直接進 /dashboard，不用重複付款

.env.local 裡已有 STRIPE_SECRET_KEY 和 STRIPE_PRICE_ID。
幣別是臺幣（TWD），資料庫 amount 存 Stripe 原始最小單位整數，490 元 = 49000；顯示價格時才除以 100。

⚠️ 重要：Webhook handler 裡讀取 request body 要用 request.text()，不是 request.json()，不然 Stripe signature 驗證會失敗。`,
        warning: 'Webhook 如果沒有觸發，先去 Vercel Function Logs 看錯誤訊息。最常見的原因是 STRIPE_WEBHOOK_SECRET 填錯、或 request body 用錯方式讀取。\n\n如果 TypeScript 出現 `apiVersion` 相關的型別錯誤，告訴 Claude：「把 Stripe 初始化的 apiVersion 改成已安裝 SDK 支援的版本，或是直接拿掉 apiVersion 讓 TypeScript 自動推斷」。',
      },
      {
        title: '本機測試 Webhook（用 stripe listen）',
        body: '在正式部署前，先用 stripe CLI 在本機測試 webhook 流程。開啟另一個終端機視窗執行：',
        code: {
          lang: 'bash',
          content: `stripe listen --forward-to localhost:3000/api/webhooks/stripe
# 執行後終端機會顯示一組 whsec_... 本機 webhook secret
# 把這個值填進 .env.local 的 STRIPE_WEBHOOK_SECRET`,
        },
        warning: '⚠️ stripe listen 產生的 webhook secret 是本機暫時版，只在本機有效。部署到 Vercel 後，要在 Stripe Dashboard 建立線上 Sandbox webhook endpoint，把那個 secret 更新進 Vercel env。這個步驟在 ch05 部署後做。',
        tip: 'stripe listen 跑著的時候，去瀏覽器點購課 → 用測試卡付款，終端機會顯示 webhook 有沒有送到你的 handler。',
      },
      {
        title: '用測試卡把整條流程跑一遍',
        body: '部署完之後，用下面的測試資料付款，確認每個環節都正常：',
        code: {
          lang: 'text',
          content: `卡號：4242 4242 4242 4242
到期：任意未來日期（例如 12/30）
CVC：任意三位數（例如 123）

預期流程：
付款成功 → 跳到 /success
Webhook 收到 → purchases 表新增一筆
再點購課按鈕 → 自動跳到 /dashboard（不再走付款流程）`,
        },
        tip: '付款後如果進不了 dashboard，去 /api/debug 確認 myPurchase 有沒有值。沒有的話可能是 webhook 沒打進來，去 Stripe Dashboard → Webhooks 看有沒有成功送達。',
      },
      {
        title: '本章驗收：付款真的解鎖課程',
        body: '這章一定要端到端跑完。只做到 Stripe Checkout 頁面跳出來，還不算完成。',
        code: {
          lang: 'text',
          content: `□ 點購課按鈕會進入 Stripe Checkout
□ 測試卡 4242 付款成功
□ 成功後回到 /success
□ stripe listen 終端機有收到 checkout.session.completed
□ Supabase purchases 表新增一筆資料
□ 再點一次購課，已購使用者會直接進 /dashboard
□ /api/debug 的 myPurchase 不再是 null`,
        },
        claude: `我的 Stripe 付款流程沒有完整解鎖 dashboard。請幫我照這個順序排查：
1. Checkout session metadata 裡有沒有 user_id
2. Webhook handler 是否用 request.text() 驗證 signature
3. STRIPE_WEBHOOK_SECRET 是否是目前 stripe listen 顯示的 whsec
4. purchases 表是否存在，欄位是否符合程式碼
5. 寫入 purchases 時是否用了 service role client
6. dashboard 查詢 purchases 的條件是否和 webhook 寫入一致

請先找原因，不要直接重構付款流程。`,
      },
    ],
  },

  // ── ch05 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch05',
    title: 'Vercel 部署：固定網域與版本驗收',
    duration: '約 30 分',
    description:
      '完成檢查後推送到已連線 Vercel 的 Git 分支，可以觸發部署。請讀回實際建置結果與網址，不保證固定部署時間。\n\n' +
      '但每次部署 Vercel 都給一個新的 URL。你要設定固定的 alias，讓同一個網址永遠指向最新版本。\n\n' +
      'git init、GitHub repo 建立、Vercel 連動、固定 alias 設定，這章完整走一遍。以後你任何專案要部署，套這個流程就對了。',
    keyPoints: [
      'git init + GitHub repo 建立與推送',
      'Vercel CLI 連動與自動部署設定',
      '固定 alias 設定——讓網址永遠不變',
      'CI/CD 流程：commit → push → 自動上線',
    ],
    steps: [
      {
        title: '建立 GitHub repo 並推上去',
        body: '先去 GitHub 建立一個新的空白 repo（不要勾選 Add a README），然後在終端機執行：',
        link: { text: '建立新的 GitHub Repo', url: 'https://github.com/new' },
        code: {
          lang: 'bash',
          content: `git init
git add .
git commit -m "init: initial commit"
git remote add origin https://github.com/你的帳號/你的專案名.git
git branch -M main
git push -u origin main`,
        },
        warning: '確認 .gitignore 裡有 .env.local！否則你的所有 API key 就公開在 GitHub 上了。',
      },
      {
        title: '用 Vercel CLI 連結專案（先連結，不急著部署）',
        body: 'ch00 已裝好 Vercel CLI。在專案資料夾裡直接跑：',
        code: {
          lang: 'bash',
          content: `vercel link`,
        },
        tip: 'vercel link 連線 CLI 目錄與 Vercel 專案；Git 自動部署可由 Dashboard 的 Import Git Repository 設定。直接跑 vercel 可能啟動部署，不能當成單純連結。',
        warning: '先確認 account、project 與環境變數，建置通過再部署。需要新付費資源或合約時先自行確認。',
      },
      {
        title: '先把所有 env var 加到 Vercel，再正式部署',
        body: '⚠️ 順序很重要：先加 env，再 deploy。\n\n1. 開啟 Vercel Dashboard → 你的專案 → Settings → Environment Variables\n2. 把 .env.local 裡的 Supabase、Stripe 等所有變數一個一個手動貼上（記得換行符地獄警告，不要用 CLI）\n3. 記得把這兩個改成線上版本：',
        link: { text: '開啟 Vercel Environment Variables', url: 'https://vercel.com/dashboard' },
        code: {
          lang: 'text',
          content: `NEXT_PUBLIC_SITE_URL → https://你的網址.vercel.app
STRIPE_WEBHOOK_SECRET → 等 Stripe 線上 Sandbox webhook 建好後再填（下一步）

# 加完 env 之後，正式部署：
vercel --prod`,
        },
        screenshot: 'vercel-env-vars.png',
        warning: 'Vercel 的 env var 加完後，一定要執行 vercel --prod 重新部署才會生效。',
      },
      {
        title: '部署完更新 Auth 回呼與 Sandbox Webhook',
        body: '拿到 Vercel 固定網址後，這兩個地方要同步更新，不然 Google 登入跟付款都會壞。\n\n**Supabase（Google 登入會壞）：**\n→ Authentication → URL Configuration\n→ Site URL 改成 https://你的網址.vercel.app\n→ Redirect URLs 加入 https://你的網址.vercel.app/api/auth/callback\n\n**Stripe 正式 Webhook（付款成功但 DB 不更新）：**\n1. Stripe Dashboard → Developers → Webhooks → + Add endpoint\n2. Endpoint URL 填：https://你的網址.vercel.app/api/webhooks/stripe\n3. 在同一 Sandbox 勾選 checkout.session.completed、checkout.session.async_payment_succeeded、charge.refunded、charge.dispute.created\n4. 建立後複製 Signing secret（whsec_xxx）\n5. 回 Vercel Settings → Environment Variables → 把 STRIPE_WEBHOOK_SECRET 換成這個新的 secret\n6. 重新執行 vercel --prod 讓新 secret 生效',
        link: { text: '開啟 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        warning: '每個 endpoint 的 signing secret 各自不同。CLI listener 與 Dashboard endpoint 不能混用；Sandbox 與 live 也分開。部署本身不代表已啟用 live 收款。',
      },
      {
        title: '之後的標準流程就這三行',
        body: '設定完之後，以後每次改東西就這樣：',
        code: {
          lang: 'bash',
          content: `git add .
git commit -m "fix: 你改了什麼"
git push
# 到 Vercel 讀回部署結果與 alias，再跑驗收；部署時間不固定。`,
        },
      },
      {
        title: '本章驗收：線上版可登入、可付款、可解鎖',
        body: '先用固定 Vercel 網址完整跑 Sandbox 流程；再確認 live 商家資格、服務政策與正式模式驗收。畫面或 HTTP200 不能單獨證明可以對外收款。',
        code: {
          lang: 'text',
          content: `□ Vercel 網址首頁能開啟
□ 線上 Google 登入能成功回到 Vercel 網址，不會回 localhost
□ 線上 /api/debug 顯示 siteUrl 是 Vercel 網址
□ Stripe Dashboard 已建立線上 Sandbox webhook endpoint
□ Vercel 的 STRIPE_WEBHOOK_SECRET 已換成線上 Sandbox webhook secret
□ 測試付款成功後，Supabase purchases 有資料
□ 付款後可以進入 /dashboard 看到課程內容`,
        },
        warning: '最常見的線上錯誤是：Supabase 還指向 localhost、Google Cloud 少加 Vercel callback、Vercel env 改完沒有重新部署。',
      },
    ],
  },

  // ── ch06 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch06',
    title: 'Debug 實錄：500、session 消失、purchases 查不到',
    duration: '約 60 分',
    description:
      '登入成功，點購課，白畫面，500 error。Vercel log 什麼都沒顯示。這種 debug 才是真實開發的日常。\n\n' +
      '我建了一個 /api/debug，直接回傳當前的 user session、env var 狀態、Supabase 連線狀態。三十秒定位問題。\n\n' +
      '這章整理了這個專案踩過的所有坑：session 為什麼線上上不見了、purchases 查不到怎麼排查、用 /api/debug 三十秒定位問題。',
    keyPoints: [
      '怎麼讀 Vercel function logs——找到真正的錯誤',
      '/api/debug 的設計：30 秒確認 session 與 env 狀態',
      'session 為什麼線上上消失——Supabase Site URL 設定',
      '付款成功但進不了 dashboard——RLS 和 serviceClient',
    ],
    steps: [
      {
        title: '遇到 500 先去 Vercel 看 log',
        body: '前端白畫面或 500，第一步去這裡找原因：\n\n1. Vercel Dashboard → 你的專案 → Deployments\n2. 點最新那筆 → 右側 Functions tab\n3. 找到出錯的 route，看詳細的 error message',
        link: { text: '開啟 Vercel Deployments', url: 'https://vercel.com/dashboard' },
        screenshot: 'vercel-function-logs.png',
      },
      {
        title: '常見錯誤對照表',
        code: {
          lang: 'text',
          content: `❌ STRIPE_SECRET_KEY is not defined
→ Vercel 上沒加這個 env，或 key 有換行符
→ 去 Vercel Dashboard 手動貼上，不要用指令

❌ invalid input syntax for type integer: "26.4"
→ 資料庫 amount 存原始最小單位整數；TWD 收款使用兩位小數
→ amount: session.amount_total（不要 / 100）

❌ JWSError JWSInvalidSignature
→ STRIPE_WEBHOOK_SECRET 用了本機版的
→ 換成 Stripe Dashboard 線上 webhook 的 signing secret

❌ 付款成功但進不了 dashboard
→ purchases 表的查詢被 RLS 擋住
→ 先核對 app_id、user_id、product_id、status 與 RLS，不要直接繞過授權
→ 使用者不能自行寫入或更改 purchases`,
        },
      },
      {
        title: 'Session 線上上消失怎麼辦',
        body: '本機登入正常，線上登入後立刻變回未登入狀態——確認這三個地方：',
        code: {
          lang: 'text',
          content: `① Supabase → Authentication → URL Configuration
   Site URL 是否已改成線上網址（不是 localhost）

② Supabase → Authentication → URL Configuration
   Redirect URLs 有沒有包含 https://你的網址.vercel.app/api/auth/callback

③ Vercel env var
   NEXT_PUBLIC_SITE_URL 是否是線上網址`,
        },
        link: { text: '開啟 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        warning: '這三個是連動的，任一個設錯都會造成 session 問題。改完一個要把另外兩個一起確認。',
      },
      {
        title: '用 /api/debug 三十秒定位問題',
        body: '遇到任何奇怪的問題，開啟瀏覽器去你的網站 /api/debug，看輸出：',
        code: {
          lang: 'json',
          content: `// 正常狀態長這樣：
{
  "user": { "id": "xxx", "email": "你的信箱" },  // null = session 問題
  "authError": null,
  "myPurchase": { "id": "xxx" },  // null = 購買沒寫進去
  "env": {
    "supabaseUrl": "SET",      // MISSING = 這個 env 沒設
    "stripeKey": "SET",
    "serviceRoleKey": "SET",
    "siteUrl": "https://..."   // 不能是 localhost
  }
}`,
        },
        tip: 'user 是 null → session 問題，看步驟 3。myPurchase 是 null 但有付款 → 去 Stripe Dashboard 確認 webhook 有沒有成功送達。',
      },
      {
        title: '急救包：把錯誤貼給 Claude 的固定格式',
        body: '門外漢最常犯的錯，是只跟 AI 說「壞掉了」。你要把環境、操作、錯誤訊息、預期結果一次貼完整，Claude 才能穩定幫你修。',
        code: {
          lang: 'text',
          content: `問題描述：
我正在做到第 __ 章第 __ 步，目標是 __。

我做了什麼：
1. __
2. __
3. __

目前結果：
__

預期結果：
__

錯誤訊息或 log：
\`\`\`
貼完整錯誤，不要只貼最後一行
\`\`\`

/api/debug 結果：
\`\`\`json
貼 SET / MISSING 狀態，不要貼 secret
\`\`\``,
        },
        claude: `請你先不要重寫功能。請根據我提供的錯誤訊息，用「最小修改」原則排查：
1. 先判斷問題屬於 env、auth、database、Stripe webhook、還是 deployment
2. 列出最可能的 3 個原因
3. 每次只改一個地方
4. 改完告訴我要跑哪個指令或開啟哪個頁面驗證
5. 如果需要我去後臺設定，請用一步一步 checklist 說明`,
      },
      {
        title: '本章驗收：你能自己定位 80% 的錯誤',
        body: '完成這章後，你不需要記住所有錯誤，但要知道第一時間去哪裡看。',
        code: {
          lang: 'text',
          content: `□ 500 error 先看 Vercel Function Logs
□ 登入問題先看 Supabase URL Configuration 和 Google redirect URI
□ 付款成功但沒解鎖，先看 Stripe Webhooks 和 purchases 表
□ env 問題先看 /api/debug
□ 每次求助 AI 時，能貼完整錯誤與操作步驟
□ 修完一個問題後會立刻驗證，而不是一次改十個地方`,
        },
      },
    ],
  },

  // ── ch07 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch07',
    title: '同樣的架構，套到你自己的專案',
    duration: '約 40 分',
    description:
      '你學到的不只是這個網站。SaaS 工具、個人作品集、接案的產品原型，架構都是一樣的。學的是方法，不是模板。\n\n' +
      'Landing Page 換文案，Supabase 換資料表，Stripe 換你的商品。其他不動。你下一個專案，從這個模板開始，省掉八成的架設時間。',
    keyPoints: [
      '哪些部分換掉、哪些直接套——模板拆解邏輯',
      'Supabase 資料表設計：對應你自己的業務需求',
      'Stripe 商品替換：從課程到任何數位產品',
      '下一步：把你自己的想法建出來',
    ],
    steps: [
      {
        title: '這個模板的四個模組',
        body: '把整個專案拆成四塊，每塊各自獨立替換：',
        code: {
          lang: 'text',
          content: `① Landing Page
   首頁各區塊（Hero、大綱、價格、FAQ）
   → 換文案、換設計，架構不動

② 登入系統
   app/login/ + app/api/auth/callback/ + lib/supabase/
   → 幾乎不需要動，Google OAuth 通用

③ 付款系統
   app/api/checkout/ + app/api/webhooks/ + app/success/
   → 只需要換 STRIPE_PRICE_ID，改 purchases 表結構

④ 內容區域
   app/dashboard/ + lib/course-data.ts
   → 換成你要賣的東西（課程、工具、下載...）`,
        },
      },
      {
        title: '叫 Claude 幫你改成自己的產品',
        claude: `我想把這個專案改成 [你的產品描述]。請先讀整個專案，列出首頁各區塊在哪些檔案，再幫我：
1. Hero 的文案換成 [你的產品標題和賣點]
2. 價格區塊改成 [你的價格與方案]
3. 痛點／你會學到什麼換成 [你的目標客群的痛點]
4. 課程或產品內容資料換成 [你的內容結構]

版面結構不變，只換內容。改完列出改了哪些檔案。`,
        tip: '把 [括號內的東西] 換成你自己的產品描述，然後貼給 Claude。先讓它「列出檔案」再改，比直接指定檔名可靠，因為每個人做出來的專案結構不完全一樣。',
      },
      {
        title: '把你的內容先整理成資料，不要先改畫面',
        body: '如果你的下一個產品也是課程、電子書、模板包或會員內容，請先把內容整理成資料結構，再交給 Claude 改 dashboard。這樣比較不會把文案散落在十幾個元件裡，之後也比較好改。',
        code: {
          lang: 'ts',
          content: `export const productContent = {
  title: '你的產品名稱',
  subtitle: '一句話說明交付結果',
  modules: [
    {
      id: 'm01',
      title: '第一個模組',
      outcome: '學完會得到什麼',
      steps: ['步驟 1', '步驟 2', '步驟 3'],
    },
  ],
}`,
        },
        claude: `請先不要改 UI。請幫我把我的新產品內容整理成 TypeScript 資料檔，格式包含 title、subtitle、modules、每個 module 的 outcome 和 steps。

整理完後，再告訴我 dashboard 需要改哪些元件來讀這份資料。`,
        tip: '先資料化，再改 UI。這個順序會讓你之後新增第二門課、第二個產品、第二種 dashboard 時容易很多。',
      },
      {
        title: '從這個模板開始新專案',
        body: '先確認模板授權及秘密是否排除，再 clone 到新的資料夾並開新分支。保留原本歷史；新 remote 與部署設定另行確認。',
        code: {
          lang: 'bash',
          content: `git clone https://github.com/你的帳號/ai-lesson.git 你的新專案
cd 你的新專案

git switch -c product-draft
git status --short
git remote -v
# 保留原始 .git；先檢查授權與 remote，再自行設定新 repo。`,
        },
      },
      {
        title: '新專案的 checklist',
        body: '每次從這個模板開新專案，要做的事：',
        code: {
          lang: 'text',
          content: `□ Supabase：建新專案，複製新的 URL 和 keys
□ Google Cloud：建新的 OAuth 憑證，更新 redirect URIs
□ Stripe：建新商品，複製新的 STRIPE_PRICE_ID
□ .env.local：填入以上所有新的 keys
□ Vercel：建新部署，加所有 env vars
□ Supabase Site URL：改成新的 Vercel 網址
□ Stripe Webhook：指向新的 Vercel 網址`,
        },
        tip: '這個 checklist 大概花 30 分鐘，比從零開始省了幾天。',
      },
      {
        title: '本章驗收：你能把模板變成第二個產品',
        body: '這章完成後，你應該不是只有一個課程網站，而是知道怎麼把同一套架構複製到下一個產品。',
        code: {
          lang: 'text',
          content: `□ 你能說出這個模板的四個模組：Landing、Auth、Payment、Dashboard
□ 你知道換產品時哪些地方要改文案，哪些地方要改資料表
□ 你知道每個新產品都要有新的 Supabase / Stripe / Vercel 設定
□ 你知道不能沿用舊專案的 webhook secret
□ 你能用 checklist 開出第二個產品草稿
□ 你知道什麼時候該請 Claude 改文案，什麼時候該請 Claude 改架構`,
        },
      },
    ],
  },
]
export const lessons = attachWorkbook('claude-code', baseLessons)
