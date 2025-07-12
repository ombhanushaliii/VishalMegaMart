"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { RightSidebar } from "@/components/right-sidebar"
import { MainContent } from "@/components/main-content"
import { useAuth } from "@/context/AuthContext"

export type ContentView = "home" | "questions" | "tags" | "help" | "notifications" | "profile"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ContentView>("questions")
  const [selectedLiveThread, setSelectedLiveThread] = useState<number | null>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      setCurrentView("home")
    } else {
      setCurrentView("questions")
    }
  }, [user, logout])

  const handleViewChange = (view: ContentView) => {
    setCurrentView(view)
    setSelectedLiveThread(null)
  }

  const handleLiveThreadSelect = (threadId: number) => {
    setSelectedLiveThread(threadId)
    setCurrentView("home") 
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] flex flex-col">
      <Navbar currentView={currentView} onViewChange={handleViewChange} />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <main className="flex-1 2xl:mr-96 xl:mr-80 lg:mr-72 overflow-y-auto main-content">
          <MainContent
            currentView={currentView}
            selectedLiveThread={selectedLiveThread}
            onLiveThreadSelect={handleLiveThreadSelect}
          />
        </main>

        <RightSidebar onLiveThreadSelect={handleLiveThreadSelect} />
      </div>
    </div>
  )
}
