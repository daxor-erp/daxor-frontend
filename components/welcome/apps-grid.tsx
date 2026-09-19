'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NAVIGATION, type NavItem } from '@/lib/navigation'
import { filterNavigationByModuleView, type ErpNavItem } from '@/lib/erp-module-access'
import { filterNavigationByPackageModules } from '@/lib/package-module-access'
import {
  firstAppHref,
  navigationToWelcomeApps,
} from '@/lib/welcome-apps'
import { cn } from '@/lib/utils'

export function AppsGrid() {
  const { user } = useAuth()

  const apps = useMemo(() => {
    const byRole = filterNavigationByModuleView(
      NAVIGATION as unknown as ErpNavItem[],
      user?.modulePermissions,
      user?.roles,
    ) as NavItem[]
    const filtered = filterNavigationByPackageModules(
      byRole as ErpNavItem[],
      user?.packageEnabledModules,
      user?.roles,
    ) as NavItem[]
    return navigationToWelcomeApps(filtered)
  }, [user?.modulePermissions, user?.packageEnabledModules, user?.roles])

  if (apps.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-800">No apps available</p>
        <p className="mt-1 text-sm text-slate-500">
          Your account does not have access to any modules yet. Contact your administrator.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {apps.map((app) => {
        const Icon = app.icon
        const href = firstAppHref(app)
        const card = (
          <span className="group flex flex-col items-center gap-3 text-center">
            <span
              className={cn(
                'flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/80 transition duration-200',
                'group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] group-active:translate-y-0',
              )}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ backgroundColor: app.accent }}
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
            </span>
            <span className="max-w-[7.5rem] text-[13px] font-medium leading-snug text-slate-700">
              {app.name}
            </span>
          </span>
        )

        if (!href) {
          return (
            <div key={app.id} className="cursor-not-allowed opacity-50">
              {card}
            </div>
          )
        }

        return (
          <Link
            key={app.id}
            href={href}
            className="outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            {card}
          </Link>
        )
      })}
    </div>
  )
}
