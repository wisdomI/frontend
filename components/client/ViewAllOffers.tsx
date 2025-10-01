'use client'

import { useState } from 'react'
import { FiEye, FiX, FiShare2, FiMapPin, FiStar, FiCheck } from 'react-icons/fi'

interface Offer {
  id: number
  vendorName: string
  vendorLogo: string
  vendorCategory: string
  serviceDescription: string
  serviceImage: string
  location: string
  rating: number
  ratingPercentage: number
  offerAmount: string
  totalBookings: number
  sentTime: string
}

interface ViewAllOffersProps {
  serviceTitle: string
  offers: Offer[]
  onAcceptOffer: (offerId: number) => void
  onRejectOffer: (offerId: number) => void
  onCompareAll: () => void
}

export default function ViewAllOffers({
  serviceTitle,
  offers,
  onAcceptOffer,
  onRejectOffer,
  onCompareAll
}: ViewAllOffersProps) {
  console.log('ViewAllOffers rendered with:', { serviceTitle, offersCount: offers.length, offers })
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
        <p className="text-sm text-blue-800">
          ViewAllOffers Debug: serviceTitle = "{serviceTitle}", offers.length = {offers.length}
        </p>
        {offers.length > 0 && (
          <p className="text-sm text-blue-800 mt-1">
            First offer: {offers[0].vendorName} - {offers[0].offerAmount}
          </p>
        )}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">View all Offers</h2>
          <p className="text-gray-600 mt-1">{serviceTitle}</p>
        </div>
        <button
          onClick={onCompareAll}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          • Compare All Offers
        </button>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No offers available</p>
          </div>
        ) : (
          offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow-md p-6">
            {/* Top Section - Vendor Info and Timestamp */}
            <div className="flex items-start justify-between mb-4">
              {/* Vendor Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {offer.vendorCategory}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{offer.vendorName}</h3>
                </div>
              </div>
              
              {/* Timestamp and Share */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{offer.sentTime}</span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service Image */}
            <div className="mb-4">
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={offer.serviceImage} 
                  alt="Service offering" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-service.jpg'
                  }}
                />
              </div>
            </div>

            {/* Service Description */}
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {offer.serviceDescription}
            </p>

            {/* Location */}
            <div className="flex items-center space-x-2 mb-4">
              <FiMapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{offer.location}</span>
            </div>

            {/* Rating and Offer Details */}
            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.floor(offer.rating))}
                </div>
                <span className="text-sm text-gray-500">({offer.ratingPercentage}%) Offer:</span>
                <span className="font-semibold text-gray-900">{offer.offerAmount}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="font-semibold text-gray-900">{offer.totalBookings}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onRejectOffer(offer.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Reject Offer</span>
              </button>
              <button
                onClick={() => onAcceptOffer(offer.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>• Accept Offer</span>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}
