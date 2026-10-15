import { describe, expect, it } from 'vitest'
import {
  CAMERA_PATH, cameraAt, channelsCopyOpacity, channelsLift, coverCopyOpacity, coverLift, flipAngle, freeCopyOpacity, freeLift,
  layerPlacement, SPREAD, TIMELINE,
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
    expect(coverLift(TIMELINE.flip[0], 1, 0)).toBe(0)
  })

  it('turns each page flat to flat, one after the other', () => {
    const mid = (r: readonly [number, number]) => (r[0] + r[1]) / 2
    expect(flipAngle(TIMELINE.flip[0])).toBe(0)
    expect(flipAngle(mid(TIMELINE.flip))).toBeCloseTo(Math.PI / 2)
    expect(flipAngle(TIMELINE.flip[1])).toBeCloseTo(Math.PI)
    expect(flipAngle(TIMELINE.flip[1], 2)).toBe(0)
    expect(flipAngle(1, 2)).toBeCloseTo(Math.PI)
  })

  it('pops the free-lesson chapter after the first turn and folds it before the second', () => {
    expect(freeLift(TIMELINE.freePop[0], 0)).toBe(0)
    const early = TIMELINE.freePop[0] + 0.03
    expect(freeLift(early, 0)).toBeGreaterThan(freeLift(early, 1))
    expect(freeLift(0.5, 1)).toBeCloseTo(1)
    expect(freeLift(TIMELINE.flip2[0], 0)).toBe(0)
  })

  it('stands the channel wall up after the second turn and keeps it', () => {
    expect(channelsLift(TIMELINE.flip2[0], 0)).toBe(0)
    expect(channelsLift(1, 0)).toBeCloseTo(1)
    expect(channelsLift(1, 1)).toBeCloseTo(1)
  })

  it('hands the copy from chapter to chapter', () => {
    expect(coverCopyOpacity(0)).toBe(1)
    expect(coverCopyOpacity(0.2)).toBe(0)
    expect(freeCopyOpacity(0.3)).toBe(0)
    expect(freeCopyOpacity(0.48)).toBe(1)
    expect(freeCopyOpacity(0.65)).toBe(0)
    expect(channelsCopyOpacity(0.7)).toBe(0)
    expect(channelsCopyOpacity(0.95)).toBe(1)
  })

  it('maps the shared 0..1 layout onto the spread', () => {
    expect(layerPlacement(0.5, 0.5)).toEqual({ x: 0, z: 0 })
    expect(layerPlacement(0, 1).x).toBe(-SPREAD.width / 2)
    expect(layerPlacement(0, 1).z).toBeLessThan(0)
  })
})
