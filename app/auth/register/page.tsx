'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import AccountTypeSelectionModal from '@/components/ui/modals/AccountTypeSelectionModal'
import VerificationMethodModal from '@/components/ui/modals/VerificationMethodModal'
import EmailVerificationModal from '@/components/ui/modals/EmailVerificationModal'
import PhoneVerificationModal from '@/components/ui/modals/PhoneVerificationModal'
import VerificationSuccessModal from '@/components/ui/modals/VerificationSuccessModal'

export default function RegisterPage() {
  const router = useRouter()
  const { addNotification } = useApp()
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationMethodModal, setShowVerificationMethodModal] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedAccountType, setSelectedAccountType] = useState<'individual' | 'vendor' | null>(null)
  const [verificationType, setVerificationType] = useState<'email' | 'phone' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [registrationStep, setRegistrationStep] = useState<'form' | 'loading' | 'verification'>('form')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [formData, setFormData] = useState({
    accountType: 'vendor',
    firstName: '',
    lastName: '',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })

  const handleAccountTypeSelect = (type: 'individual' | 'vendor') => {
    setSelectedAccountType(type)
    setFormData(prev => ({ ...prev, accountType: type }))
    setShowVerificationMethodModal(true)
  }

  const handleVerificationMethodSelect = (method: 'email' | 'phone') => {
    setVerificationType(method)
    if (method === 'email') {
      setShowEmailVerification(true)
    } else {
      setShowPhoneVerification(true)
    }
  }

  const handleEmailVerify = async (code: string) => {
    console.log('Email verification code:', code)
    try {
      const response = await authAPI.verifyEmail({ email: registrationData?.email || formData.email, code })
      
      console.log('Email verification response:', response)
      addNotification({
        type: 'success',
        message: 'Email verified successfully!'
      })
      
      setShowEmailVerification(false)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Email verification error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Email verification failed'
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  const handleResendCode = async () => {
    try {
      const email = registrationData?.email || formData.email
      if (!email) {
        addNotification({
          type: 'error',
          message: 'Email not found. Please register again.'
        })
        return
      }
      
      // FIXED: Ensure we're passing the correct object format
      await authAPI.resendVerificationCode({ email })
      addNotification({
        type: 'success',
        message: 'Verification code resent successfully! Please check your email (including spam folder).'
      })
    } catch (error: any) {
      console.error('Resend code error:', error)
      
      // FIXED: Provide more specific error messages
      let errorMessage = 'Failed to resend verification code'
      if (error.response?.status === 404) {
        errorMessage = 'Email not found. Please register again.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a few minutes before requesting again.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  const handlePhoneVerify = async (code: string) => {
    console.log('Phone verification code:', code)
    try {
      // Note: Phone verification endpoint might be different in the API
      // For now, we'll simulate success
      addNotification({
        type: 'success',
        message: 'Phone verified successfully!'
      })
      
      setShowPhoneVerification(false)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Phone verification error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Phone verification failed'
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  // const handleResendCode = async () => {
  //   try {
  //     // Resend verification code logic
  //     console.log('Resending verification code...')
  //     addNotification({
  //       type: 'info',
  //       message: 'Verification code resent!'
  //     })
  //   } catch (error: any) {
  //     console.error('Resend code error:', error)
  //     addNotification({
  //       type: 'error',
  //       message: 'Failed to resend verification code'
  //     })
  //   }
  // }

  const handleLogin = () => {
    setShowSuccessModal(false)
    router.push('/auth/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate form data
      if (formData.password !== formData.confirmPassword) {
        addNotification({
          type: 'error',
          message: 'Passwords do not match'
        })
        return
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
      
      if (!passwordRegex.test(formData.password)) {
        addNotification({
          type: 'error',
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        })
        return
      }
      
      // Prepare registration data according to API documentation
      const registrationPayload: any = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType,
        phoneNumber: `+234${formData.phoneNumber}` // Add country code
      }
      
      // Add fields based on account type
      if (formData.accountType === 'vendor') {
        // For vendor accounts - use business fields
        registrationPayload.businessName = formData.businessName
        registrationPayload.businessAddress = formData.businessAddress || 'Lagos, Nigeria'
        registrationPayload.businessEmail = formData.businessEmail || formData.email
      } else {
        // For individual/organisation accounts - use personal fields
        registrationPayload.firstName = formData.firstName
        registrationPayload.lastName = formData.lastName
        // Map accountType to API expected values
        registrationPayload.accountType = 'individual' // API expects 'individual' for both individual and organisation
      }
      
      // Store registration data for later use
      setRegistrationData(registrationPayload)
      
      // Start async registration process
      setRegistrationStep('loading')
      setIsLoading(true)
      
      // Simulate loading progress (30 seconds max)
      const startTime = Date.now()
      const maxDuration = 30000 // 30 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / maxDuration) * 100, 95) // Cap at 95% until API completes
        setLoadingProgress(progress)
      }, 100)
      
      // Call the real API
      const response = await authAPI.register(registrationPayload)
      
      clearInterval(progressInterval)
      setLoadingProgress(100)
      
      console.log('Registration response:', response)
      
      // Wait a bit for the progress bar to complete
      setTimeout(() => {
        setRegistrationStep('verification')
        setIsLoading(false)
        
        // FIXED: Provide clear instruction to check email (including spam folder)
        addNotification({
          type: 'success',
          message: 'Registration successful! A verification code has been sent to your email. Please check your inbox (and spam folder).'
        })
        
        // Automatically show email verification
        setShowEmailVerification(true)
      }, 500)
      
    } catch (error: any) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      
      setRegistrationStep('form')
      setIsLoading(false)
      setLoadingProgress(0)
      
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(`Input change - ${name}:`, value)
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  // Loading step component
  const LoadingStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 relative my-8 sm:my-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2E6F] font-asul">Creating Your Account</h2>
          <p className="mt-3 text-gray-600">Please wait while we set up your EventHub account...</p>
          
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-[#0B2E6F] h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{Math.round(loadingProgress)}% Complete</p>
          </div>
          
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>✓ Validating your information</p>
            <p>✓ Setting up your account</p>
            <p>✓ Sending verification email</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Verification step component
  const VerificationStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 relative my-8 sm:my-12">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2E6F] font-asul">Verify Your Email</h2>
          <p className="mt-3 text-gray-600">
            We&apos;ve sent a 6-digit verification code to <strong>{registrationData?.email || formData.email}</strong>
          </p>
          
          {/* Verification Code Input Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>📧 Check your email</strong> for the verification code. It should arrive within 1-2 minutes.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              💡 Tip: Check your <strong>spam/junk folder</strong> if you don&apos;t see it in your inbox.
            </p>
          </div>

          {/* Main Resend Button */}
          <div className="mt-8">
            <button
              onClick={handleResendCode}
              className="w-full px-6 py-3 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition font-semibold text-lg"
            >
              📨 Resend Verification Code
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Didn&apos;t receive the code? Click above to send it again.
            </p>
          </div>

          {/* Secondary Help Options */}
          <div className="mt-8 space-y-3">
            <div className="text-sm">
              <p className="text-gray-600 mb-3">Other options:</p>
              <button
                onClick={() => setRegistrationStep('form')}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                ← Back to Registration
              </button>
              <span className="text-gray-400 mx-2">|</span>
              <a
                href="https://eventhub.com/support"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Need Help?
              </a>
            </div>
          </div>

          {/* Final Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Once you have the code, you&apos;ll be able to enter it in the verification modal that appears when you try to log in, or from the login page if you haven&apos;t verified yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render appropriate step
  if (registrationStep === 'loading') {
    return <LoadingStep />
  }

  if (registrationStep === 'verification') {
    return <VerificationStep />
  }

  // Form step (default)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 relative my-8 sm:my-12">
        <button
          aria-label="Close"
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 w-8 h-8 rounded bg-[#0B2E6F] text-white flex items-center justify-center hover:bg-[#0A285F] transition"
        >
          ×
        </button>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2E6F] font-asul">Create an EventHub Account</h2>
        <p className="mt-3 text-gray-600">EventHub makes your Event Planning easy.</p>

        {/* Account Type Toggle */}
        <div className="mt-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, accountType: 'vendor' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.accountType === 'vendor'
                  ? 'bg-[#0B2E6F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, accountType: 'individual' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.accountType === 'individual'
                  ? 'bg-[#0B2E6F] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Individual/Organisation
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Dynamic Fields Based on Account Type */}
          {formData.accountType === 'vendor' ? (
            // Vendor Fields
            <>
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Company Name"
                />
              </div>

              <div>
                <label htmlFor="businessAddress" className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Company Address"
                />
              </div>

              <div>
                <label htmlFor="businessEmail" className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
                <input
                  id="businessEmail"
                  name="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Business Email"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Personal Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Personal Email"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">Business Phone Number</label>
                <div className="flex">
                  <select className="h-12 px-3 border border-gray-200 border-r-0 rounded-l-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]">
                    <option>🇳🇬 +234</option>
                  </select>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full h-12 rounded-r-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </>
          ) : (
            // Individual/Organisation Fields
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter First Name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Last Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full h-12 rounded-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                  placeholder="Enter Email Address"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="flex">
                  <select className="h-12 px-3 border border-gray-200 border-r-0 rounded-l-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]">
                    <option>🇳🇬 +234</option>
                  </select>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full h-12 rounded-r-lg border border-gray-200 bg-white px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full h-12 rounded-lg border border-gray-200 bg-white pl-3 pr-10 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                placeholder="Enter Password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must contain: uppercase, lowercase, number, and special character (@$!%*?&)</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full h-12 rounded-lg border border-gray-200 bg-white pl-3 pr-10 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] focus:border-[#0B2E6F]"
                placeholder="Enter Password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg text-white bg-[#0B2E6F] hover:bg-[#0A285F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="spinner w-5 h-5"></div>
              ) : (
                'Continue'
              )}
            </button>
          </div>

          <div className="text-center text-gray-700">
            Already have an Account? <a href="/auth/login" className="text-[#0B2E6F] font-semibold">Login</a>
          </div>
        </form>
      </div>

      {/* Modals */}
      <AccountTypeSelectionModal
        isOpen={showAccountTypeModal}
        onClose={() => setShowAccountTypeModal(false)}
        onSelectAccountType={handleAccountTypeSelect}
      />

      <VerificationMethodModal
        isOpen={showVerificationMethodModal}
        onClose={() => setShowVerificationMethodModal(false)}
        onSelectMethod={handleVerificationMethodSelect}
      />

      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        email={registrationData?.email || formData.email}
        onVerify={handleEmailVerify}
        onResend={handleResendCode}
      />

      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        phoneNumber={registrationData?.phoneNumber || formData.phoneNumber}
        onVerify={handlePhoneVerify}
        onResend={handleResendCode}
      />

      <VerificationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type={verificationType || 'email'}
        onLogin={handleLogin}
      />
    </div>
  )
}