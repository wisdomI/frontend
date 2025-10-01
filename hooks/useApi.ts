import { useState, useCallback } from 'react'
import { ApiResponse, ApiError } from '@/types/api'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiFunction(...args)
      const data = (response as any).data.data || (response as any).data
      setState({ data, loading: false, error: null })
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      return null
    }
  }, [apiFunction])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}

export function useApiList<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T[]>>
): UseApiReturn<T[]> {
  return useApi<T[]>(apiFunction)
}

export function useApiMutation<T = any, P = any>(
  apiFunction: (params: P) => Promise<ApiResponse<T>>
): UseApiReturn<T> & { mutate: (params: P) => Promise<T | null> } {
  const api = useApi<T>(apiFunction)
  
  const mutate = useCallback(async (params: P): Promise<T | null> => {
    return api.execute(params)
  }, [api.execute])

  return { ...api, mutate }
}
