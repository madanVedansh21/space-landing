"use client"

import { useEffect, useRef } from "react"

export default function Starfield({ density = 0.001 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    type Star = { x: number; y: number; r: number; tw: number; ph: number; vx: number; vy: number }
    let stars: Star[] = []

    function reseed() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      const count = Math.floor(w * h * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * 0.8 + 0.3,
        ph: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
      }))
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < -10) s.x = w + 10
        if (s.x > w + 10) s.x = -10
        if (s.y < -10) s.y = h + 10
        if (s.y > h + 10) s.y = -10

        const a = 0.25 + 0.75 * Math.abs(Math.sin(s.ph + t * 0.001 * s.tw))
        ctx.globalAlpha = a
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }

    reseed()
    window.addEventListener("resize", reseed)
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", reseed)
    }
  }, [density])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
}
