'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  INVENTORY_NAV_MENUS,
  getActiveInventoryHref,
  getActiveInventoryMenu,
} from '@/lib/inventory-navigation'

type InventoryModuleNavProps = {
  pathname: string
}

export function InventoryModuleNav({ pathname }: InventoryModuleNavProps) {
  const activeMenu = getActiveInventoryMenu(pathname)
  const activeHref = getActiveInventoryHref(pathname)

  return (
    <nav
      className="sticky top-[52px] z-20 shrink-0 flex items-center gap-1 border-b border-slate-200 bg-white px-3 sm:px-4 py-1.5"
      aria-label="Inventory navigation"
    >
      {INVENTORY_NAV_MENUS.map((menu) => {
        const isMenuActive = activeMenu === menu.name

        return (
          <DropdownMenu key={menu.name}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                  isMenuActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                {menu.name}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              {menu.items.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'w-full cursor-pointer text-sm',
                      activeHref === item.href && 'font-medium text-teal-700',
                    )}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}
    </nav>
  )
}
