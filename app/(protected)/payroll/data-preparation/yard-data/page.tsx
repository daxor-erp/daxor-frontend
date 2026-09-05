'use client'

import { useCallback } from 'react'
import { Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePayrollPrepRows } from '@/lib/payroll-data-prep-storage'
import { PayrollExcelGrid, type PrepColumn } from '@/components/payroll/payroll-excel-grid'

const FIELD_KEYS = [
  'employeeNo',
  'employeeName',
  'workDate',
  'yardOrGate',
  'timeIn',
  'timeOut',
  'normalHrs',
  'otHrs',
  'remarks',
] as const

const COLUMNS: PrepColumn[] = [
  { key: 'employeeNo', header: 'Employee no.', minWidth: '6.5rem' },
  { key: 'employeeName', header: 'Employee name', minWidth: '9rem' },
  { key: 'workDate', header: 'Work date', type: 'date', minWidth: '8rem' },
  { key: 'yardOrGate', header: 'Yard / gate', minWidth: '7rem' },
  { key: 'timeIn', header: 'Time in', type: 'time', minWidth: '6rem' },
  { key: 'timeOut', header: 'Time out', type: 'time', minWidth: '6rem' },
  { key: 'normalHrs', header: 'Normal hrs', type: 'number', minWidth: '5.5rem' },
  { key: 'otHrs', header: 'OT hrs', type: 'number', minWidth: '5rem' },
  { key: 'remarks', header: 'Remarks', minWidth: '10rem' },
]

export default function YardDataPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { rows, setRows, ready, addRow, removeLastRow, clearSheet, replaceRows } = usePayrollPrepRows({
    orgId,
    storageKey: 'yard-data',
    fieldKeys: FIELD_KEYS,
    minRows: 12,
  })

  const onCellChange = useCallback(
    (rowIndex: number, key: string, value: string) => {
      setRows((r) => r.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row)))
    },
    [setRows]
  )

  const emptyRow = useCallback(() => {
    const o: Record<string, string> = {}
    FIELD_KEYS.forEach((k) => (o[k] = ''))
    return o
  }, [])

  if (!orgId) {
    return <p className="erp-page-desc">Select an organization to use data preparation.</p>
  }

  if (!ready) {
    return <p className="erp-page-desc">Loading sheet…</p>
  }

  return (
    <div className="erp-shell">
      <div>
        <div className="flex items-center gap-2 text-slate-600 mb-1">
          <Briefcase className="h-6 w-6" />
          <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Data preparation</span>
        </div>
        <h1 className="erp-page-title">Yard data</h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Capture gate and yard attendance in a spreadsheet. Export to CSV for payroll runs or other tools.
        </p>
      </div>

      <PayrollExcelGrid
        sheetTitle="Yard & gate times — enter one row per employee per workday (or per shift, if you split lines)."
        sheetName="YardData"
        columns={COLUMNS}
        rows={rows}
        onCellChange={onCellChange}
        onAddRow={addRow}
        onRemoveLastRow={removeLastRow}
        onClear={clearSheet}
        onImportRows={replaceRows}
        emptyRow={emptyRow}
      />
    </div>
  )
}
