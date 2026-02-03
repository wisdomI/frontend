'use client'

import React from 'react'
import Image from 'next/image'
import {
  StarIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid'

interface EnhancedServiceCardProps {
  id: string
  images: string[]
  title: string
  vendor: string
  rating: number
  ratingCount: number
  location: string
  badges?: string[]
}

// const DiamondIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5 text-blue-500"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M6 3l12 9-12 9V3z"
//     />
//   </svg>
// )

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({
  images,
  title,
  vendor,
  rating,
  ratingCount,
  location,
  badges = [],
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 relative w-full max-w-sm mx-auto">
      {/* Badges */}
      <div className="absolute top-2 md:top-3 left-2 md:left-3 flex space-x-1 md:space-x-2 z-10">
        {badges.map((badge) => (
          <span
            key={badge}
            className="flex items-center space-x-1 bg-event-blue text-white text-xs font-semibold px-2 md:px-3 py-1 rounded-full"
          >
            <StarIcon className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />
            <span className="text-xs">{badge}</span>
          </span>
        ))}
      </div>

      {/* Image */}
      <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden mb-2 md:mb-3 relative">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover rounded-xl"
        />
        {/* Carousel indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
          <span className="w-2 h-2 md:w-3 md:h-3 bg-event-blue rounded-full"></span>
          <span className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Service Title with Diamond Icon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight font-asul flex-1">{title}</h3>
        <div className="ml-2 flex-shrink-0">
          <Image 
            src="/Diamond.svg" 
            alt="Diamond" 
            width={16} 
            height={16}
            className="w-4 h-4"
          />
        </div>
      </div>

      {/* Vendor and Action Icons */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs md:text-sm text-event-blue font-semibold truncate flex-1 mr-2">{vendor}</p>
        <div className="flex space-x-1 md:space-x-2">
          <button
            aria-label="Chat"
            className="bg-event-blue text-white p-1 rounded-md hover:bg-event-blue-hover"
          >
            <ChatBubbleLeftIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            aria-label="Favorite"
            className="bg-event-blue text-white p-1 rounded-md hover:bg-red-600"
          >
            <HeartIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            aria-label="Share"
            className="bg-event-blue text-white p-1 rounded-md hover:bg-event-blue-hover"
          >
            <ShareIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      <hr className="border-gray-300 mb-2" />

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-3 w-3 md:h-4 md:w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600">({ratingCount})</span>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-500 text-xs">
        <MapPinIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
        <p className="truncate">{location}</p>
      </div>
    </div>
  )
}

export default EnhancedServiceCard
