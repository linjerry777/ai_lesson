import { describe, expect, it } from 'vitest'
import episode from '@/examples/codex-remotion-lab/episode.json'
import { validateEpisode } from '@/examples/codex-remotion-lab/validate-episode.mjs'

describe('offline Remotion lesson exercise', () => {
  it('validates the supplied six-second timeline', () => expect(validateEpisode(episode)).toEqual({ frames: 180, seconds: 6, segments: 2 }))
  it('rejects overlapping scenes and duplicate IDs', () => {
    const overlap = structuredClone(episode)
    overlap.segments[1].from = 80
    expect(() => validateEpisode(overlap)).toThrow()
    const duplicate = structuredClone(episode)
    duplicate.segments[1].id = 's01'
    expect(() => validateEpisode(duplicate)).toThrow()
  })
})
