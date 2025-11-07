/**
 * Toast Notification Utilities
 *
 * Wrapper utilities for the Sonner toast library.
 * Provides consistent toast notifications across the application.
 *
 * Features:
 * - Success, error, warning, and info toasts
 * - Promise-based loading toasts
 * - Custom styling with glassmorphism
 * - Accessible and mobile-friendly
 *
 * @example
 * ```tsx
 * import { toast } from '@/lib/toast'
 *
 * toast.success('Document saved!')
 * toast.error('Failed to save document')
 * toast.promise(saveDocument(), {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Failed to save'
 * })
 * ```
 */

import { toast as sonnerToast, ExternalToast } from 'sonner'

/**
 * Toast notification utilities
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, options?: ExternalToast) => {
    return sonnerToast.success(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Show an error toast
   */
  error: (message: string, options?: ExternalToast) => {
    return sonnerToast.error(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: ExternalToast) => {
    return sonnerToast.warning(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Show an info toast
   */
  info: (message: string, options?: ExternalToast) => {
    return sonnerToast.info(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Show a loading toast
   */
  loading: (message: string, options?: ExternalToast) => {
    return sonnerToast.loading(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Show a toast with promise handling
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },

  /**
   * Show a custom toast
   */
  custom: (message: string, options?: ExternalToast) => {
    return sonnerToast(message, {
      ...options,
      className: 'glass-card',
    })
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },
}

export default toast
