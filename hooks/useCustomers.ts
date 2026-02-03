import { useState, useEffect } from 'react'
import { customerAPI } from '@/lib/api'
import { Customer } from '@/types/customer'

interface UseCustomersOptions {
  search?: string
  category?: string
  location?: string
  priceRange?: {
    min: number
    max: number
  }
}

export const useCustomers = (options: UseCustomersOptions = {}) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getAll(options)
      setCustomers(response.data.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch service providers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [options.search, options.category, options.location])

  const refetch = () => {
    setLoading(true)
    fetchCustomers()
  }

  return {
    customers,
    loading,
    error,
    refetch,
  }
}

export const useCustomer = (customerId: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) return

      try {
        setLoading(true)
        const response = await customerAPI.getById(customerId)
        setCustomer(response.data.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch service provider')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId])

  return {
    customer,
    loading,
    error,
  }
}