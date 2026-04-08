# 錄影準備大綱

## 錄影前：一次性準備（開機就做）

### Linux VM 環境安裝

```bash
# 1. Node.js（用 nvm 裝）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts

# 2. Git
sudo apt install git
git config --global user.name "你的名字"
git config --global user.email "你的Gmail"

# 3. VS Code
# 官網下載 .deb，或：
sudo snap install code --classic

# 4. Claude Code
npm install -g @anthropic-ai/claude-code
# 啟動後用瀏覽器授權 Claude.ai 帳號，不需要 API Key
```

### 帳號準備清單

| 服務 | 動作 | 備註 |
|------|------|------|
| Google 帳號 | 新開一個 | 全程用這個帳號 |
| GitHub | 新帳號或子帳號 | 連結新 Google |
| Claude.ai | 新帳號 | 啟動 Claude Code 時瀏覽器授權 |
| Supabase | 用新 Google 登入 | 錄影時現場建 |
| Vercel | 用新 GitHub 登入 | 錄影時現場建 |
| Gumroad | 新帳號 | ch04 用 |

---

## ch00（新增）：環境設定與工具介紹

**這章要錄的內容：**
- Terminal 基本操作（`cd`、`ls`、`mkdir`）
- Git 是什麼、為什麼用（白話解釋）
- `git init` / `add` / `commit` / `push` 完整示範
- GitHub 建 repo、推上去
- Claude Code 介面導覽：各區塊是什麼
- 常見名詞速查：route、API、env、session、deploy

**要安裝的：**
- Git（上面已裝）
- VS Code（上面已裝）
- GitHub 帳號登入

**提前準備：**
- 空白資料夾 `demo-git` 練習 git 流程
- 準備 Claude Code 介面標注圖（可事後後製）

---

## ch01：Landing Page 生成

**這章要錄的內容：**
- `npx create-next-app@latest` 整個過程
- 啟動 Claude Code（`claude`），瀏覽器授權
- 貼入建站指令，即時看畫面生出來
- `npm run dev` 開本機預覽
- 幾輪調整修改的示範

**要安裝的：**
- Node.js（已裝）
- Claude Code（已裝）

**提前準備：**
- 課程品牌名、主色決定好
- ch01 的 Claude 指令文稿先看一遍

---

## ch02：Google 登入

**這章要錄的內容：**
- Supabase 建新專案（現場錄）
- 複製三個 Key（URL、anon、service_role）
- 建 `.env.local`
- Google Cloud Console 建 OAuth 憑證
- Supabase 啟用 Google Provider
- 踩坑示範：Site URL 沒設好 → OAuth code 跑到首頁
- 修好之後登入成功的畫面

**要建立的帳號/服務：**
- Supabase（新 Google 帳號登入，現場建）
- Google Cloud Console（同一個 Google 帳號，建 OAuth App）

**提前準備：**
- OAuth consent screen 填法確認（External）
- redirect URI 兩個都要加（localhost + Vercel 網址）

---

## ch03：環境變數設定

**這章要錄的內容：**
- `.env.local` 格式說明，`.gitignore` 確認
- Vercel 帳號建立 + 連結 GitHub repo（現場錄）
- Vercel Dashboard 手動加 env var（示範正確方式）
- `echo` 加換行符的坑示範
- 部署後確認 env 有沒有帶進去

**要建立的帳號/服務：**
- Vercel（GitHub 帳號登入，現場建）

**提前準備：**
- Vercel CLI：`npm install -g vercel`
- `echo "abc" | wc -c` vs `printf "abc" | wc -c` 示範差異

---

## ch04：金流串接（建議拆三段錄）

### 段落 A：Stripe 沙盒測試

**要錄的：**
- Stripe 帳號建立
- 建商品、取 Price ID
- Claude 串接 Checkout Session + Webhook
- Supabase 建 `purchases` 表（SQL）
- 測試卡 `4242 4242 4242 4242` 跑完整流程

**要安裝的：**
- Stripe CLI：`npm install -g stripe`（本機 webhook 測試用）

**提前準備：**
- purchases 表 SQL 備好
- Stripe 帳號（test mode）

### 段落 B：台灣金流困境

**要錄的：**
- 說明 Stripe 不支援台灣出金
- TapPay status 735 錯誤示範（截圖或 console 畫面）
- 解釋卡在哪裡、為什麼不繼續追

**提前準備：**
- 這段不用現場重現 bug，說明 + 截圖即可

### 段落 C：Gumroad 上線

**要錄的：**
- Gumroad 建帳號、新增產品、設定價格
- 取付款連結
- 把 landing page 購課按鈕換成 Gumroad 連結
- 建 `/activate` 頁面，串 License Key 驗證
- 完整測試：買課 → 拿 Key → 啟用 → 進 dashboard

**要建立的：**
- Gumroad 帳號
- 先建一個 $0 測試商品，測完再改正式價格

---

## ch05：Vercel 部署

**這章要錄的內容：**
- `git add` / `commit` / `push` 完整示範
- Vercel 偵測到 push 自動部署的過程（讓觀眾看那 30 秒）
- Vercel Dashboard env var 全部補齊
- 部署完更新 Supabase Site URL
- 標準工作流：改 → commit → push → 等 30 秒

**提前準備：**
- GitHub + Vercel 連動（ch03 已完成）

---

## ch06：Debug 實錄

**這章要錄的內容：**
- Vercel Function Logs 怎麼看
- 常見錯誤對照表（session 消失、CORS、RLS 擋住）
- `/api/debug` route 的設計與使用示範
- 真實示範：偵測 → 定位 → 修復一個 bug

**提前準備：**
- 建議示範「session 消失」這個 bug（最有共鳴）
- 故意在 Supabase 填錯 Site URL 觸發，然後現場修好

---

## ch07：課程包裝 & 收尾

（內容待補）

---

## 錄影當天 Checklist

```
□ Linux VM 乾淨開機
□ 所有帳號登出，準備用新 Google 帳號
□ 螢幕錄影軟體測試（Linux 推薦 OBS 或 Kooha）
□ 麥克風測試
□ 網路穩定（Supabase / Vercel 建立需要網路）
□ 每章的 Claude 指令文稿開在旁邊備用
□ 每章錄完先確認影片有聲音再繼續
```
