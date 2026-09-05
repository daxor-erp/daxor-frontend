'use client'

import { useCallback } from 'react'
import { Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePayrollPrepRows } from '@/lib/payroll-data-prep-storage'
import { PayrollExcelGrid, type PrepColumn } from '@/components/payroll/payroll-excel-grid'

const FIELD_KEYS = [
  'employeeNo',
  'employeeName',
  'payComponent',
  'amountOrHours',
  'uom',
  'fromDate',
  'toDate',
  'remarks',
] as const

const COLUMNS: PrepColumn[] = [
  { key: 'employeeNo', header: 'Employee no.', minWidth: '6.5rem' },
  { key: 'employeeName', header: 'Employee name', minWidth: '9rem' },
  { key: 'payComponent', header: 'Pay component', minWidth: '8rem' },
  { key: 'amountOrHours', header: 'Amount / hours', type: 'number', minWidth: '7.5rem' },
  {
    key: 'uom',
    header: 'UoM',
    type: 'select',
    options: [
      { value: 'HOUR', label: 'Hours' },
      { value: 'DAY', label: 'Days' },
      { value: 'AMT', label: 'Amount' },
      { value: 'UNIT', label: 'Units' },
    ],
    minWidth: '6rem',
  },
  { key: 'fromDate', header: 'From date', type: 'date', minWidth: '8rem' },
  { key: 'toDate', header: 'To date', type: 'date', minWidth: '8rem' },
  { key: 'remarks', header: 'Remarks', minWidth: '10rem' },
]

export default function ManualEntryPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { rows, setRows, ready, addRow, removeLastRow, clearSheet, replaceRows } = usePayrollPrepRows({
    orgId,
    storageKey: 'manual-entry',
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
        <h1 className="erp-page-title">Manual entry</h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Enter adjustments, allowances, or hours when you do not have machine exports. UoM ties the number to
          hours, days, or currency, depending on your pay rules.
        </p>
      </div>

      <PayrollExcelGrid
        sheetTitle="Manual pay lines — one row per component line per employee (or split by date range as needed)."
        sheetName="ManualEntry"
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
