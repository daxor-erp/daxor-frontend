'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NAVIGATION, type NavItem } from '@/lib/navigation'
import { filterNavigationByModuleView, type ErpNavItem } from '@/lib/erp-module-access'
import { filterNavigationByPackageModules } from '@/lib/package-module-access'
import {
  findActiveLeafHref,
  findModuleForPath,
  flattenNavLeaves,
} from '@/lib/welcome-apps'
import { WelcomeChromeHeader } from '@/components/welcome/welcome-chrome-header'
import { cn } from '@/lib/utils'

export function ModuleWorkspaceChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()

  const visibleNav = useMemo(() => {
    const byRole = filterNavigationByModuleView(
      NAVIGATION as unknown as ErpNavItem[],
      user?.modulePermissions,
      user?.roles,
    ) as NavItem[]
    return filterNavigationByPackageModules(
      byRole as ErpNavItem[],
      user?.packageEnabledModules,
      user?.roles,
    ) as NavItem[]
  }, [user?.modulePermissions, user?.packageEnabledModules, user?.roles])

  const moduleItem = useMemo(
    () => findModuleForPath(pathname, visibleNav),
    [pathname, visibleNav],
  )

  const leaves = useMemo(
    () => (moduleItem ? flattenNavLeaves(moduleItem) : []),
    [moduleItem],
  )

  const activeHref = useMemo(
    () => findActiveLeafHref(pathname, leaves),
    [pathname, leaves],
  )

  const showTabs = leaves.length > 1

  return (
    <div className="flex h-screen flex-col bg-white">
      <WelcomeChromeHeader showAppsHome title={moduleItem?.name} />
      {showTabs ? (
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <nav
            aria-label={`${moduleItem?.name ?? 'Module'} sections`}
            className="flex gap-0 overflow-x-auto px-2 sm:px-4 scrollbar-thin"
          >
            {leaves.map((leaf) => {
              const active = leaf.href === activeHref
              return (
                <Link
                  key={leaf.href}
                  href={leaf.href}
                  className={cn(
                    'relative shrink-0 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors',
                    active
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {leaf.name}
                  {active ? (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-slate-900" />
                  ) : null}
                </Link>
              )
            })}
          </nav>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  )
}
