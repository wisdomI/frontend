'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { PlusIcon, CloudArrowUpIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import SuccessModal from './SuccessNotificationModal'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { CreateServiceRequestData } from '@/types/api'
import toast from 'react-hot-toast'
import { categoryAPI } from '@/lib/api'
import ServiceRequestDatePicker from '@/components/ui/ServiceRequestDatePicker'

export default function PostServiceModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isAuthenticated, loading, user } = useAuthContext()
  const router = useRouter()
  const { createRequest } = useServiceRequests({ autoFetch: false })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      // Redirect to login with a return URL
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    // Debug: Log user information
    console.log('🔍 User info:', user)
    console.log('🔍 User account type:', user?.accountType)
    
    // Check if user has appropriate account type for creating service requests
    // Based on the API documentation, service requests are typically created by clients
    if (user?.accountType === 'vendor' || user?.accountType === 'admin') {
      toast.error('Only clients can post service requests. Please switch to a client account.')
      return;
    }
    
    // Additional check for individual/business accounts
    if (user?.accountType && !['individual', 'business'].includes(user.accountType)) {
      toast.error(`Account type '${user.accountType}' cannot create service requests. Please contact support.`)
      return;
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
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB
      return isValidType && isValidSize
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Custom UI state for pixel-perfect selects
  const [eventTypeOpen, setEventTypeOpen] = useState(false)
  // Map display labels to backend enum values (must match DirectServiceRequestModal for backend compatibility)
  const EVENT_TYPES = [
    { label: 'Wedding', value: 'wedding' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'Birthday', value: 'birthday' },
    { label: 'Conference', value: 'conference' },
    { label: 'Other', value: 'other' }
  ]

  const [servicesOpen, setServicesOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<any[]>([])

  // Client selection removed for design parity

  // Keep servicesNeeded in formData synced with selectedServices for submission
  useEffect(() => {
    setFormData(prev => ({ ...prev, servicesNeeded: selectedServices }))
  }, [selectedServices])

  // Fetch available categories when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          console.log('🔍 Fetching categories from API for general service request...')
          const response = await categoryAPI.getAll()
          console.log('🔍 Available categories:', response.data)
          setAvailableCategories(response.data.data || [])
        } catch (error) {
          console.log('🔍 Could not fetch categories:', error)
        }
      }
      fetchCategories()
    }
  }, [isOpen])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // OPTIMIZED: Split validation into smaller, focused memos instead of one large object
  // This prevents unnecessary recalculations and improves performance
  
  const hasValidTitle = useMemo(() => 
    formData.eventTitle.trim() !== '', 
    [formData.eventTitle]
  )
  
  const hasValidEventType = useMemo(() => 
    formData.eventType !== '', 
    [formData.eventType]
  )
  
  const hasValidDates = useMemo(() => 
    formData.eventStartDate !== '' && formData.eventEndDate !== '', 
    [formData.eventStartDate, formData.eventEndDate]
  )
  
  const hasValidLocation = useMemo(() => 
    formData.eventLocation !== '' && formData.eventCity !== '', 
    [formData.eventLocation, formData.eventCity]
  )
  
  const hasServices = useMemo(() => 
    selectedServices.length > 0 || formData.servicesNeeded.length > 0, 
    [selectedServices, formData.servicesNeeded]
  )
  
  const hasValidGuests = useMemo(() => 
    formData.numberOfGuests !== '', 
    [formData.numberOfGuests]
  )
  
  const hasValidBudget = useMemo(() => 
    formData.budgetRange !== '', 
    [formData.budgetRange]
  )
  
  // Combined validation check - minimal dependencies
  const formValidation = useMemo(() => ({
    isValid: hasValidTitle && hasValidEventType && hasValidDates && 
             hasValidLocation && hasServices && hasValidGuests && hasValidBudget,
    hasServices,
    selectedServicesCount: selectedServices.length
  }), [hasValidTitle, hasValidEventType, hasValidDates, hasValidLocation, 
       hasServices, hasValidGuests, hasValidBudget, selectedServices.length])

  // Only log validation failures when the validation state changes, with throttling
  const [lastValidationLog, setLastValidationLog] = useState<number>(0)
  
  useEffect(() => {
    const now = Date.now()
    // Throttle logging to once every 2 seconds
    if (!formValidation.isValid && (now - lastValidationLog) > 2000) {
      console.log('🔍 Form validation status: invalid')
      setLastValidationLog(now)
    }
  }, [formValidation.isValid, lastValidationLog])

  const isFormValid = () => formValidation.isValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    console.log('🔄 Starting submission - Loading state set to true')
    try {
      // Debug: Log user and token information
      console.log('🔍 Submitting service request for user:', user)
      console.log('🔍 User account type:', user?.accountType)
      console.log('🔍 Token available:', !!localStorage.getItem('accessToken'))
      console.log('🔍 Form data:', formData)
      console.log('🔍 Uploaded files:', uploadedFiles)
      console.log('🔍 Selected services:', selectedServices)
      
      // Validate and adjust dates - Use robust UTC adjustment from DirectServiceRequestModal
      const startDate = new Date(formData.eventStartDate)
      const endDate = new Date(formData.eventEndDate)
      const now = new Date()
      
      // Set time to start of day for date-only comparison (avoid timezone issues)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      
      console.log('🔍 Date validation:', {
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
        toast.error('Event start date cannot be in the past')
        setIsSubmitting(false)
        console.log('❌ Date validation failed: Start date is in the past')
        return
      }
      
      if (endDate <= startDate) {
        toast.error('Event end date must be after start date')
        setIsSubmitting(false)
        console.log('❌ Date validation failed: End date is not after start date')
        return
      }

      // Check services using memoized validation
      if (!formValidation.hasServices) {
        toast.error('At least one service is required')
        setIsSubmitting(false)
        console.log('❌ Services validation failed')
        return
      }

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

      // Prepare FormData - ALWAYS use FormData for consistency with backend expectations
      const formDataToSend = new FormData()
      formDataToSend.append('eventTitle', formData.eventTitle)
      formDataToSend.append('eventType', formData.eventType)
      formDataToSend.append('eventStartDate', startDateAdjusted.toISOString())
      formDataToSend.append('eventEndDate', endDateAdjusted.toISOString())
      formDataToSend.append('eventLocation', formData.eventLocation)
      formDataToSend.append('eventCity', formData.eventCity)
      
      // Send servicesNeeded as array with brackets notation - CRITICAL for backend
      // Use selectedServices which is the source of truth
      const servicesToSend = selectedServices.length > 0 ? selectedServices : formData.servicesNeeded
      servicesToSend.forEach((service) => {
        formDataToSend.append('servicesNeeded[]', service)
      })
      
      console.log('🔍 ServicesNeeded being sent as array:', servicesToSend)
      
      formDataToSend.append('numberOfGuests', formData.numberOfGuests)
      formDataToSend.append('budgetRange', formData.budgetRange)
      formDataToSend.append('additionalInformation', formData.additionalInformation || '')
      formDataToSend.append('needsEventPlanner', formData.needsEventPlanner.toString())
      formDataToSend.append('needsAISuggestions', formData.needsAISuggestions.toString())

      // Append files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('images', file)
      })

      // Debug: Log FormData contents
      console.log('🔍 FormData contents:')
      const formDataEntries = Array.from(formDataToSend.entries())
      formDataEntries.forEach(([key, value]) => {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value)
      })
      
      // Debug: Check authentication token
      const token = localStorage.getItem('accessToken')
      console.log('🔍 Auth token available:', !!token)
      if (token) {
        console.log('🔍 Token preview:', token.substring(0, 30) + '...')
      }

      // Submit to API
      console.log('🔍 Submitting to API...')
      console.log('🔍 API Endpoint: /service-requests/')
      console.log('🔍 Request type: FormData with multipart/form-data')
      
      console.log('📤 Calling API: createRequest with FormData...')
      try {
        const result = await createRequest(formDataToSend)
        console.log('✅ Service request created successfully:', result)
      } catch (apiError: any) {
        console.error('❌ API submission failed:', apiError)
        console.error('❌ Error details:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          message: apiError.message,
          config: {
            url: apiError.config?.url,
            method: apiError.config?.method,
            headers: apiError.config?.headers
          }
        })
        console.error('❌ Backend error message:', apiError.response?.data?.message)
        console.error('❌ Backend error type:', apiError.response?.data?.errorType)
        console.error('❌ Backend verbose message:', apiError.response?.data?.verboseMessage)
        throw apiError // Re-throw to be caught by outer try-catch
      }
      
      toast.success('Service request created successfully!')
      setIsOpen(false)
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        eventTitle: '',
        eventType: '',
        eventStartDate: '',
        eventEndDate: '',
        eventLocation: '',
        eventCity: '',
        servicesNeeded: [],
        numberOfGuests: '',
        budgetRange: '',
        additionalInformation: '',
        needsEventPlanner: true,
        needsAISuggestions: false,
      })
      setUploadedFiles([])
      setSelectedServices([])
    } catch (error: any) {
      console.error('❌ Error creating service request:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error status:', error.response?.status)
      console.error('❌ Error data:', error.response?.data)
      
      // Provide more specific error messages based on status code
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Invalid data format'
        const validationErrors = error.response?.data?.errors
        if (validationErrors) {
          console.error('❌ Validation errors:', validationErrors)
          toast.error(`Validation failed: ${JSON.stringify(validationErrors)}`)
        } else {
          toast.error(`Bad request: ${errorMessage}`)
        }
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You may not have permission to create service requests with your current account type.')
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to create service request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
      console.log('✅ Submission completed - Loading state set to false')
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-2">
            <h1 className="text-2xl font-bold text-gray-800">Post a Service Request</h1>
            <p className="text-sm text-gray-600 mt-1">Kindly fill in your Event details</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  placeholder="Enter Event Title"
                  required
                />
              </div>

              {/* Event Type - custom select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <button
                  type="button"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between"
                  onClick={() => setEventTypeOpen(v => !v)}
                >
                  <span className={formData.eventType ? 'text-gray-900' : 'text-gray-400'}>
                    {EVENT_TYPES.find(t => t.value === formData.eventType)?.label || 'Select'}
                  </span>
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${eventTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                </button>
                {eventTypeOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {EVENT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => { setFormData(prev => ({...prev, eventType: type.value})); setEventTypeOpen(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 ${formData.eventType === type.value ? 'bg-blue-100 text-[#032D71] font-medium' : 'text-gray-700'}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date & Time <span className="text-red-500">*</span>
                </label>
                <ServiceRequestDatePicker
                  startDate={formData.eventStartDate}
                  endDate={formData.eventEndDate}
                  onStartDateChange={(date) => setFormData(prev => ({ ...prev, eventStartDate: date }))}
                  onEndDateChange={(date) => setFormData(prev => ({ ...prev, eventEndDate: date }))}
                  label=""
                  required
                />
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <select
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="kano">Kano</option>
                  <option value="rivers">Rivers</option>
                  <option value="oyo">Oyo</option>
                </select>
              </div>

              {/* Event City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event City
                </label>
                <p className="text-xs text-gray-500 mb-2">(Select the City you will like to Host your event)</p>
                <select
                  name="eventCity"
                  value={formData.eventCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  required
                >
                  <option value="">Select City</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ikoyi">Ikoyi</option>
                  <option value="lekki">Lekki</option>
                  <option value="maitama">Maitama</option>
                  <option value="asokoro">Asokoro</option>
                </select>
              </div>

              {/* Services Needed - multi select with categories */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Needed</label>
                <button
                  type="button"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between"
                  onClick={() => setServicesOpen(v => !v)}
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedServices.length === 0 ? (
                      <span className="text-gray-400">Select Services</span>
                    ) : (
                      selectedServices.map((s, index) => {
                        const category = availableCategories.find(cat => cat.id === s)
                        return (
                          <span key={`${s}-${index}`} className="bg-[#0B2E6F] text-white text-xs px-3 py-1 rounded-full">
                            {category ? category.name : s}
                          </span>
                        )
                      })
                    )}
                  </div>
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                </button>
                {servicesOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-auto p-2">
                    {availableCategories.length > 0 ? (
                      availableCategories.map(category => {
                        const checked = selectedServices.includes(category.id)
                        return (
                          <label key={category.id} className="flex items-center gap-3 text-gray-700 p-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-[#032D71] focus:ring-[#032D71]"
                              checked={checked}
                              onChange={(e) => {
                                setSelectedServices(prev => e.target.checked ? [...prev, category.id] : prev.filter(s => s !== category.id))
                              }}
                            />
                            <span className="text-[15px] font-medium">{category.name}</span>
                          </label>
                        )
                      })
                    ) : (
                      <div className="p-3 text-gray-500 text-center">Loading categories...</div>
                    )}
                  </div>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                  placeholder="Enter no. of Guests"
                  min="1"
                  required
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
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
            </div>

            {/* Right Column - File Upload & Additional Information */}
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? 'border-[#0B2E6F] bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-event-blue-hover transition-colors"
                  >
                    Browse File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpeg,.jpg,.png,.pdf,.mp4"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">Size: {formatFileSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent resize-none"
                  placeholder="Enter here"
                />
              </div>

              {/* Event Planner Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like an Event planner to organize your event?
                </label>
                <select
                  name="needsEventPlanner"
                  value={formData.needsEventPlanner ? 'yes' : 'no'}
                  onChange={(e) => setFormData(prev => ({ ...prev, needsEventPlanner: e.target.value === 'yes' }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* AI Suggestion Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like AI to suggest Best profile for your event?
                </label>
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isFormValid() && !isSubmitting
                  ? 'bg-event-blue text-white hover:bg-event-blue-hover'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting && (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Creating Service Request...' : 'Request Service'}
            </button>
            {!isFormValid() && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Please fill in all required fields to enable submission
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  ) : null

  return (
    <>
      {trigger ? (
        <div onClick={handleOpenModal}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={handleOpenModal}
          className="w-full bg-yellow-400 text-event-blue font-semibold text-center py-2 md:py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm"
        >
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Post Service Request</span>
          <span className="sm:hidden">Post Request</span>
        </button>
      )}

      {mounted && createPortal(modalContent, document.body)}

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleCloseSuccess} />
    </>
  )
}