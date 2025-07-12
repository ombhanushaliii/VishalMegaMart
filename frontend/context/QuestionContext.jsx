"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

const QuestionContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api/v1'

export const useQuestions = () => {
  const context = useContext(QuestionContext)
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider')
  }
  return context
}

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)

  const createQuestion = useCallback(async (questionData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(questionData)
      })

      const data = await response.json()

      if (response.ok) {
        setQuestions(prev => [data.question, ...prev])
        return { success: true, question: data.question }
      } else {
        return { success: false, error: data.message || 'Failed to create question' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchQuestions = useCallback(async (page = 1, sortBy = 'recent', tagFilter = null) => {
    try {
      setLoading(true)
      let url = `${API_BASE_URL}/questions?page=${page}&sortBy=${sortBy}`
      
      if (tagFilter) {
        url += `&tag=${encodeURIComponent(tagFilter)}`
      }
      
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        if (page === 1) {
          setQuestions(data.questions)
        } else {
          setQuestions(prev => [...prev, ...data.questions])
        }
        return { success: true, data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchQuestionById = useCallback(async (questionId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`)
      const data = await response.json()

      if (response.ok) {
        setCurrentQuestion(data.question)
        return { success: true, question: data.question }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const voteQuestion = useCallback(async (questionId, voteType) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      })

      const data = await response.json()

      if (response.ok) {
        // Update the question in state
        setQuestions(prev => prev.map(q => 
          q._id === questionId 
            ? { ...q, ...data.question }
            : q
        ))
        
        if (currentQuestion && currentQuestion._id === questionId) {
          setCurrentQuestion(prev => ({ ...prev, ...data.question }))
        }
        
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [currentQuestion])

  const searchQuestions = useCallback(async (query, tags = []) => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()
      if (query) searchParams.append('q', query)
      if (tags.length) searchParams.append('tags', tags.join(','))

      const response = await fetch(`${API_BASE_URL}/questions/search?${searchParams}`)
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.questions)
        return { success: true, data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/tags`)
      const data = await response.json()

      if (response.ok) {
        return { success: true, tags: data.tags }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const value = {
    questions,
    currentQuestion,
    loading,
    createQuestion,
    fetchQuestions,
    fetchQuestionById,
    voteQuestion,
    searchQuestions,
    fetchTags,
    setCurrentQuestion
  }

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  )
}

export default QuestionContext