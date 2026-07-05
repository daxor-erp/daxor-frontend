import { getAllSubmoduleLeaves, hrefToSubmoduleKey } from '@/lib/erp-submodule-keys'
import { canViewInventoryOdooHref } from '@/lib/inventory-nav-access'

/** Top-level ERP sidebar modules — legacy + path rules */

export type ErpModuleKey =
  | 'dashboard'
  | 'production'
  | 'crm'
  | 'quotations'
  | 'sales'
  | 'purchases'
  | 'payables'
  | 'inventory'
  | 'products'
  | 'documents'
  | 'financial'
  | 'payroll'
  | 'hr'
  | 'customers'
  | 'banks'
  | 'reports'

export type ModulePermissionRow = {
  moduleKey: string
  /** When set, this row applies to a single nav leaf (href-derived key). */
  submoduleKey?: string | null
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canView: boolean
}

export const ERP_MODULE_DEFINITIONS: ReadonlyArray<{ key: ErpModuleKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'production', label: 'Production' },
  { key: 'crm', label: 'CRM' },
  { key: 'quotations', label: 'Quotations' },
  { key: 'sales', label: 'Sales' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'payables', label: 'Payables' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'products', label: 'Products' },
  { key: 'documents', label: 'Documents' },
  { key: 'financial', label: 'Financial' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'hr', label: 'HR' },
  { key: 'customers', label: 'Customers' },
  { key: 'banks', label: 'Banks' },
  { key: 'reports', label: 'Reports' },
]

/** URL prefixes → module (for coarse routing); submodule checks refine access. */
export const ERP_MODULE_PATH_RULES: ReadonlyArray<{ key: ErpModuleKey; prefixes: readonly string[] }> = [
  { key: 'dashboard', prefixes: ['/apps', '/dashboard', '/ai-assistant', '/documents', '/notifications', '/settings'] },
  { key: 'crm', prefixes: ['/clients', '/crm'] },
  { key: 'quotations', prefixes: ['/quotations'] },
  {
    key: 'sales',
    prefixes: ['/sales-returns', '/delivery-challan', '/sales'],
  },
  {
    key: 'purchases',
    prefixes: ['/vendors', '/projects', '/purchases', '/material-receipt', '/grn'],
  },
  { key: 'payables', prefixes: ['/payables'] },
  {
    key: 'production',
    prefixes: ['/production', '/production-planning', '/work-orders'],
  },
  {
    key: 'inventory',
    prefixes: [
      '/inventory-control',
      '/warehouse',
      '/stock-adjustments',
      '/stock-transfers',
      '/goods-receipt',
      '/inventory',
    ],
  },
  { key: 'products', prefixes: ['/products'] },
  { key: 'financial', prefixes: ['/general-ledger', '/cash-bank', '/financial'] },
  {
    key: 'payroll',
    prefixes: ['/payroll-management', '/salary-processing', '/payroll'],
  },
  { key: 'hr', prefixes: ['/hr', '/timesheets'] },
  { key: 'customers', prefixes: ['/customers'] },
  { key: 'banks', prefixes: ['/banks'] },
  { key: 'reports', prefixes: ['/reports'] },
]

const ALL_TRUE = { canCreate: true, canUpdate: true, canDelete: true, canView: true }
const ALL_FALSE = { canCreate: false, canUpdate: false, canDelete: false, canView: false }

export function bypassesModuleAcl(roles: string[] | undefined): boolean {
  const r = roles ?? []
  return r.some((x) => ['SUPER_ADMIN', 'ERP_ADMIN', 'ORG_ADMIN'].includes(x))
}

function isModuleGranular(moduleKey: string, rows: ModulePermissionRow[]): boolean {
  return rows.some((r) => r.moduleKey === moduleKey && r.submoduleKey)
}

/** Legacy: one row per moduleKey without submoduleKey. */
export function effectiveModulePermission(
  moduleKey: string,
  rows: ModulePermissionRow[] | undefined | null,
): { canCreate: boolean; canUpdate: boolean; canDelete: boolean; canView: boolean } {
  if (!rows?.length) return ALL_TRUE
  const row = rows.find((x) => x.moduleKey === moduleKey && !x.submoduleKey)
  if (!row) return ALL_TRUE
  return {
    canCreate: !!row.canCreate,
    canUpdate: !!row.canUpdate,
    canDelete: !!row.canDelete,
    canView: !!row.canView,
  }
}

/** Submodule-aware effective permission (strict when granular rows exist for the module). */
export function effectiveSubmodulePermission(
  moduleKey: string,
  submoduleKey: string,
  rows: ModulePermissionRow[] | undefined | null,
): { canCreate: boolean; canUpdate: boolean; canDelete: boolean; canView: boolean } {
  if (!rows?.length) return ALL_TRUE

  if (!isModuleGranular(moduleKey, rows)) {
    return effectiveModulePermission(moduleKey, rows)
  }

  const exact = rows.find((r) => r.moduleKey === moduleKey && r.submoduleKey === submoduleKey)
  if (exact) {
    return {
      canCreate: !!exact.canCreate,
      canUpdate: !!exact.canUpdate,
      canDelete: !!exact.canDelete,
      canView: !!exact.canView,
    }
  }
  const legacy = rows.find((r) => r.moduleKey === moduleKey && !r.submoduleKey)
  if (legacy) {
    return {
      canCreate: !!legacy.canCreate,
      canUpdate: !!legacy.canUpdate,
      canDelete: !!legacy.canDelete,
      canView: !!legacy.canView,
    }
  }
  return ALL_FALSE
}

export function canSubmoduleAction(
  moduleKey: string,
  submoduleKey: string,
  action: 'create' | 'update' | 'delete' | 'view',
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (bypassesModuleAcl(roles)) return true
  const p = effectiveSubmodulePermission(moduleKey, submoduleKey, rows)
  if (action === 'view') return p.canView
  if (action === 'create') return p.canCreate
  if (action === 'update') return p.canUpdate
  return p.canDelete
}

export function moduleKeysForPath(pathname: string): ErpModuleKey[] {
  const keys = new Set<ErpModuleKey>()
  for (const { key, prefixes } of ERP_MODULE_PATH_RULES) {
    for (const p of prefixes) {
      if (pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`)) {
        keys.add(key)
      }
    }
  }
  return [...keys]
}

/** All nav leaves whose href matches pathname (handles shared URLs e.g. /grn). */
export function submoduleTargetsForPath(pathname: string): { moduleKey: string; submoduleKey: string }[] {
  const leaves = getAllSubmoduleLeaves()
  let bestLen = -1
  for (const leaf of leaves) {
    const h = leaf.href
    if (pathname === h || pathname.startsWith(`${h}/`) || pathname.startsWith(`${h}?`)) {
      bestLen = Math.max(bestLen, h.length)
    }
  }
  if (bestLen < 0) return []
  return leaves
    .filter((leaf) => {
      const h = leaf.href
      return (
        h.length === bestLen &&
        (pathname === h || pathname.startsWith(`${h}/`) || pathname.startsWith(`${h}?`))
      )
    })
    .map((leaf) => ({ moduleKey: leaf.moduleKey, submoduleKey: leaf.submoduleKey }))
}

export function canViewPath(
  pathname: string,
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (bypassesModuleAcl(roles)) return true
  if (canViewInventoryOdooHref(pathname, rows, roles)) return true

  const targets = submoduleTargetsForPath(pathname)
  if (targets.length > 0) {
    return targets.some((t) => effectiveSubmodulePermission(t.moduleKey, t.submoduleKey, rows).canView)
  }

  const keys = moduleKeysForPath(pathname)
  if (keys.length === 0) return true
  return keys.some((k) => effectiveModulePermission(k, rows).canView)
}

export type ErpNavItem = {
  name?: string
  moduleKey?: string
  href?: string
  icon?: unknown
  subItems?: ErpNavItem[]
}

function navItemSubmoduleKey(href: string): string {
  return hrefToSubmoduleKey(href)
}

function canViewNavHref(
  href: string,
  moduleKey: string,
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (moduleKey === 'inventory' && canViewInventoryOdooHref(href, rows, roles)) {
    return true
  }
  const sk = navItemSubmoduleKey(href)
  return effectiveSubmodulePermission(moduleKey, sk, rows).canView
}

export function filterNavigationByModuleView(
  items: ErpNavItem[],
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): ErpNavItem[] {
  if (bypassesModuleAcl(roles)) return items

  const filterRecursive = (nodes: ErpNavItem[], inheritedModuleKey?: string): ErpNavItem[] => {
    const out: ErpNavItem[] = []
    for (const item of nodes) {
      const moduleKey = item.moduleKey ?? inheritedModuleKey
      const children = item.subItems ? filterRecursive(item.subItems, moduleKey) : undefined

      if (item.href && moduleKey) {
        if (!canViewNavHref(item.href, moduleKey, rows, roles)) continue
        out.push({ ...item, subItems: children })
        continue
      }

      if (item.subItems?.length) {
        if (!children?.length) continue
        out.push({ ...item, subItems: children })
        continue
      }

      if (!moduleKey) {
        out.push({ ...item, subItems: children })
      }
    }
    return out
  }

  return filterRecursive(items)
}
