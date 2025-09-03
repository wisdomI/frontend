'use client'

import { useState } from 'react'

interface Tab {
  value: string
  label: string
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onChange: (value: string) => void
}

export default function TabNavigation({
  tabs,
  activeTab,
  onChange,
}: TabNavigationProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#E1E1E1]">
      <div className="flex gap-10 border-b text-left font-asul font-bold text-lg">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 pl-0 pb-3 ${
              activeTab === tab.value
                ? 'border-b-2 border-event-blue text-event-blue font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

