'use client';

import React from 'react';
import { ArrowLeft, Heart, Share2, MessageCircle, Calendar, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ServiceData } from '@/data/mockServices';
import DiamondIcon from '@/components/ui/DiamondIcon';
import { BsChatDots, BsFillShareFill } from "react-icons/bs";

interface VendorHeaderProps {
  vendor: ServiceData;
  onMyAvailability: () => void;
  onViewPricing: () => void;
  onRequestService: () => void;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ 
  vendor, 
  onMyAvailability, 
  onViewPricing,
  onRequestService 
}) => {
  const router = useRouter();

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Category</span>
          <span>›</span>
          <span>Catering & Drinks</span>
          <span>›</span>
          <span>Cake Bakers</span>
        </div>

        {/* Main Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DiamondIcon className="w-6 h-6" />
              <h1 className="text-3xl font-heading font-bold text-gray-900">{vendor.title}</h1>
            </div>
            
            <div className="flex gap-1 mb-1 ">
              <button 
                className="bg-blue-900 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <BsChatDots className="w-4 h-4" />
              </button>
              <button 
                className="bg-blue-900 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                 
                }}
              >
                <Heart className={`w-4 h-4 `} />
              </button>
              <button 
                className="bg-blue-900 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <BsFillShareFill className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-event-blue text-white px-4 py-2 rounded-lg text-sm font-medium">
              Top Rated
            </span>
            <div className="text-right px-4 py-2   flex bg-event-blue text-white px-3 py-1 rounded-lg text-sm font-medium">
              <p className="text-gray-600 text-sm px-2 text-white">Total Request</p>
              <div className="">
                120
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8">
          {/* Left - Main Image */}
          <div className="w-96 h-80 relative">
            <img
              src={vendor.image}
              alt={vendor.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {vendor.verified && (
              <div className="absolute top-3 left-3">
                <span className="bg-event-blue text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Verified
                </span>
              </div>
            )}
            
            {/* Social Media Icons */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <div className="bg-pink-500 p-2 rounded">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="bg-blue-600 p-2 rounded">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="bg-black p-2 rounded">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Center - Additional Images */}
          <div className="flex flex-col gap-4 w-32">
            <div className="w-full h-24 rounded-lg overflow-hidden">
              <img src="/images/cake2.jpg" alt="Additional" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-24 rounded-lg overflow-hidden">
              <img src="/images/place1.jpg" alt="Additional" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-24 rounded-lg overflow-hidden">
              <img src="/images/image.png" alt="Additional" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right - Vendor Info Card */}
          <div className="flex-1 bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src="/images/cake2.jpg" alt="Vendor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-gray-900">{vendor.vendorName}</h3>
              </div>
            </div>

            <p className="text-gray-600  font-sans text-sm mb-4 leading-relaxed">
              Looking for delicious baked treats? I can bake fresh, tasty goodies just for you! From bread and cookies to custom cakes, I'll bring your sweet cravings to life. Contact me today and enjoy baked perfection!
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-event-blue">🌐</span>
                <span className="text-event-blue font-sans">www.eventhub.com/findplayground2</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-event-blue">📍</span>
                <span className='font-sans'>Lagos, Nigeria</span>
                <span className="text-gray-500 font-sans ">• Travels anywhere</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span className='font-sans'>Available - Next booking: Feb 20, 2025</span>
              </div>
              
              <button 
                onClick={onMyAvailability}
                className="w-full bg-white border border-gray-300 font-heading text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Check Availability
              </button>
              
              <button 
                onClick={onRequestService}
                className="w-full bg-event-blue font-heading text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;