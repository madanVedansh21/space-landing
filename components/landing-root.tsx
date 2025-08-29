"use client"

import { useState } from "react"
import SpaceBackground from "@/components/space-background"
import EventFlashes from "@/components/event-flashes"
import { Timeline } from "@/components/timeline"

export default function LandingRoot() {
  // Years 2015–2025 as requested
  const [year, setYear] = useState<number>(2020)

  // 5-color scheme: near-black (from image), white, cyan, amber, purple
  const colors = {
    primary: "#22d3ee",
    neutralBg: "transparent",
    neutralText: "#ffffff",
    accentPurple: "#a78bfa",
    accentYellow: "#facc15",
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Single background: your black hole image + live twinkling stars */}
      <SpaceBackground />

      {/* Event flashes tied to the current year */}
      <EventFlashes year={year} />

      {/* Headline/CTA container (kept minimal; you can replace copy later) */}
      <section className="relative z-10 mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Space Event Timeline
        </h1>
        <p className="mt-3 max-w-2xl text-balance text-white/80 md:text-lg">
          Explore major space events on a cinematic black hole backdrop with live stars.
        </p>
      </section>

      {/* Premium, snapping year dial fixed at the bottom */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-3xl px-4 pb-6">
        <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur">
          <div className="p-4">
            <Timeline min={2015} max={2025} value={year} onChange={setYear} colors={colors} />
          </div>
        </div>
      </div>
    </div>
  )
}
