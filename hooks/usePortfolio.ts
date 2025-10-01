'use client'

import { useState, useEffect } from 'react'
import { portfolioAPI } from '@/lib/api'
import { Portfolio } from '@/types/api'

interface UsePortfolioOptions {
  userId?: string
  isOwnPortfolio?: boolean
  autoFetch?: boolean
}

export function usePortfolio(options: UsePortfolioOptions = {}) {
  const { userId, isOwnPortfolio = false, autoFetch = true } = options
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (isOwnPortfolio) {
        response = await portfolioAPI.getMyPortfolios()
      } else if (userId) {
        response = await portfolioAPI.getUserPortfolios(userId)
      } else {
        response = await portfolioAPI.getAll()
      }
      
      setPortfolios(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch portfolios')
      console.error('Error fetching portfolios:', err)
    } finally {
      setLoading(false)
    }
  }

  const createPortfolio = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await portfolioAPI.create(formData)
      await fetchPortfolios() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create portfolio')
      console.error('Error creating portfolio:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePortfolio = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await portfolioAPI.update(id, formData)
      await fetchPortfolios() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update portfolio')
      console.error('Error updating portfolio:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePortfolio = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await portfolioAPI.delete(id)
      setPortfolios(portfolios.filter(p => p.id !== id))
    } catch (err) {
      setError('Failed to delete portfolio')
      console.error('Error deleting portfolio:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMedia = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await portfolioAPI.removeMedia(id)
      await fetchPortfolios() // Refresh the list
    } catch (err) {
      setError('Failed to remove media')
      console.error('Error removing media:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchPortfolios()
    }
  }, [userId, isOwnPortfolio, autoFetch])

  return {
    portfolios,
    loading,
    error,
    fetchPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    removeMedia,
    setError
  }
}
