import { describe, expect, it } from 'vitest'
import { buildHelpBrief } from '../lib/ai-help-brief'

describe('AI help brief', () => {
  it.each([['', 'error'], ['goal', '   ']])('requires both a goal and observed evidence', (goal, observed) => {
    expect(buildHelpBrief({ lessonTitle: '入門', goal, observed, attempted: '' })).toBeNull()
  })
  it('preserves exact errors and requests evidence before suggesting a minimal fix', () => {
    const result = buildHelpBrief({ lessonTitle: '登入', goal: '  完成登入  ', attempted: '啟動本機服務', observed: 'OAuth: redirect_uri_mismatch\nHTTP 400' })
    expect(result).toContain('我正在學習：登入')
    expect(result).toContain('預期結果：\n完成登入')
    expect(result).toContain('OAuth: redirect_uri_mismatch\nHTTP 400')
    expect(result).toContain('一次只建議一個最小修正')
    expect(result).toContain('不要要求我提供 API 金鑰')
  })
  it('asks for missing attempted steps instead of inventing them', () => {
    expect(buildHelpBrief({ lessonTitle: '', goal: '開啟首頁', observed: '無法開啟', attempted: ' ' })).toContain('尚未提供，請先向我確認。')
  })
})
