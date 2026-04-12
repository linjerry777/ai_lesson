# 錄影腳本大綱

## 錄影前 Checklist

```
□ Linux VM 或 Windows 乾淨狀態
□ 所有帳號登出，準備用新 Google 帳號示範
□ 螢幕錄影軟體測試（OBS 或 Kooha）
□ 麥克風測試
□ 網路穩定（Supabase / Vercel 建立需要網路）
□ 每章對話腳本開在旁邊備用
□ 每章錄完先確認影片有聲音再繼續
```

---

## ch00｜基礎準備

### 帳號申請順序（依序切換畫面）

1. google.com → 確認有帳號（人人都有）
2. github.com → 用 Google 登入建帳號
3. claude.ai → 建帳號
4. supabase.com → 用 Google 登入
5. vercel.com → 用 GitHub 登入

### 安裝 Claude Code Desktop

> 打開 claude.ai 網頁版，問 Claude：
> - 「我想裝 Claude Code Desktop，幫我一步一步說」
> - （按官網下載，安裝完畢）
> - 「裝完了，我現在看到什麼畫面？」

### 用 Claude Code Desktop 裝環境

> 在 Claude Code Desktop 問：
> - 「幫我檢查電腦有沒有裝 Node.js，沒有的話幫我裝」
> - 「幫我檢查有沒有裝 Git，告訴我怎麼裝」
> - 「裝好了，幫我驗證 `node -v` 和 `git --version`」
> - 「我想裝 Vercel CLI，指令是什麼？」→ `npm i -g vercel`
> - 「我想裝 Supabase CLI，指令是什麼？」→ `npm i -g supabase`

---

## ch01｜Landing Page 生成

> - 「幫我用 Next.js 建一個 AI 課程網站，名稱叫 AILESSON」
> - （等跑完 `npx create-next-app`）
> - 「幫我加一個 Hero 區塊，有標題、副標題、購課按鈕」
> - 「按鈕顏色改成藍色，背景深色系」
> - 「幫我跑起來看看，指令是什麼？」→ `npm run dev`

---

## ch02｜Google 登入

> ⚠️ 錄影重點：先把 Supabase 專案建好、env 填好，再讓 Claude 開始寫 code。
> 畫面不能在有缺 env 的狀態下 `npm run dev`，會爆錯。

### 第一段：建 Supabase 專案 & 拿 env（純畫面操作，不問 Claude）

1. 開瀏覽器 → supabase.com → 登入
2. New project → 填名稱（例如 `ailesson`）、設密碼、選 Region → Create
3. 等建立完成（約 30 秒）
4. Project Settings → API → 複製：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 回 Claude Code，問：
   > 「幫我建 .env.local，加入這兩個變數」（直接貼上兩個值）

### 第二段：請 Claude 加 Google Auth

> - 「幫我用 Supabase Auth 做 Google 登入，建立登入頁跟登出按鈕」
> - （Claude 裝 `@supabase/supabase-js`、建 supabase client、寫登入 route）
> - `npm run dev` → 確認畫面正常，點登入按鈕

### 第三段：設 Google OAuth redirect URI

> - 問 Claude：「Supabase 的 Google OAuth redirect URI 是什麼格式？」
> - → 拿到 `https://<project>.supabase.co/auth/v1/callback`
> - 去 Supabase Dashboard → Authentication → Providers → Google → 填入 Client ID / Secret
> - （Google Cloud Console 設定可以用 Claude 指引，或直接說「去 console.cloud.google.com 建 OAuth 憑證」）

### 第四段：登入後跳轉到 /dashboard

> - 「登入成功後我想跳轉到 /dashboard，怎麼做？」
> - （Claude 修改 auth callback 邏輯）

**踩坑示範：**
> - 「登入後跑回首頁了，為什麼？」→ 演示 Supabase Dashboard → Authentication → URL Configuration → Site URL 沒設好 → 改成 `http://localhost:3000` → 修好

---

## ch03｜環境變數 & 部署

### 第一段：env 安全觀念

> - 「`.env.local` 裡有哪些東西不能 commit？」
> - 「幫我確認 `.gitignore` 有沒有包含 `.env.local`」

**踩坑示範：**
> - 「我用 echo 複製 Supabase anon key 結果登入壞掉，為什麼？」
> - → 示範 echo 複製出來的 key 末尾有換行符 → 直接貼到 .env.local 就錯了
> - → 正確做法：直接從 Supabase Dashboard 網頁複製貼上，不要過 terminal

### 第二段：加 Supabase env 到 Vercel & 部署

> ⚠️ 順序很重要：先加 env，再 deploy，不然 Vercel 上的網站會因為缺 env 爆錯。

1. 問 Claude：「我要部署到 Vercel，用 CLI 怎麼做？」→ `vercel`
2. 跑完後 Vercel 給你一個 `.vercel.app` 網址，**先複製起來**
3. 問 Claude：「Vercel 上要怎麼加環境變數？」
   - → Vercel Dashboard → Project → Settings → Environment Variables
   - → 加入 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - → 加完後要 redeploy（`vercel --prod`）

### 第三段：更新 Supabase & Google OAuth 設定

> 部署後 localhost 換成正式網址，兩個地方要同步更新，不然 Google 登入會壞。

1. **Supabase Site URL**：
   - Supabase Dashboard → Authentication → URL Configuration
   - Site URL 改成 `https://你的專案.vercel.app`
2. **Google OAuth redirect URI**：
   - Google Cloud Console → 你的 OAuth 2.0 憑證
   - Authorized redirect URIs 加入 `https://<supabase-project>.supabase.co/auth/v1/callback`（這個不變，但確認有填）
   - Authorized JavaScript origins 加入 `https://你的專案.vercel.app`

---

## ch04｜Stripe 金流串接

### 第一段：拿 Stripe key & 補 env（先做，跟 ch02 Supabase 一樣邏輯）

> ⚠️ 先拿 key 填好 env，再叫 Claude 寫 Stripe code，不然跑起來直接噴錯。

1. 開瀏覽器 → stripe.com → 登入（確保在 Test mode）
2. Developers → API keys → 複製：
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
3. 問 Claude：「幫我把這兩個 Stripe key 加到 .env.local」（貼上兩個值）
4. `STRIPE_WEBHOOK_SECRET` 先留空，等第三段 `stripe listen` 跑起來再填

### 第二段：請 Claude 建 Stripe Checkout

> - 「幫我用 Stripe 建一個購課的 Checkout Session API，成功後導回 /success」
> - 「Supabase 要建什麼資料表來記錄購買紀錄？建好後也幫我在 Webhook 寫入」
> - 「幫我建 Stripe Webhook handler，路徑是 /api/webhooks/stripe」

### 第三段：本機測試 Webhook

> ⚠️ 本機測試的 Webhook Secret 跟正式環境不同，這裡先用 `stripe listen` 的本機 secret。

1. 問 Claude：「本機測試 Webhook 要怎麼做？」
   → `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. 終端機跑起來後會顯示 **`whsec_...`** → 這是**本機 webhook secret**
3. 把這個 secret 填進 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`
4. 重跑 `npm run dev`

**完整流程測試：**
> 購課按鈕 → Stripe 付款頁 → 測試卡號 `4242 4242 4242 4242` → 成功 → 導回 /success → Dashboard 解鎖

---

## ch05｜Debug 實戰

> - 「我的 Webhook 沒有觸發，怎麼 debug？」
> - 「Vercel Function Logs 在哪裡看？」
> - 「用 Supabase CLI 怎麼看 DB 狀態？」

**真實示範：**
> 故意把 Supabase Site URL 填錯 → OAuth 壞掉 → 用 Vercel Logs + Supabase CLI 找出來 → 修好

---

## ch06｜收尾 & 發布

### 第一段：加 Stripe 正式 Webhook & 換 secret

> ⚠️ ch04 用的是本機 `stripe listen` 的 webhook secret，正式環境要換成 Stripe dashboard 產的。

1. stripe.com → Developers → Webhooks → Add endpoint
   - URL 填：`https://你的專案.vercel.app/api/webhooks/stripe`
   - 事件選：`checkout.session.completed`
2. 建完後 Stripe 給你新的 **`whsec_...`**（正式 webhook secret）
3. Vercel Dashboard → Settings → Environment Variables
   - 把 `STRIPE_WEBHOOK_SECRET` 換成這個新的值
4. 同時確認 `STRIPE_SECRET_KEY` 和 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 也在 Vercel env 裡

### 第二段：最終 commit & 部署

> - 「幫我做最後的 git commit 和 push」
> - （push 完等 Vercel 自動部署，讓觀眾看那 30 秒）

### 第三段：部署後更新設定

1. **Supabase Site URL**（如果 ch03 已做可跳過）：
   - Authentication → URL Configuration → Site URL 確認是正式網址
2. **完整流程驗證**：
   - 正式網址 → Google 登入 → 購課（測試卡）→ Stripe Webhook 有觸發 → Supabase 有寫入 → Dashboard 解鎖

---

## 帳號準備清單

| 服務 | 動作 | 備註 |
|------|------|------|
| Google | 新開一個 | 全程用這個帳號 |
| GitHub | 新帳號或子帳號 | 連結新 Google |
| Claude.ai | 新帳號 | 安裝 Claude Code Desktop 時授權 |
| Supabase | 用新 Google 登入 | 錄影時現場建 |
| Vercel | 用新 GitHub 登入 | 錄影時現場建 |
| Stripe | 新帳號（test mode）| ch04 用 |
