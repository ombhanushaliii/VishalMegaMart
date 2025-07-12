"use client"

import { useParams, useRouter } from "next/navigation"
import { SimpleThreadChat } from "@/components/simple-thread-chat"

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
        <SimpleThreadChat threadId={threadId} onBack={handleBack} />
      </div>
    </div>
  )
}
