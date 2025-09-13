'use client'

import React, { useState } from 'react'
import { 
  ChevronDownIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { getVendorBySlug } from '@/data/vendors'
import PostServiceModal from '@/components/ui/modals/PostServiceModal'

const VendorProfilePage = ({ params }: { params: { vendorId: string } }) => {
  const vendorData = getVendorBySlug(params.vendorId)
  const [isPostServiceModalOpen, setIsPostServiceModalOpen] = useState(false)
  
  if (!vendorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-6">The vendor you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/vendors" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Vendors
          </a>
        </div>
      </div>
    )
  }

  const portfolioData = {
    title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
    description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...see more",
    images: [
      "/images/client-img.png",
      "/images/client-img2.png",
      "/images/client-img.png",
      "/images/client-img.png",
      "/images/client-img2.png",
      "/images/client-img.png",
      "/images/client-img.png",
      "/images/client-img2.png",
      "/images/client-img.png"
    ]
  }

  const servicesData = vendorData.services

  const reviewsData = [
    {
      id: 1,
      reviewer: "Adebisi Olatunji",
      date: "13-06-2025",
      rating: 3,
      review: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party",
      avatar: "/images/client-img.png"
    },
    {
      id: 2,
      reviewer: "Adebisi Olatunji",
      date: "13-06-2025",
      rating: 3,
      review: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party",
      avatar: "/images/client-img.png"
    },
    {
      id: 3,
      reviewer: "Adebisi Olatunji",
      date: "13-06-2025",
      rating: 3,
      review: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party",
      avatar: "/images/client-img.png"
    },
    {
      id: 4,
      reviewer: "Adebisi Olatunji",
      date: "13-06-2025",
      rating: 3,
      review: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party",
      avatar: "/images/client-img.png"
    }
  ]

  const recommendationsData = [
    {
      id: 1,
      title: "Wedding Hall Decoration/Backdrops",
      vendor: "Ope's Event Decor",
      image: "/images/client-img.png",
      rating: 4,
      ratingCount: 20,
      location: "Victoria Island, Lagos",
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      verified: true
    },
    {
      id: 2,
      title: "Book us for all types of Event Cakes",
      vendor: "UK Cakes & Cream",
      image: "/images/client-img2.png",
      rating: 4,
      ratingCount: 20,
      location: "Victoria Island, Lagos",
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      verified: true
    },
    {
      id: 3,
      title: "Wedding Hall Decoration/Backdrops",
      vendor: "Ope's Event Decor",
      image: "/images/client-img.png",
      rating: 4,
      ratingCount: 20,
      location: "Victoria Island, Lagos",
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      verified: true
    },
    {
      id: 4,
      title: "Book us for all types of Event Cakes",
      vendor: "UK Cakes & Cream",
      image: "/images/client-img2.png",
      rating: 4,
      ratingCount: 20,
      location: "Victoria Island, Lagos",
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      verified: true
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Reminder Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-blue-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span>Category</span>
            <span className="mx-2">&gt;</span>
            <span>Beauty & Grooming</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">Bridal Make up Artists</span>
          </nav>
        </div>

        {/* Page Title & Actions */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{vendorData.category}</h1>
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <HeartIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <StarIcon className="h-4 w-4" />
                <span>Top Rated</span>
              </button>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Total Request {vendorData.totalRequests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Vendor Showcase */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Side - Main Image Gallery */}
              <div className="lg:col-span-2">
                <div className="flex gap-4">
                  {/* Main Image */}
                  <div className="flex-1 relative">
                    <img 
                      src={vendorData.mainImage} 
                      alt={vendorData.vendorName}
                      className="w-full h-96 object-cover rounded-xl"
                    />
                    {vendorData.verified && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                        <StarIconSolid className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                    
                    {/* Social Media Icons */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                      <a href={vendorData.socialMedia.instagram} className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z"/>
                        </svg>
                      </a>
                      <a href={vendorData.socialMedia.facebook} className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href={vendorData.socialMedia.twitter} className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex flex-col space-y-2">
                    {vendorData.portfolioImages.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Portfolio ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Vendor Info */}
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">{vendorData.vendorName.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{vendorData.vendorName}</h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">{vendorData.description}</p>

                {/* Website Link */}
                <div className="flex items-center space-x-2 text-blue-600">
                  <LinkIcon className="h-5 w-5" />
                  <a href={`https://${vendorData.website}`} className="hover:underline text-sm">
                    {vendorData.website}
                  </a>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{vendorData.location}</span>
                  <span className="text-gray-500 text-sm">{vendorData.locationDetails}</span>
                </div>

                {/* Availability */}
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">{vendorData.availability}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Check Availability</span>
                  </button>
                  <button 
                    onClick={() => setIsPostServiceModalOpen(true)}
                    className="w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Request Service</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Portfolio Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Portfolio</h3>
            <p className="text-gray-600 mb-6">{portfolioData.title}</p>
            
            {/* Portfolio Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {portfolioData.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
            
            <p className="text-gray-700">
              {portfolioData.description.split('...see more')[0]}
              <a href="#" className="text-blue-600 hover:underline ml-1">see more</a>
            </p>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.map((service) => (
                <div key={service.id} className="space-y-4">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <span>View Pricing</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Reviews & Ratings Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Verified Reviews & Ratings (60%)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewsData.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={review.avatar} 
                      alt={review.reviewer}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{review.reviewer}</h4>
                      <p className="text-gray-500 text-sm">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.review}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended for you Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendationsData.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {item.verified && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                        <CheckIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col space-y-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <EyeIcon className="h-3 w-3 text-gray-600" />
                      </button>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <ShareIcon className="h-3 w-3 text-gray-600" />
                      </button>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm">
                        <HeartIcon className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-blue-600 font-medium text-sm">{item.vendor}</p>
                    <p className="text-gray-600 text-xs line-clamp-3">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {renderStars(item.rating)}
                        <span className="text-gray-500 text-xs">({item.ratingCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Service Modal */}
      <PostServiceModal
        isOpen={isPostServiceModalOpen}
        onClose={() => setIsPostServiceModalOpen(false)}
        vendorName={vendorData.vendorName}
      />
    </div>
  )
}

export default VendorProfilePage
