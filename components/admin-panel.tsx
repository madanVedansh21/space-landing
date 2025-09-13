"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring' }} className="relative z-80 w-full max-w-2xl mx-4">
        <div className="rounded-xl bg-black/95 border border-white/10 p-6 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Admin Panel</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 text-white/80">
            <p className="text-sm">Placeholder admin actions:</p>
            <ul className="mt-3 list-disc list-inside text-sm">
              <li>Create or upload new events</li>
              <li>Manage correlated datasets</li>
              <li>Run server-side correlators</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} className="bg-cyan-300 text-black">Close</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
