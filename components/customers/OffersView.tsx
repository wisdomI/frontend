import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { BsShare } from 'react-icons/bs';

interface Offer {
  id: string;
  vendorName: string;
  vendorImage: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  totalBookings: number;
  isVerified: boolean;
}

interface OffersViewProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
  eventTitle: string;
}

const OffersView: React.FC<OffersViewProps> = ({ isOpen, onClose, offers, eventTitle }) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow fill-yellow' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-heading font-bold text-gray-700">View all Offers</h2>
          <button
            onClick={onClose}
            className="bg-event-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex gap-6">
                {/* Vendor Image */}
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={offer.vendorImage}
                    alt={offer.vendorName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Vendor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {offer.isVerified && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                      )}
                      <h3 className="text-lg font-heading font-semibold text-gray-900">
                        {offer.vendorName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-sans text-gray-500">Sent 0 hours ago</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <BsShare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 font-sans text-sm mb-4 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-sans text-gray-600">{offer.location}</span>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-heading font-medium text-gray-700">Rating:</span>
                        <div className="flex items-center gap-1">
                          {renderStars(offer.rating)}
                        </div>
                        <span className="text-sm text-gray-600">({offer.reviewCount})</span>
                      </div>

                      {/* Total Bookings */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-heading font-medium text-gray-700">Total Bookings:</span>
                        <div className="bg-event-blue text-white px-2 py-1 rounded text-sm font-medium">
                          {offer.totalBookings}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        {offer.price}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                          Reject Offer
                        </button>
                        <button className="px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
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
      </div>
    </div>
  );
};

export default OffersView;