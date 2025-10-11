import React from 'react';
import Image from 'next/image';

const WhyChooseEventHub = () => {
    return (
      <section className="bg-blue-100 rounded-t-lg p-4 pt-0 mt-0 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-700 space-y-4 md:space-y-0">
          {/* Left Container - Why Choose EventHub */}
          <div className="flex items-center space-x-3">
            {/* Integration/Hub Icon */}
            <Image 
              src="/images/file-icons_reasonstudios-alt.png" 
              alt="Why Choose EventHub" 
              width={24} 
              height={24} 
              className="flex-shrink-0"
            />
            <span className="font-medium text-sm md:text-base">Why Choose EventHub</span>
          </div>

          {/* Right Container - Safe Payments and Data Privacy */}
          <div className="flex items-center space-x-6">
            {/* Safe Payments Section */}
            <div className="flex items-center space-x-3">
              {/* Safe Lock Icon */}
              <Image 
                src="/images/mingcute_safe-lock-fill.png" 
                alt="Safe Payments" 
                width={24} 
                height={24} 
                className="flex-shrink-0"
              />
              <span className="font-medium text-sm md:text-base">Safe Payments</span>
            </div>

            {/* Data Privacy Section */}
            <div className="flex items-center space-x-3">
              {/* Privacy Icon */}
              <Image 
                src="/images/wpf_privacy.png" 
                alt="Data Privacy" 
                width={24} 
                height={24} 
                className="flex-shrink-0"
              />
              <span className="font-medium text-sm md:text-base">Data Privacy</span>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default WhyChooseEventHub;