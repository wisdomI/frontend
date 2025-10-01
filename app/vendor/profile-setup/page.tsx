'use client'

import { useState, useEffect } from 'react'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'
import { useAuthContext } from '@/contexts/AuthContext'
import AddPortfolioModal from '@/components/ui/modals/AddPortfolioModal'
import AddServiceOfferingModal from '@/components/ui/modals/AddServiceOfferingModal'
import AddTravelInfoModal from '@/components/ui/modals/AddTravelInfoModal'
import AddBankDetailsModal from '@/components/ui/modals/AddBankDetailsModal'
import SuccessModal from '@/components/ui/modals/SuccessModal'

interface Step {
  id: string
  label: string
  completed: boolean
  active: boolean
}

const ProfileSetupPage = () => {
  const router = useRouter()
  const { profileStatus, updateProfileCompletion, markProfileComplete } = useProfileCompletion()
  const { user, isAuthenticated, loading } = useAuthContext()
  const [activeStep, setActiveStep] = useState('business-details')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [completedSteps, setCompletedSteps] = useState(profileStatus.completedSteps.length > 0 ? profileStatus.completedSteps : ['business-details'])

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/vendor/profile-setup'))
    }
  }, [loading, isAuthenticated, router])

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

  const handleSaveAndContinue = () => {
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
  }

  const handleGoBack = () => {
    router.back()
  }

  const renderBusinessDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Business Display Picture */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {(user?.businessName || user?.firstName || user?.displayName) ? (
              <span className="text-gray-600 text-sm font-semibold">
                {(user?.businessName || user?.firstName || user?.displayName || 'V').charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-gray-500 text-sm">Business Logo</span>
            )}
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm">
            Edit
          </button>
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            defaultValue={user?.businessName || user?.firstName || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your business name"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            defaultValue={user?.firstName || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            defaultValue={user?.lastName || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Business Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone Number</label>
          <div className="flex gap-2">
            <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>🇳🇬 +234</option>
            </select>
            <input
              type="tel"
              defaultValue={user?.phoneNumber || ''}
              placeholder="Phone number"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Nigeria</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Lagos</option>
          </select>
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
          <input
            type="text"
            defaultValue={user?.businessAddress || ''}
            placeholder="Enter Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Business Display Picture</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">📁</div>
            <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
            <p className="text-gray-400 text-sm mb-4">JPEG, PNG, PDG, MP4 formats, up to 50MB</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Browse File
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            rows={6}
            placeholder="Type here"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Set Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Availability</label>
          <input
            type="text"
            placeholder="Select Dates and Time that applies"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
          <div className="space-y-3">
            <input
              type="url"
              defaultValue="http://facebook.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              defaultValue="http://Instagram.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              defaultValue="http://Twitter.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Website Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website Links</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                defaultValue="http://eventhub.com"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                📋
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                defaultValue="http://eventhub.com"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderServiceOffering = () => (
    <div className="space-y-6">
      {/* My Portfolio */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Portfolio</h3>
          <AddPortfolioModal />
        </div>
        <p className="text-gray-500">No Portfolio has been added</p>
      </div>

      {/* My Service Offering */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Service Offering</h3>
          <AddServiceOfferingModal />
        </div>
        <p className="text-gray-500">No Service Offering has been added</p>
      </div>

      {/* My Travel Availability */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Travel Availability</h3>
          <AddTravelInfoModal />
        </div>
        <p className="text-gray-500">No Travel Information has been added</p>
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Profile Setup</h1>
        </div>

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
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
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
                </div>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                step.active
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          {renderContent()}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleSaveAndContinue}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save & Continue
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
