'use client'
import { AiOutlineClose } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'


interface SuccessModalProps {
  message: string
  verificationType: string
  onLogin: () => void
  onClose: () => void
}

export default function SuccessModal({
    verificationType,
  message,
  onLogin,
  onClose,
}: SuccessModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center flex flex-col items-center relative animate-slide-up">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white p-1 bg-event-blue rounded"
          >
            <FaTimes />
          </button>
        </div>
        <svg
          width="100"
          height="100"
          viewBox="0 0 226 226"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="34.9219"
            y="29"
            width="147.156"
            height="147.156"
            rx="73.578"
            fill="#F1F5F9"
          />
          <circle cx="33.6948" cy="51.0737" r="2.4526" fill="#FBBB00" />
          <circle cx="196.794" cy="70.6938" r="2.4526" fill="#FBBB00" />
          <circle cx="27.5639" cy="174.929" r="2.4526" fill="#FBBB00" />
          <g filter="url(#filter0_d_1124_26077)">
            <circle cx="108" cy="103" r="47" fill="#12A58C" />
            <circle
              cx="108"
              cy="103"
              r="47"
              stroke="white"
              stroke-width="7.05004"
            />
          </g>
          <path
            d="M93.8984 103.001L105.648 114.751L129.148 91.2508"
            stroke="white"
            stroke-width="7.05"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <defs>
            <filter
              id="filter0_d_1124_26077"
              x="0.604311"
              y="0.774704"
              width="225.131"
              height="225.131"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="5.17003" dy="10.3401" />
              <feGaussianBlur stdDeviation="31.0202" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0588235 0 0 0 0 0.0901962 0 0 0 0 0.164706 0 0 0 0.08 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_1124_26077"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_1124_26077"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        <h3 className="text-lg font-bold mb-2">
          {verificationType} Verification Successful
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onLogin}
          className="w-full bg-blue-900 text-white py-3 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  )
}