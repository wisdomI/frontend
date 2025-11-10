'use client'

import React, { useState, useEffect } from 'react'
import { useServiceOfferings } from '@/hooks/useServiceOfferings'
import { useAuthContext } from '@/contexts/AuthContext'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiSearch, FiImage, FiTag, FiDollarSign } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function ServiceOfferingManager() {
  const { user } = useAuthContext()
  const {
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
    deleteService
  } = useServiceOfferings()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [selectedService, setSelectedService] = useState<any>(null)

  useEffect(() => {
    if (user?.accountType === 'vendor') {
      fetchMyServices()
    } else {
      fetchAllServices()
    }
  }, [user])

  const handleCreateService = async (serviceData: any) => {
    try {
      await createService(serviceData)
      toast.success('Service offering created successfully')
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create service offering')
    }
  }

  const handleUpdateService = async (id: string, serviceData: any) => {
    try {
      await updateService(id, serviceData)
      toast.success('Service offering updated successfully')
      setShowEditModal(false)
      setEditingService(null)
    } catch (err) {
      toast.error('Failed to update service offering')
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service offering?')) {
      try {
        await deleteService(id)
        toast.success('Service offering deleted successfully')
      } catch (err) {
        toast.error('Failed to delete service offering')
      }
    }
  }

  const handleRemoveMedia = async (id: string, mediaUrl: string) => {
    if (confirm('Are you sure you want to remove this media?')) {
      try {
        await removeMediaFromService(id, mediaUrl)
        toast.success('Media removed successfully')
      } catch (err) {
        toast.error('Failed to remove media')
      }
    }
  }

  const handleViewService = async (id: string) => {
    try {
      const service = await fetchServiceById(id)
      setSelectedService(service)
    } catch (err) {
      toast.error('Failed to fetch service details')
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.categoryIds?.includes(categoryFilter)
    const matchesPrice = priceFilter === 'all' || (() => {
      const price = service.price
      switch (priceFilter) {
        case 'under-100': return price < 100
        case '100-500': return price >= 100 && price <= 500
        case '500-1000': return price >= 500 && price <= 1000
        case 'over-1000': return price > 1000
        default: return true
      }
    })()
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'photography': return '📸'
      case 'catering': return '🍽️'
      case 'decoration': return '🎨'
      case 'music': return '🎵'
      case 'venue': return '🏢'
      case 'planning': return '📋'
      default: return '🎯'
    }
  }

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Offerings</h2>
          <p className="text-gray-600">
            {user?.accountType === 'vendor' 
              ? 'Manage your service offerings' 
              : 'Browse available services'}
          </p>
        </div>
        {user?.accountType === 'vendor' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Service</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <FiTag className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="photography">Photography</option>
            <option value="catering">Catering</option>
            <option value="decoration">Decoration</option>
            <option value="music">Music</option>
            <option value="venue">Venue</option>
            <option value="planning">Planning</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <FiDollarSign className="w-4 h-4 text-gray-400" />
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Prices</option>
            <option value="under-100">Under $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="over-1000">Over $1,000</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Service Image */}
            <div className="h-48 bg-gray-200 relative">
              {service.mediaUrl && service.mediaUrl.length > 0 ? (
                <img
                  src={service.mediaUrl[0]}
                  alt="Service"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FiImage className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  1 service
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Service Details */}
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.serviceName}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm">{getCategoryIcon(service.categoryIds?.[0] || '')}</span>
                  <span className="text-xs text-gray-500 capitalize">{service.categoryIds?.[0]}</span>
                </div>
              </div>

              {/* Service Provider Info */}
              {user?.accountType !== 'vendor' && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        SP
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Service Provider
                      </p>
                      <p className="text-xs text-gray-500">
                        Professional Services
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewService(service.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  {user?.accountType === 'vendor' && user?.id === service.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingService(service)
                          setShowEditModal(true)
                        }}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                {user?.accountType !== 'vendor' && (
                  <button
                    onClick={() => handleViewService(service.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Request Service
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No service offerings found</div>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <CreateServiceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateService}
        />
      )}

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <EditServiceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingService(null)
          }}
          service={editingService}
          onSubmit={(data: any) => handleUpdateService(editingService.id, data)}
          onRemoveMedia={handleRemoveMedia}
        />
      )}

      {/* View Service Modal */}
      {selectedService && (
        <ViewServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onRequestService={(serviceData: any) => {
            // Handle service request
            console.log('Request service:', serviceData)
          }}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  )
}

// Placeholder components - these would need to be implemented
function CreateServiceModal({ isOpen, onClose, onSubmit }: any) {
  return null
}

function EditServiceModal({ isOpen, onClose, service, onSubmit, onRemoveMedia }: any) {
  return null
}

function ViewServiceModal({ isOpen, onClose, service, onRequestService }: any) {
  return null
}
