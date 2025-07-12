"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, ArrowDown, MessageSquare, Eye, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportDialog } from "@/components/ui/report-dialog"
import { useQuestions } from "@/context/QuestionContext"
import { useAuth } from "@/context/AuthContext"

interface Question {
  _id: string
  title: string
  description: string
  userId?: {
    _id: string
    username?: string
    avatar?: string
  }
  tags: string[]
  upvotes?: string[]
  downvotes?: string[]
  views?: number
  answerCount?: number
  createdAt: string
}

interface QuestionFeedProps {
  // No props needed since we're using router navigation
}

export function QuestionFeed(props?: QuestionFeedProps) {
  const { questions, fetchQuestions, voteQuestion, loading } = useQuestions()
  const { user } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<"recent" | "answered" | "unanswered">("recent")
  const hasInitialized = useRef(false)

  // Use useEffect with proper dependencies to prevent infinite loops
  useEffect(() => {
    if (!hasInitialized.current) {
      fetchQuestions(1, activeFilter)
      hasInitialized.current = true
    }
  }, []) // Empty dependency array for initial load

  // Separate effect for filter changes
  useEffect(() => {
    if (hasInitialized.current) {
      fetchQuestions(1, activeFilter)
    }
  }, [activeFilter]) // Only depend on activeFilter

  const handleQuestionClick = (questionId: string) => {
    // Use router navigation to go to dynamic route
    router.push(`/questions/${questionId}`)
  }

  const handleVote = async (questionId: string, voteType: 'upvote' | 'downvote', e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      alert('Please log in to vote')
      return
    }
    await voteQuestion(questionId, voteType)
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Function to strip HTML tags for display
  const stripHtml = (html: string): string => {
    if (typeof window === 'undefined') return html
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const getFilterTitle = (): string => {
    switch (activeFilter) {
      case "answered":
        return "Questions with Answers"
      case "unanswered":
        return "Unanswered Questions"
      default:
        return "Recent Questions"
    }
  }

  if (loading && questions.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
        <div className="text-center py-8">
          <p className="text-[#7D8590]">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-[#C9D1D9]">
          {getFilterTitle()}
        </h2>
        
        <div className="flex gap-2 bg-[#161B22] p-1 rounded-lg border border-[#21262D]">
          <Button
            variant={activeFilter === "recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("recent")}
            className={`${
              activeFilter === "recent"
                ? "bg-teal-500 text-white hover:bg-teal-600"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Recent
          </Button>
          <Button
            variant={activeFilter === "answered" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("answered")}
            className={`${
              activeFilter === "answered"
                ? "bg-teal-500 text-white hover:bg-teal-600"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Answered
          </Button>
          <Button
            variant={activeFilter === "unanswered" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("unanswered")}
            className={`${
              activeFilter === "unanswered"
                ? "bg-teal-500 text-white hover:bg-teal-600"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Unanswered
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#7D8590] text-lg mb-2">No questions found</p>
          <p className="text-[#7D8590] text-sm">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {questions.map((question: Question) => (
            <article
              key={question._id}
              className="bg-[#161B22] border border-[#21262D] hover:border-[#30363D] transition-colors cursor-pointer"
              onClick={() => handleQuestionClick(question._id)}
            >
              {/* Post Header */}
              <div className="px-4 py-3 border-b border-[#21262D]/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-[#30363D]">
                    <AvatarImage 
                      src={question.userId?.avatar || "/placeholder.svg"} 
                      alt={question.userId?.username || "Anonymous"} 
                    />
                    <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-sm font-medium">
                      {question.userId?.username?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#C9D1D9] text-sm truncate">
                        {question.userId?.username || "Anonymous"}
                      </span>
                      <span className="text-[#7D8590] text-sm">·</span>
                      <span className="text-[#7D8590] text-sm">
                        {formatTimeAgo(question.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#161B22] border-[#21262D]">
                        <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer text-[#C9D1D9]">
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer text-[#C9D1D9]">
                          Bookmark
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Report Dialog - Outside dropdown to avoid conflicts */}
                    <ReportDialog 
                      contentType="question" 
                      contentId={question._id}
                      triggerClassName="h-8 w-8 p-0 text-[#7D8590] hover:text-red-400 hover:bg-red-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 py-3">
                <h2 className="text-[#C9D1D9] text-lg font-semibold mb-2 leading-snug">
                  {question.title}
                </h2>
                <p className="text-[#7D8590] text-sm leading-relaxed mb-3 line-clamp-3">
                  {stripHtml(question.description)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#21262D] text-[#7D8590] hover:bg-[#30363D] hover:text-[#C9D1D9] border-0 text-xs px-2 py-1 rounded-full font-normal cursor-pointer transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between text-[#7D8590] text-sm">
                  <div className="flex items-center gap-6">
                    {/* Upvote/Downvote */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#7D8590] hover:text-green-400 hover:bg-green-500/10 rounded-full"
                        onClick={(e) => handleVote(question._id, 'upvote', e)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[20px] text-center font-medium">
                        {(question.upvotes?.length || 0) - (question.downvotes?.length || 0)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#7D8590] hover:text-red-400 hover:bg-red-500/10 rounded-full"
                        onClick={(e) => handleVote(question._id, 'downvote', e)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views || 0}</span>
                    </div>

                    {/* Comments/Answers */}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
