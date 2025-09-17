'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft, FiUser, FiEye } from 'react-icons/fi'

interface SubscriptionPricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan: (plan: string, billingCycle: string, amount: string) => void
}

export default function SubscriptionPricingModal({ 
  isOpen, 
  onClose, 
  onSelectPlan 
}: SubscriptionPricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Yearly')

  if (!isOpen) return null

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: '₦50k/month',
      yearlyPrice: '₦50k/Yearly',
      monthlyWorkerCost: '£10,000 per worker/month',
      yearlyWorkerCost: '£10,000 per worker/month',
      features: [
        'Up to 10 active job postings at a time',
        'Limited to 50 messages/month.'
      ],
      highlighted: true
    },
    {
      name: 'Standard',
      monthlyPrice: '₦100k/month',
      yearlyPrice: '₦100k/Yearly',
      monthlyWorkerCost: '£7,000 per worker/month',
      yearlyWorkerCost: '£7,000 per worker/month',
      features: [
        'Unlimited active job postings',
        'Unlimited messaging'
      ],
      highlighted: false
    },
    {
      name: 'Premium',
      monthlyPrice: '₦170k/Month',
      yearlyPrice: '₦170k/Yearly',
      monthlyWorkerCost: '£5,000 per worker/month',
      yearlyWorkerCost: '£5,000 per worker/month',
      features: [
        'Unlimited active job postings',
        'Unlimited messaging with video calls',
        '24/7 priority support'
      ],
      highlighted: false
    }
  ]

  const handlePlanSelect = (plan: any) => {
    const amount = billingCycle === 'Monthly' ? plan.monthlyPrice : plan.yearlyPrice
    onSelectPlan(plan.name, billingCycle, amount)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Activate Subscription</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Select a Flexible Plan</h1>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-2 bg-gray-200 rounded-lg p-1 w-fit mx-auto">
              <button
                onClick={() => setBillingCycle('Monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'Monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ backgroundColor: billingCycle === 'Monthly' ? '#032D71' : undefined }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('Yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'Yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ backgroundColor: billingCycle === 'Yearly' ? '#032D71' : undefined }}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-6 border-2 transition-all ${
                  plan.highlighted
                    ? 'border-blue-600 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {/* Plan Name */}
                <div className="text-center mb-4">
                  <div 
                    className="inline-block px-4 py-2 rounded-lg text-white font-medium text-sm"
                    style={{ backgroundColor: '#032D71' }}
                  >
                    {plan.name}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {billingCycle === 'Monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {billingCycle === 'Monthly' ? plan.monthlyWorkerCost : plan.yearlyWorkerCost}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <p key={featureIndex} className="text-sm text-gray-600">
                      {feature}
                    </p>
                  ))}
                </div>

                {/* Learn More Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'text-white'
                  }`}
                  style={{ backgroundColor: plan.highlighted ? undefined : '#032D71' }}
                >
                  Learn more
                </button>
              </div>
            ))}
          </div>

          {/* Proceed Button */}
          <div className="text-center">
            <button
              className="px-8 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: '#032D71' }}
            >
              Proceed to Pay
            </button>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
