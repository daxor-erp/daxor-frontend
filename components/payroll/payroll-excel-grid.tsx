'use client'

import { useId, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileUp, Plus, Rows, Trash2 } from 'lucide-react'
import { rowsToCsv, parseCsv } from '@/lib/payroll-data-prep-csv'
import { wsHeaderCell, wsCell } from '@/lib/worksheet-styles'

function excelColLabel(index: number): string {
  let n = index + 1
  let s = ''
  while (n > 0) {
    n--
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26)
  }
  return s
}

const inputCls =
  'w-full min-w-0 h-7 border-0 bg-transparent text-xs outline-none focus:ring-0 px-1.5 text-gray-900 placeholder:text-gray-300'

export type PrepColumn = {
  key: string
  header: string
  type?: 'text' | 'date' | 'time' | 'number' | 'select'
  options?: { value: string; label: string }[]
  minWidth?: string
}

type PayrollExcelGridProps = {
  sheetTitle: string
  sheetName: string
  columns: PrepColumn[]
  rows: Record<string, string>[]
  onCellChange: (rowIndex: number, key: string, value: string) => void
  onAddRow: () => void
  onRemoveLastRow: () => void
  onClear: () => void
  onImportRows: (rows: Record<string, string>[]) => void
  emptyRow: () => Record<string, string>
  toolbarExtra?: ReactNode
}

export function PayrollExcelGrid({
  sheetTitle,
  sheetName,
  columns,
  rows,
  onCellChange,
  onAddRow,
  onRemoveLastRow,
  onClear,
  onImportRows,
  emptyRow,
  toolbarExtra,
}: PayrollExcelGridProps) {
  const fileId = useId()

  const headerKeys = columns.map((c) => c.key)
  const headers = columns.map((c) => c.header)

  const downloadCsv = () => {
    const data = rows.map((r) => headerKeys.map((k) => (r[k] ?? '').trim()))
    const body = rowsToCsv(headers, data)
    const blob = new Blob([body], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${sheetName.replace(/\s+/g, '-').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const table = parseCsv(text)
      if (table.length === 0) return
      const first = table[0]!
      const matchCount = headerKeys.filter(
        (_, i) =>
          first[i] != null &&
          first[i]!.trim().toLowerCase() === headers[i]!.trim().toLowerCase()
      ).length
      const hasHeaderRow = matchCount >= Math.max(1, Math.ceil(headerKeys.length / 2))

      let startRow: number
      let colMap: number[]
      if (hasHeaderRow) {
        startRow = 1
        const head = first
        colMap = headerKeys.map((_, c) => {
          const want = headers[c]!.trim().toLowerCase()
          const j = head.findIndex((h) => h.trim().toLowerCase() === want)
          return j >= 0 ? j : c
        })
      } else {
        startRow = 0
        colMap = headerKeys.map((_, c) => c)
      }

      const out: Record<string, string>[] = []
      for (let r = startRow; r < table.length; r++) {
        const line = table[r]!
        const rec = emptyRow()
        let any = false
        headerKeys.forEach((key, c) => {
          const j = colMap[c]!
          const cell = line[j] != null ? String(line[j]).trim() : ''
          if (cell) any = true
          rec[key] = cell
        })
        if (any) out.push(rec)
      }
      if (out.length) onImportRows(out)
    }
    reader.readAsText(f)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white p-0.5 shadow-sm">
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={onAddRow}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Row
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onRemoveLastRow}
            title="Remove last row"
          >
            <Rows className="h-3.5 w-3.5 mr-1" />
            Last
          </Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs text-amber-800" onClick={onClear}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </div>
        <div className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white p-0.5 shadow-sm">
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={downloadCsv}>
            <Download className="h-3.5 w-3.5 mr-1" />
            CSV
          </Button>
          <label
            htmlFor={fileId}
            className="inline-flex h-8 cursor-pointer items-center rounded-md px-2 text-xs font-medium text-gray-800 hover:bg-gray-100"
          >
            <FileUp className="h-3.5 w-3.5 mr-1" />
            Import
            <input id={fileId} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFile} />
          </label>
        </div>
        {toolbarExtra}
      </div>

      <div
        className="rounded-t border border-b-0 border-gray-300 bg-gradient-to-b from-[#e7e6e6] to-[#d9d1c9] px-2 py-1.5 text-xs text-gray-800"
        style={{ fontFamily: 'Calibri, "Segoe UI", system-ui, sans-serif' }}
      >
        {sheetTitle}
      </div>

      <div className="border border-gray-300 border-t-0 bg-white overflow-x-auto shadow-sm">
        <div className="min-w-[720px]">
          {/* Column letters row */}
          <div
            className="grid text-[10px] text-gray-500 bg-[#f2f2f2] border-b border-gray-300"
            style={{
              gridTemplateColumns: `2.5rem ${columns.map((c) => c.minWidth ?? 'minmax(5rem,1fr)').join(' ')}`,
            }}
          >
            <div className="border-r border-gray-300 px-1 py-0.5" />
            {columns.map((_, i) => (
              <div
                key={i}
                className="border-r border-gray-300 last:border-r-0 px-1 py-0.5 text-center font-medium text-gray-600"
              >
                {excelColLabel(i)}
              </div>
            ))}
          </div>
          {/* Header row */}
          <div
            className="grid border-b-2 border-gray-400"
            style={{
              gridTemplateColumns: `2.5rem ${columns.map((c) => c.minWidth ?? 'minmax(5rem,1fr)').join(' ')}`,
            }}
          >
            <div className={wsHeaderCell + ' text-center text-gray-500'}>#</div>
            {columns.map((c) => (
              <div key={c.key} className={wsHeaderCell + ' text-left'}>
                {c.header}
              </div>
            ))}
          </div>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid border-b border-gray-200 hover:bg-sky-50/40"
              style={{
                gridTemplateColumns: `2.5rem ${columns.map((c) => c.minWidth ?? 'minmax(5rem,1fr)').join(' ')}`,
              }}
            >
              <div
                className={wsCell + ' text-center text-gray-400 tabular-nums text-[11px] bg-[#fafafa]'}
                style={{ fontFamily: 'Calibri, "Segoe UI", system-ui, sans-serif' }}
              >
                {rowIndex + 1}
              </div>
              {columns.map((c) => (
                <div key={c.key} className={wsCell + ' p-0'}>
                  {c.type === 'select' && c.options ? (
                    <select
                      className={inputCls + ' cursor-pointer'}
                      value={row[c.key] ?? ''}
                      onChange={(e) => onCellChange(rowIndex, c.key, e.target.value)}
                    >
                      <option value="">{/* blank */}</option>
                      {c.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={inputCls}
                      type={c.type === 'number' ? 'number' : c.type === 'date' ? 'date' : c.type === 'time' ? 'time' : 'text'}
                      value={row[c.key] ?? ''}
                      onChange={(e) => onCellChange(rowIndex, c.key, e.target.value)}
                      placeholder=""
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex border border-t-0 border-gray-300 rounded-b bg-[#f3f2f1] px-1 py-0.5 text-xs text-gray-700"
        style={{ fontFamily: 'Calibri, "Segoe UI", system-ui, sans-serif' }}
      >
        <span className="inline-block border border-gray-300 border-b-white bg-white px-2 py-0.5 -mb-px font-medium text-gray-800 shadow-sm">
          {sheetName}
        </span>
        <span className="px-2 py-0.5 text-gray-400">+</span>
      </div>
    </div>
  )
}
