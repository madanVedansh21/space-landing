"use client"

import { useEffect, useRef } from "react"

type Star = { x: number; y: number; z: number; tw: number; sp: number }

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function seed() {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 6000)
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 0.9 + 0.1,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.6 + 0.2,
      }))
    }

    function resize() {
      canvas.width = Math.floor(window.innerWidth * DPR)
      canvas.height = Math.floor(window.innerHeight * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      seed()
    }

    function loop() {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const stars = starsRef.current
      const { x: mx, y: my } = mouseRef.current

      for (const s of stars) {
        s.tw += 0.02 + s.sp * 0.02
        s.y += s.sp * (0.18 + s.z * 0.7)
        if (s.y > window.innerHeight + 10) {
          s.y = -10
          s.x = Math.random() * window.innerWidth
          s.z = Math.random() * 0.9 + 0.1
        }
        const parallaxX = mx * (1 - s.z) * 8
        const parallaxY = my * (1 - s.z) * 8
        const alpha = 0.35 + Math.abs(Math.sin(s.tw)) * 0.55
        const size = s.z * 1.6 + Math.abs(Math.sin(s.tw * 0.8)) * 0.5

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.arc(s.x + parallaxX, s.y + parallaxY, size, 0, Math.PI * 2)
        ctx.fill()
      }

      const rad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.7,
      )
      rad.addColorStop(0, "rgba(0,0,0,0)")
      rad.addColorStop(1, "rgba(0,0,0,0.25)")
      ctx.fillStyle = rad
      ctx.fillRect(0, 0, width, height)

      rafRef.current = requestAnimationFrame(loop)
    }

    function onMove(e: PointerEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove)
    resize()
    loop()
    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <video
        src="/videos/black hole 1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  )
}
