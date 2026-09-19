'use client'

import Link from 'next/link'
import { Bell, Building2, LogOut, Settings, Shield, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { getAdminConsoleBackLink, isPlatformAdminRole } from '@/lib/admin-console-link'

export function UserProfileMenu() {
  const { user, logout } = useAuth()
  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  const adminBack = getAdminConsoleBackLink(user?.roles)
  const AdminBackIcon = isPlatformAdminRole(user?.roles) ? Shield : Building2

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="User profile"
          className="inline-flex items-center rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9 border border-primary/20 shadow-sm">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="leading-tight">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <User className="mr-2 h-4 w-4" /> My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=preferences">
            <Settings className="mr-2 h-4 w-4" /> Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Link>
        </DropdownMenuItem>
        {adminBack ? (
          <DropdownMenuItem asChild>
            <Link href={adminBack.href}>
              <AdminBackIcon className="mr-2 h-4 w-4" />
              {adminBack.label}
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="text-rose-600 focus:text-rose-700"
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
