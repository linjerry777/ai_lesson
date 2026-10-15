import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export function validateEpisode(episode) {
  for (const key of ['fps', 'width', 'height']) {
    if (!Number.isInteger(episode[key]) || episode[key] <= 0) throw new Error(`Invalid ${key}`)
  }
  if (!Array.isArray(episode.segments) || !episode.segments.length) throw new Error('Missing segments')
  const ids = new Set()
  let frames = 0
  for (const segment of episode.segments) {
    if (typeof segment.id !== 'string' || !segment.id || ids.has(segment.id)) throw new Error('Duplicate or missing segment id')
    if (!Number.isInteger(segment.durationInFrames) || segment.durationInFrames <= 0 || segment.from !== frames) throw new Error('Invalid duration, gap or overlap')
    if (typeof segment.caption !== 'string' || !segment.caption.trim()) throw new Error('Missing caption')
    ids.add(segment.id)
    frames += segment.durationInFrames
  }
  return { frames, seconds: frames / episode.fps, segments: ids.size }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(validateEpisode(JSON.parse(readFileSync(process.argv[2] ?? 'episode.json', 'utf8')))))
}
