"""Turn 2D character art (and a few procedural shapes) into particle clouds for /lab.

Every shape gets the same number of particles so the scene can morph any
shape into any other. Output per shape (little-endian):
  int16 x, y, z  (normalised to ±32767 over SCALE world units)
  uint8 r, g, b
packed as 9 bytes per particle into public/lab/particles/<name>.bin

    python scripts/build-particles.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

COUNT = 28000
SCALE = 4.0  # int16 range maps to ±SCALE world units
HEIGHT = 3.2  # characters are this tall in world units
ROOT = Path(__file__).resolve().parents[1]
AUTOVIDEO = ROOT.parent / "AutoVideo"
OUT = ROOT / "public" / "lab" / "particles"
rng = np.random.default_rng(7)


def from_rgba(img: Image.Image, height=HEIGHT, thickness=0.55, trim=6):
    """Sample particles inside the alpha mask; depth bulges with distance to the edge.

    `trim` erodes the sticker's white outline so silhouettes read against the fog.
    """
    img = img.convert("RGBA")
    img.thumbnail((700, 700))
    rgba = np.asarray(img).astype(np.float32) / 255
    alpha = rgba[..., 3]
    mask = alpha > 0.5
    if trim:
        mask = ndimage.binary_erosion(mask, iterations=trim)
    dist = ndimage.distance_transform_edt(mask)
    depth = np.sqrt(dist / max(dist.max(), 1))  # rounded, pillow-like volume
    ys, xs = np.nonzero(mask)
    # Edges get extra weight so silhouettes stay crisp.
    edge = (ndimage.binary_dilation(~mask, iterations=2) & mask)[ys, xs]
    weight = np.where(edge, 3.0, 1.0)
    pick = rng.choice(len(xs), COUNT, p=weight / weight.sum())
    x, y = xs[pick] + rng.random(COUNT), ys[pick] + rng.random(COUNT)
    h, w = mask.shape
    unit = height / h
    px = (x - w / 2) * unit
    py = (h / 2 - y) * unit
    d = depth[ys[pick], xs[pick]]
    pz = (rng.random(COUNT) * 2 - 1) * d * thickness  # fill the volume front-to-back
    colors = rgba[ys[pick], xs[pick], :3]
    # Pastel art washes out as particles over grey fog: add contrast and saturation.
    gray = colors.mean(1, keepdims=True)
    colors = np.clip(gray + (colors - gray) * 1.35, 0, 1) ** 1.25
    return np.stack([px, py, pz], 1), colors


def text_shape(text: str, font_path: str, color=(0.92, 0.94, 0.97)):
    font = ImageFont.truetype(font_path, 220)
    left, top, right, bottom = font.getbbox(text)
    img = Image.new("RGBA", (right - left + 40, bottom - top + 40), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((20 - left, 20 - top), text, font=font, fill=(255, 255, 255, 255))
    pos, _ = from_rgba(img, height=1.1, thickness=0.25, trim=0)
    return pos, np.tile(np.array(color, np.float32), (COUNT, 1))


def workflow_shape():
    """Five glowing nodes on a gentle arc joined by a flowing line."""
    nodes = np.array([[-2.6, -0.3], [-1.3, 0.35], [0.0, 0.55], [1.3, 0.35], [2.6, -0.3]])
    palette = np.array([[0.95, 0.66, 0.3], [0.45, 0.8, 0.85], [0.95, 0.55, 0.6], [0.7, 0.75, 0.95], [0.6, 0.85, 0.6]])
    n_line = COUNT // 3
    n_node = (COUNT - n_line) // 5
    pos, col = [], []
    for i, (cx, cy) in enumerate(nodes):
        u = rng.normal(size=(n_node, 3))
        u /= np.linalg.norm(u, axis=1, keepdims=True)
        r = 0.42 * np.cbrt(rng.random((n_node, 1)))
        p = u * r + [cx, cy, 0]
        pos.append(p)
        col.append(np.tile(palette[i], (n_node, 1)) * (0.8 + 0.2 * rng.random((n_node, 1))))
    t = rng.random(COUNT - n_node * 5)
    seg = np.minimum((t * 4).astype(int), 3)
    f = t * 4 - seg
    a, b = nodes[seg], nodes[seg + 1]
    line = a + (b - a) * f[:, None]
    jitter = rng.normal(scale=0.03, size=(len(t), 3))
    pos.append(np.c_[line, np.zeros(len(t))] + jitter)
    col.append(np.tile([0.9, 0.92, 0.96], (len(t), 1)))
    return np.concatenate(pos), np.concatenate(col)


def save(name: str, pos: np.ndarray, col: np.ndarray):
    assert len(pos) == COUNT and len(col) == COUNT, name
    order = rng.permutation(COUNT)  # shuffle so morphs scatter evenly
    pos, col = pos[order], col[order]
    q = np.clip(np.round(pos / SCALE * 32767), -32767, 32767).astype("<i2")
    c = np.clip(np.round(col * 255), 0, 255).astype(np.uint8)
    packed = np.zeros(COUNT, dtype=[("p", "<i2", 3), ("c", "u1", 3)])
    packed["p"], packed["c"] = q, c
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{name}.bin").write_bytes(packed.tobytes())
    print(f"{name}: {(OUT / f'{name}.bin').stat().st_size // 1024} KB")


if __name__ == "__main__":
    sprites = AUTOVIDEO / "studio" / "remotion" / "public" / "sprites"
    save("logo", *text_shape("JERRY.AI", r"C:\Windows\Fonts\bahnschrift.ttf"))
    save("xun", *from_rgba(Image.open(sprites / "xun-happy.png")))
    save("mochi", *from_rgba(Image.open(sprites / "mochi-hello.png")))
    save("doro", *from_rgba(Image.open(AUTOVIDEO / "assets" / "brand" / "mascot.png"), height=2.8))
    save("workflow", *workflow_shape())
    save("mochi_love", *from_rgba(Image.open(sprites / "mochi-love.png")))
    save("box", *from_rgba(Image.open(ROOT / "public" / "popup" / "shop_box.webp"), height=2.8, thickness=0.6, trim=2))
    save("xun_thumbsup", *from_rgba(Image.open(sprites / "xun-thumbsup.png")))
