/**
 * Skeleton Component
 *
 * A loading skeleton component for displaying placeholder content
 * while data is being fetched. Provides a smooth loading experience.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * ```
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * Whether to show animation (default: true)
   */
  animate?: boolean
}

/**
 * Skeleton component for loading states
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-muted',
          animate && 'animate-pulse',
          className
        )}
        role="status"
        aria-label="Loading..."
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
