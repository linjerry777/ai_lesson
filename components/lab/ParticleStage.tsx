'use client'

// three.js buffers and uniforms are mutated imperatively inside useFrame by design.
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sectionState } from '@/lib/lab'

export const PARTICLES = 28000
const SCALE = 4 // must match scripts/build-particles.py

export interface Shape { positions: Int16Array; colors: Uint8Array }

/** Unpack the 9-byte-per-particle files written by scripts/build-particles.py. */
export async function loadShape(url: string): Promise<Shape> {
  const buffer = await (await fetch(url)).arrayBuffer()
  const view = new DataView(buffer)
  const positions = new Int16Array(PARTICLES * 3)
  const colors = new Uint8Array(PARTICLES * 3)
  for (let i = 0; i < PARTICLES; i++) {
    const o = i * 9
    positions[i * 3] = view.getInt16(o, true)
    positions[i * 3 + 1] = view.getInt16(o + 2, true)
    positions[i * 3 + 2] = view.getInt16(o + 4, true)
    colors[i * 3] = view.getUint8(o + 6)
    colors[i * 3 + 1] = view.getUint8(o + 7)
    colors[i * 3 + 2] = view.getUint8(o + 8)
  }
  return { positions, colors }
}

const vertexShader = /* glsl */ `
  attribute vec3 aPosB;
  attribute vec3 aColA;
  attribute vec3 aColB;
  attribute float aSeed;
  uniform float uMorph;
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform vec3 uPointer;
  uniform float uPointerForce;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.7, n + 3.1)) * vec3(43758.5453, 22578.1459, 19642.3490)) * 2.0 - 1.0;
  }

  void main() {
    vec3 a = position * uScale;
    vec3 b = aPosB * uScale;
    // Each particle leaves at a slightly different time, so the figure crumbles.
    float t = clamp((uMorph - aSeed * 0.35) / 0.65, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(a, b, e);
    // Scatter outward and swirl while in flight.
    float flight = sin(3.14159 * t);
    vec3 dir = normalize(hash3(aSeed * 917.0) + vec3(0.0, 0.25, 0.0));
    p += dir * flight * (0.7 + aSeed * 1.3);
    float ang = flight * (aSeed - 0.5) * 2.2;
    p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
    // Idle shimmer.
    p += hash3(aSeed * 311.0) * 0.012 * sin(uTime * (1.5 + aSeed) + aSeed * 40.0);
    // The pointer pushes particles away; they drift back on their own.
    vec3 away = p - uPointer;
    float d = length(away);
    p += normalize(away + 1e-4) * uPointerForce * smoothstep(0.85, 0.0, d) * 0.55;

    vColor = mix(aColA, aColB, e);
    vAlpha = 1.0 - flight * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.7 + aSeed * 0.6) * (1.0 + flight * 0.6) / -mv.z;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.32, r);
    // Light from the upper left gives each dot a little volume.
    float shade = 0.78 + 0.34 * dot(normalize(vec2(-0.6, 0.6)), c * 2.0);
    gl_FragColor = vec4(vColor * shade, soft * vAlpha);
  }
`

/** Where each figure sits: x offset (world units) and scale, so it clears the side panel. */
export interface Placement { x: number; y: number; scale: number }

interface Props {
  shapes: Shape[]
  placements: Placement[]
  progress: { readonly current: { g: number } }
}

export default function ParticleStage({ shapes, placements, progress }: Props) {
  const group = useRef<THREE.Group>(null)
  const current = useRef(-1)
  const { camera, raycaster, gl, size } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const pointer = useRef({ x: 0, y: 0, force: 0, moved: 0 })

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const posA = new THREE.Int16BufferAttribute(new Int16Array(PARTICLES * 3), 3, true)
    const posB = new THREE.Int16BufferAttribute(new Int16Array(PARTICLES * 3), 3, true)
    const colA = new THREE.Uint8BufferAttribute(new Uint8Array(PARTICLES * 3), 3, true)
    const colB = new THREE.Uint8BufferAttribute(new Uint8Array(PARTICLES * 3), 3, true)
    const seed = new Float32Array(PARTICLES)
    for (let i = 0; i < PARTICLES; i++) seed[i] = ((i * 2654435761) % 1000003) / 1000003
    geometry.setAttribute('position', posA)
    geometry.setAttribute('aPosB', posB)
    geometry.setAttribute('aColA', colA)
    geometry.setAttribute('aColB', colB)
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uScale: { value: SCALE },
        uSize: { value: 46 },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uPointerForce: { value: 0 },
      },
    })
    return { geometry, material }
  }, [])

  useEffect(() => {
    material.uniforms.uSize.value = 46 * Math.min(gl.getPixelRatio(), 2) * (size.width < 760 ? 0.8 : 1)
  }, [gl, material, size.width])

  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])

  function load(index: number) {
    const a = shapes[Math.min(index, shapes.length - 1)]
    const b = shapes[Math.min(index + 1, shapes.length - 1)]
    ;(geometry.attributes.position.array as Int16Array).set(a.positions)
    ;(geometry.attributes.aPosB.array as Int16Array).set(b.positions)
    ;(geometry.attributes.aColA.array as Uint8Array).set(a.colors)
    ;(geometry.attributes.aColB.array as Uint8Array).set(b.colors)
    for (const name of ['position', 'aPosB', 'aColA', 'aColB']) geometry.attributes[name].needsUpdate = true
  }

  useFrame((state, delta) => {
    const { index, morph } = sectionState(progress.current.g, shapes.length)
    if (index !== current.current) { load(index); current.current = index }
    material.uniforms.uMorph.value = morph
    material.uniforms.uTime.value = state.clock.elapsedTime

    // Pointer: project onto the figure's plane; force fades when the mouse rests.
    const p = pointer.current
    const moved = Math.abs(state.pointer.x - p.x) + Math.abs(state.pointer.y - p.y)
    p.x = state.pointer.x; p.y = state.pointer.y
    p.force += ((moved > 0.0005 ? 1 : 0) - p.force) * Math.min(1, delta * (moved > 0.0005 ? 10 : 1.4))
    raycaster.setFromCamera(state.pointer, camera)
    if (raycaster.ray.intersectPlane(plane, hit) && group.current) {
      material.uniforms.uPointer.value.copy(group.current.worldToLocal(hit.clone()))
    }
    material.uniforms.uPointerForce.value = p.force

    if (group.current) {
      const from = placements[index], to = placements[Math.min(index + 1, placements.length - 1)]
      const x = from.x + (to.x - from.x) * morph
      const y = from.y + (to.y - from.y) * morph
      const scale = from.scale + (to.scale - from.scale) * morph
      group.current.position.x += (x - group.current.position.x) * Math.min(1, delta * 4)
      group.current.position.y += (y - group.current.position.y) * Math.min(1, delta * 4)
      group.current.scale.setScalar(scale)
      // Slow turn so the depth reads, plus a lean toward the pointer.
      const targetY = Math.sin(state.clock.elapsedTime * 0.25) * 0.35 + state.pointer.x * 0.45
      group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2)
      group.current.rotation.x += (-state.pointer.y * 0.12 - group.current.rotation.x) * Math.min(1, delta * 2)
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}
