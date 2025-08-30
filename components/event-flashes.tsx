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
          <div key={ev.id} className="absolute" style={{ left, top }}>
            <motion.span
              className="relative block rounded-full"
              style={{
                width: size,
                height: size,
                boxShadow: `0 0 ${glow}px ${glow / 4}px ${tint}`,
                border: `1px solid ${ring}`,
                opacity: baseOpacity,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
          </div>
        )
      })}
    </div>
  )
}
