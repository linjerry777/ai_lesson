# Subtitle Timing Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 faster-whisper word-level timestamps 修正 correct.json 的字幕 timing，讓字幕精確對齊聲音，解決 5:12 後字幕超前問題。

**Architecture:** 兩階段 pipeline — (1) `make_subs_gpu.py` 重寫，產出 `words.json`（字詞級精確 timing）；(2) `align_timing.py` 讀 correct.json + words.json，對每個 segment 找最近的 word 邊界，輸出修正後的 timing，再燒入影片。

**Tech Stack:** faster-whisper 1.2.1、ffmpeg、Python 3.12、CUDA（RTX 4070）、float16

---

## 檔案結構

| 檔案 | 動作 | 職責 |
|------|------|------|
| `C:/Users/User/Videos/Captures/make_subs_gpu.py` | 修改 | 修掉 encoding 問題、加 word_timestamps、condition_on_previous_text=False |
| `C:/Users/User/Videos/Captures/align_timing.py` | 新增 | 讀 correct.json + words.json → 輸出精確 timing → ASS → 燒影片 |
| `C:/Users/User/Videos/Captures/01_cut_subs/words.json` | 產出 | 字詞級 timing 快取（每個字的 start/end） |
| `C:/Users/User/Videos/Captures/01_cut_subs/aligned.json` | 產出 | 修正 timing 後的最終字幕（text 來自 correct.json，timing 來自 words.json） |

---

## Task 1：重寫 make_subs_gpu.py

**Files:**
- Modify: `C:/Users/User/Videos/Captures/make_subs_gpu.py`

- [ ] **Step 1: 移除 sys.stdout wrapper，改用 PYTHONIOENCODING**

Windows terminal 用 cp950，直接包 TextIOWrapper 會讓 subprocess 呼叫出問題（exit code 127）。改成 script 開頭設環境變數。

```python
import os
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
```

- [ ] **Step 2: 修正 transcribe 函式加入正確 GPU 參數**

```python
def transcribe(wav: Path, model_name: str) -> tuple[list[dict], list[dict]]:
    """回傳 (segments, words) 兩份資料"""
    from faster_whisper import WhisperModel
    model = WhisperModel(model_name, device="cuda", compute_type="float16")
    segments_gen, info = model.transcribe(
        str(wav),
        language="zh",
        word_timestamps=True,               # 字詞級 timing
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=300),
        condition_on_previous_text=False,   # 防止錯誤累積 → 修掉 5:12 後 drift
        hallucination_silence_threshold=2.0,# 靜音超過 2s 不產生幻覺字幕
        beam_size=5,
        repetition_penalty=1.1,
    )
    segments, words = [], []
    for seg in segments_gen:
        text = seg.text.strip()
        if not text:
            continue
        segments.append({"text": text, "start": seg.start, "end": seg.end})
        for w in (seg.words or []):
            words.append({"word": w.word.strip(), "start": w.start, "end": w.end})
    return segments, words
```

- [ ] **Step 3: main() 同時存 segments.json 和 words.json**

```python
segs, words = transcribe(wav, model_name)
(out_dir / "segments.json").write_text(
    json.dumps(segs, ensure_ascii=False, indent=2), encoding="utf-8")
(out_dir / "words.json").write_text(
    json.dumps(words, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"segments: {len(segs)}, words: {len(words)}")
```

- [ ] **Step 4: 執行確認有產出 words.json**

```bash
cd "C:/Users/User/Videos/Captures"
python make_subs_gpu.py 01_cut.mp4
```

預期：`01_cut_subs/words.json` 存在，內容類似：
```json
[{"word": "OK", "start": 0.24, "end": 0.52}, ...]
```

---

## Task 2：新增 align_timing.py

**Files:**
- Create: `C:/Users/User/Videos/Captures/align_timing.py`

核心演算法：對 correct.json 每個 segment `[seg_start, seg_end]`，在 words.json 中找落在 `[seg_start - 0.8, seg_end + 0.8]` 範圍內的 words，取第一個 word 的 start 和最後一個 word 的 end 作為新 timing。找不到時 fallback 到原始 timing。

- [ ] **Step 1: 實作 align_timing.py**

```python
import json, subprocess
from pathlib import Path

def align(correct: list[dict], words: list[dict], tolerance: float = 0.8) -> list[dict]:
    """
    將 correct 裡每個 segment 的 timing，
    用 words 中最近的 word 邊界取代，精度從 ~1s 提升到 ~0.05s。
    """
    result = []
    for seg in correct:
        lo = seg["start"] - tolerance
        hi = seg["end"]   + tolerance
        window = [w for w in words if lo <= w["start"] <= hi or lo <= w["end"] <= hi]
        if window:
            new_start = window[0]["start"]
            new_end   = window[-1]["end"]
        else:
            # fallback：保留原始 timing
            new_start = seg["start"]
            new_end   = seg["end"]
        result.append({"text": seg["text"], "start": new_start, "end": new_end})
    return result


def make_ass(timing: list[dict], out_ass: Path):
    ASS_HEADER = """\
[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft JhengHei,56,&H00FFFFFF,&H000000FF,&H00000000,&HAA000000,-1,0,0,0,100,100,0,0,3,3,0,2,80,80,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"""

    def fmt(s):
        return "%d:%02d:%05.2f" % (int(s // 3600), int((s % 3600) // 60), s % 60)

    def wrap(text, n=22):
        if len(text) <= n:
            return text
        mid = len(text) // 2
        for d in range(len(text) // 4):
            for p in [mid + d, mid - d]:
                if 0 < p < len(text) and text[p] in "\uff0c\u3002\uff01\uff1f\u3001 ,":
                    return text[:p+1] + r"\N" + text[p+1:]
        return text[:mid] + r"\N" + text[mid:]

    lines = [ASS_HEADER]
    for seg in timing:
        lines.append(
            "Dialogue: 0,%s,%s,Default,,0,0,0,,{\\fad(150,80)}%s"
            % (fmt(seg["start"]), fmt(seg["end"]), wrap(seg["text"]))
        )
    out_ass.write_text("\n".join(lines), encoding="utf-8-sig")
    print(f"ASS: {len(timing)} lines → {out_ass.name}")


def burn(video: Path, ass: Path, out: Path):
    ass_esc = ass.resolve().as_posix().replace(":", "\\:")
    r = subprocess.run([
        "ffmpeg", "-i", str(video),
        "-vf", f"subtitles='{ass_esc}'",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "copy", str(out), "-y"
    ], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode == 0:
        print(f"done: {out}  {out.stat().st_size // 1024 // 1024}MB")
    else:
        print("ffmpeg error:", r.stderr[-400:])


if __name__ == "__main__":
    import sys
    video    = Path(sys.argv[1])
    out_dir  = video.parent / f"{video.stem}_subs"
    correct  = json.loads((out_dir / "correct.json").read_text(encoding="utf-8"))
    words    = json.loads((out_dir / "words.json").read_text(encoding="utf-8"))

    aligned  = align(correct, words)
    (out_dir / "aligned.json").write_text(
        json.dumps(aligned, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"aligned.json: {len(aligned)} segs")

    # spot-check 5:12 區域
    for s in aligned:
        if 308 <= s["start"] <= 320:
            print(f"  {s['start']:.2f}-{s['end']:.2f}  {s['text']}")

    ass  = out_dir / f"{video.stem}.ass"
    out  = out_dir / f"{video.stem}_final.mp4"
    make_ass(aligned, ass)
    burn(video, ass, out)
```

- [ ] **Step 2: 執行**

```bash
cd "C:/Users/User/Videos/Captures"
python align_timing.py 01_cut.mp4
```

預期輸出：
```
aligned.json: 164 segs
  312.34-314.12  這React跟這個平台是比較緊緊相連的。
  ...
done: 01_cut_subs/01_cut_final.mp4  35MB
```

- [ ] **Step 3: 驗證 timing 精度**

看 aligned.json 前 5 筆 timing 是否從整數（0.0, 6.2）變成小數（0.24, 6.18 之類），確認 word-level 對齊成功。

---

## 執行順序

1. 先跑 Task 1（重跑 make_subs_gpu.py 產出 words.json）
2. 再跑 Task 2（align_timing.py 用 correct.json 文字 + words.json timing 合出最終字幕）

**words.json 只需跑一次**，之後每次調整 correct.json 文字只需重跑 Task 2 的 Step 2，不用重跑 Whisper。
