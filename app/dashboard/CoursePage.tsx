'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, CheckCircle, ChevronRight, Circle, Clock, LogOut, PlayCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Lesson } from '@/lib/course-data'
import StepGuide from './StepGuide'
import AiHelpComposer from '@/components/AiHelpComposer'
import styles from './learning.module.css'
import { createProgressStore, EMPTY_SNAPSHOT } from '@/lib/course-progress'
import { useCloudProgress } from '@/lib/use-cloud-progress'

export interface CourseOption {
  slug: string
  title: string
  lessons: Lesson[]
  tier: 'free' | 'self' | 'cohort'
}

interface Props {
  userId: string
  userEmail: string
  courses: CourseOption[]
  initialCourseSlug?: string
  cloudProgressEnabled?: boolean
}

export default function CoursePage({ userId, userEmail, courses, initialCourseSlug, cloudProgressEnabled = false }: Props) {
  const initialCourse = courses.some((course) => course.slug === initialCourseSlug)
    ? initialCourseSlug!
    : courses[0]?.slug ?? ''
  const [activeCourseSlug, setActiveCourseSlug] = useState(initialCourse)
  const activeCourse = useMemo(
    () => courses.find((course) => course.slug === activeCourseSlug) ?? courses[0],
    [activeCourseSlug, courses],
  )

  const progressStore = useMemo(() => createProgressStore(userId, () => window.localStorage), [userId])
  const cloud = useCloudProgress(cloudProgressEnabled, progressStore, courses.map(course => course.slug))
  const saved = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, () => EMPTY_SNAPSHOT)
  const activeLessonByCourse = saved.progress.activeLessons
  const completed = useMemo(() => new Set(saved.progress.completed), [saved.progress.completed])
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === progressStore.key || event.key === null) progressStore.reload()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [progressStore])
  const router = useRouter()

  const lessons = activeCourse.lessons
  const activeId = activeLessonByCourse[activeCourse.slug] ?? lessons[0].id
  const active = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0]
  const activeIdx = lessons.findIndex((lesson) => lesson.id === active.id)
  const completedCount = lessons.filter((lesson) => completed.has(`${activeCourse.slug}:${lesson.id}`)).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  const setActiveLesson = (lessonId: string) => {
    progressStore.update((current) => ({ ...current, activeLessons: { ...current.activeLessons, [activeCourse.slug]: lessonId } }))
    cloud.save({ courseSlug: activeCourse.slug, lessonId, opened: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const toggleComplete = (id: string) => {
    const key = `${activeCourse.slug}:${id}`
    const nextCompleted = !completed.has(key)
    progressStore.update((current) => {
      const next = new Set(current.completed)
      next.has(key) ? next.delete(key) : next.add(key)
      return { ...current, completed: [...next] }
    })
    cloud.save({ courseSlug: activeCourse.slug, lessonId: id, completed: nextCompleted })
  }

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    router.push('/')
  }

  return (
    <div className={`${styles.workspace} flex min-h-screen flex-col`}>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-black text-white">
              AI
            </div>
            <span className="max-w-[42vw] truncate text-sm font-bold text-gray-900">
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

          <div className="flex shrink-0 items-center gap-4">
            <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}% 完成</span>
            </div>
            <span className="hidden text-xs text-gray-400 sm:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              aria-label="登出課程"
              className="flex min-h-11 items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700"
            >
              <LogOut size={14} />
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className={`${styles.sidebar} hidden w-72 shrink-0 overflow-y-auto border-r border-gray-200 md:block`}>
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

          <nav className="py-2" aria-label="課程章節">
            {lessons.map((lesson, idx) => {
              const isActive = lesson.id === active.id
              const isDone = completed.has(`${activeCourse.slug}:${lesson.id}`)

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson.id)}
                  aria-current={lesson.id === active.id ? "step" : undefined}
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

        <main className="min-w-0 flex-1">
          {courses.length > 1 && (
            <div className="border-b border-gray-200 bg-white px-4 py-2 md:hidden">
              <select
                value={activeCourse.slug}
                aria-label="切換課程"
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
                  aria-current={lesson.id === active.id ? "step" : undefined}
                  className={`min-h-11 max-w-60 shrink-0 truncate rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    lesson.id === active.id
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-brand-300'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')} · {lesson.title}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.reading} mx-auto max-w-4xl p-4 sm:p-8 lg:p-10`}>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold tracking-wider text-brand-600">你的學習工作台</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">已完成 {completedCount} / {lessons.length} 章，照自己的節奏前進。</p>
              </div>
              <p role="status" className={`max-w-xs text-xs leading-relaxed ${saved.persistent ? 'text-gray-500' : 'text-amber-700'}`}>
                {cloudProgressEnabled ? (cloud.status === 'synced' ? '進度已同步到帳號；重新開啟課程可回讀。' : cloud.status === 'error' ? '帳號同步失敗；本頁保留瀏覽器進度，請稍後重試。' : '正在同步帳號進度…') : saved.persistent ? '進度儲存在此瀏覽器；同一帳號重新整理後可接續。' : '瀏覽器無法保存進度，目前只暫存在本頁。請開啟儲存權限後再標記。'}
              </p>
            </div>
            <LessonView
              key={`${activeCourse.slug}:${active.id}`}
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

      <h1 className="mb-3 text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl">{lesson.title}</h1>
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

      <details className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-gray-800">卡住了？整理這一章的 AI 求助單</summary>
        <div className="mt-3"><AiHelpComposer lessonTitle={lesson.title} /></div>
      </details>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleDone}
          className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
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
            className="ml-auto flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            下一章
            <ChevronRight size={15} />
          </button>
        ) : (
          <p className="ml-auto text-sm text-gray-500">{isDone ? '本章已完成，回顧其他章節也很好。' : '學完後，記得標記完成。'}</p>
        )}
      </div>
    </div>
  )
}
