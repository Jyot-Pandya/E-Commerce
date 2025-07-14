import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        flat: "shadow-none",
        raised: "shadow-md hover:shadow-lg",
        outlined: "border-2 shadow-none",
        glass: "bg-white/20 backdrop-blur-md border-white/20",
        gradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      },
      animation: {
        none: "",
        hover: "hover:-translate-y-1",
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce-subtle",
      },
      padding: {
        default: "",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
      padding: "default",
    },
  }
)

const Card = React.forwardRef(({ 
  className, 
  variant,
  animation,
  padding,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, animation, padding, className }))}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

const CardBadge = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full", className)}
    {...props}>
    {children}
  </div>
))
CardBadge.displayName = "CardBadge"

const CardImage = React.forwardRef(({ className, src, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt}
    className={cn("w-full h-auto object-cover rounded-t-lg", className)}
    {...props} />
))
CardImage.displayName = "CardImage"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardBadge,
  CardImage,
  cardVariants 
}
