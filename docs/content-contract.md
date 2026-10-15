# 內容格式契約（影片筆記 / 免費資源）

網站的影片頁與免費資源頁全部由 repo 內的 JSON 產生。口播影片管線、Claude 或手動都用同一份格式寫入；`npm run check` 會驗證每個檔案，格式錯誤會讓 build 失敗而不是讓訪客看到壞頁。

## 影片：`content/videos/<NNN>-<slug>.json`

```json
{
  "slug": "ai-short-video-factory",          // kebab-case，頁面網址 /videos/<slug>
  "code": "1",                               // 口播短碼，/v/<code>；1–16 個 a-z0-9，不可重複
  "title": "影片標題",
  "channel": "tech",                          // lib/site.ts 的 CHANNELS key
  "publishedAt": "2026-10-15",                // YYYY-MM-DD，列表依此排序
  "status": "published",                      // draft 不會出現在網站
  "summary": "一兩句摘要（≤400 字）",
  "platforms": {
    "youtube": "dQw4w9WgXcQ",                 // 11 碼影片 ID（不是網址），有它就嵌入播放器與縮圖
    "bilibili": "BV1xx411c7mD",               // BV 號；沒有 YouTube 時嵌入 B站播放器
    "instagram": "https://…", "threads": "https://…", "facebook": "https://…", "tiktok": "https://…"
  },
  "sections": [{ "heading": "小標", "body": "段落，空一行分段" }],
  "prompts":  [{ "title": "prompt 名稱", "text": "可直接複製的完整 prompt" }],
  "tools":    [{ "name": "Claude Code", "url": "https://…", "note": "一句話用途（選填）" }],
  "cta": { "kind": "free", "slug": "autovideo-prompt-pack", "pitch": "影片頁上的一句話（選填）" }
}
```

- 平台欄位都可以先留空，影片上架後再補；不認得的平台名稱會被擋下。
- `cta.slug` 必須對應一份 `published` 的免費資源。

## 免費資源：`content/free/<slug>.json`

```json
{
  "slug": "autovideo-prompt-pack",
  "title": "AI 短影音自動化 Prompt 包",
  "summary": "…",
  "status": "published",
  "format": "Markdown · 6 組 prompt",
  "bullets": ["內容重點 1", "內容重點 2"],
  "file": { "path": "autovideo-prompt-pack/autovideo-prompt-pack-v1.md", "downloadName": "ai-short-video-prompt-pack-v1.md" }
}
```

檔案本體放在 `course-resources/free/<file.path>`，再上傳到私有 bucket：

```bash
node --env-file=.env.local scripts/upload-free-resources.mjs
```

下載只透過 `/api/leads` 產生的 10 分鐘簽名網址；bucket 不公開。更新版本時改 `file.path`（例如 `-v2`）並重新上傳。

## 口播 CTA 與追蹤

- 影片結尾 / 置頂留言放：`<網站>/v/<code>`，可加平台別名 `?s=yt|bili|ig|th|fb|tt`，例如 `/v/12?s=bili`。
- 也可以直接用 UTM：`/free/<slug>?utm_source=youtube&utm_campaign=ep12`。
- 訪客的最後一次來源（影片短碼、平台、campaign）存 30 天 cookie；留 Email 時寫入名單（同一人同一資源保留第一次的來源）。
- 管理者（`ADMIN_EMAILS`）登入後看 `/admin/stats`：每支影片的點擊、名單與轉換率。
