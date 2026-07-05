'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Shield,
  LayoutDashboard,
  Building2,
  Building,
  Users,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Sun,
  Moon,
  Bell,
  Sparkles,
  Zap,
  Megaphone,
  Package,
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

const nav = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin/sub-tenants', label: 'Sub-tenants', icon: Building },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/notifications', label: 'Send notification', icon: Megaphone },
  { href: '/admin/audit-log', label: 'Audit log', icon: Activity },
  { href: '/admin/api-tester', label: 'API tester', icon: Zap },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials =
    ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || 'A'

  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        'flex h-full flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-[width] duration-300',
        mobile ? 'w-72' : collapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      <div className={cn('flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-[hsl(var(--sidebar-border))]', collapsed && !mobile && 'justify-center px-2')}>
        <div className="bg-grad-violet h-9 w-9 rounded-xl grid place-items-center text-white elev-brand shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold tracking-tight leading-none">Daxor</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--sidebar-muted))] mt-1">Platform Admin</p>
          </div>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="rounded-md p-1 hover:bg-[hsl(var(--sidebar-accent))]">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className={cn('flex-1 overflow-y-auto py-3 space-y-0.5', collapsed && !mobile ? 'px-2' : 'px-2.5')}>
        {(!collapsed || mobile) && (
          <p className="px-2.5 pt-1 pb-2 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-muted))]">
            Platform
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
                className={cn('nav-item justify-center w-11 h-11 p-0 mx-auto', active && 'active')}
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
              className={cn('nav-item', active && 'active')}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-[hsl(var(--sidebar-border))] p-2 space-y-1">
        {!mobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn('nav-item w-full', collapsed && 'justify-center px-0 w-11 h-11 mx-auto')}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span className="text-[13px]">Collapse</span>}
          </button>
        )}
        <Link
          href="/apps"
          className={cn('nav-item w-full', collapsed && !mobile && 'justify-center px-0 w-11 h-11 mx-auto')}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span className="text-[13px]">Open ERP</span>}
        </Link>
        <button
          onClick={() => logout()}
          className={cn(
            'nav-item w-full text-rose-300 hover:!bg-rose-500/15 hover:!text-rose-200',
            collapsed && !mobile && 'justify-center px-0 w-11 h-11 mx-auto',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span className="text-[13px]">Logout</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden lg:block shrink-0">
        <SidebarBody />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <SidebarBody mobile />
        </SheetContent>
      </Sheet>

      <main className="flex flex-1 min-w-0 flex-col overflow-hidden bg-secondary/30">
        <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex h-16 items-center gap-2 px-3 sm:px-4 lg:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="rounded-lg bg-violet-100 text-violet-700 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                Platform
              </span>
              <h2 className="text-sm font-semibold">Administration console</h2>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search orgs, users…"
                  className="rounded-lg border border-border bg-secondary/40 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-64"
                />
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="hidden h-5 w-5 dark:inline" />
              </button>
              <NotificationsDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 inline-flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-secondary">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-grad-violet text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium text-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-rose-600">
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      </main>
    </div>
  )
}
