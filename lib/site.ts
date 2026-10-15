// Brand + channel settings shared by every public page. Channel URLs are left
// empty until the accounts exist; empty links are hidden instead of guessed.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'

export const SITE = {
  name: '網課小韭菜',
  tagline: '把 AI 工作流做成你也能跑起來的東西',
  description:
    '每支影片的重點整理、可直接複製的 prompt 與工具清單，加上能一鍵跑起來的 AI 工作流套件。看完影片，照著做就能復現。',
  contactEmail: 'donutai08@gmail.com',
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
  description: string
  links: Partial<Record<PlatformKey, string>>
}

export const CHANNELS: Channel[] = [
  {
    key: 'tech',
    name: 'AI 工作流口播',
    description: '用 Claude Code 與 AI 工具，把重複工作變成自動化流程。',
    links: {},
  },
]

export function getChannel(key: string) {
  return CHANNELS.find(channel => channel.key === key) ?? null
}
