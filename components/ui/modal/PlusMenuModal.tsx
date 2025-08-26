import React, { useRef } from 'react';
import { Image, FileText, Receipt, Users } from 'lucide-react';

interface PlusMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  onFileUpload?: (files: File[]) => void;
}

const PlusMenuModal: React.FC<PlusMenuModalProps> = ({ isOpen, onClose, onAction, onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'schedule-meeting',
      label: 'Schedule Meeting',
      icon: Users,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      highlighted: true
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    },
    {
      id: 'generate-invoice',
      label: 'Generate Invoice',
      icon: Receipt,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    },
    {
      id: 'pictures-videos',
      label: 'Pictures & Videos',
      icon: Image,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    }
  ];

  const handleAction = (actionId: string) => {
    if (actionId === 'pictures-videos') {
      // Trigger file input for pictures and videos
      fileInputRef.current?.click();
      return;
    }
    onAction(actionId);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      const fileArray = Array.from(files);
      onFileUpload(fileArray);
      onClose();
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.xls"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div className="absolute bottom-16 left-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[280px]">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleAction(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors hover:bg-gray-50 ${
                    item.highlighted ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${item.textColor}`} />
                  </div>
                  <span className={`font-medium ${item.highlighted ? 'text-blue-600' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlusMenuModal;