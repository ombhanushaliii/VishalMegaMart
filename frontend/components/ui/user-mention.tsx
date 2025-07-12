"use client"

import { useState, useEffect, useRef } from 'react'
import { useNotifications } from '@/context/NotificationContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
  _id: string
  username: string
  email: string
}

interface UserMentionProps {
  onMention: (username: string) => void
  trigger?: string
  className?: string
}

export function UserMention({ onMention, trigger = '@', className = '' }: UserMentionProps) {
  const { searchUsers } = useNotifications()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      searchForUsers(query)
    } else {
      setUsers([])
      setShowSuggestions(false)
    }
  }, [query])

  const searchForUsers = async (searchQuery: string) => {
    try {
      const result = await searchUsers(searchQuery)
      if (result.success) {
        setUsers(result.users || [])
        setShowSuggestions(result.users && result.users.length > 0)
        setSelectedIndex(0)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.startsWith(trigger)) {
      setQuery(value.slice(1))
    } else {
      setQuery('')
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || users.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, users.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        selectUser(users[selectedIndex])
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
    }
  }

  const selectUser = (user: User) => {
    onMention(user.username)
    setQuery('')
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={`Type ${trigger} to mention a user`}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 ${className}`}
      />
      
      {showSuggestions && users.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 mt-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs text-[#7D8590] mb-2 px-2">Users</div>
            {users.map((user, index) => (
              <button
                key={user._id}
                onClick={() => selectUser(user)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                  index === selectedIndex
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'hover:bg-[#21262D] text-[#C9D1D9]'
                }`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-xs bg-[#21262D] text-[#C9D1D9]">
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-[#7D8590]">{user.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
