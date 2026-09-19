'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { ADMIN_ACCENT, ADMIN_APP_ACCENTS, ADMIN_NAV } from '@/lib/admin-nav'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { UserProfileMenu } from '@/components/welcome/user-profile-menu'

export default function AdminWelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link href="/admin/welcome" className="inline-flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ backgroundColor: ADMIN_ACCENT }}
          >
            <Shield className="h-4 w-4" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold leading-none text-slate-900">Daxor Admin</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Platform
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <NotificationsDropdown />
          <UserProfileMenu />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto mb-10 w-full max-w-5xl text-center sm:mb-12 sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Choose an admin app to get started.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {ADMIN_NAV.map((item, index) => {
            const Icon = item.icon
            const accent = ADMIN_APP_ACCENTS[index % ADMIN_APP_ACCENTS.length]
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[#378ADD]/40 focus-visible:ring-offset-2"
              >
                <span className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/80 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: accent }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                  </span>
                  <span className="max-w-[7.5rem] text-[13px] font-medium leading-snug text-slate-700">
                    {item.label}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
