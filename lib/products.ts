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
}

const CATALOGUE: Product[] = [
  {
    slug: 'shorts-studio-kit',
    kind: 'kit',
    name: 'AI 每日短影音工作流套件',
    latin: 'Shorts Studio Kit',
    tagline: '照著貼，就能跑。一行指令出一支 9:16 短片。',
    description:
      '訊號滿格、麻糬QQ 每天在用的同一條流水線：選題查證、逐句腳本與鏡頭、配音、Remotion 渲染、抽格 QC、數據回饋。打包成 Claude Code plugin 和一個可以直接渲染的專案。',
    price: 790,
    status: 'preorder',
    sticker: 'xun-explain',
    file: { path: 'kits/shorts-studio-kit-v1.0.zip', downloadName: 'shorts-studio-kit-v1.0.zip' },
    paymentLink: 'https://buy.stripe.com/7sYdR262V4ikfCReHu9MY00',
    paymentLinkId: 'plink_1USfRk5t4WzXNwwb3bDQvCyD',
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
    price: 490,
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
    price: 990,
    status: 'preorder',
    sticker: 'xun-thumbsup',
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

export const canBuy = (product: Product) => Boolean(product.paymentLink && product.file)

export const priceLabel = (product: Product) => (product.price === null ? '即將推出' : `NT$${product.price.toLocaleString('en-US')}`)
