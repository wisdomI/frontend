'use client';

import React from 'react';
import { X } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const pricingPackages = [
    {
      name: 'Basic',
      price: '₦30,000',
      description: '1-tier cake (up to 6 inches diameter)',
      features: [
        'Basic flavor options (e.g., vanilla, chocolate)',
        'Minimal decoration (e.g., simple icing or sprinkles)',
        'Delivery within a local area'
      ],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'Standard',
      price: '₦50,000',
      description: '2 to 3-tier cakes (up to 8-10 inches diameter)',
      features: [
        'Multiple flavor options (e.g., vanilla, chocolate, red velvet)',
        'Basic custom decoration (e.g., themed icing, flowers)',
        'Delivery and setup within the local area'
      ],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Premium',
      price: '₦80,000',
      description: '3+ tier cakes (up to 12-14 inches diameter)',
      features: [
        'Multiple flavors and fillings (e.g., fruit, mousse, layered)',
        'Advanced decoration (fondant, intricate piping, edible images)',
        'Delivery, setup, and optional tastings'
      ],
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Custom',
      price: '₦150,000 Plus',
      description: 'Personalized design and decoration',
      features: [
        'Specialty ingredients (e.g., premium imported ingredients, unique flavors)',
        'Large or complex structures (e.g., 3D figures, elaborate tiers, carved cakes)',
        'Special delivery, setup, or on-site decoration services'
      ],
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-heading  font-bold text-gray-900">Pricing & Packages</h2>
            <p className="text-blue-900  font-heading font-semibold mt-1">Event & Occasion Catering</p>
          </div>
          <button
            onClick={onClose}
            className="bg-event-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPackages.map((pkg, index) => (
              <div
                key={index}
                className={`${pkg.bgColor} ${pkg.borderColor} border rounded-xl p-6 h-full flex flex-col`}
              >
                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold font-heading  text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-2xl font-bold font-heading text-gray-900 mb-3">{pkg.price}</div>
                  <p className="text-sm  font-sans text-gray-600 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm font-sans text-gray-700 leading-relaxed">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {/* <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Select Package
                  </button>
                </div> */}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-sans  text-center">
              All packages include consultation and basic setup. Custom requests and additional services may incur extra charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;