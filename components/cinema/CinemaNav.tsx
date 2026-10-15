'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SITE } from '@/lib/site'
import styles from './cinema.module.css'

const LINKS = [
  { href: '/videos', label: '片單' },
  { href: '/free', label: '免費資源' },
  { href: '/#coming', label: '即將上映' },
  { href: '/#director', label: '關於' },
]

export default function CinemaNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user))
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? 'border-b border-white/10 bg-[#05070b]/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
          <span className={`${styles.display} text-lg text-[#ece7dd]`}>{SITE.name}</span>
          <span className={`${styles.mono} hidden text-[10px] text-[#8b939d] sm:inline`}>AI Workflow Studio</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="主要導覽">
          {LINKS.map(link => <Link key={link.href} href={link.href} className="text-sm text-[#b9bec4] transition-colors hover:text-white">{link.label}</Link>)}
          <Link href={signedIn ? '/dashboard' : '/login'} className={`${styles.mono} rounded-full border border-white/20 px-4 py-2 text-[10px] text-[#ece7dd] transition hover:border-[#f0a65a] hover:text-[#f0a65a]`}>{signedIn ? '我的學習' : '登入'}</Link>
        </nav>
        <button type="button" className="flex min-h-11 min-w-11 items-center justify-center text-[#ece7dd] md:hidden" onClick={() => setOpen(value => !value)} aria-label={open ? '關閉選單' : '開啟選單'} aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 pb-6 pt-2 md:hidden" aria-label="行動版導覽">
          {[...LINKS, { href: signedIn ? '/dashboard' : '/login', label: signedIn ? '我的學習' : '登入' }].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`${styles.display} flex min-h-12 items-center border-b border-white/5 text-xl text-[#ece7dd]`}>{link.label}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}
