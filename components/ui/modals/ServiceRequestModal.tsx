'use client'
import React, { useState } from 'react'
import { FiX, FiMapPin, FiCalendar, FiUsers, FiStar, FiClock } from 'react-icons/fi'
import PlaceBidModal from './PlaceBidModal'
type PlaceBidModalServiceRequest = React.ComponentProps<typeof PlaceBidModal>['serviceRequest']

interface MarketplaceClientInfo {
  name?: string
  rating?: number
  eventsHosted?: number
  totalSpent?: string
  paymentHistory?: string
  communication?: string
  reviews?: string
  memberSince?: string
  avatar?: string
}

export interface MarketplaceServiceRequest {
  id: string
  title: string
  location?: string
  date?: string
  description?: string
  tags?: string[]
  budget?: string
  guestCount?: number
  requirements?: string[]
  clientInfo?: MarketplaceClientInfo
  samples?: string[]
}

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  serviceRequest: MarketplaceServiceRequest
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

  const {
    title,
    location,
    date,
    description,
    tags = [],
    budget,
    guestCount,
    requirements = [],
    clientInfo,
    samples = []
  } = serviceRequest

  const displayAvatar =
    clientInfo?.avatar ||
    (clientInfo?.name ? clientInfo.name.charAt(0).toUpperCase() : 'C')

  const ratingValue = clientInfo?.rating ?? 0
  const hasClientInfo = Boolean(clientInfo)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
                {date && (
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-5 h-5 mr-2" />
                    <span className="font-medium">{date}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span>{location}</span>
                  </div>
                )}
                {guestCount !== undefined && (
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="w-5 h-5 mr-2" />
                    <span>{guestCount} People</span>
                  </div>
                )}
              </div>
              
              {budget && (
                <div className="mb-4">
                  <span className="text-lg font-semibold text-green-600">{budget}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specific Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Place Bid Button */}
            <button 
              onClick={handlePlaceBid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Place Bid
            </button>
          </div>

          {/* Right Panel - Client Information */}
          {hasClientInfo && (
            <div className="w-80 border-l border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              
              {/* Client Profile */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium text-lg">{displayAvatar}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{clientInfo?.name ?? 'Client'}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(ratingValue)
                            ? 'text-yellow-400 fill-current'
                            : i < ratingValue
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">{ratingValue.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Client Metrics */}
              {(clientInfo?.eventsHosted !== undefined || clientInfo?.totalSpent) && (
                <div className="space-y-3 mb-6">
                  {clientInfo?.eventsHosted !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Events Hosted</span>
                      <span className="font-medium">{clientInfo.eventsHosted}</span>
                    </div>
                  )}
                  {clientInfo?.totalSpent && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-medium">{clientInfo.totalSpent}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Client Details */}
              <div className="space-y-3 mb-6">
                {clientInfo?.paymentHistory && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Payment History</span>
                    <p className="text-sm text-gray-600">{clientInfo.paymentHistory}</p>
                  </div>
                )}
                {clientInfo?.communication && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Communication</span>
                    <p className="text-sm text-gray-600">{clientInfo.communication}</p>
                  </div>
                )}
                {clientInfo?.reviews && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reviews</span>
                    <p className="text-sm text-gray-600">{clientInfo.reviews}</p>
                  </div>
                )}
                {clientInfo?.memberSince && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Member Since</span>
                    <p className="text-sm text-gray-600">{clientInfo.memberSince}</p>
                  </div>
                )}
              </div>

              {/* Samples */}
              {samples.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Samples</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {samples.map((sample, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sample {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Place Bid Modal */}
      <PlaceBidModal
        isOpen={isPlaceBidModalOpen}
        onClose={handleClosePlaceBidModal}
        serviceRequest={{
          id: serviceRequest.id,
          title: serviceRequest.title,
          location: serviceRequest.location,
          date: serviceRequest.date,
          budget: serviceRequest.budget
        } as unknown as PlaceBidModalServiceRequest}
      />
    </div>
  )
}

export default ServiceRequestModal
