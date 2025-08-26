'use client';

import React from 'react';
import { Heart, MapPin, Star, Shield } from 'lucide-react';
import { ServiceData, formatPrice, getBadgeColor } from '@/data/mockServices';
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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(service);
  };

  if (layout === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex gap-4">
          <div className="relative">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-24 h-24 object-cover rounded-xl"
            />
            {service.badge && (
              <span className={`absolute -top-2 -right-2 text-white text-xs px-2 py-1 rounded-full ${getBadgeColor(service.badge)}`}>
                {service.badge}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-semibold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-sm font-sans text-gray-600 mb-2">{service.vendorName}</p>
                {service.description && (
                  <p className="text-sm font-sans text-gray-500 mb-2">{service.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-sans">{service.rating}</span>
                    <span className="font-sans">({service.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="font-sans">{service.location}</span>
                  </div>
                  
                  {service.verified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="font-sans">Verified</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {showPrice && service.price && (
                  <span className="font-heading font-semibold text-event-blue">
                    {formatPrice(service.price)}
                  </span>
                )}
                <button
                  onClick={handleFavoriteClick}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isServiceFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {service.badge && (
          <span className={`absolute top-3 left-3 text-white text-xs font-sans px-3 py-1 rounded-full ${getBadgeColor(service.badge)}`}>
            {service.badge}
          </span>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart 
            className={`w-4 h-4 ${
              isServiceFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            }`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-heading font-semibold text-gray-900 mb-1">{service.title}</h3>
        <p className="text-sm font-sans text-gray-600 mb-2">{service.vendorName}</p>
        
        {service.description && (
          <p className="text-sm font-sans text-gray-500 mb-3 line-clamp-2">{service.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-sans font-medium">{service.rating}</span>
            <span className="font-sans">({service.reviews})</span>
          </div>
          
          {showPrice && service.price && (
            <span className="font-heading font-bold text-event-blue">
              {formatPrice(service.price)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span className="font-sans">{service.location}</span>
          {service.verified && (
            <>
              <span className="mx-1">•</span>
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-sans text-green-600">Verified</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;