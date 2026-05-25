'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { PermissionCheckbox } from './PermissionCheckbox'
import type { SubmoduleCell } from './permission-types'

export type PermissionRowProps = {
  submoduleLabel: string
  cell: SubmoduleCell
  onChange: (next: SubmoduleCell) => void
}

export function PermissionRow({ submoduleLabel, cell, onChange }: PermissionRowProps) {
  const set = (field: keyof SubmoduleCell, value: boolean) => {
    let next = { ...cell, [field]: value }
    if (field === 'canView' && !value) {
      next = { ...next, canCreate: false, canUpdate: false, canDelete: false }
    }
    if (field !== 'canView' && value) {
      next = { ...next, canView: true }
    }
    onChange(next)
  }

  const rowAll = cell.canCreate && cell.canUpdate && cell.canDelete && cell.canView

  return (
    <TableRow className="border-slate-700/80 hover:bg-slate-800/40 transition-colors">
      <TableCell className="font-medium text-slate-100 text-sm py-2.5">
        <div className="flex items-center gap-2">
          <span>{submoduleLabel}</span>
          <button
            type="button"
            onClick={() =>
              onChange(
                rowAll
                  ? { canCreate: false, canUpdate: false, canDelete: false, canView: false }
                  : { canCreate: true, canUpdate: true, canDelete: true, canView: true },
              )
            }
            className="text-[10px] uppercase tracking-wide text-teal-400/90 hover:text-teal-300"
          >
            {rowAll ? 'Clear row' : 'All'}
          </button>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <PermissionCheckbox
          checked={cell.canCreate}
          disabled={!cell.canView}
          aria-label={`${submoduleLabel} create`}
          onCheckedChange={(v) => set('canCreate', v)}
        />
      </TableCell>
      <TableCell className="text-center">
        <PermissionCheckbox
          checked={cell.canUpdate}
          disabled={!cell.canView}
          aria-label={`${submoduleLabel} update`}
          onCheckedChange={(v) => set('canUpdate', v)}
        />
      </TableCell>
      <TableCell className="text-center">
        <PermissionCheckbox
          checked={cell.canDelete}
          disabled={!cell.canView}
          aria-label={`${submoduleLabel} delete`}
          onCheckedChange={(v) => set('canDelete', v)}
        />
      </TableCell>
      <TableCell className="text-center">
        <PermissionCheckbox
          checked={cell.canView}
          aria-label={`${submoduleLabel} view`}
          onCheckedChange={(v) => set('canView', v)}
        />
      </TableCell>
    </TableRow>
  )
}
