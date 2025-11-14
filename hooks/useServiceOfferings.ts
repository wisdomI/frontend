import { useState, useEffect, useCallback } from 'react'
import { serviceAPI } from '@/lib/api'
import {
  ServiceOffering,
  CreateServiceOfferingRequest,
  UpdateServiceOfferingRequest,
} from '@/types/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { ServiceOfferingPayloadSchema } from '@/lib/validation'
import { reportNetworkFailure, logError } from '@/lib/logger'

type ExtendedUpdateServiceRequest = UpdateServiceOfferingRequest & {
  serviceOfferings?: CreateServiceOfferingRequest['serviceOfferings']
  isActive?: boolean
}

const appendServiceOfferingsToFormData = (
  formData: FormData,
  offerings?: CreateServiceOfferingRequest['serviceOfferings']
) => {
  if (!offerings || offerings.length === 0) return

  offerings.forEach((offering, index) => {
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
    if (typeof offering.price === 'number') {
      formData.append(`serviceOfferings[${index}][price]`, offering.price.toString())
    }
  })
}

const appendMediaToFormData = (formData: FormData, media?: File[]) => {
  if (!media || media.length === 0) return
  media.forEach(file => {
    formData.append('mediaUrl', file)
  })
}

export const useServiceOfferings = () => {
  const { user } = useAuthContext()
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [service, setService] = useState<ServiceOffering | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyServices = useCallback(async () => {
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
  }, [])

  const fetchAllServices = useCallback(async (params?: any) => {
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
  }, [])

  const fetchUserServices = useCallback(async () => {
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
  }, [])

  const fetchServiceById = useCallback(async (id: string) => {
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
  }, [])

  const createService = useCallback(async (data: CreateServiceOfferingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const parsed = ServiceOfferingPayloadSchema.parse(data)
      const formData = new FormData()
      appendServiceOfferingsToFormData(formData, parsed.serviceOfferings)
      appendMediaToFormData(formData, parsed.mediaUrl as File[] | undefined)

      const response = await serviceAPI.create(formData)
      const created = response.data.data
      setServices(prev => (Array.isArray(created) ? [...prev, ...created] : [...prev, created]))
      return response.data
    } catch (err: any) {
      reportNetworkFailure({ operation: 'service.create', error: err })
      logError('Failed to create service offering', { error: err })
      setError(err.response?.data?.message || 'Failed to create service')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateService = useCallback(
    async (id: string, data: ExtendedUpdateServiceRequest) => {
      try {
        setLoading(true)
        setError(null)
        const formData = new FormData()
        const fallbackOffering =
          data.serviceOfferings ||
          (data.serviceName && typeof data.price === 'number'
            ? [
                {
                  serviceName: data.serviceName,
                  description: data.description || '',
                  categoryIds: data.categoryIds || [],
                  pricingTitle: data.pricingTitle || '',
                  price: data.price,
                },
              ]
            : undefined)

        if (!fallbackOffering) {
          throw new Error('At least one service offering must be provided')
        }

        const validated = ServiceOfferingPayloadSchema.parse({
          serviceOfferings: fallbackOffering,
          mediaUrl: data.mediaUrl,
        })

        appendServiceOfferingsToFormData(formData, validated.serviceOfferings)
        appendMediaToFormData(formData, validated.mediaUrl as File[] | undefined)

        if (typeof data.isActive === 'boolean') {
          formData.append('isActive', data.isActive.toString())
        }

        const response = await serviceAPI.update(id, formData)
        setServices(prev =>
          prev.map(service => (service.id === id ? response.data.data : service))
        )
        if (service?.id === id) {
          setService(response.data.data)
        }
        return response.data
      } catch (err: any) {
        reportNetworkFailure({ operation: 'service.update', error: err })
        logError('Failed to update service offering', { error: err, id })
        setError(err.response?.data?.message || 'Failed to update service')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [service]
  )

  const removeMediaFromService = useCallback(async (id: string, mediaUrl: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceAPI.removeMedia(id, mediaUrl)
      setServices(prev =>
        prev.map(service =>
          service.id === id
            ? {
                ...service,
                mediaUrl: service.mediaUrl?.filter(url => url !== mediaUrl) || [],
              }
            : service
        )
      )
    } catch (err: any) {
      reportNetworkFailure({ operation: 'service.removeMedia', error: err })
      setError(err.response?.data?.message || 'Failed to remove media from service')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteService = useCallback(async (id: string) => {
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
  }, [service])

  useEffect(() => {
    if (!user) return
    if (user.accountType === 'vendor') {
      fetchMyServices()
    } else {
      fetchAllServices()
    }
  }, [user, fetchAllServices, fetchMyServices])

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
    setServices,
    setError,
  }
}