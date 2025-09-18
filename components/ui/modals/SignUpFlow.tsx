'use client'

import { useState } from 'react'
import SignUpModal from './SignUpForm'
import VerificationChoiceModal from './VerificationChoice'
import CodeVerificationModal from './VerificationCode'
import SuccessModal from './SuccessModal'
import AccountTypeModal from './AccountTypeModal'
import LoginForm from '@/components/auth/LoginForm'
import LoginModal from './LoginForm'

export default function SignUpFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'account' | 'signup' | 'choice' | 'code' | 'success' | 'login'>(
    'account'
  )
  const [contact, setContact] = useState('')
  const [type, setType] = useState<'email' | 'phone'>('email')

  // Handle modal transitions
  const handleContinueFromAccount = () => {
    setStep('signup')
  }

  const handleContinueFromSignup = () => {
    setStep('choice')
  }

  const handleEmailChoice = () => {
    setType('email')
    setContact('user@example.com') 
    setStep('code')
  }

  const handlePhoneChoice = () => {
    setType('phone')
    setContact('+234 812 345 6789') 
    setStep('code')
  }

  const handleVerifyCode = (code: string) => {
    console.log('Verifying code:', code)
    setStep('success')
  }

  const handleLogin = () => {
    console.log('login step')
    setStep('login')
  }

  return (
    <>
      {step === 'account' && (
        <AccountTypeModal
        onClose={onClose}
          onSelect={handleContinueFromAccount}
        />
      )}
      {step === 'signup' && (
        <SignUpModal onClose={onClose} onContinue={handleContinueFromSignup} />
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
          onResend={() => console.log('Resending code')}
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
        <LoginModal onClose={onClose}/>
      )}
    </>
  )
}
