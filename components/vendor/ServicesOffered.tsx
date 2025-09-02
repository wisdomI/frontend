'use client';

import React from 'react';

interface ServicesOfferedProps {
  onViewPricing: () => void;
}

const ServicesOffered: React.FC<ServicesOfferedProps> = ({ onViewPricing }) => {
  const services = [
    {
      id: 1,
      title: "Event & Occasion Catering",
      image: "/images/image.png",
      description: "Providing tailored food and beverage services for weddings, corporate events, birthdays, anniversaries, baby showers, holiday parties, and other celebrations."
    },
    {
      id: 2,
      title: "Event & Occasion Catering", 
      image: "/images/cake2.jpg",
      description: "Providing tailored food and beverage services for weddings, corporate events, birthdays, anniversaries, baby showers, holiday parties, and other celebrations."
    },
    {
      id: 3,
      title: "Event & Occasion Catering",
      image: "/images/place1.jpg", 
      description: "Providing tailored food and beverage services for weddings, corporate events, birthdays, anniversaries, baby showers, holiday parties, and other celebrations."
    },
    {
      id: 4,
      title: "Event & Occasion Catering",
      image: "/images/image.png",
      description: "Providing tailored food and beverage services for weddings, corporate events, birthdays, anniversaries, baby showers, holiday parties, and other celebrations."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold font-heading text-gray-700 mb-6">Services Offered</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="relative h-32">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              {/* Image indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-semibold  font-heading text-event-blue text-sm mb-3">
                {service.title}
              </h3>
              <p className="text-sm font-sans text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              <button 
                onClick={onViewPricing}
                className="w-full bg-event-blue text-white py-2 px-4 rounded text-sm hover:bg-blue-900 transition-colors flex items-center justify-center gap-1 font-heading"
              >
                View Pricing
                <span className="text-xs">›</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesOffered;