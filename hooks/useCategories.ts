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
    } catch (err) {
      setError('Failed to fetch categories')
      console.error('Error fetching categories:', err)
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
    } catch (err) {
      setError('Failed to fetch main categories')
      console.error('Error fetching main categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHierarchy = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getHierarchy()
      setHierarchy(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch category hierarchy')
      console.error('Error fetching category hierarchy:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await categoryAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching category stats:', err)
    }
  }, [])

  const getSubcategories = async (parentId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryAPI.getSubcategories(parentId)
      return response.data.data || []
    } catch (err) {
      setError('Failed to fetch subcategories')
      console.error('Error fetching subcategories:', err)
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
    } catch (err) {
      setError('Failed to create category')
      console.error('Error creating category:', err)
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
    } catch (err) {
      setError('Failed to update category')
      console.error('Error updating category:', err)
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
    } catch (err) {
      setError('Failed to delete category')
      console.error('Error deleting category:', err)
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
    } catch (err) {
      setError('Failed to toggle category status')
      console.error('Error toggling category status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchCategories()
      fetchMainCategories()
      fetchHierarchy()
      fetchStats()
    }
  }, [autoFetch, fetchCategories, fetchMainCategories, fetchHierarchy, fetchStats])

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
