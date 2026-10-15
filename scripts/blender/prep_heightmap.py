"""Silhouette → height map + clean textures for the Blender statue builder.

    python scripts/blender/prep_heightmap.py <sprite.png> <out_dir> [rows] [border_px]

Writes into <out_dir>:
  height.npy   rows x cols, 0 outside the silhouette, rounded volume inside
  texture.png  the sprite with its white sticker border trimmed and the edge
               colours bled outward, so the statue's rim never samples white
  normal.png   tangent-space normal map from the art's shading and line work,
               which gives hair, folds and outlines raised/recessed detail
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

src, out = Path(sys.argv[1]), Path(sys.argv[2])
rows = int(sys.argv[3]) if len(sys.argv) > 3 else 180
border = int(sys.argv[4]) if len(sys.argv) > 4 else 9
out.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert("RGBA")
rgba = np.asarray(img).astype(np.float32) / 255
alpha = rgba[..., 3]

# 1. Trim the sticker outline: erode the full-res mask by the border width.
mask = ndimage.binary_erosion(alpha > 0.5, iterations=border)
labels, n = ndimage.label(mask)
if n > 1:
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    mask = labels == (1 + int(np.argmax(sizes)))
mask = ndimage.binary_fill_holes(mask)
mask = ndimage.binary_opening(mask, iterations=2)  # knock off hairline spikes

# 2. Bleed edge colours outward so UVs on the rim always land on real colour.
_, (iy, ix) = ndimage.distance_transform_edt(~mask, return_indices=True)
rgb = rgba[..., :3][iy, ix]
Image.fromarray((np.dstack([rgb, np.ones_like(alpha)]) * 255).astype(np.uint8)).save(out / "texture.png")

# 3. Normal map: blurred luminance as a relief, ink lines pressed in.
lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
relief = ndimage.gaussian_filter(lum, 2.2) * 0.8 + ndimage.gaussian_filter(lum, 6) * 0.6
ink = ndimage.gaussian_filter((lum < 0.22).astype(np.float32), 1.2)
relief = (relief - ink * 0.9) * mask
gy, gx = np.gradient(ndimage.gaussian_filter(relief, 1.0))
strength = 6.0
nx, ny, nz = -gx * strength, gy * strength, np.ones_like(gx)
length = np.sqrt(nx * nx + ny * ny + nz * nz)
normal = np.dstack([nx / length, ny / length, nz / length]) * 0.5 + 0.5
Image.fromarray((normal * 255).astype(np.uint8)).save(out / "normal.png")

# 4. Height map for the geometry, from the cleaned mask.
cols = round(rows * img.width / img.height)
small = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).resize((cols, rows), Image.LANCZOS)) > 127
small = ndimage.binary_fill_holes(small)
dist = ndimage.distance_transform_edt(small)
height = (dist / dist.max()) ** 0.42 * small  # fuller, rounder cross-section
np.save(out / "height.npy", height.astype(np.float32))
print(f"{src.name}: {cols}x{rows}, {int(small.sum())} cells, border {border}px trimmed")
