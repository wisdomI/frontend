'use client'

import { useState } from 'react'

const steps = [
  'Business Details',
  'Service Offering & Description',
  'Verification & Compliance',
  'Payment Setup',
]

export default function ProfileSetupProgress() {
  const [activeStep, setActiveStep] = useState(0)

  const progress = Math.round(((activeStep + 1) / steps.length) * 100)

  return (
    <div className="bg-[#FAFAFA] border rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Complete your Profile Setup to Connect with Clients
      </h2>

      <div className="flex items-center justify-between">
        <div className="relative w-[80%]">
          {/* Base line */}
          <div className="absolute top-2.5 left-12 w-[85%] mx-auto h-[2px] bg-gray-200"></div>

          {/* Progress line */}
          <div
            className="absolute top-2.5 left-10 h-[2px] bg-blue-900 transition-all duration-300"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="flex justify-between relative z-10">
            {steps.map((label, index) => (
              <div
                key={label}
                className="flex flex-col items-center text-center w-32"
              >
                {/* Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-4
                  ${
                    index <= activeStep
                      ? 'bg-blue-900 border-white'
                      : 'bg-gray-300 border-white'
                  }`}
                ></div>

                {/* Label */}
                <p
                  className={`mt-3 text-sm font-semibold ${
                    index === activeStep ? 'text-blue-900' : 'text-gray-400'
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Circle at End */}
        <div className="flex flex-col items-center pb-8 w-[20%]">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#0f1f91"
                strokeWidth="4"
                fill="none"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-900">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
