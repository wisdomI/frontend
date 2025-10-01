'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerify: (code: string) => void
  onResend: () => void
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  email, 
  onVerify, 
  onResend 
}: EmailVerificationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(90) // 1:30 in seconds
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, timeLeft])

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(90)
      setCode(['', '', '', '', '', ''])
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i]
    }
    
    setCode(newCode)
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleResend = async () => {
    if (timeLeft > 0) return
    
    setIsResending(true)
    await onResend()
    setTimeLeft(90)
    setIsResending(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Email Verification</h2>
          <button
            onClick={onClose}
            className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6">
            Enter the 6-digit code sent to your{' '}
            <span className="text-blue-600 font-medium">{email}</span>
          </p>

          {/* Code Input Fields */}
          <div className="flex justify-center space-x-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => onVerify(code.join(''))}
            disabled={code.some(digit => digit === '')}
            className={`w-full py-3 rounded-lg font-medium transition-colors mb-4 ${
              code.every(digit => digit !== '')
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify
          </button>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Didn&apos;t get code?{' '}
              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || isResending}
                className={`font-medium ${
                  timeLeft > 0 || isResending
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </p>
            
            {timeLeft > 0 && (
              <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(timeLeft)} Seconds
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
