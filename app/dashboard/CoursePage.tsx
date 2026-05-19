'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, CheckCircle, ChevronRight, Circle, Clock, LogOut, PlayCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Lesson } from '@/lib/course-data'
import StepGuide from './StepGuide'

export interface CourseOption {
  slug: string
  title: string
  lessons: Lesson[]
  tier: 'free' | 'self' | 'cohort'
}

interface Props {
  userEmail: string
  courses: CourseOption[]
  initialCourseSlug?: string
}

export default function CoursePage({ userEmail, courses, initialCourseSlug }: Props) {
  const initialCourse = courses.some((course) => course.slug === initialCourseSlug)
    ? initialCourseSlug!
    : courses[0]?.slug ?? ''
  const [activeCourseSlug, setActiveCourseSlug] = useState(initialCourse)
  const activeCourse = useMemo(
    () => courses.find((course) => course.slug === activeCourseSlug) ?? courses[0],
    [activeCourseSlug, courses],
  )

  const [activeLessonByCourse, setActiveLessonByCourse] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  const lessons = activeCourse.lessons
  const activeId = activeLessonByCourse[activeCourse.slug] ?? lessons[0].id
  const active = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0]
  const activeIdx = lessons.findIndex((lesson) => lesson.id === active.id)
  const completedCount = lessons.filter((lesson) => completed.has(`${activeCourse.slug}:${lesson.id}`)).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  const setActiveLesson = (lessonId: string) => {
    setActiveLessonByCourse((prev) => ({ ...prev, [activeCourse.slug]: lessonId }))
  }

  const toggleComplete = (id: string) => {
    const key = `${activeCourse.slug}:${id}`
    setCompleted((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-black text-white">
              AI
            </div>
            <span className="max-w-[52vw] truncate text-sm font-bold text-gray-900">
              {activeCourse.title}
            </span>
            {activeCourse.tier === 'cohort' && (
              <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Cohort
              </span>
            )}
            {activeCourse.tier === 'free' && (
              <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Free
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}% 完成</span>
            </div>
            <span className="hidden text-xs text-gray-400 sm:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700"
            >
              <LogOut size={14} />
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white md:block">
          {courses.length > 1 && (
            <div className="border-b border-gray-100 p-4">
              <p className="mb-2 text-xs font-semibold text-gray-500">我的課程</p>
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.slug}
                    onClick={() => setActiveCourseSlug(course.slug)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      course.slug === activeCourse.slug
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-600 hover:border-brand-200 hover:bg-gray-50'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-b border-gray-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <BookOpen size={13} />
              <span>{lessons.length} 章課程</span>
              <span className="text-gray-300">·</span>
              <span>{completedCount} 已完成</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <nav className="py-2">
            {lessons.map((lesson, idx) => {
              const isActive = lesson.id === active.id
              const isDone = completed.has(`${activeCourse.slug}:${lesson.id}`)

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson.id)}
                  className={`group flex w-full items-start gap-3 border-r-2 px-4 py-3 text-left transition-colors ${
                    isActive ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle size={16} className="text-brand-500" />
                    ) : isActive ? (
                      <PlayCircle size={16} className="text-brand-500" />
                    ) : (
                      <Circle size={16} className="text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="mb-0.5 block font-mono text-[10px] font-bold text-brand-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className={`text-xs font-medium leading-snug ${isActive ? 'text-brand-700' : 'text-gray-700'}`}>
                      {lesson.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={9} />
                      {lesson.duration}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {courses.length > 1 && (
            <div className="border-b border-gray-200 bg-white px-4 py-2 md:hidden">
              <select
                value={activeCourse.slug}
                onChange={(event) => setActiveCourseSlug(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700"
              >
                {courses.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 md:hidden">
            <div className="flex gap-2">
              {lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    lesson.id === active.id
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-brand-300'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl p-6">
            <LessonView
              lesson={active}
              lessonNumber={activeIdx + 1}
              isDone={completed.has(`${activeCourse.slug}:${active.id}`)}
              onToggleDone={() => toggleComplete(active.id)}
              onNext={() => {
                if (activeIdx < lessons.length - 1) setActiveLesson(lessons[activeIdx + 1].id)
              }}
              isLast={activeIdx === lessons.length - 1}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

function LessonView({
  lesson,
  lessonNumber,
  isDone,
  onToggleDone,
  onNext,
  isLast,
}: {
  lesson: Lesson
  lessonNumber: number
  isDone: boolean
  onToggleDone: () => void
  onNext: () => void
  isLast: boolean
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
        Chapter {String(lessonNumber).padStart(2, '0')}
      </p>

      <h1 className="mb-1 text-2xl font-black text-gray-900">{lesson.title}</h1>
      <p className="mb-6 flex items-center gap-1 text-sm text-gray-400">
        <Clock size={13} /> {lesson.duration}
      </p>

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-bold text-gray-900">這堂課你會做什麼</h2>
        <div className="mb-5 space-y-3 text-sm leading-relaxed text-gray-600">
          {lesson.description.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <h2 className="mb-3 text-sm font-bold text-gray-900">重點整理</h2>
        <ul className="space-y-2">
          {lesson.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
              <ChevronRight size={15} className="mt-0.5 shrink-0 text-brand-400" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {lesson.steps?.length > 0 && <StepGuide steps={lesson.steps} />}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onToggleDone}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            isDone
              ? 'border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CheckCircle size={15} />
          {isDone ? '已完成' : '標記完成'}
        </button>

        {!isLast ? (
          <button
            onClick={onNext}
            className="ml-auto flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            下一章
            <ChevronRight size={15} />
          </button>
        ) : (
          <p className="ml-auto text-sm text-gray-400">這堂課完成了。</p>
        )}
      </div>
    </div>
  )
}
