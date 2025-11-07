import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Button from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4 sm:mx-8",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full glass-modal rounded-2xl shadow-2xl animate-slide-up",
          "max-h-[90vh] overflow-hidden flex flex-col",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 sm:p-6 border-b border-white/20",
        className
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0 ml-4"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4 sm:p-6 smooth-scroll", className)}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3",
        "p-4 sm:p-6 border-t border-white/20",
        className
      )}
    >
      {children}
    </div>
  )
}

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => {
  return (
    <h2
      className={cn(
        "text-lg sm:text-xl md:text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export const ModalDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => {
  return (
    <p
      className={cn("text-sm sm:text-base text-muted-foreground mt-1", className)}
      {...props}
    />
  )
}
