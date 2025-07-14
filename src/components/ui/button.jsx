import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 after:bg-white/10 after:absolute after:inset-0 after:content-[''] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 after:bg-white/10 after:absolute after:inset-0 after:content-[''] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 after:bg-white/10 after:absolute after:inset-0 after:content-[''] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
        glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        pill: "rounded-[2rem]",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce-subtle",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent cursor-wait before:absolute before:inset-0 before:flex before:items-center before:justify-center before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-transparent before:border-t-current before:animate-spin",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      animation: "none",
      isLoading: false,
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  rounded,
  animation,
  isLoading = false,
  asChild = false,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  // If asChild is true, we need to make sure we only have one child
  if (asChild && React.Children.count(props.children) > 1) {
    console.warn('Button: asChild should only be used with a single child element');
    asChild = false;
  }

  // If there's no valid child element for Slot to clone
  if (asChild && !React.isValidElement(props.children)) {
    console.warn('Button: asChild requires a valid React element as child');
    asChild = false;
  }

  const Comp = asChild ? Slot : "button";
  
  const content = (
    <>
      {leftIcon && !isLoading && <span className="mr-1">{leftIcon}</span>}
      {props.children}
      {rightIcon && !isLoading && <span className="ml-1">{rightIcon}</span>}
    </>
  );

  return (
    <Comp
      className={cn(buttonVariants({ 
        variant, 
        size, 
        rounded,
        animation,
        isLoading,
        className 
      }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {asChild ? props.children : content}
    </Comp>
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
