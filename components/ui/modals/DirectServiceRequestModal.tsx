'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PlusIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/solid'
import SuccessModal from '../modal/SuccessNotificationModal'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'
import { CreateServiceRequestData } from '@/types/api'
import toast from 'react-hot-toast'
import ServiceRequestDatePicker from '@/components/ui/ServiceRequestDatePicker'
import type { ServiceOffering } from '@/types/api'
import { categoryAPI } from '@/lib/api'

export default function DirectServiceRequestModal({ trigger, service, vendorId: vendorIdProp, serviceId: serviceIdProp }: { trigger?: React.ReactNode; service?: ServiceOffering | null; vendorId?: string; serviceId?: string }) {
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isAuthenticated, user } = useAuthContext()
  const router = useRouter()
  const { createRequest } = useVendorServiceRequests({ autoFetch: false })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Allow all authenticated users to create direct service requests to vendors
    if (user?.accountType === 'vendor') {
      toast.error('Vendors cannot request services from other vendors. Please switch to a client account.')
      return
    }
    setIsOpen(true)
  }

  const [formData, setFormData] = useState({
    eventTitle: '',
    eventType: '',
    eventStartDate: '',
    eventEndDate: '',
    eventLocation: '',
    eventCity: '',
    servicesNeeded: [] as string[],
    numberOfGuests: '',
    budgetRange: '',
    additionalInformation: '',
    needsEventPlanner: true,
    needsAISuggestions: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'].includes(file.type)
      const isValidSize = file.size <= 50 * 1024 * 1024
      return isValidType && isValidSize
    })
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false) }
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files) }
  const removeFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))

  const EVENT_TYPES = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' }
  ]

  const [eventTypeOpen, setEventTypeOpen] = useState(false)

  const [servicesOpen, setServicesOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    setFormData(prev => ({ ...prev, servicesNeeded: selectedServices }))
  }, [selectedServices])

  // Pre-fill services for direct request from the service's categories if available
  useEffect(() => {
    if (service && Array.isArray((service as any).categoryIds) && (service as any).categoryIds.length > 0) {
      // Use the service's actual category UUIDs instead of display names
      console.log('🔍 Service categoryIds:', (service as any).categoryIds)
      console.log('🔍 Full service object:', service)
      setSelectedServices((service as any).categoryIds as string[])
      setFormData(prev => ({ ...prev, servicesNeeded: (service as any).categoryIds as string[] }))
    }
  }, [service])

  // Fetch available categories when modal opens
  useEffect(() => {
    console.log('🔍 Modal useEffect triggered - isOpen:', isOpen)
    if (isOpen) {
      console.log('🔍 Modal is open, starting category fetch...')
      const fetchCategories = async () => {
        try {
          console.log('🔍 Fetching categories from backend API...')
          console.log('🔍 API URL: /categories/')
          console.log('🔍 Making request now...')
          
          const response = await categoryAPI.getAll()
          console.log('🔍 Categories API response received:', response)
          console.log('🔍 Response data:', response.data)
          console.log('🔍 Response status:', response.status)
          
          const categories = response.data.data || []
          console.log('✅ Successfully fetched', categories.length, 'categories from backend')
          
          if (categories.length > 0) {
            console.log('📋 Available categories:', categories.map(cat => ({ id: cat.id, name: cat.name })))
            setAvailableCategories(categories)
            
            // If we have categories and the service's category IDs are invalid, 
            // update the form with a valid category
            if (service && (service as any).categoryIds) {
              const validCategoryIds = categories.map(cat => cat.id)
              const serviceCategoryIds = (service as any).categoryIds as string[]
              const hasValidCategory = serviceCategoryIds.some(id => validCategoryIds.includes(id))
              
              if (!hasValidCategory) {
                console.log('⚠️ Service category IDs are invalid, updating with first available category')
                const firstCategory = categories[0]
                setSelectedServices([firstCategory.id])
                setFormData(prev => ({ ...prev, servicesNeeded: [firstCategory.id] }))
              } else {
                console.log('✅ Service category IDs are valid')
              }
            }
          } else {
            console.log('⚠️ No categories returned from backend')
            setAvailableCategories([])
          }
        } catch (error: any) {
          console.error('❌ Failed to fetch categories from backend:', error)
          console.log('🔍 Error details:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
          })
          
          // If it's an auth error, that's expected for some endpoints
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🔍 Categories API requires authentication - this is expected')
          }
          
          setAvailableCategories([])
        }
      }
      fetchCategories()
    } else {
      console.log('🔍 Modal is closed, not fetching categories')
    }
  }, [isOpen, service])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isFormValid = () => {
    // For direct requests, servicesNeeded might be pre-filled from service categoryIds
    const hasServices = formData.servicesNeeded.length > 0 || 
                       (service && (service as any).categoryIds && (service as any).categoryIds.length > 0)
    
    return formData.eventTitle.trim() !== '' &&
           formData.eventType !== '' &&
           formData.eventStartDate !== '' &&
           formData.eventEndDate !== '' &&
           formData.eventLocation !== '' &&
           formData.eventCity !== '' &&
           hasServices &&
           formData.numberOfGuests !== '' &&
           formData.budgetRange !== ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 Form submission triggered!')
    
    // Debug authentication and user info
    const token = localStorage.getItem('accessToken')
    const vendorId = vendorIdProp || (service as any)?.userId
    
    console.log('🔍 Direct Request Debug:', {
      hasToken: !!token,
      tokenPreview: token?.substring(0, 30) + '...',
      user: user?.id,
      accountType: user?.accountType,
      isAuthenticated,
      vendorId: vendorId,
      vendorIdProp: vendorIdProp,
      serviceUserId: (service as any)?.userId,
      service: service,
      serviceId: serviceIdProp || (service as any)?.id,
      formData: formData,
      isFormValid: isFormValid()
    })
    
    if (!isFormValid()) {
      console.log('❌ Form validation failed!')
      console.log('Form data:', {
        eventTitle: formData.eventTitle,
        eventType: formData.eventType,
        eventStartDate: formData.eventStartDate,
        eventEndDate: formData.eventEndDate,
        eventLocation: formData.eventLocation,
        eventCity: formData.eventCity,
        servicesNeeded: formData.servicesNeeded,
        numberOfGuests: formData.numberOfGuests,
        budgetRange: formData.budgetRange
      })
      toast.error('Please fill in all required fields')
      return
    }
    
    if (!vendorId) {
      console.log('❌ Vendor ID is missing!')
      toast.error('Vendor ID is required for direct service requests. Please try again from the service page.')
      return
    }
    
    console.log('✅ Form validation passed, proceeding with submission...')
    
    setIsSubmitting(true)
    try {
      console.log('🔍 Step 1: Parsing dates...')
      const startDate = new Date(formData.eventStartDate)
      const endDate = new Date(formData.eventEndDate)
      const now = new Date()
      
      // Set time to start of day for date-only comparison (avoid timezone issues)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      
      console.log('🔍 Date values:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        now: now.toISOString(),
        todayStart: todayStart.toISOString(),
        startDateOnly: startDateOnly.toISOString(),
        startDateValid: startDateOnly >= todayStart,
        endDateValid: endDate > startDate
      })
      
      // Allow today or future dates (compare date only, not time)
      if (startDateOnly < todayStart) { 
        console.log('❌ Start date validation failed - date is in the past!')
        toast.error('Event start date cannot be in the past')
        setIsSubmitting(false)
        return 
      }
      
      if (endDate <= startDate) { 
        console.log('❌ End date validation failed!')
        toast.error('Event end date must be after start date')
        setIsSubmitting(false)
        return 
      }
      
      console.log('🔍 Step 2: Checking services needed...')
      console.log('🔍 formData.servicesNeeded:', formData.servicesNeeded)
      
      if (formData.servicesNeeded.length === 0) { 
        console.log('❌ Services needed validation failed!')
        toast.error('At least one service is required')
        setIsSubmitting(false)
        return 
      }
      
      console.log('✅ All date and service validations passed!')

      // Fix timezone issue: Ensure dates are properly formatted for backend
      const startDateAdjusted = new Date(startDate)
      startDateAdjusted.setUTCHours(12, 0, 0, 0) // Set to 12 PM UTC
      
      // If the adjusted date is still in the past, add 24 hours
      if (startDateAdjusted <= now) {
        console.log('⚠️ Start date still in past after adjustment, adding 24 hours')
        startDateAdjusted.setUTCDate(startDateAdjusted.getUTCDate() + 1)
      }
      
      const endDateAdjusted = new Date(endDate)
      endDateAdjusted.setUTCHours(23, 59, 59, 999) // Set to end of day UTC
      
      // Ensure end date is after adjusted start date
      if (endDateAdjusted <= startDateAdjusted) {
        console.log('⚠️ End date is before/equal to adjusted start date, setting to next day')
        endDateAdjusted.setTime(startDateAdjusted.getTime())
        endDateAdjusted.setUTCDate(endDateAdjusted.getUTCDate() + 1)
        endDateAdjusted.setUTCHours(23, 59, 59, 999)
      }
      
      console.log('🔍 Adjusted dates for UTC:', {
        originalStart: startDate.toISOString(),
        adjustedStart: startDateAdjusted.toISOString(),
        originalEnd: endDate.toISOString(),
        adjustedEnd: endDateAdjusted.toISOString(),
        nowForComparison: now.toISOString(),
        startIsInFuture: startDateAdjusted > now
      })

      // Use service's categoryIds if available, otherwise use form selection
      let servicesNeeded = (service && (service as any).categoryIds && (service as any).categoryIds.length > 0) 
        ? (service as any).categoryIds as string[]
        : formData.servicesNeeded

      // Always validate against available categories and use valid ones
      if (availableCategories.length > 0) {
        const validCategoryIds = availableCategories.map(cat => cat.id)
        console.log('🔍 Available valid category IDs from backend:', validCategoryIds)
        console.log('🔍 Current servicesNeeded:', servicesNeeded)
        
        // Filter to only include valid category IDs
        const validServicesNeeded = servicesNeeded.filter(id => validCategoryIds.includes(id))
        
        if (validServicesNeeded.length === 0) {
          console.log('⚠️ No valid category IDs found, using first available category from backend:', availableCategories[0].id)
          servicesNeeded = [availableCategories[0].id]
        } else {
          console.log('✅ Using valid category IDs from backend:', validServicesNeeded)
          servicesNeeded = validServicesNeeded
        }
      } else {
        console.log('⚠️ No available categories loaded from backend!')
        console.log('⚠️ Attempting to fetch categories now as fallback...')
        
        // Try to fetch categories as a last resort
        try {
          console.log('🔍 Emergency category fetch...')
          const response = await categoryAPI.getAll()
          const categories = response.data.data || []
          console.log('🔍 Emergency fetch result:', categories.length, 'categories')
          
          if (categories.length > 0) {
            console.log('✅ Emergency fetch successful, using first category:', categories[0].id)
            servicesNeeded = [categories[0].id]
            setAvailableCategories(categories)
          } else {
            console.log('❌ Emergency fetch returned no categories')
            toast.error('No service categories available. Please contact support.')
            setIsSubmitting(false)
            return
          }
        } catch (error: any) {
          console.error('❌ Emergency category fetch failed:', error)
          console.log('🔍 Emergency fetch error details:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            data: error.response?.data
          })
          
          toast.error('Unable to load service categories. Please refresh the page and try again.')
          setIsSubmitting(false)
          return
        }
      }

      console.log('🔍 Using servicesNeeded:', servicesNeeded)

      // Create basic service request data without direct request metadata first
      const basicServiceRequestData = {
        eventTitle: formData.eventTitle,
        eventType: formData.eventType,
        eventStartDate: startDateAdjusted.toISOString(),
        eventEndDate: endDateAdjusted.toISOString(),
        eventLocation: formData.eventLocation,
        eventCity: formData.eventCity,
        servicesNeeded: servicesNeeded,
        numberOfGuests: parseInt(formData.numberOfGuests),
        budgetRange: formData.budgetRange,
        additionalInformation: formData.additionalInformation,
        needsEventPlanner: formData.needsEventPlanner,
        needsAISuggestions: formData.needsAISuggestions,
        images: uploadedFiles,
      }

      // Vendor service requests always require FormData
      const formDataToSend = new FormData()
      formDataToSend.append('eventTitle', basicServiceRequestData.eventTitle)
      formDataToSend.append('eventType', basicServiceRequestData.eventType)
      formDataToSend.append('eventStartDate', basicServiceRequestData.eventStartDate)
      formDataToSend.append('eventEndDate', basicServiceRequestData.eventEndDate)
      formDataToSend.append('eventLocation', basicServiceRequestData.eventLocation)
      formDataToSend.append('eventCity', basicServiceRequestData.eventCity)
      
      // Send servicesNeeded as array with brackets notation
      // This ensures the backend receives it as an array
      servicesNeeded.forEach((service) => {
        formDataToSend.append('servicesNeeded[]', service)
      })
      
      console.log('🔍 ServicesNeeded being sent as array:', servicesNeeded)
      
      formDataToSend.append('numberOfGuests', basicServiceRequestData.numberOfGuests.toString())
      formDataToSend.append('budgetRange', basicServiceRequestData.budgetRange)
      formDataToSend.append('additionalInformation', basicServiceRequestData.additionalInformation || '')
      formDataToSend.append('needsEventPlanner', basicServiceRequestData.needsEventPlanner.toString())
      formDataToSend.append('needsAISuggestions', basicServiceRequestData.needsAISuggestions.toString())
      
      // CRITICAL: Add vendorId for direct service requests
      formDataToSend.append('vendorId', vendorId)

      // Add image files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('images', file)
      })

      console.log('🔍 Sending Vendor Service Request FormData')
      console.log('🔍 FormData contents:')
      formDataToSend.forEach((value, key) => {
        console.log(`  ${key}:`, value)
      })
      
      try {
        await createRequest(formDataToSend)
        console.log('✅ Vendor Service Request submission successful')
      } catch (error: any) {
        console.log('🔍 Vendor Service Request submission failed!')
        console.log('🔍 Error status:', error.response?.status)
        console.log('🔍 Error data:', error.response?.data)
        console.log('🔍 Full error response:', JSON.stringify(error.response?.data, null, 2))
        
        // Check if it's a 403 error and provide more specific error message
        if (error.response?.status === 403) {
          toast.error('Permission denied. Please ensure you are logged in and have the necessary permissions to create service requests.')
          return
        }
        
        // Show the specific backend error message
        if (error.response?.data?.message) {
          console.log('❌ Backend error message:', error.response.data.message)
          toast.error(error.response.data.message)
          setIsSubmitting(false)
          return
        }
        
        throw error
      }

      toast.success('Service request sent to vendor successfully!')
      setIsOpen(false)
      setShowSuccess(true)
      setFormData({
        eventTitle: '', eventType: '', eventStartDate: '', eventEndDate: '', eventLocation: '', eventCity: '',
        servicesNeeded: [], numberOfGuests: '', budgetRange: '', additionalInformation: '', needsEventPlanner: true, needsAISuggestions: false,
      })
      setUploadedFiles([])
      setSelectedServices([])
    } catch (error: any) {
      console.error('🔍 Service request creation error:', error)
      
      // Provide more specific error messages based on the error type
      if (error.response?.status === 403) {
        toast.error('Permission denied. Please ensure you are logged in and have the necessary permissions to create service requests.')
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in and try again.')
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid request data. Please check your input and try again.')
      } else {
      toast.error(error.response?.data?.message || 'Failed to send service request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccess = () => setShowSuccess(false)

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Header with AI selector on top, then title */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-4 max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Would you like AI to suggest Best profile for your event?</label>
            <select
              name="needsAISuggestions"
              value={formData.needsAISuggestions ? 'yes' : 'no'}
              onChange={(e) => setFormData(prev => ({ ...prev, needsAISuggestions: e.target.value === 'yes' }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h1 className="text-2xl font-bold text-gray-800">Request Service from Vendor</h1>
              <p className="text-sm text-gray-600 mt-1">Send a direct service request to this vendor</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input type="text" name="eventTitle" value={formData.eventTitle} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent" placeholder="Enter Event Title" required />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <button type="button" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between" onClick={() => setEventTypeOpen(v => !v)}>
                  <span className={formData.eventType ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.eventType ? EVENT_TYPES.find(type => type.value === formData.eventType)?.label || formData.eventType : 'Select'}
                  </span>
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${eventTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                </button>
                {eventTypeOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {EVENT_TYPES.map(type => (
                      <button key={type.value} type="button" onClick={() => { setFormData(prev => ({...prev, eventType: type.value})); setEventTypeOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-blue-50 ${formData.eventType === type.value ? 'bg-blue-100 text-[#032D71] font-medium' : 'text-gray-700'}`}>{type.label}</button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date & Time <span className="text-red-500">*</span></label>
                <ServiceRequestDatePicker startDate={formData.eventStartDate} endDate={formData.eventEndDate} onStartDateChange={(date) => setFormData(prev => ({ ...prev, eventStartDate: date }))} onEndDateChange={(date) => setFormData(prev => ({ ...prev, eventEndDate: date }))} label="" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
                <select name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent" required>
                  <option value="">Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="kano">Kano</option>
                  <option value="rivers">Rivers</option>
                  <option value="oyo">Oyo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event City</label>
                <p className="text-xs text-gray-500 mb-2">(Select the City you will like to Host your event)</p>
                <select name="eventCity" value={formData.eventCity} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent" required>
                  <option value="">Select City</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ikoyi">Ikoyi</option>
                  <option value="lekki">Lekki</option>
                  <option value="maitama">Maitama</option>
                  <option value="asokoro">Asokoro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Needed</label>
                {service && (service as any).categoryIds && (service as any).categoryIds.length > 0 ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    <span className="text-sm">Service categories will be automatically selected based on the vendor&apos;s service</span>
                    <div className="mt-2 text-xs text-gray-500">
                      {availableCategories.length > 0 ? (
                        <div>
                          Categories: {selectedServices.map(id => {
                            const category = availableCategories.find(cat => cat.id === id)
                            return category ? category.name : id
                          }).join(', ')}
                        </div>
                      ) : (
                        <div>Category IDs: {(service as any).categoryIds.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                    value={selectedServices[0] || ''}
                    onChange={(e) => setSelectedServices(e.target.value ? [e.target.value] : [])}
                  >
                    <option value="">Select Services</option>
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <input type="number" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent" placeholder="Enter no. of Guests" min="1" required />
              </div>

              
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select Budget Range</option>
                  <option value="25000-50000">₦25,000 - ₦50,000</option>
                  {/* TODO: Add more budget ranges once backend enum values are confirmed */}
                  {/* Backend is rejecting values other than "25000-50000" */}
                  {/* Need to get the exact enum values from backend team */}
                </select>
              </div>

              <div>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${ isDragOver ? 'border-[#0B2E6F] bg-blue-50' : 'border-gray-300' }`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-event-blue-hover transition-colors">Browse File</button>
                  <input ref={fileInputRef} type="file" multiple accept=".jpeg,.jpg,.png,.pdf,.mp4" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">Size: {formatFileSize(file.size)}</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea name="additionalInformation" value={formData.additionalInformation} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent resize-none" placeholder="Enter here" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Would you like an Event planner to organize your event?</label>
                <select name="needsEventPlanner" value={formData.needsEventPlanner ? 'yes' : 'no'} onChange={(e) => setFormData(prev => ({ ...prev, needsEventPlanner: e.target.value === 'yes' }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Would you like AI to suggest Best profile for your event?</label>
                <select name="needsAISuggestions" value={formData.needsAISuggestions ? 'yes' : 'no'} onChange={(e) => setFormData(prev => ({ ...prev, needsAISuggestions: e.target.value === 'yes' }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              onClick={(e) => {
                console.log('🔍 Submit button clicked!')
                console.log('🔍 isSubmitting:', isSubmitting)
                console.log('🔍 Button disabled:', isSubmitting)
              }}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${ !isSubmitting ? 'bg-event-blue text-white hover:bg-event-blue-hover' : 'bg-gray-400 text-white cursor-not-allowed' }`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Sending Request...' : 'Send Request to Vendor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null

  return (
    <>
      {trigger ? (
        <div onClick={handleOpenModal}>{trigger}</div>
      ) : (
        <button onClick={handleOpenModal} className="w-full bg-yellow-400 text-event-blue font-semibold text-center py-2 md:py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Request Service</span>
          <span className="sm:hidden">Request</span>
        </button>
      )}
      {mounted && createPortal(modalContent, document.body)}
      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  )
}


