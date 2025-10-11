'use client'

import React from 'react'
import Image from 'next/image'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import vendorImage from '../../public/images/vendor-img1.jpg'
import vendorImage2 from '../../public/images/vendor-img2.jpg'

const services = [
  {
    id: "bridal-makeup",
    title: "Bridal Make Up Artists",
    vendorName: "Glamour Studios",
    rating: 5,
    reviews: 128,
    location: "Lagos, Nigeria",
    verified: true,
    status: "Popular"
  },
  {
    id: "wedding-decoration",
    title: "Wedding Hall Decoration",
    vendorName: "Elegant Events",
    rating: 4,
    reviews: 89,
    location: "Abuja, Nigeria",
    verified: true,
    status: "Trending"
  },
  {
    id: "event-cakes",
    title: "Event Cakes",
    vendorName: "Sweet Delights",
    rating: 5,
    reviews: 156,
    location: "Port Harcourt, Nigeria",
    verified: true,
    status: "Top Rated"
  },
  {
    id: "photography",
    title: "Professional Photography",
    vendorName: "Capture Moments",
    rating: 4,
    reviews: 203,
    location: "Kano, Nigeria",
    verified: true,
    status: "Popular"
  },
  {
    id: "catering",
    title: "Event Catering",
    vendorName: "Gourmet Catering",
    rating: 5,
    reviews: 167,
    location: "Ibadan, Nigeria",
    verified: true,
    status: "Best Valued"
  },
  {
    id: "sound-lighting",
    title: "Sound & Lighting",
    vendorName: "Audio Visual Pro",
    rating: 4,
    reviews: 94,
    location: "Enugu, Nigeria",
    verified: true,
    status: "Popular"
  }
]

export default function ServicesPage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < rating ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </span>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-asul">All Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow w-full max-w-sm mx-auto">
            {/* Image Section */}
            <div className="relative w-full">
              <div className="relative h-48 w-full">
                <Image
                  src={vendorImage}
                  alt={service.title}
                  fill
                  className="object-cover rounded-t-2xl"
                  priority
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  <span className="w-2 h-2 rounded-full bg-event-blue"></span>
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
              </div>

              {service.verified && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-event-blue text-white text-xs px-6 py-1 rounded-md">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
                  </svg>
                  Verified
                </div>
              )}
              
              {/* Status Badge */}
              {service.status && (
                <div className="absolute top-2 right-2 bg-event-blue text-white text-xs px-3 py-1 rounded-md">
                  {service.status}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-3 p-4 w-full">
              {/* Service Title with Diamond Icon */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-900 leading-tight font-asul">{service.title}</h3>
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
              
              {/* Vendor Name with Action Buttons */}
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-semibold text-sm">{service.vendorName}</p>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <IoChatbubbleEllipsesOutline className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <BsHeart className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <HiShare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rating Section */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="font-semibold">Rating:</span>
                <div className="flex items-center gap-1">
                  {renderStars(service.rating)}
                </div>
                <span className="text-gray-500">({service.reviews})</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <HiOutlineLocationMarker className="w-4 h-4" />
                <span>{service.location}</span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}