'use client'

interface Step {
  label: string
  completed: boolean
}

const ProfileSetupSteps = () => {
  const steps: Step[] = [
    { label: 'Business Details', completed: true },
    { label: 'Service Offering & Description', completed: false },
    { label: 'Verification & Compliance', completed: false },
    { label: 'Payment Setup', completed: false },
  ]

  return (
    <div className="bg-white rounded-lg p-4 shadow flex items-center justify-between">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
              step.completed ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            {i + 1}
          </div>
          <span className="text-sm">{step.label}</span>
        </div>
      ))}
      <div className="ml-auto text-sm font-semibold text-blue-600">25%</div>
    </div>
  )
}

export default ProfileSetupSteps
