'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { lessons, COURSE_TITLE, type Lesson } from '@/lib/course-data'
import Link from 'next/link'
import { CheckCircle, Circle, PlayCircle, LogOut, BookOpen, Clock, ChevronRight } from 'lucide-react'

interface Props {
  userEmail: string
  videoUrls: Record<string, string>
}

export default function CoursePage({ userEmail, videoUrls }: Props) {
  const [activeId, setActiveId] = useState(lessons[0].id)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  const active    = lessons.find(l => l.id === activeId)!
  const activeIdx = lessons.findIndex(l => l.id === activeId)
  const progress  = Math.round((completed.size / lessons.length) * 100)

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white font-black text-xs">AI</div>
            <span className="font-bold text-gray-900 text-sm">{COURSE_TITLE}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}% 完成</span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut size={14} />
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* ── Sidebar ── */}
        <aside className="w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <BookOpen size={13} />
              <span>{lessons.length} 個章節</span>
              <span className="text-gray-300">·</span>
              <span>{completed.size} 已完成</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <nav className="py-2">
            {lessons.map((lesson, idx) => {
              const isActive    = lesson.id === activeId
              const isDone      = completed.has(lesson.id)
              const hasVideo    = !!videoUrls[lesson.id]

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors group
                    ${isActive
                      ? 'bg-brand-50 border-r-2 border-brand-500'
                      : 'hover:bg-gray-50 border-r-2 border-transparent'
                    }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <CheckCircle size={16} className="text-brand-500" />
                    ) : isActive ? (
                      <PlayCircle size={16} className="text-brand-500" />
                    ) : (
                      <Circle size={16} className={hasVideo ? 'text-gray-300' : 'text-gray-200'} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono text-brand-400 font-bold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {!hasVideo && (
                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">即將上線</span>
                      )}
                    </div>
                    <p className={`text-xs font-medium leading-snug ${isActive ? 'text-brand-700' : 'text-gray-700'}`}>
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock size={9} />
                      {lesson.duration}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile chapter picker */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
            <div className="flex gap-2">
              {lessons.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setActiveId(l.id)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors
                    ${l.id === activeId
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-gray-200 text-gray-600 hover:border-brand-300'
                    }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 max-w-4xl">
            <LessonView
              lesson={active}
              videoUrl={videoUrls[active.id] ?? null}
              isDone={completed.has(active.id)}
              onToggleDone={() => toggleComplete(active.id)}
              onNext={() => { if (activeIdx < lessons.length - 1) setActiveId(lessons[activeIdx + 1].id) }}
              isLast={activeIdx === lessons.length - 1}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

// ── 單章節內容 ──────────────────────────────────────────────────────────────
function LessonView({
  lesson,
  videoUrl,
  isDone,
  onToggleDone,
  onNext,
  isLast,
}: {
  lesson: Lesson
  videoUrl: string | null
  isDone: boolean
  onToggleDone: () => void
  onNext: () => void
  isLast: boolean
}) {
  return (
    <div>
      <p className="text-brand-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {lesson.id.replace('ch', 'Chapter ')}
      </p>

      <h1 className="text-2xl font-black text-gray-900 mb-1">{lesson.title}</h1>
      <p className="text-sm text-gray-400 flex items-center gap-1 mb-6">
        <Clock size={13} /> {lesson.duration}
      </p>

      {/* Video player */}
      <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 shadow-lg">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            controlsList="nodownload"
            onContextMenu={e => e.preventDefault()}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <PlayCircle size={32} className="text-white/40" />
            </div>
            <p className="text-white/40 text-sm">影片準備中，即將上線</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-3 text-sm">這章在學什麼</h2>
        <div className="text-gray-600 text-sm leading-relaxed mb-5 space-y-3">
          {lesson.description.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <h2 className="font-bold text-gray-900 mb-3 text-sm">重點內容</h2>
        <ul className="space-y-2">
          {lesson.keyPoints.map(pt => (
            <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-700">
              <ChevronRight size={15} className="text-brand-400 mt-0.5 flex-shrink-0" />
              {pt}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDone}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
            ${isDone
              ? 'bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <CheckCircle size={15} />
          {isDone ? '已完成 ✓' : '標記完成'}
        </button>

        {!isLast && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-colors ml-auto"
          >
            下一章
            <ChevronRight size={15} />
          </button>
        )}
        {isLast && (
          <p className="text-sm text-gray-400 ml-auto">🎉 全部章節完成！</p>
        )}
      </div>
    </div>
  )
}
