import { PaginationInfo } from '@/types/api'

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor?: string
  previousCursor?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  maxLimit?: number
}

export interface UsePaginationReturn {
  pagination: PaginationState
  params: PaginationParams
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setCursor: (cursor: string | undefined) => void
  nextPage: () => void
  previousPage: () => void
  reset: () => void
  updateFromResponse: (paginationInfo: PaginationInfo) => void
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialLimit = 10,
    maxLimit = 100
  } = options

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: initialLimit,
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: undefined,
    previousCursor: undefined
  })

  const [params, setParams] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit
  })

  const setPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, pagination.totalPages || 1))
    setPagination(prev => ({ ...prev, currentPage: validPage }))
    setParams(prev => ({ ...prev, page: validPage }))
  }, [pagination.totalPages])

  const setLimit = useCallback((limit: number) => {
    const validLimit = Math.max(1, Math.min(limit, maxLimit))
    setPagination(prev => ({ ...prev, itemsPerPage: validLimit }))
    setParams(prev => ({ ...prev, limit: validLimit }))
  }, [maxLimit])

  const setCursor = useCallback((cursor: string | undefined) => {
    setParams(prev => ({ ...prev, cursor }))
  }, [])

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      if (pagination.nextCursor) {
        setCursor(pagination.nextCursor)
      } else {
        setPage(pagination.currentPage + 1)
      }
    }
  }, [pagination.hasNextPage, pagination.nextCursor, pagination.currentPage, setCursor, setPage])

  const previousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      if (pagination.previousCursor) {
        setCursor(pagination.previousCursor)
      } else {
        setPage(pagination.currentPage - 1)
      }
    }
  }, [pagination.hasPreviousPage, pagination.previousCursor, pagination.currentPage, setCursor, setPage])

  const reset = useCallback(() => {
    setPagination({
      currentPage: initialPage,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: initialLimit,
      hasNextPage: false,
      hasPreviousPage: false,
      nextCursor: undefined,
      previousCursor: undefined
    })
    setParams({
      page: initialPage,
      limit: initialLimit
    })
  }, [initialPage, initialLimit])

  const updateFromResponse = useCallback((paginationInfo: PaginationInfo) => {
    setPagination({
      currentPage: paginationInfo.currentPage,
      totalPages: paginationInfo.totalPages,
      totalItems: paginationInfo.totalItems,
      itemsPerPage: paginationInfo.itemsPerPage,
      hasNextPage: paginationInfo.hasNextPage,
      hasPreviousPage: paginationInfo.hasPreviousPage,
      nextCursor: paginationInfo.nextCursor,
      previousCursor: paginationInfo.previousCursor
    })
  }, [])

  return {
    pagination,
    params,
    setPage,
    setLimit,
    setCursor,
    nextPage,
    previousPage,
    reset,
    updateFromResponse
  }
}

// Utility function to generate pagination controls
export function generatePaginationControls(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const controls: (number | 'ellipsis')[] = []
  const half = Math.floor(maxVisible / 2)

  if (currentPage <= half) {
    // Show first pages
    for (let i = 1; i <= maxVisible - 1; i++) {
      controls.push(i)
    }
    controls.push('ellipsis')
    controls.push(totalPages)
  } else if (currentPage >= totalPages - half) {
    // Show last pages
    controls.push(1)
    controls.push('ellipsis')
    for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
      controls.push(i)
    }
  } else {
    // Show middle pages
    controls.push(1)
    controls.push('ellipsis')
    for (let i = currentPage - Math.floor((maxVisible - 4) / 2); i <= currentPage + Math.floor((maxVisible - 4) / 2); i++) {
      controls.push(i)
    }
    controls.push('ellipsis')
    controls.push(totalPages)
  }

  return controls
}

// Utility function to calculate offset for cursor-based pagination
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

// Utility function to create pagination query parameters
export function createPaginationParams(
  page: number,
  limit: number,
  cursor?: string
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page,
    limit
  }

  if (cursor) {
    params.cursor = cursor
  }

  return params
}

// Hook for infinite scroll pagination
export interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): React.RefObject<HTMLDivElement> {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options

  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [callback, threshold, rootMargin, enabled])

  return elementRef
}

// Import React hooks
import { useState, useCallback, useEffect, useRef } from 'react'
