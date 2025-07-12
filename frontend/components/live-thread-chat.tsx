"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Users, Radio, Smile, Paperclip, Crown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLiveThreads } from "@/context/LiveThreadContext"
import { useSocket } from "@/context/SocketContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

interface LiveThreadChatProps {
  threadId: string
  onBack: () => void
}

const liveThreads = [
  {
    id: 1,
    title: "React 19 Beta Discussion - New Features and Breaking Changes",
    creator: "alexdev",
    participants: 24,
    topic: "React 19 Beta",
  },
  {
    id: 2,
    title: "Next.js App Router Tips and Best Practices for 2024",
    creator: "sarah_codes",
    participants: 18,
    topic: "Next.js",
  },
]

const chatMessages = [
  {
    id: 1,
    user: "alexdev",
    avatar: "/placeholder.svg?height=32&width=32",
    message:
      "Hey everyone! Welcome to the React 19 Beta discussion. What are your thoughts on the new concurrent features?",
    time: "2:30 PM",
    isCreator: true,
  },
  {
    id: 2,
    user: "sarah_codes",
    avatar: "/placeholder.svg?height=32&width=32",
    message:
      "I've been testing the new use() hook and it's amazing! The automatic batching improvements are really noticeable.",
    time: "2:32 PM",
    isCreator: false,
  },
  {
    id: 3,
    user: "mike_react",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Has anyone run into issues with the new Server Components? I'm seeing some hydration mismatches.",
    time: "2:35 PM",
    isCreator: false,
  },
  {
    id: 4,
    user: "emma_dev",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "The performance improvements are incredible! My app is 30% faster with the new compiler optimizations.",
    time: "2:37 PM",
    isCreator: false,
  },
  {
    id: 5,
    user: "alexdev",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "@mike_react Try updating your React DevTools extension. That fixed the hydration issues for me.",
    time: "2:38 PM",
    isCreator: true,
  },
]

export function LiveThreadChat({ threadId, onBack }: LiveThreadChatProps) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const { 
    currentThread, 
    messages, 
    fetchThreadById, 
    joinThread, 
    sendMessage: sendThreadMessage, 
    markCorrectAnswer,
    addMessage,
    updateParticipantCount
  } = useLiveThreads()
  const { socket, joinThread: socketJoinThread, sendMessage: socketSendMessage } = useSocket()
  const { user } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (threadId) {
      // Fetch thread data
      fetchThreadById(threadId)
      // Join thread via socket
      if (socket && user) {
        socketJoinThread(threadId)
        joinThread(threadId)
      }
    }
  }, [threadId, fetchThreadById, joinThread, socket, user, socketJoinThread])

  // Listen for real-time messages
  useEffect(() => {
    if (socket) {
      socket.on('new-message', (messageData) => {
        addMessage(messageData)
      })

      socket.on('participant-count', (count) => {
        updateParticipantCount(threadId, count)
      })

      socket.on('user-typing', ({ userId, username, isTyping }) => {
        if (userId !== user?.id) {
          setTypingUsers(prev => {
            if (isTyping) {
              return prev.includes(username) ? prev : [...prev, username]
            } else {
              return prev.filter(u => u !== username)
            }
          })
        }
      })

      socket.on('thread-closed', ({ threadId: closedThreadId, convertedQuestionId }) => {
        if (closedThreadId === threadId) {
          // Redirect to the converted question
          router.push(`/questions/${convertedQuestionId}`)
        }
      })

      return () => {
        socket.off('new-message')
        socket.off('participant-count')
        socket.off('user-typing')
        socket.off('thread-closed')
      }
    }
  }, [socket, addMessage, updateParticipantCount, threadId, user?.id, router])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (message.trim() && currentThread) {
      const tempMessage = {
        id: Date.now(),
        userId: user?.id,
        username: user?.username,
        content: message.trim(),
        timestamp: new Date(),
        threadId
      }
      
      // Add message optimistically
      addMessage(tempMessage)
      
      // Send via socket for real-time updates
      socketSendMessage(threadId, message.trim())
      
      // Send to backend
      await sendThreadMessage(threadId, message.trim())
      
      setMessage("")
      setIsTyping(false)
    }
  }

  const handleTyping = (value: string) => {
    setMessage(value)
    
    if (socket && user && currentThread) {
      if (!isTyping && value.trim()) {
        setIsTyping(true)
        socket.emit('typing', {
          threadId,
          userId: user.id,
          username: user.username,
          isTyping: true
        })
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        socket.emit('typing', {
          threadId,
          userId: user.id,
          username: user.username,
          isTyping: false
        })
      }, 1000)
    }
  }

  const handleMarkCorrectAnswer = async (messageId: string) => {
    const result = await markCorrectAnswer(threadId, messageId)
    if (result.success) {
      // Socket will handle the redirect via thread-closed event
    }
  }

  const isCreator = currentThread?.creatorId?._id === user?.id || currentThread?.creatorId === user?.id

  if (!currentThread) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-[#161B22] rounded-t-xl border border-[#21262D] p-4 border-b-0">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#7D8590] hover:text-teal-400 hover:bg-[#21262D] transition-all duration-300 hover:scale-105 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Button>

          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Users className="h-3 w-3 mr-1" />
              {currentThread.participantCount || 0} active
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h1 className="text-lg font-semibold text-[#C9D1D9]">{currentThread.title}</h1>
            <p className="text-sm text-[#7D8590]">
              Started by <span className="text-teal-400">{currentThread.creatorId?.username || 'Unknown'}</span> • Live Chat
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-[#161B22] border-l border-r border-[#21262D]">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg: any) => (
              <div key={msg.id || msg._id} className="flex items-start space-x-3 group">
                <Avatar className="h-8 w-8 border border-[#30363D]">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-xs">
                    {msg.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-sm ${
                      (msg.userId === currentThread.creatorId?._id || msg.userId === currentThread.creatorId) 
                        ? "text-teal-400" 
                        : "text-[#C9D1D9]"
                    }`}>
                      {msg.username || 'Unknown User'}
                    </span>
                    {(msg.userId === currentThread.creatorId?._id || msg.userId === currentThread.creatorId) && (
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs px-1.5 py-0.5">
                        <Crown className="h-3 w-3 mr-1" />
                        Creator
                      </Badge>
                    )}
                    {msg.isMarkedAsAnswer && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1.5 py-0.5">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Answer
                      </Badge>
                    )}
                    <span className="text-xs text-[#7D8590]">
                      {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D] group-hover:border-[#30363D] transition-colors duration-200 relative">
                    <p className="text-[#C9D1D9] text-sm leading-relaxed">{msg.content}</p>
                    
                    {/* Show mark as correct answer button for thread creator */}
                    {isCreator && !currentThread.isClosed && !msg.isMarkedAsAnswer && msg.userId !== user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (window.confirm('Mark this message as the correct answer and close the thread?')) {
                            handleMarkCorrectAnswer(msg.id || msg._id)
                          }
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-green-400 hover:bg-green-500/20"
                        title="Mark as correct answer"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center space-x-2 text-[#7D8590] text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#7D8590] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#7D8590] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#7D8590] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-[#161B22] rounded-b-xl border border-[#21262D] border-t-0 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              placeholder={currentThread.isClosed ? "Thread is closed" : "Type your message..."}
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={currentThread.isClosed}
              className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                disabled={currentThread.isClosed}
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                disabled={currentThread.isClosed}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || currentThread.isClosed}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-[#7D8590]">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${currentThread.isClosed ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`}></div>
            <span>{currentThread.isClosed ? 'Thread Closed' : 'Connected'}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
