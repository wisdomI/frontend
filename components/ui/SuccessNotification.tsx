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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-gray-50 rounded-xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
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
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="226" height="226" viewBox="0 0 226 226" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="34.9219" y="29" width="147.156" height="147.156" rx="73.578" fill="#F1F5F9"/>
<circle cx="33.6958" cy="51.0737" r="2.4526" fill="#FBBB00"/>
<circle cx="196.793" cy="70.6948" r="2.4526" fill="#FBBB00"/>
<circle cx="27.5644" cy="174.929" r="2.4526" fill="#FBBB00"/>
<g filter="url(#filter0_d_367_14843)">
<circle cx="108" cy="103" r="47" fill="#12A58C"/>
<circle cx="108" cy="103" r="47" stroke="white" stroke-width="7.05004"/>
</g>
<path d="M93.9004 103L105.65 114.75L129.15 91.25" stroke="white" stroke-width="7.05" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<filter id="filter0_d_367_14843" x="0.604799" y="0.776291" width="225.13" height="225.128" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="5.17003" dy="10.3401"/>
<feGaussianBlur stdDeviation="31.0202"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0588235 0 0 0 0 0.0901962 0 0 0 0 0.164706 0 0 0 0.08 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_367_14843"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_367_14843" result="shape"/>
</filter>
</defs>
</svg>

          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold font-sans text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg font-sans">
            {message}
          </p>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-900 text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-900 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}