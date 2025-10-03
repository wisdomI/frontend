'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
// Using string paths for Next.js Image component
const vendorImage = '/images/vendor-img1.jpg'
const vendorImage2 = '/images/vendor-img2.jpg'

const recentServices = [
  {
    id: "ruthie-bridal-makeovers",
    verified: true,
    title: "Bridal Make Up Artists",
    vendorName: "Ruthie Bridal Makeovers",
    rating: 3,
    reviews: 120,
    location: "Abuja, Nigeria"
  },
  {
    id: "opes-event-decor",
    verified: true,
    title: "Wedding Hall Decoration / Backdrops",
    vendorName: "Ope's Event Decor",
    rating: 4,
    reviews: 20,
    location: "Victoria Island, Lagos"
  },
  {
    id: "uk-cakes-cream",
    verified: true,
    title: "Book us for all types of Event Cakes",
    vendorName: "UK Cakes & Cream",
    rating: 5,
    reviews: 50,
    location: "Victoria Island, Lagos"
  }
];

const RecentlyViewed: React.FC = () => {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push('/services');
  };

  const handleTitleClick = () => {
    router.push('/services');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-300" />
      )
    );
  };

  const ServiceCard = ({ service, viewType }: { service: typeof recentServices[0], viewType: 'list' | 'grid' }) => {
    const [current, setCurrent] = useState(0)
    const images = [vendorImage, vendorImage2, vendorImage]

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [images.length])

    return (
      <div className={`bg-white rounded-xl hover:shadow-lg transition-shadow ${
        viewType === 'grid' ? 'w-full max-w-sm mx-auto' : 'w-full'
      }`}>
        {/* Image Section */}
        <div className="relative w-full">
          <div className="relative h-48 w-full">
            <Image
              src={images[current]}
              alt={service.title}
              fill
              className="object-cover rounded-t-xl"
              priority
            />
            {/* Carousel dots - centered at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    current === index ? 'bg-blue-600' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verified Badge - top left */}
          {service.verified && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Service Title with Diamond Icon */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 leading-tight font-asul">{service.title}</h3>
            <div className="w-4 h-4 bg-blue-100 rounded-sm ml-2 flex-shrink-0"></div>
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
    );
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl shadow-sm max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div 
            onClick={handleTitleClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTitleClick();
              }
            }}
          >
            {/* Clock Icon for Recently Viewed */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#FF6B35" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 font-asul">Recently Viewed</h2>
          </div>
          
        </div>
        
        {/* Right - See More Link */}
        <button
          onClick={handleSeeMore}
          className="text-gray-700 font-medium hover:text-event-blue transition-colors"
        >
          See more
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentServices.map((service) => (
          <ServiceCard key={service.id} service={service} viewType="grid" />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed
