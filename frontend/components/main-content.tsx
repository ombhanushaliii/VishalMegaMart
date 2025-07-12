"use client"

import { AskQuestionForm } from "@/components/ask-question-form"
import { QuestionFeed } from "@/components/question-feed"
import { NotificationsPage } from "@/components/notifications-page"
import { LiveThreadChat } from "@/components/live-thread-chat"
import { ProfilePage } from "@/components/profile-page"
import { TagsPage } from "@/components/tags-page"
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
  return <TagsPage />
}

function HelpView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h1 className="text-3xl font-bold text-[#C9D1D9] mb-2">Help Center</h1>
        <p className="text-[#7D8590] text-lg">
          Find answers to frequently asked questions and learn how to make the most of our platform.
        </p>
      </div>

      {/* Getting Started */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4 flex items-center">
          🚀 Getting Started
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">How to ask a good question?</h3>
            <p className="text-[#7D8590] mb-2">
              To get the best answers, make sure your question is:
            </p>
            <ul className="list-disc list-inside text-[#7D8590] space-y-1 ml-4">
              <li>Clear and specific</li>
              <li>Includes relevant code snippets</li>
              <li>Shows what you've already tried</li>
              <li>Has appropriate tags</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">How to mention users?</h3>
            <p className="text-[#7D8590]">
              Type <code className="bg-[#21262D] px-2 py-1 rounded text-teal-400">@username</code> in questions or answers to mention and notify other users.
            </p>
          </div>
        </div>
      </div>

      {/* Features Guide */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4 flex items-center">
          ⭐ Platform Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
              <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">🔍 Search & Tags</h3>
              <p className="text-[#7D8590] text-sm">
                Use the search bar or click on tags to find questions related to specific technologies.
              </p>
            </div>
            
            <div className="p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
              <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">👍 Voting System</h3>
              <p className="text-[#7D8590] text-sm">
                Upvote helpful questions and answers, downvote content that doesn't contribute to the discussion.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
              <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">🔔 Notifications</h3>
              <p className="text-[#7D8590] text-sm">
                Get notified when someone mentions you, answers your question, or responds to your content.
              </p>
            </div>
            
            <div className="p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
              <h3 className="text-lg font-semibold text-[#C9D1D9] mb-2">📤 Share Questions</h3>
              <p className="text-[#7D8590] text-sm">
                Share interesting questions with colleagues or on social media using the share button.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4 flex items-center">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer text-lg font-semibold text-[#C9D1D9] hover:text-teal-400 transition-colors">
              How do I edit or delete my question?
            </summary>
            <p className="text-[#7D8590] mt-2 ml-4">
              Currently, questions and answers cannot be edited or deleted after posting. This helps maintain the integrity of discussions. 
              If you need to correct something, consider posting a new question or adding clarification in the comments.
            </p>
          </details>
          
          <details className="group">
            <summary className="cursor-pointer text-lg font-semibold text-[#C9D1D9] hover:text-teal-400 transition-colors">
              What should I do if I see inappropriate content?
            </summary>
            <p className="text-[#7D8590] mt-2 ml-4">
              Use the report button (flag icon) on any question or answer to report inappropriate content. 
              Our moderation team will review all reports and take appropriate action.
            </p>
          </details>
          
          <details className="group">
            <summary className="cursor-pointer text-lg font-semibold text-[#C9D1D9] hover:text-teal-400 transition-colors">
              How does the accepted answer system work?
            </summary>
            <p className="text-[#7D8590] mt-2 ml-4">
              Question authors can mark one answer as "accepted" by clicking the checkmark button. 
              This helps others quickly identify the solution that worked for the original problem.
            </p>
          </details>
          
          <details className="group">
            <summary className="cursor-pointer text-lg font-semibold text-[#C9D1D9] hover:text-teal-400 transition-colors">
              Can I use HTML in my questions and answers?
            </summary>
            <p className="text-[#7D8590] mt-2 ml-4">
              Yes! The rich text editor supports HTML formatting, code blocks, links, and more. 
              Use the formatting toolbar or write HTML directly for advanced formatting.
            </p>
          </details>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4 flex items-center">
          🤝 Community Guidelines
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Do</h3>
            <ul className="space-y-2 text-[#7D8590]">
              <li>• Be respectful and professional</li>
              <li>• Search before asking duplicate questions</li>
              <li>• Provide clear and detailed explanations</li>
              <li>• Use proper formatting and code blocks</li>
              <li>• Tag your questions appropriately</li>
              <li>• Thank helpful community members</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Don't</h3>
            <ul className="space-y-2 text-[#7D8590]">
              <li>• Post spam or promotional content</li>
              <li>• Ask for homework solutions without effort</li>
              <li>• Use offensive or inappropriate language</li>
              <li>• Post personal information</li>
              <li>• Engage in harassment or trolling</li>
              <li>• Ask multiple duplicate questions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <h2 className="text-2xl font-bold text-[#C9D1D9] mb-4 flex items-center">
          📞 Need More Help?
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-[#C9D1D9] mb-2">Ask the Community</h3>
            <p className="text-[#7D8590] text-sm">
              Post your question and get help from experienced developers
            </p>
          </div>
          
          <div className="text-center p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-[#C9D1D9] mb-2">Browse Documentation</h3>
            <p className="text-[#7D8590] text-sm">
              Check out official documentation for popular frameworks
            </p>
          </div>
          
          <div className="text-center p-4 bg-[#0D1117] rounded-lg border border-[#21262D]">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-[#C9D1D9] mb-2">Search Existing</h3>
            <p className="text-[#7D8590] text-sm">
              Your question might already be answered in our database
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
