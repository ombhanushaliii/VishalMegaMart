import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { QuestionProvider } from "@/context/QuestionContext"
import { ReportProvider } from "@/context/ReportContext"
import { AnswerProvider } from "@/context/AnswerContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { LiveThreadProvider } from "@/context/LiveThreadContext"
import { SocketProvider } from "@/context/SocketContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STACKIt",
  description: "A platform for developers to ask questions and share knowledge",
  icons: '/logo.png'
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
          <SocketProvider>
            <NotificationProvider>
              <QuestionProvider>
                <AnswerProvider>
                  <ReportProvider>
                    <LiveThreadProvider>
                      {children}
                    </LiveThreadProvider>
                  </ReportProvider>
                </AnswerProvider>
              </QuestionProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
