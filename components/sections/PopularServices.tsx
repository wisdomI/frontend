'use client'

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { useFilterContext } from '@/contexts/FilterContext'
import { useLandingPageData, trackServiceView } from '@/hooks/useLandingPageData'
import { ServiceOffering } from '@/types/api'
// Using string paths for Next.js Image component
const vendorImage = '/images/vendor-img1.jpg'
const vendorImage2 = '/images/vendor-img2.jpg'

const PopularServices: React.FC = () => {
  const router = useRouter();
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');
  const { selectedCategory, selectedSubCategory, clearFilters } = useFilterContext();
  
  // Fetch popular services from API
  const { popularServices, loading, error } = useLandingPageData();
  
  
  // Show appropriate message when no services are available
  const showNoServicesMessage = !loading && popularServices.length === 0;

  // Transform API data to match component expectations
  const transformedServices = useMemo(() => {
    return popularServices.map((service: ServiceOffering) => {
      // Extract vendor name from User data
      const vendorName = service.User?.businessName || 
                        (service.User?.firstName && service.User?.lastName 
                          ? `${service.User.firstName} ${service.User.lastName}`
                          : service.User?.firstName || 
                            service.User?.lastName || 
                            'Vendor Name')
      
      // Extract location from Profile data
      const location = service.Profile?.city && service.Profile?.country 
                      ? `${service.Profile.city}, ${service.Profile.country}`
                      : service.Profile?.city || 
                        service.Profile?.country ||
                        service.User?.businessAddress || 
                        'Location not specified'
      
      // Use rating from backend or default to 0 if not available
      const rating = service.averageRating || 0
      const reviews = service.totalReviews || 0
      
      // Check if vendor is verified
      const verified = service.User?.isVerified || false
      
      return {
        id: service.id,
        title: service.serviceName,
        vendorName,
        rating,
        reviews,
        location,
        status: service.isActive ? 'Active' : 'Inactive',
        verified,
        category: service.categoryIds?.[0] || 'general',
        subCategory: service.categoryIds?.[1] || 'general',
        categoryIds: service.categoryIds || [],
        description: service.description,
        price: service.price,
        pricingTitle: service.pricingTitle,
        mediaUrl: service.mediaUrl,
        createdAt: service.createdAt,
        userId: service.userId,
        vendorId: service.userId
      }
    });
  }, [popularServices]);

  // Filter services based on selected category and subcategory
  const filteredServices = useMemo(() => {
    if (!selectedCategory && !selectedSubCategory) {
      return transformedServices;
    }

    return transformedServices.filter((service) => {
      if (selectedSubCategory) {
        // Check if any of the service's category IDs match the selected subcategory
        return service.categoryIds.some((id: string) => id === selectedSubCategory);
      }
      if (selectedCategory) {
        // Check if any of the service's category IDs match the selected category
        return service.categoryIds.some((id: string) => id === selectedCategory);
      }
      return true;
    });
  }, [selectedCategory, selectedSubCategory, transformedServices]);

  const handleSeeMore = () => {
    router.push('/services/popular');
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

  const ServiceCard = ({ service, viewType }: { service: any, viewType: 'list' | 'grid' }) => {
    const [current, setCurrent] = useState(0)
    
    // Use API images if available, otherwise fallback to default images
    const apiImages = service.mediaUrl && service.mediaUrl.length > 0 ? service.mediaUrl : []
    const fallbackImages = [vendorImage, vendorImage2, vendorImage]
    const images = apiImages.length > 0 ? apiImages : fallbackImages

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [images.length])

    // Handle card click to navigate to service details page
    const handleCardClick = () => {
      // Track service view for recently viewed functionality
      trackServiceView(service.id)
      
      // Navigate to service details page like e-commerce product cards
      const serviceId = service.id
      if (serviceId) {
        router.push(`/services/${serviceId}`)
      }
    }

    return (
      <div 
        className={`bg-white rounded-xl hover:shadow-lg transition-shadow cursor-pointer ${
          viewType === 'grid' ? 'w-full max-w-sm mx-auto' : 'w-full'
        }`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
      >
        {viewType === 'grid' ? (
          /* Grid View - Vertical Layout */
          <>
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
                  {images.map((_: any, index: number) => (
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

              {/* Status Badge - top right */}
              {service.status && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  {service.status}
                </div>
              )}
            </div>
          </>
        ) : (
          /* List View - Horizontal Layout */
          <div className="flex">
            {/* Image Section - Left Side */}
            <div className="relative w-32 sm:w-40 md:w-48 flex-shrink-0">
              <div className="relative h-24 sm:h-28 md:h-32 w-full">
                <Image
                  src={images[current]}
                  alt={service.title}
                  fill
                  className="object-cover rounded-l-xl"
                  priority
                />
                {/* Carousel dots - centered at bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {images.map((_: any, index: number) => (
                    <span
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        current === index ? 'bg-blue-600' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Verified Badge - top left */}
              {service.verified && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}

              {/* Status Badge - top right */}
              {service.status && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {service.status}
                </div>
              )}
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-1 p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                {/* Service Title with Diamond Icon */}
                <div className="flex items-start justify-between">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight font-asul">{service.title}</h3>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 rounded-sm ml-2 flex-shrink-0"></div>
                </div>

                {/* Vendor Name with Action Buttons */}
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-semibold text-xs sm:text-sm">{service.vendorName}</p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button 
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IoChatbubbleEllipsesOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BsHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiShare className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                  <span className="font-semibold">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(service.rating))}
                  </div>
                  {service.reviews > 0 ? (
                    <span className="text-gray-500">({service.reviews} {service.reviews === 1 ? 'review' : 'reviews'})</span>
                  ) : (
                    <span className="text-gray-400 text-xs">No reviews yet</span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                  <HiOutlineLocationMarker className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{service.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid View Content Section */}
        {viewType === 'grid' && (
          <div className="p-4 space-y-3">
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
                <button 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IoChatbubbleEllipsesOutline className="w-4 h-4" />
                </button>
                <button 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsHeart className="w-4 h-4" />
                </button>
                <button 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HiShare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="font-semibold">Rating:</span>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(service.rating))}
              </div>
              {service.reviews > 0 ? (
                <span className="text-gray-500">({service.reviews} {service.reviews === 1 ? 'review' : 'reviews'})</span>
              ) : (
                <span className="text-gray-400 text-xs">No reviews yet</span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <HiOutlineLocationMarker className="w-4 h-4" />
              <span>{service.location}</span>
            </div>
          </div>
        )}

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
            {/* Flame Icon */}
          <h2 className="text-lg font-bold text-gray-800 font-asul"> 🔥Popular Services</h2>
          </div>
          
          {/* View Toggle Controls - Beside the title */}
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-2 flex items-center space-x-1 transition-colors ${
                viewType === 'list' 
                  ? 'bg-event-blue text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/>
                <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor"/>
                <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`px-3 py-2 flex items-center space-x-1 transition-colors ${
                viewType === 'grid' 
                  ? 'bg-event-blue text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              </svg>
            </button>
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
      {filteredServices.length > 0 ? (
        <div className={`${
          viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
        }`}>
          {filteredServices.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} viewType={viewType} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.1-2.4l-.7.7A8.962 8.962 0 0012 16c2.34 0 4.5-.9 6.1-2.4l-.7-.7z" />
            </svg>
          </div>
          {showNoServicesMessage ? (
            <>
              {error ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-asul">Services Temporarily Unavailable</h3>
                  <p className="text-gray-500 mb-4">We&apos;re working to make our services available to everyone. Please check back later.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-asul">Nothing in this category</h3>
                  <p className="text-gray-500 mb-4">No services found for the selected category. Try selecting a different category or clear the filter.</p>
                  <button
                    onClick={clearFilters}
                    className="bg-event-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filter
                  </button>
                </>
              )}
            </>
          ) : null}
        </div>
      )}

    </div>
  );
};

export default PopularServices;