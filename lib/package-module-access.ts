import type { ErpNavItem } from '@/lib/erp-module-access'
import { getAllSubmoduleLeaves, hrefToSubmoduleKey } from '@/lib/erp-submodule-keys'
import { packageModuleKey } from '@/lib/package-nav-groups'
import { isInventoryOdooHrefPackageAllowed } from '@/lib/inventory-nav-access'

export type PackageEnabledModuleRow = {
  moduleKey: string
  submoduleKey: string
}

export function bypassesPackageModuleFilter(roles: string[] | undefined): boolean {
  const r = roles ?? []
  return r.some((x) => ['SUPER_ADMIN', 'ERP_ADMIN'].includes(x))
}

/** Restrict ERP navigation to modules enabled on the org's assigned package. */
export function filterNavigationByPackageModules(
  items: ErpNavItem[],
  enabledModules: PackageEnabledModuleRow[] | undefined | null,
  roles: string[] | undefined,
): ErpNavItem[] {
  if (bypassesPackageModuleFilter(roles)) return items
  if (!enabledModules?.length) return items

  const allowed = new Set(
    enabledModules.map((m) => packageModuleKey(m.moduleKey, m.submoduleKey)),
  )

  const filterRecursive = (nodes: ErpNavItem[], inheritedModuleKey?: string): ErpNavItem[] => {
    const out: ErpNavItem[] = []
    for (const item of nodes) {
      const moduleKey = item.moduleKey ?? inheritedModuleKey
      const children = item.subItems ? filterRecursive(item.subItems, moduleKey) : undefined

      if (item.href && moduleKey) {
        const sk = hrefToSubmoduleKey(item.href)
        const packageAllowed =
          moduleKey === 'inventory' && isInventoryOdooHrefPackageAllowed(item.href, allowed)
            ? true
            : allowed.has(packageModuleKey(moduleKey, sk))
        if (!packageAllowed) continue
        out.push({ ...item, subItems: children })
        continue
      }

      if (item.subItems?.length) {
        if (!children?.length) continue
        out.push({ ...item, subItems: children })
        continue
      }

      if (!moduleKey) out.push({ ...item, subItems: children })
    }
    return out
  }

  return filterRecursive(items)
}

export function canViewPathWithPackage(
  pathname: string,
  enabledModules: PackageEnabledModuleRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (bypassesPackageModuleFilter(roles)) return true
  if (!enabledModules?.length) return true

  const allowed = new Set(
    enabledModules.map((m) => packageModuleKey(m.moduleKey, m.submoduleKey)),
  )

  const leaves = getAllSubmoduleLeaves()
  let bestLen = -1
  let best: { moduleKey: string; submoduleKey: string } | null = null

  for (const leaf of leaves) {
    const h = leaf.href
    if (pathname === h || pathname.startsWith(`${h}/`) || pathname.startsWith(`${h}?`)) {
      if (h.length >= bestLen) {
        bestLen = h.length
        best = { moduleKey: leaf.moduleKey, submoduleKey: leaf.submoduleKey }
      }
    }
  }

  if (!best) return true
  if (best.moduleKey === 'inventory' && isInventoryOdooHrefPackageAllowed(pathname, allowed)) {
    return true
  }
  return allowed.has(packageModuleKey(best.moduleKey, best.submoduleKey))
}
