'use client'
import React, { useState } from 'react'
import { FiX, FiMapPin, FiCalendar, FiUsers, FiStar, FiClock } from 'react-icons/fi'
import PlaceBidModal from './PlaceBidModal'

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  serviceRequest: {
    id: number
    title: string
    location: string
    date: string
    description: string
    tags: string[]
    budget: string
    guestCount: number
    requirements: string[]
    clientInfo: {
      name: string
      rating: number
      eventsHosted: number
      totalSpent: string
      paymentHistory: string
      communication: string
      reviews: string
      memberSince: string
      avatar: string
    }
    samples: string[]
  }
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  serviceRequest
}) => {
  const [isPlaceBidModalOpen, setIsPlaceBidModalOpen] = useState(false)

  const handlePlaceBid = () => {
    setIsPlaceBidModalOpen(true)
  }

  const handleClosePlaceBidModal = () => {
    setIsPlaceBidModalOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{serviceRequest.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Left Panel - Service Details */}
          <div className="flex-1 p-6">
            {/* Event Details */}
            <div className="mb-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">{serviceRequest.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-5 h-5 mr-2" />
                  <span>{serviceRequest.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUsers className="w-5 h-5 mr-2" />
                  <span>{serviceRequest.guestCount} People</span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-lg font-semibold text-green-600">{serviceRequest.budget}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{serviceRequest.description}</p>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specific Requirements</h3>
              <ul className="space-y-2">
                {serviceRequest.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {serviceRequest.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Place Bid Button */}
            <button 
              onClick={handlePlaceBid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Place Bid
            </button>
          </div>

          {/* Right Panel - Client Information */}
          <div className="w-80 border-l border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
            
            {/* Client Profile */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-medium text-lg">S</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{serviceRequest.clientInfo.name}</div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(serviceRequest.clientInfo.rating)
                          ? 'text-yellow-400 fill-current'
                          : i < serviceRequest.clientInfo.rating
                          ? 'text-yellow-400 fill-current opacity-50'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{serviceRequest.clientInfo.rating}</span>
                </div>
              </div>
            </div>

            {/* Client Metrics */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Events Hosted</span>
                <span className="font-medium">{serviceRequest.clientInfo.eventsHosted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-medium">{serviceRequest.clientInfo.totalSpent}</span>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-700">Payment History</span>
                <p className="text-sm text-gray-600">{serviceRequest.clientInfo.paymentHistory}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Communication</span>
                <p className="text-sm text-gray-600">{serviceRequest.clientInfo.communication}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Reviews</span>
                <p className="text-sm text-gray-600">{serviceRequest.clientInfo.reviews}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Member Since</span>
                <p className="text-sm text-gray-600">{serviceRequest.clientInfo.memberSince}</p>
              </div>
            </div>

            {/* Samples */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Samples</h4>
              <div className="grid grid-cols-2 gap-2">
                {serviceRequest.samples.map((sample, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sample {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Bid Modal */}
      <PlaceBidModal
        isOpen={isPlaceBidModalOpen}
        onClose={handleClosePlaceBidModal}
        serviceRequest={serviceRequest}
      />
    </div>
  )
}

export default ServiceRequestModal
