'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ModuleTab } from '@/lib/module-tabs'

type ErpModuleTabsProps = {
  tabs: ModuleTab[]
  activeHref: string | null
}

export function ErpModuleTabs({ tabs, activeHref }: ErpModuleTabsProps) {
  if (tabs.length <= 1) return null

  return (
    <nav
      className="sticky top-[52px] z-20 shrink-0 border-b border-slate-200 bg-white"
      aria-label="Module sections"
    >
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 sm:px-4 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = activeHref === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-teal-600 text-white shadow-sm border border-teal-700'
                  : 'text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
