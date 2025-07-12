"use client"
import { useState, useEffect, useRef } from "react"
import { Search, Bell, Home, MessageSquare, Tag, HelpCircle, LogIn, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useQuestions } from '@/context/QuestionContext'
import { useRouter } from "next/navigation"
import type { ContentView } from "@/app/page"

interface NavbarProps {
  currentView: ExtendedContentView
  onViewChange: (view: ExtendedContentView) => void
  onTagSearch?: (tag: string) => void
}

const navigationItems = [
  { icon: Home, label: "Home", value: "home" as ContentView, requiresAuth: true },
  { icon: MessageSquare, label: "Questions", value: "questions" as ContentView, count: 524, requiresAuth: false },
  { icon: Tag, label: "Tags", value: "tags" as ContentView, requiresAuth: false },
  { icon: HelpCircle, label: "Help", value: "help" as ContentView, requiresAuth: false },
]

type ExtendedContentView = ContentView | "profile" | "notifications"

export function Navbar({ currentView, onViewChange, onTagSearch }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const { fetchTags } = useQuestions()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [tagSuggestions, setTagSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch tag suggestions
  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchTagSuggestions(searchTerm)
    } else {
      setTagSuggestions([])
    }
  }, [searchTerm])

  const fetchTagSuggestions = async (query: string) => {
    try {
      const result = await fetchTags()
      if (result.success) {
        const filtered = result.tags.filter((tag: any) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        )
        setTagSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
      }
    } catch (error) {
      console.error('Error fetching tag suggestions:', error)
    }
  }

  const handleTagClick = (tagName: string) => {
    setSearchTerm("")
    setShowSuggestions(false)
    onViewChange("tags")
    if (onTagSearch) {
      onTagSearch(tagName)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to questions view with search term
      onViewChange("questions")
      // Could add search functionality here
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleSignup = () => {
    router.push('/register')
  }

  // Filter navigation items based on authentication status
  const visibleNavigationItems = navigationItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  )

  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.username) return "U"
    return user.username.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#21262D] bg-[#0D1117]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/75">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="flex items-center space-x-0 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="StackIt Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg"
          />
          <span className="font-bold text-xl text-[#C9D1D9]">StackIt</span>
        </div>

        {/* Centered Navigation Items and Search */}
        <div className="flex-1 flex justify-center items-center space-x-8">
          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-2">
            {visibleNavigationItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onViewChange(item.value)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center justify-center transition-colors",
                  currentView === item.value
                    ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-400 border border-teal-500/30 shadow-lg"
                    : "text-[#C9D1D9] hover:bg-[#161B22] hover:text-teal-400",
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.count && (
                  <Badge className="ml-2 bg-[#30363D] text-[#7D8590] text-xs px-1.5 py-0.5">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="max-w-md w-full" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D8590] h-4 w-4" />
              <Input
                placeholder="Search questions, tags, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(tagSuggestions.length > 0)}
                className="w-full pl-10 bg-[#161B22] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] rounded-full focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />
              
              {/* Search suggestions dropdown */}
              {showSuggestions && tagSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="text-xs text-[#7D8590] mb-2 px-2">Tags</div>
                    {tagSuggestions.slice(0, 5).map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagClick(tag.name)}
                        className="w-full text-left px-3 py-2 hover:bg-[#21262D] rounded-md transition-colors flex items-center gap-2"
                      >
                        <Tag className="h-4 w-4 text-teal-400" />
                        <span className="text-[#C9D1D9]">{tag.name}</span>
                        <span className="text-xs text-[#7D8590] ml-auto">
                          {tag.questionCount} questions
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => onViewChange("notifications")}
                  className={cn(
                    "rounded-full h-10 w-10 inline-flex items-center justify-center transition-colors",
                    currentView === "notifications"
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "text-[#C9D1D9] hover:bg-[#161B22]",
                  )}
                >
                  <Bell className="h-5 w-5" />
                </button>
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  3
                </Badge>
              </div>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110",
                      currentView === "profile" && "ring-2 ring-teal-400 ring-offset-2 ring-offset-[#0D1117]",
                    )}
                  >
                    <Avatar className="h-10 w-10 border-2 border-[#30363D] transition-all duration-300 hover:border-teal-400">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.username || "User"} />
                      <AvatarFallback className="bg-[#161B22] text-[#C9D1D9]">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#161B22] border-[#30363D] text-[#C9D1D9] animate-in slide-in-from-top-2 duration-300 ease-in-out"
                  align="end"
                  side="bottom"
                  sideOffset={4}
                >
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-[#7D8590]">{user?.email}</div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#30363D]" />
                  <DropdownMenuItem
                    className={cn("hover:bg-[#21262D] cursor-pointer transition-colors duration-200")}
                    onClick={() => onViewChange("profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#30363D]" />
                  <DropdownMenuItem 
                    className="hover:bg-[#21262D] cursor-pointer text-red-400 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Login and Signup buttons for non-authenticated users */
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogin}
                className="text-[#C9D1D9] hover:bg-[#161B22] hover:text-teal-400 px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="text-[#C9D1D9] hover:bg-[#161B22] hover:text-teal-400 px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-[#21262D] bg-[#0D1117]">
        <div className="flex flex-wrap justify-between px-4 py-2">
          {visibleNavigationItems.slice(0, 4).map((item) => (
            <button
              key={item.value}
              onClick={() => onViewChange(item.value)}
              className={cn(
                "flex-1 text-xs h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors",
                currentView === item.value
                  ? "bg-teal-500/20 text-teal-400"
                  : "text-[#7D8590] hover:text-[#C9D1D9]",
              )}
            >
              <item.icon className="h-3 w-3 mr-1" />
              {item.label}
            </button>
          ))}
          
          {/* Mobile login button if not authenticated */}
          {!isAuthenticated && (
            <div className="flex-1 flex space-x-1">
              <button
                onClick={handleLogin}
                className="flex-1 text-xs text-teal-400 hover:text-teal-300 h-9 rounded-md px-3 inline-flex items-center justify-center font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="flex-1 text-xs text-teal-400 hover:text-teal-300 h-9 rounded-md px-3 inline-flex items-center justify-center font-medium transition-colors"
              >
                SignUp
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
