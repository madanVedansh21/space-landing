"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"

type Props = { events: EventItem[]; selected?: EventItem; showDetailOverlay?: boolean }

function hashTo01(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return ((h >>> 0) % 1000) / 1000
}

function toViewport(ev: EventItem) {
  const xPct = ((ev.lng + 180) / 360) * 100
  const yPct = ((90 - ev.lat) / 180) * 100
  const jx = (hashTo01(ev.id + "x") - 0.5) * 2
  const jy = (hashTo01(ev.id + "y") - 0.5) * 2
  const left = `calc(${xPct}% + ${jx * 6}px)`
  const top = `calc(${yPct}% + ${jy * 6}px)`
  return { left, top }
}

export default function EventFlashes({ events, selected, showDetailOverlay }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 mix-blend-screen">
      {events.map((ev) => {
        const { left, top } = toViewport(ev)
        const size = 2 + Math.round(ev.confidence * 4)
        const glow = 8 + Math.round(ev.confidence * 22)
        const isHigh = ev.confidence > 0.75
        const tint =
          ev.type === "Gravitational Wave"
            ? "rgba(167,139,250,0.65)"
            : ev.type === "Neutrino"
              ? "rgba(34,211,238,0.65)"
              : "rgba(255,255,255,0.6)"
        const ring = isHigh ? "rgba(250,204,21,0.85)" : tint

        const isSelected = selected?.id === ev.id
        const baseOpacity = isSelected ? 1 : selected ? 0.25 : 0.95

        return (
          <motion.span
            key={ev.id}
            className="absolute rounded-full will-change-transform will-change-opacity"
            style={{
              left,
              top,
              width: size,
              height: size,
              background: "#ffffff",
              boxShadow: `0 0 ${glow}px ${Math.max(4, glow / 4)}px ${ring}`,
              opacity: baseOpacity,
            }}
            initial={{ opacity: 0.25, scale: 0.8 }}
            animate={{
              opacity: [baseOpacity * 0.8, baseOpacity, baseOpacity * 0.8],
              scale: isSelected ? [1.1, 1.9, 1.1] : [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 1.6 + hashTo01(ev.id) * 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )
      })}

      <AnimatePresence>
        {selected && !showDetailOverlay && (
          <motion.div
            key={selected.id}
            className="absolute"
            style={{ left: toViewport(selected).left, top: toViewport(selected).top }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* pulsing ring */}
            <motion.span
              className="absolute -left-6 -top-6 h-12 w-12 rounded-full border border-amber-300/70"
              style={{ boxShadow: "0 0 24px 6px rgba(250,204,21,0.35)" }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
            />
            {/* arcs via SVG (kept for non-focus quick glance) */}
            <svg
              className="pointer-events-none"
              width="520"
              height="520"
              viewBox="-260 -260 520 520"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <defs>
                <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
                  <stop offset="50%" stopColor="rgba(34,211,238,0.8)" />
                  <stop offset="100%" stopColor="rgba(167,139,250,0.9)" />
                </linearGradient>
              </defs>
              {(() => {
                const rBase = 60
                const r1 = rBase + selected.angular_distance_deg * 6 // map deg -> px
                const r2 = r1 + 24
                const sweep = Math.min(320, 160 + selected.angular_distance_deg * 8)
                const start = (-sweep / 2) * (Math.PI / 180)
                const end = (sweep / 2) * (Math.PI / 180)
                const arc = (r: number) =>
                  `M ${Math.cos(start) * r} ${Math.sin(start) * r} A ${r} ${r} 0 0 1 ${Math.cos(end) * r} ${
                    Math.sin(end) * r
                  }`
                return (
                  <>
                    <motion.path
                      d={arc(r1)}
                      stroke="url(#holo)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 10"
                      strokeLinecap="round"
                      animate={{ strokeDashoffset: [0, 32] }}
                      transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <motion.path
                      d={arc(r2)}
                      stroke="rgba(250,204,21,0.85)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="1 8"
                      animate={{ strokeDashoffset: [0, 24] }}
                      transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    {/* measuring line for spatial distance */}
                    {(() => {
                      const len = Math.min(240, 80 + selected.spatial_distance_mly * 0.4) // px
                      return (
                        <>
                          <motion.line
                            x1="0"
                            y1="0"
                            x2={len}
                            y2="0"
                            stroke="rgba(34,211,238,0.9)"
                            strokeWidth="2"
                            strokeDasharray="6 10"
                            animate={{ strokeDashoffset: [0, 28] }}
                            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <text
                            x={len + 10}
                            y="4"
                            fill="white"
                            fontSize="10"
                            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))" }}
                          >
                            {selected.spatial_distance_mly.toLocaleString()} Mly
                          </text>
                          <text
                            x={-r1 - 24}
                            y="-8"
                            fill="white"
                            fontSize="10"
                            style={{ filter: "drop-shadow(0 0 6px rgba(250,204,21,0.8))" }}
                          >
                            {selected.angular_distance_deg.toFixed(1)}°
                          </text>
                        </>
                      )
                    })()}
                  </>
                )
              })()}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
