"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Coffee, Music, Truck, Camera, Video, Gift, ShoppingBag, Palette, Mic2, Badge, X } from 'lucide-react'
import CreateCategoryModal from './modals/CreateCategoryModal'
import EditCategoryModal from './modals/EditCategoryModal'
import DeleteCategoryModal from './modals/DeleteCategoryModal'
import { marketplaceAdminAPI, categoryAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function MarketplaceDashboard({ userRole = 'Marketplace Admin' }: { userRole?: string }) {
  const [activeTab, setActiveTab] = useState<'listings' | 'vendors' | 'categories'>('listings')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState([
    { label: 'Active Listings', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Featured Vendors', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
    { label: 'Categories', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#14B8A6]' },
  ])

  const [listings, setListings] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [moderationItems, setModerationItems] = useState<any[]>([])

  // Badge Management
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [selectedVendorForBadge, setSelectedVendorForBadge] = useState<any>(null)
  const [selectedBadgeType, setSelectedBadgeType] = useState('top_rated')

  const handleOpenBadgeModal = (vendor: any) => {
      setSelectedVendorForBadge(vendor)
      setShowBadgeModal(true)
  }

  const handleAddBadge = async () => {
      if (!selectedVendorForBadge) return
      try {
          await marketplaceAdminAPI.addVendorBadge({
              vendorId: selectedVendorForBadge.id,
              badgeType: selectedBadgeType
          })
          toast.success('Badge assigned successfully')
          setShowBadgeModal(false)
          // Refresh dashboard
          const res = await marketplaceAdminAPI.getDashboard()
          if (res.data?.data?.vendors) setVendors(res.data.data.vendors)
      } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Failed to assign badge')
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [dashboardRes, listingsRes, categoriesRes] = await Promise.all([
          marketplaceAdminAPI.getDashboard().catch(() => ({ data: { data: {} } })),
          marketplaceAdminAPI.getActiveListings().catch(() => ({ data: { data: [] } })),
          marketplaceAdminAPI.getAllCategories().catch(() => ({ data: { data: [] } }))
        ])

        const dashboardData = dashboardRes.data?.data || {}
        setStats([
          { label: 'Active Listings', value: dashboardData.activeListings?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
          { label: 'Featured Vendors', value: dashboardData.featuredVendors?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
          { label: 'Categories', value: dashboardData.totalCategories?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#14B8A6]' },
        ])
        
        // Assume dashboard returns lists for vendors and moderation if available
        if (dashboardData.vendors) setVendors(dashboardData.vendors)
        if (dashboardData.moderationQueue) setModerationItems(dashboardData.moderationQueue)

        if (listingsRes.data?.data) {
          setListings(Array.isArray(listingsRes.data.data) ? listingsRes.data.data : [])
        }

        if (categoriesRes.data?.data) {
           // Transform API categories to match UI needs if necessary (e.g. mapping icons)
           // For now, use a default icon or map based on name
           const mappedCategories = (Array.isArray(categoriesRes.data.data) ? categoriesRes.data.data : []).map((cat: any) => ({
             ...cat,
             icon: getCategoryIcon(cat.name),
             subcategories: cat.subcategories || []
           }))
           setCategories(mappedCategories)
        }

      } catch (error) {
        console.error('Error fetching marketplace data:', error)
        toast.error('Failed to load marketplace data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryIcon = (name: string) => {
      const lower = name.toLowerCase()
      if (lower.includes('catering') || lower.includes('food')) return Coffee
      if (lower.includes('entertainment') || lower.includes('music')) return Music
      if (lower.includes('rental') || lower.includes('equipment')) return Truck
      if (lower.includes('decor')) return Palette
      if (lower.includes('photo') || lower.includes('video')) return Camera
      if (lower.includes('beauty') || lower.includes('fashion')) return ShoppingBag
      return Gift
  }

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const handleDeleteClick = () => {
    setShowEditModal(false)
    setShowDeleteModal(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-32`}>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
            ) : (
            <span className={`text-3xl font-bold font-raleway ${stat.color} mb-1`}>{stat.value}</span>
            )}
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendor Badge Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Badge</h2>
          <div className="space-y-4">
            {vendors.length > 0 ? vendors.map((vendor, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {vendor.businessName || vendor.name}
                      {vendor.badges && vendor.badges.length > 0 && (
                          <span className="flex gap-1">
                              {vendor.badges.map((b: any, i: number) => (
                                  <span key={i} className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">
                                      {typeof b === 'string' ? b.replace('_', ' ') : b.type}
                                  </span>
                              ))}
                          </span>
                      )}
                  </h3>
                  <p className="text-sm text-gray-500">Rating: {vendor.rating || '-'} | Orders: {vendor.orders || '-'}</p>
                </div>
                <button
                  onClick={() => handleOpenBadgeModal(vendor)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-white bg-[#0B2E6F] hover:bg-[#09255a]"
                >
                  Manage Badges
                </button>
              </div>
            )) : <p className="text-sm text-gray-500">No vendors to display</p>}
            <div className="text-right">
              <button className="text-sm text-blue-600 font-medium">see more</button>
            </div>
          </div>
        </div>

        {/* Content Moderation Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h2>
          <div className="space-y-4">
            {moderationItems.length > 0 ? moderationItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex gap-4 text-sm">
                  <button className="text-green-600 font-medium hover:text-green-700">Approve</button>
                  <button className="text-red-600 font-medium hover:text-red-700">Remove</button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No content pending moderation</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Management */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Management</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>)}
                </div>
            ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <button 
                      key={category.id || index}
                  onClick={() => handleEditCategory(category)}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors text-left"
                >
                      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                      <span>{category.name || category.categoryName}</span>
                </button>
              )
            })}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 text-sm text-white bg-[#0B2E6F] px-4 py-2 rounded-lg hover:bg-[#092456] w-fit"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
            )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'listings'
                  ? 'border-[#0B2E6F] text-[#0B2E6F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Listings
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'vendors'
                  ? 'border-[#0B2E6F] text-[#0B2E6F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Featured Vendors
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'categories'
                  ? 'border-[#0B2E6F] text-[#0B2E6F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'listings' && (
            <>
              <div className="flex gap-4 mb-6">
                <div className="w-48">
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>Active</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <select className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>All Category</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-4">VENDOR</th>
                      <th className="pb-4">CATEGORY</th>
                      <th className="pb-4">SUB CATEGORY</th>
                      <th className="pb-4">STATUS</th>
                      <th className="pb-4">DATE LISTED</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listings.length > 0 ? listings.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 text-sm text-gray-900">{item.vendor || item.vendorName}</td>
                        <td className="py-4 text-sm text-gray-500">{item.category || item.categoryName}</td>
                        <td className="py-4 text-sm text-gray-500">{item.subCategory || item.subcategoryName}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{item.date || new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <button className="text-white bg-[#0B2E6F] hover:bg-[#092456] px-3 py-1 rounded-md text-xs font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="py-4 text-center text-sm text-gray-500">No listings found</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 text-sm text-gray-600">
                 <p className="mr-4">Showing {listings.length} results</p>
                 {/* Pagination logic would go here */}
              </div>
            </>
          )}

          {activeTab === 'vendors' && (
             <div className="space-y-4">
               {/* This section would be populated with featured vendors */}
               <p className="text-sm text-gray-500">Featured vendors list will appear here.</p>
             </div>
          )}

          {activeTab === 'categories' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon
                  return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                        <span className="text-sm font-medium text-gray-900">{cat.name || cat.categoryName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{cat.isActive ? 'Active' : 'Inactive'}</span>
                         <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => handleEditCategory(cat)}>Edit</button>
                         <button className="text-xs text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </div>
                  )
                })}
             </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={async (data) => {
          try {
             // Try marketplace admin API first
             try {
                await marketplaceAdminAPI.createCategory({
                    categoryName: data.name,
                    subcategoryName: data.subCategory,
                    categoryDescription: data.description
                })
             } catch (err: any) {
                // If 403 (Forbidden), try the generic category API as fallback
                // This handles cases where super_admin might not have granular marketplace permissions
                if (err.response?.status === 403) {
                    // console.log('Marketplace Admin API 403, falling back to Category API')
                    
                    // 1. Create Parent Category
                    const parentRes = await categoryAPI.create({
                        name: data.name,
                        description: data.description,
                        isActive: true
                    })
                    
                    // 2. Create Subcategory if provided
                    if (data.subCategory && parentRes.data?.data?.id) {
                        await categoryAPI.create({
                            name: data.subCategory,
                            description: data.description, // Inherit description or use name
                            parentId: parentRes.data.data.id,
                            isActive: true
                        })
                    }
                } else {
                    throw err // Re-throw other errors
                }
             }
             
             toast.success('Category created successfully')
             // Refresh categories
             const res = await marketplaceAdminAPI.getAllCategories()
             if (res.data?.data) setCategories(res.data.data)
          setShowCreateModal(false)
          } catch (error: any) {
             console.error('Create category error:', error)
             toast.error(error?.response?.data?.message || 'Failed to create category')
          }
        }}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        categoryName={selectedCategory?.name || selectedCategory?.categoryName || ''}
        initialSubcategories={selectedCategory?.subcategories || []}
        onSave={async (subs) => {
            // Need API to update subcategories
          // console.log('Save subs:', subs)
          setShowEditModal(false)
        }}
        onDelete={handleDeleteClick}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        categoryName={selectedCategory?.name || selectedCategory?.categoryName || ''}
        vendorCount={0} // Fetch real count if possible
        onConfirm={async () => {
          try {
            if (selectedCategory?.id) {
                await marketplaceAdminAPI.deleteCategory(selectedCategory.id)
                toast.success('Category deleted')
                 // Refresh
                 const res = await marketplaceAdminAPI.getAllCategories()
                 if (res.data?.data) setCategories(res.data.data)
            }
          setShowDeleteModal(false)
          } catch (error) {
              toast.error('Failed to delete category')
          }
        }}
      />

      {/* Badge Modal */}
      {showBadgeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">Manage Vendor Badge</h2>
                      <button onClick={() => setShowBadgeModal(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Select a badge to assign to <span className="font-semibold text-gray-900">{selectedVendorForBadge?.businessName || selectedVendorForBadge?.name}</span></p>
                      
                      <select 
                          value={selectedBadgeType}
                          onChange={(e) => setSelectedBadgeType(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#0B2E6F]"
                      >
                          <option value="top_rated">Top Rated</option>
                          <option value="most_booked">Most Booked</option>
                          <option value="rising_star">Rising Star</option>
                          <option value="best_valued">Best Valued</option>
                      </select>
                  </div>

                  <button 
                      onClick={handleAddBadge}
                      className="w-full py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors flex items-center justify-center gap-2"
                  >
                      <Badge className="w-4 h-4" />
                      Assign Badge
                  </button>
              </div>
          </div>
      )}
    </div>
  )
}

