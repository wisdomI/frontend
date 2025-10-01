'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCamera, FiSave, FiEdit2, FiX, FiCreditCard, FiTrash2, FiCheck } from 'react-icons/fi'
import { useAuthContext } from '@/contexts/AuthContext'
import { profileAPI } from '@/lib/api'
import ClientPageHeader from '@/components/client/ClientPageHeader'

export default function ProfileSettingsPage() {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState<'personal' | 'payment'>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [hasCard, setHasCard] = useState(true) // Set to true to show existing card, false to show add card button
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    city: 'Lagos',
    dateOfBirth: '',
    bio: ''
  })

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        country: 'Nigeria',
        city: 'Lagos',
        dateOfBirth: '',
        bio: ''
      })
    }
  }, [user])

  // Fetch current profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.id) {
        try {
          const response = await profileAPI.me()
          if (response.data.data?.displayPicture) {
            setProfileImage(response.data.data.displayPicture)
          }
        } catch (error: any) {
          console.error('Error fetching profile picture:', error)
          
          // Handle different error scenarios
          if (error.response?.status === 404) {
            console.log('Profile endpoints not available yet - using localStorage fallback')
            // Check localStorage for temporary profile picture
            const savedImage = localStorage.getItem(`profile_picture_${user.id}`)
            if (savedImage) {
              setProfileImage(savedImage)
            }
          } else if (error.response?.status === 403) {
            console.log('Authentication issue - profile endpoints may not be accessible')
          }
        }
      }
    }
    fetchProfilePicture()
  }, [user])

  const [cardData, setCardData] = useState({
    cardNumber: '7647********5631',
    expiryDate: '12/25',
    cvv: '',
    cardType: 'VISA'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user?.id) return

    try {
      // Create FormData for the API
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('phoneNumber', formData.phone)
      formDataToSend.append('businessAddress', `${formData.city}, ${formData.country}`)
      
      if (formData.bio) {
        formDataToSend.append('bio', formData.bio)
      }

      // Update profile via API
      await profileAPI.update(user.id, formDataToSend)
      
      setIsEditing(false)
      setSuccessMessage('Your Personal Information has been saved successfully.')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setUploadError(error.response?.data?.message || 'Failed to save profile')
    }
  }

  const handleCardSave = () => {
    console.log('Saving card:', cardData)
    setShowCardModal(false)
    setSuccessMessage('Your Card details have been saved successfully.')
    setShowSuccessModal(true)
    setHasCard(true)
  }

  const handleDeleteCard = () => {
    setHasCard(false)
    setCardData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardType: 'VISA'
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?.id) {
      // Validate file size (max 5MB as per API documentation)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file')
        return
      }

      setUploadingImage(true)
      setUploadError(null)

      try {
        // Create FormData for the API
        const formData = new FormData()
        formData.append('displayPicture', file)

        // Upload to API
        const response = await profileAPI.updateDisplayPicture(user.id, formData)
        
        if (response.data.data?.displayPicture) {
          setProfileImage(response.data.data.displayPicture)
          setSuccessMessage('Profile picture updated successfully!')
          setShowSuccessModal(true)
        }
      } catch (error: any) {
        console.error('Error uploading profile picture:', error)
        
        // Handle API not available - use localStorage fallback
        if (error.response?.status === 404) {
          // Convert file to base64 for localStorage storage
          const reader = new FileReader()
          reader.onload = (event) => {
            const base64Image = event.target?.result as string
            setProfileImage(base64Image)
            // Save to localStorage as fallback
            localStorage.setItem(`profile_picture_${user.id}`, base64Image)
            setSuccessMessage('Profile picture saved locally! (API not available yet)')
            setShowSuccessModal(true)
          }
          reader.readAsDataURL(file)
        } else {
          setUploadError(error.response?.data?.message || 'Failed to upload profile picture')
        }
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleRemoveProfilePicture = async () => {
    if (!user?.id || !confirm('Are you sure you want to remove your profile picture?')) return

    try {
      setUploadingImage(true)
      setUploadError(null)

      await profileAPI.removeDisplayPicture(user.id)
      setProfileImage(null)
      setSuccessMessage('Profile picture removed successfully!')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error removing profile picture:', error)
      
      // Handle API not available - use localStorage fallback
      if (error.response?.status === 404) {
        setProfileImage(null)
        localStorage.removeItem(`profile_picture_${user.id}`)
        setSuccessMessage('Profile picture removed locally! (API not available yet)')
        setShowSuccessModal(true)
      } else {
        setUploadError(error.response?.data?.message || 'Failed to remove profile picture')
      }
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <ClientPageHeader
        breadcrumbs={[
          { label: 'My Account' },
          { label: 'Profile Settings' },
          { label: activeTab === 'personal' ? 'Personal Information' : 'Payment Details', isActive: true }
        ]}
        title="Profile Settings"
      />

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="hidden sm:inline">Personal Information</span>
            <span className="sm:hidden">Personal</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'payment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Details
          </button>
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {uploadingImage ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : profileImage ? (
                  <Image src={profileImage} alt="Profile" fill className="object-cover" />
                ) : (user?.firstName || user?.businessName || user?.displayName) ? (
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-600">
                    {(user?.firstName || user?.businessName || user?.displayName || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FiUser className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                )}
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                disabled={uploadingImage}
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 sm:p-1.5 lg:p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiEdit2 className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
              {profileImage && !uploadingImage && (
                <button 
                  onClick={handleRemoveProfilePicture}
                  className="absolute -top-1 -right-1 bg-red-600 text-white p-1 sm:p-1.5 lg:p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <FiX className="w-2 h-2 sm:w-3 sm:h-3" />
                </button>
              )}
              {isEditing && !uploadingImage && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>
            
            {/* Upload Status Messages */}
            {uploadingImage && (
              <p className="text-xs sm:text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {uploadError && (
              <p className="text-xs sm:text-sm text-red-600 mt-2 text-center max-w-xs">{uploadError}</p>
            )}
            
            {/* API Status Notice */}
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 text-center">
                <strong>Note:</strong> Profile pictures are currently saved locally. 
                Server-side storage will be available when the backend profile endpoints are implemented.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Daniel"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date of Birth</label>
              <div className="relative">
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 pl-8 sm:pl-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="DD/MM/YY"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-event-blue rounded flex items-center justify-center">
                  <FiCalendar className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Adeboye"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Type here"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="adeboyedaniel20@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Country of Residence</label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                </select>
                <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone Number</label>
              <div className="flex">
                <div className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 border-r-0 rounded-l-lg bg-gray-50">
                  <span className="text-xs sm:text-sm text-gray-600">🇳🇬</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">City</label>
              <div className="relative">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
                <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 sm:mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Details Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Add Payment Details</h2>
            <p className="text-sm text-gray-600">Save your debit card for faster checkout</p>
          </div>

          {hasCard ? (
            /* Existing Card Display */
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Local Bank Details</h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-start sm:items-center text-xs sm:text-sm text-gray-600">
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span className="line-clamp-2">Card Information is secure and uncompromised</span>
                      </div>
                      <div className="flex items-start sm:items-center text-xs sm:text-sm text-gray-600">
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span className="line-clamp-2">All data is encrypted</span>
                      </div>
                      <div className="flex items-start sm:items-center text-xs sm:text-sm text-gray-600">
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span className="line-clamp-2">EventHub never sells your card information</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">VISA</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Verve</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 lg:text-right">
                  <div className="text-left lg:text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-700">VISA</div>
                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{cardData.cardNumber}</div>
                  </div>
                  <button
                    onClick={handleDeleteCard}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                  >
                    <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex justify-center">
                <button
                  onClick={() => setShowCardModal(true)}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Edit Card details</span>
                </button>
              </div>
            </div>
          ) : (
            /* Add Card Button */
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Local Bank Details</h3>
                <div className="space-y-1 mb-3 sm:mb-4">
                  <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                    Card Information is secure and uncompromised
                  </div>
                  <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                    All data is encrypted
                  </div>
                  <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2" />
                    EventHub never sells your card information
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">VISA</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Verve</span>
                </div>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <span className="text-lg sm:text-xl">+</span>
                  <span>Add Card details</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Card Details</h3>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Kindly fill in your Card details</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XXXX - XXXX - XXXX - XXXX"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                    <FiCreditCard className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XXX"
                  />
                </div>
              </div>
            </div>
            
            {/* Card Logos */}
            <div className="flex items-center justify-center space-x-4 my-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Mastercard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <span className="text-sm font-medium text-gray-700">VISA</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Verve</span>
              </div>
            </div>
            
            <button
              onClick={handleCardSave}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Details
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Success Icon */}
            <div className="flex justify-center pt-8 pb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Successful</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}