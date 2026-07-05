'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { LayoutGrid, LogOut, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ORGANIZATION } from '@/gql/queries'
import { cn } from '@/lib/utils'

type ErpTopHeaderProps = {
  moduleName?: string | null
}

export function ErpTopHeader({ moduleName }: ErpTopHeaderProps) {
  const { user, logout } = useAuth()
  const orgId = user?.organizationId ?? ''

  const { data: orgData } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-first',
  })

  const orgName = (orgData?.organization?.name as string | undefined)?.trim() ?? ''
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'User'

  return (
    <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-[#eef1f6] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/apps"
          className="inline-flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-85"
          title="All applications"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div className="hidden sm:block leading-tight min-w-0">
            <p className="text-sm font-semibold text-slate-900">Daxor ERP</p>
            {moduleName ? (
              <p className="text-xs font-medium text-teal-700 truncate max-w-[180px]">{moduleName}</p>
            ) : null}
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {orgName ? (
          <p
            className="hidden sm:block text-sm font-medium uppercase tracking-wide text-[#1e3a5f] truncate max-w-[280px] md:max-w-[420px] lg:max-w-[560px]"
            title={orgName}
          >
            {orgName}
          </p>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              title={displayName}
              aria-label={`User menu for ${displayName}`}
            >
              <span className="hidden md:inline text-sm font-medium text-slate-700 truncate max-w-[120px]">
                {displayName}
              </span>
              <span
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-md',
                  'bg-teal-600 text-sm font-semibold text-white shadow-sm',
                )}
              >
                {initials}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="leading-tight space-y-1">
                {orgName ? (
                  <p className="text-xs font-medium uppercase tracking-wide text-[#1e3a5f] leading-snug">
                    {orgName}
                  </p>
                ) : null}
                <p className="font-medium text-sm text-slate-900">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings"><User className="h-4 w-4 mr-2" /> My profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=preferences"><Settings className="h-4 w-4 mr-2" /> Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-slate-700">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
