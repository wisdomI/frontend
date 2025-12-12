import { useState, useEffect } from 'react'
import { financialAnalyticsAPI } from '@/lib/api'
import { ProfitAnalysis } from '@/types/api'

export const useFinancialAnalytics = () => {
  const [profitAnalysis, setProfitAnalysis] = useState<ProfitAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfitAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await financialAnalyticsAPI.getProfitAnalysis()
      setProfitAnalysis(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profit analysis')
      console.error('Error fetching profit analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfitAnalysis()
  }, [])

  return {
    profitAnalysis,
    loading,
    error,
    refetch: fetchProfitAnalysis
  }
}
