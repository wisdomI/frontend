'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, MapPin } from 'lucide-react';
import { BsShare } from 'react-icons/bs';
import { mockOffers } from '@/data/mockOffers';
import SuccessModal, { ModalType } from '@/components/ui/modal/SuccessModal';

const OffersPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventTitle = searchParams.get('title') || 'Service Request';

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('accept');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow fill-yellow' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAcceptOffer = (offer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOffer(offer);
    setModalType('accept');
    setShowModal(true);
  };

  const handleRejectOffer = (offer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOffer(offer);
    setModalType('decline');
    setShowModal(true);
  };

  const handleSendMessage = () => {
    setShowModal(false);
    router.push('/dashboard/messages');
  };

  const handleGoToDashboard = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  const handleDone = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg ">
      {/* Page Header - aligned with sidebar */}
      <div className="mb-8 mt-2">
        <h1 className="text-[20px] font-semibold font-heading text-gray-900 pb-2">View all Offers</h1>
        <p className="text-gray-600 font-sans text-sm">For: {eventTitle}</p>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/dashboard/service-requests/offers/vendor/${offer.id}`)}
          >
            <div className="flex gap-6">
              {/* Left - Smaller Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-24 rounded-lg overflow-hidden">
                  <img
                    src={offer.vendorImage}
                    alt={offer.vendorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-heading font-medium text-gray-700">Rating:</span>
                    <div className="flex items-center gap-1">
                      {renderStars(offer.rating)}
                      <span className="text-sm text-gray-600">({offer.rating * 20}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-heading font-medium text-gray-700">Total Bookings</span>
                    <div className="bg-event-blue text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                      <span className="text-white text-xs">✓</span>
                      {offer.totalBookings}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="flex-1 space-y-3">
                {/* Vendor Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {offer.isVerified && (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                    )}
                    <h3 className="text-lg font-heading font-semibold text-gray-900">
                      {offer.vendorName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-sans text-gray-500">Sent 17 hours ago</span>
                    <button className="p-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <BsShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  {offer.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 ">
                  <div className="w-6 h-6 bg-event-blue rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-sans text-gray-600">{offer.location}</span>



                </div>
                <div className="text-right flex w-full justify-between items-center">
                  <span className="text-sm font-heading font-medium text-gray-700">Offer:</span>
                  <div className="text-2xl font-heading font-bold text-event-blue">
                    {offer.price}
                  </div>
                </div>
                {/* Bottom Section - Rating, Total Bookings, Offer Price, Actions */}
                <div className="flex items-center justify-between pt-2">

                  {/* Left Side - Rating and Total Bookings */}
                  {/* <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-medium text-gray-700">Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(offer.rating)}
                        <span className="text-sm text-gray-600">({offer.rating * 20}%)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-medium text-gray-700">Total Bookings</span>
                      <div className="bg-event-blue text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                        <span className="text-white text-xs">✓</span>
                        {offer.totalBookings}
                      </div>
                    </div>
                  </div> */}

                  {/* Right Side - Offer Price and Actions */}
                  <div className="flex items-center w-full  flex-row justify-between gap-16">

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => handleRejectOffer(offer, e)}
                        className="px-8 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2 min-w-[140px]"
                      >
                        <span className="text-red-600">✕</span>
                        Reject Offer
                      </button>
                      <button
                        onClick={(e) => handleAcceptOffer(offer, e)}
                        className="px-8 py-3 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 min-w-[140px]"
                      >
                        <span className="text-white">✓</span>
                        Accept Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        vendorName={selectedOffer?.vendorName}
        offerAmount={selectedOffer?.price}
        onSendMessage={handleSendMessage}
        onGoToDashboard={handleGoToDashboard}
        onDone={handleDone}
      />
    </div>
  );
};

export default OffersPage;