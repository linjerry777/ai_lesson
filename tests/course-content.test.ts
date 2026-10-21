import { describe, expect, it } from 'vitest'
import { courses, getCourse, getSaleOffer } from '@/lib/courses'
import { getLearnerCourses } from '@/lib/learner-access'

describe('course delivery and access', () => {
  it('keeps two distinct paid products, with explicit TWD amounts and no cohort offer', () => {
    expect(getSaleOffer('claude-code', 'self')?.amountMinor).toBe(99000)
    expect(getSaleOffer('codex-remotion', 'self')?.amountMinor).toBe(149000)
    expect(getSaleOffer('claude-code', 'cohort')).toBeNull()
    expect(getCourse('toString')).toBeNull()
  })
  it('provides a real exercise, evidence and acceptance block for every chapter', () => {
    expect(Object.values(courses).reduce((n, course) => n + course.lessons.length, 0)).toBe(21)
    for (const course of Object.values(courses)) for (const lesson of course.lessons) {
      expect(lesson.steps.find(step => step.title === '動手練習')?.body?.length).toBeGreaterThan(80)
      expect(lesson.steps.find(step => step.title === '交付與驗收')?.code?.content).toContain('□')
    }
  })
  it('does not unlock another product, malformed tier or sandbox purchase in live mode', () => {
    expect(getLearnerCourses([{ product_id: 'claude-code', tier: 'self', stripe_session_id: 'cs_test_valid' }], true).map(course => course.slug)).toEqual(['starter-free'])
    expect(getLearnerCourses([{ product_id: 'claude-code', tier: 'self', stripe_session_id: 'cs_test_valid' }, { product_id: 'codex-remotion', tier: 'fake', stripe_session_id: 'cs_test_other' }], false).map(course => course.slug)).toEqual(['starter-free', 'claude-code'])
  })

  it('unlocks courses bought through a Payment Link in either Stripe mode', () => {
    const purchases = [{ product_id: 'claude-code', tier: 'self', stripe_session_id: 'link:cs_live_abc:claude-code' }]
    expect(getLearnerCourses(purchases, false).map(course => course.slug)).toEqual(['starter-free', 'claude-code'])
    expect(getLearnerCourses(purchases, true).map(course => course.slug)).toEqual(['starter-free', 'claude-code'])
  })

  it('does not point learners at the old course website', async () => {
    const { lessons } = await import('@/lib/course-data')
    const text = JSON.stringify(lessons)
    expect(text).not.toContain('ailesson-two.vercel.app')
    expect(text).not.toContain('components/sections/')
  })
})
