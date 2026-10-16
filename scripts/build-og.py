"""Render the static Open Graph card (app/opengraph-image.png) from the hero stickers.

    python scripts/build-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ST = ROOT / 'public/stickers'
W, H = 1200, 630
PAPER, INK, RED = (243, 240, 232), (18, 18, 18), (255, 59, 48)
COLORS = ['#2747ff', '#0e9f6e', '#ff5d8f', '#ff4a1c', '#f5a524']

heavy = ImageFont.truetype('C:/Windows/Fonts/NotoSansTC-VF.ttf', 92)
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

y = 170
for line, accent in [('一個人，', None), ('五個頻道，', (0, 2, '#ff5d8f')), ('每天自動開播。', (2, 4, '#ff4a1c'))]:
    cx = 64
    for i, ch in enumerate(line):
        color = accent[2] if accent and accent[0] <= i < accent[1] else INK
        d.text((cx, y), ch, font=heavy, fill=color)
        cx += d.textlength(ch, font=heavy) * 0.94
    y += 106

for i, c in enumerate(COLORS):
    d.rectangle((64 + i * 34, 540, 64 + i * 34 + 26, 556), fill=c)
d.text((256, 534), 'FIVE CHANNELS · 24H ON AIR', font=mono, fill=(74, 71, 64))

pile = [('mochi', 850, 40, 190, 5, False), ('doro', 1000, 70, 180, 8, False), ('xun', 660, 90, 220, -6, False),
        ('doro', 980, 320, 190, -7, True), ('nailao', 830, 260, 170, -3, False)]
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
