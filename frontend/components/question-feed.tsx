"use client"

import { useState } from "react"
import { MessageSquare, ArrowUp, ArrowDown, Share, Bookmark, MoreHorizontal, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface QuestionFeedProps {
  onQuestionSelect?: (questionId: number) => void
}

const questions = [
  {
    id: 1,
    title: "How to implement server-side rendering with Next.js 14?",
    content:
      "I'm trying to understand the best practices for SSR in Next.js 14. What are the key differences from previous versions and how should I structure my components?",
    author: {
      name: "Alex Chen",
      username: "alexdev",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["nextjs", "ssr", "react"],
    stats: {
      votes: 24,
      answers: 8,
    },
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "TypeScript generic constraints not working as expected",
    content:
      "I'm having trouble with TypeScript generic constraints. The compiler isn't inferring types correctly when I use extends with conditional types...",
    author: {
      name: "Sarah Johnson",
      username: "sarah_codes",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["typescript", "generics", "types"],
    stats: {
      votes: 18,
      answers: 5,
    },
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Best practices for CSS Grid vs Flexbox in 2024?",
    content:
      "When should I choose CSS Grid over Flexbox and vice versa? Are there any new features or best practices I should be aware of?",
    author: {
      name: "Mike Rodriguez",
      username: "mike_design",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["css", "grid", "flexbox", "layout"],
    stats: {
      votes: 31,
      answers: 12,
    },
    timeAgo: "6 hours ago",
  },
  {
    id: 4,
    title: "React 19 concurrent features causing memory leaks",
    content:
      "After upgrading to React 19, I'm noticing memory leaks in my application. Has anyone else experienced this with the new concurrent features?",
    author: {
      name: "Emma Wilson",
      username: "emma_react",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["react", "memory-leaks", "concurrent", "performance"],
    stats: {
      votes: 42,
      answers: 15,
    },
    timeAgo: "8 hours ago",
  },
  {
    id: 5,
    title: "How to optimize database queries in PostgreSQL?",
    content:
      "I'm working with a large dataset and my queries are becoming slow. What are the best practices for optimizing PostgreSQL queries?",
    author: {
      name: "David Kim",
      username: "db_wizard",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["postgresql", "database", "optimization", "sql"],
    stats: {
      votes: 28,
      answers: 9,
    },
    timeAgo: "10 hours ago",
  },
]

export function QuestionFeed({ onQuestionSelect }: QuestionFeedProps) {
  const [activeFilter, setActiveFilter] = useState<"recent" | "most-answered" | "unanswered">("recent")

  const getFilteredQuestions = () => {
    switch (activeFilter) {
      case "most-answered":
        return [...questions].sort((a, b) => b.stats.answers - a.stats.answers)
      case "unanswered":
        return questions.filter((q) => q.stats.answers === 0)
      default:
        return questions
    }
  }

  const filteredQuestions = getFilteredQuestions()

  return (
    <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-[#C9D1D9]">
          {activeFilter === "most-answered"
            ? "Most Answered Questions"
            : activeFilter === "unanswered"
              ? "Unanswered Questions"
              : "Recent Questions"}
        </h2>
        <div className="flex gap-1 bg-[#161B22] rounded-lg p-1 border border-[#21262D] w-full sm:w-auto overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("recent")}
            className={`${
              activeFilter === "recent"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Recent
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("most-answered")}
            className={`${
              activeFilter === "most-answered"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Most Answered
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("unanswered")}
            className={`${
              activeFilter === "unanswered"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            } text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
          >
            Unanswered
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredQuestions.map((question) => (
          <article
            key={question.id}
            className="bg-[#161B22] border border-[#21262D] hover:border-[#30363D] transition-colors cursor-pointer"
            onClick={() => onQuestionSelect?.(question.id)}
          >
            {/* Post Header */}
            <div className="px-4 py-3 border-b border-[#21262D]/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-[#30363D]">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.username} />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-sm font-medium">
                    {question.author.username
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#C9D1D9] text-sm truncate">@{question.author.username}</span>
                    <span className="text-[#7D8590] text-sm">·</span>
                    <span className="text-[#7D8590] text-sm">{question.timeAgo}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-[#161B22] border-[#30363D] text-[#C9D1D9]"
                    align="end"
                  >
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer text-red-400">
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 py-3">
              <h2 className="text-[#C9D1D9] text-lg font-semibold mb-2 leading-snug">
                {question.title}
              </h2>
              <p className="text-[#7D8590] text-sm leading-relaxed mb-3 line-clamp-3">
                {question.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge
                    key={tag}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">{question.stats.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#7D8590] hover:text-red-400 hover:bg-red-500/10 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-2 hover:text-[#C9D1D9] cursor-pointer transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.stats.answers}</span>
                  </div>

                  {/* Share */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>

                {/* Save */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 pt-4 sm:pt-6 pb-6 sm:pb-8 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
        >
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
        >
          2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
        >
          3
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] hover:text-teal-400 bg-transparent transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
