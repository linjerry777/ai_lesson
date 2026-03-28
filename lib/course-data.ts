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
  // ─────────────────────────────────────────────────────────────────────────
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
        title: '安裝 Node.js 與 Claude Code',
        body: '先確認環境。打開終端機（Windows 用 PowerShell，Mac 用 Terminal）：',
        code: {
          lang: 'bash',
          content: `# 確認 Node.js 版本（需要 18+）
node -v

# 安裝 Claude Code（需要先有 Anthropic 帳號）
npm install -g @anthropic-ai/claude-code

# 確認安裝成功
claude --version`,
        },
        tip: 'Node.js 官網下載 LTS 版本即可。Claude Code 需要 Anthropic API Key，去 console.anthropic.com 取得。',
      },
      {
        title: '建立 Next.js 專案',
        body: '用官方 CLI 建立，設定如下（全部選預設即可）：',
        code: {
          lang: 'bash',
          content: `npx create-next-app@latest ai-lesson
# ✔ TypeScript → Yes
# ✔ ESLint → Yes
# ✔ Tailwind CSS → Yes
# ✔ src/ directory → No
# ✔ App Router → Yes
# ✔ import alias (@/*) → Yes

cd ai-lesson
npm run dev`,
        },
        tip: '瀏覽器打開 http://localhost:3000 看到 Next.js 預設頁面就成功了。',
      },
      {
        title: '設定 Tailwind 品牌色（brand-500）',
        body: '我們的主色是橘色，直接加進 tailwind.config.ts：',
        code: {
          lang: 'typescript',
          content: `// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',   // 主色
        600: '#ea6b10',
        700: '#c2530a',
      },
    },
  },
},`,
        },
      },
      {
        title: '啟動 Claude Code，下第一個指令',
        body: '在專案根目錄啟動 Claude Code，然後描述你要的東西：',
        code: {
          lang: 'bash',
          content: `claude`,
        },
        tip: '需求越具體越好。不要說「幫我做一個網站」，要說「幫我建一個賣線上課程的 Next.js Landing Page，品牌主色用 brand-500（橘色），要有 Navbar、Hero、Pain Points、課程大綱、定價、FAQ、Footer，風格簡潔專業，用 Tailwind CSS」。',
      },
      {
        title: '需求描述的正確寫法',
        body: '這是我們實際用過、效果最好的 prompt 結構：',
        code: {
          lang: 'text',
          content: `【目標】幫我建立一個課程銷售 Landing Page
【技術】Next.js 14 App Router + Tailwind CSS
【品牌色】brand-500 = #f97316（橘色）
【需要的 section】
  1. Navbar（logo + 導覽連結 + CTA 按鈕）
  2. Hero（大標題 + 副標 + 重點列表 + 定價 CTA）
  3. Problems（5張痛點卡片）
  4. Curriculum（課程大綱手風琴）
  5. Pricing（定價卡片）
  6. FAQ
  7. Footer
【風格】乾淨、專業、重視可讀性`,
        },
        warning: '不要一次叫它做太多事。先叫它建好基本結構，再逐一調整每個 section。一次改一件事，Claude Code 不容易出錯。',
      },
      {
        title: '調整與迭代',
        body: '生出來之後不滿意，直接描述要改什麼：',
        code: {
          lang: 'text',
          content: `# 範例：調整 Hero 標題
把 Hero 的大標題改成：
第一行「你現在看到的」
第二行「這個網站」（brand-500 橘色）
第三行「是 Claude Code 做的」

# 範例：新增元素
在 Hero 右側加一個 terminal 風格的裝飾元件，
背景深色，顯示幾行假的 claude 命令輸出`,
        },
        tip: '每次改完都立刻存檔，用 git commit 記錄下來。這樣如果改壞了可以直接 revert。',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
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
        body: '去 supabase.com 建立帳號，新增專案。建完之後在 Project Settings → API 找到這兩個值：',
        code: {
          lang: 'bash',
          content: `# 存到 .env.local
NEXT_PUBLIC_SUPABASE_URL=https://你的專案id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（很長的 JWT）
SUPABASE_SERVICE_ROLE_KEY=eyJ...（另一個，有完整權限）`,
        },
        warning: 'Service Role Key 絕對不能放到前端或 git commit 進去。只能在 server-side 使用。',
        screenshot: 'supabase-api-keys.png',
      },
      {
        title: '安裝 Supabase 套件',
        code: {
          lang: 'bash',
          content: `npm install @supabase/supabase-js @supabase/ssr`,
        },
      },
      {
        title: '建立 Supabase client（server 端）',
        body: '在 lib/supabase/server.ts 建立兩個 client：',
        code: {
          lang: 'typescript',
          content: `import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// 一般用戶 client（受 RLS 保護）
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}

// Service role client（繞過 RLS，只用在 server）
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}`,
        },
      },
      {
        title: '去 Google Cloud Console 建立 OAuth 憑證',
        body: '1. 打開 console.cloud.google.com\n2. 建立新專案（或選現有的）\n3. 側欄 → APIs & Services → Credentials\n4. 點「+ CREATE CREDENTIALS」→「OAuth client ID」\n5. Application type 選「Web application」\n6. Authorized redirect URIs 加入：',
        code: {
          lang: 'text',
          content: `# 本機開發
http://localhost:3000/auth/callback

# 線上環境（換成你的 Vercel 網址）
https://你的網域.vercel.app/auth/callback`,
        },
        warning: '這兩個都要加！少加一個，對應環境的登入就會壞。建完之後把 Client ID 和 Client Secret 複製起來。',
        screenshot: 'google-cloud-oauth-credentials.png',
      },
      {
        title: '在 Supabase 啟用 Google Provider',
        body: '1. Supabase Dashboard → Authentication → Providers\n2. 找到 Google，點開\n3. 把 Client ID 和 Client Secret 貼進去\n4. 記下 Supabase 給你的 Callback URL（長這樣）：',
        code: {
          lang: 'text',
          content: `https://你的專案id.supabase.co/auth/v1/callback`,
        },
        tip: '這個 Callback URL 也要加回到 Google Cloud Console 的 Authorized redirect URIs 裡面。',
        screenshot: 'supabase-google-provider.png',
      },
      {
        title: '設定 Supabase Site URL（最多人忘記的一步）',
        body: '1. Supabase Dashboard → Authentication → URL Configuration\n2. Site URL 設定為你的主網址：',
        code: {
          lang: 'text',
          content: `# 本機
http://localhost:3000

# 線上（部署後要改成這個）
https://你的網域.vercel.app`,
        },
        warning: '這個沒設好，登入完成後 OAuth code 會跑去錯的地方。這就是我踩了兩小時的坑。',
        screenshot: 'supabase-site-url.png',
      },
      {
        title: '建立 /auth/callback route',
        body: '建立 app/auth/callback/route.ts，這個 route 負責把 OAuth code 換成 session：',
        code: {
          lang: 'typescript',
          content: `import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(\`\${origin}/\`)
}`,
        },
      },
      {
        title: '建立登入按鈕（觸發 Google OAuth）',
        code: {
          lang: 'typescript',
          content: `// app/login/page.tsx 或任何地方
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: \`\${window.location.origin}/auth/callback\`,
  },
})`,
        },
        tip: 'redirectTo 一定要用 window.location.origin 動態取得，不要 hard-code 網址。這樣本機和線上環境都能用同一份程式碼。',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
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
    steps: [
      {
        title: '.env.local 正確格式',
        body: '在專案根目錄建立 .env.local，格式如下（等號兩邊不要有空格，值不需要引號）：',
        code: {
          lang: 'bash',
          content: `# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
        },
        warning: '.env.local 絕對不能 commit 到 git！確認 .gitignore 裡面有 .env.local 這一行。',
      },
      {
        title: '把 env var 加到 Vercel（正確做法）',
        body: '不要用 echo pipe 的方式！直接在 Vercel Dashboard 貼上：\n\n1. 打開 vercel.com → 你的專案 → Settings → Environment Variables\n2. 一個一個手動新增，直接貼值進去\n3. 記得選 Production + Preview + Development 三個環境',
        screenshot: 'vercel-env-vars.png',
        warning: '用 echo "sk_test_xxx" | vercel env add STRIPE_SECRET_KEY 在 Windows 上會在 key 結尾加 \\n。Stripe 拿到帶換行的 key 直接回傳 401，而且 error message 完全看不出來是這個原因。',
      },
      {
        title: '建立 /api/debug route，快速確認 env 狀態',
        body: '這個 route 是診斷 env 問題最快的方法。建立 app/api/debug/route.ts：',
        code: {
          lang: 'typescript',
          content: `import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    authError: authError?.message ?? null,
    env: {
      supabaseUrl:     process.env.NEXT_PUBLIC_SUPABASE_URL     ? 'SET' : 'MISSING',
      stripeKey:       process.env.STRIPE_SECRET_KEY             ? 'SET' : 'MISSING',
      priceId:         process.env.STRIPE_PRICE_ID               ?? 'MISSING',
      siteUrl:         process.env.NEXT_PUBLIC_SITE_URL          ?? 'MISSING',
      serviceRoleKey:  process.env.SUPABASE_SERVICE_ROLE_KEY     ? 'SET' : 'MISSING',
    },
  })
}`,
        },
        tip: '部署完之後打開 https://你的網域/api/debug，看 env 欄位有沒有都顯示 SET。有任何 MISSING 就表示那個變數沒有正確帶入。',
      },
      {
        title: '本機 env 和線上 env 同步',
        body: '幾個常見的 env 差異要注意：',
        code: {
          lang: 'bash',
          content: `# 本機 .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...   # 測試模式 key
STRIPE_WEBHOOK_SECRET=whsec_... # 本機 webhook secret（用 stripe listen 產生）

# Vercel 線上環境
NEXT_PUBLIC_SITE_URL=https://你的網域.vercel.app
STRIPE_SECRET_KEY=sk_live_...   # 真實模式 key（上線前換）
STRIPE_WEBHOOK_SECRET=whsec_... # 線上 webhook secret（在 Stripe Dashboard 建立）`,
        },
        warning: 'NEXT_PUBLIC_SITE_URL 忘記改是最常見的線上 bug 來源。登入後 redirect 會跑到 localhost:3000 而不是你的線上網址。',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
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
    steps: [
      {
        title: '在 Stripe Dashboard 建立產品和價格',
        body: '1. 打開 dashboard.stripe.com（確認左上角是 Test mode）\n2. 側欄 → Product catalog → + Add product\n3. 填入課程名稱、價格（例如 NT$2,640）、幣別選 TWD\n4. 建立後複製 Price ID（格式是 price_xxxxx）',
        code: {
          lang: 'bash',
          content: `# 加到 .env.local
STRIPE_PRICE_ID=price_1XXXXXXXXXXXXX`,
        },
        screenshot: 'stripe-create-product.png',
        warning: 'TWD（台幣）是 zero-decimal 幣別，Stripe 的 amount 直接是 2640，不是 264000。跟美元不同，不需要除以 100。',
      },
      {
        title: '安裝 Stripe 套件',
        code: {
          lang: 'bash',
          content: `npm install stripe @stripe/stripe-js`,
        },
      },
      {
        title: '建立 Stripe 初始化檔案',
        code: {
          lang: 'typescript',
          content: `// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})`,
        },
      },
      {
        title: '建立 Checkout Session API',
        body: '建立 app/api/checkout/route.ts，當用戶點購課按鈕就呼叫這個：',
        code: {
          lang: 'typescript',
          content: `import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL('/login', SITE_URL))

  // 已購買過？直接進 dashboard
  const { data: purchase } = await createServiceClient()
    .from('purchases').select('id')
    .eq('user_id', user.id).eq('status', 'completed').maybeSingle()

  if (purchase) return NextResponse.redirect(new URL('/dashboard', SITE_URL))

  // 建立 Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: user.email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    metadata: { user_id: user.id },   // 重要！webhook 靠這個認人
    success_url: \`\${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${SITE_URL}/#pricing\`,
    locale: 'zh',
  })

  return NextResponse.redirect(session.url!)
}`,
        },
        tip: 'metadata 裡面放 user_id 很重要！Webhook 收到付款通知時，靠這個知道是哪個用戶付的款。',
      },
      {
        title: '在 Supabase 建立 purchases 資料表',
        body: '去 Supabase Dashboard → SQL Editor，執行以下 SQL：',
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

-- 讓用戶可以讀自己的購買紀錄
create policy "Users can view own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- 開啟 RLS
alter table purchases enable row level security;`,
        },
        screenshot: 'supabase-sql-editor.png',
      },
      {
        title: '建立 Webhook endpoint',
        body: '建立 app/api/webhooks/stripe/route.ts，接收 Stripe 的付款成功通知：',
        code: {
          lang: 'typescript',
          content: `import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId  = session.metadata?.user_id

    if (userId && session.payment_status === 'paid') {
      await createServiceClient().from('purchases').upsert({
        user_id:           userId,
        stripe_session_id: session.id,
        amount:            session.amount_total ?? 0,
        currency:          session.currency,
        status:            'completed',
      })
    }
  }

  return NextResponse.json({ received: true })
}`,
        },
      },
      {
        title: '在 Stripe Dashboard 設定 Webhook',
        body: '1. Stripe Dashboard → Developers → Webhooks → + Add endpoint\n2. Endpoint URL 填入：',
        code: {
          lang: 'text',
          content: `https://你的網域.vercel.app/api/webhooks/stripe`,
        },
        tip: '選擇監聽的事件：只勾「checkout.session.completed」就夠了。建完之後把 Signing secret（whsec_xxx）加到 Vercel 的 STRIPE_WEBHOOK_SECRET。',
        screenshot: 'stripe-webhook-setup.png',
      },
      {
        title: '用測試卡驗收整條流程',
        body: '部署之後，用以下測試資料買一次課：',
        code: {
          lang: 'text',
          content: `卡號：4242 4242 4242 4242
到期：任意未來日期（例如 12/30）
CVC：任意三位數（例如 123）
姓名：任意

付款成功 → 跳到 /success
Webhook 打進來 → purchases 表新增一筆
再點購課 → 自動跳到 /dashboard`,
        },
        tip: '可以去 Stripe Dashboard → Developers → Webhooks 看 webhook 有沒有成功送達。失敗的話會顯示 error message。',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
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
      'CI/CD 流程：commit → push → 自動上線全紀錄',
    ],
    steps: [
      {
        title: '初始化 git 並推到 GitHub',
        code: {
          lang: 'bash',
          content: `git init
git add .
git commit -m "init: initial commit"

# 在 GitHub 建立新 repo，然後：
git remote add origin https://github.com/你的帳號/你的專案.git
git branch -M main
git push -u origin main`,
        },
        tip: '記得把 .env.local 加進 .gitignore，否則你的 API key 就公開了。',
      },
      {
        title: '安裝 Vercel CLI 並部署',
        code: {
          lang: 'bash',
          content: `npm install -g vercel

# 在專案根目錄執行
vercel

# 依照提示操作：
# Set up and deploy → Y
# Which scope → 選你的帳號
# Link to existing project → N（第一次）
# Project name → 自己取
# Directory → ./（直接按 Enter）`,
        },
        screenshot: 'vercel-cli-deploy.png',
      },
      {
        title: '把 env var 加到 Vercel',
        body: '1. 打開 vercel.com → 你的專案 → Settings → Environment Variables\n2. 把 .env.local 裡的所有變數一個一個加進去\n3. 注意這些要改成線上版本的值：',
        code: {
          lang: 'bash',
          content: `# 線上版本要改的 env
NEXT_PUBLIC_SITE_URL=https://你的專案名稱.vercel.app
# Stripe webhook secret 要用線上版本的（不是本機 stripe listen 產生的）`,
        },
        warning: 'NEXT_PUBLIC_SITE_URL 和 Supabase 的 Site URL 都要一起改成線上網址，否則登入後 redirect 會跑到 localhost。',
      },
      {
        title: '設定固定 alias（讓網址不變）',
        body: '每次部署 Vercel 會產生新的 URL（project-xxxxx.vercel.app）。設定 alias 讓固定網址永遠指向最新版：',
        code: {
          lang: 'bash',
          content: `# 設定固定 alias
vercel alias set 你的最新部署URL.vercel.app 你想要的固定名稱.vercel.app

# 之後每次 push 到 main，Vercel 自動部署，alias 自動指向最新版
# 不需要再手動執行任何指令`,
        },
        tip: '也可以在 Vercel Dashboard → Domains 直接設定，不用 CLI。',
      },
      {
        title: '之後的標準開發流程',
        body: '設定完之後，每次改 code 的流程就是這三個指令：',
        code: {
          lang: 'bash',
          content: `git add 你修改的檔案
git commit -m "fix: 描述你改了什麼"
git push

# Vercel 自動偵測 push → 自動重新部署 → 約 30 秒後新版上線`,
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ch06',
    title: 'Debug 實錄：500、session 消失、CORS',
    duration: '約 60 分',
    description:
      '登入成功，點購課，白畫面，500 error。Vercel log 什麼都沒顯示。這種 debug 才是真實開發的日常。\n\n' +
      '我建了一個 /api/debug，直接回傳當前的 user session、env var 狀態、Supabase 連線狀態。三十秒定位問題。這個習慣，每個專案都要有。\n\n' +
      '這章整理了這個專案踩過的所有坑：session 為什麼在線上不見了、CORS 怎麼設、Supabase cookie 在不同 domain 的行為。',
    keyPoints: [
      '怎麼讀 Vercel function logs——找到真正的錯誤',
      '/api/debug 的設計：30 秒確認 session 與 env 狀態',
      'session 為什麼在線上消失——cookie domain 問題',
      'CORS 設定與 Supabase 跨 domain cookie 行為',
    ],
    steps: [
      {
        title: '怎麼看 Vercel function logs',
        body: '前端顯示 500，但不知道原因時：\n1. 打開 vercel.com → 你的專案 → Deployments\n2. 點最新的 deployment → Functions\n3. 找到出錯的 route，看 Logs',
        screenshot: 'vercel-function-logs.png',
        tip: '也可以用 vercel logs 指令在終端機即時查看：\nvercel logs https://你的部署URL.vercel.app',
      },
      {
        title: '常見 500 錯誤對照表',
        body: '這個專案遇到的所有 500 和原因：',
        code: {
          lang: 'text',
          content: `錯誤：STRIPE_SECRET_KEY is not defined
原因：Vercel 上沒加 STRIPE_SECRET_KEY，或有換行符
解法：Vercel Dashboard 手動貼上 key，不要用 echo pipe

錯誤：invalid input syntax for type integer: "26.4"
原因：TWD 是 zero-decimal，amount 不需要除以 100
解法：amount: session.amount_total（不要 / 100）

錯誤：JWSError JWSInvalidSignature
原因：STRIPE_WEBHOOK_SECRET 用了本機版的，不是線上版
解法：Stripe Dashboard → Webhooks → 複製線上版的 signing secret

錯誤：購買後進不了 dashboard
原因：purchases 表的 SELECT policy 沒設，或用 user client 查詢（受 RLS 限制）
解法：查詢 purchases 改用 serviceClient（繞過 RLS）`,
        },
      },
      {
        title: 'Session 在線上消失的原因',
        body: '本機登入正常，線上登入後 session 不見了，通常是這幾個原因：',
        code: {
          lang: 'text',
          content: `問題一：Supabase Site URL 設定錯誤
→ 去 Supabase → Authentication → URL Configuration
→ Site URL 改成你的 Vercel 線上網址

問題二：Redirect URL 白名單沒加線上網址
→ Supabase → Authentication → URL Configuration → Redirect URLs
→ 加入 https://你的網域.vercel.app/**

問題三：NEXT_PUBLIC_SITE_URL 還是 localhost
→ Vercel env var 裡改成線上網址`,
        },
        warning: '這三個是連動的，任一個設錯就會造成 session 問題。改完一個要連另外兩個一起確認。',
      },
      {
        title: '用 /api/debug 診斷所有問題',
        body: '遇到任何奇怪的問題，先訪問 /api/debug，看輸出：',
        code: {
          lang: 'json',
          content: `// 正常狀態應該長這樣：
{
  "user": { "id": "xxx", "email": "你的信箱" },
  "authError": null,
  "myPurchase": { "id": "xxx", ... },  // 有購買的話
  "env": {
    "supabaseUrl": "SET",
    "stripeKey": "SET",
    "serviceRoleKey": "SET",
    "siteUrl": "https://你的網域.vercel.app"   // 不能是 localhost
  }
}`,
        },
        tip: 'user 是 null → session 問題。myPurchase 是 null 但明明有買 → purchases 查詢問題。任何 env 是 MISSING → 環境變數沒設好。',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
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
    steps: [
      {
        title: '這個模板的核心架構',
        body: '這個專案可以拆成四個互相獨立的部分，每個部分各自替換：',
        code: {
          lang: 'text',
          content: `① Landing Page（app/page.tsx + components/sections/）
   → 換文案、換設計，架構不動

② 登入系統（Supabase Auth + app/login/ + app/auth/callback/）
   → 幾乎不需要動，Google OAuth 通用

③ 付款系統（Stripe + app/api/checkout/ + app/api/webhooks/）
   → 換 STRIPE_PRICE_ID，改 purchases 表結構

④ 產品內容（app/dashboard/ + lib/course-data.ts）
   → 換成你的內容（課程、SaaS 功能、下載檔案...）`,
        },
      },
      {
        title: '換成你自己的產品：需要改的地方',
        code: {
          lang: 'bash',
          content: `# 1. Landing Page 文案
components/sections/Hero.tsx      → 換標題、副標、賣點
components/sections/Pricing.tsx   → 換價格、方案名稱
components/sections/FAQ.tsx       → 換常見問題

# 2. 課程內容替換
lib/course-data.ts                → 換成你的內容結構

# 3. Stripe 商品
.env.local                        → 換 STRIPE_PRICE_ID
（去 Stripe Dashboard 建新商品取得新的 price_id）

# 4. 品牌色
tailwind.config.ts                → 換 brand-500 的色碼`,
        },
      },
      {
        title: '如果你做的不是課程（SaaS / 工具）',
        body: '付費後給用戶什麼，只需要改 dashboard：',
        code: {
          lang: 'typescript',
          content: `// 目前 dashboard 是影片課程
// 如果你做的是 SaaS 工具：

// app/dashboard/page.tsx 的邏輯不變：
// 1. 確認登入 → 確認購買 → 顯示內容

// 只需要換掉這個：
// app/dashboard/CoursePage.tsx → 你的工具 UI
// lib/course-data.ts → 你的資料結構（或刪掉，改成 API fetch）`,
        },
      },
      {
        title: '從這個模板開始新專案',
        body: '最快的方式：直接 fork 或 clone，然後搜尋替換：',
        code: {
          lang: 'bash',
          content: `git clone https://github.com/你的帳號/ai-lesson.git 你的新專案名稱
cd 你的新專案名稱

# 重新初始化 git（不要帶走之前的 commit 記錄）
rm -rf .git
git init
git add .
git commit -m "init: start from ai-lesson template"

# 建新的 GitHub repo，推上去
git remote add origin https://github.com/你的帳號/新專案.git
git push -u origin main`,
        },
        tip: '然後去 Supabase 建新專案、Stripe 建新商品、Vercel 建新部署。三個地方各花 10 分鐘，新專案的基礎建設就完成了。',
      },
    ],
  },
]
