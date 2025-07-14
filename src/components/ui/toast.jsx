import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {}
})

const toastVariants = cva(
  "fixed flex items-center justify-between p-4 rounded-lg shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border",
        success: "bg-green-500 text-white",
        error: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-500 text-white",
        info: "bg-blue-500 text-white",
      },
      position: {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
      animation: {
        slide: "animate-slide-in-right",
        fade: "animate-fade-in",
        bounce: "animate-bounce-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "top-right",
      animation: "slide",
    },
  }
)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((message, options = {}) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = {
      id,
      message,
      ...options,
    }
    setToasts((prev) => [...prev, toast])

    if (options.autoClose !== false) {
      setTimeout(() => {
        removeToast(id)
      }, options.duration || 3000)
    }

    return id
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          position={toast.position}
          animation={toast.animation}
          onClose={() => removeToast(toast.id)}
        >
          {toast.message}
        </Toast>
      ))}
    </>
  )
}

const Toast = React.forwardRef(({ 
  className, 
  variant, 
  position,
  animation,
  onClose,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant, position, animation }), className)}
      {...props}
    >
      <div className="mr-2">{children}</div>
      <button 
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
})
Toast.displayName = "Toast"

export { Toast, toastVariants } 