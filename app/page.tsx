
import SpaceBackground from "@/components/space-background"
import LandingOverlay from "@/components/landing-overlay"
import Navbar from "@/components/navbar"

export default function Page() {
  return (
    <main className="relative min-h-dvh">
      <Navbar />
      <SpaceBackground />
      <LandingOverlay />
    </main>
  )
}
