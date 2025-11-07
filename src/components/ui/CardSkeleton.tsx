/**
 * Card Skeleton Component
 *
 * Specialized skeleton component that matches the Card component structure.
 * Used for loading states in card-based layouts.
 */

import React from 'react'
import Skeleton from './Skeleton'
import { Card, CardHeader, CardContent } from './Card'

export interface CardSkeletonProps {
  /**
   * Show header section
   */
  showHeader?: boolean
  /**
   * Number of content lines to show
   */
  lines?: number
  /**
   * Use glass effect styling
   */
  glass?: boolean
}

/**
 * Card skeleton component for loading states
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showHeader = true,
  lines = 3,
  glass = false,
}) => {
  return (
    <Card glass={glass}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                'h-4',
                index === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

CardSkeleton.displayName = 'CardSkeleton'

// Helper import for className utility
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default CardSkeleton
