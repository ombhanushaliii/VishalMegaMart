"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Users, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SimpleThreadChatProps {
  threadId: string
  onBack: () => void
}

// Mock data for now - this will be replaced with real data
const mockThread = {
  _id: "1",
  title: "React 19 Beta Discussion - New Features and Breaking Changes",
  creatorId: { _id: "user1", username: "alexdev" },
  participantCount: 5,
  isClosed: false
}

const mockMessages = [
  {
    _id: "1",
    userId: "user1",
    username: "alexdev",
    content: "Welcome to the React 19 discussion! What are your thoughts on the new features?",
    createdAt: new Date(),
    isMarkedAsAnswer: false
  },
  {
    _id: "2", 
    userId: "user2",
    username: "sarah_codes",
    content: "The new concurrent features look amazing! Has anyone tested them in production?",
    createdAt: new Date(),
    isMarkedAsAnswer: false
  }
]

export function SimpleThreadChat({ threadId, onBack }: SimpleThreadChatProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        _id: Date.now().toString(),
        userId: "current-user",
        username: "You",
        content: message.trim(),
        createdAt: new Date(),
        isMarkedAsAnswer: false
      }
      setMessages(prev => [...prev, newMessage])
      setMessage("")
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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
              {mockThread.participantCount} active
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h1 className="text-lg font-semibold text-[#C9D1D9]">{mockThread.title}</h1>
            <p className="text-sm text-[#7D8590]">
              Started by <span className="text-teal-400">{mockThread.creatorId.username}</span> • Live Chat
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-[#161B22] border-l border-r border-[#21262D]">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="flex items-start space-x-3 group">
                <Avatar className="h-8 w-8 border border-[#30363D]">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-xs">
                    {msg.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-sm ${
                      msg.userId === mockThread.creatorId._id ? "text-teal-400" : "text-[#C9D1D9]"
                    }`}>
                      {msg.username}
                    </span>
                    {msg.userId === mockThread.creatorId._id && (
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs px-1.5 py-0.5">
                        Creator
                      </Badge>
                    )}
                    <span className="text-xs text-[#7D8590]">
                      {msg.createdAt.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D] group-hover:border-[#30363D] transition-colors duration-200">
                    <p className="text-[#C9D1D9] text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-[#161B22] rounded-b-xl border border-[#21262D] border-t-0 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-[#7D8590]">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </span>
        </div>
      </div>
    </div>
  )
}
