"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon, InfoIcon, BookOpenIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EducationalOverlayProps {
  isOpen: boolean
  onClose: () => void
  selectedEvent?: any
}

export function EducationalOverlay({ isOpen, onClose, selectedEvent }: EducationalOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  const steps = [
    {
      title: "Understanding the Arc Visualization",
      content: (
        <div className="space-y-4">
          <p className="text-white/90">
            The holographic arcs you see represent two different ways of measuring distance to cosmic events:
          </p>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="w-3 h-3 rounded-full bg-amber-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-300">Inner Arc - Angular Distance</h4>
                <p className="text-sm text-white/80">
                  How big the event appears in our sky. Like measuring the apparent size of the Moon.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="w-3 h-3 rounded-full bg-cyan-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-cyan-300">Outer Arc - Spatial Distance</h4>
                <p className="text-sm text-white/80">
                  How far away the event actually is in space. Like measuring the distance to a city.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Why Two Different Measurements?",
      content: (
        <div className="space-y-4">
          <p className="text-white/90">
            These measurements tell us different things about the same event:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5">
              <h4 className="font-semibold text-amber-300 mb-2">Angular Size</h4>
              <p className="text-sm text-white/80">
                • Small angular size = pinpoint source (like a star)<br/>
                • Large angular size = extended source (like a galaxy)<br/>
                • Helps identify what type of object we're looking at
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <h4 className="font-semibold text-cyan-300 mb-2">Spatial Distance</h4>
              <p className="text-sm text-white/80">
                • Tells us how long ago the light was emitted<br/>
                • Helps understand the age and evolution of the universe<br/>
                • Allows us to calculate the actual energy of the event
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Real-World Analogy",
      content: (
        <div className="space-y-4">
          <p className="text-white/90">
            Think of it like looking at a lighthouse at night:
          </p>
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-300" />
                <span className="text-sm text-white/90">
                  <strong>Angular size:</strong> How bright the lighthouse appears to you
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-300" />
                <span className="text-sm text-white/90">
                  <strong>Spatial distance:</strong> How far away the lighthouse actually is
                </span>
              </div>
            </div>
            <p className="text-xs text-white/70 mt-3 italic">
              A nearby dim lighthouse might appear as bright as a distant powerful one!
            </p>
          </div>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="border-white/10 bg-black/90 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-cyan-300" />
                <CardTitle className="text-white">Educational Guide</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-cyan-300' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/60">
                  {currentStep + 1} of {steps.length}
                </span>
              </div>

              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {steps[currentStep].title}
                </h3>
                {steps[currentStep].content}
              </motion.div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={onClose}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Got it!
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface HelpButtonProps {
  onClick: () => void
  className?: string
}

export function HelpButton({ onClick, className }: HelpButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`text-white/70 hover:text-white hover:bg-white/10 ${className}`}
      aria-label="Open educational guide"
    >
      <InfoIcon className="h-4 w-4 mr-2" />
      Learn More
    </Button>
  )
}
