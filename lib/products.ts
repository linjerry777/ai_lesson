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
  samples?: { name: string; prompt: string; example?: string; exampleImage?: string }[]
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
      '14 組照著用就好的指令：找題目、四種腳本格式、開場鉤子、標題、字幕、說明欄、發布前檢查、一週排程。用免費版 ChatGPT、Gemini 或 Claude 就能跑，不用安裝任何東西，手機也能用。',
    price: 199,
    status: 'preorder',
    sticker: 'mochi',
    pack: { path: 'packs/shorts-script-pack-v1.json' },
    highlights: ['14 組指令', '免費版 AI 就能用', '手機也能用', '網頁版・按一下複製', '之後更新免費'],
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
        ['購物車放了 87 天，你根本不想要', '購物車截圖，加入日期停在 87 天前', '想知道怎麼分辨「想要」跟「需要」'],
        ['為了免運多買 200，你到底省到什麼', '結帳頁跳出「再買 $200 享免運」', '每個人都湊過，想被戳破，也想要解法'],
        ['凌晨 1 點下的單，都是情緒在付錢', '訂單明細，時間寫 01:23', '被抓包的感覺很強，想看接下來怎麼被罵'],
        ['去年雙 11 買的，現在還沒拆', '房間角落，一疊沒拆的紙箱', '雙 11 快到了，想知道今年怎麼不再犯'],
        ['你不是愛買，是一天打開蝦皮 23 次', '手機螢幕使用時間，App 開啟次數 23', '把問題從「意志力」換成「習慣」，很新鮮'],
      ],
    },
    paymentLink: 'https://buy.stripe.com/fZu00cajbbKM4Yd8j69MY04',
    paymentLinkId: 'plink_1USx4T5t4WzXNwwby0UJsVd5',
    includes: [
      { title: '14 組填空式指令', text: '每組都寫好「什麼時候用」，把【】換成你的內容就能送出。' },
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
    slug: 'social-post-pack',
    kind: 'kit',
    name: 'IG／Threads 爆文指令包',
    latin: 'Social Post Pack',
    tagline: '找題目、寫貼文、輪播文案、回留言，複製貼上一套搞定。',
    description:
      '12 組照著用就好的指令：帳號設定、20 個題目、Threads 短文、IG 輪播文案、故事貼文、觀點文、10 種開頭、caption、回留言（含酸民）、一篇拆五篇、發文前檢查、一週排程。免費版 ChatGPT、Gemini、Claude 都能用。',
    price: 199,
    paymentLink: 'https://buy.stripe.com/cNifZa1MF2ac9et7f29MY05',
    paymentLinkId: 'plink_1UTKyC5t4WzXNwwboWrisy0M',
    status: 'preorder',
    sticker: 'mochi-love',
    pack: { path: 'packs/social-post-pack-v1.json' },
    highlights: ['12 組指令', '免費版 AI 就能用', '手機也能用', '每組附真實回覆範例', '之後更新免費'],
    gallery: [
      { src: '/shop/social-post-pack-desktop.webp', alt: 'IG／Threads 爆文指令包網頁', caption: '付款後打開的指令包網頁：4 步驟教學、章節一鍵跳轉' },
      { src: '/shop/social-post-pack-card.webp', alt: 'IG／Threads 爆文指令包的一張指令卡', caption: '每組都附實測的 AI 回覆範例', phone: true },
    ],
    samples: [
      { name: "Threads 短文", prompt: "用這個題目寫一則 Threads 短文：【題目】\n\n格式：\n1. 第一句就讓人想停下來（不超過 20 字）\n2. 中間 3 小段，每段 1–2 句\n3. 最後一句丟一個問題，讓人想留言\n\n全文 150 字以內。給我 2 個版本：一個比較溫和、一個比較犀利。", example: "版本 A：溫和\n\n存不了錢，真的不是你太廢。\n\n薪水一進來，房租、帳單、吃飯就先排隊領走了。剩下的本來就不多。\n\n每天上班已經很累，下班想吃好一點、買點小東西，很正常。\n\n所以不用逼自己更能忍，先讓存錢變簡單就好。像發薪日自動轉一小筆出去，看不到就不會想花。\n\n你現在用什麼方法存錢？還是還沒開始？\n\n版本 B：犀利\n\n別再罵自己沒意志力了。\n\n意志力這種東西，下班就用完了。拿最累的自己去跟外送 App 拚，本來就會輸。\n\n有用的不是更能忍，是根本不給自己選擇。\n\n薪水一入帳，就先自動轉走。看不到的錢，你就不會想花。\n\n問題不是你，是方法。你的錢最常被什麼「偷走」？\n\n兩篇都在 150 字內，第一句也都不到 20 字。裡面沒放數字，也沒放別人的經驗。\n\n兩篇的最後一句我都用開放式問題，大家比較好回。如果想讓留言更熱鬧，也可以改成二選一，例如「你是月光族，還是有存但存很慢？」。" },
    ],
    audience: {
      yes: ['經營 IG／Threads，每天不知道發什麼', '貼文寫好了但沒人互動', '小店、接案、個人品牌想固定發文'],
      no: ['想買粉絲或刷互動', '想要保證爆紅的人'],
    },
    includes: [
      { title: '12 組填空式指令', text: '每組都寫好「什麼時候用」，把【】換成你的內容就能送出。' },
      { title: '輪播文案＋caption', text: '8 頁輪播的每頁文字、封面大標、貼文說明和 hashtag 一次寫好。' },
      { title: '回留言（含酸民）', text: '貼上一排留言，每則都幫你寫好回覆，洗廣告的會標出來。' },
      { title: '一篇拆成 5 篇', text: '一個題目換 5 種形式發，一週的內容一次備齊。' },
      { title: '網頁版，按一下就複製', text: '付款完成直接打開，手機電腦都能用，之後更新免費。' },
    ],
    steps: ['付款完成，頁面直接打開指令包', '打開 ChatGPT／Gemini／Claude（免費版就行）', '從第 0 組帳號設定開始，複製貼上', '照順序用，AI 會記得你的帳號設定'],
    requirements: ['一個免費的 ChatGPT、Gemini 或 Claude 帳號', '會複製貼上'],
    excluded: ['幫你發文或代操帳號', '保證漲粉或爆紅'],
    faq: [
      { q: '我不會用 AI 也可以嗎？', a: '可以。頁面最上面有 4 步驟教學，會複製貼上就能用。' },
      { q: '要付費的 ChatGPT 嗎？', a: '不用，免費版的 ChatGPT、Gemini、Claude 都可以。' },
      { q: '寫出來的東西會不會很像 AI？', a: '第 0 組會先設定你的說話風格，之後每組都照這個寫；每組也附提醒，告訴你哪裡要換成自己的真實經驗。' },
    ],
  },
  {
    slug: 'work-prompt-pack',
    kind: 'kit',
    name: '上班族職場 AI 指令卡',
    latin: 'Work Prompt Pack',
    tagline: '履歷、面試、Email、會議記錄、週報、談加薪，一張卡解決一件事。',
    description:
      '11 張照著用就好的職場指令卡：履歷改寫、模擬面試、工作 Email、回難搞訊息、會議記錄、週報、簡報大綱、談加薪、試算表公式、看懂長文件、30 天學新技能。免費版 ChatGPT、Gemini、Claude 都能用。',
    price: 199,
    paymentLink: 'https://buy.stripe.com/9B69AM0IBcOQ3U9gPC9MY06',
    paymentLinkId: 'plink_1UTKyE5t4WzXNwwbeh6CLePz',
    status: 'preorder',
    sticker: 'xun-thumbsup',
    pack: { path: 'packs/work-prompt-pack-v1.json' },
    highlights: ['11 張指令卡', '免費版 AI 就能用', '手機也能用', '每張附真實回覆範例', '之後更新免費'],
    gallery: [
      { src: '/shop/work-prompt-pack-desktop.webp', alt: '職場指令卡網頁', caption: '付款後打開的指令包網頁：4 步驟教學、章節一鍵跳轉' },
      { src: '/shop/work-prompt-pack-card.webp', alt: '職場指令卡的一張指令卡', caption: '每組都附實測的 AI 回覆範例', phone: true },
    ],
    samples: [
      { name: "會議記錄整理", prompt: "把下面的會議內容整理成會議記錄：\n「【貼上筆記或逐字稿】」\n\n格式：\n1. 會議重點（3–5 點）\n2. 決議事項\n3. 待辦清單：表格｜事項｜負責人｜期限\n4. 還沒有結論、下次要討論的事\n\n只整理內容裡有的，沒提到負責人或期限的寫「未定」，不要自己補。", example: "會議記錄\n\n- 出席： 小美、阿傑、主管\n- 下次會議： 11/5\n\n1. 會議重點\n\n1. 上週活動報名人數 40 人，目標是 100 人，只達成 40%。\n2. 阿傑認為報名不足的主因是宣傳太晚，海報週三才出來。\n3. 下次活動改成提早兩週開始宣傳。\n4. 預算還要跟財務確認。\n5. 報名表改用 Google 表單。\n\n2. 決議事項\n\n- 下次活動提早兩週開始宣傳。\n- 海報由阿傑負責。\n- 報名表改用 Google 表單，由小美處理（主管同意）。\n- 下次會議訂在 11/5。\n\n3. 待辦清單\n\n事項｜負責人｜期限\n提供海報初稿｜阿傑｜下週一前\n向財務確認預算，並回覆大家｜主管｜週五前\n報名表改成 Google 表單｜小美｜未定\n提早兩週啟動宣傳｜未定｜未定\n4. 還沒有結論、下次要討論的事\n\n- 預算： 要等主管跟財務確認後（週五前）才有結論。\n- 提早宣傳的執行方式： 會議只定了「提早兩週」，誰統籌宣傳、從哪一天開始都還沒說。\n\n我用了會議裡的原話「下週一」「週五」，沒有換算成具體日期。如果這份要寄給沒參加會議的人，建議改成實際日期（例如 10/26），對方才不會看不懂。" },
    ],
    audience: {
      yes: ['每天被 Email、報告、會議記錄追著跑', '正在找工作、準備面試', '想用 AI 但不知道怎麼下指令'],
      no: ['公司禁止使用外部 AI 工具的人', '想要 AI 幫你做所有決定的人'],
    },
    includes: [
      { title: '求職：履歷＋模擬面試', text: '履歷對準職缺改寫，AI 當面試官一題一題問、一題一題給回饋。' },
      { title: '寫信、回訊息', text: '催款、催進度、回難搞客戶，給你「堅定但有禮貌」的版本和 LINE 短版。' },
      { title: '會議記錄、週報、簡報', text: '貼上逐字稿直接變會議記錄＋待辦清單；週報、簡報大綱一次排好。' },
      { title: '職場進階', text: '談加薪的說法、試算表公式、看懂長合約的重點、30 天學一個新技能。' },
      { title: '網頁版，按一下就複製', text: '付款完成直接打開，手機電腦都能用，之後更新免費。' },
    ],
    steps: ['付款完成，頁面直接打開指令卡', '找到你現在要做的那張卡', '按複製、貼進 ChatGPT／Gemini／Claude', '把【】換成你的內容，送出'],
    requirements: ['一個免費的 ChatGPT、Gemini 或 Claude 帳號', '會複製貼上'],
    excluded: ['法律、財務或人事上的專業意見', '代寫考試或作弊用途'],
    faq: [
      { q: '公司資料可以貼上去嗎？', a: '每張卡都會提醒你：涉及機密的內容，先把名字、金額換掉再貼。公司有規定的話以公司規定為準。' },
      { q: '要付費的 ChatGPT 嗎？', a: '不用，免費版就可以。逐字稿很長時，付費版能一次貼更多字。' },
    ],
  },
  {
    slug: 'story-short-pack',
    kind: 'kit',
    name: 'AI 漫劇／故事短片腳本指令包',
    latin: 'Story Short Pack',
    tagline: '從一個點子到一集 60 秒 AI 漫劇：角色、分鏡、生圖、動作、配音一路貼。',
    description:
      '12 組指令：系列設定、20 個故事點子、角色設定卡、單集分鏡、每鏡生圖提示詞（中英）、圖變影片的動作提示詞、配音稿、開頭救援、標題封面、連載規劃、改編不侵權、發布前檢查。腳本用 ChatGPT／Gemini／Claude，畫面和影片用即夢、可靈、ChatGPT 都可以。',
    price: 199,
    paymentLink: 'https://buy.stripe.com/5kQfZacrjeWY2Q51UI9MY07',
    paymentLinkId: 'plink_1UTKyG5t4WzXNwwbtU1mYFnk',
    status: 'preorder',
    sticker: 'mochi-popcorn',
    pack: { path: 'packs/story-short-pack-v1.json' },
    highlights: ['12 組指令', '分鏡＋生圖＋動作提示詞', '角色不跑掉的寫法', '每組附真實回覆範例', '之後更新免費'],
    gallery: [
      { src: '/shop/story-short-pack-desktop.webp', alt: '漫劇腳本指令包網頁', caption: '付款後打開的指令包網頁：4 步驟教學、章節一鍵跳轉' },
      { src: '/shop/story-short-pack-card.webp', alt: '漫劇腳本指令包的一張指令卡', caption: '每組都附實測的 AI 回覆範例', phone: true },
    ],
    samples: [
      { name: "單集分鏡腳本", prompt: "用這個點子寫一集：【點子】\n\n輸出分鏡表，每一鏡一列：\n鏡號｜秒數｜畫面描述（誰、在哪、在做什麼、鏡頭遠近）｜台詞或旁白｜字幕\n\n規則：\n1. 第 1 鏡就是最有衝突的畫面，不要從「某天早上」開始\n2. 每鏡 2–5 秒，總長照我的設定\n3. 最後一鏡是反轉，並且能讓人想重看\n4. 台詞每句 15 字以內", example: "社畜貓的一天｜第 X 集：〈忙到沒空領錢〉\n\n總長：50 秒｜16 鏡\n\n鏡號｜秒數｜畫面描述｜台詞／旁白｜字幕\n1｜0–3（3s）｜特寫：阿橘瞪大眼睛，耳朵壓成飛機耳，頭上冒汗。背景模糊處，墨經理正朝他走來，一隻手背在身後，露出一角紅色。｜阿橘（OS）：完了，他朝我走來了。｜完了，他朝我走來了。\n2｜3–6（3s）｜中景：阿橘瘋狂敲鍵盤，爪子快到出現殘影，桌上的保溫杯被震得一直跳。｜（音效：噠噠噠噠噠）｜（打字速度：時速 120 公里）\n3｜6–9（3s）｜過肩鏡頭（從阿橘背後拍）：螢幕上只打了一整排「ffffjjjj」。墨經理停在桌邊，手還背在身後。｜墨經理：阿橘，有空嗎？｜阿橘，有空嗎？\n4｜9–12（3s）｜近景：阿橘頭也不回，一把抓起桌上的電話，一臉專業。｜阿橘：喂？客戶您好！對對對！｜喂？客戶您好！對對對！\n5｜12–15（3s）｜特寫：電話線的另一頭沒有插，在空中晃來晃去。畫面邊緣，墨經理半瞇眼看著這一切。｜（無）｜（電話線：我沒插喔）\n6｜15–18（3s）｜中景：墨經理默默轉身走開，背後的紅色東西露出更多，尾巴尖勾成問號。後方的棉花抱著筆記本，眼睛發光。｜棉花：前輩好厲害！好忙喔！｜前輩好厲害！好忙喔！\n7｜18–21（3s）｜近景：阿橘整隻癱在椅子上，大大鬆一口氣，鼓起臉頰。｜阿橘：我才沒有在怕咧！｜我才沒有在怕咧！\n8｜21–24（3s）｜遠景：走廊另一頭，墨經理停下腳步，又轉身走回來，手上那角紅色一閃。｜阿橘（OS）：又來了！？｜又來了！？\n……（節錄）" },
    ],
    audience: {
      yes: ['想做 AI 漫劇、動態漫畫、故事短片', '會用即夢、可靈或 ChatGPT 生圖，但不會寫腳本', '想做一個固定主角的系列頻道'],
      no: ['想直接拿現成動漫角色來改（有侵權風險）', '想要一鍵自動出片的人（這包是腳本與提示詞）'],
    },
    includes: [
      { title: '系列設定＋角色卡', text: '主角外觀寫成可以直接貼給生圖 AI 的描述，每一鏡角色才不會長得不一樣。' },
      { title: '單集分鏡腳本', text: '每鏡秒數、畫面、台詞、字幕，第一鏡就是衝突、最後一鏡反轉。' },
      { title: '生圖＋動作提示詞', text: '每鏡中英文生圖提示詞，再給圖生影片工具的動作和鏡頭運動。' },
      { title: '配音稿、標題、連載', text: '念法和停頓標好的配音稿、標題封面、下 5 集規劃。' },
      { title: '網頁版，按一下就複製', text: '付款完成直接打開，手機電腦都能用，之後更新免費。' },
    ],
    steps: ['付款完成，頁面直接打開指令包', '用第 0 組設定你的系列和主角', '照順序產出點子、分鏡、生圖提示詞', '把提示詞貼到你的生圖／影片工具'],
    requirements: ['一個免費的 ChatGPT、Gemini 或 Claude 帳號', '生圖或影片工具（即夢、可靈、ChatGPT 等，依各工具方案）'],
    excluded: ['生圖、影片工具的費用', '幫你生成圖片或影片', '保證爆紅'],
    faq: [
      { q: '一定要會畫畫嗎？', a: '不用，畫面都交給生圖 AI。這包負責讓腳本、提示詞寫得對，角色前後一致。' },
      { q: '可以用動漫裡的角色嗎？', a: '不建議，有侵權風險。指令包裡的「改編」那組教你只取故事的核心衝突，用自己的角色重新演。' },
    ],
  },
  {
    slug: 'image-prompt-pack',
    kind: 'kit',
    name: 'AI 生圖指令包',
    latin: 'Image Prompt Pack',
    tagline: '縮圖、封面、貼圖、商品照、海報、資訊圖表，貼上就畫。',
    description:
      '11 組生圖指令：YouTube 縮圖、IG 封面、Q 版貼圖 6 表情、商品情境照、Logo 草稿、活動海報、資訊圖表、手繪心智圖、卡通頭貼、Q 版公仔盒、繪本插圖。直接貼進 ChatGPT 或 Gemini 就會畫，每組都附實際畫出來的圖。',
    price: 199,
    paymentLink: 'https://buy.stripe.com/eVq7sE3UN9CE8ap6aY9MY08',
    paymentLinkId: 'plink_1UTKyI5t4WzXNwwbCQafoRBd',
    status: 'preorder',
    sticker: 'mochi',
    pack: { path: 'packs/image-prompt-pack-v1.json' },
    highlights: ['11 組生圖指令', 'ChatGPT／Gemini 直接畫', '每組附實際畫出來的圖', '中文字不亂碼的寫法', '之後更新免費'],
    samples: [
      { name: "YouTube 縮圖", prompt: "幫我畫一張 YouTube 影片縮圖，16:9 橫式。\n\n影片主題：【一句話，例：月薪 3 萬怎麼存到第一桶金】\n畫面上的大字：「【8 個字以內】」\n主角：【例：一個 25 歲上班族，驚訝表情，手拿存錢筒】\n\n要求：\n1. 大字放左半邊，粗黑體、白字加黑色外框，手機上一眼看得清楚\n2. 主角放右半邊，表情誇張\n3. 背景簡單、高對比（例如亮黃色），不要太多小東西\n4. 中文字一定要正確、不要亂碼", exampleImage: '/shop/image-pack/img01.webp' },
    ],
    gallery: [
      { src: '/shop/image-pack-collage.webp', alt: '11 組指令實際畫出來的圖', caption: '實測：11 組指令原封不動丟給 AI 畫出來的圖（沒有修圖）' },
      { src: '/shop/image-pack/img03.webp', alt: '柴犬上班族 6 表情貼圖', caption: 'Q 版貼圖 6 表情', phone: true },
      { src: '/shop/image-pack/img06.webp', alt: '手作餅乾課活動海報', caption: '活動海報（中文字都正確）', phone: true },
    ],
    audience: {
      yes: ['經營 YouTube、IG，需要縮圖和封面', '開小店，需要商品照、海報、Logo 方向', '想用 AI 畫圖但每次都畫不出想要的'],
      no: ['需要精準品牌設計交付的人（請找設計師）', '想用別人的肖像或品牌商標的人'],
    },
    includes: [
      { title: '社群用圖', text: 'YouTube 縮圖、IG 封面、一組 6 表情的 Q 版貼圖。' },
      { title: '商品和品牌', text: '商品情境照、4 個方向的 Logo 草稿、活動海報。' },
      { title: '資訊圖表和教學', text: '重點整理資訊圖表、手繪風心智圖。' },
      { title: '人物和插畫', text: '不露臉的卡通頭貼、Q 版公仔盒、繪本風插圖。' },
      { title: '附實際畫出來的圖', text: '每組都放了同一段指令實際畫出來的結果，先看再決定要不要用。' },
    ],
    steps: ['付款完成，頁面直接打開指令包', '打開 ChatGPT 或 Gemini', '找到要的那張卡，複製貼上、把【】換成你的內容', '不滿意就說「只改 OO，其他不要動」'],
    requirements: ['ChatGPT 或 Gemini 帳號（免費版每天有生圖次數限制）', '會複製貼上'],
    excluded: ['生圖工具的費用', '商標或肖像權的授權', '保證每次都畫出一樣的圖'],
    faq: [
      { q: '免費版可以畫嗎？', a: '可以，ChatGPT 和 Gemini 免費版都能生圖，只是每天次數有限制。' },
      { q: '中文字會亂碼嗎？', a: '指令裡都有要求文字正確；新版的 ChatGPT、Gemini 中文字已經很穩，偶爾錯字就說「把字改成 XXX，其他不要動」。' },
    ],
  },
  {
    slug: 'carousel-studio-kit',
    kind: 'kit',
    name: 'IG 輪播圖產生器',
    latin: 'Carousel Studio',
    tagline: '跟 Claude Code 說一句主題，輸出一整組可以直接上傳的 IG 輪播圖。',
    description:
      'Claude Code plugin＋輪播圖渲染器。說一句主題、帳號和風格，Claude 會寫好每頁文案、排版、輸出 1080×1350 的 PNG（6–10 張），自動檢查字有沒有被切掉，最後附上貼文說明。4 種風格、6 種頁面。',
    price: 299,
    paymentLink: 'https://buy.stripe.com/bJe6oA62VeWYcqF9na9MY09',
    paymentLinkId: 'plink_1UTKyL5t4WzXNwwbUAXcaC1C',
    status: 'preorder',
    sticker: 'xun-explain',
    file: { path: 'kits/carousel-studio-kit-v1.0.zip', downloadName: 'carousel-studio-kit-v1.0.zip' },
    gallery: [
      { src: '/shop/carousel-sheet.webp', alt: '一句話做出來的 8 張養貓輪播', caption: '實測：只說「新手第一次養貓要準備的東西，帳號 @meow.daily，風格 mint」做出來的 8 張' },
      { src: '/shop/carousel-cat-01.webp', alt: '養貓輪播封面', caption: 'mint 風格封面', phone: true },
      { src: '/shop/carousel-sample-01.webp', alt: '手沖咖啡輪播封面', caption: 'dark 風格封面', phone: true },
    ],
    highlights: ['一句話出一整組', '1080×1350 PNG', '4 種風格', '自動檢查字被切掉', '附貼文說明'],
    audience: {
      yes: ['固定在發 IG 懶人包、教學輪播', '幫客戶代操社群，需要大量出圖', '已經在用或想試 Claude Code'],
      no: ['完全沒碰過電腦安裝軟體（先買 IG 爆文指令包）', '需要每張都精細客製設計的人'],
    },
    includes: [
      { title: 'Claude Code plugin（carousel skill）', text: '問清楚主題 → 寫文案 → 渲染 → 自己檢查 → 修到字都完整。' },
      { title: '輪播圖渲染器', text: '封面、重點、清單、金句、比較、結尾 6 種頁面；paper、bold、dark、mint 4 種風格。' },
      { title: '自動檢查＋總覽圖', text: '字被切掉、太靠近底邊會被標出來；每次輸出一張總覽圖，一眼看完整組。' },
      { title: '設定 prompt＋檢查點', text: '整段貼給 Claude Code 就會裝好；6 個檢查點寫清楚每一步成功長怎樣。' },
    ],
    steps: ['解壓縮，用 Claude Code 打開資料夾', '貼上設定 prompt：裝好環境、渲染範例', '跟 Claude 說「用 carousel 做一組輪播：主題 OOO」', '照 01、02… 順序上傳 IG'],
    requirements: ['Node.js 20 以上', 'Claude Code（訂閱或 API）', '會打開終端機、複製貼上指令'],
    excluded: ['自動發布到 IG', 'Claude 等第三方費用'],
    faq: [
      { q: '可以用自己的顏色和字型嗎？', a: '可以。跟 Claude 說你的品牌色，它會幫你在渲染器裡加一個新的風格。' },
      { q: '可以幫客戶做嗎？', a: '可以，做出來的圖可以商用；套件本身不能轉售或公開分享。' },
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
    hidden: true, // 2026-10-22 Jerry: unlisted until the 6 levels pass a real-account run-through
    kind: 'course',
    name: 'Claude Code 實戰課：做出會收錢的網站',
    latin: 'Claude Code Course',
    tagline: '6 關，每關貼一段指令給 Claude Code，做出能登入、收款、自動解鎖的網站。',
    description:
      '照貼就會版。下載 starter 專案，用 Claude Code 打開，一關貼一段指令：它會一步一步帶你設定 Google 登入、Stripe 收款、部署到 Vercel。每一關都寫好「成功長這樣」，卡住有現成的救援指令可以貼。',
    price: 490,
    compareAt: 990,
    status: 'preorder',
    sticker: 'xun-thumbsup',
    pack: { path: 'packs/claude-code-course-v2.json' },
    file: { path: 'kits/claude-code-starter-v1.0.zip', downloadName: 'claude-code-starter-v1.0.zip' },
    highlights: ['6 關照貼就會', '附 starter 專案', 'Google 登入', 'Stripe 收款', '每關「成功長這樣」', '卡住救援指令'],
    audience: {
      yes: ['想做自己的產品網站、真的收到錢', '願意照步驟複製貼上、會安裝軟體', '想學會用 Claude Code 完成一個完整專案'],
      no: ['想要有人幫你做好整個網站', '想看影片授課'],
    },
    gallery: [
      { src: '/shop/course-levels.webp', alt: '課程網頁：6 關與第一次用的 4 個步驟', caption: '付款後打開的課程網頁：6 關，一關一段指令' },
      { src: '/shop/course-card.webp', alt: '關卡卡片：指令、成功長這樣、卡住救援', caption: '每關都有「成功長這樣」和「卡住救援」', phone: true },
      { src: '/shop/starter-home.webp', alt: 'starter 專案的首頁', caption: 'starter 專案：首頁、登入、會員頁都做好了', phone: true },
    ],
    paymentLink: 'https://buy.stripe.com/dRm6oA2QJbKM76lare9MY02',
    paymentLinkId: 'plink_1USgdt5t4WzXNwwbmc8Rpd6G',
    includes: [
      { title: 'starter 專案（下載即用）', text: 'Next.js 網站：首頁、Google 登入、Stripe 付款、會員頁解鎖都寫好了，只差你的設定和文案。' },
      { title: '6 關照貼指令', text: '跑起來 → 換成你的產品 → Google 登入 → 收錢 → 上線 → 開賣前檢查。每關一段指令貼給 Claude Code。' },
      { title: '每關「成功長這樣」', text: '做完對一下清單，全部打勾才往下一關，不用猜自己做對沒。' },
      { title: '卡住救援指令', text: '每關一段現成的求救指令，貼上錯誤訊息，Claude Code 會先找原因再一次改一個地方。' },
      { title: '寄信問', text: '救援指令也解決不了，寄信附上畫面截圖，我會回你。' },
    ],
    steps: ['付款完成頁打開課程網頁、下載 starter', '用 Claude Code 打開 starter 資料夾', '從第 1 關開始貼指令', '每關對照「成功長這樣」', '第 6 關切換正式收款'],
    requirements: ['一台電腦（Windows 或 Mac）', 'Claude Code（Claude 訂閱方案或 API）', 'Google、GitHub、Supabase、Stripe、Vercel 帳號（都有免費方案）'],
    excluded: ['影片授課、一對一指導或代做', 'Claude、網域等第三方費用', 'Stripe 帳號審核（要你自己完成）', '收益保證'],
    faq: [
      { q: '我不會寫程式可以嗎？', a: '可以。程式由 Claude Code 寫，你負責貼指令、照它說的去後台點按鈕、把金鑰貼進檔案。要會安裝軟體、複製貼上。' },
      { q: '為什麼沒有截圖？', a: '各家後台常常改版，截圖很快就過時。課程讓 Claude Code 用文字一步一步帶你，每一步等你說「好了」才往下。' },
      { q: '做完的網站是我的嗎？', a: '是。專案在你自己的 GitHub 和 Vercel，收款進你自己的 Stripe。' },
      { q: '需要花多少錢？', a: '除了 Claude Code 的方案，其他服務都可以先用免費方案。Stripe 只在真的收到錢時抽手續費。' },
    ],
  },
  {
    slug: 'all-in-one',
    hidden: true, // contains the unlisted Claude Code course
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
      { src: '/shop/course-levels.webp', alt: 'Claude Code 實戰課網頁', caption: '實戰課：6 關照貼，做出會收錢的網站' },
    ],
    paymentLink: 'https://buy.stripe.com/eVq5kw8b3bKM4Yd9na9MY03',
    paymentLinkId: 'plink_1USgfk5t4WzXNwwb4TEd29ND',
    includes: [
      { title: '短影音爆款腳本指令包', text: '14 組複製貼上就能用的指令，網頁版，按一下就複製。' },
      { title: 'AI 每日短影音工作流套件', text: 'Claude Code plugin（5 個 skills）＋可直接渲染的 Remotion 專案。' },
      { title: 'Claude Code 實戰課', text: '6 關照貼指令＋starter 專案：登入、Stripe 收款、部署上線，做出會收錢的網站。' },
      { title: '之後上架的工作流', text: '自動發布、懸案紀錄片、Q 版 MV 推出後直接加進全套，不用再付錢。' },
      { title: '寄信問', text: '卡住就寄信，附上畫面截圖，我會回；常見問題整理回教材。' },
    ],
    steps: ['付款完成頁打開指令包和課程、下載套件', '照課程第 1 關開始', '照設定 prompt 開始做第一支片'],
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
/** Every product, hidden ones included (admin pages only). */
export const ALL_PRODUCTS: Product[] = CATALOGUE

export function getProduct(slug: string) {
  return PRODUCTS.find(product => product.slug === slug) ?? null
}

/** Any product, including hidden ones: earlier buyers still get what they paid for after a product is unlisted. */
export function findProduct(slug: string) {
  return CATALOGUE.find(product => product.slug === slug) ?? null
}

/** Any product sold through this Payment Link (hidden ones included, for the same reason). */
export function findByPaymentLink(linkId: string) {
  return CATALOGUE.find(product => product.paymentLinkId === linkId) ?? null
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
