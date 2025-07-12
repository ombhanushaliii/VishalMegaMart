"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

const LiveThreadContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api/v1'

export const useLiveThreads = () => {
  const context = useContext(LiveThreadContext)
  if (!context) {
    throw new Error('useLiveThreads must be used within a LiveThreadProvider')
  }
  return context
}

export const LiveThreadProvider = ({ children }) => {
  const [liveThreads, setLiveThreads] = useState([])
  const [currentThread, setCurrentThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const createLiveThread = useCallback(async (threadData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/live-threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(threadData)
      })

      const data = await response.json()

      if (response.ok) {
        setLiveThreads(prev => [data.thread, ...prev])
        return { success: true, thread: data.thread }
      } else {
        return { success: false, error: data.message || 'Failed to create live thread' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLiveThreads = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/live-threads?page=${page}`)
      const data = await response.json()

      if (response.ok) {
        if (page === 1) {
          setLiveThreads(data.threads)
        } else {
          setLiveThreads(prev => [...prev, ...data.threads])
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

  const fetchThreadById = useCallback(async (threadId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/live-threads/${threadId}`)
      const data = await response.json()

      if (response.ok) {
        setCurrentThread(data.thread)
        setMessages(data.messages)
        return { success: true, thread: data.thread, messages: data.messages }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const joinThread = useCallback(async (threadId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/live-threads/${threadId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, thread: data.thread }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const sendMessage = useCallback(async (threadId, content) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/live-threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const markCorrectAnswer = useCallback(async (threadId, messageId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/live-threads/${threadId}/close/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, questionId: data.questionId }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const updateParticipantCount = useCallback((threadId, count) => {
    setLiveThreads(prev => 
      prev.map(thread => 
        thread._id === threadId 
          ? { ...thread, participantCount: count }
          : thread
      )
    )
    
    if (currentThread && currentThread._id === threadId) {
      setCurrentThread(prev => ({ ...prev, participantCount: count }))
    }
  }, [currentThread])

  return (
    <LiveThreadContext.Provider
      value={{
        liveThreads,
        currentThread,
        messages,
        loading,
        createLiveThread,
        fetchLiveThreads,
        fetchThreadById,
        joinThread,
        sendMessage,
        markCorrectAnswer,
        addMessage,
        updateParticipantCount,
        setCurrentThread,
        setMessages
      }}
    >
      {children}
    </LiveThreadContext.Provider>
  )
}
