"use client"

import React, { useState } from 'react'
import { FiX, FiPlus } from 'react-icons/fi'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (subcategories: string[]) => void
  onDelete: () => void
  categoryName: string
  initialSubcategories: string[]
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  categoryName,
  initialSubcategories,
}: EditCategoryModalProps) {
  const [subcategories, setSubcategories] = useState<string[]>(initialSubcategories)
  const [newSubcategory, setNewSubcategory] = useState('')

  if (!isOpen) return null

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      setSubcategories([...subcategories, newSubcategory.trim()])
      setNewSubcategory('')
    }
  }

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Category</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                {/* Assuming icon is passed or we use a generic one based on name */}
                <span>{categoryName}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategories
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add subcategory"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {subcategories.map((sub, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{sub}</span>
                      <button
                        onClick={() => handleRemoveSubcategory(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onSave(subcategories)}
                  className="flex-1 justify-center rounded-md border border-transparent bg-[#0B2E6F] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex-1 justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

