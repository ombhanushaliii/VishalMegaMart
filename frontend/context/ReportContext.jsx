"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

const ReportContext = createContext()
const API_BASE_URL = 'https://vishalmegamart.onrender.com/api/v1'

export const useReports = () => {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider')
  }
  return context
}

export const ReportProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const submitReport = useCallback(async (reportData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: 'Please login to submit a report' }
      }

      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: 'Report submitted successfully' }
      } else {
        return { success: false, error: data.message || 'Failed to submit report' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    loading,
    submitReport
  }

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  )
}

export default ReportContext
