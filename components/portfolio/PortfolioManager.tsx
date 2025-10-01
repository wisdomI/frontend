'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { portfolioAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { Portfolio } from '@/types/api'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage, FiTag, FiCalendar } from 'react-icons/fi'

interface PortfolioManagerProps {
  userId?: string
  isOwnPortfolio?: boolean
}

export default function PortfolioManager({ userId, isOwnPortfolio = false }: PortfolioManagerProps) {
  const { user } = useAuthContext()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)

  // Fetch portfolios
  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true)
      let response
      
      if (isOwnPortfolio) {
        response = await portfolioAPI.getMyPortfolios()
      } else if (userId) {
        response = await portfolioAPI.getUserPortfolios(userId)
      } else {
        response = await portfolioAPI.getAll()
      }
      
      setPortfolios(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch portfolios')
      console.error('Error fetching portfolios:', err)
    } finally {
      setLoading(false)
    }
  }, [isOwnPortfolio, userId])

  useEffect(() => {
    fetchPortfolios()
  }, [userId, isOwnPortfolio, fetchPortfolios])

  // Delete portfolio
  const handleDelete = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return
    
    try {
      await portfolioAPI.delete(portfolioId)
      setPortfolios(portfolios.filter(p => p.id !== portfolioId))
    } catch (err) {
      setError('Failed to delete portfolio')
      console.error('Error deleting portfolio:', err)
    }
  }

  // Remove media from portfolio
  const handleRemoveMedia = async (portfolioId: string) => {
    try {
      await portfolioAPI.removeMedia(portfolioId)
      await fetchPortfolios() // Refresh the list
    } catch (err) {
      setError('Failed to remove media')
      console.error('Error removing media:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchPortfolios}
          className="mt-2 text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isOwnPortfolio ? 'My Portfolios' : 'Portfolios'}
        </h2>
        {isOwnPortfolio && user?.accountType === 'vendor' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Portfolio</span>
          </button>
        )}
      </div>

      {/* Portfolios Grid */}
      {portfolios.length === 0 ? (
        <div className="text-center py-12">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
          <p className="text-gray-500">
            {isOwnPortfolio ? 'Create your first portfolio to showcase your work' : 'This user hasn\'t created any portfolios yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Portfolio Media */}
              <div className="aspect-video bg-gray-100 relative">
                {portfolio.mediaUrl && portfolio.mediaUrl.length > 0 ? (
                  <Image 
                    src={portfolio.mediaUrl[0]} 
                    alt={portfolio.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiImage className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Action Buttons */}
                {isOwnPortfolio && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => setEditingPortfolio(portfolio)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FiEdit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio.id)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Portfolio Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {portfolio.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {portfolio.description}
                </p>
                
                {/* Tags */}
                {portfolio.tags && portfolio.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {portfolio.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <FiTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {portfolio.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{portfolio.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    <span>
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiImage className="w-3 h-3 mr-1" />
                    <span>{portfolio.mediaUrl?.length || 0} images</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Portfolio Modal */}
      {(showCreateModal || editingPortfolio) && (
        <CreateEditPortfolioModal
          portfolio={editingPortfolio}
          onClose={() => {
            setShowCreateModal(false)
            setEditingPortfolio(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingPortfolio(null)
            fetchPortfolios()
          }}
        />
      )}
    </div>
  )
}

// Create/Edit Portfolio Modal Component
interface CreateEditPortfolioModalProps {
  portfolio?: Portfolio | null
  onClose: () => void
  onSuccess: () => void
}

function CreateEditPortfolioModal({ portfolio, onClose, onSuccess }: CreateEditPortfolioModalProps) {
  const [formData, setFormData] = useState({
    title: portfolio?.title || '',
    description: portfolio?.description || '',
    categoryId: portfolio?.categoryId || '',
    tags: portfolio?.tags?.join(', ') || ''
  })
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('tags', formData.tags)

      // Add media files
      mediaFiles.forEach((file, index) => {
        formDataToSend.append(`mediaUrl`, file)
      })

      if (portfolio) {
        await portfolioAPI.update(portfolio.id, formDataToSend)
      } else {
        await portfolioAPI.create(formDataToSend)
      }

      onSuccess()
    } catch (err) {
      setError('Failed to save portfolio')
      console.error('Error saving portfolio:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      setError('Maximum 5 files allowed')
      return
    }
    setMediaFiles(files)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {portfolio ? 'Edit Portfolio' : 'Create Portfolio'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                placeholder="Enter category ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Files (Max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {mediaFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected {mediaFiles.length} file(s)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (portfolio ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
