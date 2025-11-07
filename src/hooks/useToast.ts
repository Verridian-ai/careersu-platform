/**
 * useToast Hook
 *
 * Custom React hook for using toast notifications.
 * Provides a consistent interface for showing notifications.
 *
 * @example
 * ```tsx
 * const { success, error } = useToast()
 *
 * const handleSave = async () => {
 *   try {
 *     await saveData()
 *     success('Data saved successfully!')
 *   } catch (err) {
 *     error('Failed to save data')
 *   }
 * }
 * ```
 */

import { toast } from '@/lib/toast'

/**
 * Hook for toast notifications
 */
export function useToast() {
  return {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    loading: toast.loading,
    promise: toast.promise,
    custom: toast.custom,
    dismiss: toast.dismiss,
  }
}

export default useToast
