"use client"

import { AskQuestionForm } from "@/components/ask-question-form"
import { QuestionFeed } from "@/components/question-feed"
import { QuestionDetail } from "@/components/question-detail"
import { NotificationsPage } from "@/components/notifications-page"
import { LiveThreadChat } from "@/components/live-thread-chat"
import type { ContentView } from "@/app/page"

interface MainContentProps {
  currentView: ContentView
  selectedQuestion: number | null
  selectedLiveThread: number | null
  onQuestionSelect: (questionId: number) => void
  onLiveThreadSelect: (threadId: number) => void
}

export function MainContent({
  currentView,
  selectedQuestion,
  selectedLiveThread,
  onQuestionSelect,
  onLiveThreadSelect,
}: MainContentProps) {
  const renderContent = () => {
    if (selectedLiveThread) {
      return <LiveThreadChat threadId={selectedLiveThread} onBack={() => onLiveThreadSelect(0)} />
    }

    if (selectedQuestion) {
      return <QuestionDetail questionId={selectedQuestion} onBack={() => onQuestionSelect(0)} />
    }

    switch (currentView) {
      case "home":
        return (
          <>
            <WelcomeSection />
            <AskQuestionForm />
            <QuestionFeed onQuestionSelect={onQuestionSelect} />
          </>
        )
      case "questions":
        return <QuestionFeed onQuestionSelect={onQuestionSelect} />
      case "notifications":
        return <NotificationsPage />
      case "tags":
        return <TagsView />
      case "help":
        return <HelpView />
      default:
        return <QuestionFeed onQuestionSelect={onQuestionSelect} />
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
      <p className="text-[#7D8590] mb-6">
        Find the technical answers you need and assist others in finding the answers they need.
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-400">524</div>
          <div className="text-xs text-[#7D8590]">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">169</div>
          <div className="text-xs text-[#7D8590]">Answers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">890+</div>
          <div className="text-xs text-[#7D8590]">Best Answer</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">12K</div>
          <div className="text-xs text-[#7D8590]">Viewed Tag</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">870+</div>
          <div className="text-xs text-[#7D8590]">Votes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">12K</div>
          <div className="text-xs text-[#7D8590]">Users</div>
        </div>
      </div>
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
