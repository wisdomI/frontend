'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface FilterContextType {
  selectedCategory: string | null
  selectedSubCategory: string | null
  setSelectedCategory: (category: string | null) => void
  setSelectedSubCategory: (subCategory: string | null) => void
  clearFilters: () => void
  // New properties for active state management
  activeCategory: string | null
  activeSubCategory: string | null
  setActiveCategory: (category: string | null) => void
  setActiveSubCategory: (subCategory: string | null) => void
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)

  const clearFilters = useCallback(() => {
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setActiveCategory(null)
    setActiveSubCategory(null)
  }, [])

  const value = {
    selectedCategory,
    selectedSubCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    clearFilters,
    activeCategory,
    activeSubCategory,
    setActiveCategory,
    setActiveSubCategory
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}
