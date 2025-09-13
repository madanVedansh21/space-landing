"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ACCESSIBILITY_GLOSSARY, type AccessibilityInfo } from "@/lib/accessibility-helpers"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = TooltipPrimitive.Content

interface AccessibleTooltipProps {
  term: string
  children?: React.ReactNode
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  showIcon?: boolean
}

export function AccessibleTooltip({ 
  term, 
  children, 
  className,
  side = "top",
  showIcon = true 
}: AccessibleTooltipProps) {
  const info = ACCESSIBILITY_GLOSSARY[term]
  
  if (!info) {
    console.warn(`No accessibility info found for term: ${term}`)
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black rounded-sm">
            {children}
            {showIcon && (
              <InfoIcon 
                className="h-3 w-3 text-cyan-300/70 hover:text-cyan-300 transition-colors" 
                aria-hidden="true"
              />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className={cn(
            "max-w-xs p-4 bg-black/90 border border-cyan-300/30 text-white text-sm rounded-lg shadow-xl z-50",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
            className
          )}
        >
          <div className="space-y-2">
            <div className="font-semibold text-cyan-300">{info.term}</div>
            <div className="text-white/90">{info.definition}</div>
            {info.analogy && (
              <div className="text-amber-300/90 text-xs italic">
                💡 {info.analogy}
              </div>
            )}
            {info.context && (
              <div className="text-white/70 text-xs">
                {info.context}
              </div>
            )}
            {info.units && (
              <div className="text-cyan-300/70 text-xs font-mono">
                Units: {info.units}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface InlineExplanationProps {
  term: string
  value: string | number
  className?: string
}

export function InlineExplanation({ term, value, className }: InlineExplanationProps) {
  const info = ACCESSIBILITY_GLOSSARY[term]
  
  if (!info) {
    return <span className={className}>{value}</span>
  }

  return (
    <AccessibleTooltip term={term} showIcon={false}>
      <span className={cn("underline decoration-dotted decoration-cyan-300/50 underline-offset-2", className)}>
        {value}
      </span>
    </AccessibleTooltip>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }