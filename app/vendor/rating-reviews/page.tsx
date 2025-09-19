'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiMessageCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import ResponseModal from '@/components/ui/modals/ResponseModal'

interface Review {
  id: number
  clientName: string
  clientAvatar: string
  service: string
  rating: number
  review: string
  date: string
  response?: string
  responseDate?: string
}

export default function RatingReviewsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const reviews: Review[] = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientAvatar: '/images/avatar1.jpg',
      service: 'Wedding Cake Design',
      rating: 5,
      review: 'Absolutely amazing! The cake was exactly what I envisioned and tasted incredible. Sarah went above and beyond to make our wedding day special.',
      date: '2024-01-15',
      response: 'Thank you so much, Sarah! It was a pleasure working with you on your special day. Wishing you both a lifetime of happiness!',
      responseDate: '2024-01-16'
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      clientAvatar: '/images/avatar2.jpg',
      service: 'Corporate Event Planning',
      rating: 4,
      review: 'Great service overall. The event went smoothly and everyone was impressed. Minor communication issues but nothing major.',
      date: '2024-01-12'
    },
    {
      id: 3,
      clientName: 'Emma Wilson',
      clientAvatar: '/images/avatar3.jpg',
      service: 'Photography Package',
      rating: 5,
      review: 'Stunning photos! The photographer was professional and captured every important moment. Highly recommend!',
      date: '2024-01-10',
      response: 'Thank you, Emma! Your kind words mean the world to us. We\'re thrilled you love the photos!',
      responseDate: '2024-01-11'
    },
    {
      id: 4,
      clientName: 'John Davis',
      clientAvatar: '/images/avatar4.jpg',
      service: 'Birthday Party Setup',
      rating: 3,
      review: 'Service was okay but there were some delays. The final result was good but could have been better with better communication.',
      date: '2024-01-08'
    },
    {
      id: 5,
      clientName: 'Lisa Martinez',
      clientAvatar: '/images/avatar5.jpg',
      service: 'Anniversary Dinner',
      rating: 5,
      review: 'Perfect evening! The food was delicious and the service was impeccable. Will definitely book again for future events.',
      date: '2024-01-05'
    },
    {
      id: 6,
      clientName: 'David Brown',
      clientAvatar: '/images/avatar6.jpg',
      service: 'Graduation Party',
      rating: 2,
      review: 'Disappointed with the service. Food was cold when it arrived and the setup was not as discussed. Expected better quality.',
      date: '2024-01-03'
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Reviews', count: reviews.length },
    { id: 'responded', label: 'Responded', count: reviews.filter(r => r.response).length },
    { id: 'unresponded', label: 'Need Response', count: reviews.filter(r => !r.response).length },
    { id: 'low-rating', label: 'Low Ratings (1-2)', count: reviews.filter(r => r.rating <= 2).length }
  ]

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : activeTab === 'responded'
    ? reviews.filter(r => r.response)
    : activeTab === 'unresponded'
    ? reviews.filter(r => !r.response)
    : activeTab === 'low-rating'
    ? reviews.filter(r => r.rating <= 2)
    : reviews

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const handleRespond = (review: Review) => {
    setSelectedReview(review)
    setShowResponseModal(true)
  }

  const handleResponseSubmit = (response: string) => {
    if (selectedReview) {
      // In a real app, this would update the review with the response
      console.log('Response submitted:', { reviewId: selectedReview.id, response })
      setShowResponseModal(false)
      setSelectedReview(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Rating & Reviews</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your client reviews and ratings</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600 w-2">{rating}</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Response Stats</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Response Rate</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {Math.round((reviews.filter(r => r.response).length / reviews.length) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Avg Response Time</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">2.5 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Pending Responses</span>
              <span className="text-xs sm:text-sm font-medium text-orange-600">
                {reviews.filter(r => !r.response).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-event-blue text-event-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-event-blue text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-lg font-semibold text-gray-600">
                    {review.clientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{review.clientName}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                      review.response 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {review.response ? 'Responded' : 'Needs Response'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">{review.service}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">{review.review}</p>
                  
                  {review.response && (
                    <div className="bg-blue-50 border-l-4 border-event-blue rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900">Your Response</h4>
                        <span className="text-xs text-gray-500">
                          {review.responseDate && formatDate(review.responseDate)}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-col space-y-2 sm:ml-4">
                {!review.response ? (
                  <button 
                    onClick={() => handleRespond(review)}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors text-sm sm:text-base"
                  >
                    <FiMessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Respond</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRespond(review)}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Edit Response</span>
                  </button>
                )}
                <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-400 hover:text-red-600 transition-colors text-sm">
                  <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews</h3>
          <p className="text-gray-500">You don&apos;t have any {activeTab} reviews.</p>
        </div>
      )}

      {/* Response Modal */}
      <ResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        onSubmit={handleResponseSubmit}
        review={selectedReview}
      />
    </div>
  )
}
