'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getVisibleLauncherApps } from '@/lib/app-launcher'
import { cn } from '@/lib/utils'

export function AppLauncherGrid() {
  const { user } = useAuth()

  const apps = useMemo(
    () =>
      getVisibleLauncherApps(
        user?.modulePermissions,
        user?.packageEnabledModules,
        user?.roles,
      ),
    [user?.modulePermissions, user?.packageEnabledModules, user?.roles],
  )

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-slate-700">No applications available</p>
        <p className="mt-1 text-xs text-slate-500">Contact your administrator for module access.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="text-lg font-semibold text-teal-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-600">Select a module to get started</p>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {apps.map((app) => {
          const Icon = app.icon

          return (
            <Link
              key={app.name}
              href={app.href}
              className={cn(
                'group flex flex-col items-center gap-2.5 rounded-xl p-3 transition-colors',
                'hover:bg-teal-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300',
              )}
            >
              <div
                className={cn(
                  'flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-teal-100/80 bg-white shadow-sm',
                  'transition-shadow group-hover:border-teal-200 group-hover:shadow-md',
                )}
              >
                <Icon className="h-7 w-7 text-teal-700" strokeWidth={1.75} />
              </div>
              <span className="max-w-[88px] text-center text-[13px] font-medium leading-tight text-slate-700">
                {app.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
