"use client";

import { useState } from "react";
import { FaCheck, FaStar, FaHeart, FaGift } from "react-icons/fa";

export default function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
       <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md p-4 sm:p-6 relative mx-2">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-blue-900 hover:text-blue-700 font-bold text-lg sm:text-xl"
        >
          ✕
        </button>
                 <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
          <div className="relative">
                         <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
               <FaCheck className="text-white text-4xl sm:text-6xl font-bold" />
             </div>
                         {/* Success icons */}
             <FaStar className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-yellow-400 text-lg sm:text-xl" />
             <FaHeart className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 text-yellow-400 text-lg sm:text-xl" />
             <FaGift className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 text-yellow-400 text-lg sm:text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Service Post Successful</h2>
          <p className="text-sm sm:text-base text-gray-500">Your Service Request has been posted successfully</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-900 text-white py-2.5 sm:py-3 rounded-full font-medium hover:bg-blue-800 transition-colors text-sm sm:text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
