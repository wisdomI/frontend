'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiArrowLeft, FiCheck, FiEdit2, FiUpload, FiTrash2, FiLink, FiCopy, FiCamera } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'
import { useAuthContext } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { profileAPI, portfolioAPI, serviceAPI } from '@/lib/api'
import AddPortfolioModal from '@/components/ui/modals/AddPortfolioModal'
import AddServiceOfferingModal from '@/components/ui/modals/AddServiceOfferingModal'
import AddTravelInfoModal from '@/components/ui/modals/AddTravelInfoModal'
import AddBankDetailsModal from '@/components/ui/modals/AddBankDetailsModal'
import SuccessModal from '@/components/ui/modals/SuccessModal'
import DateRangePicker from '@/components/ui/DateRangePicker'

interface Step {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface BusinessDetails {
  businessName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
  city: string
  address: string
  bio: string
}

const ProfileSetupPage = () => {
  const router = useRouter()
  const { profileStatus, loading: profileLoading, error: profileError, updateProfileCompletion, markProfileComplete } = useProfileCompletion()
  const { user, isAuthenticated, loading } = useAuthContext()
  const { addNotification } = useApp()
  
  // Restore active step from localStorage or determine based on completed steps
  const getInitialActiveStep = () => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('vendor_profile_active_step')
      if (savedStep) {
        console.log('📥 Restoring saved step:', savedStep)
        return savedStep
      }
    }
    
    // If no saved step, determine based on completed steps
    const completedCount = profileStatus.completedSteps.length
    if (completedCount === 0) return 'business-details'
    if (completedCount === 1 && profileStatus.completedSteps.includes('business-details')) return 'service-offering'
    if (completedCount === 2) return 'verification'
    if (completedCount === 3) return 'payment-setup'
    
    return 'business-details'
  }
  
  const [activeStep, setActiveStep] = useState(getInitialActiveStep())
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [completedSteps, setCompletedSteps] = useState(profileStatus.completedSteps.length > 0 ? profileStatus.completedSteps : ['business-details'])
  const [saving, setSaving] = useState(false)
  
  // Form data state
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: user?.businessName || user?.firstName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    country: 'Nigeria',
    city: 'Lagos',
    address: (user as any)?.address || '',
    bio: (user as any)?.bio || ''
  })
  const [displayPicture, setDisplayPicture] = useState<File | null>(null)
  const [displayPicturePreview, setDisplayPicturePreview] = useState<string | null>(null)
  const [availabilityRange, setAvailabilityRange] = useState<{ start: Date; end: Date } | null>(null)
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [serviceOfferings, setServiceOfferings] = useState<any[]>([])
  const [loadingPortfolios, setLoadingPortfolios] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/vendor/profile-setup'))
    }
  }, [loading, isAuthenticated, router])

  // Save active step to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendor_profile_active_step', activeStep)
      console.log('💾 Saved active step to localStorage:', activeStep)
    }
  }, [activeStep])

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && user?.id) {
        console.log('📥 Loading existing profile data from API...')
        try {
          const response = await profileAPI.me()
          const profileData = response.data.data
          
          if (profileData) {
            console.log('✅ Profile data loaded from database:', profileData)
            
            // Update business details with data from API
            // Note: Profile API returns profile data, but business info comes from user object
            // Address field is NOT supported by backend Profile model yet
            const profile = profileData as any
            setBusinessDetails({
              businessName: profile.businessName || user?.businessName || '',
              firstName: profile.firstName || user?.firstName || '',
              lastName: profile.lastName || user?.lastName || '',
              email: profile.email || user?.email || '',
              phoneNumber: profile.phoneNumber || user?.phoneNumber || '',
              country: profile.country || profileData.country || 'Nigeria',
              city: profile.city || profileData.city || 'Lagos',
              address: profile.address || (user as any)?.address || '', // Fallback to user.address
              bio: profile.bio || profileData.bio || ''
            })
            
            // Set display picture preview if available (backend uploads to Cloudinary)
            if (profileData.displayPicture) {
              setDisplayPicturePreview(profileData.displayPicture)
              console.log('✅ Display picture loaded:', profileData.displayPicture)
            } else {
              console.log('ℹ️ No display picture in profile data')
            }
            
            // Log missing fields for backend team
            if (!profile.address && businessDetails.address) {
              console.warn('⚠️ Address was sent but not returned by backend - backend may not support this field')
            }
            
            console.log('✅ Form populated with saved profile data')
          }
        } catch (error: any) {
          if (error.response?.status === 403) {
            console.log('⚠️ Profile API returns 403 - using user data from auth context')
          } else if (error.response?.status === 404) {
            console.log('ℹ️ No profile found yet - user needs to create one')
          } else {
            console.error('❌ Error loading profile:', error)
          }
        }
      }
    }
    
    loadProfileData()
  }, [isAuthenticated, user?.id])

  // Fetch portfolios and service offerings when on service-offering step
  useEffect(() => {
    if (activeStep === 'service-offering' && isAuthenticated) {
      fetchPortfoliosAndServices()
    }
  }, [activeStep, isAuthenticated])

  // Skip refresh after creation since we use local state management
  // The API calls return 403 until backend enables vendor access
  // Local state ensures items appear immediately without API refresh
  const skipRefreshAfterCreation = true

  const addServiceToLocalState = (newService: any) => {
    // Add the newly created service to local state with safety checks
    // This ensures users see their created services immediately, even when the API list endpoint returns 403
    console.log('Received service data:', newService)
    
    if (newService && (newService.id || newService.serviceName || newService.serviceTitle)) {
      setServiceOfferings(prev => [newService, ...prev])
      console.log('Added new service to local state:', newService)
    } else {
      console.warn('Invalid service data received:', newService)
      console.warn('Service data structure:', {
        hasId: !!newService?.id,
        hasServiceName: !!newService?.serviceName,
        hasServiceTitle: !!newService?.serviceTitle,
        dataType: typeof newService,
        keys: newService ? Object.keys(newService) : 'null/undefined'
      })
    }
  }

  const addPortfolioToLocalState = (newPortfolio: any) => {
    // Add the newly created portfolio to local state with safety checks
    if (newPortfolio && (newPortfolio.id || newPortfolio.projectTitle)) {
      setPortfolios(prev => [newPortfolio, ...prev])
      console.log('Added new portfolio to local state:', newPortfolio)
    } else {
      console.warn('Invalid portfolio data received:', newPortfolio)
    }
  }

  const conditionalRefresh = () => {
    if (!skipRefreshAfterCreation) {
      fetchPortfoliosAndServices()
    }
  }

  const fetchPortfoliosAndServices = async () => {
    // Fetch portfolios - try user-specific endpoint first
    setLoadingPortfolios(true)
    try {
      // Option 1: Try user-specific endpoint if we have user ID
      if (user?.id) {
        const response = await portfolioAPI.getUserPortfolios(user.id)
        const portfoliosData = response.data.data || []
        console.log('📥 Portfolios loaded from API:', portfoliosData)
        if (portfoliosData.length > 0) {
          console.log('🔍 First portfolio structure:', portfoliosData[0])
          const firstPortfolio = portfoliosData[0] as any
          console.log('🔍 Portfolio image field check:', {
            hasFiles: !!firstPortfolio.files,
            hasMediaUrl: !!firstPortfolio.mediaUrl,
            hasImages: !!firstPortfolio.images,
            allKeys: Object.keys(portfoliosData[0])
          })
        }
        setPortfolios(portfoliosData)
      } else {
        // Option 2: Fall back to getAll
        const response = await portfolioAPI.getAll()
        setPortfolios(response.data.data || [])
      }
    } catch (error: any) {
      console.error('Error fetching portfolios:', error)
      setPortfolios([])
    } finally {
      setLoadingPortfolios(false)
    }

    // Fetch service offerings
    setLoadingServices(true)
    try {
      const response = await serviceAPI.myServices()
      const servicesData = response.data.data || []
      console.log('📥 Services loaded from API:', servicesData)
      if (servicesData.length > 0) {
        console.log('🔍 First service structure:', servicesData[0])
        const firstService = servicesData[0] as any
        console.log('🔍 Service image field check:', {
          hasFiles: !!firstService.files,
          hasMediaUrl: !!firstService.mediaUrl,
          hasImages: !!firstService.images,
          allKeys: Object.keys(servicesData[0])
        })
      }
      setServiceOfferings(servicesData)
    } catch (error: any) {
      console.error('Error fetching services:', error)
      setServiceOfferings([])
    } finally {
      setLoadingServices(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const steps: Step[] = [
    { id: 'business-details', label: 'Business Details', completed: completedSteps.includes('business-details'), active: activeStep === 'business-details' },
    { id: 'service-offering', label: 'Service Offering & Description', completed: completedSteps.includes('service-offering'), active: activeStep === 'service-offering' },
    { id: 'verification', label: 'Verification & Compliance', completed: completedSteps.includes('verification'), active: activeStep === 'verification' },
    { id: 'payment-setup', label: 'Payment Setup', completed: completedSteps.includes('payment-setup'), active: activeStep === 'payment-setup' },
  ]

  const completedStepsCount = completedSteps.length
  const percentage = Math.round((completedStepsCount / steps.length) * 100)

  const handleStepComplete = (stepId: string, message: string) => {
    setSuccessMessage(message)
    setShowSuccessModal(true)
    
    // Update step completion
    if (!completedSteps.includes(stepId)) {
      const newCompletedSteps = [...completedSteps, stepId]
      setCompletedSteps(newCompletedSteps)
      updateProfileCompletion(newCompletedSteps)
    }
    
    // Move to next step
    const stepIndex = steps.findIndex(step => step.id === stepId)
    if (stepIndex < steps.length - 1) {
      setActiveStep(steps[stepIndex + 1].id)
    } else {
      // All steps completed - mark profile as complete and redirect
      markProfileComplete()
      setSuccessMessage('Profile setup completed successfully! Redirecting to dashboard...')
      setShowSuccessModal(true)
      
      // Redirect to dashboard after a longer delay to ensure localStorage is saved
      setTimeout(() => {
        router.push('/vendor')
      }, 3000)
    }
  }

  const validateCurrentStep = (): { isValid: boolean; message: string } => {
    switch (activeStep) {
      case 'business-details':
        if (!businessDetails.businessName.trim()) {
          return { isValid: false, message: 'Business Name is required' }
        }
        if (!businessDetails.email.trim()) {
          return { isValid: false, message: 'Business Email is required' }
        }
        if (!businessDetails.phoneNumber.trim()) {
          return { isValid: false, message: 'Business Phone Number is required' }
        }
        if (!businessDetails.address.trim()) {
          return { isValid: false, message: 'Business Address is required' }
        }
        if (!businessDetails.bio.trim()) {
          return { isValid: false, message: 'Business Bio is required' }
        }
        return { isValid: true, message: '' }
      
      case 'service-offering':
        // Note: User must have added at least one portfolio or service offering
        // This validation can be enhanced based on backend API response
        return { isValid: true, message: 'Please add at least one portfolio item or service offering to continue' }
      
      case 'verification':
        // Verification step validation
        return { isValid: true, message: '' }
      
      case 'payment-setup':
        // Payment setup validation
        return { isValid: true, message: '' }
      
      default:
        return { isValid: true, message: '' }
    }
  }

  const handleSaveAndContinue = async () => {
    try {
      setSaving(true)
      
      // Validate current step
      const validation = validateCurrentStep()
      if (!validation.isValid) {
        alert(validation.message)
        setSaving(false)
        return
      }
      
      // Save current step data to API
      if (activeStep === 'business-details') {
        const formData = new FormData()
        formData.append('businessName', businessDetails.businessName)
        formData.append('firstName', businessDetails.firstName)
        formData.append('lastName', businessDetails.lastName)
        formData.append('email', businessDetails.email)
        formData.append('phoneNumber', businessDetails.phoneNumber)
        formData.append('country', businessDetails.country)
        formData.append('city', businessDetails.city)
        formData.append('address', businessDetails.address)
        formData.append('bio', businessDetails.bio)
        
        // Add display picture if selected
        if (displayPicture) {
          formData.append('displayPicture', displayPicture)
        }
        
        // Save to API
        console.log('📤 Attempting to save profile data to API...')
        console.log('📤 User ID:', user?.id)
        console.log('📤 Data being sent:', {
          businessName: businessDetails.businessName,
          firstName: businessDetails.firstName,
          lastName: businessDetails.lastName,
          email: businessDetails.email,
          phoneNumber: businessDetails.phoneNumber,
          country: businessDetails.country,
          city: businessDetails.city,
          address: businessDetails.address,
          bio: businessDetails.bio,
          hasDisplayPicture: !!displayPicture,
          displayPictureName: displayPicture?.name
        })
        
        try {
          const response = await profileAPI.update(user?.id || '', formData)
          console.log('✅ Profile saved successfully to database!', response.data)
          console.log('📥 Data returned from backend:', response.data.data)
          console.log('🔍 Check if address is in response:', (response.data.data as any)?.address)
          console.log('🔍 Check if displayPicture is in response:', (response.data.data as any)?.displayPicture)
          
          // Dispatch event to update header and other components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('profileUpdated'))
            console.log('🔄 Dispatched profileUpdated event')
          }
          
          addNotification({
            type: 'success',
            message: 'Business details saved successfully to database!'
          })
        } catch (error: any) {
          console.error('❌ Profile save failed:', error)
          console.error('❌ Error status:', error.response?.status)
          console.error('❌ Error message:', error.response?.data?.message)
          console.error('❌ Error code:', error.code)
          
          // Handle API errors gracefully
          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            addNotification({
              type: 'error',
              message: 'CORS Error: Backend is blocking requests from localhost. Backend team needs to enable CORS for http://localhost:3000'
            })
            console.error('🚨 CORS ISSUE: Backend must add localhost:3000 to allowed origins')
          } else if (error.response?.status === 403) {
            addNotification({
              type: 'warning',
              message: 'Profile update API is currently restricted for vendors. Backend team needs to add "vendor" to allowedAccountTypes.'
            })
            console.error('🚨 ACCESS CONTROL: Backend must add "vendor" to allowedAccountTypes for PATCH /profile/:id')
          } else if (error.response?.status === 404) {
            addNotification({
              type: 'error',
              message: 'Profile endpoint not found. Backend may not have implemented this endpoint yet.'
            })
          } else {
            addNotification({
              type: 'error',
              message: error.response?.data?.message || 'Failed to save profile. Please try again.'
            })
            // Re-throw to prevent moving to next step if it's a critical error
            throw error
          }
        }
      }
      
      // Mark current step as completed
      if (!completedSteps.includes(activeStep)) {
        const newCompletedSteps = [...completedSteps, activeStep]
        setCompletedSteps(newCompletedSteps)
        updateProfileCompletion(newCompletedSteps)
      }
      
      // Move to next step
      const currentStepIndex = steps.findIndex(step => step.id === activeStep)
      if (currentStepIndex < steps.length - 1) {
        const nextStep = steps[currentStepIndex + 1]
        setActiveStep(nextStep.id)
        
        // Show success message
        setSuccessMessage(`${steps[currentStepIndex].label} completed successfully! Moving to ${nextStep.label}.`)
        setShowSuccessModal(true)
      } else {
        // All steps completed - mark profile as complete and redirect
        markProfileComplete()
        setSuccessMessage('Profile setup completed successfully! Redirecting to dashboard...')
        setShowSuccessModal(true)
        
        // Redirect to dashboard after a longer delay to ensure localStorage is saved
        setTimeout(() => {
          router.push('/vendor')
        }, 3000)
      }
    } catch (error) {
      console.error('Error saving profile data:', error)
      alert('Failed to save profile data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleDisplayPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG or PNG)')
        return
      }
      
      // Validate file size (5MB max for profile pictures)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert('File size must be under 5MB')
        return
      }
      
      setDisplayPicture(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setDisplayPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderBusinessDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
        {/* Business Display Picture */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Business Display Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {displayPicturePreview ? (
                <Image src={displayPicturePreview} alt="Business Logo" fill className="object-cover" />
              ) : (user?.businessName || user?.firstName || user?.displayName) ? (
                <span className="text-gray-600 text-sm font-semibold">
                  {(user?.businessName || user?.firstName || user?.displayName || 'V').charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Business Logo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleDisplayPictureChange}
                className="hidden"
                id="display-picture-upload"
              />
              <label
                htmlFor="display-picture-upload"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors inline-block text-center"
              >
                {displayPicture ? 'Change Picture' : 'Upload Picture'}
              </label>
              <p className="text-xs text-gray-500">JPEG or PNG, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessDetails.businessName}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, businessName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your business name"
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={businessDetails.firstName}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, firstName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={businessDetails.lastName}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, lastName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={businessDetails.email}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Business Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select 
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={businessDetails.country}
              onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, country: e.target.value }))}
            >
              <option value="Nigeria">🇳🇬 +234</option>
            </select>
            <input
              type="tel"
              value={businessDetails.phoneNumber}
              onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Phone number"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={businessDetails.country}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, country: e.target.value }))}
          >
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={businessDetails.city}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, city: e.target.value }))}
          >
            <option value="Lagos">Lagos</option>
          </select>
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessDetails.address}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, address: e.target.value }))}
            placeholder="Enter Address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Business Display Picture</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 text-center">
            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-700">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-500 mb-4">JPEG, PNG, and MP4 formats, up to 50MB</p>
            <div className="flex items-center justify-center">
              <label htmlFor="display-picture-upload" className="px-4 py-2 bg-[#0B2E6F] text-white rounded-md inline-flex items-center gap-2 cursor-pointer hover:bg-[#0A285F]">
                <FiUpload className="w-4 h-4" /> Browse File
              </label>
              <input id="display-picture-upload" type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleDisplayPictureChange} className="hidden" />
            </div>
          </div>
          {displayPicture && (
            <div className="mt-3 text-xs text-gray-600 flex items-center justify-between">
              <span className="truncate">{displayPicture.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">Size: {(displayPicture.size/1024).toFixed(0)}kb</span>
                <button onClick={() => setDisplayPicture(null)} className="text-red-600 hover:text-red-700" aria-label="Remove file">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            value={businessDetails.bio}
            onChange={(e) => setBusinessDetails((prev: BusinessDetails) => ({ ...prev, bio: e.target.value }))}
            placeholder="Type here"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Set Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Availability</label>
          <DateRangePicker
            onSelect={(range) => setAvailabilityRange(range)}
            selectedRange={availabilityRange}
            placeholder="Select available date range"
          />
          {availabilityRange && (
            <p className="mt-2 text-sm text-gray-600">
              Available from {new Date(availabilityRange.start).toLocaleDateString()} to {new Date(availabilityRange.end).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
          <div className="space-y-3">
            {['http://facebook.com','http://instagram.com','http://twitter.com'].map((val,idx) => (
              <div key={idx} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" defaultValue={val} className="w-full pl-9 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label="Copy">
                  <FiCopy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Website Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website Links</label>
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" defaultValue="http://eventhub.com" className="w-full pl-9 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label="Copy">
                  <FiCopy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )

  const renderServiceOffering = () => (
    <div className="space-y-8">
      {/* My Portfolio */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Portfolio</h3>
          <AddPortfolioModal onSave={addPortfolioToLocalState} onSuccess={conditionalRefresh} />
        </div>
        
        {loadingPortfolios ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : portfolios && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolios.filter(portfolio => portfolio).map((portfolio, index) => (
              <div key={portfolio.id || `portfolio-${index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image Section */}
                <div className="aspect-square bg-gray-100 relative">
                  {(() => {
                    // Backend may return images in different field names: files, mediaUrl, images
                    const images = portfolio.files || portfolio.mediaUrl || portfolio.images || []
                    const imageUrl = Array.isArray(images) ? images[0] : images
                    
                    if (imageUrl) {
                      return (
                        <Image 
                          src={imageUrl} 
                          alt={portfolio.projectTitle || 'Portfolio'}
                          fill
                          className="object-cover"
                        />
                      )
                    }
                    
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
                
                {/* Title and Description Section */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {portfolio.projectTitle || portfolio.title || "Untitled Project"}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {portfolio.projectDescription || portfolio.description || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No Portfolio has been added</p>
            <p className="text-gray-400 text-sm mt-2">Add your first portfolio item to showcase your work</p>
          </div>
        )}
      </div>

      {/* My Service Offering */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Service Offering</h3>
          <AddServiceOfferingModal onSave={addServiceToLocalState} onSuccess={conditionalRefresh} />
        </div>
        
        {loadingServices ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : serviceOfferings && serviceOfferings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceOfferings.filter(service => service).map((service, index) => (
              <div key={service.id || `service-${index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image Section */}
                <div className="aspect-square bg-gray-100 relative">
                  {(() => {
                    // Backend may return images in different field names: files, mediaUrl, images
                    const images = service.files || service.mediaUrl || service.images || []
                    const imageArray = Array.isArray(images) ? images : (images ? [images] : [])
                    
                    if (imageArray.length > 0 && imageArray[0]) {
                      return (
                        <div className="relative w-full h-full">
                          <Image 
                            src={imageArray[0]} 
                            alt={service.serviceName || 'Service'}
                            fill
                            className="object-cover"
                          />
                          {/* Image carousel dots */}
                          {imageArray.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {imageArray.slice(0, 3).map((_: string, idx: number) => (
                                <div key={idx} className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    }
                    
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
                
                {/* Title and See More Section */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{service?.serviceName || "Service Name"}</h4>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 underline">
                    See more
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No Service Offering has been added</p>
            <p className="text-gray-400 text-sm mt-2">Add your first service to start attracting clients</p>
          </div>
        )}
      </div>

      {/* My Travel Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Travel Information</h3>
          <AddTravelInfoModal />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Location</label>
            <input
              type="text"
              value="Lagos"
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Booking Value for Travel (N)</label>
            <input
              type="text"
              value="#500,000"
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderVerification = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Business Verification Documents - (JPEG, PNG, PDF up to 5MB)</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Business License/CAC Certificate</h4>
            <p className="text-sm text-gray-500">Status: Null</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload File
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Upload Proof of Address (Utility Bill/Bank Statement)</h4>
            <p className="text-sm text-gray-500">Status: Pending</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload File
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Upload Valid Govt. Issued IDs (Passport/Driver&apos;s License)</h4>
            <p className="text-sm text-gray-500">Status: Pending</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload File
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Professional Certificate 1 (e.g., CMP, CSEP).jpeg</h4>
            <p className="text-sm text-gray-500">Size: 854kb</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm">Approved</span>
            <button className="text-red-500 hover:text-red-700">🗑️</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Professional Certificate 2 (e.g., CMP, CSEP).jpeg</h4>
            <p className="text-sm text-gray-500">Status: Pending</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload File
          </button>
        </div>
      </div>
    </div>
  )

  const renderPaymentSetup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Add Payment Details</h3>
        <p className="text-gray-600 mb-6">Save your Bank details for fast withdrawal of earnings</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              🏦
            </div>
            <h4 className="font-medium">Local Bank Details</h4>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
              ✏️
            </button>
            <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
              🗑️
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium">Access Bank</p>
          <p className="text-gray-600">1234567890</p>
          <p className="text-gray-600">Jane Doe</p>
        </div>
      </div>

      <AddBankDetailsModal />
    </div>
  )

  const renderContent = () => {
    switch (activeStep) {
      case 'business-details':
        return renderBusinessDetails()
      case 'service-offering':
        return renderServiceOffering()
      case 'verification':
        return renderVerification()
      case 'payment-setup':
        return renderPaymentSetup()
      default:
        return renderBusinessDetails()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header + Settings Tabs */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Settings</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center overflow-x-auto">
            <button className="px-4 py-2 text-sm rounded-lg bg-[#EEF3FF] text-[#0B2E6F] font-medium">Profile Setup</button>
            <button className="px-4 py-2 text-sm text-gray-600">Notification</button>
            <button className="px-4 py-2 text-sm text-gray-600">PIN Setup</button>
            <button className="px-4 py-2 text-sm text-gray-600">Integrations</button>
          </div>
        </div>

        <h2 className="text-base font-semibold text-gray-900 mb-3">My Profile Details</h2>

        {/* Progress Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Complete your Profile Setup to Connect with Clients
          </h3>

          {/* Progress Bar */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-16 h-0.5 bg-gray-200"></div>
            
            <div className="flex items-center justify-between w-full pr-16">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    // Allow navigation to current step or completed steps
                    if (step.active || step.completed) {
                      setActiveStep(step.id)
                      console.log('📍 Navigated to step:', step.id)
                    }
                  }}
                  disabled={!step.active && !step.completed}
                  className={`flex flex-col items-center relative z-10 ${
                    step.active || step.completed ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${
                      step.active 
                        ? 'bg-blue-600' 
                        : step.completed 
                        ? 'bg-blue-600' 
                        : 'bg-white border-2'
                    }`}
                    style={{ 
                      backgroundColor: step.active || step.completed ? '#032D71' : 'white',
                      borderColor: '#032D71'
                    }}
                  >
                    {step.completed ? (
                      <FiCheck className="w-4 h-4 text-white" />
                    ) : step.active ? (
                      <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                  
                  <span
                    className={`text-sm text-center leading-tight ${
                      step.active 
                        ? 'font-semibold text-blue-600' 
                        : step.completed 
                        ? 'font-semibold text-blue-600' 
                        : 'font-medium text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="w-12 h-12 relative">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#032D71"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                
                <div className="absolute inset-0 rounded-full bg-blue-600"></div>
                
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-sm font-semibold text-white">{percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini navigation tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {steps.map((step, index) => {
            // Check if previous steps are completed
            const previousStepsCompleted = index === 0 || steps.slice(0, index).every(s => completedSteps.includes(s.id))
            const isDisabled = !previousStepsCompleted && !step.completed
            
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (!isDisabled) {
                    setActiveStep(step.id)
                  }
                }}
                disabled={isDisabled}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  step.active
                    ? 'border-blue-600 text-blue-600'
                    : isDisabled
                    ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                title={isDisabled ? 'Complete previous steps first' : ''}
              >
                {step.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          {renderContent()}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type={successMessage.includes('Redirecting') ? 'profile-completion' : 'account-creation'}
        message={successMessage}
      />
    </div>
  )
}

export default ProfileSetupPage
