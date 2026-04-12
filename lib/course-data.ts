import type { Step } from '@/app/dashboard/StepGuide'

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

export const lessons: Lesson[] = [

  // ── ch00 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch00',
    title: '準備工作：帳號申請 + 環境安裝',
    duration: '約 20 分',
    description:
      '開始之前，你需要五個帳號和幾個工具。這章把每個步驟都整理好了，照著做就能把環境準備好。\n\n' +
      '所有工具都有免費方案，信用卡不是必須的。唯一要花錢的是 Claude Code Desktop 的訂閱，月費約 $20 USD。',
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
   → 用 Google 帳號登入建立

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
        body: '去官方網站下載，選你的作業系統版本安裝。裝完打開，用你的 Claude 帳號登入。',
        link: { text: '下載 Claude Code Desktop', url: 'https://claude.ai/download' },
        tip: 'Claude Code Desktop 需要訂閱 Claude Pro（約 $20/月）才能使用。這是這堂課唯一需要付費的工具。',
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
        body: 'Stripe CLI 要在你的 Windows 本機安裝，不是透過 Claude Code。\n\n打開「終端機」或「PowerShell」，執行下面其中一個指令：',
        code: {
          lang: 'bash',
          content: `# 方法一（推薦）— 用 winget：
winget install Stripe.StripeCLI

# 方法二 — 用 Scoop（如果有裝）：
scoop install stripe`,
        },
        warning: '不要在 Claude Code 的 Chat 分頁貼這個指令——Chat 是 Linux 環境，winget 跑不起來。要在你的 Windows 終端機直接執行。',
        tip: 'Stripe CLI 在 ch04 本機測試 Webhook 才會用到（stripe listen --forward-to localhost:3000/api/webhooks/stripe）。安裝完執行 stripe --version 確認成功，到時候直接用。',
      },
      {
        title: '認識 Claude Code 的技能系統（Skill）',
        body: '在 Claude Code Desktop 輸入 / 可以看到所有內建技能的清單。這堂課最常用到的幾個：',
        code: {
          lang: 'text',
          content: `/ui-ux-pro-max   → 啟用 UI/UX 設計模式，讓 Claude 生出更精緻的介面
/simplify        → 檢查並優化你剛寫好的程式碼，去掉不必要的複雜度
/commit          → 自動幫你寫 git commit message，不用自己想
/debug           → 系統化 debug 模式，Claude 會一步步找出錯誤原因
/review-pr       → 檢查你的程式碼有沒有問題，上線前跑一遍`,
        },
        tip: '技能會持續更新。直接在 Claude Code 輸入 / 查看最新的完整清單，每個技能都有說明。不用背，需要的時候查就好。',
      },
    ],
  },

  // ── ch01 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch01',
    title: '一句話，整個網站生出來',
    duration: '約 45 分',
    description:
      '我跟 Claude Code 說：幫我建一個賣線上課程的網站，要有 Google 登入和 Stripe 付款。然後它就開始動了。\n\n' +
      'Navbar、Hero section、痛點卡片、課程大綱、學員回饋、比較表、FAQ、頁腳——一個下午全部生完。\n\n' +
      'AI 寫出什麼，取決於你說了什麼。這章教你怎麼把一個模糊的想法，拆解成 Claude Code 能直接動手的需求。',
    keyPoints: [
      '怎麼把模糊想法拆解成 AI 能執行的需求描述',
      'Landing Page 各 section 的生成順序與調整方式',
      '版面規劃、Tailwind 設計系統的快速應用',
      '為什麼「改一點」比「重新生」更有效率',
    ],
    steps: [
      {
        title: '建立 Next.js 專案',
        body: '打開 Claude Code Desktop，選一個你想放專案的資料夾，然後貼這段給它：',
        claude: `幫我建立一個 Next.js 16 的專案，名稱叫 ai-lesson。
問到設定的時候 TypeScript 選 Yes、Tailwind 選 Yes，其他都選預設值。
建完之後進入專案資料夾，告訴我成功了。`,
        tip: '這堂課用 Next.js 16 + Tailwind v4。Tailwind v4 的設定方式和以前不一樣：不需要 tailwind.config.ts，改在 globals.css 裡用 @import "tailwindcss" 和 @theme 定義自訂顏色。如果 Claude 問你要放在哪個位置，告訴它你想放的資料夾路徑就好。',
      },
      {
        title: '告訴 Claude 你要什麼樣的網站',
        body: '專案建好之後，繼續在 Claude Code Desktop 貼這段：',
        claude: `幫我參考這個網站的設計，幫我建一個一樣的課程銷售首頁：
https://ailesson-two.vercel.app/

把課程名稱、文案換成我的內容，整體版型、配色、風格都照這個網站做。
建完之後告訴我怎麼在瀏覽器預覽。`,
        warning: '不要一次叫它做太多。先讓它建好整體、能在瀏覽器看到之後，再慢慢調整細節。如果 build 出現「找不到 brand-500 顏色」或網頁沒有橘色，告訴 Claude：「幫我在 globals.css 的 @theme 裡定義 brand-50 到 brand-900 的橘色系顏色，用 oklch 格式」，它會補上去。',
        tip: '想讓 UI 更精緻的話，輸入 /ui-ux-pro-max 啟用設計模式，再告訴 Claude 你想改哪個區塊。',
      },
      {
        title: '想改哪裡，直接描述給 Claude',
        body: '看到不滿意的地方，不要自己去改程式碼，繼續告訴 Claude：',
        claude: `Hero 的大標題改成這樣：
第一行「你現在看到的」
第二行「這個網站」（用橘色 brand-500）
第三行「是 Claude Code 做的」

然後在 Hero 右側加一個深色 terminal 風格的裝飾方塊，裡面顯示幾行假的 claude 指令輸出，讓人一看就知道這是 AI 生的。`,
        tip: '每次改完你覺得沒問題，就執行一次 git commit 存檔。改壞了還能 revert 回來。',
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
        body: '登入 Supabase（帳號在 ch00 已建好），點右上角「New project」建一個新專案。建完之後點左側「Project Settings → API」，把這三個值複製起來：\n\n• Project URL（長得像 https://xxx.supabase.co）\n• anon / public key（很長的 JWT）\n• service_role key（另一個，權限更高）',
        link: { text: '打開 Supabase Dashboard', url: 'https://supabase.com/dashboard' },
        screenshot: 'supabase-api-keys.png',
        warning: 'service_role key 絕對不能公開！只能在後端用。不能 commit 到 git，不能放到前端程式碼。',
      },
      {
        title: '把 Supabase 的 key 存到專案',
        body: '在專案根目錄建立 .env.local 檔案，把剛才複製的值填進去：',
        code: {
          lang: 'bash',
          content: `NEXT_PUBLIC_SUPABASE_URL=https://你的專案id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（anon key）
SUPABASE_SERVICE_ROLE_KEY=eyJ...（service role key）
NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
        },
      },
      {
        title: '叫 Claude 把 Google 登入接起來',
        claude: `幫我加 Google 登入功能，用 Supabase Auth。

參考這個登入頁面的設計風格：https://ailesson-two.vercel.app/login

我要的效果：
- 有一個 /login 頁面，上面有「用 Google 登入」按鈕
- 點按鈕後跳出 Google 登入視窗
- 登入成功後跳到 /dashboard 頁面
- 導覽列右上角：還沒登入顯示「登入」按鈕，登入後顯示我的 email 和「登出」按鈕

.env.local 裡已經有 Supabase 的設定了。`,
        warning: '導覽列需要同時讀取登入狀態（Server）和處理登出點擊（Client）。如果 Claude 生出來的 Navbar 有錯，告訴它：「Navbar 需要拆成 Server Component 讀取用戶資訊，加上 Client Component 處理登出按鈕」。\n\n如果 build 出現 `Parameter \'cookiesToSet\' implicitly has an \'any\' type` 這個 TypeScript 錯誤，告訴 Claude：「幫我修正 supabase/server.ts 和 middleware.ts 裡 setAll 的型別，參數要明確標注為 { name: string; value: string; options?: object }[]」。',
      },
      {
        title: '去 Google Cloud Console 開 OAuth 憑證',
        body: '1. 打開 Google Cloud Console\n2. 左上角選或建立一個專案\n3. 左側選單 → APIs & Services → Credentials\n4. 點「+ CREATE CREDENTIALS」→「OAuth client ID」\n5. Application type 選「Web application」\n6. Authorized redirect URIs 加這兩個：',
        link: { text: '打開 Google Cloud Console', url: 'https://console.cloud.google.com/apis/credentials' },
        code: {
          lang: 'text',
          content: `http://localhost:3000/auth/callback
https://你的線上網址.vercel.app/auth/callback`,
        },
        screenshot: 'google-cloud-oauth-credentials.png',
        warning: '兩個都要加！本機一個、線上一個。少加一個，那個環境的登入就壞掉。建完複製 Client ID 和 Client Secret。',
      },
      {
        title: '在 Supabase 啟用 Google 登入',
        body: '1. Supabase Dashboard → Authentication → Providers\n2. 找到 Google，點開啟用\n3. 把 Client ID 和 Client Secret 貼進去\n4. 存檔',
        link: { text: '打開 Supabase Auth Providers', url: 'https://supabase.com/dashboard/project/_/auth/providers' },
        screenshot: 'supabase-google-provider.png',
        tip: 'Supabase 這個頁面也會給你一個 Callback URL（格式是 https://xxx.supabase.co/auth/v1/callback），這個也要加回到 Google Cloud Console 的 redirect URIs 裡。',
      },
      {
        title: '設定 Supabase Site URL（最多人忘記的一步）',
        body: '這個沒設好，登入完成後 OAuth code 會跑到錯的地方。\n\n→ Authentication → URL Configuration\n→ Site URL 改成你的網址\n→ Redirect URLs 加入 http://localhost:3000/**',
        link: { text: '打開 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        screenshot: 'supabase-site-url.png',
        warning: '這個就是我踩了兩小時的坑。Site URL 預設是 localhost:3000，部署到線上之後一定要改成你的 Vercel 網址，否則線上登入會一直 redirect 回 localhost。',
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
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
        body: '⚠️ 這步是給 ch05 部署時的提醒，現在不需要操作。Vercel 專案在 ch05 才會建立。\n\n記住一個原則：以後把 env var 加到 Vercel 時，一律用 Vercel 網站手動貼，不要用終端機指令。\n\n操作方式（ch05 部署完再做）：\n1. 打開你的 Vercel 專案\n2. 點上方 Settings → Environment Variables\n3. 一個一個手動加，直接複製貼上值',
        link: { text: '打開 Vercel Dashboard（ch05 部署後再開）', url: 'https://vercel.com/dashboard' },
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
        body: '遇到問題的時候，打開這個頁面就能馬上知道哪裡出錯。貼給 Claude：',
        claude: `幫我建一個 /api/debug 診斷頁面。

打開這個頁面，我要能直接看到：
- 現在有沒有登入、是哪個帳號
- 這個帳號有沒有購買紀錄
- 所有環境變數有沒有設定好

環境變數只顯示「已設定」或「未設定」就好，不要把實際的值顯示出來。`,
        tip: '部署完之後，遇到任何問題先打開 /api/debug 看。沒登入或 env 顯示「未設定」，就知道問題在哪了。\n\n⚠️ 現在打開 /api/debug，「購買紀錄」那欄可能會顯示查詢錯誤——這是正常的，因為 purchases 資料表要在 ch04 才會建立。env 和登入狀態正常就沒問題了。',
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
STRIPE_SECRET_KEY=sk_live_...（上線後換成正式模式）
STRIPE_WEBHOOK_SECRET=whsec_...（Stripe Dashboard 線上 webhook 的 secret）`,
        },
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
        title: '在 Stripe 建立商品和價格',
        body: '1. 打開 Stripe Dashboard（確認左下角是 Test mode）\n2. 左側 Product catalog → + Add product\n3. 填入課程名稱\n4. 價格填 2640，幣別選 TWD，選「One time」\n5. 建立後點進商品，複製 Price ID（格式是 price_xxx）',
        link: { text: '打開 Stripe Product Catalog', url: 'https://dashboard.stripe.com/test/products' },
        screenshot: 'stripe-create-product.png',
        warning: 'TWD（台幣）在 Stripe 是 zero-decimal 幣別，金額直接填 2640，不是 264000。跟美元不同，千萬不要除以 100。',
      },
      {
        title: '把 Stripe keys 補入 .env.local',
        body: 'ch03 建好的 .env.local 裡，ch04 區段填入這兩行（去 Stripe Dashboard → Developers → API keys 複製 Secret key）：',
        link: { text: '打開 Stripe API Keys', url: 'https://dashboard.stripe.com/test/apikeys' },
        code: {
          lang: 'bash',
          content: `STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...（剛才複製的 Price ID）`,
        },
      },
      {
        title: '在 Supabase 建立購買紀錄資料表',
        body: '在叫 Claude 寫程式碼之前，先把資料表建好。打開 Supabase SQL Editor，把下面這段 SQL 貼上去執行：',
        link: { text: '打開 Supabase SQL Editor', url: 'https://supabase.com/dashboard/project/_/sql/new' },
        code: {
          lang: 'sql',
          content: `create table purchases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) not null,
  stripe_session_id text unique,
  amount            integer,
  currency          text,
  status            text default 'completed',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table purchases enable row level security;

create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);`,
        },
        tip: '先建表再寫程式碼，這樣 /api/debug 的購買紀錄查詢也會正常了。',
      },
      {
        title: '叫 Claude 把 Stripe 付款接起來',
        claude: `幫我把 Stripe 付款接起來。請參考這個網站的付款流程和成功頁設計：https://ailesson-two.vercel.app/

我要的功能：
1. 點「購課」按鈕 → 跳到 Stripe 付款頁
2. 付款成功 → 跳到 /success 頁面，顯示「購課成功」和「開始學習」按鈕（設計參考 https://ailesson-two.vercel.app/success）
3. 付款完成後，把購買紀錄存進 Supabase
4. 已買過的用戶再點購課按鈕，直接進 /dashboard，不用重複付款

.env.local 裡已有 STRIPE_SECRET_KEY 和 STRIPE_PRICE_ID。
幣別是台幣（TWD），台幣不需要除以 100。

⚠️ 重要：Webhook handler 裡讀取 request body 要用 request.text()，不是 request.json()，不然 Stripe signature 驗證會失敗。`,
        warning: 'Webhook 如果沒有觸發，先去 Vercel Function Logs 看錯誤訊息。最常見的原因是 STRIPE_WEBHOOK_SECRET 填錯、或 request body 用錯方式讀取。\n\n如果 TypeScript 出現 `apiVersion` 相關的型別錯誤，告訴 Claude：「把 Stripe 初始化的 apiVersion 改成已安裝 SDK 支援的版本，或是直接拿掉 apiVersion 讓 TypeScript 自動推斷」。',
      },
      {
        title: '本機測試 Webhook（用 stripe listen）',
        body: '在正式部署前，先用 stripe CLI 在本機測試 webhook 流程。打開另一個終端機視窗執行：',
        code: {
          lang: 'bash',
          content: `stripe listen --forward-to localhost:3000/api/webhooks/stripe
# 執行後終端機會顯示一組 whsec_... 本機 webhook secret
# 把這個值填進 .env.local 的 STRIPE_WEBHOOK_SECRET`,
        },
        warning: '⚠️ stripe listen 產生的 webhook secret 是本機暫時版，只在本機有效。部署到 Vercel 後，要在 Stripe Dashboard 建立正式 webhook endpoint，把那個 secret 更新進 Vercel env。這個步驟在 ch05 部署後做。',
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
    ],
  },

  // ── ch05 ─────────────────────────────────────────────────────────────────
  {
    id: 'ch05',
    title: 'Vercel 部署：git push = 三十秒上線',
    duration: '約 30 分',
    description:
      '改完 code，git add，git commit，git push。Vercel 自動偵測到 main branch 有新 commit，三十秒內重新部署，新版上線。\n\n' +
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
        title: '用 Vercel CLI 連結專案並部署',
        body: 'ch00 已裝好 Vercel CLI。在專案資料夾裡直接跑：',
        code: {
          lang: 'bash',
          content: `vercel`,
        },
        tip: '跑 vercel 指令後會問你幾個問題，選 Link to GitHub repo，找到你剛才建的 repo 連起來。之後每次 git push，Vercel 自動重新部署。',
      },
      {
        title: '先加所有 env var 到 Vercel，再重新部署',
        body: '⚠️ 順序很重要：先加 env，再 deploy。不然 Vercel 上的網站會因為缺 env 噴錯。\n\n1. 打開 Vercel Dashboard → 你的專案 → Settings → Environment Variables\n2. 把 .env.local 裡的 Supabase、Stripe 等所有變數一個一個加進去\n3. 記得把這兩個改成線上版本：',
        link: { text: '打開 Vercel Environment Variables', url: 'https://vercel.com/dashboard' },
        code: {
          lang: 'text',
          content: `NEXT_PUBLIC_SITE_URL → https://你的網址.vercel.app
STRIPE_WEBHOOK_SECRET → Stripe Dashboard 線上 webhook 的 secret

# 加完 env 之後，重新部署讓設定生效：
vercel --prod`,
        },
        screenshot: 'vercel-env-vars.png',
        warning: 'Vercel 的 env var 加完之後，現有的部署不會自動套用——一定要重新部署（vercel --prod）才會生效。',
      },
      {
        title: '部署完更新 Supabase Site URL 和 Stripe 正式 Webhook',
        body: '拿到 Vercel 固定網址後，這兩個地方要同步更新，不然 Google 登入跟付款都會壞。\n\n**Supabase（Google 登入會壞）：**\n→ Authentication → URL Configuration\n→ Site URL 改成 https://你的網址.vercel.app\n→ Redirect URLs 加入 https://你的網址.vercel.app/**\n\n**Stripe 正式 Webhook（付款成功但 DB 不更新）：**\n1. Stripe Dashboard → Developers → Webhooks → + Add endpoint\n2. Endpoint URL 填：https://你的網址.vercel.app/api/webhooks/stripe\n3. Events 只勾「checkout.session.completed」\n4. 建立後複製 Signing secret（whsec_xxx）\n5. 回 Vercel Settings → Environment Variables → 把 STRIPE_WEBHOOK_SECRET 換成這個新的 secret\n6. 重新執行 vercel --prod 讓新 secret 生效',
        link: { text: '打開 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        warning: 'STRIPE_WEBHOOK_SECRET 有兩個版本：ch04 本機用 stripe listen 產生的（暫時），和這裡 Stripe Dashboard 線上 webhook 的（正式）。Vercel 上一定要換成正式版本。',
      },
      {
        title: '之後的標準流程就這三行',
        body: '設定完之後，以後每次改東西就這樣：',
        code: {
          lang: 'bash',
          content: `git add .
git commit -m "fix: 你改了什麼"
git push
# 等 30 秒，Vercel 自動部署好了`,
        },
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
      '這章整理了這個專案踩過的所有坑：session 為什麼在線上不見了、purchases 查不到怎麼排查、用 /api/debug 三十秒定位問題。',
    keyPoints: [
      '怎麼讀 Vercel function logs——找到真正的錯誤',
      '/api/debug 的設計：30 秒確認 session 與 env 狀態',
      'session 為什麼在線上消失——Supabase Site URL 設定',
      '付款成功但進不了 dashboard——RLS 和 serviceClient',
    ],
    steps: [
      {
        title: '遇到 500 先去 Vercel 看 log',
        body: '前端白畫面或 500，第一步去這裡找原因：\n\n1. Vercel Dashboard → 你的專案 → Deployments\n2. 點最新那筆 → 右側 Functions tab\n3. 找到出錯的 route，看詳細的 error message',
        link: { text: '打開 Vercel Deployments', url: 'https://vercel.com/dashboard' },
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
→ TWD 是 zero-decimal，不能除以 100
→ amount: session.amount_total（不要 / 100）

❌ JWSError JWSInvalidSignature
→ STRIPE_WEBHOOK_SECRET 用了本機版的
→ 換成 Stripe Dashboard 線上 webhook 的 signing secret

❌ 付款成功但進不了 dashboard
→ purchases 表的查詢被 RLS 擋住
→ 查詢 purchases 改用 serviceClient 而不是 user client`,
        },
      },
      {
        title: 'Session 在線上消失怎麼辦',
        body: '本機登入正常，線上登入後立刻變回未登入狀態——確認這三個地方：',
        code: {
          lang: 'text',
          content: `① Supabase → Authentication → URL Configuration
   Site URL 是否已改成線上網址（不是 localhost）

② Supabase → Authentication → URL Configuration
   Redirect URLs 有沒有包含 https://你的網址.vercel.app/**

③ Vercel env var
   NEXT_PUBLIC_SITE_URL 是否是線上網址`,
        },
        link: { text: '打開 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
        warning: '這三個是連動的，任一個設錯都會造成 session 問題。改完一個要把另外兩個一起確認。',
      },
      {
        title: '用 /api/debug 三十秒定位問題',
        body: '遇到任何奇怪的問題，打開瀏覽器去你的網站 /api/debug，看輸出：',
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
   components/sections/ 裡的所有 section
   → 換文案、換設計，架構不動

② 登入系統
   app/login/ + app/auth/callback/ + lib/supabase/
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
        claude: `我想把這個課程網站的模板改成 [你的產品描述]。請先看這個網站了解現有設計：https://ailesson-two.vercel.app/

請幫我：
1. 把 components/sections/Hero.tsx 的文案換成 [你的產品標題和賣點]
2. 把 components/sections/Pricing.tsx 的價格改成 [你的價格]
3. 把 components/sections/Problems.tsx 的痛點換成 [你的目標客群的痛點]
4. 把 lib/course-data.ts 的課程資料換成 [你的內容結構]

品牌色保持橘色，版面結構不變，只換內容。`,
        tip: '把 [括號內的東西] 換成你自己的產品描述，然後貼給 Claude。它會幫你把所有文案一次換完。也可以先用 /ui-ux-pro-max 讓 Claude 自動優化整體視覺。',
      },
      {
        title: '從這個模板開始新專案',
        body: '最快的方式：直接 clone 這個專案，重新初始化 git：',
        code: {
          lang: 'bash',
          content: `git clone https://github.com/你的帳號/ai-lesson.git 你的新專案
cd 你的新專案

# 重新初始化（不帶走之前的 commit 記錄）
rm -rf .git
git init
git add .
git commit -m "init: start from template"`,
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
    ],
  },
]
