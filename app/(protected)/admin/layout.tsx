'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Search, Sun, Moon, LayoutGrid, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { ADMIN_ACCENT, ADMIN_NAV, isAdminWelcomePath } from '@/lib/admin-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const initials =
    ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || 'A'

  const currentLabel = useMemo(() => {
    const match = ADMIN_NAV.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    return match?.label ?? 'Administration console'
  }, [pathname])

  // Welcome apps launcher — full-page chrome handled by the page itself
  if (isAdminWelcomePath(pathname)) {
    return <div className="min-h-screen bg-white">{children}</div>
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-100 bg-white">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-4 lg:px-6">
          <Link
            href="/admin/welcome"
            title="All apps"
            aria-label="All apps"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span
              className="rounded-lg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: ADMIN_ACCENT }}
            >
              Platform
            </span>
            <h2 className="truncate text-sm font-semibold text-slate-900">{currentLabel}</h2>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search orgs, users…"
                className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#378ADD]/50 focus:bg-white focus:ring-2 focus:ring-[#378ADD]/20 lg:w-64"
              />
            </div>
            <Link
              href="/welcome"
              title="Open ERP"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50"
            >
              <Sparkles className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:inline" />
            </button>
            <NotificationsDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 inline-flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-50">
                  <Avatar className="h-8 w-8 border border-[#378ADD]/20">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: ADMIN_ACCENT }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/welcome">
                    <LayoutGrid className="mr-2 h-4 w-4" /> All apps
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="text-rose-600">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-white">{children}</main>
    </div>
  )
}
