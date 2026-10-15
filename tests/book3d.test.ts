import { describe, expect, it } from 'vitest'
import {
  CAMERA_PATH, cameraAt, coverCopyOpacity, coverLift, flipAngle, freeCopyOpacity, freeLift, layerPlacement, SPREAD,
} from '@/lib/book3d'

describe('3D book timeline', () => {
  it('starts and ends on the first and last camera keys', () => {
    expect(cameraAt(0).pos).toEqual(CAMERA_PATH[0].pos)
    expect(cameraAt(1).pos).toEqual(CAMERA_PATH[CAMERA_PATH.length - 1].pos)
  })

  it('interpolates the camera between keys and falls back to target for focus', () => {
    const a = CAMERA_PATH[0], b = CAMERA_PATH[1]
    const mid = cameraAt((a.at + b.at) / 2)
    for (let i = 0; i < 3; i++) {
      expect(mid.pos[i]).toBeGreaterThanOrEqual(Math.min(a.pos[i], b.pos[i]))
      expect(mid.pos[i]).toBeLessThanOrEqual(Math.max(a.pos[i], b.pos[i]))
    }
    expect(cameraAt(0).focus).toEqual(CAMERA_PATH[0].target)
  })

  it('opens the cover with the intro and folds it before the page turns', () => {
    expect(coverLift(0, 0, 0)).toBe(0)
    expect(coverLift(0, 1, 0)).toBeCloseTo(1)
    expect(coverLift(0, 1, 1)).toBeCloseTo(1)
    expect(coverLift(0.4, 1, 0)).toBe(0)
  })

  it('turns the page once, flat to flat', () => {
    expect(flipAngle(0.2)).toBe(0)
    expect(flipAngle(0.46)).toBeGreaterThan(0)
    expect(flipAngle(0.46)).toBeLessThan(Math.PI)
    expect(flipAngle(0.8)).toBeCloseTo(Math.PI)
  })

  it('pops the free-lesson chapter after the turn, back layers first', () => {
    expect(freeLift(0.5, 0)).toBe(0)
    expect(freeLift(0.58, 0)).toBeGreaterThan(freeLift(0.58, 1))
    expect(freeLift(0.9, 1)).toBeCloseTo(1)
  })

  it('hands the copy from the cover to the free chapter', () => {
    expect(coverCopyOpacity(0)).toBe(1)
    expect(coverCopyOpacity(0.3)).toBe(0)
    expect(freeCopyOpacity(0.5)).toBe(0)
    expect(freeCopyOpacity(0.75)).toBe(1)
  })

  it('maps the shared 0..1 layout onto the spread', () => {
    expect(layerPlacement(0.5, 0.5)).toEqual({ x: 0, z: 0 })
    expect(layerPlacement(0, 1).x).toBe(-SPREAD.width / 2)
    expect(layerPlacement(0, 1).z).toBeLessThan(0)
  })
})
