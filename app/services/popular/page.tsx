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
              <hr></hr>
              <div className="flex items-center gap-1 text-light-gray text-sm font-bold">
                Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                ({service.reviews}){' '}
              </div>
              <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <HiOutlineLocationMarker /> {service.location}
              </p>
              
            </>
          ) : (
            // List View Layout
            <>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
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
                <div className="flex justify-between items-center mb-2">
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
                <div className="flex items-center gap-1 text-light-gray text-sm font-bold mb-1">
                  Rating: <div className="flex items-center gap-1">{renderStars(service.rating)}</div>
                  ({service.reviews}){' '}
                </div>
                <p className="flex items-center gap-1 text-gray-500 text-sm">
                  <HiOutlineLocationMarker /> {service.location}
                </p>
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