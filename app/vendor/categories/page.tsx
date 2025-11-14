'use client'

import React, { useState } from 'react'
import { FiRefreshCw, FiToggleLeft, FiToggleRight, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { ButtonLoader } from '@/components/ui/Loader'
import { useCategories } from '@/hooks/useCategories'

export default function VendorCategoriesPage() {
  const {
    hierarchy,
    stats,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    fetchHierarchy,
    fetchStats,
  } = useCategories({ autoFetch: true })

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    parentId: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingId) {
        await updateCategory(editingId, formState)
      } else {
        await createCategory(formState)
      }
      setFormState({ name: '', description: '', parentId: '' })
      setEditingId(null)
      await fetchStats()
    } finally {
      setSubmitting(false)
    }
  }

  const categoriesFlat = hierarchy
    .map(parent => [parent, ...(parent.subcategories || [])])
    .flat()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-asul">Category Manager</h1>
          <p className="text-gray-600 mt-1">
            Create and curate categories to keep the marketplace organised.
          </p>
        </div>
        <button
          onClick={() => {
            fetchHierarchy()
            fetchStats()
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Categories" value={stats.totalCategories} />
          <StatCard label="Active Categories" value={stats.activeCategories} />
          <StatCard label="Sub Categories" value={stats.subcategories} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Category' : 'Create Category'}
        </h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={formState.name}
              onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formState.description}
              onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
            <select
              value={formState.parentId}
              onChange={e => setFormState(prev => ({ ...prev, parentId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Top level</option>
              {hierarchy.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <ButtonLoader loading={submitting} loadingText="Saving...">
                  {editingId ? 'Update' : 'Create'}
                </ButtonLoader>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormState({ name: '', description: '', parentId: '' })
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
          <span className="text-sm text-gray-500">{categoriesFlat.length} entries</span>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Parent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesFlat.map(category => (
                  <tr key={category.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <p className="text-gray-500 text-xs line-clamp-2">{category.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.parentId
                        ? hierarchy.find(parent => parent.id === category.parentId)?.name || '—'
                        : 'Top level'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className="p-2 rounded-full border hover:bg-gray-50"
                          title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {category.isActive ? (
                            <FiToggleRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <FiToggleLeft className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(category.id)
                            setFormState({
                              name: category.name,
                              description: category.description || '',
                              parentId: category.parentId || '',
                            })
                          }}
                          className="p-2 rounded-full border hover:bg-gray-50"
                        >
                          <FiEdit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 rounded-full border hover:bg-gray-50"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value.toLocaleString()}</p>
    </div>
  )
}
