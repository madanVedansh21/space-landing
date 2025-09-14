import Navbar from "@/components/navbar"
import SpaceBackground from "@/components/space-background"

export default function AboutPage() {
  return (
    <main className="relative min-h-dvh">
      <Navbar />
      <div className="min-h-dvh flex items-center justify-center p-8">
        <div className="max-w-3xl w-full rounded-xl bg-black/80 border border-white/10 p-8">
          <h1 className="text-2xl font-semibold text-white">About Us</h1>
          <p className="mt-3 text-white/70">Placeholder about page — content to be added later.</p>
        </div>
      </div>
    </main>
  )
}
