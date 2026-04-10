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
      '安裝 Vercel CLI（ch05 部署用）和 Stripe CLI（ch04 本機測試 Webhook 用）',
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
        title: '用 Claude Code Desktop 安裝 Node.js 和 Git',
        body: '打開 Claude Code Desktop，把下面這段貼進去，讓 Claude 幫你確認和安裝環境：',
        claude: `請幫我確認開發環境，依序做以下事情：
1. 執行 node -v 確認有沒有裝 Node.js
2. 執行 git --version 確認有沒有裝 Git
3. 如果沒有裝 Node.js，告訴我去哪裡下載（選 LTS 版本）
4. 如果沒有裝 Git，告訴我去哪裡下載
5. 全部確認好之後告訴我可以開始了`,
        warning: 'Node.js 和 Git 如果沒有裝，Claude 會給你下載連結，照著裝完之後重新貼一次這段確認。',
      },
      {
        title: '安裝 Vercel CLI 和 Stripe CLI',
        body: '在 Claude Code Desktop 裡貼這段，讓它幫你安裝後續章節需要的工具：',
        claude: `請幫我安裝以下工具：
1. 執行 npm install -g vercel 安裝 Vercel CLI
2. 執行 npm install -g stripe 安裝 Stripe CLI
3. 安裝完執行 vercel --version 和 stripe --version 確認有沒有裝成功
告訴我結果。`,
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
        body: '選一個你想放專案的資料夾，打開終端機，輸入這個指令。跑完之後進入專案資料夾：',
        code: {
          lang: 'bash',
          content: 'npx create-next-app@latest ai-lesson\ncd ai-lesson',
        },
        tip: '跑指令時會問你幾個問題，全部按 Enter 選預設值就好。TypeScript → Yes，Tailwind → Yes，其他都 Yes。',
      },
      {
        title: '打開 Claude Code Desktop，告訴它你要什麼',
        body: '打開 Claude Code Desktop，點左上角選擇你剛建的專案資料夾（ai-lesson），然後把下面這段複製貼上給它：',
        claude: `幫我建立一個賣線上課程的 Next.js Landing Page。

技術需求：
- Next.js 14 App Router
- Tailwind CSS
- 品牌主色：brand-500 = #f97316（橘色），記得加進 tailwind.config.ts

需要的 section（依序）：
1. Navbar：左邊 logo，中間導覽連結，右邊「立即購課」按鈕
2. Hero：大標題、副標、重點 bullet list、定價、CTA 按鈕，右側放 terminal 風格裝飾
3. Problems：5 張痛點卡片，描述市面上課程的問題
4. Curriculum：課程大綱
5. Pricing：定價卡片
6. FAQ：常見問題
7. Footer

風格：乾淨、專業、重視可讀性。`,
        warning: '不要一次叫它做太多。先讓它建好整體架構，確認能跑起來之後，再逐一調整每個 section 的內容。',
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
        title: '叫 Claude 把 Supabase 串好',
        claude: `幫我在這個 Next.js 專案裡串接 Supabase 登入。

需要做的事：
1. 安裝 @supabase/supabase-js 和 @supabase/ssr
2. 建立 lib/supabase/server.ts，裡面有兩個 function：
   - createClient()：一般用戶 client，用 cookie session
   - createServiceClient()：service role client，給後端用
3. 建立 lib/supabase/client.ts，給前端用的 client
4. 建立 app/auth/callback/route.ts，把 OAuth code 換成 session
5. 建立 app/login/page.tsx，有一個「用 Google 登入」按鈕
6. Navbar 加上登入狀態判斷：登入後顯示用戶 email 和登出按鈕`,
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
        title: '把 env var 加到 Vercel（一定要用 Dashboard 手動貼，不要用指令）',
        body: '直接在 Vercel 網站貼上。\n\n1. 打開你的 Vercel 專案\n2. 點上方 Settings → Environment Variables\n3. 一個一個手動加，直接複製貼上值',
        link: { text: '打開 Vercel Dashboard', url: 'https://vercel.com/dashboard' },
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
        tip: '如果你真的想用 CLI，加一行防禦：在 lib/stripe.ts 裡用 process.env.STRIPE_SECRET_KEY.trim() 把首尾空白全砍掉，這樣就算 env var 帶了換行符也不會炸。',
      },
      {
        title: '叫 Claude 建立 /api/debug，方便你隨時檢查',
        body: '這個 route 是診斷所有問題最快的工具。貼給 Claude：',
        claude: `幫我建立 app/api/debug/route.ts，這是一個診斷用的 API endpoint。

回傳 JSON 包含：
1. 目前登入的 user（id 和 email），沒登入就回傳 null
2. auth error 訊息
3. 這個用戶有沒有購買紀錄（從 purchases 表查）
4. env 狀態：NEXT_PUBLIC_SUPABASE_URL、STRIPE_SECRET_KEY、SUPABASE_SERVICE_ROLE_KEY、NEXT_PUBLIC_SITE_URL 有沒有設定（顯示 SET 或 MISSING，不要把值印出來）

purchases 的查詢要用 serviceClient（繞過 RLS）。`,
        tip: '部署完之後，遇到任何問題先打開 /api/debug 看輸出。user 是 null 代表 session 問題，env 有 MISSING 代表 Vercel 上沒設那個變數。',
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
        title: '叫 Claude 把整個付款流程串好',
        claude: `幫我在這個 Next.js 專案裡串接 Stripe 付款，需要以下功能：

1. 安裝 stripe 和 @stripe/stripe-js
2. 建立 lib/stripe.ts，初始化 Stripe client
3. 建立 app/api/checkout/route.ts（GET 請求）：
   - 確認用戶已登入，沒登入跳到 /login
   - 用 serviceClient 確認用戶有沒有已購買，有的話直接跳 /dashboard
   - 建立 Stripe Checkout Session，metadata 裡放 user_id
   - success_url 設定為 /success?session_id={CHECKOUT_SESSION_ID}
   - 跳轉到 Stripe 付款頁
4. 建立 app/api/webhooks/stripe/route.ts（POST 請求）：
   - 驗證 Stripe webhook 簽名
   - 監聽 checkout.session.completed 事件
   - 用 serviceClient 把購買記錄 upsert 進 purchases 表
5. 建立 app/success/page.tsx：
   - 顯示購課成功訊息
   - 有「開始學習」按鈕連到 /dashboard

SITE_URL 從 NEXT_PUBLIC_SITE_URL 環境變數取得。
TWD 是 zero-decimal 幣別，amount 直接存 session.amount_total，不需要除以 100。`,
      },
      {
        title: '在 Supabase 建立 purchases 資料表',
        body: '打開 Supabase → SQL Editor，把下面這段 SQL 貼上去執行：',
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
      },
      {
        title: '在 Stripe 設定 Webhook（完成 ch05 部署後再做這步）',
        body: '⚠️ 這步需要 Vercel 線上網址，請先完成 ch05 部署取得網址後，再回來做這步。\n\n1. Stripe Dashboard → Developers → Webhooks → + Add endpoint\n2. Endpoint URL 填入你的線上網址\n3. Events 只勾選「checkout.session.completed」\n4. 建立後複製 Signing secret（whsec_xxx）加到 Vercel env',
        link: { text: '打開 Stripe Webhooks', url: 'https://dashboard.stripe.com/test/webhooks' },
        code: {
          lang: 'text',
          content: `Endpoint URL：
https://你的網址.vercel.app/api/webhooks/stripe`,
        },
        screenshot: 'stripe-webhook-setup.png',
        warning: 'Signing secret 有兩個版本：本機用 stripe listen 產生的（臨時的），和 Stripe Dashboard 線上 webhook 的（永久的）。Vercel 上要填線上版本的。',
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
        title: '把所有 env var 加到 Vercel',
        body: '1. 打開 Vercel Dashboard → 你的專案 → Settings → Environment Variables\n2. 把 .env.local 裡的所有變數一個一個加進去\n3. 記得把這兩個改成線上版本：',
        link: { text: '打開 Vercel Environment Variables', url: 'https://vercel.com/dashboard' },
        code: {
          lang: 'text',
          content: `NEXT_PUBLIC_SITE_URL → https://你的網址.vercel.app
STRIPE_WEBHOOK_SECRET → Stripe Dashboard 線上 webhook 的 secret`,
        },
        screenshot: 'vercel-env-vars.png',
      },
      {
        title: '部署完記得同步更新 Supabase Site URL',
        body: '拿到 Vercel 給你的固定網址之後，記得回去 Supabase 改：\n\n→ Authentication → URL Configuration\n→ Site URL 改成 https://你的網址.vercel.app\n→ Redirect URLs 加入 https://你的網址.vercel.app/**',
        link: { text: '打開 Supabase URL Configuration', url: 'https://supabase.com/dashboard/project/_/auth/url-configuration' },
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
    title: 'Debug 實錄：500、session 消失、CORS',
    duration: '約 60 分',
    description:
      '登入成功，點購課，白畫面，500 error。Vercel log 什麼都沒顯示。這種 debug 才是真實開發的日常。\n\n' +
      '我建了一個 /api/debug，直接回傳當前的 user session、env var 狀態、Supabase 連線狀態。三十秒定位問題。\n\n' +
      '這章整理了這個專案踩過的所有坑：session 為什麼在線上不見了、CORS 怎麼設、Supabase cookie 在不同 domain 的行為。',
    keyPoints: [
      '怎麼讀 Vercel function logs——找到真正的錯誤',
      '/api/debug 的設計：30 秒確認 session 與 env 狀態',
      'session 為什麼在線上消失——cookie domain 問題',
      'CORS 設定與 Supabase 跨 domain cookie 行為',
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
        claude: `我想把這個課程網站的模板改成 [你的產品描述]。

請幫我：
1. 把 components/sections/Hero.tsx 的文案換成 [你的產品標題和賣點]
2. 把 components/sections/Pricing.tsx 的價格改成 [你的價格]
3. 把 components/sections/Problems.tsx 的痛點換成 [你的目標客群的痛點]
4. 把 lib/course-data.ts 的課程資料換成 [你的內容結構]

品牌色保持橘色，版面結構不變，只換內容。`,
        tip: '把 [括號內的東西] 換成你自己的產品描述，然後貼給 Claude。它會幫你把所有文案一次換完。',
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
