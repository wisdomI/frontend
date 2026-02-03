'use client'

import { useState, useEffect, useCallback } from 'react'
import { categoryAPI } from '@/lib/api'
import { Category, CategoryStats } from '@/types/api'

interface UseCategoriesOptions {
  autoFetch?: boolean
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { autoFetch = true } = options
  const [categories, setCategories] = useState<Category[]>([])
  const [mainCategories, setMainCategories] = useState<Category[]>([])
  const [hierarchy, setHierarchy] = useState<Category[]>([])
  const [stats, setStats] = useState<CategoryStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getAll()
      setCategories(response.data.data || [])
    } catch (err: any) {
      console.error('Error fetching categories:', err.message || 'Unknown error')
      setError('Failed to fetch categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMainCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getMain()
      setMainCategories(response.data.data || [])
    } catch (err: any) {
      console.error('Error fetching main categories:', err.message || 'Unknown error')
      setError('Failed to fetch main categories')
      setMainCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHierarchy = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getHierarchy()
      const hierarchyData = response.data.data || []
      setHierarchy(hierarchyData)
      // Also populate categories from hierarchy since CategorySidebar uses categories
      setCategories(hierarchyData)
    } catch (err: any) {
      // Suppress 401 errors for public pages where auth is optional
      if (err.response?.status !== 401) {
        console.error('Error fetching category hierarchy:', err.message || 'Unknown error')
      }
      setError('Failed to fetch category hierarchy')
      setHierarchy([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await categoryAPI.getStats()
      setStats(response.data.data)
    } catch (err: any) {
      // console.error('Error fetching category stats:', err.message)
      
      // If it's a 403 error, it means the API requires special permissions
      // This is expected for some users, so we'll gracefully handle it
      if (err.response?.status === 403) {
        // console.log('Category Stats API requires special permissions - skipping stats')
        setStats(null) // Clear stats so fallback is used
      } else {
        // console.log('Category Stats API error:', err.message)
        setStats(null)
      }
    }
  }, [])

  const getSubcategories = async (parentId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getSubcategories(parentId)
      return response.data.data || []
    } catch (err: any) {
      setError('Failed to fetch subcategories')
      console.error('Error fetching subcategories:', err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.create(data)
      await fetchCategories() // Refresh the list
      await fetchMainCategories() // Refresh main categories
      await fetchHierarchy() // Refresh hierarchy
      return response.data.data
    } catch (err: any) {
      setError('Failed to create category')
      console.error('Error creating category:', err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.update(id, data)
      await fetchCategories() // Refresh the list
      await fetchMainCategories() // Refresh main categories
      await fetchHierarchy() // Refresh hierarchy
      return response.data.data
    } catch (err: any) {
      setError('Failed to update category')
      console.error('Error updating category:', err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await categoryAPI.delete(id)
      setCategories(categories.filter(c => c.id !== id))
      await fetchMainCategories() // Refresh main categories
      await fetchHierarchy() // Refresh hierarchy
    } catch (err: any) {
      setError('Failed to delete category')
      console.error('Error deleting category:', err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await categoryAPI.toggleStatus(id)
      await fetchCategories() // Refresh the list
      await fetchMainCategories() // Refresh main categories
      await fetchHierarchy() // Refresh hierarchy
    } catch (err: any) {
      setError('Failed to toggle category status')
      console.error('Error toggling category status:', err.message || 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      // FIXED: Only fetch hierarchy once instead of 4 simultaneous API calls
      // Hierarchy endpoint contains all data needed
      fetchHierarchy()
    }
  }, [autoFetch]) // FIXED: Removed function dependencies to prevent re-creating effects

  return {
    categories,
    mainCategories,
    hierarchy,
    stats,
    loading,
    error,
    fetchCategories,
    fetchMainCategories,
    fetchHierarchy,
    fetchStats,
    getSubcategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    setError
  }
}
