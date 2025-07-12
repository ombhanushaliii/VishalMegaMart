"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

// Import Socket.IO dynamically only on client side
let io: any = null
if (typeof window !== 'undefined') {
  io = require('socket.io-client').io
}

interface SocketContextType {
  socket: any | null
  isConnected: boolean
  joinThread: (threadId: string) => void
  leaveThread: () => void
  sendMessage: (threadId: string, message: string) => void
  currentThreadId: string | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    // Only initialize socket on client side
    if (typeof window !== 'undefined' && user && io) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
      })

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server')
        setIsConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user])

  const joinThread = (threadId: string) => {
    if (socket && user) {
      socket.emit('join-thread', {
        threadId,
        userId: user.id
      })
      setCurrentThreadId(threadId)
    }
  }

  const leaveThread = () => {
    if (currentThreadId) {
      setCurrentThreadId(null)
    }
  }

  const sendMessage = (threadId: string, message: string) => {
    if (socket && user) {
      socket.emit('thread-message', {
        threadId,
        message,
        userId: user.id,
        username: user.username
      })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinThread,
        leaveThread,
        sendMessage,
        currentThreadId
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
