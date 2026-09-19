'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building2,
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Search,
  Sparkles,
  Megaphone,
  UserPlus,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'
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

const ACCENT = '#378ADD'

const nav = [
  { href: '/org-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/org-admin/users', label: 'Users', icon: Users },
  { href: '/org-admin/users-and-roles', label: 'Users & custom roles', icon: UserPlus },
  { href: '/org-admin/roles-permissions', label: 'Roles & permissions', icon: ShieldCheck },
  { href: '/org-admin/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/org-admin/notifications', label: 'Send notification', icon: Megaphone },
]

export default function OrgAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || 'A'

  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-300',
        mobile ? 'w-72' : collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-100 px-4',
          collapsed && !mobile && 'justify-center px-2',
        )}
      >
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: ACCENT }}
        >
          <Building2 className="h-5 w-5" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className="leading-none font-semibold tracking-tight text-slate-900">Daxor</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Tenant Admin
            </p>
          </div>
        )}
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav
        className={cn(
          'flex-1 space-y-1 overflow-y-auto py-4',
          collapsed && !mobile ? 'px-2' : 'px-3',
        )}
      >
        {(!collapsed || mobile) && (
          <p className="px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Organization
          </p>
        )}
        {nav.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          if (collapsed && !mobile) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  'mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition',
                  active
                    ? 'text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                )}
                style={active ? { backgroundColor: ACCENT } : undefined}
              >
                <Icon className="h-5 w-5" />
              </Link>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition',
                active
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
              style={active ? { backgroundColor: ACCENT } : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-slate-100 p-3">
        {!mobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50',
              collapsed && 'mx-auto h-11 w-11 justify-center px-0',
            )}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        <Link
          href="/dashboard"
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50',
            collapsed && !mobile && 'mx-auto h-11 w-11 justify-center px-0',
          )}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span>Open ERP</span>}
        </Link>
        <button
          onClick={() => logout()}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-rose-600 transition hover:bg-rose-50',
            collapsed && !mobile && 'mx-auto h-11 w-11 justify-center px-0',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="hidden shrink-0 lg:block">
        <SidebarBody />
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-none p-0">
          <SidebarBody mobile />
        </SheetContent>
      </Sheet>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <header className="sticky top-0 z-30 shrink-0 border-b border-slate-100 bg-white">
          <div className="flex h-16 items-center gap-2 px-3 sm:px-4 lg:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <span
                className="rounded-lg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                style={{ backgroundColor: ACCENT }}
              >
                Tenant
              </span>
              <h2 className="text-sm font-semibold text-slate-900">Organization admin</h2>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search users…"
                  className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#378ADD]/50 focus:bg-white focus:ring-2 focus:ring-[#378ADD]/20"
                />
              </div>
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
                        style={{ backgroundColor: ACCENT }}
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
                  <DropdownMenuItem onClick={() => logout()} className="text-rose-600">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto bg-white">{children}</div>
      </main>
    </div>
  )
}
