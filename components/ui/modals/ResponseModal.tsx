'use client'

import { useState } from 'react'
import { FiX, FiSend } from 'react-icons/fi'

interface Review {
  id: number
  clientName: string
  service: string
  rating: number
  review: string
  date: string
  response?: string
}

interface ResponseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (response: string) => void
  review: Review | null
}

const ResponseModal: React.FC<ResponseModalProps> = ({ isOpen, onClose, onSubmit, review }) => {
  const [response, setResponse] = useState(review?.response || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!response.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(response.trim())
      setResponse('')
    } catch (error) {
      console.error('Error submitting response:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {review.response ? 'Edit Response' : 'Respond to Review'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Review Details */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-semibold text-gray-600">
                    {review.clientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{review.clientName}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{review.service}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.date)}</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700">{review.review}</p>
          </div>
        </div>

        {/* Response Form */}
        <div className="p-4 sm:p-6">
          {review.response ? (
            // Show existing response (read-only)
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-700">
                {review.response}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Responses cannot be edited once submitted
              </p>
            </div>
          ) : (
            // Show response form for new responses
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write a professional response to this review..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent resize-none text-sm sm:text-base"
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Keep your response professional and helpful
                </p>
                <span className="text-xs text-gray-400">
                  {response.length}/500 characters
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              {review.response ? 'Close' : 'Cancel'}
            </button>
            {!review.response && (
              <button
                onClick={handleSubmit}
                disabled={!response.trim() || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FiSend className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Response'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponseModal
