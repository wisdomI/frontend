'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import VendorHeader from '@/components/vendor/VendorHeader';

import BusinessPortfolio from '@/components/vendor/BusinessPortfolio';
import ServicesOffered from '@/components/vendor/ServicesOffered'
import VerifiedReviews from '@/components/vendor/VerifiedReviews';
import RecommendedSection from '@/components/vendor/RecommendedSection';
import AvailabilityModal from '@/components/vendor/modals/AvailabilityModal';
import PricingModal from '@/components/vendor/modals/PricingModal';
import CalendarModal from '@/components/vendor/modals/CalendarModal';
import ServiceRequestModal from '@/components/vendor/modals/ServiceRequestModal';
import { mockPopularServices } from '@/data/mockServices';

const VendorProfilePage: React.FC = () => {
  const params = useParams();
  const vendorId = params.id as string;

  // Find vendor data (in real app, this would be an API call)
  const vendor = mockPopularServices.find(service => service.id === vendorId) || mockPopularServices[0];

  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Vendor Header */}
      <VendorHeader
        vendor={vendor}
        onMyAvailability={() => setShowAvailabilityModal(true)}
        onViewPricing={() => setShowPricingModal(true)}
        onRequestService={() => setShowServiceRequestModal(true)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* Business Portfolio */}
        <BusinessPortfolio />

        {/* Services Offered */}
        <ServicesOffered onViewPricing={() => setShowPricingModal(true)} />

        {/* Verified Reviews */}
        <VerifiedReviews />

        {/* Recommended Section */}
        <RecommendedSection />
      </div>

      {/* Modals */}
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSetAvailability={() => setShowCalendarModal(true)}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={showServiceRequestModal}
        onClose={() => setShowServiceRequestModal(false)}
      />
    </div>
  );
};

export default VendorProfilePage;