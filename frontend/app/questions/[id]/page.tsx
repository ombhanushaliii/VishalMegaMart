"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Share, Bookmark, CheckCircle, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ReportDialog } from "@/components/ui/report-dialog"
import { HtmlRenderer } from "@/components/ui/html-renderer"
import { QuillEditor } from "@/components/ui/quill-editor"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ShareComponent } from "@/components/ui/share-component"
import { useAuth } from '@/context/AuthContext'

interface User {
  _id: string
  username: string
  email?: string
  avatar?: string
}

interface Question {
  _id: string
  title: string
  description: string
  userId: User
  tags: string[]
  upvotes: string[]
  downvotes: string[]
  views: number
  topAnswerId?: string
  createdAt: string
  updatedAt: string
}

interface Answer {
  _id: string
  questionId: string
  userId: User
  answer: string
  upvotes: string[]
  downvotes: string[]
  isAccepted: boolean
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = 'https://vishalmegamart.onrender.com/api/v1'

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const questionId = params.id as string

  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails()
      fetchAnswers()
    }
  }, [questionId])

  const fetchQuestionDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`)
      const data = await response.json()
      
      if (response.ok) {
        setQuestion(data.question)
      } else {
        setError(data.message || 'Failed to fetch question')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/question/${questionId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnswers(data.answers || [])
      } else {
        console.error('Failed to fetch answers:', data.message)
      }
    } catch (error) {
      console.error('Network error fetching answers')
    } finally {
      setLoading(false)
    }
  }

  const handleVoteQuestion = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('Please log in to vote')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      })

      if (response.ok) {
        fetchQuestionDetails() // Refresh question data
      }
    } catch (error) {
      console.error('Error voting on question:', error)
    }
  }

  const handleVoteAnswer = async (answerId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('Please log in to vote')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      })

      if (response.ok) {
        fetchAnswers() // Refresh answers
      }
    } catch (error) {
      console.error('Error voting on answer:', error)
    }
  }

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || !question || question.userId._id !== user.id) {
      alert('Only the question owner can accept answers')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/answers/${answerId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchAnswers() // Refresh answers
        fetchQuestionDetails() // Refresh question to get updated topAnswerId
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to accept answer')
      }
    } catch (error) {
      console.error('Error accepting answer:', error)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!user) {
      alert('Please log in to submit an answer')
      return
    }

    if (!newAnswer.trim() || newAnswer.length < 10) {
      setError('Answer must be at least 10 characters long')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId,
          answer: newAnswer
        })
      })

      const data = await response.json()

      if (response.ok) {
        setNewAnswer('')
        fetchAnswers() // Refresh answers list
      } else {
        setError(data.message || 'Failed to submit answer')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] flex items-center justify-center">
        <p>Loading question...</p>
      </div>
    )
  }

  if (error && !question) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] flex items-center justify-center">
        <p>Question not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-[#7D8590] hover:text-[#C9D1D9]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Question Card */}
        <Card className="bg-[#161B22] border-[#21262D] mb-6">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-[#C9D1D9] mb-3">
                  {question.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-[#21262D] text-[#7D8590]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ReportDialog 
                  contentType="question" 
                  contentId={question._id}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <HtmlRenderer 
              content={question.description || ''} 
              className="mb-6"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Vote buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoteQuestion('upvote')}
                    className={`p-1 h-8 w-8 ${
                      question.upvotes?.includes(user?.id || '') 
                        ? 'text-green-400 bg-green-500/10' 
                        : 'text-[#7D8590] hover:text-green-400'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-[#C9D1D9] min-w-[2rem] text-center">
                    {(question.upvotes?.length || 0) - (question.downvotes?.length || 0)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoteQuestion('downvote')}
                    className={`p-1 h-8 w-8 ${
                      question.downvotes?.includes(user?.id || '') 
                        ? 'text-red-400 bg-red-500/10' 
                        : 'text-[#7D8590] hover:text-red-400'
                    }`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 text-[#7D8590]">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">{answers.length}</span>
                </div>

                <div className="flex items-center gap-1 text-[#7D8590]">
                  <span className="text-sm">{question.views} views</span>
                </div>

                <ShareComponent
                  questionId={question._id}
                  title={question.title}
                  description={question.description}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={question.userId.avatar} />
                    <AvatarFallback className="bg-[#21262D] text-[#7D8590] text-xs">
                      {question.userId.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-[#7D8590]">
                    {question.userId.username}
                  </span>
                  <span className="text-sm text-[#7D8590]">
                    {formatTimeAgo(question.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#C9D1D9] mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          <div className="space-y-4">
            {answers.map((answer) => (
              <Card key={answer._id} className="bg-[#161B22] border-[#21262D]">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Vote section */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteAnswer(answer._id, 'upvote')}
                        className={`p-1 h-8 w-8 ${
                          answer.upvotes?.includes(user?.id || '') 
                            ? 'text-green-400 bg-green-500/10' 
                            : 'text-[#7D8590] hover:text-green-400'
                        }`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-[#C9D1D9]">
                        {(answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteAnswer(answer._id, 'downvote')}
                        className={`p-1 h-8 w-8 ${
                          answer.downvotes?.includes(user?.id || '') 
                            ? 'text-red-400 bg-red-500/10' 
                            : 'text-[#7D8590] hover:text-red-400'
                        }`}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      
                      {/* Accept answer button - only show for question owner */}
                      {user && question.userId._id === user.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcceptAnswer(answer._id)}
                          className={`p-1 h-8 w-8 mt-2 ${
                            answer.isAccepted 
                              ? 'text-green-400 bg-green-500/10' 
                              : 'text-[#7D8590] hover:text-green-400'
                          }`}
                          title={answer.isAccepted ? 'Accepted answer' : 'Accept this answer'}
                        >
                          <CheckCircle className={`h-4 w-4 ${answer.isAccepted ? 'fill-current' : ''}`} />
                        </Button>
                      )}
                      
                      {/* Show accepted indicator for non-owners */}
                      {answer.isAccepted && (!user || question.userId._id !== user.id) && (
                        <div className="p-1 h-8 w-8 mt-2 flex items-center justify-center" title="Accepted answer">
                          <CheckCircle className="h-4 w-4 text-green-400 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Answer content */}
                    <div className="flex-1">
                      <HtmlRenderer 
                        content={answer.answer || ''} 
                        className="mb-4"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {answer.isAccepted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Accepted Answer
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <ReportDialog 
                            contentType="answer" 
                            contentId={answer._id}
                          />
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={answer.userId.avatar} />
                              <AvatarFallback className="bg-[#21262D] text-[#7D8590] text-xs">
                                {answer.userId.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-[#7D8590]">
                              {answer.userId.username}
                            </span>
                            <span className="text-sm text-[#7D8590]">
                              {formatTimeAgo(answer.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Answer Section */}
        {user && (
          <Card className="bg-[#161B22] border-[#21262D]">
            <CardHeader>
              <h3 className="text-lg font-semibold text-[#C9D1D9]">Your Answer</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <RichTextEditor
                  content={newAnswer}
                  onUpdate={setNewAnswer}
                  placeholder="Write your answer here... You can mention users with @username (minimum 10 characters)"
                  className="min-h-[150px]"
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[#7D8590]">
                    Use @ to mention users in your answer
                  </p>
                  
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || newAnswer.length < 10}
                    className="bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card className="bg-[#161B22] border-[#21262D]">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-[#7D8590] mb-4">
                  Please log in to submit an answer
                </p>
                <Button 
                  onClick={() => router.push('/login')}
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
