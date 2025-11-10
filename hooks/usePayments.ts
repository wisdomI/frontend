import { useState, useEffect } from 'react'
import { paymentsAPI } from '@/lib/api'

export const usePayments = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentsAPI.getAll()
      setPayments(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payments')
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentAccount = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentsAPI.createAccount(data)
      await fetchAllPayments() // Refresh payments
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment account')
      console.error('Error creating payment account:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePaymentById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await paymentsAPI.deleteById(id)
      await fetchAllPayments() // Refresh payments
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete payment')
      console.error('Error deleting payment:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    refetch: fetchAllPayments,
    createPaymentAccount,
    deletePaymentById
  }
}
