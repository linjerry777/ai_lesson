import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Claude Code 實戰工作流 | 打造 AI 時代的工程師超能力',
  description:
    '不是工具功能大全——是矽谷工程師真正在用的 AI 開發方法論。帶你從需求拆解到部署，完整學習 Claude Code × MCP × Hook × Sub-Agent，真正交付成果。',
  keywords: ['Claude Code', 'AI 開發', 'MCP', 'Hook', 'Sub-Agent', '工程師', 'AI 工作流'],
  openGraph: {
    title: 'Claude Code 實戰工作流 | 打造 AI 時代的工程師超能力',
    description: '不是工具功能大全——是矽谷工程師真正在用的 AI 開發方法論。',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
