'use client'

import { useState } from 'react'
import { FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { useCategories } from '@/hooks/useCategories'
import VendorPageHeader from '@/components/vendor/VendorPageHeader'

export default function VendorCategoriesPage() {
  const { categories, mainCategories, hierarchy, loading, error } = useCategories()
  const [activeTab, setActiveTab] = useState<'all' | 'main' | 'hierarchy'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const tabs = [
    { id: 'all', label: 'All Categories', count: categories.length },
    { id: 'main', label: 'Main Categories', count: mainCategories.length },
    { id: 'hierarchy', label: 'Hierarchy View', count: hierarchy.length },
  ]

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? 
      <FiToggleRight className="w-5 h-5 text-green-500" /> : 
      <FiToggleLeft className="w-5 h-5 text-gray-400" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <VendorPageHeader
          breadcrumbs={[{ label: 'Categories', isActive: true }]}
          title="Category Management"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <VendorPageHeader
          breadcrumbs={[{ label: 'Categories', isActive: true }]}
          title="Category Management"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const renderCategories = (categoriesToRender: any[]) => {
    return categoriesToRender.map((category) => (
      <div key={category.id} className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {category.name || 'Unnamed Category'}
              </h3>
              {getStatusIcon(category.isActive)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.isActive)}`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {category.description || 'No description available'}
            </p>
            {category.parentCategory && (
              <p className="text-xs text-blue-600">
                Parent: {category.parentCategory.name}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>ID:</span>
            <span className="font-mono">{category.id}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Created:</span>
            <span>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'Unknown'}</span>
          </div>
          {category.subcategoriesCount && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subcategories:</span>
              <span>{category.subcategoriesCount}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditingCategory(category)}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <FiEdit2 className="w-4 h-4 mr-2 inline" />
            Edit
          </button>
          <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <VendorPageHeader
        breadcrumbs={[{ label: 'Categories', isActive: true }]}
        title="Category Management"
      />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              New Category
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === tab.id ? 'bg-white text-[#0B2E6F]' : 'text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4 lg:p-6">
          {(() => {
            let categoriesToRender = []
            
            switch (activeTab) {
              case 'main':
                categoriesToRender = mainCategories
                break
              case 'hierarchy':
                categoriesToRender = hierarchy
                break
              default:
                categoriesToRender = filteredCategories
            }

            return categoriesToRender.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiPlus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? 'No categories to display.'
                    : `No ${activeTab} categories found.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderCategories(categoriesToRender)}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
