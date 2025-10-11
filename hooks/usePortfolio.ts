import { useState, useEffect } from 'react'
import { portfolioAPI } from '@/lib/api'
import { Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/types/api'
import { useAuthContext } from '@/contexts/AuthContext'

export const usePortfolio = () => {
  const { user } = useAuthContext()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      if (user?.id) {
        const response = await portfolioAPI.getUserPortfolios(user.id)
        setPortfolios(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch portfolios')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPortfolios = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await portfolioAPI.getUserPortfolios(userId)
      setPortfolios(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user portfolios')
    } finally {
      setLoading(false)
    }
  }

  const createPortfolio = async (data: CreatePortfolioRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      formData.append('projectTitle', data.projectTitle)
      formData.append('description', data.description)
      
      data.mediaUrl.forEach((file, index) => {
        formData.append('mediaUrl', file)
      })

      const response = await portfolioAPI.create(formData)
      setPortfolios(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create portfolio')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePortfolio = async (id: string, data: UpdatePortfolioRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      if (data.projectTitle) {
        formData.append('projectTitle', data.projectTitle)
      }
      if (data.description) {
        formData.append('description', data.description)
      }
      if (data.mediaUrl) {
        data.mediaUrl.forEach((file) => {
          formData.append('mediaUrl', file)
        })
      }

      const response = await portfolioAPI.update(id, formData)
      setPortfolios(prev => 
        prev.map(portfolio => 
          portfolio.id === id ? response.data.data : portfolio
        )
      )
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update portfolio')
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
      setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete portfolio')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getPortfolioById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await portfolioAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch portfolio')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyPortfolios()
  }, [])

  return {
    portfolios,
    loading,
    error,
    fetchMyPortfolios,
    fetchUserPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    getPortfolioById,
  }
}