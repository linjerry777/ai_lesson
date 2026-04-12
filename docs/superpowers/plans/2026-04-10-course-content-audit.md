# Course Content Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 審查並修正 lib/course-data.ts 中所有 8 個章節（ch00~ch07）的內容，消除重複步驟、修正章節順序衝突、補齊缺漏。

**Architecture:** 所有課程內容集中在 `lib/course-data.ts` 的 `lessons` 陣列。每個 lesson 有 `steps[]`，每個 step 可以有 `body`、`claude`（複製提示詞）、`code`、`warning`、`tip`、`link`、`screenshot`。只需修改這一個檔案。

**Tech Stack:** TypeScript, Next.js 14, lib/course-data.ts

---

## 發現的問題總覽

| 章節 | 問題 | 嚴重度 |
|------|------|--------|
| ch00 | Step 4 安裝 Supabase CLI，但課程中完全用不到 | 低 |
| ch01 | Step 2 叫學生在終端機輸入 `claude`，但 ch00 教的是 Claude Code Desktop（GUI）| 中 |
| ch02 | Step 1 說「去 Supabase 建立帳號」，但 ch00 已經建過了 | 低 |
| ch03 | .env.local 模板包含 STRIPE_SECRET_KEY/PRICE_ID/WEBHOOK_SECRET，但 Stripe 在 ch04 才設定 | 高 |
| ch04 | Step 2「把 Stripe keys 加到 .env.local」措辭像是全部重建，應該是「補入」 | 低 |
| ch04 | Step 5 Webhook 設定需要 Vercel 線上網址，但 Vercel 部署在 ch05 | 高 |
| ch05 | Step 2 還有 `npm install -g vercel`，ch00 已裝過 | 中 |
| ch05 | Step 2 的 screenshot 是 `vercel-function-logs.png`，跟這步毫無關係 | 低 |
| ch06 | title/keyPoints/description 提到 CORS，但 steps 裡完全沒有 CORS 內容 | 中 |

---

## 檔案對照

- **修改：** `lib/course-data.ts`（唯一需要動的檔案）

---

## Task 1：ch00 移除 Supabase CLI

**Files:**
- Modify: `lib/course-data.ts`（ch00 Step 4）

- [ ] **Step 1：移除 Step 4 裡的 Supabase CLI 安裝指令**

找到這段：
```typescript
claude: `請幫我安裝以下工具：
1. 執行 npm install -g vercel 安裝 Vercel CLI
2. 執行 npm install -g stripe 安裝 Stripe CLI
3. 安裝完執行 vercel --version 和 stripe --version 確認有沒有裝成功
告訴我結果。`,
```

保留 Vercel CLI 和 Stripe CLI（ch05 用 `vercel`，ch04 用 `stripe listen`），不動。

同時把 keyPoints 裡的 `'安裝 Vercel CLI 和 Stripe CLI（後續章節會用到）'` 改成更明確說明用途：
```typescript
'安裝 Vercel CLI（ch05 部署用）和 Stripe CLI（ch04 本機測試 webhook 用）',
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch00 clarify Vercel/Stripe CLI usage in keyPoints"
```

---

## Task 2：ch01 修正 Claude Code 啟動方式

**Files:**
- Modify: `lib/course-data.ts`（ch01 Step 2）

**問題：** Step 2 叫學生在終端機輸入 `claude` 啟動，但 ch00 安裝的是 Claude Code Desktop（GUI），不是 CLI。應該改成「打開 Claude Code Desktop，切換到你的專案資料夾」。

- [ ] **Step 1：修改 ch01 Step 2**

把：
```typescript
{
  title: '啟動 Claude Code，告訴它你要什麼',
  body: '進入專案資料夾後，輸入 claude 啟動。然後把下面這段指令複製貼上給它：',
  code: { lang: 'bash', content: 'claude' },
  claude: `幫我建立一個賣線上課程的 Next.js Landing Page。...`,
  warning: '不要一次叫它做太多...',
},
```

改成：
```typescript
{
  title: '打開 Claude Code Desktop，告訴它你要什麼',
  body: '打開 Claude Code Desktop，點左上角選擇你剛建的專案資料夾（ai-lesson），然後把下面這段複製貼上給它：',
  claude: `幫我建立一個賣線上課程的 Next.js Landing Page。...`,
  warning: '不要一次叫它做太多...',
},
```
（移除 `code: { lang: 'bash', content: 'claude' }` 這行，body 不再叫學生打指令）

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch01 改為用 Claude Code Desktop 啟動，移除 CLI 指令"
```

---

## Task 3：ch02 移除重複的「建立帳號」說明

**Files:**
- Modify: `lib/course-data.ts`（ch02 Step 1）

- [ ] **Step 1：修改 ch02 Step 1 的 body**

把：
```typescript
body: '去 Supabase 建立帳號，然後建一個新專案。建完之後點左側「Project Settings → API」...',
```

改成：
```typescript
body: '登入 Supabase（帳號在 ch00 已建好），點右上角「New project」建一個新專案。建完之後點左側「Project Settings → API」...',
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch02 移除重複的 Supabase 帳號建立說明"
```

---

## Task 4：ch03 修正 .env.local 模板順序問題

**Files:**
- Modify: `lib/course-data.ts`（ch03 Step 1）

**問題：** ch03 的 .env.local 模板包含 `STRIPE_SECRET_KEY`、`STRIPE_PRICE_ID`、`STRIPE_WEBHOOK_SECRET`，但 Stripe 帳號和商品要到 ch04 才建立。學生跟到這步不知道填什麼。

- [ ] **Step 1：修改 ch03 Step 1 的 .env.local 模板**

把完整的 .env.local 模板分成「現在填得出來的」和「ch04 再補」：

```typescript
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
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch03 .env.local 模板標示哪些現在填、哪些 ch04 再補"
```

---

## Task 5：ch04 修正 Webhook 設定的順序問題

**Files:**
- Modify: `lib/course-data.ts`（ch04 Step 5，Stripe Webhook）

**問題：** Stripe Webhook 需要填入 Vercel 線上網址，但 Vercel 部署在 ch05。學生做到 ch04 Step 5 還沒有線上網址。

- [ ] **Step 1：在 ch04 Webhook 步驟加上提示，並調整措辭**

把 `title: '在 Stripe 設定 Webhook（讓付款通知打進來）'` 這個 step 的 body 開頭加上說明：

```typescript
{
  title: '在 Stripe 設定 Webhook（部署後才能完成這步）',
  body: '⚠️ 這步需要 Vercel 線上網址，請先完成 ch05 部署，拿到網址後再回來做。\n\n1. Stripe Dashboard → Developers → Webhooks → + Add endpoint\n2. Endpoint URL 填入你的線上網址\n3. Events 只勾選「checkout.session.completed」\n4. 建立後複製 Signing secret（whsec_xxx）加到 Vercel env',
  ...
```

同時把 Step 2（把 Stripe keys 加到 .env.local）的措辭改清楚：

```typescript
{
  title: '把 Stripe keys 補入 .env.local',
  body: '在 ch03 建好的 .env.local 裡，把下面兩行補進去：',
  ...
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch04 Webhook 步驟加入「需先完成 ch05」提示"
```

---

## Task 6：ch05 移除重複的 Vercel CLI 安裝

**Files:**
- Modify: `lib/course-data.ts`（ch05 Step 2）

- [ ] **Step 1：移除 ch05 Step 2 裡的 `npm install -g vercel`，並修正錯誤 screenshot**

把：
```typescript
{
  title: '安裝 Vercel CLI 並部署',
  code: {
    lang: 'bash',
    content: `npm install -g vercel\nvercel`,
  },
  tip: '跑 vercel 指令後會問你幾個問題...',
  screenshot: 'vercel-function-logs.png',   // ← 這個 screenshot 完全跟這步無關
},
```

改成：
```typescript
{
  title: '用 Vercel CLI 連結專案並部署',
  body: 'ch00 已裝好 Vercel CLI。在專案資料夾裡直接跑：',
  code: {
    lang: 'bash',
    content: `vercel`,
  },
  tip: '跑 vercel 指令後會問你幾個問題，選 Link to existing project 或建新的，找到你剛才的 GitHub repo 連起來。之後每次 git push，Vercel 自動重新部署。',
},
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch05 移除重複的 Vercel CLI 安裝，移除錯誤 screenshot"
```

---

## Task 7：ch06 補上 CORS 說明內容

**Files:**
- Modify: `lib/course-data.ts`（ch06 steps）

**問題：** ch06 的 title、description、keyPoints 都提到 CORS，但 steps 裡完全沒有任何 CORS 相關內容。要麼加內容，要麼移除提及。

- [ ] **Step 1：決策 — 移除 CORS 提及比補內容更省事，且課程本身沒有 CORS 踩坑**

把 ch06：
- `title` 從 `'Debug 實錄：500、session 消失、CORS'` 改成 `'Debug 實錄：500、session 消失、purchases 查不到'`
- `description` 移除「CORS 怎麼設、Supabase cookie 在不同 domain 的行為」
- `keyPoints` 移除 `'CORS 設定與 Supabase 跨 domain cookie 行為'`

改後 keyPoints：
```typescript
keyPoints: [
  '怎麼讀 Vercel function logs——找到真正的錯誤',
  '/api/debug 的設計：30 秒確認 session 與 env 狀態',
  'session 為什麼在線上消失——Supabase Site URL 設定',
  '付款成功但進不了 dashboard——RLS 和 serviceClient',
],
```

- [ ] **Step 2：Commit**
```bash
git add lib/course-data.ts
git commit -m "fix: ch06 移除未實作的 CORS 內容，修正 title 和 keyPoints"
```

---

## Self-Review

**Spec coverage check:**
- ch00 Supabase CLI ✅ Task 1
- ch01 Desktop vs CLI ✅ Task 2
- ch02 重複帳號 ✅ Task 3
- ch03 .env.local 順序 ✅ Task 4
- ch04 Webhook 需要 Vercel URL ✅ Task 5
- ch05 重複安裝 + 錯誤 screenshot ✅ Task 6
- ch06 CORS 承諾未兌現 ✅ Task 7

**Placeholder scan:** 無 TBD 或 TODO。

**Type consistency:** 所有修改都維持 `Step` interface 的欄位結構，不新增型別。
