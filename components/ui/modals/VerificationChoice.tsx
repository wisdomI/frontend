'use client'

import { FaTimes } from 'react-icons/fa'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'

interface VerificationChoiceModalProps {
  onEmail: () => void
  onPhone: () => void
  onClose: () => void
}

export default function VerificationChoiceModal({
  onEmail,
  onPhone,
  onClose,
}: VerificationChoiceModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-event-blue">
          Verification
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Choose how you would like to verify your profile
        </p>

        {/* Email Option */}
        <div
          onClick={onEmail}
          role="button"
          tabIndex={0}
          className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-event-blue"
        >
          <span className="bg-blue-100 p-3 rounded-full text-blue-700">
            <AiOutlineMail size={20} />
          </span>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-gray-500">
              We will send a verification code to your email address
            </p>
          </div>
        </div>

        {/* Phone Option */}
        <div
          onClick={onPhone}
          role="button"
          tabIndex={0}
          className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-event-blue"
        >
          <span className="bg-blue-100 p-3 rounded-full text-blue-700">
            <AiOutlinePhone size={20} />
          </span>
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-500">
              We will send an SMS with a verification code to your phone
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
