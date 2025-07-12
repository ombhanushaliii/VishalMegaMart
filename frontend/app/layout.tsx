import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { QuestionProvider } from "@/context/QuestionContext"
import { ReportProvider } from "@/context/ReportContext"
import { AnswerProvider } from "@/context/AnswerContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STACKIt",
  description: "A platform for developers to ask questions and share knowledge",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QuestionProvider>
            <AnswerProvider>
              <ReportProvider>
                {children}
              </ReportProvider>
            </AnswerProvider>
          </QuestionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
