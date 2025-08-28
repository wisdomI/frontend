'use client';

import React from 'react';
import { Star, Heart, MessageCircle, Share2 } from 'lucide-react';

const RecommendedSection: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      title: "Wedding Hall Decoration/Backdrops",
      vendorName: "Ope's Event Decor",
      image: "./images/image.png",
      rating: 4.5,
      reviews: 20,
      location: "Victoria Island, Lagos",
      verified: true,
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices."
    },
    {
      id: 2,
      title: "Book us for all types of Event Cakes",
      vendorName: "UK Cakes & Cream", 
      image: "./images/cake2.jpg",
      rating: 4.5,
      reviews: 20,
      location: "Victoria Island, Lagos",
      verified: true,
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices."
    },
    {
      id: 3,
      title: "Wedding Hall Decoration/Backdrops",
      vendorName: "Ope's Event Decor",
      image: "./images/place1.jpg", 
      rating: 4.5,
      reviews: 20,
      location: "Victoria Island, Lagos",
      verified: true,
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices."
    },
    {
      id: 4,
      title: "Book us for all types of Event Cakes",
      vendorName: "UK Cakes & Cream",
      image: "./images/cake2.jpg",
      rating: 4.5, 
      reviews: 20,
      location: "Victoria Island, Lagos",
      verified: true,
      description: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices."
    }
  ];

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

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Recommended for you</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.verified && (
                <div className="absolute top-3 left-3">
                  <span className="bg-event-blue text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Verified
                  </span>
                </div>
              )}
              {/* Image indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                  {item.title}
                </h3>
                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer ml-2 flex-shrink-0" />
              </div>
              
              <p className="text-event-blue font-medium text-sm mb-2">{item.vendorName}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  <button className="bg-event-blue text-white p-1 rounded">
                    <MessageCircle className="w-3 h-3" />
                  </button>
                  <button className="bg-event-blue text-white p-1 rounded">
                    <Heart className="w-3 h-3" />
                  </button>
                  <button className="bg-event-blue text-white p-1 rounded">
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs font-medium text-gray-700">Rating:</span>
                <div className="flex items-center gap-1">
                  {renderStars(item.rating)}
                </div>
                <span className="text-xs text-gray-600">({item.reviews})</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>📍</span>
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSection;