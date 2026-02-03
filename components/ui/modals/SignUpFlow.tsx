'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SignUpModal from './SignUpForm'
import VerificationChoiceModal from './VerificationChoice'
import CodeVerificationModal from './VerificationCode'
import SuccessModal from './SuccessModal'
import AccountTypeModal from './AccountTypeModal'
import LoginForm from '@/components/auth/LoginForm'
import LoginModal from './LoginForm'
import { authAPI } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'

export default function SignUpFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'account' | 'signup' | 'choice' | 'code' | 'success' | 'login'>(
    'account'
  )
  const [contact, setContact] = useState('')
  const [type, setType] = useState<'email' | 'phone'>('email')
  const [selectedAccountType, setSelectedAccountType] = useState<'individual' | 'vendor'>('individual')
  const [registrationData, setRegistrationData] = useState<any>(null)
  const router = useRouter()
  const { addNotification } = useApp()

  // Handle modal transitions
  const handleAccountTypeSelect = (accountType: string) => {
    setSelectedAccountType(accountType as 'individual' | 'vendor')
    setStep('signup')
  }

  const handleRegistrationSubmit = async (formData: any) => {
    try {
      // Prepare registration data based on account type
      const registrationPayload: any = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: selectedAccountType,
        phoneNumber: `+234${formData.phoneNumber}`
      }

      // Add name fields for individual accounts
      if (selectedAccountType === 'individual') {
        registrationPayload.firstName = formData.firstName
        registrationPayload.lastName = formData.lastName
      } else {
        // For business/vendor accounts, add business fields
        registrationPayload.businessName = formData.businessName
        registrationPayload.businessAddress = formData.businessAddress || 'Lagos, Nigeria'
        registrationPayload.businessEmail = formData.businessEmail || formData.email
      }

      console.log('Registering user with:', registrationPayload)
      
      // Call the registration API
      const response = await authAPI.register(registrationPayload)
      
      // Enhanced logging for debugging OTP issues
      console.log('Registration response:', response)
      console.log('Registration response data:', response?.data)
      console.log('Registration response message:', response?.data?.message)
      console.log('Full response structure:', JSON.stringify(response?.data, null, 2))
      
      // Store registration data for verification
      setRegistrationData(registrationPayload)
      setContact(formData.email)
      setType('email')
      
      // Check response for OTP-related status
      const responseMessage = (response?.data?.message || '').toLowerCase()
      
      // Check for explicit OTP sending failure indicators
      const hasOtpError = responseMessage.includes('otp') && 
                          (responseMessage.includes('failed') || 
                           responseMessage.includes('error') || 
                           responseMessage.includes('not sent') ||
                           responseMessage.includes('unable to send'))
      
      // If there's an explicit OTP error, try to resend automatically
      if (hasOtpError) {
        console.warn('OTP sending failed during registration. Attempting to resend...')
        try {
          await authAPI.resendVerificationCode({ email: registrationPayload.email })
          addNotification({
            type: 'success',
            message: 'Registration successful! Verification code has been resent to your email. Please check your inbox (and spam folder).'
          })
        } catch (resendError: any) {
          console.error('Failed to resend verification code:', resendError)
          const resendErrorMessage = resendError.response?.data?.message || resendError.message || 'Unknown error'
          addNotification({
            type: 'warning',
            message: `Registration successful, but verification code could not be sent. Error: ${resendErrorMessage}. Please use the "Resend Code" button below.`
          })
        }
      } else {
        // Normal success case - assume OTP was sent by backend
        addNotification({
          type: 'success',
          message: 'Registration successful! A verification code has been sent to your email. Please check your inbox (and spam folder).'
        })
      }
      
      setStep('choice')
    } catch (error: any) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  const handleEmailChoice = () => {
    setType('email')
    setStep('code')
  }

  const handlePhoneChoice = () => {
    setType('phone')
    setStep('code')
  }

  const handleVerifyCode = async (code: string) => {
    try {
      console.log('Verifying code:', code)
      
      // Call email verification API
      if (type === 'email' && registrationData) {
        await authAPI.verifyEmail({ email: registrationData.email, code })
        
        addNotification({
          type: 'success',
          message: 'Email verified successfully!'
        })
      }
      
      setStep('success')
    } catch (error: any) {
      console.error('Verification error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed'
      addNotification({
        type: 'error',
        message: errorMessage
      })
    }
  }

  const handleLogin = () => {
    // Close the modal and redirect to login page
    onClose()
    router.push('/auth/login')
  }

  return (
    <>
      {step === 'account' && (
        <AccountTypeModal
          onClose={onClose}
          onSelect={handleAccountTypeSelect}
        />
      )}
      {step === 'signup' && (
        <SignUpModal 
          onClose={onClose} 
          onContinue={handleRegistrationSubmit}
          accountType={selectedAccountType}
        />
      )}
      {step === 'choice' && (
        <VerificationChoiceModal
          onClose={onClose}
          onEmail={handleEmailChoice}
          onPhone={handlePhoneChoice}
        />
      )}
      {step === 'code' && (
        <CodeVerificationModal
          contact={contact}
          type={type}
          onVerify={handleVerifyCode}
          onResend={async () => {
            try {
              if (registrationData?.email) {
                // FIXED: Pass object with email property, not just the email string
                await authAPI.resendVerificationCode({ email: registrationData.email })
                addNotification({
                  type: 'success',
                  message: 'Verification code resent successfully! Please check your email (including spam folder).'
                })
              } else {
                addNotification({
                  type: 'error',
                  message: 'Email not found. Please register again.'
                })
              }
            } catch (error: any) {
              console.error('Resend verification error:', error)
              
              // FIXED: Provide more detailed error messages
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
          }}
          onClose={onClose}
        />
      )}
      {step === 'success' && (
        <SuccessModal
          isOpen={true}
          type="account-creation"
          message="Your account has been successfully created!"
          onLogin={handleLogin}
          onClose={onClose}
          verificationType={type === "email" ? "Email" : "Phone number"}
        />
      )}
      {step === 'login' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginForm accountType={selectedAccountType === 'individual' ? 'client' : 'vendor'} />
          </div>
        </div>
      )}
    </>
  )
}
