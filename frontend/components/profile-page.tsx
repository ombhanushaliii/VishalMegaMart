"use client"

import { useState, useEffect } from "react"
import { User, Calendar, MessageSquare, ArrowUp, FileText, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

interface UserStats {
  questionsAsked: number
  answersProvided: number
  totalUpvotes: number
  recentQuestions: Array<{
    _id: string
    title: string
    createdAt: string
  }>
  recentAnswers: Array<{
    _id: string
    questionId: {
      _id: string
      title: string
    }
    createdAt: string
  }>
}

export function ProfilePage() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return

      try {
        const token = localStorage.getItem('token')
        const response = await fetch('https://vishalmegamart.onrender.com/api/v1/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#7D8590]">Please log in to view your profile</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-[#30363D]">
            <AvatarImage src="/placeholder.svg" alt={user.username} />
            <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Details */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-[#C9D1D9]">{user.username}</h1>
              <p className="text-[#7D8590] flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {formatDate(user.createdAt || new Date().toISOString())}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <Card className="bg-[#0D1117] border-[#21262D]">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 text-blue-400 mb-2" />
                    <p className="text-2xl font-bold text-[#C9D1D9]">
                      {userStats?.questionsAsked || 0}
                    </p>
                    <p className="text-sm text-[#7D8590]">Questions Asked</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0D1117] border-[#21262D]">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-[#C9D1D9]">
                      {userStats?.answersProvided || 0}
                    </p>
                    <p className="text-sm text-[#7D8590]">Answers Given</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0D1117] border-[#21262D]">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <ArrowUp className="h-8 w-8 text-orange-400 mb-2" />
                    <p className="text-2xl font-bold text-[#C9D1D9]">
                      {userStats?.totalUpvotes || 0}
                    </p>
                    <p className="text-sm text-[#7D8590]">Upvotes Received</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0D1117] border-[#21262D]">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Trophy className="h-8 w-8 text-yellow-400 mb-2" />
                    <p className="text-2xl font-bold text-[#C9D1D9]">
                      {((userStats?.questionsAsked || 0) + (userStats?.answersProvided || 0)) * 10}
                    </p>
                    <p className="text-sm text-[#7D8590]">Reputation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardHeader>
            <CardTitle className="text-[#C9D1D9] flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-400" />
              Recent Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStats?.recentQuestions && userStats.recentQuestions.length > 0 ? (
              <div className="space-y-3">
                {userStats.recentQuestions.map((question) => (
                  <div key={question._id} className="border-b border-[#21262D] pb-3 last:border-b-0">
                    <h3 className="text-[#C9D1D9] text-sm font-medium truncate">
                      {question.title}
                    </h3>
                    <p className="text-[#7D8590] text-xs mt-1">
                      {formatDate(question.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7D8590] text-center py-8">No questions asked yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Answers */}
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardHeader>
            <CardTitle className="text-[#C9D1D9] flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
              Recent Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStats?.recentAnswers && userStats.recentAnswers.length > 0 ? (
              <div className="space-y-3">
                {userStats.recentAnswers.map((answer) => (
                  <div key={answer._id} className="border-b border-[#21262D] pb-3 last:border-b-0">
                    <h3 className="text-[#C9D1D9] text-sm font-medium truncate">
                      {answer.questionId.title}
                    </h3>
                    <p className="text-[#7D8590] text-xs mt-1">
                      Answered {formatDate(answer.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7D8590] text-center py-8">No answers provided yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
