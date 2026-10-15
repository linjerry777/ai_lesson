'use client'

// three.js objects (textures, geometries, camera) are mutated imperatively inside
// useFrame by design; React never re-renders from those mutations.
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { cameraAt, channelsLift, coverLift, flipAngle, freeLift, layerPlacement, SPREAD } from '@/lib/book3d'

export interface SceneLayer {
  src: string
  x: number
  depth: number
  width: number
  standee?: boolean
}

export interface ChannelClip {
  name: string
  tagline: string
  /** Base path without extension: `${clip}.mp4`, `${clip}.webm` and `${clip}.jpg` must exist. */
  clip: string
  x: number
  depth: number
}

/** Shared, mutable progress so scroll never triggers React renders. */
export interface Timeline { g: number; introStart: number }

interface Props {
  timeline: { readonly current: Timeline }
  cover: SceneLayer[]
  free: SceneLayer[]
  channels: ChannelClip[]
  /** Resolved CSS font family for text drawn into canvas textures. */
  fontFamily: string
  /** Fractions of the viewport to shift the render: desktop moves the book right, mobile moves it down. */
  viewShift: { x: number; y: number }
  effects: boolean
}

const BG = '#f2ece2'

/** Small seeded PRNG so procedural textures and dust are deterministic. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const PAPER = '#f7f2e8'

function usePaperTexture() {
  return useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, size, size)
    const random = seeded(7)
    const image = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < image.data.length; i += 4) {
      const n = (random() - 0.5) * 10
      image.data[i] += n; image.data[i + 1] += n; image.data[i + 2] += n * 0.8
    }
    ctx.putImageData(image, 0, 0)
    ctx.globalAlpha = 0.06
    for (let i = 0; i < 140; i++) {
      ctx.strokeStyle = random() > 0.5 ? '#8a7a60' : '#ffffff'
      ctx.beginPath()
      const x = random() * size, y = random() * size, a = random() * Math.PI
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14)
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(3, 3)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
}

function useSpriteTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,250,240,1)')
    g.addColorStop(0.4, 'rgba(255,240,215,.5)')
    g.addColorStop(1, 'rgba(255,240,215,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

/* ── Camera: follows the scroll path, nudged by the pointer ── */
function CameraRig({ timeline, viewShift }: { timeline: Timeline; viewShift: { x: number; y: number } }) {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(...cameraAt(0).target))
  const pos = useRef(new THREE.Vector3(...cameraAt(0).pos))

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (viewShift.x || viewShift.y) cam.setViewOffset(size.width, size.height, -size.width * viewShift.x, -size.height * viewShift.y, size.width, size.height)
    else cam.clearViewOffset()
    cam.updateProjectionMatrix()
  }, [camera, size, viewShift.x, viewShift.y])

  useFrame((state, delta) => {
    const { pos: p, target: t } = cameraAt(timeline.g)
    const k = 1 - Math.exp(-delta * 3.2)
    pos.current.lerp(new THREE.Vector3(p[0] + state.pointer.x * 0.35, p[1] + state.pointer.y * 0.2, p[2]), k)
    look.current.lerp(new THREE.Vector3(...t), k)
    camera.position.copy(pos.current)
    camera.lookAt(look.current)
  })
  return null
}

/* ── One die-cut paper layer that stands up off the page ── */
function PaperLayer({ layer, lift, order }: { layer: SceneLayer; lift: (order: number, now: number) => number; order: number }) {
  const map = useTexture(layer.src)
  const pivot = useRef<THREE.Group>(null)
  const sway = useRef<THREE.Group>(null)
  const hover = useRef(0)
  const { x, z } = layerPlacement(layer.x, layer.depth)
  const width = layer.width * SPREAD.width
  const image = map.image as { width: number; height: number }
  const height = width * (image.height / image.width)

  const { geometry, depthMaterial } = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    const geometry = new THREE.PlaneGeometry(width, height)
    geometry.translate(0, height / 2, 0)
    const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.5 })
    return { geometry, depthMaterial }
  }, [map, width, height])

  useFrame(state => {
    const value = lift(order, performance.now())
    if (pivot.current) {
      pivot.current.visible = value > 0.001
      // Flat on the page (top pointing away) → upright facing the camera.
      pivot.current.rotation.x = -Math.PI / 2 * (1 - value)
    }
    if (sway.current && layer.standee) {
      hover.current += ((pivot.current?.userData.hovered ? 1 : 0) - hover.current) * 0.1
      const t = state.clock.elapsedTime
      sway.current.rotation.z = Math.sin(t * (1.1 + order) + order * 5) * (0.018 + hover.current * 0.05)
    }
  })

  return (
    <group ref={pivot} position={[x, SPREAD.pageTop + 0.004 + layer.depth * 0.002, z]}>
      <group ref={sway}>
        <mesh
          geometry={geometry}
          customDepthMaterial={depthMaterial}
          castShadow
          receiveShadow
          onPointerOver={() => { if (pivot.current) pivot.current.userData.hovered = true }}
          onPointerOut={() => { if (pivot.current) pivot.current.userData.hovered = false }}
        >
          <meshStandardMaterial map={map} alphaTest={0.5} side={THREE.DoubleSide} roughness={0.92} metalness={0} />
        </mesh>
      </group>
    </group>
  )
}

/* ── The page that turns from the cover spread to the next one ── */
function TurningPage({ timeline, paper, turn }: { timeline: Timeline; paper: THREE.Texture; turn: 1 | 2 }) {
  const segments = 28
  const pageWidth = SPREAD.width / 2 - 0.02
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(pageWidth, SPREAD.depth, segments, 1), [pageWidth])

  useFrame(() => {
    const angle = flipAngle(timeline.g, turn)
    if (!mesh.current) return
    mesh.current.visible = angle > 0.001 && angle < Math.PI - 0.001
    if (!mesh.current.visible) return
    // Integrate a curling page: segments far from the spine lag behind.
    const curl = Math.sin(angle) * 0.9
    const position = geometry.attributes.position as THREE.BufferAttribute
    const step = pageWidth / segments
    let px = 0, py = 0
    for (let i = 0; i <= segments; i++) {
      const u = i / segments
      const theta = angle - curl * u * u
      if (i > 0) { px += Math.cos(theta) * step; py += Math.sin(theta) * step }
      for (let row = 0; row < 2; row++) {
        const index = row * (segments + 1) + i
        position.setX(index, px)
        position.setY(index, py)
        position.setZ(index, row === 0 ? -SPREAD.depth / 2 : SPREAD.depth / 2)
      }
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, SPREAD.pageTop + 0.003, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={paper} side={THREE.DoubleSide} roughness={0.95} />
    </mesh>
  )
}

/* ── The open book on the desk ── */
function Book({ paper }: { paper: THREE.Texture }) {
  const half = SPREAD.width / 2
  const spine = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256; canvas.height = 4
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 256, 0)
    g.addColorStop(0, 'rgba(90,70,45,0)')
    g.addColorStop(0.5, 'rgba(90,70,45,.28)')
    g.addColorStop(1, 'rgba(90,70,45,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 4)
    return new THREE.CanvasTexture(canvas)
  }, [])
  return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[SPREAD.width + 0.32, 0.08, SPREAD.depth + 0.26]} />
        <meshStandardMaterial color="#2f3a4f" roughness={0.7} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * (half / 2 + 0.01), 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[half - 0.02, 0.12, SPREAD.depth]} />
          <meshStandardMaterial map={paper} color="#ffffff" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, SPREAD.pageTop + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, SPREAD.depth]} />
        <meshBasicMaterial map={spine} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ── Dust in the window light; the pointer pushes it away ── */
function Dust({ count = 320 }: { count?: number }) {
  const sprite = useSpriteTexture()
  const points = useRef<THREE.Points>(null)
  const { raycaster, camera } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const { positions, base, speed } = useMemo(() => {
    const random = seeded(42)
    const positions = new Float32Array(count * 3)
    const speed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 11
      positions[i * 3 + 1] = 0.3 + random() * 4.5
      positions[i * 3 + 2] = (random() - 0.5) * 7
      speed[i] = 0.04 + random() * 0.1
    }
    return { positions, base: positions.slice(), speed }
  }, [count])

  useFrame((state, delta) => {
    const geo = points.current?.geometry
    if (!geo) return
    raycaster.setFromCamera(state.pointer, camera)
    const pointer = raycaster.ray.intersectPlane(plane, hit)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      let x = base[ix] + Math.sin(t * speed[i] + i) * 0.35
      let y = base[ix + 1] + Math.sin(t * speed[i] * 0.7 + i * 2) * 0.25
      const z = base[ix + 2]
      if (pointer) {
        const dx = x - pointer.x, dy = y - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < 1.2) { const push = (1.2 - d2) * 0.6; x += dx * push; y += dy * push }
      }
      pos.array[ix] += (x - pos.array[ix]) * Math.min(1, delta * 4)
      pos.array[ix + 1] += (y - pos.array[ix + 1]) * Math.min(1, delta * 4)
      pos.array[ix + 2] = z
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={sprite} size={0.07} sizeAttenuation transparent depthWrite={false} opacity={0.8} blending={THREE.AdditiveBlending} color="#fff3dd" />
    </points>
  )
}

/* ── Soft shaft of window light falling across the desk ── */
function LightShaft() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4; canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, 'rgba(255,236,200,.0)')
    g.addColorStop(0.35, 'rgba(255,236,200,.55)')
    g.addColorStop(1, 'rgba(255,236,200,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 4, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
  return (
    <mesh position={[-2.6, 3.2, -1.5]} rotation={[0, 0.5, 0.62]}>
      <planeGeometry args={[2.6, 10]} />
      <meshBasicMaterial map={texture} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ── A paper picture frame that plays a real clip from one of the channels ── */
const FRAME_WIDTH = 0.155 * SPREAD.width
const VIDEO_HEIGHT = FRAME_WIDTH * 16 / 9
const BORDER = 0.07
const LABEL = 0.42

function drawLabel(canvas: HTMLCanvasElement, name: string, tagline: string, fontFamily: string) {
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(120,100,70,.18)'
  ctx.lineWidth = 3
  ctx.strokeRect(6, 6, width - 12, height - 12)
  const labelTop = height * (1 - LABEL / (VIDEO_HEIGHT + BORDER * 2 + LABEL))
  ctx.textAlign = 'center'
  ctx.fillStyle = '#2c2a26'
  ctx.font = `700 ${Math.round(width * 0.13)}px ${fontFamily}`
  ctx.fillText(name, width / 2, labelTop + (height - labelTop) * 0.5)
  ctx.fillStyle = '#8a7f6e'
  ctx.font = `500 ${Math.round(width * 0.075)}px ${fontFamily}`
  ctx.fillText(tagline, width / 2, labelTop + (height - labelTop) * 0.82)
}

function ChannelFrame({ channel, order, timeline, fontFamily }: { channel: ChannelClip; order: number; timeline: Timeline; fontFamily: string }) {
  const pivot = useRef<THREE.Group>(null)
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  const video = useRef<HTMLVideoElement | null>(null)
  const videoTexture = useRef<THREE.VideoTexture | null>(null)
  const playing = useRef(false)
  const poster = useTexture(`${channel.clip}.jpg`)
  const boardWidth = FRAME_WIDTH + BORDER * 2
  const boardHeight = VIDEO_HEIGHT + BORDER * 2 + LABEL
  const { x, z } = layerPlacement(channel.x, channel.depth)

  const { board, boardGeometry, screenGeometry } = useMemo(() => {
    poster.colorSpace = THREE.SRGBColorSpace
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = Math.round(512 * boardHeight / boardWidth)
    const board = new THREE.CanvasTexture(canvas)
    board.colorSpace = THREE.SRGBColorSpace
    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, 0.03)
    boardGeometry.translate(0, boardHeight / 2, 0)
    const screenGeometry = new THREE.PlaneGeometry(FRAME_WIDTH, VIDEO_HEIGHT)
    screenGeometry.translate(0, LABEL + BORDER + VIDEO_HEIGHT / 2, 0.017)
    return { board, boardGeometry, screenGeometry }
  }, [poster, boardWidth, boardHeight])

  // Label: draw now, redraw once the web font is ready (canvas text can't wait for CSS).
  useEffect(() => {
    let cancelled = false
    const draw = () => {
      drawLabel(board.image as HTMLCanvasElement, channel.name, channel.tagline, fontFamily)
      board.needsUpdate = true
    }
    draw()
    document.fonts?.load(`700 40px ${fontFamily}`).then(() => { if (!cancelled) draw() }).catch(() => {})
    return () => { cancelled = true }
  }, [board, channel.name, channel.tagline, fontFamily])

  // Video lives in an effect so StrictMode's mount/unmount/mount gets a fresh element each time.
  useEffect(() => {
    const el = document.createElement('video')
    // H.264 for Safari / Chrome, VP9 WebM where H.264 isn't available.
    el.src = el.canPlayType('video/mp4; codecs="avc1.4D401E"') ? `${channel.clip}.mp4` : `${channel.clip}.webm`
    el.muted = true
    el.loop = true
    el.playsInline = true
    el.preload = 'metadata'
    const texture = new THREE.VideoTexture(el)
    texture.colorSpace = THREE.SRGBColorSpace
    const onPlaying = () => { playing.current = true }
    el.addEventListener('playing', onPlaying)
    video.current = el
    videoTexture.current = texture
    return () => {
      el.removeEventListener('playing', onPlaying)
      el.pause()
      el.removeAttribute('src')
      el.load()
      texture.dispose()
      video.current = null
      videoTexture.current = null
      playing.current = false
    }
  }, [channel.clip])

  useFrame(state => {
    const value = channelsLift(timeline.g, order)
    const visible = flipAngle(timeline.g, 2) > Math.PI * 0.8 && value > 0.001
    if (pivot.current) {
      pivot.current.visible = visible
      pivot.current.rotation.x = -Math.PI / 2 * (1 - value)
      const hovered = pivot.current.userData.hovered ? 1 : 0
      pivot.current.userData.tilt = (pivot.current.userData.tilt ?? 0) + (hovered - (pivot.current.userData.tilt ?? 0)) * 0.12
      pivot.current.rotation.x += pivot.current.userData.tilt * 0.12
      pivot.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + order * 4) * 0.01
    }
    // Only decode video while the channel wall is actually up.
    const el = video.current
    if (el && visible && value > 0.6 && el.paused) el.play().catch(() => {})
    if (el && !visible && !el.paused) el.pause()
    if (screen.current) {
      const map = playing.current && videoTexture.current ? videoTexture.current : poster
      if (screen.current.map !== map) { screen.current.map = map; screen.current.needsUpdate = true }
    }
  })

  return (
    <group ref={pivot} position={[x, SPREAD.pageTop + 0.004, z]} visible={false}>
      <mesh
        geometry={boardGeometry}
        castShadow
        receiveShadow
        onPointerOver={() => { if (pivot.current) pivot.current.userData.hovered = true; document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { if (pivot.current) pivot.current.userData.hovered = false; document.body.style.cursor = '' }}
      >
        <meshStandardMaterial map={board} roughness={0.95} />
      </mesh>
      <mesh geometry={screenGeometry}>
        <meshStandardMaterial ref={screen} map={poster} roughness={0.55} metalness={0} emissive="#ffffff" emissiveIntensity={0.12} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Focus({ timeline }: { timeline: Timeline }) {
  const target = useRef(new THREE.Vector3(...cameraAt(0).focus))
  useFrame((_, delta) => {
    target.current.lerp(new THREE.Vector3(...cameraAt(timeline.g).focus), 1 - Math.exp(-delta * 3))
  })
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField target={target.current} focalLength={0.32} bokehScale={2.2} height={480} />
      <Noise opacity={0.025} />
      <Vignette offset={0.25} darkness={0.42} />
    </EffectComposer>
  )
}

export default function BookScene({ timeline: timelineRef, cover, free, channels, fontFamily, viewShift, effects }: Props) {
  // Same object for the component's lifetime; children read .g every frame.
  const timeline = timelineRef.current
  const paper = usePaperTexture()
  const introDuration = 1600
  const coverLiftFn = (order: number, now: number) => coverLift(timeline.g, Math.min(1, (now - timeline.introStart) / introDuration), order)
  const freeLiftFn = (order: number) => (flipAngle(timeline.g) > Math.PI * 0.8 ? freeLift(timeline.g, order) : 0)
  const channelOrder = (i: number) => (channels.length > 1 ? i / (channels.length - 1) : 0)

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 9, 22]} />
      <hemisphereLight args={['#fff8ee', '#d6c7ad', 0.75]} />
      <directionalLight
        position={[-6, 9, 4.5]}
        intensity={2.3}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <CameraRig timeline={timeline} viewShift={viewShift} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#efe7d9" roughness={1} />
      </mesh>

      <group rotation={[0, -0.12, 0]}>
        <Book paper={paper} />
        {cover.map((layer, i) => (
          <PaperLayer key={layer.src} layer={layer} order={cover.length > 1 ? i / (cover.length - 1) : 0} lift={coverLiftFn} />
        ))}
        {free.map((layer, i) => (
          <PaperLayer key={layer.src} layer={layer} order={free.length > 1 ? i / (free.length - 1) : 0} lift={freeLiftFn} />
        ))}
        {channels.map((channel, i) => (
          <ChannelFrame key={channel.clip} channel={channel} order={channelOrder(i)} timeline={timeline} fontFamily={fontFamily} />
        ))}
        <TurningPage timeline={timeline} paper={paper} turn={1} />
        <TurningPage timeline={timeline} paper={paper} turn={2} />
      </group>

      <LightShaft />
      <Dust />
      {effects && <Focus timeline={timeline} />}
    </>
  )
}
