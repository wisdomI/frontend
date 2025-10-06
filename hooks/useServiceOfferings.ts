import { useState, useEffect } from 'react'
import { serviceAPI } from '@/lib/api'
import { ServiceOffering, CreateServiceOfferingRequest, UpdateServiceOfferingRequest } from '@/types/api'

export const useServiceOfferings = () => {
  const [serviceOfferings, setServiceOfferings] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.myServices()
      setServiceOfferings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch service offerings')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.userServices()
      setServiceOfferings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user services')
    } finally {
      setLoading(false)
    }
  }

  const createServiceOffering = async (data: CreateServiceOfferingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      // Add service offerings array
      data.serviceOfferings.forEach((service, index) => {
        formData.append(`serviceOfferings[${index}][serviceName]`, service.serviceName)
        formData.append(`serviceOfferings[${index}][description]`, service.description)
        formData.append(`serviceOfferings[${index}][pricingTitle]`, service.pricingTitle)
        formData.append(`serviceOfferings[${index}][price]`, service.price.toString())
        
        service.categoryIds.forEach((categoryId, catIndex) => {
          formData.append(`serviceOfferings[${index}][categoryIds][${catIndex}]`, categoryId)
        })
      })
      
      // Add media files
      data.mediaUrl.forEach((file) => {
        formData.append('mediaUrl', file)
      })

      const response = await serviceAPI.create(formData)
      setServiceOfferings(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service offering')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateServiceOffering = async (id: string, data: UpdateServiceOfferingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      if (data.serviceName) {
        formData.append('serviceName', data.serviceName)
      }
      if (data.description) {
        formData.append('description', data.description)
      }
      if (data.pricingTitle) {
        formData.append('pricingTitle', data.pricingTitle)
      }
      if (data.price !== undefined) {
        formData.append('price', data.price.toString())
      }
      if (data.categoryIds) {
        data.categoryIds.forEach((categoryId, index) => {
          formData.append(`categoryIds[${index}]`, categoryId)
        })
      }
      if (data.mediaUrl) {
        data.mediaUrl.forEach((file) => {
          formData.append('mediaUrl', file)
        })
      }

      const response = await serviceAPI.update(id, formData)
      setServiceOfferings(prev => 
        prev.map(service => 
          service.id === id ? response.data.data : service
        )
      )
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update service offering')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteServiceOffering = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceAPI.delete(id)
      setServiceOfferings(prev => prev.filter(service => service.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete service offering')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getServiceOfferingById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch service offering')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyServices()
  }, [])

  return {
    serviceOfferings,
    loading,
    error,
    fetchMyServices,
    fetchUserServices,
    createServiceOffering,
    updateServiceOffering,
    deleteServiceOffering,
    getServiceOfferingById,
  }
}