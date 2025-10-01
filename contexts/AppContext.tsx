'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// App State Interface
interface AppState {
  sidebarOpen: boolean
  notifications: Notification[]
  loading: boolean
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
}

// Actions
type AppAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_NOTIFICATIONS' }

// Initial State (lazy initializer reads localStorage or prefers-color-scheme)
// removed theme logic

const initialState: AppState = {
  sidebarOpen: false,
  notifications: [],
  loading: false,
}

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date(),
          },
        ],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

// Context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper functions
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  setLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider Component
interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Helper functions
  // remove theme side effects

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: Date.now().toString() })
    }, 5000)
  }

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const value: AppContextType = {
    state,
    dispatch,
    toggleSidebar,
    addNotification,
    removeNotification,
    setLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}