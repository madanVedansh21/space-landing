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
const TooltipPortal = TooltipPrimitive.Portal

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
        <TooltipPortal>
          <TooltipContent 
            side={side}
            sideOffset={8}
            className={cn(
              "max-w-md p-5 bg-black/95 border border-cyan-300/30 text-white text-base rounded-lg shadow-2xl z-50",
              "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
              className
            )}
          >
            <div className="space-y-3">
              <div className="font-semibold text-lg text-cyan-300">{info.term}</div>
              <div className="text-white/90 leading-relaxed">{info.definition}</div>
              {info.analogy && (
                <div className="text-amber-300/90 text-sm italic leading-relaxed">
                  💡 {info.analogy}
                </div>
              )}
              {info.context && (
                <div className="text-white/80 text-sm mt-1">
                  {info.context}
                </div>
              )}
              {info.units && (
                <div className="text-cyan-300/80 text-sm font-mono mt-2">
                  Units: {info.units}
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipPortal>
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