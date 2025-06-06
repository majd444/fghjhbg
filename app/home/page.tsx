"use client";

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import HomeSuccessHandler from "./HomeSuccessHandler"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Invisible component to handle Stripe payment success redirects */}
      <HomeSuccessHandler />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
