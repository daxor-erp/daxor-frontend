/** Top-level ERP sidebar modules — keys stored on users as modulePermissions[].moduleKey */

export type ErpModuleKey =
  | 'dashboard'
  | 'crm'
  | 'quotations'
  | 'sales'
  | 'purchases'
  | 'payables'
  | 'inventory'
  | 'products'
  | 'financial'
  | 'payroll'
  | 'hr'
  | 'customers'
  | 'banks'
  | 'reports'

export type ModulePermissionRow = {
  moduleKey: string
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canView: boolean
}

export const ERP_MODULE_DEFINITIONS: ReadonlyArray<{ key: ErpModuleKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'crm', label: 'CRM' },
  { key: 'quotations', label: 'Quotations' },
  { key: 'sales', label: 'Sales' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'payables', label: 'Payables' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'products', label: 'Products' },
  { key: 'financial', label: 'Financial' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'hr', label: 'HR' },
  { key: 'customers', label: 'Customers' },
  { key: 'banks', label: 'Banks' },
  { key: 'reports', label: 'Reports' },
]

/** URL prefixes → module (some URLs intentionally overlap, e.g. /grn). */
export const ERP_MODULE_PATH_RULES: ReadonlyArray<{ key: ErpModuleKey; prefixes: readonly string[] }> = [
  { key: 'dashboard', prefixes: ['/dashboard'] },
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
    key: 'inventory',
    prefixes: [
      '/inventory-control',
      '/warehouse',
      '/stock-adjustments',
      '/stock-transfers',
      '/goods-receipt',
      '/grn',
      '/inventory',
    ],
  },
  { key: 'products', prefixes: ['/products'] },
  { key: 'financial', prefixes: ['/general-ledger', '/cash-bank', '/financial'] },
  {
    key: 'payroll',
    prefixes: ['/payroll-management', '/salary-processing', '/payroll'],
  },
  { key: 'hr', prefixes: ['/hr'] },
  { key: 'customers', prefixes: ['/customers'] },
  { key: 'banks', prefixes: ['/banks'] },
  { key: 'reports', prefixes: ['/reports'] },
]

export function bypassesModuleAcl(roles: string[] | undefined): boolean {
  const r = roles ?? []
  return r.some((x) => ['SUPER_ADMIN', 'ERP_ADMIN', 'ORG_ADMIN'].includes(x))
}

export function effectiveModulePermission(
  moduleKey: string,
  rows: ModulePermissionRow[] | undefined | null,
): { canCreate: boolean; canUpdate: boolean; canDelete: boolean; canView: boolean } {
  const full = { canCreate: true, canUpdate: true, canDelete: true, canView: true }
  if (!rows?.length) return full
  const row = rows.find((x) => x.moduleKey === moduleKey)
  if (!row) return full
  return {
    canCreate: !!row.canCreate,
    canUpdate: !!row.canUpdate,
    canDelete: !!row.canDelete,
    canView: !!row.canView,
  }
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

export function canViewPath(
  pathname: string,
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (bypassesModuleAcl(roles)) return true
  const keys = moduleKeysForPath(pathname)
  if (keys.length === 0) return true
  return keys.some((k) => effectiveModulePermission(k, rows).canView)
}

/** Sidebar nodes: only top-level items carry moduleKey; nested shapes vary. */
export type ErpNavItem = {
  name?: string
  moduleKey?: string
  href?: string
  icon?: unknown
  subItems?: ErpNavItem[]
}

export function filterNavigationByModuleView(
  items: ErpNavItem[],
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): ErpNavItem[] {
  if (bypassesModuleAcl(roles)) return items
  return items.filter((item) => {
    if (!item.moduleKey) return true
    return effectiveModulePermission(item.moduleKey, rows).canView
  })
}
