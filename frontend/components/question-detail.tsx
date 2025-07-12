"use client"

import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Share, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { HtmlRenderer } from "@/components/ui/html-renderer"

interface QuestionDetailProps {
  questionId: number
  onBack: () => void
}

export function QuestionDetail({ questionId, onBack }: QuestionDetailProps) {
  // Mock question data - in real app, this would be fetched based on questionId
  const question = {
    id: questionId,
    title: "How to implement server-side rendering with Next.js 14?",
    content: `I'm trying to understand the best practices for SSR in Next.js 14. What are the key differences from previous versions and how should I structure my components?

I've been working with Next.js 13 for a while, but I'm having trouble understanding the new App Router and how it affects server-side rendering. Specifically:

1. How do I properly implement SSR with the new App Router?
2. What are the performance implications compared to the Pages Router?
3. Are there any breaking changes I should be aware of?

Here's what I've tried so far:

\`\`\`javascript
// app/page.js
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const result = await data.json()
  
  return (
    <div>
      <h1>My Page</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
\`\`\`

But I'm not sure if this is the correct approach. Any guidance would be appreciated!`,
    author: {
      name: "Alex Chen",
      username: "alexdev",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 1250,
    },
    tags: ["nextjs", "ssr", "react", "app-router"],
    stats: {
      votes: 24,
      answers: 8,
    },
    timeAgo: "2 hours ago",
    answers: [
      {
        id: 1,
        content: `Great question! The App Router in Next.js 14 does change how SSR works. Here's what you need to know:

## Key Differences

1. **Server Components by Default**: In the App Router, components are Server Components by default, which means they run on the server.

2. **Data Fetching**: You can fetch data directly in Server Components using async/await, just like you showed in your example.

3. **Streaming**: The App Router supports streaming, which can improve perceived performance.

Your code example is actually correct! Here's an enhanced version:

\`\`\`javascript
// app/page.js
import { Suspense } from 'react'

async function DataComponent() {
  const data = await fetch('https://api.example.com/data', {
    // Add caching options
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  const result = await data.json()
  
  return <pre>{JSON.stringify(result, null, 2)}</pre>
}

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent />
      </Suspense>
    </div>
  )
}
\`\`\`

## Performance Benefits

- **Reduced JavaScript Bundle**: Server Components don't add to the client bundle
- **Better SEO**: Content is rendered on the server
- **Streaming**: Parts of the page can load progressively

Hope this helps!`,
        author: {
          name: "Sarah Johnson",
          username: "sarah_codes",
          avatar: "/placeholder.svg?height=40&width=40",
          reputation: 2840,
        },
        votes: 15,
        timeAgo: "1 hour ago",
        isAccepted: true,
      },
      {
        id: 2,
        content: `I'd like to add to Sarah's excellent answer. Here are some additional considerations:

## Migration Tips

If you're migrating from Pages Router to App Router:

1. **Layout Changes**: Use \`layout.js\` files instead of \`_app.js\`
2. **Error Handling**: Use \`error.js\` files for error boundaries
3. **Loading States**: Use \`loading.js\` files for loading UI

## Common Pitfalls

- Don't forget to mark client-side components with \`'use client'\`
- Be careful with environment variables in Server Components
- Remember that Server Components can't use browser APIs

Let me know if you need more specific examples!`,
        author: {
          name: "Mike Rodriguez",
          username: "mike_nextjs",
          avatar: "/placeholder.svg?height=40&width=40",
          reputation: 1890,
        },
        votes: 8,
        timeAgo: "45 minutes ago",
        isAccepted: false,
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-[#7D8590] hover:text-teal-400 hover:bg-[#161B22] mb-4 transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Questions
      </Button>

      {/* Question */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6 transition-all duration-300 hover:border-[#30363D]">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-[#30363D] transition-all duration-300 hover:border-teal-400">
              <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.username} />
              <AvatarFallback className="bg-[#21262D] text-[#C9D1D9]">
                {question.author.username
                  .substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-[#C9D1D9]">@{question.author.username}</p>
              <p className="text-sm text-[#7D8590]">
                {question.author.reputation} reputation • Asked {question.timeAgo}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#7D8590] hover:text-teal-400 transition-all duration-200 hover:scale-105"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#7D8590] hover:text-teal-400 transition-all duration-200 hover:scale-105"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Bookmark
            </Button>
          </div>
        </div>

        {/* Question Title */}
        <h1 className="text-2xl font-bold text-[#C9D1D9] mb-4">{question.title}</h1>

        {/* Question Content */}
        <HtmlRenderer 
          content={question.content} 
          className="mb-6"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Question Stats and Actions */}
        <div className="flex items-center justify-between border-t border-[#21262D] pt-4">
          <div className="flex items-center space-x-6">
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7D8590] hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 hover:scale-110"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium text-[#C9D1D9]">{question.stats.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7D8590] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110"
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
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#C9D1D9]">
          {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
        </h2>

        {question.answers.map((answer) => (
          <div
            key={answer.id}
            className={`bg-[#161B22] rounded-xl border p-6 transition-all duration-300 ${
              answer.isAccepted
                ? "border-green-500/30 bg-green-500/5 hover:border-green-500/50"
                : "border-[#21262D] hover:border-[#30363D]"
            }`}
          >
            {answer.isAccepted && (
              <div className="flex items-center mb-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  ✓ Accepted Answer
                </Badge>
              </div>
            )}

            {/* Answer Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-[#30363D] transition-all duration-300 hover:border-teal-400">
                  <AvatarImage src={answer.author.avatar || "/placeholder.svg"} alt={answer.author.username} />
                  <AvatarFallback className="bg-[#21262D] text-[#C9D1D9]">
                    {answer.author.username
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-[#C9D1D9]">@{answer.author.username}</p>
                  <p className="text-sm text-[#7D8590]">
                    {answer.author.reputation} reputation • Answered {answer.timeAgo}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Content */}
            <HtmlRenderer 
              content={answer.content} 
              className="mb-4"
            />

            {/* Answer Actions */}
            <div className="flex items-center space-x-4 border-t border-[#21262D] pt-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#7D8590] hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 hover:scale-110"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-[#C9D1D9]">{answer.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#7D8590] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7D8590] hover:text-teal-400 transition-all duration-200 hover:scale-105"
              >
                Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7D8590] hover:text-teal-400 transition-all duration-200 hover:scale-105"
              >
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Answer */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6 transition-all duration-300 hover:border-[#30363D]">
        <h3 className="text-lg font-semibold text-[#C9D1D9] mb-4">Your Answer</h3>
        <Textarea
          placeholder="Write your answer here..."
          className="min-h-32 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 mb-4 transition-all duration-300"
        />
        <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Post Your Answer
        </Button>
      </div>
    </div>
  )
}
