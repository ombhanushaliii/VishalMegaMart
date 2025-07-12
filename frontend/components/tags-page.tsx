"use client"

import { useEffect, useState } from "react"
import { Search, Tag, TrendingUp, Clock, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionFeed } from "@/components/question-feed"
import { useQuestions } from "@/context/QuestionContext"
import { cn } from "@/lib/utils"

interface TagData {
  name: string
  questionCount: number
}

export function TagsPage() {
  const { fetchTags } = useQuestions()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tags, setTags] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const result = await fetchTags()
      
      if (result.success) {
        setTags(result.tags || [])
      } else {
        console.error('Failed to fetch tags:', result.error)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTagsByCategory = () => {
    switch (activeTab) {
      case 'popular':
        return filteredTags.sort((a, b) => b.questionCount - a.questionCount).slice(0, 20)
      case 'recent':
        // Since we don't have createdAt, just return by alphabetical order
        return filteredTags.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 20)
      case 'all':
      default:
        return filteredTags.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-green-500/20 text-green-400 border-green-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'bg-red-500/20 text-red-400 border-red-500/30'
    ]
    return colors[index % colors.length]
  }

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName)
  }

  const handleBackToTags = () => {
    setSelectedTag(null)
  }

  if (selectedTag) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToTags}
            className="text-[#7D8590] hover:text-[#C9D1D9]"
          >
            ← Back to Tags
          </Button>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-teal-400" />
            <h1 className="text-xl font-semibold text-[#C9D1D9]">
              Questions tagged with "{selectedTag}"
            </h1>
          </div>
        </div>
        
        <QuestionFeed searchTag={selectedTag} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="h-6 w-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-[#C9D1D9]">Tags</h1>
        </div>
        <p className="text-[#7D8590] mb-6">
          Browse all tags and topics in the community. Click on any tag to see related questions.
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D8590] h-4 w-4" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
        </div>
      </div>

      {/* Tags Content */}
      <Card className="bg-[#161B22] border-[#21262D]">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#0D1117] border border-[#30363D]">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                All Tags
              </TabsTrigger>
              <TabsTrigger 
                value="popular"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                Popular
              </TabsTrigger>
              <TabsTrigger 
                value="recent"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                Recent
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[#7D8590]">Loading tags...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTagsByCategory().map((tag, index) => (
                <div
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className="p-4 rounded-lg border border-[#30363D] hover:border-teal-500/30 cursor-pointer transition-all duration-200 hover:scale-105 bg-[#0D1117] hover:bg-[#161B22]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={cn("text-xs font-medium", getTagColor(index))}>
                      {tag.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-[#7D8590]">
                      <Users className="h-3 w-3" />
                      <span>{tag.questionCount}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#7D8590] line-clamp-2 mb-2">
                    Questions related to {tag.name}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[#7D8590]">
                    <span>{tag.questionCount} questions</span>
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Popular tag</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && getTagsByCategory().length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#7D8590]">No tags found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
