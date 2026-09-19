'use client'

import Link from 'next/link'
import { LayoutGrid, Sparkles } from 'lucide-react'
import { UserProfileMenu } from '@/components/welcome/user-profile-menu'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { cn } from '@/lib/utils'

type WelcomeChromeHeaderProps = {
  /** When true, show a compact “Apps” home control (module workspace). */
  showAppsHome?: boolean
  title?: string
  className?: string
}

export function WelcomeChromeHeader({
  showAppsHome = false,
  title,
  className,
}: WelcomeChromeHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {showAppsHome ? (
          <Link
            href="/welcome"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="All apps"
            aria-label="All apps"
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>
        ) : (
          <Link href="/welcome" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold leading-none text-slate-900">Daxor ERP</span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Suite
              </span>
            </span>
          </Link>
        )}
        {title ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <NotificationsDropdown />
        <UserProfileMenu />
      </div>
    </header>
  )
}
