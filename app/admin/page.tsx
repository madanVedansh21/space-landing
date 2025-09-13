import Link from "next/link"
import SpaceBackground from "@/components/space-background"

export default function AdminPage() {
  return (
    <main className="relative min-h-dvh">
      <SpaceBackground />
      <div className="min-h-dvh flex items-center justify-center p-8">
        <div className="max-w-3xl w-full rounded-xl bg-black/80 border border-white/10 p-8">
          <h1 className="text-2xl font-semibold text-white">Admin</h1>
          <p className="mt-3 text-white/70">Admin panel placeholder. Add event creation and dataset management here.</p>
          <div className="mt-6">
            <Link href="/" className="text-cyan-300">Back home</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
