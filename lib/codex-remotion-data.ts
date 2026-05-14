import type { Lesson } from './course-data'

export const COURSE_TITLE = 'Codex + Image2 + Remotion 角色動畫工作流'

export const COURSE_SUBTITLE =
  '用 Codex 規劃腳本與系統，Image2 做角色美術，CliRelay 橋接模型，Remotion 組成可重複生產的長片流程'

export const lessons: Lesson[] = [
  {
    id: 'cr00',
    title: '工作流總覽：不要叫 AI 一次做完整支片',
    duration: '18 分鐘',
    description:
      '先建立正確心法：Codex 負責結構，Image2 負責視覺品質，Remotion 負責時間軸與動畫。這套流程不是賭影片模型一次成功，而是把影片拆成可檢查、可重做、可批次化的段落。',
    keyPoints: [
      '為什麼本地影片模型目前不適合當主流程',
      'Image2 做 key visual，Remotion 做鏡頭與字幕',
      '每段影片都要能單獨修改、單獨重 render',
      '最後再 concat 成完整長片',
    ],
    steps: [
      {
        title: '先拆清楚四個角色',
        body: 'Codex 像製片主任，負責把想法拆成腳本、分段、素材需求與執行清單；Image2 像美術組，負責角色、背景、道具與關鍵畫面；CliRelay 是模型橋接器；Remotion 是真正的影片組裝與動畫引擎。',
      },
      {
        title: '用段落取代整片豪賭',
        body: '一支 5 分鐘影片不要一次 render 到底。先切成 20 到 40 個 micro-scenes，每段 6 到 15 秒。任何一段不好，只重生那段圖、重改那段旁白、重 render 那段。',
        tip: '這也是為什麼這套流程比「丟一張圖給影片模型」更適合長期做頻道。',
      },
      {
        title: '建立最小可行流程',
        body: '第一版只需要做到：腳本 JSON、角色圖、場景圖、旁白、字幕、段落 render、concat。等這些穩了，再加靈感池、上傳排程、封面、A/B 標題。',
      },
    ],
  },
  {
    id: 'cr01',
    title: '工具安裝：Codex、Image2、CliRelay、Remotion',
    duration: '25 分鐘',
    description:
      '把這套長片系統需要的工具準備好，並理解每個工具的邊界。重點不是裝很多東西，而是避免之後卡在模型、權限、路徑與 render 環境。',
    keyPoints: [
      'Codex / OpenAI Pro 與 API 使用差異',
      'CliRelay 當 OpenAI-compatible bridge',
      'Remotion、Node/Bun、ffmpeg、Edge TTS',
      'Image edit 最多 5 張 reference 的限制',
    ],
    steps: [
      {
        title: '確認本機工具',
        body: '先確認 Node、Bun、ffmpeg、Git 都可用。Remotion 是 React 專案，render 會依賴瀏覽器與 ffmpeg；這些缺一個，後面都會很痛。',
        code: {
          lang: 'powershell',
          content: 'node -v\nbun -v\nffmpeg -version\ngit --version',
        },
      },
      {
        title: '設定 CliRelay endpoint',
        body: '如果你是用 CliRelay 橋接 Codex / OpenAI-compatible API，專案只需要知道 base URL、model name、key。把它放進 .env.local，不要寫死在程式裡。',
        code: {
          lang: 'env',
          content:
            'IMAGE_PROVIDER=clirelay\nOPENAI_BASE_URL=http://127.0.0.1:xxxx/v1\nOPENAI_API_KEY=你的本機或 relay key\nIMAGE_MODEL=gpt-image-2',
        },
        warning:
          'Image2 圖生圖一次最多 5 張 reference。UI 要限制上傳數量，不然會出現 image edit supports at most 5 images。',
      },
      {
        title: 'Remotion 專案基本命令',
        body: '先能 preview，再能 render 單段，最後才 render 全片。不要一開始就把完整長片丟進去燒。',
        code: {
          lang: 'bash',
          content:
            'bun install\nbun run dev\nbunx remotion preview\nbun run scripts/render-episode-segments.ts "001"',
        },
      },
    ],
  },
  {
    id: 'cr02',
    title: '從題材到腳本：Codex 先當製片，不要先當剪輯師',
    duration: '28 分鐘',
    description:
      '把熱門影片、短影音高觀看題材、貼文靈感，轉成自己的長片企劃。這堂會做出 hook、觀眾承諾、段落設計、角色清單與素材清單。',
    keyPoints: [
      '題材來源：YouTube trend、AutoVideo 高觀看短片、貼文靈感池',
      '用 pattern，不抄標題、縮圖、故事與創作者定位',
      '把腳本寫給一般觀眾，不寫給專案作者自己',
      '避免過多內部名詞',
    ],
    steps: [
      {
        title: '先寫觀眾看得懂的承諾',
        body: '不要一開頭就講 CliRelay、episode JSON、asset manifest。觀眾只在意：看完我能做什麼？我少踩什麼坑？我是不是被說中了？',
      },
      {
        title: '用 Codex 產出企劃草稿',
        body: '把題材、目標觀眾、片長、語氣、頻道定位交給 Codex，讓它先產出大綱，不急著產最終台詞。',
        claude:
          '請把這個題材改成一支 5 分鐘 YouTube 長片企劃。輸出：hook、核心承諾、目標觀眾、5 個章節、每章重點、需要的角色與畫面素材。不要使用內部專案術語，講給一般 AI 創作者聽。',
      },
      {
        title: '再拆成 micro-scenes',
        body: '把 5 分鐘拆成 25 到 40 段，每段只承擔一個鏡頭任務。段落越短，重做成本越低，畫面也比較容易有節奏。',
      },
    ],
  },
  {
    id: 'cr03',
    title: 'Image2 美術：角色、道具、背景與 key visual',
    duration: '35 分鐘',
    description:
      'Image2 的強項不是只修圖，而是把角色、場景與敘事情緒一次提升。這堂會建立 Doro 角色一致性、reference 選擇、模式選擇，以及如何避免人物被文字擋住。',
    keyPoints: [
      'reference 圖少而精，不要一次塞爆',
      '角色、服裝、道具、姿勢要和段落內容對齊',
      '畫面要預留字幕與 UI overlay 的安全區',
      '先生成乾淨 key visual，再交給 Remotion 動',
    ],
    steps: [
      {
        title: '用 reference 控身份，不用 prompt 硬背角色',
        body: 'Doro 的臉、髮色、眼睛、比例要靠 reference 穩住。Prompt 負責描述本段需要的職業、動作、道具、表情與鏡頭感。',
      },
      {
        title: '給 Image2 明確的安全區',
        body: '如果影片會上字幕或資訊卡，生成圖時就要要求主角不要站在中央字幕區，也不要讓重要表情被右側卡片遮住。',
        claude:
          'Generate a 16:9 key visual. Keep the Doro character fully visible on the left third, leave the lower 20% clear for subtitles, and leave the right third available for Remotion UI overlays. No text in the image.',
      },
      {
        title: '每段圖只做它該做的事',
        body: 'Image2 負責情緒、角色、構圖、道具。標題、字幕、章節標籤、列表文字交給 Remotion，這樣文字才穩、可改、可多語系。',
      },
    ],
  },
  {
    id: 'cr04',
    title: '把素材變成 episode JSON',
    duration: '30 分鐘',
    description:
      '建立可重複渲染的資料格式：每段都包含旁白、字幕、畫面設定、角色圖、背景圖、動畫類型與狀態。這是 GUI、批次處理和重新生成的核心。',
    keyPoints: [
      'episode 是影片專案，不是單一片段',
      'segment 是可單獨重生與重 render 的最小單位',
      'dirty flag 告訴你哪些段落需要重燒',
      'asset manifest 保存每張圖的來源與版本',
    ],
    steps: [
      {
        title: '定義最小 segment',
        body: '每段至少需要：id、voiceover、caption、visual、duration、asset、dirty。先簡單，穩定後再加鏡頭、音效和轉場。',
        code: {
          lang: 'json',
          content:
            '{\n  "id": "segment-001",\n  "voiceover": "如果你做 AI 影片時常卡在素材和節奏...",\n  "caption": "做 AI 影片卡住，通常不是工具不夠多",\n  "duration": 8,\n  "visual": { "kind": "keyVisual", "image": "/doro/episode-001/key-visuals/segment-001.png" },\n  "dirty": true\n}',
        },
      },
      {
        title: '保存素材版本',
        body: '同一個角色或場景可能會重生很多次。不要覆蓋到找不回來，保存 candidates，再讓 active 指向目前採用的版本。',
      },
      {
        title: '讓 GUI 可以改腳本',
        body: '腳本 textarea 改完只標記該 segment dirty，不自動 render。使用者確認後再按 render，避免每次微調都燒一次。',
      },
    ],
  },
  {
    id: 'cr05',
    title: 'Remotion 動畫：讓靜態圖像變成有節奏的影片',
    duration: '42 分鐘',
    description:
      'Remotion 不只是把圖片放上去。這堂會處理字幕、pan/zoom、parallax、卡片進出場、章節節奏，以及如何避免動畫遮住角色。',
    keyPoints: [
      '字幕永遠要有，但不要唸到哪就高亮哪',
      '用鏡頭運動補足靜態圖',
      '資訊卡只放在安全區',
      '每段 render 後再 concat',
    ],
    steps: [
      {
        title: '建立畫面安全區',
        body: '影片底部留字幕區，左右留 overlay 區。Remotion 的資訊卡要根據 segment 的 safeArea 決定位置，不要硬寫死中央。',
      },
      {
        title: '用三層動畫製造動感',
        body: '背景慢慢 zoom，角色輕微浮動，資訊卡滑入滑出。這三層加起來，靜態圖也能看起來像有剪輯節奏。',
      },
      {
        title: '分段 render 與 concat',
        body: '每段輸出 mp4，最後用 ffmpeg concat。修改某段只重 render 該段，再重接全片。',
        code: {
          lang: 'bash',
          content:
            'bun run scripts/render-episode-segments.ts "001" --only segment-012\nbun run scripts/concat-episode.ts "001"',
        },
      },
    ],
  },
  {
    id: 'cr06',
    title: 'GUI 工作台：My Videos、Assets、Segments、Upload',
    duration: '35 分鐘',
    description:
      '把整套流程變成可以每天使用的工作台。目標不是炫，而是讓你知道哪支影片做到哪、哪些段落髒了、哪些素材要重生、哪支能上傳。',
    keyPoints: [
      'My Videos 放完整影片專案，不放單一片段',
      'Assets 讓使用者重生角色與背景',
      'Segments 讓使用者改腳本與單段 render',
      'Upload 保存標題、描述、tags 與平台',
    ],
    steps: [
      {
        title: '影片卡片顯示決策資訊',
        body: '一張卡至少顯示：標題、總長、段落數、render 狀態、dirty segment 數、最後更新時間、刪除按鈕。',
      },
      {
        title: '重生素材不等於自動重 render',
        body: '使用者重生角色後，系統標記受影響段落 dirty，提醒要重新 render。不要偷偷把影片重燒，否則很難知道哪一步改壞。',
      },
      {
        title: '上傳前讓 AI 分析 metadata',
        body: '標題、描述、tags 可以由 AI 根據腳本和影片內容產生，但平台預設先只留 YouTube，避免長片誤發到短影音平台。',
      },
    ],
  },
  {
    id: 'cr07',
    title: '靈感池：從熱門影片取 pattern，不取內容',
    duration: '32 分鐘',
    description:
      '用 YouTube 熱門、AutoVideo 高觀看短片、carousel 題材作為靈感來源。重點是學 hook、節奏與觀眾痛點，不抄對方影片。',
    keyPoints: [
      '分析要保存，不要每次重跑',
      '支援單一分析與整池分析',
      '從熱門短片延伸長片主題',
      '每個候選題材都要判斷是否適合 Doro / Codex / Image2 / Remotion',
    ],
    steps: [
      {
        title: '建立候選題材卡',
        body: '每張卡保存來源標題、頻道、觀看數、hook pattern、可改寫角度、風險與建議影片方向。',
      },
      {
        title: '用 AI 排序，不用 AI 直接決定',
        body: 'AI 可以給分，但最後要看你頻道定位。高觀看不代表適合做，尤其不能直接複製人家的品牌或故事。',
      },
      {
        title: '一鍵建立 video draft',
        body: '當你選定題材，系統應該直接產出企劃、腳本、角色需求、素材需求與 episode 草稿，再進入製作流程。',
      },
    ],
  },
  {
    id: 'cr08',
    title: '完整案例：做出一支 Doro 角色動畫長片',
    duration: '55 分鐘',
    description:
      '把前面所有步驟串起來，從「Vibe Coding 真的會取代工程師嗎？」這類題材出發，加入搜尋觀點、腳本改寫、Image2 key visual、Remotion 分段動畫，最後輸出可上傳的 YouTube 長片。',
    keyPoints: [
      '先補觀點，再寫腳本',
      '角色與場景要服務觀眾理解',
      '用 1.25x 版本提升節奏',
      '輸出後產生標題、描述、tags 與固定片尾',
    ],
    steps: [
      {
        title: '搜尋觀點，建立內容厚度',
        body: '長片不能只有自己的筆記。先整理常見論點、反方觀點、實際案例與觀眾疑問，再讓 Codex 改寫成 Doro 的敘事。',
      },
      {
        title: '產出 25 到 40 段',
        body: '每段都要有畫面任務：角色反應、前後對比、工具流程、錯誤場景、迷你總結、觀眾提問。不要一整支都像在讀簡報。',
      },
      {
        title: '上傳前檢查',
        body: '檢查字幕是否全程存在、角色是否被卡片擋住、片尾是否有訂閱 CTA、速度是否適合、YouTube metadata 是否完整。',
      },
    ],
  },
]
