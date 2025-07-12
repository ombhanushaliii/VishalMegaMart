"use client"

import { useState } from "react"
import { ArrowLeft, Send, Users, Radio, Smile, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LiveThreadChatProps {
  threadId: number
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

  const thread = liveThreads.find((t) => t.id === threadId) || liveThreads[0]

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", message)
      setMessage("")
    }
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
              {thread.participants} active
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h1 className="text-lg font-semibold text-[#C9D1D9]">{thread.title}</h1>
            <p className="text-sm text-[#7D8590]">
              Started by <span className="text-teal-400">{thread.creator}</span> • Live Chat
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-[#161B22] border-l border-r border-[#21262D]">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3 group">
                <Avatar className="h-8 w-8 border border-[#30363D]">
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-xs">
                    {msg.user.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-sm ${msg.isCreator ? "text-teal-400" : "text-[#C9D1D9]"}`}>
                      {msg.user}
                    </span>
                    {msg.isCreator && (
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs px-1.5 py-0.5">
                        Creator
                      </Badge>
                    )}
                    <span className="text-xs text-[#7D8590]">{msg.time}</span>
                  </div>

                  <div className="bg-[#0D1117] rounded-lg p-3 border border-[#21262D] group-hover:border-[#30363D] transition-colors duration-200">
                    <p className="text-[#C9D1D9] text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-[#161B22] rounded-b-xl border border-[#21262D] border-t-0 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
