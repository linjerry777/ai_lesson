# AI Lesson 收款與學員驗收

核對日期：2026-09-30。這份文件記錄本機準備和具體依賴；沒有啟用收款、建立 Stripe Session、真實訂單或對雲端寫入 migration。

## 目前能證明的部分

- 免費預備課 4 章、Claude Code 8 章、Codex/Image2/Remotion 9 章維持分開，全部文字教材。
- Checkout 由服務端驗證登入身分、商品、self tier、Price 模式／幣別／金額；使用 app/user/product/tier metadata、client_reference_id、PaymentIntent metadata 與重複點擊的 idempotency key。
- Webhook 用 Stripe SDK 驗原始 body、時間戳與簽章，再取回官方 Session、line item Price 和 PaymentIntent/charge。付清、商品、user、金額、幣別、模式、退款／爭議全部符合才授權。
- 購買透過服務端專用的原子 RPC 寫入；以 app/session 唯一鍵及不可改寫的購買身分防重送／換人。退款／爭議事件留撤權紀錄，與購買共用交易鎖；先退款、後授權及同時處理都不會重新開通。購買寫入後再回讀。
- `/success` 只讀目前 user/app/session 的 completed 購買，返回網址不能新增權限。學員頁與下載依同一模式的有效商品權限取資料，Sandbox 購買不當作 live。
- `/api/course-resources?course=codex-remotion` 為已購學員讀取私有 ZIP；未登入 401、未購／退款／其他用戶或其他 app 403、未知資源 404。ZIP 不在 public，Next tracing 已包含它。
- 瀏覽器進度保留原先 user-scoped store。選用雲端 API 以 getUser、商品權限及 RLS 控制；RPC derives auth.uid，不接受外部 user ID，逐章原子更新。未啟用時明確顯示本機進度；失敗保留本機及待同步備份。
- 外部 entitlement 只由已驗證 email 領取；先寫入、讀回身分／商品／狀態，再標 claimed。現有外部訂單為零，真實 provider/order 接口未驗收。

本機使用真正的 Stripe 簽章 SDK，但 Stripe API 回應是合成資料；隔離 PostgreSQL 使用合成 auth.uid/users 和經核對的購買 schema。這不是 Stripe Sandbox 結帳或雲端 OAuth 端到端證據。

## 缺少的設定與外部動作

| 項目 | 目前證據 | 啟用前需要 |
|---|---|---|
| Sandbox secret | 本機 sk_test_；account API 回 401 / api_key_expired | 在已存在帳號更新有效 Sandbox key，由使用者自行安全填入 env，不貼聊天 |
| Claude Code Price | STRIPE_PRICE_ID 有值，無法用過期 key 讀回 | active、one_time、twd、unit_amount=99000，同一 Sandbox/account |
| Codex Remotion Price | STRIPE_PRICE_ID_CODEX_REMOTION 未設定 | active、one_time、twd、unit_amount=149000，同一 Sandbox/account |
| Webhook secret | 有值，尚未確認對應 endpoint | 同一 Sandbox 的 /api/webhooks/stripe endpoint；自己的 signing secret |
| 付款資料庫 | 共享 purchases 的 app/session unique、payment_intent 欄位存在；AI Lesson 零購買 | 審閱並在確認的 DB 套用 payment-events migration，核對函式權限；未套用會回 500 供 Stripe 重送，不能開 Checkout |
| 雲端進度 | 新表與 RPC 尚不存在；功能預設 false | 審閱並套用 cloud-progress migration，再以兩個允許的測試帳號做 API／RLS／跨裝置回讀，最後才開功能 |
| Google登入 | provider 已啟用，callback 程式與安全 next 有檢查 | 使用允許的帳號，完成 session、重整、登出、A/B 權限與 membership 驗收；未接受新條款 |
| 外部訂單 | pending/claimed 均零 | 來源驗簽／商品映射／email 驗證／金額單位與來源模式契約，再驗受控訂單；不能以目前自動化測試聲稱已接上實際商店 |
| live 商家與服務政策 | 未啟用、未核實商家資格 | 由經營者確認帳號資格、交付與支援／退款政策、既有或新增條款；本次不接受合約、不開立新付費資源 |

使用這四種事件：`checkout.session.completed`、`checkout.session.async_payment_succeeded`、`charge.refunded`、`charge.dispute.created`。只勾 completed 無法完整處理付款／撤權。

保留的環境預設：

```dotenv
AI_LESSON_PAYMENTS_ENABLED=false
AI_LESSON_STRIPE_MODE=sandbox
AI_LESSON_CLOUD_PROGRESS_ENABLED=false
STRIPE_SECRET_KEY=由使用者填有效的Sandbox值
STRIPE_PRICE_ID=由使用者填990元SandboxPrice
STRIPE_PRICE_ID_CODEX_REMOTION=由使用者填1490元SandboxPrice
STRIPE_WEBHOOK_SECRET=與驗收endpoint匹配的值
```

TWD charges 使用兩位小數最小單位：NT$990=99000、NT$1490=149000。Stripe 對 TWD payout 的整數規則不是 charges 規則。參見 [Stripe currencies](https://docs.stripe.com/currencies) 與 [Webhook 官方說明](https://docs.stripe.com/webhooks)。

## Migration 與共享 DB 邊界

- `supabase/migrations/20260930120630_ai_lesson_cloud_progress.sql`：只新增 AI Lesson 進度表、RLS 與 invoker RPC。
- `supabase/migrations/20260930123002_ai_lesson_payment_events.sql`：只新增 AI Lesson 撤權表與服務端專用的付款／撤權 RPC，使用既有 shared purchases schema。
- 兩份只在 network=none、無對外 port 的 `ai-lesson-verify-20260930` 容器執行；沒有套用雲端。
- 不要盲目把 repo 所有歷史 migrations 推到共享 DB；先核對遠端 migration history、schema、依賴與本次差異。
- 共享 purchases 目前 anon/authenticated 有較廣 table grants，RLS 只提供符合 user+membership 的 SELECT，沒有購買 INSERT/UPDATE policy。SQL TRUNCATE 不受 RLS row policy 控制；需由共享 schema 管理者審閱最小權限。這不是已驗證的公開 HTTP exploit，本次沒有修改影響其他 app 的 grants 或政策。
- 外部 entitlement table 的 authenticated deny policy 與 service-only table grants 已讀回。

## Sandbox 驗收順序

1. 核對帳號、模式、有效 key、兩個 Price、endpoint secret 與 DB migration；保留公開付款入口關閉。
2. 使用受控、允許的測試學員 A，確認 Google→Supabase provider callback→網站 callback→membership→learner。重新整理仍登入，登出後拒絕保護頁；外部 next 無效。
3. 在明確允許的 Sandbox 測試入口建立 Checkout，用 Stripe 官方測試資料完成測試，沒有 real charge。驗收一次 990 元主課與一次 1490 元進階課。
4. 官方 event delivery、驗簽、資料庫 user/app/product/tier/amount/status 回讀、A 的指定課程及 ZIP 一致；B 不能讀 A 的購買、教材、進度、ZIP。直接 success URL 不授權。
5. 再驗錯 body/簽章、未付清、錯金額／模式／商品、事件重送、暫時 DB 故障重試、退款／爭議先到與後到。重送不能復活已撤權購買。
6. A 標記／取消完成、換章節、重開與第二裝置回讀；B 看不到 A。停網時顯示未同步且保留備份，重試後不能丟掉取消完成的操作。
7. 保存不含憑證／卡片欄位的 Session/Event IDs、部署 ID、endpoint delivery、DB 回讀與 learner 截圖。只有通過實際 Sandbox 才能稱該模式可用。
8. live 是獨立驗收：新 key/Price/endpoint、商家及服務政策、模式與授權。此次沒有 live 動作或啟用授權。

Google OAuth 的 provider callback 填 `https://<project-ref>.supabase.co/auth/v1/callback`，網站 callback 填 Supabase Redirect URLs。參見 [Google OAuth 官方流程](https://supabase.com/docs/guides/auth/social-login/auth-google)。

## 重跑本機驗證

```powershell
docker start ai-lesson-verify-20260930
node scripts/verify-local-db.mjs
$env:LESSON_VERIFY_PG_CONTAINER='ai-lesson-verify-20260930'
npm run check
docker stop ai-lesson-verify-20260930
```

腳本只允許指定容器、network none、無對外 port，操作其合成 fixture DB。一般 `npm run test` 會略過一個需要此容器的整合測試。沒有 Docker fixture 時不能將略過測試報成真實 DB 驗證。
