'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface PortfolioItem {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  description?: string
}

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    type: 'image',
    url: '/images/portfolio1.jpg',
    title: 'Wedding Photography',
    description: 'Beautiful outdoor wedding ceremony'
  },
  {
    id: '2',
    type: 'image',
    url: '/images/portfolio2.jpg',
    title: 'Corporate Event',
    description: 'Professional corporate gathering'
  },
  {
    id: '3',
    type: 'image',
    url: '/images/portfolio3.jpg',
    title: 'Birthday Party',
    description: 'Colorful birthday celebration'
  },
  {
    id: '4',
    type: 'image',
    url: '/images/portfolio4.jpg',
    title: 'Anniversary Event',
    description: 'Elegant anniversary dinner'
  }
]

export default function PortfolioGallery() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (item: PortfolioItem, index: number) => {
    setSelectedItem(item)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mockPortfolioItems.length - 1
    setCurrentIndex(newIndex)
    setSelectedItem(mockPortfolioItems[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex < mockPortfolioItems.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedItem(mockPortfolioItems[newIndex])
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockPortfolioItems.map((item, index) => (
          <div
            key={item.id}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => openLightbox(item, index)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <img
              src={selectedItem.url}
              alt={selectedItem.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-semibold mb-2">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-gray-300">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}