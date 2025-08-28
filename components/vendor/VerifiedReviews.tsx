'use client';

import React from 'react';
import { Star } from 'lucide-react';

const VerifiedReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Adebisi Olatunji",
      date: "13 - 06 - 2025",
      rating: 3,
      comment: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party."
    },
    {
      id: 2,
      name: "Adebisi Olatunji", 
      date: "13 - 06 - 2025",
      rating: 3,
      comment: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party."
    },
    {
      id: 3,
      name: "Adebisi Olatunji",
      date: "13 - 06 - 2025", 
      rating: 3,
      comment: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party."
    },
    {
      id: 4,
      name: "Adebisi Olatunji",
      date: "13 - 05 - 2025",
      rating: 3,
      comment: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party."
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-700 mb-6">
        Verified Reviews & Ratings <span className="text-lg font-normal text-gray-600">(60%)</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifiedReviews;