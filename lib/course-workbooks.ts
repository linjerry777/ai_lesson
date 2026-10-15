import type { Lesson } from './course-data'

interface Workbook {
  outcome: string
  exercise: string
  evidence: string
  checklist: string[]
  code?: { lang: string; content: string }
  reference: { text: string; url: string }
}
const docs = {
  claude: { text: 'Claude Code 官方 Desktop 使用說明', url: 'https://code.claude.com/docs/en/desktop' },
  next: { text: 'Next.js 官方 App Router 文件', url: 'https://nextjs.org/docs/app' },
  google: { text: 'Supabase 官方 Google OAuth 流程', url: 'https://supabase.com/docs/guides/auth/social-login/auth-google' },
  ssr: { text: 'Supabase 官方 SSR 與 Cookie 流程', url: 'https://supabase.com/docs/guides/auth/server-side/creating-a-client' },
  stripe: { text: 'Stripe 官方 Webhook 與重送說明', url: 'https://docs.stripe.com/webhooks' },
  currency: { text: 'Stripe 官方貨幣單位：TWD 收款與 payout', url: 'https://docs.stripe.com/currencies' },
  vercel: { text: 'Vercel 官方部署與環境說明', url: 'https://vercel.com/docs/deployments' },
  images: { text: 'OpenAI 官方圖像生成與編輯文件', url: 'https://developers.openai.com/api/docs/guides/image-generation' },
  render: { text: 'Remotion 官方 render 命令', url: 'https://www.remotion.dev/docs/cli/render' },
  sequence: { text: 'Remotion 官方 Sequence 時間軸', url: 'https://www.remotion.dev/docs/sequence' },
  license: { text: 'Remotion 官方授權條件', url: 'https://www.remotion.dev/license' },
}

export const workbooks: Record<string, Record<string, Workbook>> = {
  'starter-free': {
    start00: {
      outcome: '把一個產品構想拆成可以逐項證明的任務，先建立驗收再讓 AI 寫程式。',
      exercise: '以「讀書筆記網站」為練習產品。寫出受眾、要解決的一個問題，以及首頁、儲存筆記、讀回筆記三個小任務。每個任務用「輸入 → 操作 → 可觀察結果」描述；例如重新整理後仍讀到原筆記。先只請 AI 評閱需求，不生成登入或付款。',
      evidence: '儲存 practice-brief.md，含三個任務、每項驗收和本次不做的功能。將 AI 建議與自己採用的修改分開記錄。',
      checklist: ['三個任務各只有一個主要成果', '每項結果都能用瀏覽器或檔案確認', '清楚列出不做付款與發布', '能解釋畫面成功與資料真正儲存的差異'],
      reference: docs.claude,
    },
    start01: {
      outcome: '用本機 PowerShell 證明目前目錄與工具環境，保留可讀的版本紀錄。',
      exercise: '建立全新 ai-practice 資料夾，先執行下面命令。把版本號及目前完整路徑記錄到 environment.md；哪個命令失敗就先處理那一個，不一次重灌全部。關掉終端機後重開，再確認相同路徑能讀到檔案。',
      code: { lang: 'powershell', content: 'Get-Location\nnode --version\nnpm --version\ngit --version\nNew-Item -ItemType File -Path environment.md\nGet-ChildItem' },
      evidence: 'environment.md 含 OS、工作路徑、三個版本號、失敗專案及下一個檢查。不要放帳號憑證。',
      checklist: ['知道指令在哪個目錄執行', '三個版本命令各有結果', 'environment.md 實際存在', '重開終端機仍能讀到檔案'], reference: docs.next,
    },
    start02: {
      outcome: '把頁面、元件、API 和秘密設定定位到正確檔案，知道什麼可以傳給 AI。',
      exercise: '讀一個 Next.js 專案，不改任何檔案。找出首頁、登入頁、服務端 API、共用工具和 .gitignore。建立 project-map.md，每個檔案各寫一句責任；用不存在的假 key 建 .env.local.example，只列變數名稱。執行 git check-ignore 確認秘密檔被忽略。',
      code: { lang: 'powershell', content: 'git status --short\ngit check-ignore .env.local\n# 輸出 .env.local 才表示已被忽略；沒有輸出先檢查 .gitignore。' },
      evidence: 'project-map.md 與不含真實金鑰的 .env.local.example。',
      checklist: ['可指出 app 與 lib 的不同責任', '知道 NEXT_PUBLIC_ 的值可能出現在瀏覽器', 'secret 沒放在前端', '.env.local 沒被 Git 追蹤'], reference: docs.ssr,
    },
    start03: {
      outcome: '整理一份有證據、可重現且已遮蔽秘密的求助單。',
      exercise: '在專用練習資料夾執行 node missing-file.mjs，取得找不到模組的錯誤。記錄命令、工作目錄、錯誤碼、預期及實際結果。請 AI 只提出第一個檢查；自己確認檔案不存在後，新增只輸出 hello 的檔案再重跑。求助單先刪除完整 key、Cookie、token 和個人資料。',
      code: { lang: 'javascript', content: '// missing-file.mjs：確認原本不存在後才新增\nconsole.log("hello")' },
      evidence: 'debug-note.md 含修改前錯誤、單一假設、最小修改與修改後輸出。',
      checklist: ['另一人能照命令重現', '沒貼秘密或登入資訊', '修正有對應假設', '有修正後證據', '預備課成果包含 brief、environment、map、debug 四份檔案'], reference: docs.claude,
    },
  },
  'claude-code': {
    ch00: {
      outcome: '留下可重建的開發環境與費用邊界，不靠一份會過時的工具清單。',
      exercise: '建立 environment.md，記錄 OS、Node/npm/Git 版本、Claude Code 可用工作階段及你選的 Next.js/Tailwind 版本。帳號資格和第三方費用列在 costs.md：課程費、Claude 方案、API、主機、支付費用分開。沒有 key 先保留變數名稱，禁止把 key 放在環境紀錄。Stripe CLI 安裝方式從官方文件選與 OS 相符的方式。',
      code: { lang: 'powershell', content: 'node --version\nnpm --version\ngit --version\nvercel --version\nstripe --version\n# 已有專案再檢查：\nnpm ls next tailwindcss --depth=0' },
      evidence: 'environment.md、costs.md；每項工具有版本或明確未安裝原因。',
      checklist: ['Code 工作階段確實能讀所選資料夾', '沒有使用不存在的第三方技能當必要步驟', '知道訂閱與 API 費用分開', '知道任何付費或合約步驟需自行決定'], reference: docs.claude,
    },
    ch01: {
      outcome: '做出可在桌機與手機驗收的首頁，保留需求與畫面對照。',
      exercise: '先建立 requirements.md：課程受眾、前置能力、實際交付、價格及尚未開放狀態。請 Claude 每次只做一區，再執行 dev 與 build。用 390px 和桌機寬度檢查文字、導航及按鈕去向。付款未串妥時不能顯示可購買；沒有資料來源就移除見證、星等和獲利敘述。',
      code: { lang: 'powershell', content: 'npm run dev\n# 另一個終端機，使用 package.json 已存在的指令：\nnpm run build\ngit diff --stat' },
      evidence: '首頁桌機及手機截圖、build 結果、CTA 去向表與 requirements.md。',
      checklist: ['手機沒有根層水平溢位', '所有主要按鈕可到達正確目的地', '沒有捏造數字或學員回饋', 'build 完成且有修正紀錄'], reference: docs.next,
    },
    ch02: {
      outcome: '分清兩段 OAuth 回呼，用登入、重新整理與登出證明 session。',
      exercise: '畫出 Google → Supabase /auth/v1/callback → 網站 /api/auth/callback → /dashboard。Google Console 填 Supabase provider 的精確 Callback URL，Supabase Redirect URLs 填網站回呼。網站 callback 使用 exchangeCodeForSession，再由服務端 getUser 確認身分。測未登入保護頁、登入後重新整理、登出後重進頁面；另測 next=https://example.invalid 不能把使用者帶離網站。',
      code: { lang: 'text', content: 'Google Authorized redirect URI:\nhttps://<project-ref>.supabase.co/auth/v1/callback\n\nSupabase allowed Redirect URL:\nhttp://localhost:3000/api/auth/callback\nhttps://<your-site>/api/auth/callback' },
      evidence: 'auth-acceptance.md 記錄四個流程與結果；截圖不得帶 OAuth code、token 或私人帳號資訊。',
      checklist: ['Google 回呼與網站回呼沒有混用', '伺服器驗證 getUser，未以 user_metadata 授權', '重新整理仍登入', '登出後未授權頁被阻擋', '外部 next 被拒絕'], reference: docs.google,
    },
    ch03: {
      outcome: '配置可以診斷，秘密無法被公開端點讀到。',
      exercise: '建立 env-matrix.md，逐項列名稱、用途、瀏覽器能否讀、local/preview/production 是否已配置。診斷 API 限管理者或本機使用，只回布林狀態與自己的資料，從不回完整 key 或 key 片段。故意移除一個本機非秘密設定並重啟，確認得到清楚錯誤；測完恢復。線上環境變數改動後必須重新部署。',
      code: { lang: 'text', content: '名稱 | 用途 | 前端可見 | Local | Preview | Production\nNEXT_PUBLIC_SUPABASE_URL | 專案網址 | 是 | SET | 待填 | 待填\nSUPABASE_SERVICE_ROLE_KEY | 服務端寫入 | 否 | SET | 待填 | 待填\nSTRIPE_SECRET_KEY | 付款服務 | 否 | TEST | 待填 | 暫停\n# 只記 SET/MISSING/TEST；不記真實值。' },
      evidence: 'env-matrix.md 與缺設定、恢復設定兩次測試結果。',
      checklist: ['secret 不帶 NEXT_PUBLIC_ 字首', 'debug 未登入時不揭露 user 或購買資料', '日誌與截圖沒有秘密', '知道 trim 只能修空白，不能修過期 key'], reference: docs.vercel,
    },
    ch04: {
      outcome: '在 Sandbox 證明付清 → 驗簽 → 資料庫 → 指定課程許可權；偽造返回網址無效。',
      exercise: '先核對有效 sk_test_、兩個 one-time TWD Price、每個 webhook 的 whsec_。Checkout 只能由伺服器挑 Price，metadata 帶 app_id、已驗證 user_id、product_id、tier。Webhook 用原始 request.text() 驗簽，再讀回 Stripe Session、Price 與 payment_intent，確認 paid、幣別、金額、退款狀態。以 (app_id,stripe_session_id) 唯一鍵處理重送，購買寫入後再回讀。測試卡只能在 Sandbox 使用；沒有有效 key 先跑本機合成事件，明確標示未測 Stripe 端。',
      code: { lang: 'sql', content: '-- 請在自己的 Sandbox DB 建表；共享 DB 須先看既有 schema。\n-- 主課售價 NT$990，Stripe amount 是 99000，存 integer。\ncreate unique index if not exists purchases_app_session_uidx\n  on public.purchases(app_id, stripe_session_id);\n-- 學員只有自己的 app-scoped SELECT；不得 INSERT/UPDATE 購買許可權。\n-- Webhook 驗簽成功、確認付清之後，服務端才可以寫入。' },
      evidence: 'sandbox-payment-receipt.md：Session/Event ID、事件送達、app/product、金額最小單位、DB 回讀和 learner 結果，不儲存 key 或測試卡欄位。',
      checklist: ['NT$990 對應 99000；NT$1490 對應149000', '改 body 或假簽章回400且零寫入', '未付清與錯商品不能解鎖', '相同事件重送只有一筆', 'A 的 Session 不能讓 B 學員解鎖', 'Sandbox 紀錄不當作 live 購買', '退款／爭議會撤銷課程許可權'], reference: docs.currency,
    },
    ch05: {
      outcome: '用固定網域驗收登入和 Sandbox 付款，留下可回復的部署證據。',
      exercise: '先在 GitHub 檢查 staged diff，確認沒有 env、私有資料或生成日誌。透過 Vercel Dashboard 匯入 Git repo 或使用 vercel link 連既有專案；部署命令與 Git import 是不同流程，vercel 本身可能啟動部署。記錄部署 ID 與穩定 alias。Preview 仍用 Sandbox，production 付款開關先關閉；驗收完成才自行處理 live 商家資格。',
      code: { lang: 'powershell', content: 'git status --short\ngit diff --cached\nnpm run build\n# 正式部署前另確認 account/project/env 與授權。\nvercel --help\nvercel link --help' },
      evidence: 'release-acceptance.md 含部署 ID、回復版本、alias、登入回呼、Sandbox webhook 與付費開關狀態。',
      checklist: ['固定 alias 指向經驗收的部署', '線上登入不回 localhost', 'key、Price、webhook 屬同一 Stripe 模式及帳號', 'HTTP200 之外有購買及課程回讀', '未經 live 驗收不開收款'], reference: docs.vercel,
    },
    ch06: {
      outcome: '用三個故障練習建立證據驅動的除錯習慣。',
      exercise: '只在本機練習分別注入：缺 env、錯 callback 路徑、錯 webhook 簽章。一次只改一項；記錄請求路徑、狀態碼、錯誤分類與最小修正。不要用 service_role 繞過購買 RLS 當通用解法，先判斷是身分、membership、app scope 或缺資料。最後重跑一次成功與一次拒絕路徑。',
      code: { lang: 'text', content: 'case_id:\n故障注入（只在本機）:\n重現命令／畫面:\n預期／實際:\n最可能原因與第一個檢查:\n最小修正:\n成功回歸證據:\n拒絕路徑仍有效:\n已恢復原設定：是／否' },
      evidence: 'debug-cases.md 至少三份紀錄，含恢復設定證據。',
      checklist: ['每次只改一個變因', '沒有公開 debug secret', '未關閉 RLS 或驗簽', '成功與拒絕路徑都重測', '可說清已驗證與尚未驗證的部分'], reference: docs.stripe,
    },
    ch07: {
      outcome: '交付第二個產品的規格、資料與授權差異，避免沿用錯的商品或設定。',
      exercise: '選「付費電子書」作為第二產品草稿。建立 product-catalog.md 和 threat-cases.md，明確列 slug、價格、幣別最小單位、交付、支援界線、存取及撤銷方式。不要只換 Price：同步檢查 app_id、資料 schema、RLS、Auth 回呼、webhook、秘密與 learner。複製模板前先確認授權，在新資料夾開新分支／repo，不刪掉既有 .git 或舊專案。',
      code: { lang: 'text', content: '第二產品驗收：\nA 已買電子書 → 可讀電子書\nA 未買動畫課 → 不能取得動畫課內容\nB 未買電子書 → 不能讀 A 的購買資料\n退款／爭議 → 撤銷內容存取\n未知 product/tier → 不建立 Checkout\n直接 /success → 不新增許可權' },
      evidence: 'product-catalog.md、threat-cases.md、handoff.md；說明可重用和必須重驗的模組。',
      checklist: ['商品交付具體可查', '不同產品許可權隔離', 'secret 與 webhook 不被複製到新 repo', '沒有承諾未提供的 cohort 或支援', '交接包含測試、限制及下一步'], reference: docs.next,
    },
  },
  'codex-remotion': {
    cr00: {
      outcome: '做出不用付費生成、可獨立驗收的兩段短片規格。',
      exercise: '第一個作品縮到 6 秒、30fps、兩段各 90frames。題材用自己的「今天學到的兩件事」，每段只有一個意思。先用你擁有權利的圖或純文字，完成腳本與時間軸；未驗收前不花模型額度、不上傳。5 分鐘長片是延伸練習，不是第一步。',
      code: { lang: 'json', content: '{"id":"practice-001","fps":30,"width":1280,"height":720,"segments":[{"id":"s01","from":0,"durationInFrames":90,"caption":"先把目標拆成可驗收的步驟"},{"id":"s02","from":90,"durationInFrames":90,"caption":"每次只修改一個片段"}]}' },
      evidence: 'episode.json 和 storyboard.md；每段寫鏡頭任務、字幕、素材及驗收。',
      checklist: ['總長6秒等於180frames', '第二段從90開始', '素材有權利來源', '沒有自動付費、render或發布'], reference: docs.sequence,
    },
    cr01: {
      outcome: '分清 Codex 產品、API、第三方代理與本機 render 的責任和成本。',
      exercise: '建立 tools-and-costs.md，逐項標註官方工具、第三方服務、本機軟體。Codex 訂閱不等於 API 額度；CliRelay 是選用的第三方橋接，不保證官方認可、可用性或授權。先用本機範例跑 JSON 驗證，模型端先保留未啟用。公司／多人用途的 Remotion 授權先讀官方條件，未確認前不做商業 render。',
      code: { lang: 'powershell', content: 'node --version\ngit --version\nffmpeg -version\n# 在已安裝 Remotion 的練習專案：\nnpx remotion --help\nnpx remotion compositions src/index.jsx' },
      evidence: 'tools-and-costs.md 含帳號可用性、key 是否配置、代理來源、授權與額度上限；不含 key 值。',
      checklist: ['模型尚未啟用時沒有發請求', '訂閱／API／代理費用分開', 'reference限制有產品與版本上下文', '確認 Remotion 授權適用性'], reference: docs.license,
    },
    cr02: {
      outcome: '把觀眾承諾轉成兩個具有畫面任務的原創片段。',
      exercise: '先寫一句「看完能帶走什麼」，再寫15到25字左右的短字幕及兩段旁白草稿。用30fps換算時間；朗讀一次確認不超時，超時就刪句而不是強行加速。請 Codex 只回JSON，不執行影象或TTS生成。對比兩段是否互相重複；每段都要有獨立畫面任務。',
      code: { lang: 'text', content: '請把我的原創觀點拆成兩段各3秒的短片草稿。\n每段輸出 id、from、durationInFrames、caption、voiceover、visualTask。\n30fps；from依序0、90；每段90frames。\n不要抄來源標題、角色或臺詞，不呼叫生成服務。\n旁白若超時，提出刪改建議，先不要產音訊。' },
      evidence: 'script-v1.json、script-v2.json 和朗讀時長紀錄；指出一項採用與一項拒絕的 AI 建議。',
      checklist: ['hook和內容能對應', '每段只有一個重點', 'frames沒有重疊或缺口', '原創來源與引用分開'], reference: docs.sequence,
    },
    cr03: {
      outcome: '定義視覺不變項和安全區，先確認素材再決定是否生成。',
      exercise: '用自己的原創角色或已授權圖片，建立 visual-spec.md：身份特徵、服裝、道具、鏡位及禁止變動項。以1280×720畫面為例，下方144px留字幕，重要面部不要落在右側資訊區。先在同一張圖比較兩種構圖，再批准一張採用；有原圖就不要為練習重生。',
      code: { lang: 'json', content: '{"assetId":"hero-v1","file":"assets/hero-v1.png","rights":"self-owned","referenceRole":"identity","canvas":{"width":1280,"height":720},"subtitleSafeArea":{"x":0,"y":576,"width":1280,"height":144},"invariants":["臉部與服裝保持一致"],"status":"reviewed"}' },
      evidence: 'visual-spec.md、asset-manifest.json，含來源、版本、採用原因與安全區；「有reference」不能視為擁有權利。',
      checklist: ['素材權利可說明', 'reference的身份和用途明確', '圖片沒有烙入需要改的字幕', '已讀模型及代理各自限制', '沒有未核准的付費生成'], reference: docs.images,
    },
    cr04: {
      outcome: '建立可以拒絕壞資料、能指出只需重做哪一段的 episode 格式。',
      exercise: '儲存 fps、width、height、segment.id、from、durationInFrames、caption、asset版本及dirty。驗證器應拒絕重複id、負時長、重疊、缺口和不存在的素材。複製正確JSON，分別改成同id及from=80，確認兩份都被拒絕。dirty表示待render，不能代表已成功render。',
      code: { lang: 'javascript', content: 'let end = 0; const ids = new Set();\nfor (const s of episode.segments) {\n  if (ids.has(s.id) || !Number.isInteger(s.durationInFrames) || s.durationInFrames <= 0 || s.from !== end) throw new Error("Invalid segment");\n  ids.add(s.id); end += s.durationInFrames;\n}\nconsole.log({frames: end, seconds: end / episode.fps});' },
      evidence: 'validate-episode.mjs、合法JSON的輸出及兩個反例；每次只將變更的segment標dirty。',
      checklist: ['有效資料可重複讀回', '至少兩個壞資料反例被拒絕', 'duration單位清楚', '素材版本不被覆蓋', '只有render成功與QC通過才清dirty'], reference: docs.sequence,
    },
    cr05: {
      outcome: '用真實 Remotion Composition 渲染單段，QC通過後才組合。',
      exercise: '用提供的本機練習包建立 Root 與 LessonSegment。每段90frames、30fps、1280×720，caption以React文字呈現；每段的useCurrentFrame從0開始，避免第二段動畫直接跳到結尾。先render一段，確認字幕、邊界、時長與音軌，再render第二段。若沒有音訊，不要假稱完成旁白。',
      code: { lang: 'powershell', content: 'npx remotion compositions src/index.jsx\nnpx remotion render src/index.jsx LessonSegment out/s01.mp4 --props=segment.json\nffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json out/s01.mp4\nffmpeg -v error -i out/s01.mp4 -f null -' },
      evidence: '單段MP4、ffprobe.json、完整解碼結果；concat前各段fps、尺寸與codec須一致，聲音須另驗。',
      checklist: ['Composition確實存在', '段落時長3秒且30fps', '字幕可讀不遮主體', '完整解碼無錯誤', '有／無音軌如實記錄'], reference: docs.render,
    },
    cr06: {
      outcome: '用明確狀態與確認點取代每次編輯就自動render或發布。',
      exercise: '先以JSON實作 draft → reviewed → rendering → rendered → qc-passed 的狀態轉換，不急著做完整GUI。修改s01字幕只將s01設dirty，s02輸出仍保留；如果render失敗，保持dirty並儲存錯誤。Upload只能產待確認草稿，不接受AI直接決定發布。關掉程式後重新讀JSON，確認狀態還在。',
      code: { lang: 'json', content: '{"id":"s01","dirty":true,"renderStatus":"draft","activeAsset":"hero-v1","output":null,"lastError":null,"upload":{"status":"not-requested","approvedBy":null}}' },
      evidence: 'state-transitions.md與修改前後JSON；列出哪些操作會增加成本或對外發布。',
      checklist: ['改腳本只影響該段', '失敗不清dirty', '重開能回讀狀態', '素材／render／QC／發布分開', '沒有自動對外動作'], reference: docs.render,
    },
    cr07: {
      outcome: '從參考內容提取結構，儲存可追溯的原創企劃。',
      exercise: '選兩個公開來源，記URL與查閱日；只分析問題、hook結構與節奏，不抄旁白、角色或畫面。提出三個不同的原創題材，每個填「觀眾問題、證據、自己的新角度、素材權利、製作限制」。人工選一個再建立draft；來源資料過時就重查，不以觀看數保證流量。',
      code: { lang: 'json', content: '{"sourceUrl":"https://example.invalid/reference","checkedAt":"填實際查閱日期","pattern":"先提出可驗證的問題","newAngle":"自己的觀點","rights":"link-only; no copied media","decision":"needs-human-review"}' },
      evidence: 'inspiration.json與originality-note.md；明確分開來源觀點、自己的觀點及待核實事實。',
      checklist: ['來源可追溯', '沒有複製故事或品牌身份', '候選不直接自動生成', '每個候選有製作邊界', '資料有查閱日期'], reference: docs.images,
    },
    cr08: {
      outcome: '交付可離線重播的影片、素材與復現說明，擴充長片前先做一次小型驗收。',
      exercise: '將6秒練習串起來，先按正常速度看兩次，檢查開頭承諾、兩段字幕、切換、結尾。再用ffprobe確認完整時長與編碼，用ffmpeg完整解碼。儲存README，列環境版本、命令、素材權利、無／有音軌與未完成項目。可另嘗試1.25x版本但必須重驗字幕與音訊，不當作預設品質提升。YouTube metadata只存草稿，不上傳。',
      code: { lang: 'powershell', content: 'ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json out/practice.mp4\nffmpeg -v error -i out/practice.mp4 -f null -\n# README記錄：6秒、兩段、素材來源、是否含聲音、重建命令。' },
      evidence: 'practice.mp4、episode.json、素材manifest、QC.json、README、metadata-draft.md。以後長片重複相同驗收流程，每段保留獨立輸出。',
      checklist: ['完整影片可重播且時長正確', '字幕與內容一致', '完整解碼無錯誤', '可用README重建', '權利與聲音邊界清楚', '上傳仍等待人工確認'], reference: docs.render,
    },
  },
}

export function attachWorkbook(productSlug: string, lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const book = workbooks[productSlug]?.[lesson.id]
    if (!book) throw new Error(`Missing workbook: ${productSlug}/${lesson.id}`)
    const promptLabel = productSlug === 'codex-remotion' ? '貼給 Codex 的任務' : undefined
    return { ...lesson, steps: [
      ...lesson.steps.map(step => ({ ...step, ...(step.claude && promptLabel ? { promptLabel } : {}) })),
      { title: '本章實作成果', body: book.outcome },
      { title: '動手練習', body: book.exercise, code: book.code },
      ...(productSlug === 'codex-remotion' && lesson.id === 'cr05' ? [{ title: '下載可重建的本機練習包', body: 'ZIP 包含 package.json、lockfile、兩段 episode、單段 props、完整 Remotion JSX、驗證器與 README；沒有模型金鑰、生成服務或發布設定。解壓後依 README 安裝與驗證。', link: { text: '下載 Remotion 本機練習包（已購學員）', url: '/api/course-resources?course=codex-remotion' } }] : []),
      { title: '交付與驗收', body: book.evidence, code: { lang: 'text', content: book.checklist.map(item => `□ ${item}`).join('\n') }, tip: '標記完成只是自己的學習紀錄；請保留以上成果，逐項確認後再前進。' },
      { title: '官方來源與版本核對', body: '核對日期：2026-09-30。介面、資格、費用和工具限制可能更新；操作前先看官方文件及自己的帳號狀態。本章不會代你付費、接受新條款或發布作品。', link: book.reference },
    ] }
  })
}
