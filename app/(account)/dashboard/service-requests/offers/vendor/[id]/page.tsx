'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin, CheckCircle } from 'lucide-react';
import { mockOffers } from '@/data/mockOffers';
import SuccessModal, { ModalType } from '@/components/ui/modal/SuccessModal';

const VendorProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  // Find vendor data
  const vendor = mockOffers.find(offer => offer.id === vendorId) || mockOffers[0];
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('accept');

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAcceptOffer = () => {
    setModalType('accept');
    setShowModal(true);
  };

  const handleRejectOffer = () => {
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

  // Mock portfolio data
  const portfolioItems = [
    {
      id: 1,
      title: 'Ordination Ceremony at St. Mary\'s Catholic Church',
      description: 'In this event, we had several meal options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
      images: ['/images/cake2.jpg', '/images/cake.jpg', '/images/cake6.jpg', '/images/place1.jpg'],
    },
    {
      id: 2,
      title: 'Ordination Ceremony at St. Mary\'s Catholic Church',
      description: 'In this event, we had several meal options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
      images: ['/images/place1.jpg', '/images/cake.jpg', '/images/cake6.jpg', '/images/place3.jpg'],
    },
    {
      id: 3,
      title: 'Ordination Ceremony at St. Mary\'s Catholic Church',
      description: 'In this event, we had several meal options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
      images: ['/images/cake6.jpg', '/images/cake.jpg', '/images/place1.jpg', '/images/cake2.jpg'],
    },
  ];

  // Mock services data
  const services = [
    {
      id: 1,
      title: 'Event & Occasion Catering',
      description: 'Providing tailored food and beverage services for various events, birthdays, anniversaries, baby showers, holiday parties, and celebrations.',
    },
    {
      id: 2,
      title: 'Menu Options & Food Presentation',
      description: 'Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
    },
    {
      id: 3,
      title: 'Beverage & Dessert Services',
      description: 'Including bar and beverage services, cocktail service, dessert buffets, custom cakes, alcohol event licensing, and BYOB event licensing.',
    },
    {
      id: 4,
      title: 'Setup, Decor & Cleanup',
      description: 'Handling event setup, decorative elements, linens, lighting, centerpieces, and post-event cleanup services.',
    },
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: 'Adebisi Olatunji',
      date: '12 - 09 - 2023',
      comment: 'Their services are super fast and on time. They are very reliable. I totally recommend.',
      rating: 5,
      images: ['/images/cake2.jpg', '/images/cake.jpg', '/images/cake6.jpg', '/images/place1.jpg'],
    },
    {
      id: 2,
      name: 'Adebisi Olatunji',
      date: '12 - 09 - 2023',
      comment: 'Their services are super fast and on time. They are very reliable. I totally recommend.',
      rating: 5,
      images: ['/images/place1.jpg', '/images/cake.jpg', '/images/cake6.jpg', '/images/place3.jpg'],
    },
    {
      id: 3,
      name: 'Adebisi Olatunji',
      date: '12 - 09 - 2023',
      comment: 'Their services are super fast and on time. They are very reliable. I totally recommend.',
      rating: 5,
      images: ['/images/cake6.jpg', '/images/cake.jpg', '/images/place1.jpg', '/images/cake2.jpg'],
    },
    {
      id: 4,
      name: 'Adebisi Olatunji',
      date: '12 - 09 - 2023',
      comment: 'Their services are super fast and on time. They are very reliable. I totally recommend.',
      rating: 5,
      images: ['/images/cake2.jpg', '/images/place1.jpg', '/images/cake.jpg', '/images/cake6.jpg'],
    },
  ];

  return (
    <div className="bg-white rounded-lg">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-semibold font-heading text-gray-900">
            Offer: ₦100,000 - ₦199,000
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-heading font-medium text-gray-700">Total Bookings</span>
            <div className="bg-event-blue text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {vendor.totalBookings}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Large Image */}
          <div className="space-y-4">
            <div className="w-full h-80 rounded-lg overflow-hidden">
              <img
                src={vendor.vendorImage}
                alt={vendor.vendorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-event-blue text-white px-2 py-1 rounded text-xs">Verified</span>
            </div>
          </div>

          {/* Right Side - Vendor Info */}
          <div className="space-y-6">
            {/* Vendor Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/images/cake2.jpg"
                  alt={vendor.vendorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">
                {vendor.vendorName}
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Looking to announce baked treats? I can bake fresh daily goodies just for you! From bread and cookies to cupcake cakes. I'll bring your sweet cravings to life. Contact me today and enjoy baked perfection!
            </p>

            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Looking to announce baked treats? I can bake fresh daily goodies just for you! From bread and cookies to cupcake cakes. I'll bring your sweet cravings to life. Contact me today and enjoy baked perfection!
            </p>

            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-event-blue rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-sans text-gray-600">{vendor.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAcceptOffer}
                className="w-full bg-event-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Accept Offer
              </button>
              <button 
                onClick={handleRejectOffer}
                className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Reject Offer
              </button>
            </div>

            {/* Small Images Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src="/images/cake.jpg" alt="Portfolio" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src="/images/cake6.jpg" alt="Portfolio" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src="/images/place1.jpg" alt="Portfolio" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Portfolio Section */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-6">Business Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-heading font-medium text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.description}</p>
              
              {/* Portfolio Images */}
              <div className="flex gap-2 mb-3">
                {item.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <button className="text-sm text-event-blue hover:underline">View Images</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Offered Section */}
      <div className="mb-12">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-6">Services Offered</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-heading font-semibold text-gray-900 mb-2">{service.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-gray-900">
            Verified Reviews & Ratings ({Math.round(vendor.rating * 20)}% Rating)
          </h3>
          <button className="text-event-blue hover:underline text-sm">See more</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div>
                  <h5 className="font-medium text-gray-900">{review.name}</h5>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
              
              {/* Review Images */}
              <div className="flex gap-2 mb-3">
                {review.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={image} alt={`Review ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Rating:</span>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        vendorName={vendor.vendorName}
        offerAmount={vendor.price}
        onSendMessage={handleSendMessage}
        onGoToDashboard={handleGoToDashboard}
        onDone={handleDone}
      />
    </div>
  );
};

export default VendorProfilePage;