'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  findActiveModule,
  getActiveTabHref,
  getFilteredNavigation,
  getModuleTabs,
} from '@/lib/module-tabs'
import { ErpTopHeader } from '@/components/erp-shell/erp-top-header'
import { ErpModuleTabs } from '@/components/erp-shell/erp-module-tabs'
import { InventoryModuleNav } from '@/components/erp-shell/inventory-module-nav'
import { isInventoryPath } from '@/lib/inventory-navigation'
import { ModulePastEntriesFab } from '@/components/module-past-entries-fab'

export function ErpModuleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()

  const navigation = useMemo(
    () =>
      getFilteredNavigation(
        user?.modulePermissions,
        user?.packageEnabledModules,
        user?.roles,
      ),
    [user?.modulePermissions, user?.packageEnabledModules, user?.roles],
  )

  const activeModule = useMemo(
    () => findActiveModule(pathname, navigation),
    [pathname, navigation],
  )

  const tabs = useMemo(() => getModuleTabs(activeModule), [activeModule])
  const activeTabHref = useMemo(() => getActiveTabHref(pathname, tabs), [pathname, tabs])
  const showInventoryNav = isInventoryPath(pathname) && activeModule?.moduleKey === 'inventory'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ErpTopHeader moduleName={activeModule?.name ?? null} />
      {showInventoryNav ? (
        <InventoryModuleNav pathname={pathname} />
      ) : (
        <ErpModuleTabs tabs={tabs} activeHref={activeTabHref} />
      )}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-slate-50">
        {children}
        <ModulePastEntriesFab />
      </main>
    </div>
  )
}
