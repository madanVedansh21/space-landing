"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <header className="relative z-10 mx-auto mt-28 max-w-3xl px-6 text-center md:mt-36">
      <motion.h1
        className="text-pretty text-4xl font-semibold tracking-tight text-white md:text-6xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Explore Space-Time Events
      </motion.h1>
      <motion.p
        className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-white/80 md:text-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
      >
        A live black hole with real-time starfield sets the stage. Scrub through years to reveal cosmic milestones with
        cinematic immersion.
      </motion.p>
      <motion.div
        className="mx-auto mt-8 inline-flex items-center justify-center gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <a href="#timeline" className="rounded-md bg-cyan-400 px-4 py-2 text-black hover:bg-cyan-300">
          Start the Journey
        </a>
        <a href="#about" className="rounded-md px-4 py-2 text-white/80 ring-1 ring-white/20 hover:text-white">
          Learn More
        </a>
      </motion.div>
    </header>
  )
}
