"use client"

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        src="/videos/black hole 3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}
