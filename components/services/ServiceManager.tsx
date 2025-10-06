'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { serviceAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { ServiceOffering } from '@/types/api'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage, FiDollarSign, FiClock, FiToggleLeft, FiToggleRight, FiTag } from 'react-icons/fi'

interface ServiceManagerProps {
  userId?: string
  isOwnServices?: boolean
}

export default function ServiceManager({ userId, isOwnServices = false }: ServiceManagerProps) {
  const { user } = useAuthContext()
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null)

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
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
  }, [isOwnServices, userId])

  useEffect(() => {
    fetchServices()
  }, [userId, isOwnServices, fetchServices])

  // Delete service
  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      await serviceAPI.delete(serviceId)
      setServices(services.filter(s => s.id !== serviceId))
    } catch (err) {
      setError('Failed to delete service')
      console.error('Error deleting service:', err)
    }
  }

  // Toggle service status
  const handleToggleStatus = async (service: ServiceOffering) => {
    try {
      const formData = new FormData()
      formData.append('isActive', (!service.isActive).toString())
      
      await serviceAPI.update(service.id, formData)
      await fetchServices() // Refresh the list
    } catch (err) {
      setError('Failed to update service status')
      console.error('Error updating service:', err)
    }
  }

  // Remove media from service
  const handleRemoveMedia = async (serviceId: string) => {
    try {
      await serviceAPI.removeMedia(serviceId)
      await fetchServices() // Refresh the list
    } catch (err) {
      setError('Failed to remove media')
      console.error('Error removing media:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchServices}
          className="mt-2 text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isOwnServices ? 'My Services' : 'Service Offerings'}
        </h2>
        {isOwnServices && user?.accountType === 'vendor' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500">
            {isOwnServices ? 'Add your first service to start getting bookings' : 'No services available yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Service Media */}
              <div className="aspect-video bg-gray-100 relative">
                {service.mediaUrl && service.mediaUrl.length > 0 ? (
                  <Image 
                    src={service.mediaUrl[0]} 
                    alt={service.serviceName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiImage className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Action Buttons */}
                {isOwnServices && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleToggleStatus(service)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      title={service.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {service.isActive ? (
                        <FiToggleRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <FiToggleLeft className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FiEdit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {service.serviceName}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-green-600 font-semibold">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    <span>${service.price}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FiTag className="w-4 h-4 mr-1" />
                    <span>{service.pricingTitle}</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiImage className="w-3 h-3 mr-1" />
                    <span>{service.mediaUrl?.length || 0} images</span>
                  </div>
                  <span>
                    Created {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Service Modal */}
      {(showCreateModal || editingService) && (
        <CreateEditServiceModal
          service={editingService}
          onClose={() => {
            setShowCreateModal(false)
            setEditingService(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingService(null)
            fetchServices()
          }}
        />
      )}
    </div>
  )
}

// Create/Edit Service Modal Component
interface CreateEditServiceModalProps {
  service?: ServiceOffering | null
  onClose: () => void
  onSuccess: () => void
}

function CreateEditServiceModal({ service, onClose, onSuccess }: CreateEditServiceModalProps) {
  const [formData, setFormData] = useState({
    serviceName: service?.serviceName || '',
    description: service?.description || '',
    categoryIds: service?.categoryIds?.join(', ') || '',
    pricingTitle: service?.pricingTitle || '',
    price: service?.price?.toString() || '',
    isActive: service?.isActive?.toString() || 'true'
  })
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      
      // Add service offering data
      const serviceOffering = {
        serviceName: formData.serviceName,
        description: formData.description,
        categoryIds: formData.categoryIds.split(',').map(id => id.trim()).filter(Boolean),
        pricingTitle: formData.pricingTitle,
        price: parseFloat(formData.price)
      }
      
      formDataToSend.append('serviceOfferings', JSON.stringify([serviceOffering]))

      // Add media files
      mediaFiles.forEach((file) => {
        formDataToSend.append('mediaUrl', file)
      })

      if (service) {
        await serviceAPI.update(service.id, formDataToSend)
      } else {
        await serviceAPI.create(formDataToSend)
      }

      onSuccess()
    } catch (err) {
      setError('Failed to save service')
      console.error('Error saving service:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      setError('Maximum 5 files allowed')
      return
    }
    setMediaFiles(files)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {service ? 'Edit Service' : 'Create Service'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price and Pricing Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Title *
                </label>
                <input
                  type="text"
                  value={formData.pricingTitle}
                  onChange={(e) => setFormData({...formData, pricingTitle: e.target.value})}
                  placeholder="e.g., Per Hour, Per Project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Category IDs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category IDs
              </label>
              <input
                type="text"
                value={formData.categoryIds}
                onChange={(e) => setFormData({...formData, categoryIds: e.target.value})}
                placeholder="Enter category IDs separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Files (Max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {mediaFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected {mediaFiles.length} file(s)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (service ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
