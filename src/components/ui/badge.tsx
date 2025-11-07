import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "glass"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        // Base styles - mobile first
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        "text-xs sm:text-sm font-semibold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Variant styles
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80":
            variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80":
            variant === "secondary",
          "border-transparent bg-green-600 text-white hover:bg-green-700":
            variant === "success",
          "border-transparent bg-yellow-600 text-white hover:bg-yellow-700":
            variant === "warning",
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80":
            variant === "destructive",
          "text-foreground": variant === "outline",
          "glass-card border-white/30 text-foreground": variant === "glass",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
