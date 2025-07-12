"use client"

import { useParams, useRouter } from "next/navigation"
import { LiveThreadChat } from "@/components/live-thread-chat"
import { ClientOnly } from "@/components/client-only"

export default function LiveThreadPage() {
  const params = useParams()
  const router = useRouter()
  const threadId = params.id as string

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <div className="max-w-6xl mx-auto">
        <ClientOnly 
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <LiveThreadChat threadId={threadId} onBack={handleBack} />
        </ClientOnly>
      </div>
    </div>
  )
}
