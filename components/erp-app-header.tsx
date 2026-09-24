'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  LogOut,
  Search,
  Settings,
  User,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  HelpCircle,
  Plus,
  PanelLeftClose,
  PanelTopClose,
  Shield,
  Building2,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { ApprovalsInbox } from '@/components/approvals-inbox'
import { useLayoutPreference } from '@/hooks/use-layout-preference'
import { GlobalSearch } from '@/components/global-search'
import { getAdminConsoleBackLink, isPlatformAdminRole } from '@/lib/admin-console-link'

interface ErpAppHeaderProps {
  onMenuClick?: () => void
  hideMobileMenu?: boolean
}

export function ErpAppHeader({ onMenuClick, hideMobileMenu }: ErpAppHeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [layout, setLayout] = useLayoutPreference()
  const [searchOpen, setSearchOpen] = useState(false)

  const initials = ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || 'U'
  const adminBack = getAdminConsoleBackLink(user?.roles)
  const AdminBackIcon = isPlatformAdminRole(user?.roles) ? Shield : Building2

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center gap-2 px-3 sm:px-4 lg:px-6">
        {onMenuClick && !hideMobileMenu && (
          <button
            type="button"
            onClick={onMenuClick}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary',
              layout === 'navbar' ? 'md:hidden' : 'lg:hidden',
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="hidden md:flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <span className="text-sm font-semibold">
              {(user?.firstName?.[0] ?? 'U').toUpperCase()}
            </span>
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Welcome back</p>
            <p className="text-sm font-semibold truncate max-w-[14rem]">
              {user?.firstName || 'User'} {user?.lastName ?? ''}
            </p>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex justify-center max-w-xl mx-auto px-2">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-1">
          {adminBack ? (
            <Link
              href={adminBack.href}
              className={cn(
                'hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors',
                isPlatformAdminRole(user?.roles)
                  ? 'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100'
                  : 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100',
              )}
              title={adminBack.label}
            >
              <AdminBackIcon className="h-4 w-4 shrink-0" />
              <span>{adminBack.shortLabel}</span>
            </Link>
          ) : null}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg bg-grad-brand px-3 text-sm font-medium text-white shadow-sm hover:opacity-95 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Create
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-2">
              <p className="px-2 pt-1 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Quick actions</p>
              {[
                { label: 'New invoice', href: '/sales/create-invoices' },
                { label: 'New sales order', href: '/sales/enter-sales-order' },
                { label: 'New quotation', href: '/quotations' },
                { label: 'New purchase order', href: '/purchases/enter-purchase-orders' },
                { label: 'New customer', href: '/customers' },
                { label: 'New vendor', href: '/vendors' },
              ].map((a) => (
                <a key={a.href} href={a.href} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary transition-colors">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  {a.label}
                </a>
              ))}
            </PopoverContent>
          </Popover>

          <button
            type="button"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setLayout(layout === 'sidebar' ? 'navbar' : 'sidebar')}
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={layout === 'sidebar' ? 'Switch to top navbar' : 'Switch to side menu'}
          >
            {layout === 'sidebar' ? (
              <>
                <PanelTopClose className="h-4 w-4" />
                <span>Navbar</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Sidebar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:inline" />
          </button>

          <ApprovalsInbox />
          <NotificationsDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-1 inline-flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-secondary transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="hidden sm:inline h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="leading-tight">
                  <p className="font-medium text-sm">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/settings"><User className="h-4 w-4 mr-2" /> My profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/settings?tab=preferences"><Settings className="h-4 w-4 mr-2" /> Preferences</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/notifications"><Bell className="h-4 w-4 mr-2" /> Notifications</a>
              </DropdownMenuItem>
              {adminBack ? (
                <DropdownMenuItem asChild>
                  <Link href={adminBack.href}>
                    <AdminBackIcon className="h-4 w-4 mr-2" />
                    {adminBack.label}
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-rose-600 focus:text-rose-700">
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={cn('sm:hidden overflow-hidden transition-all', searchOpen ? 'max-h-16 pb-3' : 'max-h-0')}>
        <div className="px-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              autoFocus
              placeholder="Search…"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
