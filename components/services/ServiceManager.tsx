'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import {
  FiDollarSign,
  FiImage,
  FiPlus,
  FiTag,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiEdit2,
} from 'react-icons/fi'
import { ButtonLoader } from '@/components/ui/Loader'
import { CreateServiceOfferingRequest, ServiceOffering } from '@/types/api'
import { useServiceOfferings } from '@/hooks/useServiceOfferings'
import { useCategories } from '@/hooks/useCategories'

interface ServiceManagerProps {
  userId?: string
  isOwnServices?: boolean
}

export default function ServiceManager({ userId, isOwnServices = false }: ServiceManagerProps) {
  const {
    services,
    loading,
    error,
    fetchMyServices,
    fetchAllServices,
    createService,
    updateService,
    deleteService,
    removeMediaFromService,
  } = useServiceOfferings()
  const { hierarchy, fetchHierarchy, loading: categoriesLoading } = useCategories({ autoFetch: true })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null)

  useEffect(() => {
    if (isOwnServices) {
      fetchMyServices()
    } else {
      fetchAllServices()
    }
  }, [isOwnServices, fetchAllServices, fetchMyServices])

  useEffect(() => {
    fetchHierarchy()
  }, [fetchHierarchy])

  const displayedServices = useMemo(
    () => (userId ? services.filter(service => service.userId === userId) : services),
    [services, userId]
  )

  const refreshServices = () => (isOwnServices ? fetchMyServices() : fetchAllServices())

  const handleCreate = async (payload: CreateServiceOfferingRequest) => {
    await createService(payload)
    toast.success('Service offering created')
    await refreshServices()
  }

  const handleUpdate = async (serviceId: string, payload: CreateServiceOfferingRequest) => {
    await updateService(serviceId, {
      serviceOfferings: payload.serviceOfferings,
      mediaUrl: payload.mediaUrl,
    })
    toast.success('Service offering updated')
    await refreshServices()
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Delete this service?')) return
    await deleteService(serviceId)
    toast.success('Service deleted')
  }

  const handleToggleStatus = async (service: ServiceOffering) => {
    await updateService(service.id, { isActive: !service.isActive })
    toast.success(`Service ${service.isActive ? 'deactivated' : 'activated'}`)
  }

  const handleRemoveMedia = async (serviceId: string, mediaUrl: string) => {
    if (!confirm('Remove this media file?')) return
    await removeMediaFromService(serviceId, mediaUrl)
    toast.success('Media removed')
  }

  if (loading && displayedServices.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button onClick={refreshServices} className="mt-2 text-red-600 hover:text-red-700 underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isOwnServices ? 'My Services' : 'Service Offerings'}
          </h2>
          <p className="text-sm text-gray-600">
            Publish compelling offers so clients can understand your value.
          </p>
        </div>
        {isOwnServices && (
          <button
            onClick={() => {
              setEditingService(null)
              setModalOpen(true)
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus className="w-4 h-4" />
            Add Service
          </button>
        )}
      </div>

      {displayedServices.length === 0 ? (
        <div className="text-center py-12">
          <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No services yet</h3>
          <p className="text-gray-500 mt-2">
            {isOwnServices
              ? 'Add your first service to start receiving offers.'
              : 'This vendor has not published any services yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedServices.map(service => (
            <div key={service.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {service.mediaUrl?.length ? (
                  <Image
                    src={service.mediaUrl[0]}
                    alt={service.serviceName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <FiImage className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {isOwnServices && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleToggleStatus(service)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition"
                      title={service.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {service.isActive ? (
                        <FiToggleRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <FiToggleLeft className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingService(service)
                        setModalOpen(true)
                      }}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition"
                    >
                      <FiEdit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{service.serviceName}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600 font-semibold">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    <span>{service.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiTag className="w-4 h-4 mr-1" />
                    <span>{service.pricingTitle}</span>
                  </div>
                </div>

                {service.mediaUrl?.length && isOwnServices ? (
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">Attached media ({service.mediaUrl.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {service.mediaUrl.map(url => (
                        <button
                          key={url}
                          onClick={() => handleRemoveMedia(service.id, url)}
                          className="text-red-500 underline"
                        >
                          Remove
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Categories: {service.categoryIds?.length || 0}</span>
                  <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ServiceModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditingService(null)
          }}
          onSubmit={async payload => {
            if (editingService) {
              await handleUpdate(editingService.id, payload)
            } else {
              await handleCreate(payload)
            }
          }}
          loading={loading}
          categories={hierarchy}
          categoriesLoading={categoriesLoading}
          initialService={editingService}
        />
      )}
    </div>
  )
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateServiceOfferingRequest) => Promise<void>
  loading: boolean
  categories: Array<{ id: string; name: string }>
  categoriesLoading: boolean
  initialService?: ServiceOffering | null
}

function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  categories,
  categoriesLoading,
  initialService,
}: ServiceModalProps) {
  const [serviceName, setServiceName] = useState(initialService?.serviceName || '')
  const [description, setDescription] = useState(initialService?.description || '')
  const [pricingTitle, setPricingTitle] = useState(initialService?.pricingTitle || '')
  const [price, setPrice] = useState(initialService?.price?.toString() || '')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialService?.categoryIds || [])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (initialService) {
      setServiceName(initialService.serviceName)
      setDescription(initialService.description)
      setPricingTitle(initialService.pricingTitle)
      setPrice(initialService.price.toString())
      setCategoryIds(initialService.categoryIds || [])
    } else {
      setServiceName('')
      setDescription('')
      setPricingTitle('')
      setPrice('')
      setCategoryIds([])
      setMediaFiles([])
    }
  }, [initialService])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!serviceName || !description || !pricingTitle || !price) {
      setFormError('Please fill all required fields.')
      return
    }

    const numericPrice = parseFloat(price)
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('Price must be a positive number.')
      return
    }

    const payload: CreateServiceOfferingRequest = {
      serviceOfferings: [
        {
          serviceName,
          description,
          pricingTitle,
          price: numericPrice,
          categoryIds,
        },
      ],
      mediaUrl: mediaFiles,
    }

    try {
      setSubmitting(true)
      setFormError(null)
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setFormError('Unable to save service. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {initialService ? 'Edit Service Offering' : 'Add Service Offering'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiTrash2 className="w-4 h-4 rotate-45 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Title *
                </label>
                <input
                  value={pricingTitle}
                  onChange={e => setPricingTitle(e.target.value)}
                  placeholder="e.g., Per Event"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories *
              </label>
              <select
                multiple
                value={categoryIds}
                onChange={e =>
                  setCategoryIds(Array.from(e.target.selectedOptions, option => option.value))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categoriesLoading && <option>Loading categories...</option>}
                {!categoriesLoading &&
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold CTRL/CMD to select multiple categories.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,application/pdf"
                onChange={e => setMediaFiles(Array.from(e.target.files || []))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {mediaFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">Selected {mediaFiles.length} file(s)</p>
              )}
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ButtonLoader loading={loading || submitting} loadingText="Saving...">
                  {initialService ? 'Update Service' : 'Create Service'}
                </ButtonLoader>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

