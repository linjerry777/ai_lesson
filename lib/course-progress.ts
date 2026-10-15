export interface CourseProgress {
  version: 1
  completed: string[]
  activeLessons: Record<string, string>
}

export const EMPTY_PROGRESS: CourseProgress = { version: 1, completed: [], activeLessons: {} }
export const EMPTY_SNAPSHOT = { progress: EMPTY_PROGRESS, persistent: true }

export function reconcileCloudProgress(local: CourseProgress, remote: CourseProgress, trackedCourses: string[]): CourseProgress {
  const tracked = new Set(trackedCourses)
  return { version: 1,
    completed: [...new Set([...local.completed.filter(key => !tracked.has(key.split(':')[0])), ...remote.completed])],
    activeLessons: { ...Object.fromEntries(Object.entries(local.activeLessons).filter(([slug]) => !tracked.has(slug))), ...remote.activeLessons },
  }
}
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function parseCourseProgress(raw: string | null): CourseProgress {
  try {
    const value = JSON.parse(raw ?? 'null')
    if (value?.version !== 1 || !Array.isArray(value.completed) || !value.activeLessons || typeof value.activeLessons !== 'object' || Array.isArray(value.activeLessons)) return EMPTY_PROGRESS
    return {
      version: 1,
      completed: [...new Set<string>(value.completed.filter((key: unknown) => typeof key === 'string'))],
      activeLessons: Object.fromEntries(Object.entries(value.activeLessons).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function createProgressStore(userId: string, getStorage: () => StorageLike) {
  const key = `ai-lesson:progress:v1:${userId}`
  let snapshot = EMPTY_SNAPSHOT
  let loaded = false
  const listeners = new Set<() => void>()
  const reload = () => {
    try {
      snapshot = { progress: parseCourseProgress(getStorage().getItem(key)), persistent: true }
    } catch {
      snapshot = { ...snapshot, persistent: false }
    }
    loaded = true
    listeners.forEach((listener) => listener())
  }
  return {
    key,
    reload,
    getSnapshot: () => {
      if (!loaded) reload()
      return snapshot
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    update: (transform: (current: CourseProgress) => CourseProgress) => {
      if (!loaded) reload()
      const progress = transform(snapshot.progress)
      let persistent = true
      try { getStorage().setItem(key, JSON.stringify(progress)) } catch { persistent = false }
      snapshot = { progress, persistent }
      listeners.forEach((listener) => listener())
    },
  }
}
