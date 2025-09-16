"use client"

import { useEffect, useRef, useState } from 'react'

export default function SpaceBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Lazy load the video
  useEffect(() => {
    if (videoRef.current) {
      // Set the source only after component mounts
      videoRef.current.src = "/videos/black hole 3.mp4"
      videoRef.current.addEventListener('loadeddata', () => {
        setIsLoaded(true)
      })
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => {
          setIsLoaded(true)
        })
      }
    }
  }, [])
  
  return (
    <div className="fixed inset-0 z-0">
      {/* Show a loading state or placeholder before video loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="animate-pulse text-white text-opacity-50">Loading space visualization...</div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
      />
    </div>
  )
}
