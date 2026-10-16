// Brand + channel settings shared by every public page. Channel URLs are left
// empty until the accounts exist; empty links are hidden instead of guessed.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'

export const SITE = {
  name: 'JERRY.AI',
  manifesto: '一個人，六個頻道，每天自動開播。',
  tagline: '把 AI 工作流做成你也能跑起來的東西',
  description:
    '一個人用 AI 經營六個頻道。這裡有每支影片的重點筆記、可直接複製的 prompt、免費教學，以及照著貼就能跑的 AI 工作流套件。',
  contactEmail: 'donutai08@gmail.com',
  portfolioUrl: 'https://intro-blond-one.vercel.app/',
}

export type PlatformKey = 'youtube' | 'bilibili' | 'instagram' | 'threads' | 'facebook' | 'tiktok'

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  youtube: 'YouTube',
  bilibili: 'B站',
  instagram: 'Instagram',
  threads: 'Threads',
  facebook: 'Facebook',
  tiktok: 'TikTok',
}

export interface Channel {
  key: string
  name: string
  /** Latin label for stickers, tags and the schedule. */
  code: string
  /** One-line pitch shown under the channel name. */
  tagline: string
  description: string
  /** Signal colour (and the ink that reads on it). */
  color: string
  ink: string
  /** Slot on the homepage 24h programme ruler (display only). */
  hour: number
  /** Sticker in /public/stickers and clip basename in /public/clips. */
  sticker: string
  /** Optional second sticker in the slot, and whether to mirror the main one. */
  sticker2?: string
  mirror?: boolean
  clip: string
  clipShape: 'portrait' | 'landscape'
  credit?: string
  /** Fan work: shown as a channel, never used in product/selling sections. */
  fanWork?: boolean
  links: Partial<Record<PlatformKey, string>>
}

const yt = (id: string) => `https://www.youtube.com/channel/${id}`
const ig = (handle: string) => `https://www.instagram.com/${handle}/`

export const CHANNELS: Channel[] = [
  {
    key: 'nailao', name: '奶烙', code: 'NAILAO', hour: 8,
    tagline: '貓咪主持，Jerry 配音｜每天幾分鐘聊 AI',
    description: '用 Claude Code 與 AI 工具把重複工作變成自動化流程。主持人是一隻橘白貓，聲音是我。',
    color: '#f5a524', ink: '#1a1208', sticker: 'nailao', clip: 'nailao', clipShape: 'portrait',
    credit: 'HOST 奶烙 / VOICE Jerry',
    links: { instagram: ig('_nailao1998') },
  },
  {
    key: 'xun', name: '訊號滿格', code: 'XUN', hour: 10,
    tagline: '小訊每天幫你整理 AI 新聞',
    description: 'AI 圈今天發生什麼事，一支短片講完。',
    color: '#2747ff', ink: '#ffffff', sticker: 'xun', clip: 'xun-signal', clipShape: 'portrait',
    links: { youtube: yt('UCICMyW4asSzUxY2Bmkic7dQ'), instagram: ig('fullsignaltw') },
  },
  {
    key: 'doro-fuzi', name: 'Doro夫子', code: 'DORO', hour: 12,
    tagline: '科技日更，一則新聞拆成一分鐘',
    description: 'Doro 夫子把官方公告與新功能，拆成看得懂的重點。',
    color: '#0e9f6e', ink: '#ffffff', sticker: 'doro', clip: 'doro-fuzi', clipShape: 'portrait',
    links: { youtube: yt('UC54R75dyYA1bFIILBGM2k0w'), instagram: ig('_doro1998ai') },
  },
  {
    key: 'doro-gonggong', name: 'Doro公公', code: 'DORO', hour: 15,
    tagline: '娛樂日更，生活小劇場',
    description: '說好只看五分鐘，天就亮了。Doro 公公的日常廢片。',
    color: '#ff4a1c', ink: '#ffffff', sticker: 'doro', mirror: true, clip: 'doro-gonggong', clipShape: 'portrait',
    links: { youtube: yt('UCR50f1f7Ep81YsZOzUj6uQQ'), instagram: ig('_doro1998') },
  },
  {
    key: 'mochi', name: '麻糬QQ', code: 'MOCHI', hour: 19,
    tagline: '情境梗短劇，每天一集',
    description: '麻糬和她頭上的小麻糬，把日常的尷尬瞬間演給你看。',
    color: '#ff5d8f', ink: '#ffffff', sticker: 'mochi', clip: 'mochi-qq', clipShape: 'portrait',
    links: { youtube: yt('UC2vBS0u5x6TWYjyxibH4MxA'), instagram: ig('mochiqqtw') },
  },
  {
    key: 'wuwa', name: '鳴潮二創', code: 'FAN WORK', hour: 21,
    tagline: '菲比 × 弗洛洛 的 Q 版小劇場',
    description: '自由發揮的同人動畫。非官方二創，角色版權屬原作。',
    color: '#3b2fd9', ink: '#ffffff', sticker: 'phoebe', sticker2: 'phrolova', clip: 'wuwa', clipShape: 'landscape',
    fanWork: true,
    links: {},
  },
]

/** Site-wide navigation; `/#…` targets are homepage sections. */
export const NAV = [
  { href: '/#channels', label: '頻道', code: 'CHANNELS' },
  { href: '/free', label: '免費教學', code: 'FREE' },
  { href: '/#shop', label: '工作流', code: 'SHOP' },
  { href: '/#studio', label: '接案', code: 'STUDIO' },
]

export function getChannel(key: string) {
  return CHANNELS.find(channel => channel.key === key) ?? null
}

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}
