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
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#C9D1D9]">
          {activeFilter === "most-answered"
            ? "Most Answered Questions"
            : activeFilter === "unanswered"
              ? "Unanswered Questions"
              : "Recent Questions"}
        </h2>
        <div className="flex gap-1 bg-[#161B22] rounded-lg p-1 border border-[#21262D]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("recent")}
            className={
              activeFilter === "recent"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            }
          >
            Recent
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("most-answered")}
            className={
              activeFilter === "most-answered"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            }
          >
            Most Answered
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter("unanswered")}
            className={
              activeFilter === "unanswered"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md"
                : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded-md"
            }
          >
            Unanswered
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-[#161B22] rounded-xl border border-[#21262D] p-6 hover:border-[#30363D] transition-all duration-300 group cursor-pointer hover:shadow-lg hover:scale-[1.01]"
            onClick={() => onQuestionSelect?.(question.id)}
          >
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-[#30363D] transition-all duration-300 group-hover:border-teal-400">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.name} />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9]">
                    {question.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-[#C9D1D9]">{question.author.name}</p>
                  <p className="text-sm text-[#7D8590]">Asked {question.timeAgo} • Development</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#7D8590] hover:text-teal-400 transition-all duration-200 hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Follow
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] transition-all duration-200 hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-[#161B22] border-[#30363D] text-[#C9D1D9] animate-in slide-in-from-top-2 duration-200"
                    align="end"
                  >
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer transition-colors duration-200">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer transition-colors duration-200">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#21262D] cursor-pointer text-red-400 transition-colors duration-200">
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Question Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2 group-hover:text-teal-400 transition-colors duration-300">
                {question.title}
              </h3>
              <p className="text-[#7D8590] leading-relaxed">{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Voting */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#7D8590] hover:text-green-400 hover:bg-green-500/10 p-1 transition-all duration-200 hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-[#C9D1D9] min-w-[2rem] text-center">
                    {question.stats.votes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#7D8590] hover:text-red-400 hover:bg-red-500/10 p-1 transition-all duration-200 hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-[#7D8590]">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.stats.answers} answers</span>
                  </div>
                </div>
              </div>

              {/* Answer Button */}
              <Button
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                Answer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 pt-6 pb-8">
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] bg-teal-500/20 text-teal-400 border-teal-500/30"
        >
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105"
        >
          2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] bg-transparent transition-all duration-200 hover:scale-105"
        >
          3
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] hover:text-teal-400 bg-transparent transition-all duration-200 hover:scale-105"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
