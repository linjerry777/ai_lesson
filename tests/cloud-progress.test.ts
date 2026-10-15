import { describe, expect, it } from 'vitest'
import { validateProgressChange, progressFromRows, reconcileCloudProgress } from '@/lib/cloud-progress'

describe('learner progress', () => {
  it('rejects unknown products, wrong-course lessons and invalid completion values', () => {
    for (const body of [{ courseSlug: 'toString', lessonId: 'ch00', completed: true }, { courseSlug: 'claude-code', lessonId: 'cr00', completed: true }, { courseSlug: 'starter-free', lessonId: 'start00', completed: 'yes' }, {}]) expect(validateProgressChange(body)).toBeNull()
  })
  it('accepts an atomic single-lesson change and never accepts a caller user ID', () => {
    expect(validateProgressChange({ userId: 'forged', courseSlug: 'starter-free', lessonId: 'start00', completed: false })).toEqual({ courseSlug: 'starter-free', lessonId: 'start00', completed: false, opened: false })
  })
  it('selects the last opened lesson without confusing product IDs', () => {
    expect(progressFromRows([
      { product_id: 'starter-free', lesson_id: 'start00', completed: true, last_opened_at: '2026-09-30T01:00:00Z' },
      { product_id: 'starter-free', lesson_id: 'start01', completed: false, last_opened_at: '2026-09-30T02:00:00Z' },
      { product_id: 'claude-code', lesson_id: 'cr00', completed: true, last_opened_at: null },
    ])).toEqual({ version: 1, completed: ['starter-free:start00'], activeLessons: { 'starter-free': 'start01' } })
  })
  it('honors a cloud un-completion while preserving never-synced browser courses', () => {
    expect(reconcileCloudProgress({ version: 1, completed: ['starter-free:start00', 'claude-code:ch00'], activeLessons: {} }, { version: 1, completed: [], activeLessons: {} }, ['starter-free']).completed).toEqual(['claude-code:ch00'])
  })
})
