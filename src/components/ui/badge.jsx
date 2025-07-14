import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-white",
        info: "border-transparent bg-blue-500 text-white",
        gradient: "border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce-subtle",
      },
      size: {
        default: "h-6 text-xs",
        sm: "h-5 text-[10px]",
        lg: "h-7 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
      size: "default",
    },
  }
)

function Badge({ 
  className, 
  variant, 
  animation,
  size,
  ...props 
}) {
  return (
    <div className={cn(badgeVariants({ variant, animation, size, className }))} {...props} />
  )
}

export { Badge, badgeVariants } 