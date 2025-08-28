'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share2, MapPin, Star } from 'lucide-react';
import { ServiceData, getBadgeColor } from '@/data/mockServices';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'next/navigation';
import DiamondIcon from './DiamondIcon';

interface ServiceCardProps {
  service: ServiceData;
  layout?: 'grid' | 'list';
  showPrice?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  layout = 'grid', 
  showPrice = false 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isServiceFavorite = isFavorite(service.id);
  const router = useRouter();
  
  // Use service images or fallback to single image
  const images = service.images || [service.image, service.image, service.image];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  const handleCardClick = () => {
    router.push(`/vendor/${service.id}`);
  };

  if (layout === 'list') {
    return (
      <div 
        className="flex items-start gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative flex-shrink-0">
          <div className="relative w-40 h-32 rounded-lg overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={service.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="absolute top-2 left-2 flex gap-2">
            {service.verified && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Verified
              </span>
            )}
            {service.badge && (
              <span className={`${getBadgeColor(service.badge)} text-white text-xs px-2 py-1 rounded-md`}>
                {service.badge}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <DiamondIcon className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800 truncate">{service.title}</h3>
            </div>
            <Heart 
              className={`w-5 h-5 cursor-pointer transition-colors flex-shrink-0 ml-2 ${
                isServiceFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(service);
              }}
            />
          </div>
          
          <p className="text-blue-600 font-medium mb-3">{service.vendorName}</p>
          
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            <div className="flex items-center gap-1">
              {renderStars(service.rating)}
            </div>
            <span className="text-sm text-gray-600">({service.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{service.location}</span>
            </div>
            
            <div className="flex gap-1">
              <button 
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(service);
                }}
              >
                <Heart className={`w-4 h-4 ${isServiceFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={service.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          {/* Image indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute top-3 left-3 flex gap-2">
          {service.verified && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Verified
            </span>
          )}
          {service.badge && (
            <span className={`${getBadgeColor(service.badge)} text-white text-xs px-2 py-1 rounded-md`}>
              {service.badge}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <DiamondIcon className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{service.title}</h3>
          </div>
          <Heart 
            className={`w-5 h-5 cursor-pointer flex-shrink-0 ml-2 transition-colors ${
              isServiceFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(service);
            }}
          />
        </div>
        
        <p className="text-blue-600 font-medium mb-3">{service.vendorName}</p>
        
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          <div className="flex items-center gap-1">
            {renderStars(service.rating)}
          </div>
          <span className="text-sm text-gray-600">({service.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{service.location}</span>
          </div>
          
          <div className="flex gap-1">
            <button 
              className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(service);
              }}
            >
              <Heart className={`w-4 h-4 ${isServiceFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;