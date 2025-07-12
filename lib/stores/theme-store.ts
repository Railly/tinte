'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = {
  id: number;
  name: string;
  description: string | null;
  content: string;
  user_id: string;
  public: boolean;
  created_at: string;
  updated_at: string;
};

export type ThemeFormData = {
  name: string;
  description?: string;
  content: string;
  public?: boolean;
};

interface ThemeState {
  // Client-side state
  selectedTheme: Theme | null;
  isCreating: boolean;
  isEditing: boolean;
  editingTheme: Theme | null;
  
  // UI state
  showPublicOnly: boolean;
  searchQuery: string;
  
  // Actions
  setSelectedTheme: (theme: Theme | null) => void;
  setIsCreating: (creating: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingTheme: (theme: Theme | null) => void;
  setShowPublicOnly: (showPublic: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Form helpers
  startCreating: () => void;
  startEditing: (theme: Theme) => void;
  cancelEditing: () => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedTheme: null,
      isCreating: false,
      isEditing: false,
      editingTheme: null,
      showPublicOnly: false,
      searchQuery: '',
      
      // Actions
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
      setIsCreating: (creating) => set({ isCreating: creating }),
      setIsEditing: (editing) => set({ isEditing: editing }),
      setEditingTheme: (theme) => set({ editingTheme: theme }),
      setShowPublicOnly: (showPublic) => set({ showPublicOnly: showPublic }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Form helpers
      startCreating: () => set({ 
        isCreating: true, 
        isEditing: false, 
        editingTheme: null,
        selectedTheme: null 
      }),
      
      startEditing: (theme) => set({ 
        isEditing: true, 
        isCreating: false, 
        editingTheme: theme,
        selectedTheme: theme 
      }),
      
      cancelEditing: () => set({ 
        isCreating: false, 
        isEditing: false, 
        editingTheme: null 
      }),
      
      reset: () => set({
        selectedTheme: null,
        isCreating: false,
        isEditing: false,
        editingTheme: null,
        searchQuery: '',
      }),
    }),
    {
      name: 'theme-store',
      // Only persist UI preferences, not temporary state
      partialize: (state) => ({
        showPublicOnly: state.showPublicOnly,
        searchQuery: state.searchQuery,
      }),
    }
  )
);

// Selectors for common derived state
export const useThemeSelectors = () => {
  const store = useThemeStore();
  
  return {
    isFormOpen: store.isCreating || store.isEditing,
    currentFormTheme: store.editingTheme,
    hasUnsavedChanges: store.isCreating || store.isEditing,
  };
};