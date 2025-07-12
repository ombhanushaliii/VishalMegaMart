"use client"
import { Search, Bell, Home, MessageSquare, Tag, HelpCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import type { ContentView } from "@/app/page"

interface NavbarProps {
  currentView: ExtendedContentView
  onViewChange: (view: ExtendedContentView) => void
}

const navigationItems = [
  { icon: Home, label: "Home", value: "home" as ContentView, requiresAuth: true },
  { icon: MessageSquare, label: "Questions", value: "questions" as ContentView, count: 524, requiresAuth: false },
  { icon: Tag, label: "Tags", value: "tags" as ContentView, requiresAuth: false },
  { icon: HelpCircle, label: "Help", value: "help" as ContentView, requiresAuth: false },
]

type ExtendedContentView = ContentView | "profile" | "notifications";

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

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
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-[#C9D1D9]">StackIt</span>
        </div>

        {/* Centered Navigation Items and Search */}
        <div className="flex-1 flex justify-center items-center space-x-8">
          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-2">
            {visibleNavigationItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                onClick={() => onViewChange(item.value)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-lg",
                  currentView === item.value
                    ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-400 border border-teal-500/30 shadow-lg"
                    : "text-[#C9D1D9] hover:bg-[#161B22] hover:text-teal-400",
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.count && (
                  <Badge className="ml-2 bg-[#30363D] text-[#7D8590] text-xs px-1.5 py-0.5 animate-pulse">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Search bar */}
          <div className="max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D8590] h-4 w-4" />
              <Input
                placeholder="Search questions, tags, users..."
                className="w-full pl-10 bg-[#161B22] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] rounded-full focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewChange("notifications")}
                  className={cn(
                    "rounded-full",
                    currentView === "notifications"
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "text-[#C9D1D9] hover:bg-[#161B22]",
                  )}
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  3
                </Badge>
              </div>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#161B22] border-[#30363D] text-[#C9D1D9]"
                  align="end"
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
            /* Login button for non-authenticated users */
            <div className="flex items-center gap-4">
            <Button
              onClick={handleLogin}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              Login
            </Button>
            <Button
              onClick={handleSignup}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              Signup
            </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-[#21262D] bg-[#0D1117]">
        <div className="flex flex-wrap justify-between px-4 py-2">
          {visibleNavigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(item.value)}
              className={cn(
                "flex-1 text-xs",
                currentView === item.value
                  ? "bg-teal-500/20 text-teal-400"
                  : "text-[#7D8590] hover:text-[#C9D1D9]",
              )}
            >
              <item.icon className="h-3 w-3 mr-1" />
              {item.label}
            </Button>
          ))}
          
          {/* Mobile login button if not authenticated */}
          {!isAuthenticated && (
            <div className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className="flex-1 text-xs text-teal-400 hover:text-teal-300"
              >
                Login
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignup}
                className="flex-1 text-xs text-teal-400 hover:text-teal-300"
              >
                SignUp
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
