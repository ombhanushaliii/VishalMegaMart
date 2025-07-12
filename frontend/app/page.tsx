"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { RightSidebar } from "@/components/right-sidebar"
import { MainContent } from "@/components/main-content"

export type ContentView = "home" | "questions" | "tags" | "help" | "notifications" | "profile"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ContentView>("home")
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [selectedLiveThread, setSelectedLiveThread] = useState<number | null>(null)

  const handleViewChange = (view: ContentView) => {
    setCurrentView(view)
    setSelectedQuestion(null)
    setSelectedLiveThread(null)
  }

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId)
    setSelectedLiveThread(null)
    setCurrentView("questions")
  }

  const handleLiveThreadSelect = (threadId: number) => {
    setSelectedLiveThread(threadId)
    setSelectedQuestion(null)
    setCurrentView("home") // or create a separate "live-threads" view
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] flex flex-col">
      <Navbar currentView={currentView} onViewChange={handleViewChange} />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <main className="flex-1 2xl:mr-96 xl:mr-80 lg:mr-72 overflow-y-auto main-content">
          <MainContent
            currentView={currentView}
            selectedQuestion={selectedQuestion}
            selectedLiveThread={selectedLiveThread}
            onQuestionSelect={handleQuestionSelect}
            onLiveThreadSelect={handleLiveThreadSelect}
          />
        </main>

        <RightSidebar onLiveThreadSelect={handleLiveThreadSelect} />
      </div>
    </div>
  )
}
