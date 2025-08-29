"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  colors: {
    primary: string
    neutralBg: string
    neutralText: string
    accentPurple: string
    accentYellow: string
  }
}

export function Timeline({ min, max, value, onChange, colors }: Props) {
  const years = useMemo(() => {
    const arr: number[] = []
    for (let y = min; y <= max; y++) arr.push(y)
    return arr
  }, [min, max])

  const [index, setIndex] = useState(() => (years.indexOf(value) >= 0 ? years.indexOf(value) : 0))
  const knobRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)

  // keep internal index in sync when parent updates value
  if (years[index] !== value) {
    const idx = years.indexOf(value)
    if (idx !== -1) setIndex(idx)
  }

  const setByIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(i, years.length - 1))
    setIndex(clamped)
    onChange(years[clamped])
  }

  useEffect(() => {
    function onMove(ev: PointerEvent) {
      if (!draggingRef.current) return
      const svg = document.getElementById("dial-svg") as SVGSVGElement | null
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.9 // center below for nicer feel
      const dx = ev.clientX - cx
      const dy = ev.clientY - cy
      let angle = Math.atan2(-dy, dx) // radians
      // Constrain to [0..π]
      angle = Math.max(0, Math.min(Math.PI, angle + Math.PI / 2))
      const t = 1 - angle / Math.PI // 0..1 left->right
      const i = Math.round(t * (years.length - 1))
      setByIndex(i)
    }
    const onUp = () => (draggingRef.current = false)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years.length])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setByIndex(index - 1)
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setByIndex(index + 1)
    }
  }

  const angleFor = (i: number) => Math.PI - (i / (years.length - 1)) * Math.PI
  const posFor = (i: number, r = 44) => {
    const a = angleFor(i)
    return { x: 50 + Math.cos(a) * r, y: 45 - Math.sin(a) * r }
  }
  const knob = posFor(index, 44)

  return (
    <div id="timeline" aria-label="Year dial" className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-white/80">Timeline</span>
        <span className="text-sm font-medium">{value}</span>
      </div>

      <div className="relative mx-auto h-28 w-full">
        {/* Semicircle dial and ticks */}
        <svg
          id="dial-svg"
          className="absolute inset-0 h-full w-full touch-none"
          viewBox="0 0 100 50"
          onPointerDown={() => (draggingRef.current = true)}
          aria-hidden="true"
        >
          <path d="M 6 45 A 44 44 0 0 1 94 45" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.25" />
          {years.map((_, i) => {
            const a = angleFor(i)
            const cx = 50 + Math.cos(a) * 44
            const cy = 45 - Math.sin(a) * 44
            const len = i === index ? 6 : i % 2 === 0 ? 4 : 3
            const nx = Math.cos(a + Math.PI / 2)
            const ny = Math.sin(a + Math.PI / 2)
            const x1 = cx + nx * len
            const y1 = cy + ny * len
            const x2 = cx - nx * len
            const y2 = cy - ny * len
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i === index ? "rgba(250, 204, 21, 1)" : "rgba(255,255,255,0.35)"}
                strokeWidth={i === index ? 1.8 : 1}
              />
            )
          })}
        </svg>

        {/* Knob that rides the arc */}
        <motion.div
          ref={knobRef}
          role="slider"
          aria-valuemin={years[0]}
          aria-valuemax={years[years.length - 1]}
          aria-valuenow={years[index]}
          aria-label="Select year"
          tabIndex={0}
          onKeyDown={handleKey}
          onPointerDown={(e) => {
            ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            draggingRef.current = true
          }}
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: colors.accentYellow }}
          animate={{
            left: `${knob.x}%`,
            top: `${knob.y}%`,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {/* Center label animation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={years[index]}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="text-center"
            >
              <div className="text-xs uppercase tracking-widest text-white/60">Year</div>
              <div className="text-3xl font-semibold text-amber-300">{years[index]}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hidden native range for keyboard + a11y (kept for fallback) */}
        <label className="sr-only" htmlFor="year-range">
          Select year
        </label>
        <input
          id="year-range"
          type="range"
          min={0}
          max={years.length - 1}
          step={1}
          value={index}
          onChange={(e) => setByIndex(Number.parseInt(e.target.value))}
          className="absolute inset-x-6 bottom-0 h-5 w-[calc(100%-3rem)] cursor-pointer appearance-none bg-transparent"
          aria-valuemin={years[0]}
          aria-valuemax={years[years.length - 1]}
          aria-valuenow={years[index]}
          style={{ accentColor: colors.primary }}
        />
      </div>

      {/* Nearby years quick-jump */}
      <div className="mt-2 flex items-center justify-center gap-4 text-sm text-white/70">
        {years.slice(Math.max(0, index - 2), Math.min(years.length, index + 3)).map((y) => (
          <button
            key={y}
            onClick={() => setByIndex(years.indexOf(y))}
            className={`px-1 transition-colors ${y === years[index] ? "text-amber-300" : "hover:text-white"}`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}
