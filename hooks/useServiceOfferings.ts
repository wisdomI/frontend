import { useState, useEffect } from 'react'
import { serviceAPI } from '@/lib/api'
import { ServiceOffering, CreateServiceOfferingRequest, UpdateServiceOfferingRequest } from '@/types/api'
import { useAuthContext } from '@/contexts/AuthContext'

export const useServiceOfferings = () => {
  const { user } = useAuthContext()
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [service, setService] = useState<ServiceOffering | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.myServices()
      setServices(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch my services')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchAllServices = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.getAll(params)
      setServices(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch all services')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchUserServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.userServices()
      setServices(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user services')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceAPI.getById(id)
      setService(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch service')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createService = async (data: CreateServiceOfferingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      // Handle service offerings array
      data.serviceOfferings.forEach((offering, index) => {
        if (offering.categoryIds) {
          offering.categoryIds.forEach((categoryId, catIndex) => {
            formData.append(`serviceOfferings[${index}][categoryIds][${catIndex}]`, categoryId)
          })
        }
        if (offering.description) {
          formData.append(`serviceOfferings[${index}][description]`, offering.description)
        }
        if (offering.serviceName) {
          formData.append(`serviceOfferings[${index}][serviceName]`, offering.serviceName)
        }
        if (offering.pricingTitle) {
          formData.append(`serviceOfferings[${index}][pricingTitle]`, offering.pricingTitle)
        }
        if (offering.price) {
          formData.append(`serviceOfferings[${index}][price]`, offering.price.toString())
        }
      })

      // Handle media files
      if (data.mediaUrl) {
        data.mediaUrl.forEach((file) => {
          formData.append('mediaUrl', file)
        })
      }

      const response = await serviceAPI.create(formData)
      setServices(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service')
      throw err
    } finally {
      setLoading(false)
    }
  }

  type ExtendedUpdateServiceRequest = UpdateServiceOfferingRequest & {
    serviceOfferings?: CreateServiceOfferingRequest['serviceOfferings']
  }

  const updateService = async (id: string, data: ExtendedUpdateServiceRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      // Handle service offerings array
      if (data.serviceOfferings) {
        data.serviceOfferings.forEach((offering, index) => {
          if (offering.categoryIds) {
            offering.categoryIds.forEach((categoryId, catIndex) => {
              formData.append(`serviceOfferings[${index}][categoryIds][${catIndex}]`, categoryId)
            })
          }
          if (offering.description) {
            formData.append(`serviceOfferings[${index}][description]`, offering.description)
          }
          if (offering.serviceName) {
            formData.append(`serviceOfferings[${index}][serviceName]`, offering.serviceName)
          }
          if (offering.pricingTitle) {
            formData.append(`serviceOfferings[${index}][pricingTitle]`, offering.pricingTitle)
          }
          if (offering.price) {
            formData.append(`serviceOfferings[${index}][price]`, offering.price.toString())
          }
        })
      }

      // Handle media files
      if (data.mediaUrl) {
        data.mediaUrl.forEach((file) => {
          formData.append('mediaUrl', file)
        })
      }

      const response = await serviceAPI.update(id, formData)
      setServices(prev => 
        prev.map(service => 
          service.id === id ? response.data.data : service
        )
      )
      if (service?.id === id) {
        setService(response.data.data)
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update service')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMediaFromService = async (id: string, mediaUrl: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceAPI.removeMedia(id, mediaUrl)
      await fetchMyServices() // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove media from service')
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
      setServices(prev => prev.filter(service => service.id !== id))
      if (service?.id === id) {
        setService(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete service')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.accountType === 'vendor') {
      fetchMyServices()
    } else {
      fetchAllServices()
    }
  }, [user])

  return {
    services,
    service,
    loading,
    error,
    fetchMyServices,
    fetchAllServices,
    fetchUserServices,
    fetchServiceById,
    createService,
    updateService,
    removeMediaFromService,
    deleteService,
  }
}