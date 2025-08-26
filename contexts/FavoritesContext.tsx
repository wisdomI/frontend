'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceData } from '@/data/mockServices';

interface FavoritesContextType {
  favorites: ServiceData[];
  addToFavorites: (service: ServiceData) => void;
  removeFromFavorites: (serviceId: string) => void;
  isFavorite: (serviceId: string) => boolean;
  toggleFavorite: (service: ServiceData) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<ServiceData[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('eventhub-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('eventhub-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (service: ServiceData) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === service.id)) {
        return prev; // Already in favorites
      }
      return [...prev, service];
    });
  };

  const removeFromFavorites = (serviceId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== serviceId));
  };

  const isFavorite = (serviceId: string) => {
    return favorites.some(fav => fav.id === serviceId);
  };

  const toggleFavorite = (service: ServiceData) => {
    if (isFavorite(service.id)) {
      removeFromFavorites(service.id);
    } else {
      addToFavorites(service);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};