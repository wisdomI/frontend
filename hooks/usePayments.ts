'use client'

import { useState, useEffect, useCallback } from 'react'
import { paymentsAPI } from '@/lib/api'
import { PaymentAccountSchema, PaymentAccountPayload } from '@/lib/validation'
import { reportNetworkFailure, logError } from '@/lib/logger'

type PaymentRecord = any

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: any, fallback: string, context: string) => {
    reportNetworkFailure({ operation: context, error: err })
    logError(fallback, { error: err, context })
    setError(err?.response?.data?.message || fallback)
  }

  const fetchAllPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentsAPI.getAll()
      setPayments(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch payments', 'payments.fetchAll')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPaymentAccount = useCallback(
    async (data: PaymentAccountPayload) => {
      try {
        setLoading(true)
        setError(null)
        const payload = PaymentAccountSchema.parse(data)
        const response = await paymentsAPI.createAccount(payload)
        await fetchAllPayments()
        return response.data.data
      } catch (err: any) {
        handleError(err, 'Failed to create payment account', 'payments.createAccount')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchAllPayments]
  )

  const deletePaymentById = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        setError(null)
        await paymentsAPI.deleteById(id)
        await fetchAllPayments()
      } catch (err: any) {
        handleError(err, 'Failed to delete payment', 'payments.delete')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchAllPayments]
  )

  useEffect(() => {
    fetchAllPayments()
  }, [fetchAllPayments])

  return {
    payments,
    loading,
    error,
    refetch: fetchAllPayments,
    createPaymentAccount,
    deletePaymentById,
  }
}
