'use client';

import React from 'react';
import { Star } from 'lucide-react';

const VerifiedReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Adebisi Olatunji",
      date: "13 - 06 - 2025",
      rating: 5,
      comment: "My makeup was flawless and unique! They arrived on time and got me ready for my photo sessions, church and reception party."
    },
    {
      id: 2,
      name: "Funmi Adeyemi",
      date: "10 - 06 - 2025",
      rating: 4,
      comment: "Excellent service! Very professional and the makeup lasted all day. Would definitely recommend to others."
    },
    {
      id: 3,
      name: "Kemi Johnson",
      date: "08 - 06 - 2025",
      rating: 5,
      comment: "Outstanding work! The team was punctual, professional, and delivered exactly what I wanted. Perfect for my special day."
    },
    {
      id: 4,
      name: "Tola Bakare",
      date: "05 - 06 - 2025",
      rating: 4,
      comment: "Great experience overall. The makeup artist was skilled and listened to my preferences. Very satisfied with the results."
    }
  ];

  // Calculate average rating and percentage
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const satisfactionPercentage = Math.round((averageRating / 5) * 100);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating
          ? 'text-yellow fill-yellow'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-gray-700">
          Verified Reviews & Ratings
          <span className="text-lg font-heading font-semibold text-event-blue ml-2">
            ({satisfactionPercentage}%)
          </span>
        </h2>
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h4 className="font-semibold text-gray-900 font-heading ">{review.name}</h4>
                  <span className="text-sm text-gray-500 font-sans ">{review.date}</span>
                </div>
                <p className=" font-sans text-gray-700 text-sm mb-3 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium font-heading text-gray-700">Rating:</span>
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