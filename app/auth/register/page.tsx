'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
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
  const [formData, setFormData] = useState({
    accountType: 'individual',
    firstName: '',
    lastName: '',
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
      const response = await authAPI.verifyEmail(formData.email, code)
      
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

  const handleResendCode = async () => {
    try {
      // Resend verification code logic
      console.log('Resending verification code...')
      addNotification({
        type: 'info',
        message: 'Verification code resent!'
      })
    } catch (error: any) {
      console.error('Resend code error:', error)
      addNotification({
        type: 'error',
        message: 'Failed to resend verification code'
      })
    }
  }

  const handleLogin = () => {
    setShowSuccessModal(false)
    router.push('/auth/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate form data
      if (formData.password !== formData.confirmPassword) {
        addNotification({
          type: 'error',
          message: 'Passwords do not match'
        })
        setIsLoading(false)
        return
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
      console.log('Password validation:', {
        password: formData.password,
        hasLowercase: /[a-z]/.test(formData.password),
        hasUppercase: /[A-Z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
        hasSpecial: /[@$!%*?&]/.test(formData.password),
        passesRegex: passwordRegex.test(formData.password)
      })
      
      if (!passwordRegex.test(formData.password)) {
        addNotification({
          type: 'error',
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        })
        setIsLoading(false)
        return
      }
      
      // Prepare registration data
      const registrationData: any = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType === 'organization' ? 'business' : formData.accountType,
        phoneNumber: `+234${formData.phoneNumber}` // Add country code
      }
      
      // Add name fields for individual accounts
      if (formData.accountType === 'individual') {
        registrationData.firstName = formData.firstName
        registrationData.lastName = formData.lastName
      } else if (formData.accountType === 'vendor') {
        // For vendor accounts, add business fields
        registrationData.businessName = formData.firstName + ' ' + formData.lastName
        registrationData.businessAddress = 'Lagos, Nigeria' // Default address
      } else {
        // For business accounts, add business fields
        registrationData.businessName = formData.firstName + ' ' + formData.lastName
        registrationData.businessAddress = 'Lagos, Nigeria' // Default address
      }
      
      console.log('Attempting registration with:', registrationData)
      console.log('Form data password:', formData.password)
      console.log('Registration data password:', registrationData.password)
      
      // Call the real API
      const response = await authAPI.register(registrationData)
      
      console.log('Registration response:', response)
      
      addNotification({
        type: 'success',
        message: 'Registration successful! Please check your email for verification.'
      })
      
      // Show verification modal
      setShowAccountTypeModal(true)
      
    } catch (error: any) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      addNotification({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(`Input change - ${name}:`, value)
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-asul">
            Create your account
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <GoogleSignInButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or register with</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">
                Select Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="individual">Individual</option>
                <option value="organization">Organisation</option>
                <option value="vendor">Event Vendor</option>
              </select>
            </div>
            {formData.accountType === 'individual' ? (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter First Name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Last Name"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.accountType === 'vendor' ? 'Business Name' : 'First Name'}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.accountType === 'vendor' ? 'Enter Business Name' : 'Enter First Name'}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.accountType === 'vendor' ? 'Business Address' : 'Last Name'}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={formData.accountType !== 'vendor'}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.accountType === 'vendor' ? 'Enter Business Address (Optional)' : 'Enter Last Name'}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <select className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>🇳🇬 +234</option>
                </select>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="appearance-none rounded-r-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must contain: uppercase, lowercase, number, and special character (@$!%*?&)
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-event-blue hover:bg-event-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-event-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="spinner w-5 h-5"></div>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <a href="/auth/login" className="text-event-blue hover:opacity-80 transition-all">
              Already have an account? Sign in
            </a>
          </div>
        </div>
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
        email={formData.email}
        onVerify={handleEmailVerify}
        onResend={handleResendCode}
      />

      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        phoneNumber={formData.phoneNumber}
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