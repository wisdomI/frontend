'use client'

import React, { useState } from 'react'
import { signInWithEmail } from '@/lib/auth'
import { useApp } from '@/contexts/AppContext'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { addNotification } = useApp()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signInWithEmail(formData.email, formData.password)
      
      if (result.error) {
        addNotification({
          type: 'error',
          message: result.error
        })
      } else {
        addNotification({
          type: 'success',
          message: 'Successfully signed in!'
        })
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to sign in'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-event-blue focus:border-event-blue"
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-event-blue focus:border-event-blue"
          placeholder="Password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-event-blue focus:ring-event-blue border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-event-blue hover:opacity-80 transition-all">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-event-blue hover:bg-event-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-event-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="spinner w-5 h-5"></div>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  )
}