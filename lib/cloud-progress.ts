import { getCourse, isValidProduct } from './courses'
import type { CourseProgress } from './course-progress'

export interface ProgressRow { product_id: string; lesson_id: string; completed: boolean; last_opened_at: string | null }

export function validateProgressChange(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const value = input as Record<string, unknown>
  if (!isValidProduct(typeof value.courseSlug === 'string' ? value.courseSlug : null) || typeof value.lessonId !== 'string') return null
  const courseSlug = value.courseSlug as string
  const lessonId = value.lessonId
  if (!getCourse(courseSlug)?.lessons.some(lesson => lesson.id === lessonId)) return null
  if (value.completed !== undefined && typeof value.completed !== 'boolean') return null
  if (value.opened !== undefined && typeof value.opened !== 'boolean') return null
  if (value.completed === undefined && value.opened !== true) return null
  return { courseSlug, lessonId, completed: value.completed as boolean | undefined, opened: value.opened === true }
}

export function progressFromRows(rows: ProgressRow[]): CourseProgress {
  const activeLessons: Record<string, string> = {}
  const lastOpened: Record<string, string> = {}
  const completed: string[] = []
  for (const row of rows) {
    if (!getCourse(row.product_id)?.lessons.some(lesson => lesson.id === row.lesson_id)) continue
    if (row.completed) completed.push(`${row.product_id}:${row.lesson_id}`)
    if (row.last_opened_at && (!lastOpened[row.product_id] || row.last_opened_at > lastOpened[row.product_id])) {
      lastOpened[row.product_id] = row.last_opened_at
      activeLessons[row.product_id] = row.lesson_id
    }
  }
  return { version: 1, completed, activeLessons }
}

export { reconcileCloudProgress } from './course-progress'
