'use client'

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { HiShare } from 'react-icons/hi2'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { useRecentlyViewed, trackServiceView } from '@/hooks/useLandingPageData'
import { useFilterContext } from '@/contexts/FilterContext'
// Using string paths for Next.js Image component
const vendorImage = '/images/vendor-img1.jpg'
const vendorImage2 = '/images/vendor-img2.jpg'

const RecentlyViewed: React.FC = () => {
  const router = useRouter();
  const { selectedCategory, selectedSubCategory } = useFilterContext();
  
  // Fetch recently viewed services from API
  const { recentServices, loading, error } = useRecentlyViewed();
  
  // Show appropriate message when no services are available
  const showNoServicesMessage = !loading && recentServices.length === 0;

  // Transform API data to match component expectations
  const transformedRecentServices = useMemo(() => {
    return recentServices.map((service: any) => {
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
        verified,
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
  }, [recentServices]);

  // Filter services based on selected category and subcategory
  const filteredRecentServices = useMemo(() => {
    if (!selectedCategory && !selectedSubCategory) {
      return transformedRecentServices;
    }

    return transformedRecentServices.filter((service) => {
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
  }, [selectedCategory, selectedSubCategory, transformedRecentServices]);

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
        </div>

        {/* Content Section */}
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
          {filteredRecentServices.map((service) => (
          <ServiceCard key={service.id} service={service} viewType="grid" />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed
