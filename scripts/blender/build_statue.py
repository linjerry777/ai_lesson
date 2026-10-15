"""Blender: height map → solid statue → Voronoi fracture → GLB.

    blender -b --factory-startup --python scripts/blender/build_statue.py -- \
        <work_dir> <out.glb> [pieces=140] [height=3.2] [thickness=0.32]

<work_dir> must contain height.npy and texture.png from prep_heightmap.py.
Every fragment is its own mesh with its origin at its own centre, so the web
page can fly pieces apart and back. Material 0 "skin" is the sprite on the
outside; material 1 "core" marks the freshly cut faces inside.
"""
import random
import sys
from pathlib import Path

import bmesh
import bpy
import numpy as np
from mathutils import Vector
from mathutils.kdtree import KDTree

args = sys.argv[sys.argv.index("--") + 1:]
work, out = Path(args[0]), Path(args[1])
PIECES = int(args[2]) if len(args) > 2 else 140
HEIGHT = float(args[3]) if len(args) > 3 else 3.2
THICK = float(args[4]) if len(args) > 4 else 0.32
random.seed(11)

height = np.load(work / "height.npy")
rows, cols = height.shape
inside = height > 0
cell = HEIGHT / rows


def corner_depth():
    """Depth at pixel corners; corners touching the outside are pinned to 0 so front and back meet."""
    padded = np.pad(height, 1)
    quad = np.stack([padded[:-1, :-1], padded[:-1, 1:], padded[1:, :-1], padded[1:, 1:]])
    depth = quad.mean(0)
    edge = (quad == 0).any(0)
    depth[edge] = 0
    return depth  # (rows+1, cols+1)


def build_base():
    depth = corner_depth()
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    verts = {}

    def vert(r, c, side):
        key = (r, c, side if depth[r, c] > 0 else 0)
        if key not in verts:
            # Blender is Z-up and looks along +Y from the front: figure up = Z, front bulges toward -Y.
            y = -depth[r, c] * THICK * side
            verts[key] = bm.verts.new(((c - cols / 2) * cell, y, (rows / 2 - r) * cell))
        return verts[key]

    for r in range(rows):
        for c in range(cols):
            # Skip cells whose four corners are all on the rim: they'd be zero-thickness slivers.
            if not inside[r, c] or not depth[r:r + 2, c:c + 2].any():
                continue
            for side in (1, -1):
                quad = [vert(r, c, side), vert(r, c + 1, side), vert(r + 1, c + 1, side), vert(r + 1, c, side)]
                if side == -1:
                    quad.reverse()
                if len(set(quad)) < 4 or bm.faces.get(quad):
                    continue
                face = bm.faces.new(quad)
                face.material_index = 0
                for loop in face.loops:
                    co = loop.vert.co
                    loop[uv].uv = (co.x / (cols * cell) + 0.5, co.z / (rows * cell) + 0.5)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=cell * 0.01)
    # Round off the pixel staircase along the silhouette (rim verts move in-plane only).
    rim = [v for v in bm.verts if abs(v.co.y) < 1e-6]
    for _ in range(6):
        bmesh.ops.smooth_vert(bm, verts=rim, factor=0.5, use_axis_x=True, use_axis_y=False, use_axis_z=True)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def seeds():
    ys, xs = np.nonzero(inside)
    pick = np.random.default_rng(5).choice(len(xs), PIECES, replace=False)
    pts = []
    for i in pick:
        r, c = ys[i], xs[i]
        y = (random.random() * 2 - 1) * height[r, c] * THICK * 0.5
        pts.append(Vector(((c + 0.5 - cols / 2) * cell, y, (rows / 2 - r - 0.5) * cell)))
    return pts


def fracture(base: bmesh.types.BMesh, points):
    tree = KDTree(len(points))
    for i, p in enumerate(points):
        tree.insert(p, i)
    tree.balance()
    pieces = []
    for i, p in enumerate(points):
        bm = base.copy()
        for q, j, _ in tree.find_n(p, 16):
            if j == i:
                continue
            normal = (q - p).normalized()
            mid = (p + q) / 2
            geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
            result = bmesh.ops.bisect_plane(bm, geom=geom, plane_co=mid, plane_no=normal, clear_outer=True)
            cut = [e for e in result["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
            if cut:
                filled = bmesh.ops.holes_fill(bm, edges=cut, sides=0)
                for f in filled["faces"]:
                    f.material_index = 1
            if not bm.faces:
                break
        if len(bm.faces) >= 4:
            pieces.append(bm)
        else:
            bm.free()
    return pieces


def materials():
    skin = bpy.data.materials.new("skin")
    skin.use_nodes = True
    nodes = skin.node_tree.nodes
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(work / "texture.png"))
    skin.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.35
    core = bpy.data.materials.new("core")
    core.use_nodes = True
    core.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.86, 0.9, 0.95, 1)
    core.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.2
    return skin, core


bpy.ops.wm.read_factory_settings(use_empty=True)
skin, core = materials()
base = build_base()
pieces = fracture(base, seeds())
for k, bm in enumerate(pieces):
    mesh = bpy.data.meshes.new(f"piece_{k:03d}")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(skin)
    mesh.materials.append(core)
    obj = bpy.data.objects.new(mesh.name, mesh)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.select_set(False)
    for poly in mesh.polygons:
        poly.use_smooth = poly.material_index == 0
base.free()

out.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(out), export_format="GLB", export_image_format="WEBP", export_apply=True,
                          export_yup=True, export_draco_mesh_compression_enable=False)
print(f"STATUE {out.name}: {len(pieces)} pieces")
