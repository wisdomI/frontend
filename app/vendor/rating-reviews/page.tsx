'use client'

import { useState } from 'react'

export default function RatingReviewsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const reviews = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientAvatar: '/images/avatar1.jpg',
      service: 'Wedding Cake Design',
      rating: 5,
      review: 'Absolutely amazing! The cake was exactly what I envisioned and tasted incredible. Sarah went above and beyond to make our wedding day special.',
      date: '2024-01-15',
      status: 'published',
      response: 'Thank you so much, Sarah! It was a pleasure working with you on your special day. Wishing you both a lifetime of happiness!'
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      clientAvatar: '/images/avatar2.jpg',
      service: 'Corporate Event Planning',
      rating: 4,
      review: 'Great service overall. The event went smoothly and everyone was impressed. Minor communication issues but nothing major.',
      date: '2024-01-12',
      status: 'published',
      response: null
    },
    {
      id: 3,
      clientName: 'Emma Wilson',
      clientAvatar: '/images/avatar3.jpg',
      service: 'Photography Package',
      rating: 5,
      review: 'Stunning photos! The photographer was professional and captured every important moment. Highly recommend!',
      date: '2024-01-10',
      status: 'published',
      response: 'Thank you, Emma! Your kind words mean the world to us. We\'re thrilled you love the photos!'
    },
    {
      id: 4,
      clientName: 'John Davis',
      clientAvatar: '/images/avatar4.jpg',
      service: 'Birthday Party Setup',
      rating: 3,
      review: 'Service was okay but there were some delays. The final result was good but could have been better with better communication.',
      date: '2024-01-08',
      status: 'pending',
      response: null
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Reviews', count: reviews.length },
    { id: 'published', label: 'Published', count: reviews.filter(r => r.status === 'published').length },
    { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'pending').length },
    { id: 'flagged', label: 'Flagged', count: reviews.filter(r => r.status === 'flagged').length }
  ]

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(r => r.status === activeTab)

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rating & Reviews</h1>
        <p className="text-gray-600">Manage your client reviews and ratings</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 w-2">{rating}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900">New 5-star review</p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">Review published</p>
              <p className="text-gray-500">1 day ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">Response added</p>
              <p className="text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-event-blue text-event-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
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
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src={review.clientAvatar}
                  alt={review.clientName}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{review.clientName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      review.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium mb-2">{review.service}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{review.review}</p>
                  
                  {review.response && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Your Response</h4>
                      <p className="text-gray-700">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!review.response && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Respond
                  </button>
                )}
                {review.status === 'pending' && (
                  <button className="px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors">
                    Approve
                  </button>
                )}
                <button className="text-gray-400 hover:text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
          <p className="text-gray-500">You don't have any {activeTab} reviews.</p>
        </div>
      )}
    </div>
  )
}
