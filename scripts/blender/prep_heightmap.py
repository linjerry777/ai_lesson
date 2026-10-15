"""Silhouette → height map for the Blender statue builder.

    python scripts/blender/prep_heightmap.py <sprite.png> <out_dir> [rows]

Writes <out_dir>/height.npy (rows x cols, 0 outside the silhouette, pillow-shaped
inside) and <out_dir>/texture.png (the sprite, used as the statue's skin).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

src, out = Path(sys.argv[1]), Path(sys.argv[2])
rows = int(sys.argv[3]) if len(sys.argv) > 3 else 120
out.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert("RGBA")
img.save(out / "texture.png")
cols = round(rows * img.width / img.height)
alpha = np.asarray(img.resize((cols, rows), Image.LANCZOS).getchannel("A")).astype(np.float32) / 255
mask = ndimage.binary_opening(alpha > 0.5, iterations=1)
# Keep only the largest piece so stray specks don't become floating islands.
labels, n = ndimage.label(mask)
if n > 1:
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    mask = labels == (1 + int(np.argmax(sizes)))
mask = ndimage.binary_fill_holes(mask)
dist = ndimage.distance_transform_edt(mask)
height = np.sqrt(dist / dist.max()) * mask
np.save(out / "height.npy", height.astype(np.float32))
print(f"{src.name}: {cols}x{rows}, {int(mask.sum())} cells")
