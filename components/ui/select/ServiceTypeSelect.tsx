import React, { useState } from 'react';

interface ServiceOption {
  id: string;
  label: string;
  checked?: boolean;
}

interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  options: ServiceOption[];
  expanded?: boolean;
}

interface ServiceTypeSelectProps {
  selectedServices: string[];
  onChange: (services: string[]) => void;
  placeholder?: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'catering',
    label: 'Catering & Drinks',
    icon: '🍽️',
    expanded: true,
    options: [
      { id: 'caterers-local', label: 'Caterers (Local & Continental dishes)' },
      { id: 'small-chops', label: 'Small Chops Vendors', checked: true },
      { id: 'cocktail-mocktail', label: 'Cocktail & Mocktail Services' },
      { id: 'palm-wine', label: 'Palm Wine & Traditional Drinks Vendors' },
      { id: 'mobile-bar', label: 'Mobile Bar Services' },
      { id: 'cake-bakers', label: 'Cake Bakers', checked: true }
    ]
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: '🎭',
    options: [
      { id: 'dj-services', label: 'DJ Services' },
      { id: 'live-band', label: 'Live Band' },
      { id: 'mc-services', label: 'MC Services' },
      { id: 'dancers', label: 'Dancers & Performers' }
    ]
  },
  {
    id: 'rentals',
    label: 'Event Rentals & Equipment',
    icon: '🏠',
    options: [
      { id: 'venue-rental', label: 'Venue Rental' },
      { id: 'tent-rental', label: 'Tent & Canopy Rental' },
      { id: 'furniture-rental', label: 'Furniture Rental' },
      { id: 'sound-equipment', label: 'Sound Equipment' }
    ]
  },
  {
    id: 'decoration',
    label: 'Decoration and Setup',
    icon: '🎨',
    options: [
      { id: 'event-decoration', label: 'Event Decoration' },
      { id: 'floral-arrangement', label: 'Floral Arrangements' },
      { id: 'balloon-decoration', label: 'Balloon Decoration' },
      { id: 'lighting-setup', label: 'Lighting Setup' }
    ]
  },
  {
    id: 'media',
    label: 'Media & Content',
    icon: '📸',
    options: [
      { id: 'photography', label: 'Photography Services' },
      { id: 'videography', label: 'Videography Services' },
      { id: 'live-streaming', label: 'Live Streaming' },
      { id: 'photo-booth', label: 'Photo Booth Services' }
    ]
  },
  {
    id: 'beauty',
    label: 'Beauty & Grooming',
    icon: '💄',
    options: [
      { id: 'makeup-artist', label: 'Makeup Artist' },
      { id: 'hair-stylist', label: 'Hair Stylist' },
      { id: 'nail-technician', label: 'Nail Technician' },
      { id: 'spa-services', label: 'Spa Services' }
    ]
  },
  {
    id: 'support',
    label: 'Event Support Services',
    icon: '🤝',
    options: [
      { id: 'event-coordinator', label: 'Event Coordinator' },
      { id: 'security-services', label: 'Security Services' },
      { id: 'cleaning-services', label: 'Cleaning Services' },
      { id: 'parking-attendant', label: 'Parking Attendant' }
    ]
  },
  {
    id: 'fashion',
    label: 'Fashion & Styling',
    icon: '👗',
    options: [
      { id: 'fashion-designer', label: 'Fashion Designer' },
      { id: 'personal-stylist', label: 'Personal Stylist' },
      { id: 'costume-rental', label: 'Costume Rental' },
      { id: 'accessories', label: 'Accessories & Jewelry' }
    ]
  },
  {
    id: 'materials',
    label: 'Vendors for Event Materials',
    icon: '📦',
    options: [
      { id: 'printing-services', label: 'Printing Services' },
      { id: 'gift-items', label: 'Gift Items & Souvenirs' },
      { id: 'party-supplies', label: 'Party Supplies' },
      { id: 'custom-merchandise', label: 'Custom Merchandise' }
    ]
  },
  {
    id: 'kids',
    label: 'Kids & Special Fun Vendors',
    icon: '🎪',
    options: [
      { id: 'kids-entertainment', label: 'Kids Entertainment' },
      { id: 'bounce-house', label: 'Bounce House Rental' },
      { id: 'face-painting', label: 'Face Painting' },
      { id: 'magic-show', label: 'Magic Show' }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics & Miscellaneous',
    icon: '🚚',
    options: [
      { id: 'transportation', label: 'Transportation Services' },
      { id: 'delivery-services', label: 'Delivery Services' },
      { id: 'waste-management', label: 'Waste Management' },
      { id: 'insurance', label: 'Event Insurance' }
    ]
  }
];

const ServiceTypeSelect: React.FC<ServiceTypeSelectProps> = ({
  selectedServices,
  onChange,
  placeholder = "Select Services"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['catering']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    onChange(newServices);
  };

  const getSelectedServiceLabels = () => {
    const labels: string[] = [];
    serviceCategories.forEach(category => {
      category.options.forEach(option => {
        if (selectedServices.includes(option.id)) {
          labels.push(option.label);
        }
      });
    });
    return labels;
  };

  const selectedLabels = getSelectedServiceLabels();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-transparent font-sans min-h-[48px]"
      >
        <div className="flex flex-wrap gap-1 items-center pr-8">
          {selectedLabels.length > 0 ? (
            <>
              {selectedLabels.slice(0, 2).map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-event-blue text-white font-sans"
                >
                  {label.length > 15 ? `${label.substring(0, 15)}...` : label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const serviceId = serviceCategories
                        .flatMap(cat => cat.options)
                        .find(opt => opt.label === label)?.id;
                      if (serviceId) handleServiceToggle(serviceId);
                    }}
                    className="ml-1 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedLabels.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700 font-sans">
                  +{selectedLabels.length - 2} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500 font-sans">{placeholder}</span>
          )}
        </div>
        <svg
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-2">
            {serviceCategories.map((category) => (
              <div key={category.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors font-sans"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-heading font-medium text-gray-700">{category.label}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedCategories.includes(category.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-4 mt-2 space-y-2">
                    {category.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer font-sans"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(option.id)}
                          onChange={() => handleServiceToggle(option.id)}
                          className="w-4 h-4 text-event-blue border-gray-300 rounded focus:ring-event-blue"
                        />
                        <span className="text-gray-700 text-sm font-sans">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default ServiceTypeSelect;