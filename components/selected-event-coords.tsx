"use client"

import { AnimatePresence, motion } from "framer-motion"
import { EventItem } from "@/lib/events"

// This helper function must be copied from event-flashes.tsx
function hashTo01(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
  }
  return ((h >>> 0) % 1000) / 1000
}

// This helper function must be copied from event-flashes.tsx
function toViewport(ev: EventItem) {
  const xPct = ((ev.lng + 180) / 360) * 100
  const yPct = ((90 - ev.lat) / 180) * 100
  const jx = (hashTo01(ev.id + "x") - 0.5) * 2
  const jy = (hashTo01(ev.id + "y") - 0.5) * 2
  const left = `calc(${xPct}% + ${jx * 6}px)`
  const top = `calc(${yPct}% + ${jy * 6}px)`
  return { left, top }
}

type Props = {
  selected?: EventItem
}

export function SelectedEventCoords({ selected }: Props) {
  // Empty implementation - coordinates now only shown in FocusOverlay
  return null
}