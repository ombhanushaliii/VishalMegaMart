"use client"

import { Bell, MessageSquare, ArrowUp, Heart, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const notifications = [
  {
    id: 1,
    type: "answer",
    icon: MessageSquare,
    title: "New answer on your question",
    description: "Sarah Johnson answered your question about Next.js SSR",
    time: "2 minutes ago",
    isRead: false,
    avatar: "/placeholder.svg?height=40&width=40",
    user: "Sarah Johnson",
  },
  {
    id: 2,
    type: "vote",
    icon: ArrowUp,
    title: "Your answer was upvoted",
    description: "Your answer on 'TypeScript generics' received 5 upvotes",
    time: "1 hour ago",
    isRead: false,
    avatar: null,
    user: null,
  },
  {
    id: 3,
    type: "follow",
    icon: Heart,
    title: "New follower",
    description: "Mike Rodriguez started following you",
    time: "3 hours ago",
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
    user: "Mike Rodriguez",
  },
  {
    id: 4,
    type: "badge",
    icon: Award,
    title: "Badge earned",
    description: "You earned the 'Helpful Contributor' badge",
    time: "1 day ago",
    isRead: true,
    avatar: null,
    user: null,
  },
  {
    id: 5,
    type: "mention",
    icon: Users,
    title: "You were mentioned",
    description: "Alex Chen mentioned you in a comment",
    time: "2 days ago",
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
    user: "Alex Chen",
  },
  {
    id: 6,
    type: "answer",
    icon: MessageSquare,
    title: "Question answered",
    description: "Your question about CSS Grid received a new answer",
    time: "3 days ago",
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
    user: "Emma Wilson",
  },
]

export function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-[#C9D1D9]">Notifications</h1>
          {unreadCount > 0 && <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{unreadCount} new</Badge>}
        </div>
        <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-teal-400 transition-all duration-200">
          Mark all as read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-[#161B22] rounded-xl border p-4 transition-all duration-300 cursor-pointer hover:border-[#30363D] hover:scale-[1.01] ${
              !notification.isRead ? "border-teal-500/30 bg-teal-500/5" : "border-[#21262D]"
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  notification.type === "answer"
                    ? "bg-blue-500/20 text-blue-400"
                    : notification.type === "vote"
                      ? "bg-green-500/20 text-green-400"
                      : notification.type === "follow"
                        ? "bg-pink-500/20 text-pink-400"
                        : notification.type === "badge"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-purple-500/20 text-purple-400"
                }`}
              >
                <notification.icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#C9D1D9] mb-1">{notification.title}</h3>
                    <p className="text-sm text-[#7D8590] mb-2">{notification.description}</p>
                    <div className="flex items-center space-x-3">
                      {notification.user && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-xs">
                              {notification.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-[#7D8590]">{notification.user}</span>
                        </div>
                      )}
                      <span className="text-xs text-[#7D8590]">{notification.time}</span>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-2"></div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] hover:text-teal-400 bg-transparent transition-all duration-200 hover:scale-105"
        >
          Load More Notifications
        </Button>
      </div>
    </div>
  )
}
