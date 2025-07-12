"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

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

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      // Simulate API call - in real app, this would be an actual API call
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => 
        (u.email === credentials.emailOrUsername || u.username === credentials.emailOrUsername) && 
        u.password === credentials.password
      )
      
      if (user) {
        const { password, ...userWithoutPassword } = user
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        return { success: true }
      } else {
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = users.find(u => u.email === userData.email || u.username === userData.username)
      
      if (existingUser) {
        return { success: false, error: 'User already exists' }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        needsOnboarding: true
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      // Auto-login after registration
      const { password, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  const completeOnboarding = (onboardingData) => {
    const updatedUser = { ...user, ...onboardingData, needsOnboarding: false }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...onboardingData, needsOnboarding: false }
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const checkUsernameAvailability = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    return !users.some(u => u.username === username)
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