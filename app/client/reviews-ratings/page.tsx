'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiStar, FiMessageCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { ratingAPI } from '@/lib/api'

interface Review {
  id: number
  vendorName: string
  vendorAvatar: string
  service: string
  rating: number
  review: string
  date: string
  response?: string
  responseDate?: string
  clientRating?: number
  clientReview?: string
  clientReviewDate?: string
}

export default function ClientReviewsRatingsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        // This would be replaced with actual API call
        // const response = await ratingAPI.getAll()
        // setReviews(response.data.data || [])
        
        // For now, using empty array since API might not be implemented yet
        setReviews([])
      } catch (err) {
        setError('Failed to fetch reviews')
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const tabs = [
    { id: 'all', label: 'All Reviews', count: reviews.length },
    { id: 'responded', label: 'Responded', count: reviews.filter(r => r.response).length },
    { id: 'unresponded', label: 'Need Response', count: reviews.filter(r => !r.response).length },
  ]

  const filteredReviews = reviews.filter(review => {
    switch (activeTab) {
      case 'responded':
        return review.response
      case 'unresponded':
        return !review.response
      default:
        return true
    }
  })

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review)
    setShowResponseModal(true)
  }

  const handleEditReview = (review: Review) => {
    // Implement edit functionality
    console.log('Edit review:', review)
  }

  const handleDeleteReview = (review: Review) => {
    if (confirm('Are you sure you want to delete this review?')) {
      // Implement delete functionality
      console.log('Delete review:', review)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Reviews & Ratings', isActive: true }]}
          title="Reviews & Ratings"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Reviews & Ratings', isActive: true }]}
          title="Reviews & Ratings"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'Reviews & Ratings', isActive: true }]}
        title="Reviews & Ratings"
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6 pt-3">
          <div className="flex flex-wrap gap-1 bg-[#0B2E6F] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-md flex-1 min-w-0 ${
                  activeTab === tab.id ? 'bg-white text-[#0B2E6F]' : 'text-white'
                }`}
              >
                <span className="block sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className="hidden sm:block">{tab.label}</span>
                <span className="ml-1">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiStar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? 'You haven\'t received any reviews yet.'
                  : activeTab === 'responded'
                  ? 'No reviews with responses yet.'
                  : 'No reviews need responses yet.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Image
                            src={review.vendorAvatar}
                            alt={review.vendorName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{review.vendorName}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{review.service}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-800 mb-2">{review.review}</p>
                        </div>

                        {review.response && (
                          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                              <FiMessageCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">Your Response</span>
                              <span className="text-sm text-gray-600">({review.responseDate})</span>
                            </div>
                            <p className="text-gray-800">{review.response}</p>
                          </div>
                        )}

                        {review.clientRating && (
                          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-2">
                              <FiStar className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">Client Rating</span>
                              <span className="text-sm text-gray-600">({review.clientReviewDate})</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {renderStars(review.clientRating)}
                              </div>
                            </div>
                            <p className="text-gray-800">{review.clientReview}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {!review.response && (
                        <button
                          onClick={() => handleRespondToReview(review)}
                          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                        >
                          Respond
                        </button>
                      )}
                      <button
                        onClick={() => handleEditReview(review)}
                        className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review)}
                        className="px-3 sm:px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowResponseModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Respond to Review from {selectedReview.vendorName}
            </h3>
            <textarea
              placeholder="Write your response..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}