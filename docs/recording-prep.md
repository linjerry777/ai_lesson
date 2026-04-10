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

> - 「我想加 Google 登入，用 Supabase Auth，幫我一步一步做」
> - （Claude 會說要去 Supabase 建專案）
> - 「我建好了，這是我的 Supabase URL 和 anon key，幫我建 `.env.local`」
> - 「告訴我 Google Cloud Console 要設什麼 OAuth redirect URI」
> - 「登入後我想跳轉到 /dashboard，怎麼做？」

**踩坑示範：**
> - 「登入後跑回首頁了，為什麼？」→ 演示 Supabase Site URL 沒設好的問題 → 修好

---

## ch03｜環境變數 & 部署

> - 「`.env.local` 裡有哪些東西不能 commit？」
> - 「幫我確認 `.gitignore` 有沒有包含 `.env.local`」
> - 「我要部署到 Vercel，用 CLI 怎麼做？」→ `vercel`
> - 「Vercel 上要怎麼加環境變數？」

**踩坑示範：**
> - 「我用 echo 複製 key 結果 Stripe webhook 壞掉，為什麼？」→ 換行符問題示範 → 修好

---

## ch04｜Stripe 金流串接

> - 「我要接 Stripe 付款，幫我建 Checkout Session API」
> - 「Supabase 要建什麼資料表來記錄購買紀錄？」
> - 「幫我建 Stripe Webhook，付款成功後寫入 Supabase」
> - 「本機測試 Webhook 要怎麼做？」→ `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
> - 「測試卡號是什麼？」→ `4242 4242 4242 4242`

**完整流程測試：**
> 購課按鈕 → Stripe 付款頁 → 成功 → 導回 /success → Dashboard 解鎖

---

## ch05｜Debug 實戰

> - 「我的 Webhook 沒有觸發，怎麼 debug？」
> - 「Vercel Function Logs 在哪裡看？」
> - 「用 Supabase CLI 怎麼看 DB 狀態？」

**真實示範：**
> 故意把 Supabase Site URL 填錯 → OAuth 壞掉 → 用 Vercel Logs + Supabase CLI 找出來 → 修好

---

## ch06｜收尾 & 發布

> - 「幫我做最後的 git commit 和 push」
> - （push 完等 Vercel 自動部署，讓觀眾看那 30 秒）
> - 「部署完要更新 Supabase 的哪個設定？」→ Site URL 換成正式網址

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
