// Storefront catalogue for /shop. Every paid product follows the reproducibility
// rule: runnable starter + a setup prompt to paste into Claude Code + checkpoints
// that say what success looks like. Payments are paused (expired Stripe key), so
// "preorder" products collect emails instead of taking money.

export type ProductStatus = 'preorder' | 'soon'

export interface Product {
  slug: string
  kind: 'kit' | 'course'
  name: string
  latin: string
  tagline: string
  description: string
  /** Price in TWD; null while the product is not priced yet. */
  price: number | null
  status: ProductStatus
  /** Sticker in /public/stickers shown next to the product. */
  sticker: string
  includes: { title: string; text: string }[]
  steps: string[]
  requirements: string[]
  excluded: string[]
  previews?: { src: string; poster: string; label: string }[]
  faq?: { q: string; a: string }[]
  /** Stripe Payment Link (public URL) and its id. Present = the product can be bought now. */
  paymentLink?: string
  paymentLinkId?: string
  /** Built but not public yet (e.g. waiting for a real-account test). */
  hidden?: boolean
  /** Delivered file in the private `ai-lesson-downloads` bucket. */
  file?: { path: string; downloadName: string }
  /** Copy-paste pack delivered as a web page (JSON in the private bucket). */
  pack?: { path: string }
  /** A few items shown free on the product page. */
  samples?: { name: string; prompt: string }[]
  /** What an AI typically answers to the first sample (shown beside it). */
  sampleOutput?: { columns: string[]; rows: string[][] }
  /** Product images (in /public) shown on the product page. */
  gallery?: { src: string; alt: string; caption: string; phone?: boolean }[]
  /** Short highlights shown as chips under the title. */
  highlights?: string[]
  /** Who it is (and is not) for. */
  audience?: { yes: string[]; no: string[] }
  /** Course unlocked in /dashboard (Google login with the purchase email). */
  grantsCourse?: 'claude-code'
  /** A bundle: slugs of the products it delivers (current and future versions). */
  bundle?: string[]
  /** Crossed-out reference price shown next to the price. */
  compareAt?: number
}

const CATALOGUE: Product[] = [
  {
    slug: 'shorts-script-pack',
    kind: 'kit',
    name: '短影音爆款腳本指令包',
    latin: 'Shorts Script Pack',
    tagline: '複製、貼上、填空，30 秒拿到一支短影音腳本。',
    description:
      '13 組照著用就好的指令：找題目、四種腳本格式、開場鉤子、標題、字幕、說明欄、發布前檢查、一週排程。用免費版 ChatGPT、Gemini 或 Claude 就能跑，不用安裝任何東西，手機也能用。',
    price: 199,
    status: 'preorder',
    sticker: 'mochi',
    pack: { path: 'packs/shorts-script-pack-v1.json' },
    highlights: ['13 組指令', '免費版 AI 就能用', '手機也能用', '網頁版・按一下複製', '之後更新免費'],
    audience: {
      yes: ['想開短影音頻道，但每天不知道拍什麼', '寫好腳本卻沒人看完，不知道哪裡有問題', '沒寫過程式，只想複製貼上就好'],
      no: ['想要有人幫你拍、幫你剪', '想要保證爆紅的人'],
    },
    gallery: [
      { src: '/shop/pack-desktop.webp', alt: '指令包網頁：第一次用的 4 個步驟與章節', caption: '付款後打開的指令包網頁：4 步驟教學、章節一鍵跳轉' },
      { src: '/shop/pack-phone.webp', alt: '手機上的指令包網頁', caption: '手機也能用', phone: true },
      { src: '/shop/pack-phone-prompt.webp', alt: '指令卡片，要換的地方用粉紅色標出', caption: '要換的地方用粉紅色標好', phone: true },
    ],
    sampleOutput: {
      columns: ['題目', '第一秒畫面', '為什麼會想看完'],
      rows: [
        ['購物車放了 87 天，終於降價了', '購物車截圖，加入日期圈紅', '每個人都有一件「等降價」的東西'],
        ['凌晨兩點下單，早上完全不記得', '手機跳出出貨通知＋一臉疑惑', '深夜購物是大家的共同秘密'],
        ['為了免運 60 元，又多買了 400 元', '結帳頁「再買 340 元免運」', '湊免運的心情每個人都懂'],
        ['包裹到了，但我已經不想要了', '拆到一半就放棄的表情', '反轉＋自嘲，很容易被標記'],
        ['比價 3 小時，最後買了第一家', '瀏覽器開著 27 個分頁', '誇張數字，一秒看懂'],
      ],
    },
    paymentLink: 'https://buy.stripe.com/fZu00cajbbKM4Yd8j69MY04',
    paymentLinkId: 'plink_1USx4T5t4WzXNwwby0UJsVd5',
    includes: [
      { title: '13 組填空式指令', text: '每組都寫好「什麼時候用」，把【】換成你的內容就能送出。' },
      { title: '4 種腳本格式', text: '口播重點、○○的人分四種、故事反轉、今日三則新聞，都是我們頻道每天在用的。' },
      { title: '標題、字幕、說明欄一次搞定', text: '上傳前要的文字一次產好，含 AI 內容標示提醒。' },
      { title: '發布前檢查＆爛腳本救援', text: '讓 AI 用觀眾角度挑毛病，告訴你改哪裡分數最高。' },
      { title: '網頁版，按一下就複製', text: '付款完成直接打開，手機電腦都能用，之後更新免費。' },
    ],
    steps: ['付款完成，頁面直接打開指令包', '打開 ChatGPT／Gemini／Claude（免費版就行）', '按「複製」貼上，把【】換成你的內容', '照順序用下一組，拿到完整腳本'],
    requirements: ['一個免費的 ChatGPT、Gemini 或 Claude 帳號', '會複製貼上'],
    excluded: ['幫你拍片或剪片', '保證爆紅或保證收益'],
    samples: [
      {
        name: '試用｜10 個會被點開的題目',
        prompt: '幫我想 10 個短影音題目，主題是【你的主題，例：網購】。\n\n每個題目都要：\n1. 讓觀眾看到第一秒就覺得「這在說我」\n2. 有一個具體的畫面或數字（例：「購物車放了 87 天」）\n3. 一句話講得完\n\n用表格列出：題目｜第一秒畫面｜為什麼會想看完。\n最後幫我圈出你覺得最有機會爆的 3 個，說明原因。',
      },
    ],
    faq: [
      { q: '我完全不會用 AI 也可以嗎？', a: '可以。頁面最上面有 4 步驟教學，會複製貼上就能用。' },
      { q: '要付費的 ChatGPT 嗎？', a: '不用，免費版的 ChatGPT、Gemini、Claude 都可以。' },
      { q: '買了之後去哪裡看？', a: '付款完成會直接打開指令包網頁，請加入書籤，之後更新回同一頁就看得到。' },
    ],
  },
  {
    slug: 'shorts-studio-kit',
    kind: 'kit',
    name: 'AI 每日短影音工作流套件',
    latin: 'Shorts Studio Kit',
    tagline: '照著貼，就能跑。一行指令出一支 9:16 短片。',
    description:
      '訊號滿格、麻糬QQ 每天在用的同一條流水線：選題查證、逐句腳本與鏡頭、配音、Remotion 渲染、抽格 QC、數據回饋。打包成 Claude Code plugin 和一個可以直接渲染的專案。',
    price: 399,
    compareAt: 790,
    status: 'preorder',
    sticker: 'xun-explain',
    file: { path: 'kits/shorts-studio-kit-v1.0.zip', downloadName: 'shorts-studio-kit-v1.0.zip' },
    paymentLink: 'https://buy.stripe.com/fZu00c62VaGI0HX42Q9MY01',
    paymentLinkId: 'plink_1USgc15t4WzXNwwbbZUSypV5',
    includes: [
      { title: 'Claude Code plugin（5 個 skills）', text: 'news-short、meme-short、short-qc、channel-learning、new-host。Claude 照流程幫你做片，不用自己記步驟。' },
      { title: 'Remotion 專案 starter', text: '9:16 1080×1920。新聞模板 10 種鏡頭、圖鑑模板 70+ 種笑點鏡頭，字幕時間＝配音實際長度。' },
      { title: '一行指令出片', text: '配音（免費 edge-tts 或 Fish Audio 克隆聲音）→ 渲染 → 音量標準化 → QC 抽格圖與規格報告。' },
      { title: '範例主持人＋兩支範例集數', text: '原創角色「小方」6 種表情；一支 45 秒新聞、一支 30 秒圖鑑，裝好就能渲染。' },
      { title: '設定 prompt＋檢查點', text: '整段貼給 Claude Code 就會裝好環境；9 個檢查點寫清楚每一步成功長怎樣。' },
    ],
    steps: [
      '解壓縮，用 Claude Code 打開資料夾',
      '貼上設定 prompt：裝 Node 套件、Python 套件與 plugin',
      '渲染第一支範例片，看 QC 抽格圖',
      '跟 Claude 說「做今天的科技新聞短片」或「做一支手機人圖鑑」',
      '用 new-host 換成你自己的主持人',
    ],
    requirements: ['Node.js 20+、Python 3.10+、ffmpeg', 'Claude Code（訂閱或 API）', '會打開終端機、複製貼上指令'],
    excluded: ['自動上傳到 YouTube / IG（「YouTube＋IG 自動發布」課程即將推出）', 'Fish Audio、Claude 等第三方費用', '觀看數或收益保證'],
    highlights: ['5 個 Claude Code skills', 'Remotion 9:16 模板', '一行指令出片', '免費配音可用', '9 個檢查點'],
    audience: {
      yes: ['想每天穩定產出短影音，又不想每支都手動剪', '會開終端機、願意照步驟貼指令', '已經在用或想試 Claude Code'],
      no: ['完全沒碰過終端機（先買指令包）', '想要自動上傳（課程即將推出）'],
    },
    previews: [
      { src: '/kits/shorts-news-sample.mp4', poster: '/kits/shorts-news-sample.jpg', label: '範例：今日科技三則（45 秒）' },
      { src: '/kits/shorts-meme-sample.mp4', poster: '/kits/shorts-meme-sample.jpg', label: '範例：吃到飽人圖鑑（30 秒）' },
    ],
    faq: [
      { q: '我不會寫程式可以用嗎？', a: '要會打開終端機和複製貼上。剩下的步驟由 Claude Code 照 skills 做，卡住時檢查點會告訴你先看哪裡。' },
      { q: '一定要付費配音嗎？', a: '不用。預設用免費的 edge-tts；想用自己的克隆聲音再接 Fish Audio。' },
      { q: '可以用在有營利的頻道嗎？', a: '可以，影片是你的。套件本身不能轉售或公開分享，範例角色「小方」請換成你自己的。' },
    ],
  },
  {
    slug: 'auto-publish-course',
    hidden: true, // Jerry: real YouTube/IG test before it goes public
    kind: 'course',
    name: 'YouTube＋IG 自動發布：從授權到每日排程',
    latin: 'Auto Publish Course',
    tagline: '做好的短片，一行指令（或每天排程）發到 Shorts 和 Reels。',
    description:
      '8 章設定課程加一套發布腳本：Google Cloud 授權、YouTube API 審核、IG 專業帳號與 Meta App、第一次發布、每天自動排程。斷點續傳、不會重複發、授權快過期會提醒。可以單獨用，也可以接在短影音套件後面。',
    price: 199,
    compareAt: 490,
    status: 'preorder',
    sticker: 'mochi-love',
    file: { path: 'kits/auto-publish-kit-v1.0.zip', downloadName: 'auto-publish-kit-v1.0.zip' },
    includes: [
      { title: '8 章設定課程', text: '每章都有「成功長這樣」和「卡住時先看」，包含最多人卡關的 OAuth 同意畫面、YouTube API 審核與 IG token。' },
      { title: 'YouTube 上傳腳本', text: '一次授權長期使用、斷點續傳、AI 合成內容標示、排程公開，授權頻道不符就停止。' },
      { title: 'Instagram Reels 發布腳本', text: '自動產生只活幾分鐘的暫時影片網址（免註冊），建立 Reels 並發布，token 每週自動續期。' },
      { title: '一次發兩邊＋防重複', text: '同一支片重跑指令也不會發兩次；失敗只重做沒完成的那邊。' },
      { title: 'Claude Code plugin（2 個 skills）', text: 'publish-setup 一章一章帶你設定；publish-shorts 每天發布前先檢查授權與 QC。' },
    ],
    steps: [
      '安裝 Python 套件與 cloudflared',
      '建立 Google Cloud 專案並授權你的頻道',
      '把 IG 轉成專業帳號、在 Meta 後台產生 token',
      '私人模式測一次，再測防重複',
      '設定每天固定時間自動發布',
    ],
    requirements: ['Python 3.10+', '有 YouTube 頻道的 Google 帳號', 'Instagram 帳號＋Facebook 帳號（登入 Meta 開發者後台）'],
    excluded: [
      'YouTube 新專案在通過 API 審核前，上傳的影片會先是「私人」（課程教你申請審核與過渡做法）',
      '代為申請審核或代管帳號',
      'TikTok、Threads 等其他平台',
    ],
    faq: [
      { q: '會不會被平台當成機器人？', a: '用的是 YouTube 與 Instagram 官方 API，發到你自己的帳號，和官方 App 發布一樣。' },
      { q: '為什麼影片上傳後是私人？', a: '這是 YouTube 對還沒審核的新 API 專案的規定。審核通過前到 YouTube Studio 按一下公開即可，第 3 章教你申請審核。' },
      { q: '一定要買短影音套件嗎？', a: '不用。只要有做好的 mp4 就能用；有套件的話可以接在出片後面一路自動。' },
    ],
  },
  {
    slug: 'claude-code-course',
    kind: 'course',
    name: 'Claude Code 實戰課：做出會收錢的網站',
    latin: 'Claude Code Course',
    tagline: 'Landing Page、Google 登入、Stripe 付款、部署上線，8 章一次做完。',
    description:
      '文字實作課。跟著 8 個階段，用 Claude Code 做出一個有登入、付款、購買紀錄與課程解鎖的真網站，最後部署到 Vercel。適合有基本工程概念的人。',
    price: 490,
    compareAt: 990,
    status: 'preorder',
    sticker: 'xun-thumbsup',
    grantsCourse: 'claude-code',
    highlights: ['8 章文字實作', 'Google 登入', 'Stripe 收款', 'Vercel 部署', '每章驗收清單'],
    audience: {
      yes: ['想做自己的產品網站並真的收到錢', '看得懂基本 TypeScript 與錯誤訊息', '想學會用 Claude Code 做完整專案'],
      no: ['完全沒寫過程式（先買指令包）', '想看影片授課'],
    },
    gallery: [
      { src: '/shop/course-google-cloud-oauth-credentials.webp', alt: 'Google Cloud OAuth 憑證設定畫面', caption: '第 2 章：設定 Google 登入憑證' },
      { src: '/shop/course-supabase-google-provider.webp', alt: 'Supabase 開啟 Google 登入', caption: '第 2 章：Supabase 開啟 Google 登入' },
      { src: '/shop/course-stripe-create-product.webp', alt: 'Stripe 建立商品', caption: '第 4 章：在 Stripe 建立商品與價格' },
      { src: '/shop/course-stripe-webhook-setup.webp', alt: 'Stripe Webhook 設定', caption: '第 4 章：設定付款完成的 Webhook' },
      { src: '/shop/course-vercel-env-vars.webp', alt: 'Vercel 環境變數', caption: '第 5 章：部署時要填的環境變數' },
      { src: '/shop/course-vercel-function-logs.webp', alt: 'Vercel 函式紀錄', caption: '第 6 章：出錯時去哪裡看 log' },
    ],
    paymentLink: 'https://buy.stripe.com/dRm6oA2QJbKM76lare9MY02',
    paymentLinkId: 'plink_1USgdt5t4WzXNwwbmc8Rpd6G',
    includes: [
      { title: '8 章文字實作', text: '環境、Landing、登入、環境變數與除錯、Stripe、部署、除錯救援、重用模板。' },
      { title: '每章驗收清單', text: '每一章都有「做完應該看到什麼」，不是讀完就算。' },
      { title: '可重用的產品模板', text: '做完第一個網站，第二個產品照交接清單複製。' },
    ],
    steps: ['準備帳號與環境', '做 Landing Page', '接 Google 登入', '接 Stripe 付款（Sandbox）', '部署上線並驗收'],
    requirements: ['能操作終端機與 Git', '能讀基本 TypeScript 與錯誤訊息'],
    excluded: ['影片授課', '一對一指導', 'Claude、主機等第三方費用', '收益或完成時間保證'],
  },
  {
    slug: 'all-in-one',
    kind: 'kit',
    name: '全套：指令包＋工作流套件＋Claude Code 實戰課',
    latin: 'All-in-one Pass',
    tagline: '一次買齊，之後新上架的工作流也自動加進來。',
    description:
      '短影音爆款腳本指令包、AI 每日短影音工作流套件，加上 Claude Code 實戰課。之後上架的工作流（自動發布、懸案紀錄片、Q 版 MV）會直接加進全套，回到付款完成頁就能下載。',
    price: 799,
    compareAt: 1088,
    status: 'preorder',
    sticker: 'mochi-popcorn',
    bundle: ['shorts-script-pack', 'shorts-studio-kit', 'claude-code-course'],
    highlights: ['3 個產品一次拿', '省 NT$289', '之後新工作流自動加入'],
    gallery: [
      { src: '/shop/pack-desktop.webp', alt: '指令包網頁', caption: '指令包：網頁版，按一下複製' },
      { src: '/kits/shorts-news-sample.jpg', alt: '工作流套件渲染出來的新聞短片', caption: '工作流套件：直接渲染出來的範例片', phone: true },
      { src: '/shop/course-stripe-create-product.webp', alt: 'Stripe 建立商品', caption: '實戰課：從登入、收款到部署' },
    ],
    paymentLink: 'https://buy.stripe.com/eVq5kw8b3bKM4Yd9na9MY03',
    paymentLinkId: 'plink_1USgfk5t4WzXNwwb4TEd29ND',
    includes: [
      { title: '短影音爆款腳本指令包', text: '13 組複製貼上就能用的指令，網頁版，按一下就複製。' },
      { title: 'AI 每日短影音工作流套件', text: 'Claude Code plugin（5 個 skills）＋可直接渲染的 Remotion 專案。' },
      { title: 'Claude Code 實戰課', text: '8 章文字實作：登入、Stripe 付款、部署上線，做出會收錢的網站。' },
      { title: '之後上架的工作流', text: '自動發布、懸案紀錄片、Q 版 MV 推出後直接加進全套，不用再付錢。' },
      { title: 'LINE 社群答疑', text: '卡住就在社群問，我會回；常見問題整理回教材。' },
    ],
    steps: ['付款完成後在頁面下載套件', '用付款 Email 登入 Google 開通課程', '加入 LINE 社群', '照設定 prompt 開始做第一支片'],
    requirements: ['Node.js 20+、Python 3.10+', 'Claude Code（訂閱或 API）', '能操作終端機與 Git'],
    excluded: ['一對一指導或代做', 'Claude、主機等第三方費用', '收益或完成時間保證'],
  },
  {
    slug: 'mystery-doc-kit',
    kind: 'kit',
    name: '懸案紀錄片工作流',
    latin: 'Mystery Doc Kit',
    tagline: '查證 → 冷開場腳本 → 史料畫面 → 8 分鐘長片＋Shorts。',
    description: '麻糬QQ「懸案／山難事件簿」的做法：史料查證、調查桌場景、地形圖動畫、本機 AI 影片片段，長片與 Shorts 一起出。',
    price: null,
    status: 'soon',
    sticker: 'mochi-popcorn',
    includes: [],
    steps: [],
    requirements: [],
    excluded: [],
  },
  {
    slug: 'chibi-mv-kit',
    kind: 'kit',
    name: 'Q 版角色 MV 工作流',
    latin: 'Chibi MV Kit',
    tagline: '原創 Q 版角色放進電影感場景，整首歌一鏡一鏡做出來。',
    description: '角色設定稿、分鏡首幀、本機影片模型、對拍剪接與雙語字幕，一條 0 元的本機流程。',
    price: null,
    status: 'soon',
    sticker: 'mochi-love',
    includes: [],
    steps: [],
    requirements: [],
    excluded: [],
  },
]

/** Everything the site lists. Hidden products stay out of pages, sitemap and links. */
export const PRODUCTS: Product[] = CATALOGUE.filter(product => !product.hidden)

export function getProduct(slug: string) {
  return PRODUCTS.find(product => product.slug === slug) ?? null
}

/** What a purchase of `product` delivers: files to download and/or a course to unlock. */
export function deliverables(product: Product): Product[] {
  if (!product.bundle) return [product]
  return product.bundle.map(slug => CATALOGUE.find(item => item.slug === slug)).filter((item): item is Product => Boolean(item))
}

export const isDeliverable = (product: Product) => deliverables(product).some(item => item.file || item.grantsCourse || item.pack)

export const canBuy = (product: Product) => Boolean(product.paymentLink && isDeliverable(product))

export const compareLabel = (product: Product) => (product.compareAt ? `NT$${product.compareAt.toLocaleString('en-US')}` : null)

export const priceLabel = (product: Product) => (product.price === null ? '即將推出' : `NT$${product.price.toLocaleString('en-US')}`)
