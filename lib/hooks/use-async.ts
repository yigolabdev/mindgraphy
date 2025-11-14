/**
 * Custom Hook for async operations
 * 비동기 작업을 위한 Custom Hook
 */

import { useState, useCallback, useEffect } from 'react'
import type { LoadingState } from '../types/common'

export interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  immediate?: boolean
}

export interface UseAsyncReturn<T> {
  data: T | null
  error: Error | null
  status: LoadingState
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isIdle: boolean
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

/**
 * Hook for handling async operations with loading, error, and success states
 * 
 * @example
 * const { data, isLoading, error, execute } = useAsync(
 *   async (id: string) => fetchUser(id),
 *   { immediate: false }
 * )
 * 
 * // Later...
 * execute('user-123')
 */
export function useAsync<T, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const { onSuccess, onError, immediate = false } = options
  
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<LoadingState>('idle')
  
  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setStatus('loading')
      setError(null)
      
      try {
        const result = await asyncFunction(...args)
        setData(result)
        setStatus('success')
        onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
        return null
      }
    },
    [asyncFunction, onSuccess, onError]
  )
  
  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setStatus('idle')
  }, [])
  
  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as Args))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
    execute,
    reset,
  }
}

