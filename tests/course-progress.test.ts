import { describe, expect, it } from 'vitest'
import { createProgressStore, parseCourseProgress } from '../lib/course-progress'

function storage() {
  const data = new Map<string, string>()
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value) } }
}

describe('browser course progress', () => {
  it('restores completion and last lesson after a new page load, isolated by account', () => {
    const disk = storage()
    const first = createProgressStore('learner-a', () => disk)
    first.update((current) => ({ ...current, completed: ['starter:1'], activeLessons: { starter: '2' } }))
    expect(createProgressStore('learner-a', () => disk).getSnapshot().progress).toEqual({ version: 1, completed: ['starter:1'], activeLessons: { starter: '2' } })
    expect(createProgressStore('learner-b', () => disk).getSnapshot().progress.completed).toEqual([])
  })
  it('keeps usable in-memory progress and discloses failed storage', () => {
    const store = createProgressStore('blocked', () => { throw new Error('blocked storage') })
    store.update((current) => ({ ...current, completed: ['starter:1'] }))
    expect(store.getSnapshot().persistent).toBe(false)
    expect(store.getSnapshot().progress.completed).toEqual(['starter:1'])
  })
  it('recovers from corrupt or unsupported data and discards malformed entries', () => {
    expect(parseCourseProgress('{bad').completed).toEqual([])
    expect(parseCourseProgress('{"version":2}').completed).toEqual([])
    expect(parseCourseProgress('{"version":1,"completed":[1,"a","a"],"activeLessons":{"a":"b","c":2}}')).toEqual({ version: 1, completed: ['a'], activeLessons: { a: 'b' } })
  })
  it('reloads changes from another tab and stops notifying unsubscribed views', () => {
    const disk = storage()
    const store = createProgressStore('same-user', () => disk)
    store.getSnapshot()
    let count = 0
    const unsubscribe = store.subscribe(() => { count++ })
    const other = createProgressStore('same-user', () => disk)
    other.update((current) => ({ ...current, completed: ['course:lesson'] }))
    store.reload()
    expect(store.getSnapshot().progress.completed).toEqual(['course:lesson'])
    unsubscribe()
    store.reload()
    expect(count).toBe(1)
  })
})
