'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [avatarError, setAvatarError] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '學員'
  const initials = displayName.slice(0, 1).toUpperCase()

  const navLinks = [
    { href: '#curriculum', label: '課程大綱' },
    { href: '#instructor', label: '關於講師' },
    { href: '#pricing', label: '立即購課' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              網課小韭菜
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              /* ── 已登入 ── */
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-500 transition-colors"
                >
                  <BookOpen size={15} />
                  我的課程
                </Link>

                {/* Avatar + name */}
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-100"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center ring-2 ring-brand-100">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate">
                    {displayName}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                  title="登出"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              /* ── 未登入 ── */
              <>
                <Link
                  href="/activate"
                  className="text-sm text-gray-500 hover:text-brand-500 transition-colors"
                >
                  已購課？啟用
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  登入
                </Link>
                <a
                  href="#pricing"
                  className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  立即購課 NT$2,640
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm text-gray-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <div className="flex items-center gap-2 py-2 border-t border-gray-100 mt-2">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <span className="text-sm text-gray-700 font-medium truncate">{displayName}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <LogOut size={15} />
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/activate"
                className="block text-center text-sm text-gray-500 py-2"
                onClick={() => setMenuOpen(false)}
              >
                已購課？點此啟用課程
              </Link>
              <Link
                href="/login"
                className="block text-center border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                登入
              </Link>
              <a
                href="#pricing"
                className="block bg-brand-500 text-white text-center text-sm font-semibold px-4 py-3 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                立即購課 NT$2,640
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
