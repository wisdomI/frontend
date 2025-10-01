'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FilterContextType {
  selectedCategory: string | null
  selectedSubCategory: string | null
  setSelectedCategory: (category: string | null) => void
  setSelectedSubCategory: (subCategory: string | null) => void
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}

interface FilterProviderProps {
  children: ReactNode
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }

  const value = {
    selectedCategory,
    selectedSubCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    clearFilters
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}
