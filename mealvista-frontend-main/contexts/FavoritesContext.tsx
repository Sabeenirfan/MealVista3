import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

export interface RecipeItem {
  id: string;
  title: string;
  image?: string;
  time?: number;
  calories?: number;
  difficulty?: string;
  rating?: number;
}

interface FavoritesContextType {
  favorites: RecipeItem[];
  addFavorite: (item: RecipeItem) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (item: RecipeItem) => Promise<void>;
  isFavorited: (id: string) => boolean;
  loadFavorites: () => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<RecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from backend on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/auth/favorites');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (item: RecipeItem) => {
    try {
      const response = await api.post('/api/auth/favorites', item);
      setFavorites(response.data.favorites || []);
    } catch (error: any) {
      console.error('Failed to add favorite:', error);
      if (error.response?.status !== 400) {
        throw error;
      }
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const response = await api.delete(`/api/auth/favorites/${id}`);
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  };

  const toggleFavorite = async (item: RecipeItem) => {
    try {
      const response = await api.post('/api/auth/favorites/toggle', item);
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  const isFavorited = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorited, loadFavorites, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};

export default FavoritesContext;
