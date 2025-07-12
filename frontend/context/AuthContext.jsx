"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api/v1'

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run after we're on the client side
    if (!isClient) return

    // Check if user is logged in on app load
    const token = safeLocalStorage.getItem('token')
    if (token) {
      fetchUserProfile(token)
    } else {
      setLoading(false)
    }
  }, [isClient])

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        safeLocalStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      safeLocalStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        safeLocalStorage.setItem('token', data.token)
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        safeLocalStorage.setItem('token', data.token)
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const completeOnboarding = async (onboardingData) => {
    try {
      const token = safeLocalStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/user/complete-onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Onboarding failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      const token = safeLocalStorage.getItem('token')
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      safeLocalStorage.removeItem('token')
    }
  }

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/check-username/${username}`)
      const data = await response.json()
      return data.available
    } catch (error) {
      console.error('Error checking username:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    completeOnboarding,
    checkUsernameAvailability,
    isAuthenticated: !!user,
    needsOnboarding: user?.needsOnboarding || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext