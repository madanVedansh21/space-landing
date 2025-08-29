"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  years: number[]
  defaultYear?: number
  onChange?: (year: number) => void
}

export default function YearDial({ years, defaultYear, onChange }: Props) {
  const indices = useMemo(() => years.map((_, i) => i), [years])
  const defaultIndex = defaultYear ? Math.max(0, years.indexOf(defaultYear)) : Math.floor(years.length / 2)
  const [index, setIndex] = useState(defaultIndex)

  const setByIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(i, years.length - 1))
    setIndex(clamped)
    onChange?.(years[clamped])
  }

  useEffect(() => {
    onChange?.(years[index])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const arcR = 44
  const progress = indices.length > 1 ? index / (indices.length - 1) : 0
  const toPoint = (i: number) => {
    const t = i / (indices.length - 1 || 1)
    const ang = Math.PI - t * Math.PI // 180° -> 0°
    const cx = 50 + Math.cos(ang) * arcR
    const cy = 45 - Math.sin(ang) * arcR
    return { x: cx, y: cy }
  }
  const knob = toPoint(index)

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl select-none rounded-t-2xl bg-black/65 px-4 pb-6 pt-4 backdrop-blur-md ring-1 ring-white/10">
      <div className="relative mx-auto h-28 w-full">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50" aria-hidden="true">
          {/* base arc */}
          <path d="M 6 45 A 44 44 0 0 1 94 45" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.25" />

          <defs>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="amber-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(250,204,21,0.0)" />
              <stop offset="100%" stopColor="rgba(250,204,21,0.95)" />
            </linearGradient>
          </defs>
          <path
            d="M 6 45 A 44 44 0 0 1 94 45"
            pathLength={100}
            strokeDasharray={`${Math.max(1, progress * 100)} 100`}
            stroke="url(#amber-sweep)"
            strokeWidth="2.5"
            filter="url(#soft-glow)"
            fill="none"
            opacity="0.9"
          />

          {/* ticks */}
          {indices.map((i) => {
            const t = i / (indices.length - 1 || 1)
            const ang = Math.PI - t * Math.PI
            const cx = 50 + Math.cos(ang) * arcR
            const cy = 45 - Math.sin(ang) * arcR
            const len = i === index ? 7 : i % 2 === 0 ? 4.5 : 3
            const nx = Math.cos(ang + Math.PI / 2)
            const ny = Math.sin(ang + Math.PI / 2)
            const x1 = cx + nx * len
            const y1 = cy + ny * len
            const x2 = cx - nx * len
            const y2 = cy - ny * len
            const active = i <= index
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={active ? "rgba(250,204,21,0.9)" : "rgba(255,255,255,0.35)"}
                strokeWidth={active ? 1.6 : 1}
              />
            )
          })}
        </svg>

        {/* knob with stronger animated glow */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${knob.x}%`, top: `${knob.y}%` }}
          animate={{ left: `${knob.x}%`, top: `${knob.y}%`, scale: [1, 1.08, 1] }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-amber-300 ring-2 ring-amber-300/70 shadow-[0_0_20px_6px_rgba(250,204,21,0.55)]" />
            <motion.span
              className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ boxShadow: "0 0 60px 16px rgba(250,204,21,0.3) inset, 0 0 64px 16px rgba(250,204,21,0.35)" }}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Center label */}
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

        {/* Invisible range for keyboard and screen readers */}
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
        />
      </div>

      {/* quick year jump */}
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
