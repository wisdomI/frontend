'use client';

import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

export type ModalType = 'accept' | 'decline' | 'request' | 'confirmation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  vendorName?: string;
  offerAmount?: string;
  onSendMessage?: () => void;
  onGoToDashboard?: () => void;
  onDone?: () => void;
  onCancel?: () => void;
  onYes?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  type,
  vendorName = 'UK Cakes & Cream',
  offerAmount = '₦500,000',
  onSendMessage,
  onGoToDashboard,
  onDone,
  onCancel,
  onYes,
}) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'accept':
        return {
          title: 'Vendor Offer Accepted Successfully',
          message: (
            <>
              Thank you for accepting the offer of <strong>{offerAmount} {vendorName}</strong>.
              <br /><br />
              You can now message the vendor directly to discuss any details, ask questions, or coordinate further.
            </>
          ),
          icon: <Check className="w-8 h-8 text-white" />,
          iconBg: 'bg-green-500',
          buttons: (
            <>
              <button
                onClick={onSendMessage}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Send a Message
              </button>
              <button
                onClick={onGoToDashboard}
                className="px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go back to Dashboard
              </button>
            </>
          ),
        };

      case 'decline':
        return {
          title: 'Vendor Offer Declined Successfully',
          message: (
            <>
              You have successfully declined the offer of <strong>{offerAmount} - ₦199,000 {vendorName}</strong>.
            </>
          ),
          icon: <Check className="w-8 h-8 text-white" />,
          iconBg: 'bg-green-500',
          buttons: (
            <button
              onClick={onDone}
              className="w-full px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          ),
        };

      case 'request':
        return {
          title: 'Request Successful',
          message: 'You have successfully requested for a Planner',
          icon: <Check className="w-8 h-8 text-white" />,
          iconBg: 'bg-green-500',
          buttons: (
            <button
              onClick={onDone}
              className="w-full px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          ),
        };

      case 'confirmation':
        return {
          title: 'Confirmation',
          message: 'Would you like to request for an event planner?',
          icon: <AlertTriangle className="w-8 h-8 text-white" />,
          iconBg: 'bg-red-500',
          buttons: (
            <>
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onYes}
                className="px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes
              </button>
            </>
          ),
        };

      default:
        return {
          title: 'Success',
          message: 'Operation completed successfully',
          icon: <Check className="w-8 h-8 text-white" />,
          iconBg: 'bg-green-500',
          buttons: (
            <button
              onClick={onDone}
              className="w-full px-6 py-2 bg-event-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          ),
        };
    }
  };

  const { title, message, icon, iconBg, buttons } = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {icon}
          </div>

          {/* Title */}
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 font-sans text-sm leading-relaxed mb-8">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {buttons}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
        <div className="absolute top-12 right-12 w-1 h-1 bg-yellow-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-yellow-400 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default SuccessModal;