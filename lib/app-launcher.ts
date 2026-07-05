import type { LucideIcon } from 'lucide-react'
import { NAVIGATION, type NavItem } from '@/lib/navigation'
import {
  filterNavigationByModuleView,
  type ErpNavItem,
  type ModulePermissionRow,
} from '@/lib/erp-module-access'
import { filterNavigationByPackageModules, type PackageEnabledModuleRow } from '@/lib/package-module-access'
import { canViewInventoryOdooHref, INVENTORY_LAUNCHER } from '@/lib/inventory-nav-access'

export type LauncherApp = {
  name: string
  href: string
  icon: LucideIcon
}

function resolveNavHref(item: NavItem): string | undefined {
  if (item.href) return item.href
  if (item.subItems?.length) {
    for (const sub of item.subItems) {
      const href = resolveNavHref(sub)
      if (href) return href
    }
  }
  return undefined
}

export function getVisibleLauncherApps(
  modulePermissions: ModulePermissionRow[] | undefined,
  packageEnabledModules: PackageEnabledModuleRow[] | undefined,
  roles: string[] | undefined,
): LauncherApp[] {
  const byRole = filterNavigationByModuleView(
    NAVIGATION as unknown as ErpNavItem[],
    modulePermissions,
    roles,
  ) as NavItem[]

  const filtered = filterNavigationByPackageModules(
    byRole as ErpNavItem[],
    packageEnabledModules,
    roles,
  ) as NavItem[]

  const apps: LauncherApp[] = []

  for (const item of filtered) {
    const href = resolveNavHref(item)
    if (!href || !item.icon) continue
    apps.push({ name: item.name, href, icon: item.icon })
  }

  // Ensure Inventory launcher tile when user has inventory access (Odoo-style routes)
  if (!apps.some((a) => a.name === INVENTORY_LAUNCHER.name)) {
    const invNav = NAVIGATION.find((n) => n.moduleKey === 'inventory')
    if (
      invNav?.icon &&
      canViewInventoryOdooHref(INVENTORY_LAUNCHER.href, modulePermissions, roles)
    ) {
      const payablesIdx = apps.findIndex((a) => a.name === 'Payables')
      const invApp = {
        name: INVENTORY_LAUNCHER.name,
        href: INVENTORY_LAUNCHER.href,
        icon: invNav.icon as LucideIcon,
      }
      if (payablesIdx >= 0) apps.splice(payablesIdx + 1, 0, invApp)
      else apps.push(invApp)
    }
  }

  return apps
}
