'use client'

import { useCallback } from 'react'
import { Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePayrollPrepRows } from '@/lib/payroll-data-prep-storage'
import { PayrollExcelGrid, type PrepColumn } from '@/components/payroll/payroll-excel-grid'

const FIELD_KEYS = [
  'employeeNo',
  'employeeName',
  'punchDate',
  'deviceId',
  'punchType',
  'punchTime',
  'terminal',
  'verified',
] as const

const COLUMNS: PrepColumn[] = [
  { key: 'employeeNo', header: 'Employee no.', minWidth: '6.5rem' },
  { key: 'employeeName', header: 'Employee name', minWidth: '9rem' },
  { key: 'punchDate', header: 'Punch date', type: 'date', minWidth: '8rem' },
  { key: 'deviceId', header: 'Device ID', minWidth: '7rem' },
  {
    key: 'punchType',
    header: 'Punch',
    type: 'select',
    options: [
      { value: 'IN', label: 'In' },
      { value: 'OUT', label: 'Out' },
      { value: 'BREAK_IN', label: 'Break in' },
      { value: 'BREAK_OUT', label: 'Break out' },
    ],
    minWidth: '6.5rem',
  },
  { key: 'punchTime', header: 'Time', type: 'time', minWidth: '6rem' },
  { key: 'terminal', header: 'Terminal', minWidth: '7rem' },
  {
    key: 'verified',
    header: 'Verified',
    type: 'select',
    options: [
      { value: 'Y', label: 'Yes' },
      { value: 'N', label: 'No' },
    ],
    minWidth: '5rem',
  },
]

export default function BiometricDataPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { rows, setRows, ready, addRow, removeLastRow, clearSheet, replaceRows } = usePayrollPrepRows({
    orgId,
    storageKey: 'biometric-data',
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
        <h1 className="erp-page-title">Biometric data</h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          One row per punch (or one row per day if you aggregate in your export). Use import to load vendor CSV
          files, then map columns to match the headers when you save from Excel.
        </p>
      </div>

      <PayrollExcelGrid
        sheetTitle="Biometric punch lines — include device and terminal to reconcile with time clocks."
        sheetName="Biometric"
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
