'use client'

import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import { FiEdit2, FiSave, FiX, FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiLogOut } from 'react-icons/fi'
import { profileAPI } from '@/lib/api'

export default function MyProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuthContext()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    bio: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/client/my-profile'))
    }
  }, [loading, isAuthenticated, router])

  // Fetch profile picture from API
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user?.id || !isAuthenticated) {
        return
      }
      
      try {
        const { profileAPI } = await import('@/lib/api')
        
        let response
        try {
          // Try the /profile/me endpoint first
          console.log('🔍 Fetching profile from /profile/me endpoint...')
          response = await profileAPI.me()
          console.log('✅ Profile fetched successfully:', response.data)
        } catch (meError: any) {
          console.error('❌ Error fetching /profile/me:', {
            status: meError.response?.status,
            statusText: meError.response?.statusText,
            url: meError.config?.url,
            baseURL: meError.config?.baseURL,
            message: meError.message
          })
          
          if (meError.response?.status === 404) {
            console.log('ℹ️ Client Profile: /profile/me endpoint not implemented (404) - trying fallback')
            // Fallback to using user ID
            try {
              console.log('🔍 Trying fallback: /profile/:id endpoint with userId:', user.id)
              response = await profileAPI.getById(user.id)
              console.log('✅ Profile fetched via fallback:', response.data)
            } catch (getByIdError: any) {
              console.error('❌ Error fetching /profile/:id:', {
                status: getByIdError.response?.status,
                statusText: getByIdError.response?.statusText,
                url: getByIdError.config?.url,
                baseURL: getByIdError.config?.baseURL,
                message: getByIdError.message
              })
              
              if (getByIdError.response?.status === 404) {
                console.log('ℹ️ Client Profile: /profile/:id endpoint also not implemented (404) - using default avatar')
                throw new Error('Profile endpoints not implemented')
              } else {
                throw getByIdError
              }
            }
          } else {
            throw meError
          }
        }
        
        if (response.data.data?.displayPicture) {
          const displayPicture = response.data.data.displayPicture
          setProfileImage(displayPicture)
          
          // Save to localStorage for fallback
          if (typeof window !== 'undefined' && user?.id) {
            localStorage.setItem(`profile_picture_${user.id}`, displayPicture)
          }
        } else {
          setProfileImage(null)
        }
      } catch (error: any) {
        console.log('ℹ️ Client Profile: Profile endpoints not available - using default avatar')
        
        // If profile endpoint doesn't work at all, try localStorage fallback
        if (error.response?.status === 404 || error.message === 'Profile endpoints not implemented') {
          const savedImage = localStorage.getItem(`profile_picture_${user.id}`)
          if (savedImage) {
            setProfileImage(savedImage)
          } else {
            setProfileImage(null)
          }
        } else {
          setProfileImage(null)
        }
      }
    }
    
    fetchProfilePicture()
    
    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchProfilePicture()
    }
    
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user?.id, isAuthenticated])

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        location: user.businessAddress || '',
        dateOfBirth: '',
        bio: ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, JPG, or PNG)')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('displayPicture', file)

      const response = await profileAPI.updateDisplayPicture(user!.id, formData)
      
      if (response.data.data?.displayPicture) {
        const displayPicture = response.data.data.displayPicture
        setProfileImage(displayPicture)
        
        // Save to localStorage for fallback
        if (typeof window !== 'undefined' && user?.id) {
          localStorage.setItem(`profile_picture_${user.id}`, displayPicture)
        }
        
        // Dispatch event to update all headers
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('profileUpdated'))
        }
        
        alert('Profile picture updated successfully!')
      }
    } catch (error: any) {
      console.error('❌ Error uploading profile picture:', {
        error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        responseData: error.response?.data
      })
      
      // Check if it's a 404 error (endpoint not implemented)
      if (error.response?.status === 404) {
        alert('Profile picture upload is not available yet. The backend endpoint is not implemented on Render backend.')
      } else if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        alert('You do not have permission to upload profile pictures.')
      } else {
        alert(`Failed to upload profile picture: ${error.response?.data?.message || error.message || 'Unknown error'}`)
      }
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    try {
      console.log('💾 Attempting to save profile data:', formData)
      
      const formDataObj = new FormData()
      formDataObj.append('firstName', formData.firstName)
      formDataObj.append('lastName', formData.lastName)
      formDataObj.append('phoneNumber', formData.phone)
      formDataObj.append('businessAddress', formData.location)
      
      console.log('📤 Sending profile update request to:', `/profile/${user!.id}`)
      const response = await profileAPI.update(user!.id, formDataObj)
      
      console.log('✅ Profile updated successfully:', response.data)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('❌ Error saving profile:', {
        error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        responseData: error.response?.data
      })
      
      // Check if it's a 404 error (endpoint not implemented)
      if (error.response?.status === 404) {
        alert('Profile update feature is not available yet. The backend endpoint is not implemented on Render backend.')
      } else if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.')
      } else if (error.response?.status === 403) {
        alert('You do not have permission to update this profile.')
      } else {
        alert(`Failed to update profile: ${error.response?.data?.message || error.message || 'Unknown error'}`)
      }
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        location: user.businessAddress || '',
        dateOfBirth: '',
        bio: ''
      })
    }
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      console.log('MyProfile: Starting logout process...')
      await logout()
      console.log('MyProfile: Logout successful, redirecting...')
      router.push('/')
    } catch (error) {
      console.error('MyProfile: Logout error:', error)
    }
  }

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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-500" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <span className="text-blue-600">My Account</span>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-900">My Profile</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                    {(() => {
                      
                      if (uploadingImage) {
                        return (
                          <div className="flex items-center justify-center w-full h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        )
                      }
                      
                      if (profileImage) {
                        return (
                          <Image 
                            src={profileImage} 
                            alt="Profile" 
                            fill
                            className="object-cover"
                            onError={() => setProfileImage(null)}
                          />
                        )
                      }
                      
                      if (user?.displayName) {
                        return (
                          <span className="text-4xl font-semibold text-gray-600">
                            {user.displayName.charAt(0).toUpperCase()}
                          </span>
                        )
                      }
                      
                      console.log('👤 Rendering default user icon')
                      return <FiUser className="w-16 h-16 text-gray-400" />
                    })()}
                  </div>
                  <label 
                    htmlFor="profile-picture-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FiCamera className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {formData.firstName} {formData.lastName}
                  {!formData.firstName && !formData.lastName && user?.businessName && (
                    <span>{user.businessName}</span>
                  )}
                </h2>
                <p className="text-gray-500 capitalize">{user?.accountType}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.lastName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-1" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.email || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline w-4 h-4 mr-1" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin className="inline w-4 h-4 mr-1" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.location || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline w-4 h-4 mr-1" />
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.dateOfBirth || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Notification Preferences</h4>
                      <p className="text-sm text-gray-500">Manage your notification settings</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Manage
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                      <p className="text-sm text-gray-500">Control your privacy and data</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
              </div>
              <div className="p-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
