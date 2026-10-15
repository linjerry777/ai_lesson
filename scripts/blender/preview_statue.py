"""Render a quick look at a fractured statue GLB: assembled and exploded side by side.

    blender -b --factory-startup --python scripts/blender/preview_statue.py -- <in.glb> <out.png> [explode=0.6]
"""
import math
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
src, out = args[0], args[1]
explode = float(args[2]) if len(args) > 2 else 0.6

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
pieces = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for o in pieces:
    o.location += o.location.normalized() * explode * (0.6 + o.location.length) + Vector((0, 0, 0))
    o.rotation_euler.rotate_axis("X", explode * math.sin(hash(o.name) % 7))

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
scene.render.resolution_x, scene.render.resolution_y = 900, 1100
scene.world = bpy.data.worlds.new("w")
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.6, 0.63, 0.68, 1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value = 0.9

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
scene.collection.objects.link(cam)
cam.location = (2.6, -8.5, 0.8)
direction = Vector((0, 0, 0)) - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
scene.camera = cam
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
sun.data.energy = 3.5
sun.rotation_euler = (math.radians(50), math.radians(-30), math.radians(-20))
scene.collection.objects.link(sun)
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("PREVIEW", out)
