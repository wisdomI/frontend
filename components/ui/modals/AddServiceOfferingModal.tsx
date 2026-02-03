'use client'

import { useState, useEffect } from 'react'
import { FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'
import { serviceAPI, categoryAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'

interface PricingPackage {
  id: string
  title: string
  price: string
}

interface AddServiceOfferingModalProps {
  onSave?: (data: any) => void
  onSuccess?: () => void
}

const AddServiceOfferingModal = ({ onSave, onSuccess }: AddServiceOfferingModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    serviceTitle: '',
    serviceCategory: '',
    serviceNiche: '',
    serviceDescription: '',
    files: [] as File[],
    pricingPackages: [
      { id: '1', title: '', price: '' }
    ] as PricingPackage[]
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [categories, setCategories] = useState<any[]>([])
  const [niches, setNiches] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const { addNotification } = useApp()

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      console.log('🔍 Fetching category hierarchy from backend API...')
      const response = await categoryAPI.getHierarchy()
      const categoriesData = response.data.data || []
      console.log('✅ Category hierarchy fetched successfully:', categoriesData.length, 'parent categories')
      console.log('📊 Category structure:', categoriesData)
      
      // Backend uses parentId/subcategories structure, not "niches"
      // Extract parent categories (main categories)
      const mainCategories = categoriesData.filter((cat: any) => !cat.parentId || cat.parentId === null)
      setCategories(mainCategories)
      console.log('✅ Found', mainCategories.length, 'main categories')
      
      // Extract all subcategories as "niches" for the dropdown
      const allNiches: string[] = []
      categoriesData.forEach((cat: any) => {
        // If category has subcategories array, use those
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((sub: any) => {
            if (sub.name) allNiches.push(sub.name)
          })
        }
      })
      
      // Also check for any categories that have a parentId (they are subcategories)
      categoriesData.forEach((cat: any) => {
        if (cat.parentId && cat.name) {
          allNiches.push(cat.name)
        }
      })
      
      const uniqueNiches = Array.from(new Set(allNiches))
      setNiches(uniqueNiches)
      console.log('✅ Extracted', uniqueNiches.length, 'subcategories (niches) from hierarchy')
    } catch (error: any) {
      console.error('❌ Failed to fetch categories from backend:', error)
      console.error('❌ Error status:', error.response?.status)
      console.error('❌ Error message:', error.response?.data?.message || error.message)
      console.log('📦 Using fallback categories instead')
      
      // Use fallback categories if API call fails (backend will be fixed to allow vendor access)
      const fallbackCategories = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440000', 
          name: 'Catering', 
          niches: ['Wedding Catering', 'Corporate Events', 'Birthday Parties', 'Private Dinners'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          name: 'Photography', 
          niches: ['Wedding Photography', 'Event Photography', 'Portrait Photography', 'Product Photography'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440002', 
          name: 'Videography', 
          niches: ['Wedding Videography', 'Event Coverage', 'Documentary', 'Promotional Videos'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440003', 
          name: 'Decoration', 
          niches: ['Wedding Decoration', 'Birthday Decoration', 'Corporate Decoration', 'Themed Events'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          name: 'Entertainment', 
          niches: ['DJ Services', 'Live Band', 'MC Services', 'Comedy Shows', 'Dance Performances'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440005', 
          name: 'Venue', 
          niches: ['Wedding Venues', 'Conference Halls', 'Outdoor Spaces', 'Banquet Halls'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440006', 
          name: 'Planning', 
          niches: ['Wedding Planning', 'Corporate Event Planning', 'Birthday Planning', 'Full Service Planning'] 
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440007', 
          name: 'Makeup & Styling', 
          niches: ['Bridal Makeup', 'Event Makeup', 'Hair Styling', 'Fashion Styling'] 
        }
      ]
      setCategories(fallbackCategories)
      console.log('✅ Fallback categories loaded:', fallbackCategories.length, 'categories')
      
      const allNiches: string[] = []
      fallbackCategories.forEach(cat => {
        if (cat.niches) {
          allNiches.push(...cat.niches)
        }
      })
      setNiches(Array.from(new Set(allNiches)))
      console.log('✅ Fallback niches loaded:', allNiches.length, 'niches')
    } finally {
      setLoadingCategories(false)
      console.log('🏁 Category fetching complete')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'application/pdf']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Only JPEG, PNG, PDF, and MP4 files are allowed' }))
      return
    }
    
    // Validate file sizes (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Files must be under 50MB' }))
      return
    }
    
    setErrors(prev => ({ ...prev, files: '' }))
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const addPricingPackage = () => {
    const newPackage: PricingPackage = {
      id: Date.now().toString(),
      title: '',
      price: ''
    }
    setFormData(prev => ({
      ...prev,
      pricingPackages: [...prev.pricingPackages, newPackage]
    }))
  }

  const removePricingPackage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.filter(pkg => pkg.id !== id)
    }))
  }

  const updatePricingPackage = (id: string, field: keyof PricingPackage, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPackages: prev.pricingPackages.map(pkg =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.serviceTitle.trim()) {
      newErrors.serviceTitle = 'Service title is required'
    }
    
    if (!formData.serviceCategory) {
      newErrors.serviceCategory = 'Service category is required'
    }
    
    if (!formData.serviceNiche) {
      newErrors.serviceNiche = 'Service niche is required'
    }
    
    if (!formData.serviceDescription.trim()) {
      newErrors.serviceDescription = 'Service description is required'
    }
    
    if (formData.files.length === 0) {
      newErrors.files = 'Please upload at least one file'
    }
    
    // Validate pricing packages
    const emptyPackages = formData.pricingPackages.filter(pkg => !pkg.title.trim() || !pkg.price.trim())
    if (emptyPackages.length > 0) {
      newErrors.pricing = 'All pricing packages must have a title and price'
    }
    
    // Validate price format
    for (let i = 0; i < formData.pricingPackages.length; i++) {
      const pkg = formData.pricingPackages[i]
      if (pkg.price.trim()) {
        const cleanPrice = pkg.price.replace(/[^\d.,]/g, '').replace(',', '')
        const priceNumber = parseFloat(cleanPrice)
        if (isNaN(priceNumber) || priceNumber <= 0) {
          newErrors.pricing = `Package ${i + 1}: Please enter a valid price (numbers only)`
          break
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    console.log('handleSave called')
    console.log('Form data:', formData)
    
    if (!validateForm()) {
      console.log('Validation failed, errors:', errors)
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      return
    }

    console.log('Validation passed, starting submission...')
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Using /service/ endpoint with array notation based on API docs
      // BUT the endpoint /profile/serviceOffering returns 404, so trying both formats
      
      // Try array format first (as per documentation)
      formDataToSend.append('serviceOfferings[0][serviceName]', formData.serviceTitle)
      formDataToSend.append('serviceOfferings[0][categoryIds]', formData.serviceCategory)
      formDataToSend.append('serviceOfferings[0][description]', formData.serviceDescription)
      
      // Add pricing
      if (formData.pricingPackages.length > 0 && formData.pricingPackages[0].title && formData.pricingPackages[0].price) {
        formDataToSend.append('serviceOfferings[0][pricingTitle]', formData.pricingPackages[0].title)
        
        // Convert price string to number - remove currency symbols and parse
        const priceString = formData.pricingPackages[0].price
        const cleanPrice = priceString.replace(/[^\d.,]/g, '').replace(',', '')
        const priceNumber = parseFloat(cleanPrice)
        
        if (isNaN(priceNumber)) {
          throw new Error('Invalid price format. Please enter a valid number.')
        }
        
        formDataToSend.append('serviceOfferings[0][price]', priceNumber.toString())
      }
      
      // Add media files
      formData.files.forEach((file) => {
        formDataToSend.append('mediaUrl', file)
      })

      console.log('Sending to POST /service/ with data:', {
        serviceName: formData.serviceTitle,
        categoryIds: formData.serviceCategory,
        description: formData.serviceDescription,
        pricingTitle: formData.pricingPackages[0]?.title,
        price: formData.pricingPackages[0]?.price,
        filesCount: formData.files.length
      })
      
      // DEBUG: Compare frontend request vs Postman
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('🔐 Token User ID:', payload.id)
        console.log('🔐 Token (first 50 chars):', token.substring(0, 50) + '...')
        console.log('🔐 Token (last 50 chars):', '...' + token.substring(token.length - 50))
      } else {
        console.error('❌ NO TOKEN in localStorage!')
      }
      
      // Log the exact request being sent
      console.log('📤 Request Details:', {
        url: 'POST /service/',
        baseURL: 'https://backend-a3nd.onrender.com/api/v1',
        hasAuthHeader: !!token,
        contentType: 'multipart/form-data'
      })
      
      // Log FormData contents (for debugging)
      console.log('📋 FormData keys:')
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(`  ${key}: [File: ${value.name}, ${value.size} bytes]`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      })

      const response = await serviceAPI.create(formDataToSend)
      console.log('Service offering creation SUCCESS:', response)
      console.log('Response data structure:', {
        success: (response.data as any).success,
        message: (response.data as any).message,
        dataType: typeof response.data.data,
        dataLength: Array.isArray(response.data.data) ? response.data.data.length : 'not array',
        dataContent: response.data.data
      })
      
      addNotification({
        type: 'success',
        message: 'Service offering created successfully!'
      })
      
      // Pass the created service data to the parent component
      // Backend returns: { success: true, data: [{ id, userId, categoryIds, serviceName, price, pricingTitle, description, mediaUrl, createdAt, updatedAt }] }
      let serviceData = null
      
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Backend returns array, take the first item
        serviceData = response.data.data[0]
        console.log('✅ Service data extracted from array:', serviceData)
      } else if (response.data.data && typeof response.data.data === 'object') {
        // Backend returns single object
        serviceData = response.data.data
        console.log('✅ Service data extracted from object:', serviceData)
      } else {
        // Fallback: This should not happen with current backend
        console.warn('⚠️ Unexpected response structure, using fallback')
        serviceData = {
          id: `temp-${Date.now()}`,
          userId: '', // Will be set by backend
          serviceName: formData.serviceTitle,
          description: formData.serviceDescription,
          categoryIds: [formData.serviceCategory],
          mediaUrl: formData.files.map(file => URL.createObjectURL(file)),
          price: formData.pricingPackages[0]?.price,
          pricingTitle: formData.pricingPackages[0]?.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      
      console.log('📤 Passing service data to parent component:', serviceData)
      onSave?.(serviceData)
      
      // Call onSuccess to refresh the list (optional since we have local state management)
      // The parent component will add the service to local state immediately
      // Note: This may trigger a 403 error for service list fetching, but it's handled gracefully
      onSuccess?.()
      
    setIsOpen(false)
    setFormData({
      serviceTitle: '',
      serviceCategory: '',
      serviceNiche: '',
      serviceDescription: '',
      files: [],
      pricingPackages: [{ id: '1', title: '', price: '' }]
    })
      setErrors({})
    } catch (error: any) {
      console.error('Error saving service offering:', error)
      console.error('Service offering error response:', error.response?.data)
      console.error('Service offering error status:', error.response?.status)
      console.error('Request URL:', error.config?.url)
      console.error('Request method:', error.config?.method)
      console.error('Base URL:', error.config?.baseURL)
      
      let errorMessage = 'Failed to create service offering'
      
      if (error.message === 'Invalid price format. Please enter a valid number.') {
        errorMessage = error.message
      } else if (error.response?.status === 404) {
        errorMessage = `Backend endpoint not found: POST ${error.config?.baseURL}${error.config?.url}. Please verify the backend route is properly registered and accessible.`
        console.error('⚠️ 404 ERROR: The backend route /profile/serviceOffering does not exist or is not accessible')
        console.error('Backend team should check:')
        console.error('1. Route is registered: router.post("/profile/serviceOffering", ...)')
        console.error('2. Middleware is not blocking the route')
        console.error('3. Route file is properly imported in main app')
      } else if (error.response?.status === 400) {
        // Handle validation errors from backend
        if (error.response?.data?.message) {
          if (error.response.data.message.includes('price')) {
            errorMessage = 'Invalid price format. Please enter a valid number (e.g., 10000 or 10,000)'
          } else {
            errorMessage = error.response.data.message
          }
        } else {
          errorMessage = 'Validation error. Please check your input and try again.'
        }
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Service offering creation requires vendor account privileges. Please ensure you are logged in as a vendor.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      addNotification({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors font-medium"
      >
        + Add Services
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Add Service Offering</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Service Offering Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Offering Title *</label>
                <input
                  type="text"
                  value={formData.serviceTitle}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, serviceTitle: e.target.value }))
                    if (errors.serviceTitle) setErrors(prev => ({ ...prev, serviceTitle: '' }))
                  }}
                  placeholder="Enter Title"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.serviceTitle && <p className="mt-1 text-sm text-red-500">{errors.serviceTitle}</p>}
              </div>

              {/* Service Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Category *</label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, serviceCategory: e.target.value }))
                    if (errors.serviceCategory) setErrors(prev => ({ ...prev, serviceCategory: '' }))
                  }}
                  disabled={loadingCategories}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceCategory ? 'border-red-500' : 'border-gray-300'
                  } ${loadingCategories ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Select service category'}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.serviceCategory && <p className="mt-1 text-sm text-red-500">{errors.serviceCategory}</p>}
              </div>

              {/* Service Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Niche *</label>
                <select
                  value={formData.serviceNiche}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, serviceNiche: e.target.value }))
                    if (errors.serviceNiche) setErrors(prev => ({ ...prev, serviceNiche: '' }))
                  }}
                  disabled={loadingCategories}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceNiche ? 'border-red-500' : 'border-gray-300'
                  } ${loadingCategories ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {loadingCategories ? 'Loading niches...' : 'Select service niche'}
                  </option>
                  {niches.map((niche, index) => (
                    <option key={index} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
                {errors.serviceNiche && <p className="mt-1 text-sm text-red-500">{errors.serviceNiche}</p>}
              </div>

              {/* Service Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Offering Description *</label>
                <textarea
                  rows={4}
                  value={formData.serviceDescription}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, serviceDescription: e.target.value }))
                    if (errors.serviceDescription) setErrors(prev => ({ ...prev, serviceDescription: '' }))
                  }}
                  placeholder="Type here"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.serviceDescription && <p className="mt-1 text-sm text-red-500">{errors.serviceDescription}</p>}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files *</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.files ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-sm mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,video/mp4,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="service-file-upload"
                  />
                  <label
                    htmlFor="service-file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Browse File
                  </label>
                </div>
                {errors.files && <p className="mt-1 text-sm text-red-500">{errors.files}</p>}
              </div>

              {/* Uploaded Files */}
              {formData.files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(0)}kb</p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Packages */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Pricing Package Title & Price *</h4>
                <div className="space-y-4">
                  {formData.pricingPackages.map((pkg, index) => (
                    <div key={pkg.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={pkg.title}
                          onChange={(e) => {
                            updatePricingPackage(pkg.id, 'title', e.target.value)
                            if (errors.pricing) setErrors(prev => ({ ...prev, pricing: '' }))
                          }}
                          placeholder="e.g Basic, Standard, Classic"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pricing ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => {
                            updatePricingPackage(pkg.id, 'price', e.target.value)
                            if (errors.pricing) setErrors(prev => ({ ...prev, pricing: '' }))
                          }}
                          placeholder="e.g 10000 or 10,000"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pricing ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {formData.pricingPackages.length > 1 && (
                        <button
                          onClick={() => removePricingPackage(pkg.id)}
                          className="p-3 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.pricing && <p className="mt-1 text-sm text-red-500">{errors.pricing}</p>}
                <button
                  onClick={addPricingPackage}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full py-3 rounded-lg transition-colors font-medium ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddServiceOfferingModal
