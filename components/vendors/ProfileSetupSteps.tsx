'use client'

import Link from 'next/link'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'

interface Step {
  label: string
  completed: boolean
  active: boolean
}

const ProfileSetupSteps = () => {
  const { profileStatus } = useProfileCompletion()
  
  const steps: Step[] = [
    { label: 'Business Details', completed: profileStatus.completedSteps.includes('business-details'), active: !profileStatus.completedSteps.includes('business-details') && profileStatus.completedSteps.length === 0 },
    { label: 'Service Offering & Description', completed: profileStatus.completedSteps.includes('service-offering'), active: !profileStatus.completedSteps.includes('service-offering') && profileStatus.completedSteps.length === 1 },
    { label: 'Verification & Compliance', completed: profileStatus.completedSteps.includes('verification'), active: !profileStatus.completedSteps.includes('verification') && profileStatus.completedSteps.length === 2 },
    { label: 'Payment Setup', completed: profileStatus.completedSteps.includes('payment-setup'), active: !profileStatus.completedSteps.includes('payment-setup') && profileStatus.completedSteps.length === 3 },
  ]

  const completedSteps = steps.filter(step => step.completed).length
  const percentage = profileStatus.completionPercentage

  return (
    <Link href="/vendor/settings" className="block">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6 hover:shadow-md transition-shadow cursor-pointer">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
          Complete your Profile Setup to Connect with Clients
        </h3>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-3 sm:top-4 left-0 right-12 sm:right-16 h-0.5 bg-gray-200"></div>
        
        {/* Steps */}
        <div className="flex items-center justify-between w-full pr-12 sm:pr-20">
          {steps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                  step.active 
                    ? 'bg-event-blue' 
                    : step.completed 
                    ? 'bg-event-blue' 
                    : 'bg-white border-2'
                }`}
                style={{ 
                  backgroundColor: step.active || step.completed ? '#032D71' : 'white',
                  borderColor: '#032D71'
                }}
              >
                {step.active ? (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#032D71' }}></div>
                ) : step.completed ? (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#032D71' }}></div>
                ) : (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#032D71' }}></div>
                )}
              </div>
              
              {/* Step Label */}
              <span
                className={`text-xs text-center leading-tight ${
                  step.active 
                    ? 'font-semibold' 
                    : step.completed 
                    ? 'font-semibold' 
                    : 'font-medium'
                }`}
                style={{ 
                  color: step.active || step.completed ? '#032D71' : '#6B7280'
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Percentage Indicator */}
        <div className="relative">
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
            {/* Background Circle */}
            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#032D71"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Background Circle for percentage */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#032D71' }}
            ></div>
            
            {/* Percentage Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-xs font-semibold text-white">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default ProfileSetupSteps
