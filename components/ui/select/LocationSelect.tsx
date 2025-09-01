import React, { useState } from 'react';

interface StateOption {
  id: string;
  label: string;
}

interface CountryOption {
  id: string;
  label: string;
  states: StateOption[];
}

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const locationOptions: CountryOption[] = [
  {
    id: 'nigeria',
    label: 'Nigeria',
    states: [
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
      { id: 'abia', label: 'Abia' }
    ]
  },
  {
    id: 'ghana',
    label: 'Ghana',
    states: [
      { id: 'greater-accra', label: 'Greater Accra' },
      { id: 'ashanti', label: 'Ashanti' },
      { id: 'western', label: 'Western' },
      { id: 'central', label: 'Central' },
      { id: 'eastern', label: 'Eastern' },
      { id: 'volta', label: 'Volta' },
      { id: 'northern', label: 'Northern' },
      { id: 'upper-east', label: 'Upper East' },
      { id: 'upper-west', label: 'Upper West' },
      { id: 'brong-ahafo', label: 'Brong Ahafo' }
    ]
  },
  {
    id: 'cameroon',
    label: 'Cameroon',
    states: [
      { id: 'centre', label: 'Centre' },
      { id: 'littoral', label: 'Littoral' },
      { id: 'west', label: 'West' },
      { id: 'northwest', label: 'Northwest' },
      { id: 'southwest', label: 'Southwest' },
      { id: 'south', label: 'South' },
      { id: 'east', label: 'East' },
      { id: 'adamawa', label: 'Adamawa' },
      { id: 'north', label: 'North' },
      { id: 'far-north', label: 'Far North' }
    ]
  },
  {
    id: 'togo',
    label: 'Togo',
    states: [
      { id: 'maritime', label: 'Maritime' },
      { id: 'plateaux', label: 'Plateaux' },
      { id: 'centrale', label: 'Centrale' },
      { id: 'kara', label: 'Kara' },
      { id: 'savanes', label: 'Savanes' }
    ]
  },
  {
    id: 'south-africa',
    label: 'South Africa',
    states: [
      { id: 'gauteng', label: 'Gauteng' },
      { id: 'western-cape', label: 'Western Cape' },
      { id: 'kwazulu-natal', label: 'KwaZulu-Natal' },
      { id: 'eastern-cape', label: 'Eastern Cape' },
      { id: 'limpopo', label: 'Limpopo' },
      { id: 'mpumalanga', label: 'Mpumalanga' },
      { id: 'north-west', label: 'North West' },
      { id: 'free-state', label: 'Free State' },
      { id: 'northern-cape', label: 'Northern Cape' }
    ]
  },
  {
    id: 'kenya',
    label: 'Kenya',
    states: [
      { id: 'nairobi', label: 'Nairobi' },
      { id: 'mombasa', label: 'Mombasa' },
      { id: 'kisumu', label: 'Kisumu' },
      { id: 'nakuru', label: 'Nakuru' },
      { id: 'eldoret', label: 'Eldoret' },
      { id: 'thika', label: 'Thika' },
      { id: 'malindi', label: 'Malindi' },
      { id: 'kitale', label: 'Kitale' }
    ]
  },
  {
    id: 'uganda',
    label: 'Uganda',
    states: [
      { id: 'kampala', label: 'Kampala' },
      { id: 'gulu', label: 'Gulu' },
      { id: 'lira', label: 'Lira' },
      { id: 'mbarara', label: 'Mbarara' },
      { id: 'jinja', label: 'Jinja' },
      { id: 'mbale', label: 'Mbale' },
      { id: 'kasese', label: 'Kasese' },
      { id: 'masaka', label: 'Masaka' }
    ]
  },
  {
    id: 'tanzania',
    label: 'Tanzania',
    states: [
      { id: 'dar-es-salaam', label: 'Dar es Salaam' },
      { id: 'mwanza', label: 'Mwanza' },
      { id: 'arusha', label: 'Arusha' },
      { id: 'dodoma', label: 'Dodoma' },
      { id: 'mbeya', label: 'Mbeya' },
      { id: 'morogoro', label: 'Morogoro' },
      { id: 'tanga', label: 'Tanga' },
      { id: 'zanzibar', label: 'Zanzibar' }
    ]
  },
  {
    id: 'ethiopia',
    label: 'Ethiopia',
    states: [
      { id: 'addis-ababa', label: 'Addis Ababa' },
      { id: 'dire-dawa', label: 'Dire Dawa' },
      { id: 'mekelle', label: 'Mekelle' },
      { id: 'gondar', label: 'Gondar' },
      { id: 'awasa', label: 'Awasa' },
      { id: 'bahir-dar', label: 'Bahir Dar' },
      { id: 'jimma', label: 'Jimma' },
      { id: 'dessie', label: 'Dessie' }
    ]
  },
  {
    id: 'rwanda',
    label: 'Rwanda',
    states: [
      { id: 'kigali', label: 'Kigali' },
      { id: 'butare', label: 'Butare' },
      { id: 'gitarama', label: 'Gitarama' },
      { id: 'ruhengeri', label: 'Ruhengeri' },
      { id: 'gisenyi', label: 'Gisenyi' }
    ]
  },
  {
    id: 'senegal',
    label: 'Senegal',
    states: [
      { id: 'dakar', label: 'Dakar' },
      { id: 'thies', label: 'Thiès' },
      { id: 'kaolack', label: 'Kaolack' },
      { id: 'saint-louis', label: 'Saint-Louis' },
      { id: 'ziguinchor', label: 'Ziguinchor' },
      { id: 'diourbel', label: 'Diourbel' },
      { id: 'tambacounda', label: 'Tambacounda' }
    ]
  },
  {
    id: 'ivory-coast',
    label: 'Ivory Coast',
    states: [
      { id: 'abidjan', label: 'Abidjan' },
      { id: 'yamoussoukro', label: 'Yamoussoukro' },
      { id: 'bouake', label: 'Bouaké' },
      { id: 'daloa', label: 'Daloa' },
      { id: 'san-pedro', label: 'San-Pédro' },
      { id: 'korhogo', label: 'Korhogo' },
      { id: 'man', label: 'Man' }
    ]
  },
  {
    id: 'burkina-faso',
    label: 'Burkina Faso',
    states: [
      { id: 'ouagadougou', label: 'Ouagadougou' },
      { id: 'bobo-dioulasso', label: 'Bobo-Dioulasso' },
      { id: 'koudougou', label: 'Koudougou' },
      { id: 'ouahigouya', label: 'Ouahigouya' },
      { id: 'banfora', label: 'Banfora' },
      { id: 'tenkodogo', label: 'Tenkodogo' }
    ]
  },
  {
    id: 'mali',
    label: 'Mali',
    states: [
      { id: 'bamako', label: 'Bamako' },
      { id: 'sikasso', label: 'Sikasso' },
      { id: 'mopti', label: 'Mopti' },
      { id: 'segou', label: 'Ségou' },
      { id: 'kayes', label: 'Kayes' },
      { id: 'gao', label: 'Gao' },
      { id: 'timbuktu', label: 'Timbuktu' }
    ]
  },
  {
    id: 'benin',
    label: 'Benin',
    states: [
      { id: 'cotonou', label: 'Cotonou' },
      { id: 'porto-novo', label: 'Porto-Novo' },
      { id: 'parakou', label: 'Parakou' },
      { id: 'djougou', label: 'Djougou' },
      { id: 'bohicon', label: 'Bohicon' },
      { id: 'kandi', label: 'Kandi' }
    ]
  }
];

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder = "Select Country/State"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find selected option (could be country or state)
  const getSelectedOption = () => {
    for (const country of locationOptions) {
      if (country.id === value) {
        return { type: 'country', label: country.label };
      }
      for (const state of country.states) {
        if (state.id === value) {
          return { type: 'state', label: `${state.label}, ${country.label}` };
        }
      }
    }
    return null;
  };

  const selectedOption = getSelectedOption();

  const handleCountrySelect = (countryId: string) => {
    onChange(countryId);
    setIsOpen(false);
    setHoveredCountry(null);
  };

  const handleStateSelect = (stateId: string) => {
    onChange(stateId);
    setIsOpen(false);
    setHoveredCountry(null);
    setSearchQuery('');
  };

  // Filter countries based on search query
  const filteredCountries = locationOptions.filter(country =>
    country.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.states.some(state => 
      state.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-fit px-2 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none   focus:ring-2 focus:ring-event-blue focus:border-transparent font-sans"
      >
        <span className={selectedOption ? "text-gray-900  text-white font-sans" : "text-gray-500 text-white font-sans"}>
          {selectedOption ? selectedOption.label : placeholder}
          <svg
          className={`absolute right-3 top-1/2 w-fit transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        </span>
        
      </button>

      {isOpen && (
        <div className="absolute z-50 flex">
          {/* Countries Panel */}
          <div className="w-56 mt-4 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
            <div className="p-2">
              {locationOptions.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleCountrySelect(country.id)}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  className={`w-full text-left px-2 py-2  mt-4 rounded-xl transition-colors font-sans flex items-center justify-between ${
                    value === country.id
                      ? 'bg-blue-100 text-event-blue font-medium'
                      : hoveredCountry === country.id
                      ? 'bg-blue-50 text-event-blue'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-heading font-medium">
                    {country.label}
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* States Panel */}
          {hoveredCountry && (
            <div className="w-56 mt-4 ml-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
              <div className="p-2">
                {locationOptions
                  .find(country => country.id === hoveredCountry)
                  ?.states.map((state) => (
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
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelect;