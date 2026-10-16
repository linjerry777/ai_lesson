// Brand + channel settings shared by every public page. Channel URLs are left
// empty until the accounts exist; empty links are hidden instead of guessed.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'

export const SITE = {
  name: 'JERRY.AI',
  manifesto: '一個人，五個頻道，每天自動開播。',
  tagline: '把 AI 工作流做成你也能跑起來的東西',
  description:
    '一個人用 AI 經營五個頻道。這裡有每支影片的重點筆記、可直接複製的 prompt、免費教學，以及照著貼就能跑的 AI 工作流套件。',
  contactEmail: 'donutai08@gmail.com',
  studioUrl: 'https://jerry-ai-studio-two.vercel.app/',
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
  /** Real daily publish time (Asia/Taipei) as decimal hours; omitted for channels without a fixed slot. */
  hour?: number
  /** Status line shown instead of a time when there is no fixed slot. */
  note?: string
  /** Sticker in /public/stickers and clip basename in /public/clips. */
  sticker: string
  mirror?: boolean
  clip: string
  credit?: string
  links: Partial<Record<PlatformKey, string>>
}

const yt = (id: string) => `https://www.youtube.com/channel/${id}`
const ig = (handle: string) => `https://www.instagram.com/${handle}/`

/** Channels in programme order: fixed daily slots first, then 奶烙 (no fixed slot yet). */
export const CHANNELS: Channel[] = [
  {
    key: 'xun', name: '訊號滿格', code: 'XUN', hour: 11.5,
    tagline: '小訊每天幫你整理 AI 新聞',
    description: '只用官方來源，挑三則當天的 AI 與科技新聞，一支短片講完。',
    color: '#2747ff', ink: '#ffffff', sticker: 'xun', clip: 'xun-signal',
    links: { youtube: yt('UCICMyW4asSzUxY2Bmkic7dQ'), instagram: ig('fullsignaltw') },
  },
  {
    key: 'doro-fuzi', name: 'Doro夫子', code: 'DORO', hour: 18,
    tagline: '科技日更，一則新聞拆成一分鐘',
    description: 'Doro 夫子把官方公告與新功能，拆成看得懂的重點。',
    color: '#0e9f6e', ink: '#ffffff', sticker: 'doro', clip: 'doro-fuzi',
    links: { youtube: yt('UC54R75dyYA1bFIILBGM2k0w'), instagram: ig('_doro1998ai') },
  },
  {
    key: 'mochi', name: '麻糬QQ', code: 'MOCHI', hour: 19.5,
    tagline: '人類圖鑑短劇＋未解之謎紀錄片',
    description: '麻糬和她頭上的小麻糬，每天演一種「你是哪一派」；週末追一樁歷史懸案。',
    color: '#ff5d8f', ink: '#ffffff', sticker: 'mochi', clip: 'mochi-qq',
    links: { youtube: yt('UC2vBS0u5x6TWYjyxibH4MxA'), instagram: ig('mochiqqtw') },
  },
  {
    key: 'doro-gonggong', name: 'Doro公公', code: 'DORO', hour: 20,
    tagline: '娛樂日更，生活小劇場',
    description: '說好只看五分鐘，天就亮了。Doro 公公的日常廢片。',
    color: '#ff4a1c', ink: '#ffffff', sticker: 'doro', mirror: true, clip: 'doro-gonggong',
    links: { youtube: yt('UCR50f1f7Ep81YsZOzUj6uQQ'), instagram: ig('_doro1998') },
  },
  {
    key: 'nailao', name: '奶烙', code: 'NAILAO', note: '口播籌備中',
    tagline: '貓咪主持，Jerry 配音｜聊 AI 工作流',
    description: '口播頻道：主持人是我家的橘白貓奶烙，聲音是我。教你把 Claude Code 與 AI 工具變成每天自己跑的流程。',
    color: '#f5a524', ink: '#1a1208', sticker: 'nailao', clip: 'nailao',
    credit: 'HOST 奶烙 / VOICE Jerry',
    links: { instagram: ig('_nailao1998') },
  },
]

/** Fan animation lives on Bilibili only (non-commercial licence); linked, never featured. */
export const FAN_WORK = { label: '鳴潮同人動畫', site: 'B站 · 毛里球OVO', url: 'https://space.bilibili.com/6559547' }

export function slotLabel(c: Channel) {
  if (c.hour === undefined) return c.note ?? ''
  const h = Math.floor(c.hour)
  return `${pad2(h)}:${pad2(Math.round((c.hour - h) * 60))}`
}

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
