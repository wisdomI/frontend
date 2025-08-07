import { RootState } from '@/store'

// Redux types
export type AppState = RootState

// Form data types
export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  userType: 'client' | 'vendor'
}

// Component prop types
export interface VendorCardProps {
  vendor?: import('./vendor').Vendor
}

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

// Utility types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: Date
}