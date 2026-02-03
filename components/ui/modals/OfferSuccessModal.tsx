'use client'

import { FiX, FiCheck } from 'react-icons/fi'

interface OfferSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'accept' | 'decline'
  vendorName: string
  offerAmount: string
  onSendMessage?: () => void
  onGoToDashboard?: () => void
}

export default function OfferSuccessModal({
  isOpen,
  onClose,
  type,
  vendorName,
  offerAmount,
  onSendMessage,
  onGoToDashboard
}: OfferSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {type === 'accept' ? 'Vendor Offer Accepted Successfully' : 'Vendor Offer Declined Successfully'}
        </h2>

        {/* Message */}
        <div className="text-center mb-6">
          {type === 'accept' ? (
            <>
              <p className="text-gray-600 mb-2">
                Thank you for accepting the offer of <strong>{offerAmount} {vendorName}</strong>.
              </p>
              <p className="text-gray-600">
                You can now message the vendor directly to discuss any details, ask questions, or coordinate further.
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              You have successfully declined the offer of <strong>{offerAmount} {vendorName}</strong>.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {type === 'accept' && onSendMessage && (
            <button
              onClick={onSendMessage}
              className="w-full px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Send a Message
            </button>
          )}
          <button
            onClick={onGoToDashboard || onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {type === 'accept' ? 'Go back to Dashboard' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
