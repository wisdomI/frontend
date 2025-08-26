import React, { useState } from 'react';

interface CityOption {
  id: string;
  label: string;
  state: string;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  selectedState?: string;
  placeholder?: string;
}

const cityOptions: CityOption[] = [
  // Lagos cities
  { id: 'lagos-island', label: 'Lagos Island', state: 'lagos' },
  { id: 'victoria-island', label: 'Victoria Island', state: 'lagos' },
  { id: 'ikeja', label: 'Ikeja', state: 'lagos' },
  { id: 'lekki', label: 'Lekki', state: 'lagos' },
  { id: 'surulere', label: 'Surulere', state: 'lagos' },
  { id: 'yaba', label: 'Yaba', state: 'lagos' },
  
  // Abuja areas
  { id: 'garki', label: 'Garki', state: 'abuja' },
  { id: 'wuse', label: 'Wuse', state: 'abuja' },
  { id: 'maitama', label: 'Maitama', state: 'abuja' },
  { id: 'asokoro', label: 'Asokoro', state: 'abuja' },
  { id: 'gwarinpa', label: 'Gwarinpa', state: 'abuja' },
  
  // Rivers cities
  { id: 'port-harcourt', label: 'Port Harcourt', state: 'rivers' },
  { id: 'obio-akpor', label: 'Obio-Akpor', state: 'rivers' },
  { id: 'bonny', label: 'Bonny', state: 'rivers' },
  
  // Other states
  { id: 'kano-city', label: 'Kano City', state: 'kano' },
  { id: 'ibadan', label: 'Ibadan', state: 'oyo' },
  { id: 'warri', label: 'Warri', state: 'delta' },
  { id: 'benin-city', label: 'Benin City', state: 'edo' }
];

const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  selectedState,
  placeholder = "Select City"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter cities based on selected state
  const filteredCities = selectedState 
    ? cityOptions.filter(city => city.state === selectedState)
    : cityOptions;

  const selectedOption = filteredCities.find(option => option.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-transparent font-sans"
        disabled={!selectedState}
      >
        <span className={selectedOption ? "text-gray-900 font-sans" : "text-gray-500 font-sans"}>
          {selectedOption ? selectedOption.label : (selectedState ? placeholder : "Select State first")}
        </span>
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

      {isOpen && selectedState && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
          <div className="p-2">
            {filteredCities.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-sans ${
                  value === option.id
                    ? 'bg-blue-100 text-event-blue font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-heading font-medium">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelect;