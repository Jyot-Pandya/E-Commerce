import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({
  className,
  type,
  icon,
  label,
  error,
  containerClassName,
  ...props
}, ref) => {
  const id = React.useId()
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive animate-slide-in-bottom">{error}</p>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input } 