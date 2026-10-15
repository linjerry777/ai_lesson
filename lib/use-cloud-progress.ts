'use client'

import { useEffect, useRef, useState } from 'react'
import { createProgressStore, parseCourseProgress, reconcileCloudProgress } from './course-progress'

type Store = ReturnType<typeof createProgressStore>
type Change = { courseSlug: string; lessonId: string; completed?: boolean; opened?: boolean }

export function useCloudProgress(enabled: boolean, store: Store, entitledCourses: string[]) {
  const [status, setStatus] = useState<'local' | 'loading' | 'synced' | 'error'>(enabled ? 'loading' : 'local')
  const queue = useRef(Promise.resolve())
  const mounted = useRef(false)
  const pending = useRef<Change[]>([])
  const loaded = useRef(false)
  const pendingKey = `${store.key}:pending-cloud:v1`
  const persistPending = () => {
    try { window.localStorage.setItem(pendingKey, JSON.stringify(pending.current)) } catch { /* Browser storage can be unavailable. */ }
  }
  const flushPending = async () => {
    while (pending.current.length) {
      const change = pending.current[0]
      const response = await fetch('/api/progress', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(change) })
      if (!response.ok) throw new Error('Unavailable')
      pending.current = pending.current.filter(item => item !== change)
      persistPending()
    }
  }
  const courseList = entitledCourses.join(',')
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    mounted.current = true
    const load = async () => {
      try {
        if (!pending.current.length) {
          try {
            const saved: unknown = JSON.parse(window.localStorage.getItem(`${store.key}:pending-cloud:v1`) ?? '[]')
            if (Array.isArray(saved)) pending.current = saved.filter((item): item is Change => item && typeof item.courseSlug === 'string' &&
              courseList.split(',').includes(item.courseSlug) && typeof item.lessonId === 'string' &&
              (typeof item.completed === 'boolean' || item.opened === true))
          } catch { /* An invalid browser backup is not trusted. */ }
        }
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok) throw new Error('Unavailable')
        const body = await response.json()
        if (cancelled) return
        const remote = parseCourseProgress(JSON.stringify(body.progress))
        const tracked: string[] = Array.isArray(body.trackedCourses) ? body.trackedCourses.filter((slug: unknown) => typeof slug === 'string') : []
        const local = store.getSnapshot().progress
        // Keep the pre-cloud browser snapshot recoverable. Existing cloud rows win.
        try { window.localStorage.setItem(`${store.key}:before-cloud`, JSON.stringify(local)) } catch { /* Local storage may be blocked. */ }
        store.update(() => reconcileCloudProgress(local, remote, tracked))
        // Replay actions made while GET was in flight; their queued writes follow.
        for (const change of pending.current) store.update(current => {
          const key = `${change.courseSlug}:${change.lessonId}`
          const completed = new Set(current.completed)
          if (change.completed !== undefined) change.completed ? completed.add(key) : completed.delete(key)
          return { ...current, completed: [...completed], activeLessons: change.opened ? { ...current.activeLessons, [change.courseSlug]: change.lessonId } : current.activeLessons }
        })
        const entitled = new Set(courseList.split(','))
        const changes: Change[] = local.completed.flatMap(key => {
          const [courseSlug, lessonId] = key.split(':')
          return entitled.has(courseSlug) && !tracked.includes(courseSlug) ? [{ courseSlug, lessonId, completed: true }] : []
        })
        for (const [courseSlug, lessonId] of Object.entries(local.activeLessons)) {
          if (entitled.has(courseSlug) && !tracked.includes(courseSlug)) changes.push({ courseSlug, lessonId, opened: true })
        }
        for (const change of changes) {
          if (cancelled) return
          const saved = await fetch('/api/progress', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(change) })
          if (!saved.ok) throw new Error('Unavailable')
        }
        if (!cancelled) {
          await flushPending()
          loaded.current = true
          setStatus('synced')
        }
      } catch { if (!cancelled) setStatus('error') }
    }
    queue.current = load()
    return () => { cancelled = true; mounted.current = false }
  // The queue helpers read stable refs; initializing is tied to account/course scope.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, store, courseList])

  const save = (change: Change) => {
    if (!enabled) return
    pending.current.push(change)
    persistPending()
    // Serialize writes behind initial loading/import so older responses cannot win.
    queue.current = queue.current.then(async () => {
      if (mounted.current) setStatus('loading')
      try {
        await flushPending()
        if (mounted.current) setStatus(loaded.current ? 'synced' : 'error')
      } catch { if (mounted.current) setStatus('error') }
    })
  }
  return { status, save }
}
