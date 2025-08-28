'use client';

import React from 'react';

const BusinessPortfolio: React.FC = () => {
  const portfolioSections = [
    {
      id: 1,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "./images/cake2.jpg",
        "./images/place1.jpg", 
        "./images/image.png",
        "./images/cake2.jpg"
      ]
    },
    {
      id: 2,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "./images/cake2.jpg",
        "./images/place1.jpg",
        "./images/image.png", 
        "./images/cake2.jpg"
      ]
    },
    {
      id: 3,
      title: "#LoveBeyondBorders2025 in Abuja, Nigeria",
      description: "Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant...",
      images: [
        "./images/cake2.jpg",
        "./images/place1.jpg",
        "./images/image.png",
        "./images/cake2.jpg"
      ]
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Business Portfolio</h2>
      
      <div className="space-y-6">
        {portfolioSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-center text-gray-600 font-medium mb-4">{section.title}</h3>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              {section.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Portfolio image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {section.description}
              <button className="text-event-blue hover:underline ml-1">see more</button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPortfolio;