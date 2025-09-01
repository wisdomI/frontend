import { X, Check } from 'lucide-react';

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessNotification({ 
  isOpen, 
  onClose, 
  title = "Successful",
  message = "Your Personal Information has been saved successfully."
}: SuccessNotificationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Success Icon with decorative elements */}
        <div className="text-center mb-8 relative">
          {/* Decorative stars */}
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-8 right-1/4 w-2 h-2 bg-yellow-400 rounded-full"></div>
          
          {/* Main success circle */}
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {message}
          </p>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}