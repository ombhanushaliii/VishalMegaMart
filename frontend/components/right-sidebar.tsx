"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLiveThreads } from "@/context/LiveThreadContext"
import { useSocket } from "@/context/SocketContext"

const liveThreads = [
  {
    id: 1,
    title: "React 19 Beta Discussion - New Features and Breaking Changes",
    creator: "alexdev",
    isLive: true,
    participants: 24,
  },
  {
    id: 2,
    title: "Next.js App Router Tips and Best Practices for 2024",
    creator: "sarah_codes",
    isLive: true,
    participants: 18,
  },
  {
    id: 3,
    title: "TypeScript Best Practices and Advanced Patterns",
    creator: "mike_ts",
    isLive: true,
    participants: 31,
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox - When to Use What",
    creator: "design_guru",
    isLive: true,
    participants: 12,
  },
  {
    id: 5,
    title: "Database Optimization Techniques for High Performance",
    creator: "db_expert",
    isLive: true,
    participants: 8,
  },
  {
    id: 6,
    title: "Vue 3 Composition API Deep Dive",
    creator: "vue_master",
    isLive: true,
    participants: 15,
  },
  {
    id: 7,
    title: "GraphQL vs REST APIs - Architecture Decisions",
    creator: "api_guru",
    isLive: true,
    participants: 22,
  },
  {
    id: 8,
    title: "Docker Best Practices for Production Deployments",
    creator: "devops_pro",
    isLive: true,
    participants: 19,
  },
  {
    id: 9,
    title: "Python Performance Optimization Tips and Tricks",
    creator: "python_dev",
    isLive: true,
    participants: 14,
  },
  {
    id: 10,
    title: "AWS Architecture Patterns for Scalable Applications",
    creator: "cloud_architect",
    isLive: true,
    participants: 27,
  },
]

interface RightSidebarProps {
  onLiveThreadSelect: (threadId: string) => void
}

export function RightSidebar({ onLiveThreadSelect }: RightSidebarProps) {
  const { liveThreads, fetchLiveThreads, updateParticipantCount } = useLiveThreads()
  const { socket } = useSocket()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true)
      await fetchLiveThreads()
      setLoading(false)
    }
    
    loadThreads()
  }, [fetchLiveThreads])

  // Listen for participant count updates
  useEffect(() => {
    if (socket) {
      socket.on('participant-count', (data) => {
        // Update participant count for specific thread
        // This would need threadId to be passed with the data
      })

      return () => {
        socket.off('participant-count')
      }
    }
  }, [socket, updateParticipantCount])
  return (
    <aside className="hidden lg:block fixed top-16 right-0 2xl:w-96 xl:w-80 lg:w-72 h-[calc(100vh-4rem)] bg-[#0D1117] border-l border-[#21262D]">
      <div className="flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-[#21262D]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#C9D1D9]">Live Threads</h2>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Live</Badge>
          </div>
          <p className="text-sm text-[#7D8590]">Join real-time discussions with the community</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full live-threads-sidebar">
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : liveThreads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#7D8590] text-sm">No active threads</p>
                  <p className="text-[#7D8590] text-xs mt-1">Start a discussion to see it here</p>
                </div>
              ) : (
                liveThreads.map((thread: any) => (
                  <div
                    key={thread._id}
                    onClick={() => onLiveThreadSelect(thread._id)}
                    className="p-5 rounded-xl bg-[#161B22] border border-[#21262D] hover:border-[#30363D] cursor-pointer group transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium text-[#C9D1D9] text-sm leading-tight group-hover:text-teal-400 line-clamp-2 transition-colors">
                        {thread.title}
                      </h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs ml-3 flex-shrink-0 animate-pulse">
                        Live
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-7 w-7 border border-[#30363D]">
                          <AvatarImage src="/placeholder.svg?height=28&width=28" />
                          <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-xs">
                            {thread.creatorId?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-xs text-[#C9D1D9] font-medium">
                            {thread.creatorId?.username || 'Unknown'}
                          </span>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-[#7D8590]">
                              {thread.participantCount || 0} active
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onLiveThreadSelect(thread._id)
                        }}
                        className="h-7 px-4 text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 rounded-full transition-all duration-300 hover:scale-105"
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  )
}
