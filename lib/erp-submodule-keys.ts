import { NAVIGATION, type NavItem } from '@/lib/navigation'

/** Stable key for a nav leaf href — must match backend `mutation-erp-permission-map` submodule keys. */
export function hrefToSubmoduleKey(href: string): string {
  const t = href.replace(/^\//, '').replace(/\//g, '_').replace(/-/g, '_')
  return t || 'root'
}

export type SubmoduleLeafDef = {
  moduleKey: string
  submoduleKey: string
  label: string
  href: string
}

function walkNav(items: NavItem[], inheritedModule: string | undefined, out: SubmoduleLeafDef[]) {
  for (const item of items) {
    const moduleKey = item.moduleKey ?? inheritedModule
    if (item.href && moduleKey) {
      out.push({
        moduleKey,
        submoduleKey: hrefToSubmoduleKey(item.href),
        label: item.name,
        href: item.href,
      })
    }
    if (item.subItems?.length) {
      walkNav(item.subItems, moduleKey, out)
    }
  }
}

/** Every link-based ERP feature for ACL (flat list). */
export function getAllSubmoduleLeaves(): SubmoduleLeafDef[] {
  const out: SubmoduleLeafDef[] = []
  walkNav(NAVIGATION, undefined, out)
  return out
}

export type ErpPermissionModuleGroup = {
  moduleKey: string
  /** Parent nav label (e.g. \"Sales\") */
  label: string
  submodules: SubmoduleLeafDef[]
}

/** Modules for org-admin matrix (excludes dashboard-only features if needed). */
export function getPermissionModuleGroups(excludeModuleKeys: Set<string> = new Set(['dashboard'])): ErpPermissionModuleGroup[] {
  const leaves = getAllSubmoduleLeaves().filter((l) => !excludeModuleKeys.has(l.moduleKey))
  const byModule = new Map<string, SubmoduleLeafDef[]>()
  for (const l of leaves) {
    const arr = byModule.get(l.moduleKey) ?? []
    arr.push(l)
    byModule.set(l.moduleKey, arr)
  }
  const topOrder = NAVIGATION.map((n) => n.moduleKey).filter(Boolean) as string[]
  const seen = new Set<string>()
  const groups: ErpPermissionModuleGroup[] = []
  for (const key of topOrder) {
    if (excludeModuleKeys.has(key) || seen.has(key)) continue
    const sub = byModule.get(key)
    if (!sub?.length) continue
    seen.add(key)
    const navItem = NAVIGATION.find((n) => n.moduleKey === key)
    groups.push({
      moduleKey: key,
      label: navItem?.name ?? key,
      submodules: sub.sort((a, b) => a.label.localeCompare(b.label)),
    })
  }
  for (const [moduleKey, submodules] of byModule) {
    if (seen.has(moduleKey) || excludeModuleKeys.has(moduleKey)) continue
    seen.add(moduleKey)
    groups.push({ moduleKey, label: moduleKey, submodules })
  }
  return groups
}
