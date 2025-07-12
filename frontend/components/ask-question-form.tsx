"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Smile,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formatButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Strikethrough, label: "Strikethrough" },
  { icon: List, label: "Bullet List" },
  { icon: ListOrdered, label: "Numbered List" },
  { icon: Link, label: "Link" },
  { icon: Smile, label: "Emoji" },
  { icon: ImageIcon, label: "Image" },
]

const alignButtons = [
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
]

const popularTags = ["javascript", "react", "typescript", "nextjs", "css", "html", "nodejs", "python"]

export function AskQuestionForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-[#C9D1D9] mb-6">Ask a Question</h2>

      {/* Title Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Question Title</label>
        <Input
          placeholder="What's your programming question?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
        />
      </div>

      {/* Rich Text Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Question Details</label>

        {/* Toolbar */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-t-lg p-3">
          <div className="flex flex-wrap items-center gap-1">
            {formatButtons.map((button) => (
              <Button
                key={button.label}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}

            <Separator orientation="vertical" className="h-6 bg-[#30363D] mx-2" />

            {alignButtons.map((button) => (
              <Button
                key={button.label}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <Textarea
          placeholder="Describe your question in detail. Include what you've tried and what specific help you need..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32 bg-[#0D1117] border-[#30363D] border-t-0 rounded-t-none text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 resize-none"
        />
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Tags (up to 5)</label>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
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
                addTag(tagInput.toLowerCase())
              }
            }}
            className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
          <Button
            onClick={() => addTag(tagInput.toLowerCase())}
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
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-[#30363D] text-[#7D8590] hover:border-teal-500/30 hover:text-teal-400 cursor-pointer transition-colors"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full px-8 py-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={!title.trim() || !content.trim()}
        >
          Post Question
        </Button>
      </div>
    </div>
  )
}
