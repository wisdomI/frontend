'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Event State Interface
interface EventState {
  currentEvent: Event | null
  events: Event[]
  eventForm: EventFormData
  step: number
}

interface Event {
  id: string
  title: string
  type: string
  date: Date
  location: string
  budget: number
  guestCount: number
  description: string
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled'
  vendors: string[]
}

interface EventFormData {
  title: string
  type: string
  date: string
  location: string
  budget: number
  guestCount: number
  description: string
  services: string[]
}

// Actions
type EventAction =
  | { type: 'SET_CURRENT_EVENT'; payload: Event | null }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'UPDATE_FORM'; payload: Partial<EventFormData> }
  | { type: 'RESET_FORM' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }

// Initial State
const initialFormData: EventFormData = {
  title: '',
  type: '',
  date: '',
  location: '',
  budget: 0,
  guestCount: 0,
  description: '',
  services: [],
}

const initialState: EventState = {
  currentEvent: null,
  events: [],
  eventForm: initialFormData,
  step: 1,
}

// Reducer
const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'SET_CURRENT_EVENT':
      return { ...state, currentEvent: action.payload }
    case 'SET_EVENTS':
      return { ...state, events: action.payload }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
        currentEvent: state.currentEvent?.id === action.payload.id ? action.payload : state.currentEvent,
      }
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        currentEvent: state.currentEvent?.id === action.payload ? null : state.currentEvent,
      }
    case 'UPDATE_FORM':
      return {
        ...state,
        eventForm: { ...state.eventForm, ...action.payload },
      }
    case 'RESET_FORM':
      return { ...state, eventForm: initialFormData, step: 1 }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 }
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) }
    default:
      return state
  }
}

// Context
interface EventContextType {
  state: EventState
  dispatch: React.Dispatch<EventAction>
  // Helper functions
  setCurrentEvent: (event: Event | null) => void
  updateForm: (data: Partial<EventFormData>) => void
  resetForm: () => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

// Provider Component
interface EventProviderProps {
  children: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState)

  // Helper functions
  const setCurrentEvent = (event: Event | null) => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: event })
  }

  const updateForm = (data: Partial<EventFormData>) => {
    dispatch({ type: 'UPDATE_FORM', payload: data })
  }

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' })
  }

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' })
  }

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const value: EventContextType = {
    state,
    dispatch,
    setCurrentEvent,
    updateForm,
    resetForm,
    nextStep,
    prevStep,
    setStep,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

// Custom Hook
export const useEvent = (): EventContextType => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}