"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing"
import * as THREE from "three"
import { useEffect, useMemo, useRef } from "react"

type Event = {
  id: string
  confidence: number
  angle: number // radians around the disk
  radius?: number
}

function EventHorizon() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#000000" roughness={1} metalness={0} />
    </mesh>
  )
}

function AccretionDisk() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 0.08
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0.25, 0]}>
      <torusGeometry args={[2.2, 0.48, 2, 256]} />
      <meshStandardMaterial
        color="#f5d0a9"
        emissive="#f59e0b"
        emissiveIntensity={3.1}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  )
}

function RelativisticJets() {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.6 }), [])
  return (
    <group>
      <mesh position={[0, 4, 0]} material={mat}>
        <coneGeometry args={[0.16, 3.2, 32, 1, true]} />
      </mesh>
      <mesh position={[0, -4, 0]} rotation={[Math.PI, 0, 0]} material={mat}>
        <coneGeometry args={[0.16, 3.2, 32, 1, true]} />
      </mesh>
    </group>
  )
}

function Sparks({ events }: { events: Event[] }) {
  const inst = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colors = useMemo(() => events.map(() => new THREE.Color()), [events])

  // Prepare instance colors/positions when events change
  useEffect(() => {
    if (!inst.current) return
    const rBase = 2.2
    events.forEach((e, i) => {
      const r = rBase + (e.radius ?? 0.05 + Math.random() * 0.35)
      const x = Math.cos(e.angle) * r
      const y = (Math.random() - 0.5) * 0.15 // slight tilt off the plane
      const z = Math.sin(e.angle) * r
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(0.8 + e.confidence * 0.8)
      dummy.lookAt(0, 0, 0)
      dummy.updateMatrix()
      inst.current!.setMatrixAt(i, dummy.matrix)

      // Color from purple -> cyan -> amber by confidence
      const c = colors[i]
      if (e.confidence < 0.5) c.set("#a78bfa")
      else if (e.confidence < 0.8) c.set("#22d3ee")
      else c.set("#facc15")
      inst.current!.setColorAt(i, c)
    })
    inst.current.instanceMatrix.needsUpdate = true
    inst.current.instanceColor!.needsUpdate = true
  }, [events, colors, dummy])

  // Pulse scale with confidence
  useFrame(({ clock }) => {
    if (!inst.current) return
    const t = clock.getElapsedTime()
    const rBase = 2.2
    events.forEach((e, i) => {
      const r = rBase + (e.radius ?? 0.05)
      const x = Math.cos(e.angle + t * 0.08) * r
      const y = Math.sin(t * 0.4 + i) * 0.07 * (0.5 + e.confidence)
      const z = Math.sin(e.angle + t * 0.08) * r
      const s = 0.5 + 0.5 * (0.6 + Math.sin(t * (1.5 + e.confidence)) * 0.4) * (0.6 + e.confidence)
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(s)
      dummy.lookAt(0, 0, 0)
      dummy.updateMatrix()
      inst.current!.setMatrixAt(i, dummy.matrix)
    })
    inst.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={inst} args={[undefined as any, undefined as any, events.length]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial emissiveIntensity={2.2} vertexColors color="#ffffff" emissive="#ffffff" />
    </instancedMesh>
  )
}

export default function BlackHoleScene({
  year,
  events,
}: {
  year: number
  events: Event[]
}) {
  return (
    <Canvas
      className="fixed inset-0 -z-10"
      dpr={[1, 2]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 50 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 5]} intensity={0.7} />
      <Stars radius={250} depth={100} count={9000} factor={4} saturation={0} speed={0.15} />

      <group>
        <EventHorizon />
        <AccretionDisk />
        <RelativisticJets />
        <Sparks events={events as Event[]} />
      </group>

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.03} mipmapBlur />
        <Noise opacity={0.035} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
