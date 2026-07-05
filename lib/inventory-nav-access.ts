import type { ModulePermissionRow } from '@/lib/erp-module-access'
import { bypassesModuleAcl, effectiveModulePermission } from '@/lib/erp-module-access'
import { hrefToSubmoduleKey } from '@/lib/erp-submodule-keys'
import { packageModuleKey } from '@/lib/package-nav-groups'

/** Temporary Odoo-style inventory routes (see lib/inventory-navigation.ts). */
export function isInventoryOdooHref(href: string): boolean {
  return href === '/inventory' || href.startsWith('/inventory/products')
}

/** User can access new inventory shell if they have any inventory module permission. */
export function canViewInventoryOdooHref(
  href: string,
  rows: ModulePermissionRow[] | undefined | null,
  roles: string[] | undefined,
): boolean {
  if (!isInventoryOdooHref(href)) return false
  if (bypassesModuleAcl(roles)) return true
  if (!rows?.length) return true

  if (rows.some((r) => r.moduleKey === 'inventory' && r.canView)) {
    return true
  }

  return effectiveModulePermission('inventory', rows).canView
}

export function isInventoryOdooHrefPackageAllowed(
  href: string,
  allowed: Set<string>,
): boolean {
  if (!isInventoryOdooHref(href)) return false

  for (const key of allowed) {
    if (key.startsWith('inventory::')) return true
  }

  return allowed.has(packageModuleKey('inventory', hrefToSubmoduleKey(href)))
}

export const INVENTORY_LAUNCHER = {
  name: 'Inventory',
  href: '/inventory',
} as const
