'use client'

import { useState, useEffect } from 'react'
import { serviceAPI } from '@/lib/api'
import { ServiceOffering } from '@/types/api'

interface UseServiceOfferingsOptions {
  userId?: string
  isOwnServices?: boolean
  autoFetch?: boolean
}

export function useServiceOfferings(options: UseServiceOfferingsOptions = {}) {
  const { userId, isOwnServices = false, autoFetch = true } = options
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (isOwnServices) {
        response = await serviceAPI.userServices()
      } else if (userId) {
        // For now, we'll use getAll and filter by userId if needed
        response = await serviceAPI.getAll()
      } else {
        response = await serviceAPI.getAll()
      }
      
      setServices(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch services')
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.create(formData)
      await fetchServices() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create service')
      console.error('Error creating service:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.update(id, formData)
      await fetchServices() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update service')
      console.error('Error updating service:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteService = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceAPI.delete(id)
      setServices(services.filter(s => s.id !== id))
    } catch (err) {
      setError('Failed to delete service')
      console.error('Error deleting service:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMedia = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceAPI.removeMedia(id)
      await fetchServices() // Refresh the list
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
      fetchServices()
    }
  }, [userId, isOwnServices, autoFetch])

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    removeMedia,
    setError
  }
}
