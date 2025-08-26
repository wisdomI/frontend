import React from 'react';
import { Image } from 'lucide-react';

interface ViewMediaDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewMedia: () => void;
}

const ViewMediaDropdown: React.FC<ViewMediaDropdownProps> = ({ 
  isOpen, 
  onClose, 
  onViewMedia 
}) => {
  if (!isOpen) return null;

  const handleViewMedia = () => {
    onViewMedia();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div className="absolute top-12 right-0 z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 min-w-[200px]">
          <button
            onClick={handleViewMedia}
            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Image className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-blue-600">View Media</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewMediaDropdown;