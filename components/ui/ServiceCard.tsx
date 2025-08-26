'use client';

import React from 'react';
import { MessageCircle, Heart, Share2, MapPin, Star } from 'lucide-react';
import { ServiceData, getBadgeColor } from '@/data/mockServices';
import { useFavorites } from '@/contexts/FavoritesContext';

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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  if (layout === 'list') {
    return (
      <div className="flex items-start h-68 w-full   gap-4 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={service.image}
            alt={service.title}
            className="w-40 h-32 object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2 flex justify-between gap-41">
            {service.verified && (
              <span className=" mr-6 bg-event-blue text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
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
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{service.title}</h3>
            <Heart 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                isServiceFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
              }`}
              onClick={() => toggleFavorite(service)}
            />
          </div>
          
          <p className="text-event-blue font-semibold mb-2">{service.vendorName}</p>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(service.rating)}
              <span className="text-sm text-gray-600">({service.reviews})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              {service.location}
            </div>
            
            <div className="flex gap-2">
              <button className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700"
                onClick={() => toggleFavorite(service)}
              >
                <Heart className={`w-4 h-4 ${isServiceFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {service.verified && (
            <span className="bg-event-blue text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{service.title}</h3>
          <Heart 
            className={`w-5 h-5 cursor-pointer flex-shrink-0 ml-2 transition-colors ${
              isServiceFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
            }`}
            onClick={() => toggleFavorite(service)}
          />
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <p className="text-event-blue font-semibold">{service.vendorName}</p>
          <div className="flex gap-1">
            <button className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700"
              onClick={() => toggleFavorite(service)}
            >
              <Heart className={`w-4 h-4 ${isServiceFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="bg-event-blue p-2 rounded-lg text-white hover:bg-blue-700">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <hr className="border-gray-200 mb-3" />
        
        <div className="flex items-center gap-1 mb-2">
          {renderStars(service.rating)}
          <span className="text-sm text-gray-600 ml-1">({service.reviews})</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin className="w-4 h-4" />
          {service.location}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;