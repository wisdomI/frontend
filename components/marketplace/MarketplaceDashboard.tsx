"use client"

import React, { useState } from 'react'
import { Plus, Coffee, Music, Truck, Camera, Video, Gift, ShoppingBag, Palette, Mic2 } from 'lucide-react'
import CreateCategoryModal from './modals/CreateCategoryModal'
import EditCategoryModal from './modals/EditCategoryModal'
import DeleteCategoryModal from './modals/DeleteCategoryModal'

export default function MarketplaceDashboard({ userRole = 'Marketplace Admin' }: { userRole?: string }) {
  const [activeTab, setActiveTab] = useState<'listings' | 'vendors' | 'categories'>('listings')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const stats = [
    { label: 'Active Listings', value: '1,234', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Featured Vendors', value: '56', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
    { label: 'Categories', value: '16', color: 'text-[#0B2E6F]', border: 'border-[#14B8A6]' },
  ]

  const vendors = [
    { name: 'Royal Events Ltd', rating: '4.8', orders: 234, id: 1 },
    { name: 'UK Cakes & Cream', rating: '4.9', orders: 434, id: 2 },
    { name: 'Ruthie Rentals', rating: '4.8', orders: 57, id: 3 },
  ]

  const moderationItems = [
    { title: 'Review Flagged', description: 'Comment contains inappropriate language', type: 'flagged', id: 1 },
    { title: 'New Article', description: 'Elite Catering published article on "Planning Meals"', type: 'article', id: 2 },
    { title: 'New Article', description: 'Elite Catering published article on "Planning Meals"', type: 'article', id: 3 },
  ]

  const categories = [
    { name: 'Catering & Drinks', icon: Coffee, subcategories: ['Caterers', 'Small Chops', 'Cocktails'] },
    { name: 'Entertainment', icon: Music, subcategories: ['DJs', 'Live Bands', 'MC'] },
    { name: 'Rentals & Equipment', icon: Truck, subcategories: ['Tents', 'Chairs', 'Tables'] },
    { name: 'Decoration and Setup', icon: Palette, subcategories: ['Decorators', 'Florists'] },
    { name: 'Media & Content', icon: Camera, subcategories: ['Photographers', 'Videographers'] },
    { name: 'Beauty & Grooming', icon: ShoppingBag, subcategories: ['Makeup Artists', 'Stylists'] },
    { name: 'Event Support Services', icon: Mic2, subcategories: ['Ushers', 'Security'] },
    { name: 'Fashion & Styling', icon: ShoppingBag, subcategories: ['Designers', 'Tailors'] },
    { name: 'Logistics & Miscellaneous', icon: Truck, subcategories: ['Transport', 'Delivery'] },
    { name: 'Content Creators', icon: Video, subcategories: ['Influencers', 'Bloggers'] },
    { name: 'Venue Providers', icon: Gift, subcategories: ['Halls', 'Gardens'] },
    { name: 'Event Materials', icon: Gift, subcategories: ['Souvenirs', 'Printing'] },
    { name: 'Kids & Special Fun Vendors', icon: Gift, subcategories: ['Clowns', 'Bouncy Castles'] },
  ]

  const listings = [
    { vendor: 'ABC Caterers', category: 'Catering & Drinks', subCategory: 'Caterers', status: 'Active', date: '2025-10-16 09:30 AM', id: 1 },
    { vendor: 'XYZ Decor', category: 'Decoration & Setup', subCategory: 'Decor', status: 'Active', date: '2025-10-16 09:30 AM', id: 2 },
    { vendor: 'UK Cakes', category: 'Catering & Drinks', subCategory: 'Cakes', status: 'Active', date: '2025-10-16 09:30 AM', id: 3 },
    { vendor: 'DJ Lekzy', category: 'Entertainment', subCategory: 'DJ', status: 'Active', date: '2025-10-16 09:30 AM', id: 4 },
    { vendor: 'Ruthie Rentals', category: 'Decoration & Setup', subCategory: 'Decor', status: 'Active', date: '2025-10-16 09:30 AM', id: 5 },
    { vendor: 'Elite Catering', category: 'Catering & Drinks', subCategory: 'Caterers', status: 'Active', date: '2025-10-16 09:30 AM', id: 6 },
    { vendor: 'Ruthie Rentals', category: 'Decoration & Setup', subCategory: 'Decor', status: 'Active', date: '2025-10-16 09:30 AM', id: 7 },
    { vendor: 'Ile Iyan Foods', category: 'Catering & Drinks', subCategory: 'Caterers', status: 'Active', date: '2025-10-16 09:30 AM', id: 8 },
    { vendor: 'Ruthie Rentals', category: 'Decoration & Set', subCategory: 'Decor', status: 'Active', date: '2025-10-16 09:30 AM', id: 9 },
  ]

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
        <h1 className="text-2xl font-bold font-asul text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-32`}>
            <span className={`text-3xl font-bold font-asul ${stat.color} mb-1`}>{stat.value}</span>
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendor Badge Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Badge</h2>
          <div className="space-y-4">
            {vendors.map((vendor, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                  <p className="text-sm text-gray-500">Rating: {vendor.rating} | Orders: {vendor.orders}</p>
                </div>
                <button
                  className={`px-4 py-2 rounded-md text-xs font-medium text-white ${
                    index === 0 ? 'bg-purple-700' : 
                    index === 1 ? 'bg-pink-500' : 
                    'bg-yellow-500'
                  }`}
                >
                  {index === 0 ? 'Add Top Rated Badge' : 
                   index === 1 ? 'Add Most Booked Badge' : 
                   'Add Rising Star Badge'}
                </button>
              </div>
            ))}
            <div className="text-right">
              <button className="text-sm text-blue-600 font-medium">see more</button>
            </div>
          </div>
        </div>

        {/* Content Moderation Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h2>
          <div className="space-y-4">
            {moderationItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex gap-4 text-sm">
                  <button className="text-green-600 font-medium hover:text-green-700">Approve</button>
                  <button className="text-red-600 font-medium hover:text-red-700">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Management */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Management</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <button 
                  key={index}
                  onClick={() => handleEditCategory(category)}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span>{category.name}</span>
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
                    {listings.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 text-sm text-gray-900">{item.vendor}</td>
                        <td className="py-4 text-sm text-gray-500">{item.category}</td>
                        <td className="py-4 text-sm text-gray-500">{item.subCategory}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{item.date}</td>
                        <td className="py-4 text-right">
                          <button className="text-white bg-[#0B2E6F] hover:bg-[#092456] px-3 py-1 rounded-md text-xs font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 text-sm text-gray-600">
                 <p className="mr-4">Showing 1- 10 of 20</p>
                 <button className="px-2 py-1 bg-[#0B2E6F] text-white rounded">1</button>
                 <button className="px-2 py-1 hover:bg-gray-100 rounded">2</button>
                 <span>...</span>
                 <button className="px-2 py-1 hover:bg-gray-100 rounded">10</button>
                 <button className="px-2 py-1 hover:bg-gray-100 rounded">Next</button>
              </div>
            </>
          )}

          {activeTab === 'vendors' && (
             <div className="space-y-4">
               <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                 <div>
                   <h3 className="font-medium text-gray-900">Premier Catering</h3>
                   <p className="text-sm text-gray-500">Rating: 4.8 | Catering & Drinks</p>
                   <p className="text-xs text-gray-400 mt-1">Featured: Homepage Banner</p>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <span className="px-3 py-1 bg-purple-700 text-white text-xs font-medium rounded-md">Top Rated</span>
                   <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                 </div>
               </div>
               <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                 <div>
                   <h3 className="font-medium text-gray-900">Ruthie Rentals</h3>
                   <p className="text-sm text-gray-500">Rating: 4.8 | Decoration & Setup</p>
                   <p className="text-xs text-gray-400 mt-1">Featured: Category Top</p>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <span className="px-3 py-1 bg-purple-700 text-white text-xs font-medium rounded-md">Top Rated</span>
                   <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'categories' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon
                  return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
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
        onConfirm={(data) => {
          console.log('Create:', data)
          setShowCreateModal(false)
        }}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        categoryName={selectedCategory?.name || ''}
        initialSubcategories={selectedCategory?.subcategories || []}
        onSave={(subs) => {
          console.log('Save subs:', subs)
          setShowEditModal(false)
        }}
        onDelete={handleDeleteClick}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        categoryName={selectedCategory?.name || ''}
        vendorCount={456} // Mock count
        onConfirm={() => {
          console.log('Delete confirmed')
          setShowDeleteModal(false)
        }}
      />
    </div>
  )
}

