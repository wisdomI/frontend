'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BsHeart } from 'react-icons/bs';
import { HiShare, HiOutlineLocationMarker } from 'react-icons/hi';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const vendorImage = '/images/vendor-img1.jpg';
const vendorImage2 = '/images/vendor-img2.jpg';

const services = [
  {
    id: "ruthie-bridal-makeovers",
    verified: true,
    title: "Bridal Make Up Artists",
    vendorName: "Ruthie Bridal Makeovers",
    rating: 3,
    reviews: 120,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "elite-photography",
    verified: true,
    title: "Professional Photography",
    vendorName: "Elite Photography Studio",
    rating: 4,
    reviews: 89,
    location: "Lagos, Nigeria",
    status: "Most Booked"
  },
  {
    id: "luxury-catering",
    verified: false,
    title: "Luxury Catering Services",
    vendorName: "Royal Catering Co.",
    rating: 5,
    reviews: 156,
    location: "Port Harcourt, Nigeria",
    status: "Trending"
  },
  {
    id: "wedding-planning",
    verified: true,
    title: "Wedding Planning Services",
    vendorName: "Dream Wedding Planners",
    rating: 4,
    reviews: 203,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "floral-design",
    verified: true,
    title: "Floral Design & Decorations",
    vendorName: "Bloom Floral Studio",
    rating: 5,
    reviews: 78,
    location: "Lagos, Nigeria",
    status: "Most Booked"
  },
  {
    id: "music-entertainment",
    verified: false,
    title: "Music & Entertainment",
    vendorName: "Sound Wave Entertainment",
    rating: 4,
    reviews: 134,
    location: "Kano, Nigeria",
    status: "Trending"
  },
  {
    id: "bridal-fashion",
    verified: true,
    title: "Bridal Fashion Design",
    vendorName: "Elegant Bridal Boutique",
    rating: 5,
    reviews: 167,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "venue-decoration",
    verified: true,
    title: "Venue Decoration Services",
    vendorName: "Grand Decorations Ltd",
    rating: 4,
    reviews: 92,
    location: "Lagos, Nigeria",
    status: "Most Booked"
  },
  {
    id: "transportation",
    verified: false,
    title: "Luxury Transportation",
    vendorName: "Royal Transport Services",
    rating: 4,
    reviews: 45,
    location: "Port Harcourt, Nigeria",
    status: "Trending"
  },
  {
    id: "videography",
    verified: true,
    title: "Wedding Videography",
    vendorName: "Cinematic Moments",
    rating: 5,
    reviews: 189,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "cake-design",
    verified: true,
    title: "Custom Cake Design",
    vendorName: "Sweet Dreams Bakery",
    rating: 4,
    reviews: 112,
    location: "Lagos, Nigeria",
    status: "Most Booked"
  },
  {
    id: "dj-services",
    verified: false,
    title: "DJ & Sound Services",
    vendorName: "Beat Masters DJ",
    rating: 4,
    reviews: 67,
    location: "Kano, Nigeria",
    status: "Trending"
  },
  {
    id: "bridal-accessories",
    verified: true,
    title: "Bridal Accessories",
    vendorName: "Pearl & Diamond Co.",
    rating: 5,
    reviews: 98,
    location: "Abuja, Nigeria",
    status: "Top Rated"
  },
  {
    id: "event-coordination",
    verified: true,
    title: "Event Coordination",
    vendorName: "Perfect Events Ltd",
    rating: 4,
    reviews: 145,
    location: "Lagos, Nigeria",
    status: "Most Booked"
  },
  {
    id: "lighting-design",
    verified: false,
    title: "Lighting & Design",
    vendorName: "Illuminate Events",
    rating: 4,
    reviews: 56,
    location: "Port Harcourt, Nigeria",
    status: "Trending"
  }
];

const PopularServicesPage: React.FC = () => {
  const router = useRouter();
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  const handleTitleClick = () => {
    router.push('/');
  };

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

  const ServiceCard = ({ service, viewType }: { service: typeof services[0], viewType: 'list' | 'grid' }) => {
    const [current, setCurrent] = useState(0);
    const images = [vendorImage, vendorImage2, vendorImage];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className={`bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow ${
        viewType === 'grid' ? 'w-full max-w-sm mx-auto' : 'w-full'
      }`}>
        {/* Image Section */}
        <div className={`relative ${viewType === 'grid' ? 'w-full' : 'w-48 flex-shrink-0'}`}>
          <div className={`relative ${viewType === 'grid' ? 'h-48 w-full' : 'h-32 w-full'}`}>
            <Image
              src={images[current]}
              alt={service.title}
              fill
              className={`object-cover ${viewType === 'grid' ? 'rounded-t-2xl' : 'rounded-l-2xl'}`}
              priority
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    current === index ? 'bg-event-blue' : 'bg-white'
                  }`}
                />
              ))}
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
        <div className={`flex gap-3 p-4 w-full ${
          viewType === 'grid' ? 'flex-col' : 'flex-row items-start'
        }`}>
          {viewType === 'grid' ? (
            // Grid View Layout
            <>
              <div className="flex gap-2 items-center justify-between">
                <h3 className="text-lg font-bold">{service.title}</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                    fill="#616161"
                  />
                  <path
                    d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                    fill="url(#paint0_linear_899_30759)"
                  />
                  <path
                    d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                    fill="#9F9F9F"
                  />
                  <path
                    d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                    fill="url(#paint1_linear_899_30759)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_899_30759"
                      x1="13.7129"
                      y1="2.57141"
                      x2="22.2492"
                      y2="9.85713"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.533" stop-color="#FF6CE8" stop-opacity="0" />
                      <stop offset="1" stop-color="#FF6CE8" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_899_30759"
                      x1="5.78565"
                      y1="2.57141"
                      x2="7.96451"
                      y2="9.85713"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.533" stop-color="#FF6CE8" stop-opacity="0" />
                      <stop offset="1" stop-color="#FF6CE8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-event-blue font-semibold text-sm">{service.vendorName}</p>
                <div className="flex items-center gap-2 text-white text-xs">
                  <button className="text-base p-1.5 bg-event-blue rounded-lg">
                    <IoChatbubbleEllipsesOutline />
                  </button>
                  <button className="p-2 bg-event-blue rounded-lg">
                    <BsHeart />
                  </button>
                  <button className="p-2 bg-event-blue rounded-lg">
                    <HiShare />
                  </button>
                </div>
              </div>
              <hr></hr>
              <div className="flex items-center gap-1 text-light-gray text-sm font-bold">
                Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                ({service.reviews}){' '}
              </div>
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <HiOutlineLocationMarker /> {service.location}
              </p>
              
              {/* View Details Button */}
              <div className="mt-4">
                <button 
                  className="w-full bg-event-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer relative z-10"
                  onClick={() => {
                    console.log('Button clicked for service:', service.id);
                    router.push(`/vendor/${service.id}`);
                  }}
                >
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            // List View Layout
            <>
              <div className="flex-1">
                <div className="flex gap-2 items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                      fill="#616161"
                    />
                    <path
                      d="M16.0332 9.85713H22.2492C22.2725 9.78807 22.2846 9.71573 22.2852 9.64284L22.2835 9.69855L22.2852 9.61284L22.2766 9.53741L22.262 9.47141L22.2526 9.43884L22.2157 9.35141L18.7812 2.9117L18.7349 2.83713C18.6751 2.75466 18.5967 2.68756 18.5059 2.64136C18.4152 2.59517 18.3147 2.57119 18.2129 2.57141H13.7129C13.8546 2.57136 13.9924 2.61815 14.1048 2.70449C14.2171 2.79083 14.2978 2.91189 14.3343 3.04884L16.0486 9.47741C16.0818 9.60265 16.0765 9.735 16.0332 9.85713Z"
                      fill="url(#paint0_linear_899_30759)"
                    />
                    <path
                      d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                      fill="#9F9F9F"
                    />
                    <path
                      d="M7.96451 9.85713C7.92122 9.735 7.91584 9.60265 7.94908 9.47741L9.66337 3.04884C9.69984 2.91189 9.78054 2.79083 9.89293 2.70449C10.0053 2.61815 10.1431 2.57136 10.2848 2.57141H5.78565L5.69823 2.57741C5.59748 2.5912 5.50145 2.62869 5.418 2.6868C5.33456 2.74491 5.26609 2.82199 5.21823 2.9117L1.78965 9.34027L1.76651 9.38913L1.73737 9.47141L1.7288 9.5057L1.7168 9.5897V9.69855L1.73651 9.81084L1.75365 9.85713H7.96451Z"
                      fill="url(#paint1_linear_899_30759)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_899_30759"
                        x1="13.7129"
                        y1="2.57141"
                        x2="22.2492"
                        y2="9.85713"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.533" stop-color="#FF6CE8" stop-opacity="0" />
                        <stop offset="1" stop-color="#FF6CE8" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_899_30759"
                        x1="5.78565"
                        y1="2.57141"
                        x2="7.96451"
                        y2="9.85713"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.533" stop-color="#FF6CE8" stop-opacity="0" />
                        <stop offset="1" stop-color="#FF6CE8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-event-blue font-semibold text-sm">{service.vendorName}</p>
                  <div className="flex items-center gap-2 text-white text-xs">
                    <button className="text-base p-1.5 bg-event-blue rounded-lg">
                      <IoChatbubbleEllipsesOutline />
                    </button>
                    <button className="p-2 bg-event-blue rounded-lg">
                      <BsHeart />
                    </button>
                    <button className="p-2 bg-event-blue rounded-lg">
                      <HiShare />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-light-gray text-sm font-bold mb-1">
                  Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                  ({service.reviews}){' '}
                </div>
                <p className="flex items-center gap-1 text-gray-500 text-sm">
                  <HiOutlineLocationMarker /> {service.location}
                </p>
              </div>
              
              {/* View Details Button for List View */}
              <div className="flex-shrink-0">
                <button 
                  className="bg-event-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer relative z-10"
                  onClick={() => {
                    console.log('Button clicked for service:', service.id);
                    router.push(`/vendor/${service.id}`);
                  }}
                >
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
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
                <div className="flex items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 12 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" fill="#FF6B35"/>
                    <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 12 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" fill="#FFA500"/>
                    <path d="M12 6C12 6 10 8 10 10C10 11 10.5 11.5 12 11.5C13.5 11.5 14 11 14 10C14 8 12 6 12 6Z" fill="#FFD700"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Popular Services</h1>
              </div>
              
              {/* View Toggle Controls */}
              <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewType('list')}
                  className={`px-3 py-2 flex items-center space-x-1 transition-colors ${
                    viewType === 'list' 
                      ? 'bg-blue-600 text-white' 
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
                      ? 'bg-blue-600 text-white' 
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Services Grid */}
        <div className={`${
          viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
        }`}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} viewType={viewType} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularServicesPage;