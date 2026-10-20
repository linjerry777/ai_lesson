"""Render the static Open Graph card (app/opengraph-image.png) from the hero stickers.

    python scripts/build-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ST = ROOT / 'public/stickers'
W, H = 1200, 630
PAPER, INK, RED = (243, 240, 232), (18, 18, 18), (255, 59, 48)
COLORS = ['#2747ff', '#ff5d8f', '#f5a524', '#d97757']

heavy = ImageFont.truetype('C:/Windows/Fonts/NotoSansTC-VF.ttf', 78)
heavy.set_variation_by_name('Black')
mono = ImageFont.truetype('C:/Windows/Fonts/bahnschrift.ttf', 22)
logo = ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 44)

img = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(img)
d.text((64, 50), 'JERRY', font=logo, fill=INK)
x = 64 + d.textlength('JERRY', font=logo)
d.text((x, 50), '.', font=logo, fill=RED)
d.text((x + d.textlength('.', font=logo), 50), 'AI', font=logo, fill=INK)
d.rounded_rectangle((250, 56, 372, 92), 18, fill=RED)
d.ellipse((266, 69, 276, 79), fill='white')
d.text((286, 61), 'ON AIR', font=mono, fill='white')

y = 185
for line, accent in [('兩個 AI 幫我開播，', None), ('只有一個', (0, 4, '#ff4a1c')), ('還醒著。', None)]:
    cx = 64
    for i, ch in enumerate(line):
        color = accent[2] if accent and accent[0] <= i < accent[1] else INK
        d.text((cx, y), ch, font=heavy, fill=color)
        cx += d.textlength(ch, font=heavy) * 0.94
    y += 92

for i, c in enumerate(COLORS):
    d.rectangle((64 + i * 34, 540, 64 + i * 34 + 26, 556), fill=c)
d.text((256, 534), 'CLAUDE vs CODEX', font=mono, fill=(74, 71, 64))

# Codex's corner: a powered-off monitor card.
cx0, cy0 = 990, 360
codex = Image.new('RGBA', (200, 180), (0, 0, 0, 0))
cd = ImageDraw.Draw(codex)
cd.rounded_rectangle((0, 0, 199, 179), 16, fill=(38, 40, 44), outline='white', width=6)
cd.rounded_rectangle((18, 18, 181, 128), 8, fill=(22, 24, 27))
cd.text((100, 73), 'NO SIGNAL', font=ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 26), fill=(138, 143, 152), anchor='mm')
cd.text((100, 154), 'CODEX  OFF AIR', font=mono, fill=(201, 204, 210), anchor='mm')
codex = codex.rotate(9, expand=True, resample=Image.BICUBIC)
img.paste(codex, (cx0, cy0), codex)

pile = [('mochi', 860, 40, 200, 5, False), ('xun', 690, 110, 220, -6, False), ('nailao', 830, 280, 175, -3, False)]
for name, px, py, w, r, mirror in pile:
    s = Image.open(ST / f'{name}.webp').convert('RGBA')
    if mirror:
        s = s.transpose(Image.FLIP_LEFT_RIGHT)
    s = s.resize((w, round(s.height * w / s.width)), Image.LANCZOS).rotate(r, expand=True, resample=Image.BICUBIC)
    shadow = Image.new('RGBA', s.size, (40, 30, 12, 0))
    shadow.putalpha(s.getchannel('A').point(lambda a: a * 0.22))
    img.paste(shadow, (px + 6, py + 8), shadow)
    img.paste(s, (px, py), s)

img.save(ROOT / 'app/opengraph-image.png', optimize=True)
print('ok', img.size)
