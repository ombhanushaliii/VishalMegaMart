"use client"

import {
  Home,
  Tag,
  X,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Users,
  Globe,
  AlertCircle,
  User,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LeftSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: Home, label: "Home", active: true, count: null },
  { icon: MessageSquare, label: "Questions", active: false, count: 524 },
  { icon: TrendingUp, label: "Most Answered", active: false, count: null },
  { icon: BarChart3, label: "Polls", active: false, count: null },
  { icon: Users, label: "Groups", active: false, count: null },
  { icon: Globe, label: "Communities", active: false, count: null },
  { icon: AlertCircle, label: "Unanswered", active: false, count: 89 },
  { icon: Tag, label: "Tags", active: false, count: null },
  { icon: User, label: "Users", active: false, count: null },
  { icon: HelpCircle, label: "Help", active: false, count: null },
]

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 transform bg-[#0D1117] border-r border-[#21262D] transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-[#21262D]">
            <span className="font-semibold text-[#C9D1D9]">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-[#C9D1D9] hover:bg-[#161B22]">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Fixed content, no scrolling */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between rounded-lg px-3 py-2 text-left font-medium transition-all duration-200",
                    item.active
                      ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-400 border-l-2 border-teal-400"
                      : "text-[#C9D1D9] hover:bg-[#161B22] hover:text-teal-400",
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </div>
                  {item.count && (
                    <span className="text-xs bg-[#30363D] text-[#7D8590] px-2 py-1 rounded-full">{item.count}</span>
                  )}
                </Button>
              ))}
            </div>
          </nav>

          {/* Footer - Always visible */}
          <div className="p-4 border-t border-[#21262D] mt-auto">
            <div className="text-xs text-[#7D8590] space-y-1">
              <p>© 2024 StackIt</p>
              <p>Community-driven Q&A</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
