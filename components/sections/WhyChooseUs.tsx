import React from 'react';

const WhyChooseEventHub = () => {
    return (
      <section className="bg-blue-100 p-3 md:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between text-blue-800 text-sm gap-2 sm:gap-0">
        <div className="flex items-center">
          {/* Info Icon (triangle with !; use SVG or Heroicons) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Why Choose EventHub</span>
        </div>
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
          <a href="/safe-payments" className="hover:underline text-xs sm:text-sm">Safe Payments</a>
          <a href="/data-privacy" className="hover:underline text-xs sm:text-sm">Data Privacy</a>
        </div>
      </section>
    );
  };
  
  export default WhyChooseEventHub;