"use client"

import { AskQuestionForm } from "@/components/ask-question-form"
import { QuestionFeed } from "@/components/question-feed"
import { NotificationsPage } from "@/components/notifications-page"
import { LiveThreadChat } from "@/components/live-thread-chat"
import { ProfilePage } from "@/components/profile-page"
import type { ContentView } from "@/app/page"

interface MainContentProps {
  currentView: ContentView
  selectedLiveThread: number | null
  onLiveThreadSelect: (threadId: number) => void
}

export function MainContent({
  currentView,
  selectedLiveThread,
  onLiveThreadSelect,
}: MainContentProps) {
  const renderContent = () => {
    if (selectedLiveThread) {
      return <LiveThreadChat threadId={selectedLiveThread} onBack={() => onLiveThreadSelect(0)} />
    }

    switch (currentView) {
      case "home":
        return (
          <>
            <WelcomeSection />
            <AskQuestionForm />
            <QuestionFeed />
          </>
        )
      case "questions":
        return <QuestionFeed />
      case "notifications":
        return <NotificationsPage />
      case "tags":
        return <TagsView />
      case "help":
        return <HelpView />
      case "profile":
        return <ProfilePage />
      default:
        return <QuestionFeed />
    }
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto p-6 space-y-6">{renderContent()}</div>
    </div>
  )
}

function WelcomeSection() {
  return (
    <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
      <h1 className="text-2xl font-bold text-[#C9D1D9] mb-2">Welcome Back, Developer!</h1>
      <p className="text-[#7D8590]">
        Find the technical answers you need and assist others in finding the answers they need.
      </p>
    </div>
  )
}

function TagsView() {
  return (
    <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-8 text-center">
      <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4">Tags</h2>
      <p className="text-[#7D8590]">Browse all tags and topics in the community.</p>
    </div>
  )
}

function HelpView() {
  return (
    <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-8 text-center">
      <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4">Help Center</h2>
      <p className="text-[#7D8590]">Find answers to frequently asked questions and get support.</p>
    </div>
  )
}
