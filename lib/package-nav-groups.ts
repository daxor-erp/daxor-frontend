import { NAVIGATION, type NavItem } from '@/lib/navigation'
import { hrefToSubmoduleKey, type SubmoduleLeafDef } from '@/lib/erp-submodule-keys'

export type PackageNavGroup = {
  label: string
  moduleKey: string
  items: SubmoduleLeafDef[]
}

function collectLeaves(item: NavItem, inheritedModuleKey: string | undefined, out: SubmoduleLeafDef[]) {
  const moduleKey = item.moduleKey ?? inheritedModuleKey
  if (item.href && moduleKey) {
    out.push({
      moduleKey,
      submoduleKey: hrefToSubmoduleKey(item.href),
      label: item.name,
      href: item.href,
    })
  }
  if (item.subItems?.length) {
    for (const sub of item.subItems) {
      collectLeaves(sub, moduleKey, out)
    }
  }
}

/** Top-level nav sections with all leaf modules for package assignment UI. */
export function getPackageNavGroups(): PackageNavGroup[] {
  return NAVIGATION.map((top) => {
    const items: SubmoduleLeafDef[] = []
    if (top.href && top.moduleKey) {
      items.push({
        moduleKey: top.moduleKey,
        submoduleKey: hrefToSubmoduleKey(top.href),
        label: top.name,
        href: top.href,
      })
    }
    if (top.subItems?.length) {
      for (const sub of top.subItems) {
        collectLeaves(sub, top.moduleKey, items)
      }
    }
    return {
      label: top.name,
      moduleKey: top.moduleKey ?? top.name.toLowerCase().replace(/\s+/g, '_'),
      items,
    }
  }).filter((g) => g.items.length > 0)
}

export function packageModuleKey(moduleKey: string, submoduleKey: string): string {
  return `${moduleKey}::${submoduleKey}`
}

export function enabledModulesToSet(
  rows: Array<{ moduleKey: string; submoduleKey: string }> | undefined | null,
): Set<string> {
  const set = new Set<string>()
  for (const row of rows ?? []) {
    if (row.moduleKey && row.submoduleKey) {
      set.add(packageModuleKey(row.moduleKey, row.submoduleKey))
    }
  }
  return set
}

export function setToEnabledModules(checked: Set<string>): Array<{ moduleKey: string; submoduleKey: string }> {
  const out: Array<{ moduleKey: string; submoduleKey: string }> = []
  for (const key of checked) {
    const [moduleKey, submoduleKey] = key.split('::')
    if (moduleKey && submoduleKey) out.push({ moduleKey, submoduleKey })
  }
  return out
}
