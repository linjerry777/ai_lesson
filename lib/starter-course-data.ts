import type { Lesson } from './course-data'

export const COURSE_TITLE = 'AI 實作入門預備課'

export const COURSE_SUBTITLE =
  '先補齊終端機、Git、env、AI 協作與除錯觀念，再進入付費實戰課。'

export const lessons: Lesson[] = [
  {
    id: 'start00',
    title: '你不是要先學會全部程式，而是先學會怎麼跟 AI 合作',
    duration: '15 分鐘',
    description:
      '這堂免費課先幫你建立正確期待。AI 可以幫你寫很多程式，但你仍然需要知道專案有哪些檔案、錯誤訊息要看哪裡、什麼時候應該停止亂改。\n\n付費主課會帶你做出能登入、能付款、能部署的網站；預備課則先把最容易卡住的新手基礎補起來。',
    keyPoints: [
      'AI 實作不是背語法，而是把目標拆成可驗收的小步驟',
      '你需要能分辨「成功畫面」「錯誤訊息」「下一步要貼給 AI 的內容」',
      '不要一次叫 AI 做完整產品，先讓它做一個可檢查的小變更',
      '付費課不是零基礎程式課，但預備課會讓新手比較能跟上',
    ],
    steps: [
      {
        title: '先確認你適合從哪裡開始',
        body: '如果你完全沒用過 terminal、Git、npm、env，請先把這門預備課走完。你不需要變成工程師，但至少要知道每個工具大概負責什麼。',
        code: {
          lang: 'text',
          content: `你需要能回答：
1. terminal 是拿來執行指令的地方
2. Git 是拿來記錄專案版本的工具
3. npm 是 Node.js 專案常用的套件工具
4. .env.local 是放本機祕密設定的地方
5. build 失敗時，要先複製完整錯誤訊息`,
        },
        tip: '如果這五句你都看得懂，付費主課會順很多。如果看不懂，先不用急著買課。把預備課走完再決定。',
      },
      {
        title: '第一個 AI 協作規則：一次只改一件事',
        body: '新手最常見的失敗，是一口氣叫 AI 做登入、付款、部署、會員中心。真正穩的做法是每次只改一個可驗收的功能。',
        claude:
          '我想用 AI 做一個產品網站。請先不要寫程式，先把目標拆成 5 個可以逐步驗收的小任務，每個任務都要說明「完成後我應該看到什麼」。',
        warning:
          '如果 AI 一次改了很多檔案又 build 失敗，不要繼續叫它加功能。先要求它用錯誤訊息修到 build 通過。',
      },
    ],
  },
  {
    id: 'start01',
    title: '本機工具最小地圖：Terminal、Node、Git、VS Code',
    duration: '20 分鐘',
    description:
      '你不用一開始就懂所有指令，但要知道每個工具在流程裡的位置。本章用最少的檢查，確認你的電腦可以跟著後面的實戰課跑。',
    keyPoints: [
      'Terminal 負責執行指令，不是聊天視窗',
      'Node.js 讓 Next.js 專案可以在本機跑起來',
      'Git 讓你能回頭看每次修改，也能部署到 Vercel',
      'VS Code 或 Claude Code Desktop 負責打開專案資料夾',
    ],
    steps: [
      {
        title: '打開終端機並檢查版本',
        body: '在 Windows 可以用 PowerShell。先不用記指令，只要知道這些指令是在確認工具有沒有裝好。',
        code: {
          lang: 'powershell',
          content: `node -v
npm -v
git --version`,
        },
        tip: '看到版本號就代表工具有回應。若顯示 command not found 或不是內部/外部命令，表示該工具還沒裝好。',
      },
      {
        title: '建立一個練習資料夾',
        body: '先練習在你熟悉的位置建立資料夾，之後實戰課所有專案都會從「選對資料夾」開始。',
        code: {
          lang: 'powershell',
          content: `mkdir ai-practice
cd ai-practice
pwd`,
        },
        warning:
          '不要把練習專案放在系統資料夾、下載資料夾深處，或中文/特殊符號很多的路徑。路徑越單純，工具越少出怪問題。',
      },
    ],
  },
  {
    id: 'start02',
    title: '看懂專案結構：app、components、lib、.env.local',
    duration: '18 分鐘',
    description:
      '跟著 AI 寫網站時，你不需要馬上懂每一行程式，但要知道檔案大概放在哪裡。這能讓你在錯誤發生時，不會完全失去方向。',
    keyPoints: [
      'app 通常放頁面與 API route',
      'components 放可重複使用的畫面區塊',
      'lib 放資料、工具函式、第三方服務連線',
      '.env.local 放本機設定，不應該提交到 GitHub',
    ],
    steps: [
      {
        title: '請 AI 先解釋，不要先重寫',
        body: '當你接手一個專案，第一個動作不是改 code，而是叫 AI 讀目錄並解釋責任分工。',
        claude:
          '請先讀這個 Next.js 專案的目錄結構，列出 app、components、lib、public、middleware.ts 分別負責什麼。先不要修改任何檔案。',
        tip: '如果你能說出「這個 bug 可能在哪個資料夾」，你就已經比盲目貼錯誤訊息穩很多。',
      },
      {
        title: '認識 .env.local 的安全邊界',
        body: '.env.local 會放 Supabase、Stripe 這類服務的 key。它只應該在你的本機和 Vercel 後台出現，不應該貼到公開網頁或 GitHub。',
        code: {
          lang: 'env',
          content: `NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...`,
        },
        warning:
          '名字有 SECRET、SERVICE_ROLE、WEBHOOK_SECRET 的值都當成密碼看待。問 AI 時可以貼錯誤訊息，不要貼完整 secret。',
      },
    ],
  },
  {
    id: 'start03',
    title: '錯誤發生時怎麼求救：貼完整 log，不貼情緒',
    duration: '15 分鐘',
    description:
      '新手會卡住不是因為不夠聰明，而是因為不知道怎麼把問題描述清楚。本章給你一個固定格式，讓 AI 比較容易真的幫你修好。',
    keyPoints: [
      '先描述你剛剛做了哪一步',
      '貼完整錯誤訊息，不只貼最後一行',
      '說明你期待看到什麼、實際看到什麼',
      '要求 AI 先判斷原因，再提出最小修改',
    ],
    steps: [
      {
        title: '使用固定求救格式',
        body: '遇到 build、登入、付款、部署錯誤時，先把問題整理成這個格式，再貼給 AI。',
        code: {
          lang: 'text',
          content: `我正在做：
我剛剛改了：
我期待看到：
實際發生：
完整錯誤訊息：
我已經試過：

請先列出最可能的 3 個原因，再告訴我第一個最小檢查步驟。
不要直接重寫整個功能。`,
        },
        tip: '這個格式會在付費課 ch06 繼續用。你越會問，AI 越像隊友，而不是亂改專案的工具。',
      },
      {
        title: '完成預備課驗收',
        body: '走到這裡，你不需要會寫完整網站，但應該能比較冷靜地跟著 AI 做實作。',
        code: {
          lang: 'text',
          content: `□ 我知道 terminal、Node、Git 的用途
□ 我知道 app/components/lib 大概放什麼
□ 我知道 .env.local 不能公開
□ 我知道遇到錯誤要貼完整 log
□ 我知道一次只叫 AI 改一個可驗收的小功能`,
        },
        tip: '如果五項都能打勾，就可以進 Claude Code 實戰課。想做 AI 影片工作流，則建議先有更穩的本機與檔案操作經驗。',
      },
    ],
  },
]
