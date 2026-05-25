'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PermissionRow } from './PermissionRow'
import type { SubmoduleCell } from './permission-types'
import { permKey } from './permission-types'

export type PermissionTableProps = {
  moduleKey: string
  rows: Array<{ submoduleKey: string; label: string }>
  state: Record<string, SubmoduleCell>
  onChangeRow: (submoduleKey: string, next: SubmoduleCell) => void
  onSelectAllModule: (value: boolean) => void
}

const FULL: SubmoduleCell = {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  canView: true,
}

const EMPTY: SubmoduleCell = {
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canView: false,
}

export function PermissionTable({
  moduleKey,
  rows,
  state,
  onChangeRow,
  onSelectAllModule,
}: PermissionTableProps) {
  const allSelected =
    rows.length > 0 &&
    rows.every((r) => {
      const c = state[permKey(moduleKey, r.submoduleKey)] ?? EMPTY
      return c.canCreate && c.canUpdate && c.canDelete && c.canView
    })

  return (
    <div className="max-h-[min(480px,55vh)] overflow-auto rounded-lg border border-slate-700/80">
      <Table>
        <TableHeader className="sticky top-0 z-20">
          <TableRow className="bg-slate-800 border-slate-700 hover:bg-slate-800">
            <TableHead className="text-slate-200 text-xs font-semibold uppercase tracking-wider w-[40%] bg-slate-800">
              Submodule
            </TableHead>
            <TableHead className="text-center text-slate-200 text-xs font-semibold uppercase bg-slate-800">
              Create
            </TableHead>
            <TableHead className="text-center text-slate-200 text-xs font-semibold uppercase bg-slate-800">
              Update
            </TableHead>
            <TableHead className="text-center text-slate-200 text-xs font-semibold uppercase bg-slate-800">
              Delete
            </TableHead>
            <TableHead className="text-center text-slate-200 text-xs font-semibold uppercase bg-slate-800">
              <div className="flex flex-col items-center gap-0.5">
                View
                <button
                  type="button"
                  onClick={() => onSelectAllModule(!allSelected)}
                  className="text-[10px] font-normal normal-case text-teal-400 hover:text-teal-300"
                >
                  {allSelected ? 'Clear module' : 'All module'}
                </button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-900/40">
          {rows.map((r) => (
            <PermissionRow
              key={r.submoduleKey}
              submoduleLabel={r.label}
              cell={state[permKey(moduleKey, r.submoduleKey)] ?? FULL}
              onChange={(next) => onChangeRow(r.submoduleKey, next)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
