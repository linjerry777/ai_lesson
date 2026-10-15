import React from 'react'
import { registerRoot, Composition, Sequence, AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import episode from '../episode.json'

export const LessonSegment = ({ caption }) => {
  const frame = useCurrentFrame()
  return <AbsoluteFill style={{ backgroundColor: '#1f3136', color: '#fffaf0', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, Microsoft JhengHei, sans-serif' }}>
    <p style={{ fontSize: 24, letterSpacing: 3, marginBottom: 32 }}>AI LESSON · LOCAL PRACTICE</p>
    <div style={{ maxWidth: 1000, padding: '0 80px', fontSize: 48, lineHeight: 1.5, textAlign: 'center', opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [0, 12], [16, 0], { extrapolateRight: 'clamp' })}px)` }}>{caption}</div>
    <p style={{ position: 'absolute', bottom: 46, fontSize: 22 }}>原創文字動畫練習 · 不含生成圖像與音訊</p>
  </AbsoluteFill>
}

const LessonEpisode = ({ segments }) => <AbsoluteFill>{segments.map(segment => <Sequence key={segment.id} from={segment.from} durationInFrames={segment.durationInFrames}><LessonSegment caption={segment.caption} /></Sequence>)}</AbsoluteFill>
const Root = () => <>
  <Composition id="LessonSegment" component={LessonSegment} fps={30} width={1280} height={720} durationInFrames={90} defaultProps={{ caption: '先把目標拆成可驗收的步驟' }} />
  <Composition id="LessonEpisode" component={LessonEpisode} fps={episode.fps} width={episode.width} height={episode.height} durationInFrames={180} defaultProps={episode} />
</>
registerRoot(Root)
