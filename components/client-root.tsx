"use client"

import dynamic from "next/dynamic"

// Prefer normal imports if these files already have "use client"
// If you specifically want lazy-loading, keep dynamic:
const SpaceBackground = dynamic(() => import("./space-background"), { ssr: false })
const LandingOverlay = dynamic(() => import("./landing-overlay"), { ssr: false })

export default function ClientRoot() {
  return (
    <div className="relative min-h-svh">
      {/* Background and interactive overlay */}
      <SpaceBackground />
      <LandingOverlay />
    </div>
  )
}
