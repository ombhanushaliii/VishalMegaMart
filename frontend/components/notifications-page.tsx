"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/context/NotificationContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, User, MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Notification {
  _id: string
  type: string
  content: string
  isRead: boolean
  createdAt: string
  questionId?: string
  answerId?: string
  sender?: {
    _id: string
    username: string
  }
}

export function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, loading } = useNotifications()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }
    
    // Navigate to the question or answer
    if (notification.questionId) {
      router.push(`/questions/${notification.questionId}`)
    }
  }

  const handleMarkAllAsRead = async () => {
    setLocalLoading(true)
    await markAllAsRead()
    setLocalLoading(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention_question':
        return <MessageSquare className="h-4 w-4" />
      case 'mention_answer':
        return <MessageSquare className="h-4 w-4" />
      case 'answer_on_question':
        return <User className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'mention_question':
        return `${notification.sender?.username} mentioned you in a question`
      case 'mention_answer':
        return `${notification.sender?.username} mentioned you in an answer`
      case 'answer_on_question':
        return `${notification.sender?.username} answered your question`
      default:
        return notification.content
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Please log in to view notifications</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#C9D1D9]">Notifications</h1>
          <p className="text-[#7D8590] mt-1">
            Stay updated with mentions and interactions
          </p>
        </div>
        {notifications.length > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            disabled={localLoading}
            variant="outline"
            className="bg-[#21262D] border-[#30363D] hover:bg-[#262C36] text-[#C9D1D9]"
          >
            {localLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="bg-[#161B22] border-[#21262D]">
            <CardContent className="py-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-[#7D8590] text-lg">No notifications yet</p>
              <p className="text-[#7D8590] text-sm mt-2">
                You'll see notifications here when someone mentions you or interacts with your content
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: Notification) => (
            <Card
              key={notification._id}
              className={cn(
                "cursor-pointer transition-all hover:bg-[#1C2128] bg-[#161B22] border-[#21262D]",
                !notification.isRead && "border-l-4 border-l-blue-500"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.isRead ? "bg-[#21262D]" : "bg-blue-500/20"
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium",
                        notification.isRead ? "text-[#7D8590]" : "text-[#C9D1D9]"
                      )}>
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-sm text-[#7D8590] mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      New
                    </Badge>
                  )}
                </div>
              </CardHeader>
              {notification.content && (
                <CardContent className="pt-0">
                  <p className="text-sm text-[#7D8590] bg-[#0D1117] p-3 rounded-lg border border-[#21262D]">
                    {notification.content}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
