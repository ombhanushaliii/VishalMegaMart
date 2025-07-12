"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QuillEditor } from "@/components/ui/quill-editor"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useQuestions } from "@/context/QuestionContext"
import { useLiveThreads } from "@/context/LiveThreadContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const popularTags = ["javascript", "react", "typescript", "nextjs", "css", "html", "nodejs", "python"]

export function AskQuestionForm() {
  const { createQuestion, loading } = useQuestions()
  const { createLiveThread, loading: threadLoading } = useLiveThreads()
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState("")
  const [postType, setPostType] = useState<"question" | "thread">("question")

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("Please log in to ask a question")
      return
    }

    if (title.length < 5) {
      setError("Title must be at least 5 characters long")
      return
    }

    if (content.length < 10) {
      setError("Description must be at least 10 characters long")
      return
    }

    if (selectedTags.length === 0) {
      setError("Please add at least one tag")
      return
    }

    const data = {
      title,
      description: content,
      tags: selectedTags,
    }

    let result
    if (postType === "thread") {
      result = await createLiveThread(data)
      if (result.success) {
        // Navigate to the created thread
        router.push(`/live-threads/${result.thread._id}`)
      }
    } else {
      result = await createQuestion(data)
    }

    if (result.success) {
      // Reset form
      setTitle("")
      setContent("")
      setSelectedTags([])
      setTagInput("")
      setError("")
      setPostType("question")
    } else {
      setError(result.error || "Failed to create post")
    }
  }

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-[#C9D1D9] mb-6">
        {postType === "thread" ? "Start a Live Discussion" : "Ask a Question"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Post Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C9D1D9] mb-3">Post Type</label>
          <RadioGroup value={postType} onValueChange={(value: "question" | "thread") => setPostType(value)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="question" id="question" />
              <Label htmlFor="question" className="text-[#C9D1D9] cursor-pointer">
                Regular Question
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="thread" id="thread" />
              <Label htmlFor="thread" className="text-[#C9D1D9] cursor-pointer">
                Live Thread Discussion
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-[#7D8590] mt-2">
            {postType === "thread" 
              ? "Start a real-time discussion that others can join instantly" 
              : "Post a traditional question that others can answer"
            }
          </p>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
            {postType === "thread" ? "Discussion Topic" : "Question Title"}
          </label>
          <Input
            placeholder={postType === "thread" ? "What would you like to discuss?" : "What's your programming question?"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            maxLength={200}
          />
          <p className="text-xs text-[#7D8590] mt-1">
            {title.length}/200 characters
          </p>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
            {postType === "thread" ? "Discussion Details" : "Question Details"}
          </label>
          <RichTextEditor
            content={content}
            onUpdate={setContent}
            placeholder={
              postType === "thread" 
                ? "Describe what you'd like to discuss. Include context and what kind of input you're looking for. You can mention users with @username..."
                : "Describe your question in detail. Include what you've tried and what specific help you need. You can mention users with @username..."
            }
            className="min-h-[200px]"
          />
          <p className="text-xs text-[#7D8590] mt-1">
            Use @ to mention users in your {postType === "thread" ? "discussion" : "question"}
          </p>
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Tags (up to 5)</label>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 cursor-pointer px-2.5 py-0.5 text-xs font-semibold rounded transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag(tagInput)
                }
              }}
              className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              disabled={selectedTags.length >= 5}
            />
            <Button
              type="button"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput || selectedTags.length >= 5}
              className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30"
            >
              Add
            </Button>
          </div>

          {/* Popular Tags */}
          <div>
            <p className="text-xs text-[#7D8590] mb-2">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#30363D] text-[#7D8590] hover:border-teal-500/30 hover:text-teal-400 cursor-pointer transition-colors px-2.5 py-0.5 text-xs rounded"
                    onClick={() => selectedTags.length < 5 && addTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={(loading || threadLoading) || !title || !content || selectedTags.length === 0}
            className={`text-white hover:opacity-90 disabled:opacity-50 transition-all duration-300 ${
              postType === "thread" 
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {(loading || threadLoading) 
              ? "Creating..." 
              : postType === "thread" 
                ? "Start Live Discussion" 
                : "Post Question"
            }
          </Button>
        </div>
      </form>
    </div>
  )
}
