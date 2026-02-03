'use client'

import React, { useState } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { useFilterContext } from '@/contexts/FilterContext'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { debugLog } from '@/lib/utils'

interface CategoryItem {
  id: string
  name: string
  children?: CategoryItem[]
}

export default function CategorySidebar() {
  const { categories, loading, error } = useCategories({ autoFetch: true })
  const { selectedCategory, selectedSubCategory, setSelectedCategory, setSelectedSubCategory, clearFilters } = useFilterContext()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCategoryClick = (categoryId: string) => {
    debugLog('Category clicked:', categoryId)
    setSelectedCategory(categoryId)
    setSelectedSubCategory(null)
  }

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    debugLog('Subcategory clicked:', { categoryId, subCategoryId })
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <p className="text-red-600 text-sm">Error loading categories</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full sticky top-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 font-asul mb-3">Categories</h3>
        
        {(selectedCategory || selectedSubCategory) && (
          <button
            onClick={clearFilters}
            className="text-sm text-event-blue hover:text-blue-700 font-medium mb-3 block"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories available</p>
        ) : (
          categories.map((category: any) => {
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategory === category.id
            const hasChildren = category.children && category.children.length > 0

            return (
              <div key={category.id}>
                {/* Main Category */}
                <div className="flex items-center gap-2">
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpanded(category.id)}
                      className="p-0 text-gray-600 hover:text-gray-900"
                    >
                      {isExpanded ? (
                        <FiChevronDown className="w-4 h-4" />
                      ) : (
                        <FiChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {!hasChildren && <div className="w-4" />}
                  
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex-1 text-left text-sm py-2 px-2 rounded transition-colors ${
                      isSelected
                        ? 'bg-event-blue text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                </div>

                {/* Subcategories */}
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.children.map((subCategory: any) => {
                      const isSubSelected = selectedSubCategory === subCategory.id && selectedCategory === category.id

                      return (
                        <button
                          key={subCategory.id}
                          onClick={() => handleSubCategoryClick(category.id, subCategory.id)}
                          className={`w-full text-left text-sm py-2 px-2 rounded transition-colors ${
                            isSubSelected
                              ? 'bg-blue-100 text-event-blue font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subCategory.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
