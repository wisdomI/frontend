'use client';

import React, { useState } from 'react';
import { Grid3X3, List, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import ServiceCard from '@/components/ui/ServiceCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import WhyChooseEventHub from '@/components/sections/WhyChooseUs';
import { useFavorites } from '@/contexts/FavoritesContext';

const FavoritesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { favorites: favoriteServices } = useFavorites();

  const breadcrumbItems = [
    { label: 'Quick Actions', href: '/' },
    { label: 'View All Favourites', active: true }
  ];

  return (
    <div className="container mx-auto px-8 md:px-12 lg:px-16">
      <div className="flex min-h-screen gap-6 py-6">
        <Sidebar />
        <main className="flex-1">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Why Choose EventHub */}
          <WhyChooseEventHub />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold font-heading text-gray-700">Favourite Services</h1>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {favoriteServices.length} services
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" 
                      ? "bg-event-blue text-white" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" 
                      ? "bg-event-blue text-white" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {favoriteServices.length > 0 ? (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {favoriteServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  layout={viewMode}
                  showPrice={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
              <p className="text-gray-500 mb-4">Start adding services to your favorites to see them here.</p>
              <button className="bg-event-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Services
              </button>
            </div>
          )}

          {/* Load More Button (if needed) */}
          {favoriteServices.length > 0 && (
            <div className="text-center mt-8">
              <button className="flex items-center mx-auto text-event-blue hover:underline">
                Load More Favorites
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FavoritesPage;