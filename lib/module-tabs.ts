import { NAVIGATION, type NavItem } from '@/lib/navigation'
import {
  filterNavigationByModuleView,
  type ErpNavItem,
  type ModulePermissionRow,
} from '@/lib/erp-module-access'
import { filterNavigationByPackageModules, type PackageEnabledModuleRow } from '@/lib/package-module-access'

export type ModuleTab = {
  name: string
  href: string
}

function collectAllHrefs(item: NavItem): string[] {
  const hrefs: string[] = []
  if (item.href) hrefs.push(item.href)
  if (item.subItems?.length) {
    for (const sub of item.subItems) {
      hrefs.push(...collectAllHrefs(sub))
    }
  }
  return hrefs
}

function flattenTabs(items: NavItem[], groupPrefix = ''): ModuleTab[] {
  const tabs: ModuleTab[] = []
  for (const item of items) {
    if (item.href) {
      tabs.push({
        name: groupPrefix ? `${groupPrefix} · ${item.name}` : item.name,
        href: item.href,
      })
    } else if (item.subItems?.length) {
      const nextPrefix = groupPrefix ? `${groupPrefix} · ${item.name}` : item.name
      tabs.push(...flattenTabs(item.subItems, nextPrefix))
    }
  }
  return tabs
}

export function getFilteredNavigation(
  modulePermissions: ModulePermissionRow[] | undefined,
  packageEnabledModules: PackageEnabledModuleRow[] | undefined,
  roles: string[] | undefined,
): NavItem[] {
  const byRole = filterNavigationByModuleView(
    NAVIGATION as unknown as ErpNavItem[],
    modulePermissions,
    roles,
  ) as NavItem[]

  return filterNavigationByPackageModules(
    byRole as ErpNavItem[],
    packageEnabledModules,
    roles,
  ) as NavItem[]
}

export function findActiveModule(pathname: string, navigation: NavItem[]): NavItem | null {
  let bestModule: NavItem | null = null
  let bestHrefLen = -1

  for (const item of navigation) {
    for (const href of collectAllHrefs(item)) {
      if (pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`)) {
        if (href.length > bestHrefLen) {
          bestHrefLen = href.length
          bestModule = item
        }
      }
    }
  }

  return bestModule
}

export function getModuleTabs(module: NavItem | null): ModuleTab[] {
  if (!module) return []
  if (module.subItems?.length) {
    return flattenTabs(module.subItems)
  }
  if (module.href) {
    return [{ name: module.name, href: module.href }]
  }
  return []
}

export function getActiveTabHref(pathname: string, tabs: ModuleTab[]): string | null {
  let best: string | null = null
  let bestLen = -1
  for (const tab of tabs) {
    if (pathname === tab.href || pathname.startsWith(`${tab.href}/`) || pathname.startsWith(`${tab.href}?`)) {
      if (tab.href.length > bestLen) {
        bestLen = tab.href.length
        best = tab.href
      }
    }
  }
  return best
}
