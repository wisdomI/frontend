'use client';

import React from 'react';

const BusinessPortfolio: React.FC = () => {
  const portfolioSections = [
    {
      id: 1,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "/images/cake2.jpg",
        "/images/place1.jpg", 
        "/images/image.png",
        "/images/cake2.jpg",
        "/images/place1.jpg", 
      ]
    },
    {
      id: 2,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "/images/cake2.jpg",
        "/images/place1.jpg",
        "/images/image.png", 
        "/images/cake2.jpg",
        "/images/cake2.jpg"
      ]
    },
    {
      id: 3,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "/images/cake2.jpg",
        "/images/place1.jpg",
        "/images/image.png",
        "/images/cake2.jpg"
      ]
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-[24px] font-heading font-bold text-gray-700 mb-6">Business Portfolio</h2>
     
      <div className="space-y-6">
        {portfolioSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-center font-semibold text-[18px] text-gray-600 font-heading mb-6">{section.title}</h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6 px-4">
              {section.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={image}
                    alt={`Portfolio image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <p className="text-gray-600 text-md font-sans  leading-relaxed px-4">
              {section.description}
              <button className="text-event-blue hover:underline font-sans  ml-1">see more</button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPortfolio;