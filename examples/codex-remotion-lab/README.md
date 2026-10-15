# 本機 Remotion 最小練習

這是課程 cr00–cr08 的可重播小範例：兩段共 6 秒，1280×720、30fps，以原創文字示範時間軸。沒有呼叫任何模型、生成圖像、TTS 或上傳服務，成品沒有音軌。

先讀 [Remotion 授權條件](https://www.remotion.dev/license)，確認你的個人或團隊用途適用。本範例不代你接受付費合約。

在這個資料夾用 PowerShell 執行：

```powershell
npm install
npm run validate
npm run studio
```

另開終端機渲染單段及全片：

```powershell
npx remotion compositions src/index.jsx
npx remotion render src/index.jsx LessonSegment out/s01.mp4 --props=segment.json
npm run render
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json out/practice.mp4
ffmpeg -v error -i out/practice.mp4 -f null -
```

預期：驗證器輸出 180frames、6秒、2段。全片有兩段不同的文字動畫，沒有音軌。CLI 第一次可能下載官方 Chrome Headless Shell；這是本機 renderer，與生成 API 額度無關。

在副本中故意把第二段 from 改成 80、再把兩個 id 改成相同，分別重跑 validate，兩者必須失敗。還原後重新驗證。修改一段後，先 render 該段；不會自動發布。

延伸角色／旁白案例：自行提供有權利的圖與音訊，再加入 Img/Audio，另做字幕安全區、素材來源及音量驗收。本範例不能當作已完成角色動畫長片的證據。
