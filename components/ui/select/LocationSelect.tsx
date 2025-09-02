import React, { useState } from 'react';

interface StateOption {
  id: string;
  label: string;
}

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const nigerianStates: StateOption[] = [
  { id: 'lagos', label: 'Lagos' },
  { id: 'abuja', label: 'Abuja' },
  { id: 'ogun', label: 'Ogun' },
  { id: 'oyo', label: 'Oyo' },
  { id: 'edo', label: 'Edo' },
  { id: 'delta', label: 'Delta' },
  { id: 'rivers', label: 'Rivers' },
  { id: 'kano', label: 'Kano' },
  { id: 'kaduna', label: 'Kaduna' },
  { id: 'plateau', label: 'Plateau' },
  { id: 'cross-river', label: 'Cross River' },
  { id: 'anambra', label: 'Anambra' },
  { id: 'imo', label: 'Imo' },
  { id: 'enugu', label: 'Enugu' },
  { id: 'abia', label: 'Abia' },
  { id: 'akwa-ibom', label: 'Akwa Ibom' },
  { id: 'bauchi', label: 'Bauchi' },
  { id: 'bayelsa', label: 'Bayelsa' },
  { id: 'benue', label: 'Benue' },
  { id: 'borno', label: 'Borno' },
  { id: 'ebonyi', label: 'Ebonyi' },
  { id: 'ekiti', label: 'Ekiti' },
  { id: 'gombe', label: 'Gombe' },
  { id: 'jigawa', label: 'Jigawa' },
  { id: 'kebbi', label: 'Kebbi' },
  { id: 'kogi', label: 'Kogi' },
  { id: 'kwara', label: 'Kwara' },
  { id: 'nasarawa', label: 'Nasarawa' },
  { id: 'niger', label: 'Niger' },
  { id: 'ondo', label: 'Ondo' },
  { id: 'osun', label: 'Osun' },
  { id: 'sokoto', label: 'Sokoto' },
  { id: 'taraba', label: 'Taraba' },
  { id: 'yobe', label: 'Yobe' },
  { id: 'zamfara', label: 'Zamfara' }
];

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder = "Select State"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find selected state
  const getSelectedOption = () => {
    const selectedState = nigerianStates.find(state => state.id === value);
    return selectedState ? { type: 'state', label: selectedState.label } : null;
  };

  const selectedOption = getSelectedOption();

  const handleStateSelect = (stateId: string) => {
    onChange(stateId);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter states based on search query
  const filteredStates = nigerianStates.filter(state =>
    state.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 pr-8 text-left border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-transparent font-sans ${
          selectedOption ? 'bg-event-blue text-white' : 'bg-white text-gray-500'
        }`}
      >
        <span className="font-sans">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${selectedOption ? 'text-white' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-transparent"
            />
          </div>

          {/* States List */}
          <div className="p-2">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => handleStateSelect(state.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-sans ${
                    value === state.id
                      ? 'bg-blue-100 text-event-blue font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-heading font-medium">
                    {state.label}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No states found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelect;