'use client'

import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'

interface CodeVerificationModalProps {
  contact: string
  type: 'email' | 'phone'
  onVerify: (code: string) => void
  onResend: () => void
  onClose: () => void
}

export default function CodeVerificationModal({
  contact,
  type,
  onVerify,
  onResend,
  onClose,
}: CodeVerificationModalProps) {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleVerify = async () => {
    if (code.length !== 6) {
      return
    }
    setIsVerifying(true)
    try {
      await onVerify(code)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage('Sending verification code...')
    try {
      await onResend()
      setResendMessage('✅ Code sent! Check your email.')
      setTimeout(() => setResendMessage(''), 3000)
    } catch (error) {
      setResendMessage('❌ Failed to resend code')
      setTimeout(() => setResendMessage(''), 3000)
    } finally {
      setIsResending(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setCode(value.slice(0, 6))
  }

  const isCodeValid = code.length === 6
  const isVerifyDisabled = !isCodeValid || isVerifying

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded hover:bg-blue-700 transition-colors"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-event-blue">
          Verification
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Verify your {type === 'email' ? 'Email' : 'Phone Number'}
        </p>
        <p className="text-center text-gray-500 mb-2">
          Enter the 6-digit code sent to{' '}
          <span className="font-medium">{contact}</span>
        </p>
        {type === 'email' && (
          <p className="text-center text-xs text-gray-400 mb-6">
            💡 Don&apos;t see the email? Check your spam/junk folder.
          </p>
        )}

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={handleCodeChange}
          inputMode="numeric"
          placeholder="000000"
          className="w-full border border-gray-300 rounded-lg p-3 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-event-blue disabled:bg-gray-100"
          disabled={isVerifying}
        />

        {isCodeValid && !isVerifying && (
          <p className="text-xs text-green-600 text-center mt-2">✅ Code ready to verify</p>
        )}
        {isVerifying && (
          <p className="text-xs text-blue-600 text-center mt-2">⏳ Verifying...</p>
        )}

        <button
          onClick={handleVerify}
          disabled={isVerifyDisabled}
          className={`w-full py-3 rounded-lg mt-4 font-semibold transition-all ${
            isVerifyDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-event-blue text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⟳</span>
              Verifying...
            </span>
          ) : (
            'Verify'
          )}
        </button>

        <div className="flex flex-col items-center gap-2 mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Didn&apos;t get code?</p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className={`text-sm font-medium transition-colors ${
              isResending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-event-blue hover:text-blue-700 hover:underline'
            }`}
          >
            {isResending ? (
              <span className="flex items-center gap-1">
                <span className="inline-block animate-spin">⟳</span>
                Resending...
              </span>
            ) : (
              'Resend Code'
            )}
          </button>

          {resendMessage && (
            <p className={`text-xs mt-2 ${resendMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
