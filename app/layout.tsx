import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Auth0ProviderWithNavigate } from "@/components/providers/auth0-provider"
import { UserContextProvider } from "@/lib/contexts/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Agent Dashboard",
  description: "SaaS Chatbot Automation Platform",
  generator: 'v0.dev',
  icons: {
    icon: '/chat-icon.svg',
    shortcut: '/chat-icon.svg',
    apple: '/chat-icon.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/chat-icon.svg',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fix for sidePanelUtil.js error */}
        <script src="/fix-side-panel.js" async={false}></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Auth0ProviderWithNavigate>
            <UserContextProvider>
              {children}
            </UserContextProvider>
          </Auth0ProviderWithNavigate>
        </ThemeProvider>
      </body>
    </html>
  )
}
