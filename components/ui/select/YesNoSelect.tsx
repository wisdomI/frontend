import React, { useState } from 'react';

interface YesNoOption {
  id: string;
  label: string;
}

interface YesNoSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  yesLabel?: string;
  noLabel?: string;
}

const YesNoSelect: React.FC<YesNoSelectProps> = ({
  value,
  onChange,
  placeholder = "Select Option",
  yesLabel = "Yes",
  noLabel = "No"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: YesNoOption[] = [
    { id: 'no', label: noLabel },
    { id: 'yes', label: yesLabel }
  ];

  const selectedOption = options.find(option => option.id === value);

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
      >
        <span className={selectedOption ? "text-gray-900 font-sans" : "text-gray-500 font-sans"}>
          {selectedOption ? selectedOption.label : placeholder}
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

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
          <div className="p-2">
            {options.map((option) => (
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

export default YesNoSelect;