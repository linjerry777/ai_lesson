'use client'


import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { assembleAmount, shatterAmount } from '@/lib/statue'

interface Fragment {
  mesh: THREE.Object3D
  base: THREE.Vector3
  baseQuat: THREE.Quaternion
  dir: THREE.Vector3
  distance: number
  axis: THREE.Vector3
  angle: number
  order: number
}

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/** Glazed skin outside, icy cut faces inside — the look of a cracked figurine. */
function useFragments(url: string, crackFrom: THREE.Vector3) {
  const { scene } = useGLTF(url)
  return useMemo(() => {
    const root = scene.clone(true)
    const fragments: Fragment[] = []
    const ice = new THREE.MeshPhysicalMaterial({
      color: '#e4ecf6', roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08,
      emissive: '#c9daf2', emissiveIntensity: 0.18, sheen: 0.4, sheenColor: '#ffffff',
    })
    const skins = new Map<THREE.Material, THREE.Material>()
    root.traverse(obj => {
      if (!(obj instanceof THREE.Mesh)) return
      // glTF splits a two-material object into one sub-mesh per material.
      const source = obj.material as THREE.MeshStandardMaterial
      if (source.name === 'core') { obj.material = ice; return }
      if (!skins.has(source)) {
        skins.set(source, new THREE.MeshPhysicalMaterial({
          map: source.map, normalMap: source.normalMap, normalScale: new THREE.Vector2(1.1, 1.1),
          roughness: 0.38, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18,
          clearcoatNormalMap: source.normalMap, clearcoatNormalScale: new THREE.Vector2(0.5, 0.5),
        }))
      }
      obj.material = skins.get(source)!
    })
    // Each top-level node is one fragment (a Mesh, or a Group of its sub-meshes).
    const nodes = [...root.children]
    const maxDist = Math.max(...nodes.map(n => n.position.distanceTo(crackFrom)), 1)
    nodes.forEach((obj, index) => {
      const i = index + 1
      const outward = obj.position.clone().setY(obj.position.y * 0.6)
      const dir = outward.lengthSq() > 1e-4 ? outward.normalize() : new THREE.Vector3(0, 1, 0)
      dir.add(new THREE.Vector3(rand(i) - 0.5, rand(i + 1) - 0.3, rand(i + 2) * 1.4 - 0.2)).normalize()
      fragments.push({
        mesh: obj,
        base: obj.position.clone(),
        baseQuat: obj.quaternion.clone(),
        dir,
        distance: 1.1 + rand(i + 3) * 2.1,
        axis: new THREE.Vector3(rand(i + 4) - 0.5, rand(i + 5) - 0.5, rand(i + 6) - 0.5).normalize(),
        angle: (1.5 + rand(i + 7) * 3.5) * Math.PI,
        // Cracks spread from one point, so nearby fragments go first.
        order: obj.position.distanceTo(crackFrom) / maxDist,
      })
    })
    return { root, fragments }
  }, [scene, crackFrom])
}

const spin = new THREE.Quaternion()

function animate(fragments: Fragment[], amount: (order: number) => number) {
  let anyVisible = false
  for (const f of fragments) {
    const t = amount(f.order)
    const e = 1 - Math.pow(1 - t, 3)
    f.mesh.position.copy(f.base).addScaledVector(f.dir, f.distance * e)
    spin.setFromAxisAngle(f.axis, f.angle * e)
    f.mesh.quaternion.copy(f.baseQuat).premultiply(spin)
    const s = 1 - t * 0.35
    f.mesh.scale.setScalar(s)
    f.mesh.visible = t < 0.985
    anyVisible ||= f.mesh.visible
  }
  return anyVisible
}

interface Props {
  progress: { readonly current: { g: number } }
  offsetX: number
}

const CRACK_A = new THREE.Vector3(0.6, 1.0, 0.2)
const CRACK_B = new THREE.Vector3(-0.4, -0.6, 0.2)

export default function StatueScene({ progress, offsetX }: Props) {
  const first = useFragments('/lab/statues/xun.glb', CRACK_A)
  const second = useFragments('/lab/statues/mochi.glb', CRACK_B)
  const stage = useRef<THREE.Group>(null)
  const a = useRef<THREE.Group>(null)
  const b = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = progress.current.g
    if (a.current) a.current.visible = animate(first.fragments, order => shatterAmount(g, order))
    if (b.current) b.current.visible = animate(second.fragments, order => assembleAmount(g, order))
    if (stage.current) {
      const k = Math.min(1, delta * 2.5)
      // Swing wide enough that the statue's thickness and side light read clearly.
      const targetY = Math.sin(state.clock.elapsedTime * 0.35) * 0.42 + state.pointer.x * 0.6
      stage.current.rotation.y += (targetY - stage.current.rotation.y) * k
      stage.current.rotation.x += (-state.pointer.y * 0.12 - stage.current.rotation.x) * k
      const x = g < 0.5 ? -offsetX : offsetX
      stage.current.position.x += (x - stage.current.position.x) * Math.min(1, delta * 1.5)
    }
  })

  return (
    <>
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-3, 4, 4]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#dbe6ff" position={[4, 1, 3]} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, -3, 5]} scale={3} />
        <Lightformer form="rect" intensity={0.8} color="#c7d2e3" position={[0, 0, -6]} scale={[12, 8, 1]} />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 5, 6]} intensity={1.6} color="#fff6ea" />
      <group ref={stage}>
        <group ref={a}><primitive object={first.root} /></group>
        <group ref={b}><primitive object={second.root} /></group>
      </group>
    </>
  )
}

useGLTF.preload('/lab/statues/xun.glb')
useGLTF.preload('/lab/statues/mochi.glb')
