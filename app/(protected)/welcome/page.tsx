'use client'

import { AppsGrid } from '@/components/welcome/apps-grid'
import { WelcomeChromeHeader } from '@/components/welcome/welcome-chrome-header'

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <WelcomeChromeHeader />
      <main className="flex flex-1 flex-col px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto mb-10 w-full max-w-6xl text-center sm:mb-12 sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Choose an app to get started.
          </p>
        </div>
        <AppsGrid />
      </main>
    </div>
  )
}
