"""Build die-cut sticker images (transparent, thick white border) for the homepage.

    python scripts/build-stickers.py [name ...]

Sources live outside this repo (AutoVideo sprites / character sheets / cat photos);
outputs go to public/stickers/<name>.webp. Requires pillow, scipy, rembg.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
GH = ROOT.parent
AV = GH / 'AutoVideo'
SPR = AV / 'studio/remotion/public/sprites'
OUT = ROOT / 'public/stickers'

# name: (source, crop box or None, background removal: False | True (rembg) | 'flood' (white sheet))
STICKERS = {
    'xun': (SPR / 'xun-happy.png', None, False),
    'xun-explain': (SPR / 'xun-explain.png', None, False),
    'xun-thumbsup': (SPR / 'xun-thumbsup.png', None, False),
    'mochi': (SPR / 'mochi-hello.png', None, False),
    'mochi-love': (SPR / 'mochi-love.png', None, False),
    'mochi-popcorn': (SPR / 'mochi-popcorn.png', None, False),
    'doro': (AV / 'assets/brand/mascot.png', None, True),
    'nailao': (AV / '.codex_tmp/cat-character-study/cat-source-contact-sheet.jpg', (606, 625, 1026, 1185), True),
}

MAX_H = 760


def remove_bg(img: Image.Image) -> Image.Image:
    from rembg import remove
    return remove(img.convert('RGB'))


def flood_white(img: Image.Image) -> Image.Image:
    """Line-art on a white sheet: clear near-white pixels connected to the border."""
    rgb = np.array(img.convert('RGB')).astype(int)
    light = (rgb.min(axis=2) > 225) & (rgb.max(axis=2) - rgb.min(axis=2) < 18)
    labels, _ = ndimage.label(light)
    edge = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    bg = np.isin(labels, list(edge))
    out = img.convert('RGBA')
    out.putalpha(Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)))
    return out


def largest_component(alpha: np.ndarray) -> np.ndarray:
    mask = alpha > 40
    labels, count = ndimage.label(mask)
    if count <= 1:
        return alpha
    sizes = ndimage.sum(mask, labels, range(1, count + 1))
    keep = labels == (int(np.argmax(sizes)) + 1)
    keep = ndimage.binary_fill_holes(keep)
    return np.where(keep, alpha, 0).astype(np.uint8)


def sticker(name: str) -> None:
    src, box, rembg = STICKERS[name]
    img = Image.open(src).convert('RGBA')
    if box:
        img = img.crop(box)
    if rembg == 'flood':
        img = flood_white(img)
    elif rembg:
        img = remove_bg(img).convert('RGBA')
    a = largest_component(np.array(img)[:, :, 3])
    img.putalpha(Image.fromarray(a))
    img = img.crop(img.getbbox())
    scale = min(1.0, MAX_H / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)

    border = max(10, round(img.height * 0.028))
    pad = border + 4
    canvas = Image.new('RGBA', (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    canvas.alpha_composite(img, (pad, pad))
    alpha = np.array(canvas)[:, :, 3] > 90
    alpha = ndimage.binary_fill_holes(alpha)
    yy, xx = np.ogrid[-border:border + 1, -border:border + 1]
    disk = xx * xx + yy * yy <= border * border
    outline = ndimage.binary_dilation(alpha, structure=disk)
    outline = ndimage.binary_closing(outline, structure=disk)
    white = Image.new('RGBA', canvas.size, (255, 255, 255, 0))
    white.putalpha(Image.fromarray((outline * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)))
    white.alpha_composite(canvas)
    OUT.mkdir(parents=True, exist_ok=True)
    white.save(OUT / f'{name}.webp', 'WEBP', quality=86, method=6)
    print(name, white.size)


if __name__ == '__main__':
    for n in sys.argv[1:] or list(STICKERS):
        sticker(n)
