export type HelpBrief = {
  lessonTitle: string
  goal: string
  attempted: string
  observed: string
}

export function buildHelpBrief(input: HelpBrief): string | null {
  const goal = input.goal.trim()
  const observed = input.observed.trim()
  if (!goal || !observed) return null
  return [
    `我正在學習：${input.lessonTitle.trim() || 'AI 實作'}`,
    `\n目標與預期結果：\n${goal}`,
    `\n已嘗試的操作：\n${input.attempted.trim() || '尚未提供，請先向我確認。'}`,
    `\n實際結果／錯誤訊息：\n${observed}`,
    '\n請先根據以上資訊縮小原因。如果證據不足，先問我需要補充的資訊，不要猜測。',
    '一次只建議一個最小修正，說明修改位置、原因、驗證步驟，以及成功時應該看到什麼。',
    '保留既有功能與資料，不要要求我提供 API 金鑰、密碼或完整環境變數。',
  ].join('\n')
}
