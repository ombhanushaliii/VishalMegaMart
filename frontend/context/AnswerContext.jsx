"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

const AnswerContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api/v1'

export const useAnswers = () => {
  const context = useContext(AnswerContext)
  if (!context) {
    throw new Error('useAnswers must be used within an AnswerProvider')
  }
  return context
}

export const AnswerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const createAnswer = useCallback(async (answerData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: 'Please login to submit an answer' }
      }

      const response = await fetch(`${API_BASE_URL}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(answerData)
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, answer: data.answer, message: 'Answer submitted successfully' }
      } else {
        return { success: false, error: data.message || 'Failed to submit answer' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const getAnswersByQuestionId = useCallback(async (questionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/question/${questionId}`)
      const data = await response.json()

      if (response.ok) {
        return { success: true, answers: data.answers || [] }
      } else {
        return { success: false, error: data.message || 'Failed to fetch answers' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const voteAnswer = useCallback(async (answerId, voteType) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: 'Please login to vote' }
      }

      const response = await fetch(`${API_BASE_URL}/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: 'Vote recorded successfully' }
      } else {
        return { success: false, error: data.message || 'Failed to vote' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const acceptAnswer = useCallback(async (answerId) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return { success: false, error: 'Please login to accept answer' }
      }

      const response = await fetch(`${API_BASE_URL}/answers/${answerId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: 'Answer accepted successfully' }
      } else {
        return { success: false, error: data.message || 'Failed to accept answer' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const value = {
    loading,
    createAnswer,
    getAnswersByQuestionId,
    voteAnswer,
    acceptAnswer
  }

  return (
    <AnswerContext.Provider value={value}>
      {children}
    </AnswerContext.Provider>
  )
}

export default AnswerContext
