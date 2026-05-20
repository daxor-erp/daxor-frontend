'use client'

import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { PermissionTable } from './PermissionTable'
import type { SubmoduleCell } from './permission-types'
import { permKey } from './permission-types'

export type ModulePermissionCardProps = {
  moduleLabel: string
  moduleKey: string
  submodules: Array<{ submoduleKey: string; label: string }>
  defaultOpen?: boolean
  state: Record<string, SubmoduleCell>
  onChangeRow: (submoduleKey: string, next: SubmoduleCell) => void
  onSelectAllModule: (value: boolean) => void
}

export function ModulePermissionCard({
  moduleLabel,
  moduleKey,
  submodules,
  defaultOpen = false,
  state,
  onChangeRow,
  onSelectAllModule,
}: ModulePermissionCardProps) {
  const granted = submodules.filter(
    (s) => state[permKey(moduleKey, s.submoduleKey)]?.canView,
  ).length

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="group rounded-xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-lg shadow-black/20"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-800/50 transition-colors rounded-t-xl border-b border-slate-700/60">
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 tracking-tight">{moduleLabel}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {granted} of {submodules.length} submodules visible in navigation
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-teal-400/90 font-medium shrink-0">
          {submodules.length} rows
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 pt-1">
        <PermissionTable
          moduleKey={moduleKey}
          rows={submodules}
          state={state}
          onChangeRow={onChangeRow}
          onSelectAllModule={onSelectAllModule}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
