/**
 * Inventory module top navigation (Odoo-style dropdown menus).
 * REVERT: delete this file and restore InventoryModuleNav usage in erp-module-shell.tsx
 */

export type InventoryNavItem = {
  name: string
  href: string
}

export type InventoryNavMenu = {
  name: string
  items: InventoryNavItem[]
}

export const INVENTORY_NAV_MENUS: InventoryNavMenu[] = [
  {
    name: 'Overview',
    items: [{ name: 'Overview', href: '/inventory' }],
  },
  {
    name: 'Products',
    items: [{ name: 'Products', href: '/inventory/products' }],
  },
]

export function isInventoryPath(pathname: string): boolean {
  return pathname === '/inventory' || pathname.startsWith('/inventory/')
}

export function getActiveInventoryMenu(pathname: string): string | null {
  for (const menu of INVENTORY_NAV_MENUS) {
    for (const item of menu.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return menu.name
      }
    }
  }
  return pathname === '/inventory' ? 'Overview' : null
}

export function getActiveInventoryHref(pathname: string): string | null {
  let best: string | null = null
  let bestLen = -1
  for (const menu of INVENTORY_NAV_MENUS) {
    for (const item of menu.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        if (item.href.length > bestLen) {
          bestLen = item.href.length
          best = item.href
        }
      }
    }
  }
  return best
}
