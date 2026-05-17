'use client'

/**
 * Excel-like line items editor.
 *
 * Features:
 *  - Keyboard navigation (Arrow keys, Tab/Shift-Tab, Enter)
 *  - Paste from spreadsheet (TSV/CSV) populates multiple rows + cells
 *  - Inline cell editing with column types: text / number / money / select / date
 *  - Computed columns (auto-recalculated whenever inputs change)
 *  - Add row / duplicate row / delete row
 *  - Row totals + grand totals
 *  - Stable Row IDs for React reconciliation
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Plus, Trash2, Copy, Calculator, ClipboardPaste, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/format-money'

export type ColumnType = 'text' | 'number' | 'money' | 'select' | 'date'

export interface LineColumn<TRow = Record<string, any>> {
  key: string
  header: string
  type?: ColumnType
  width?: string
  /** Hidden flag (still part of the row data). */
  hidden?: boolean
  /** Read-only / computed cell (rendered, not editable). */
  readOnly?: boolean
  /** Options for type=select. */
  options?: Array<{ value: string; label: string } | string>
  /** Right-align (auto-on for number/money). */
  align?: 'left' | 'center' | 'right'
  /** Min cell width in px. */
  minWidth?: number
  /** Compute the cell value from the row (overrides stored value). */
  compute?: (row: TRow) => number | string
  /** Render a non-editable cell with custom JSX (overrides default formatter). */
  render?: (row: TRow) => ReactNode
  /** Optional placeholder for empty cells. */
  placeholder?: string
}

export interface LineItemsEditorProps<TRow extends Record<string, any> = Record<string, any>> {
  columns: LineColumn<TRow>[]
  rows: TRow[]
  onChange: (rows: TRow[]) => void
  /** Build a brand-new empty row (id assigned automatically). */
  buildRow: () => Omit<TRow, 'id'> & { id?: string }
  /** Hook fired before commit (e.g. recalc line total). Pure: receives a row, returns the patched row. */
  computeRow?: (row: TRow) => TRow
  /** Totals shown in the footer. Each entry sums one column. */
  totals?: Array<{ key: string; label: string; format?: 'money' | 'number' }>
  /** Min rows (creates empty rows up to this count, e.g. for an "Excel feel"). */
  minRows?: number
  /** Max rows (hard cap, default 500). */
  maxRows?: number
  className?: string
  label?: string
  description?: string
  /** Disable user editing. */
  disabled?: boolean
}

let _idCounter = 0
const nextRowId = () => `r${Date.now().toString(36)}${(_idCounter++).toString(36)}`

export function LineItemsEditor<TRow extends Record<string, any> = Record<string, any>>({
  columns,
  rows,
  onChange,
  buildRow,
  computeRow,
  totals,
  minRows = 1,
  maxRows = 500,
  className,
  label,
  description,
  disabled,
}: LineItemsEditorProps<TRow>) {
  const visibleColumns = useMemo(() => columns.filter((c) => !c.hidden), [columns])
  const [focused, setFocused] = useState<{ r: number; c: number } | null>(null)
  const cellRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({})

  // Ensure rows have ids and minRows is satisfied.
  useEffect(() => {
    let mutated = false
    const patched = rows.map((r) => {
      if (r && (r as any).id) return r
      mutated = true
      return { ...(r ?? ({} as TRow)), id: nextRowId() } as TRow
    })
    while (patched.length < minRows) {
      patched.push(makeEmptyRow())
      mutated = true
    }
    if (mutated) onChange(patched)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const makeEmptyRow = useCallback((): TRow => {
    const base = buildRow()
    return { ...(base as TRow), id: nextRowId() }
  }, [buildRow])

  const commit = useCallback(
    (next: TRow[]) => {
      const out = computeRow ? next.map((r) => computeRow(r)) : next
      onChange(out)
    },
    [computeRow, onChange],
  )

  const updateCell = useCallback(
    (rowIndex: number, key: string, value: any) => {
      const next = rows.slice()
      next[rowIndex] = { ...next[rowIndex], [key]: value }
      commit(next)
    },
    [rows, commit],
  )

  const addRow = useCallback(() => {
    if (rows.length >= maxRows) return
    commit([...rows, makeEmptyRow()])
  }, [rows, makeEmptyRow, commit, maxRows])

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      const src = rows[rowIndex]
      if (!src) return
      if (rows.length >= maxRows) return
      const copy = { ...src, id: nextRowId() }
      const next = [...rows.slice(0, rowIndex + 1), copy, ...rows.slice(rowIndex + 1)]
      commit(next)
    },
    [rows, commit, maxRows],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      const next = rows.filter((_, i) => i !== rowIndex)
      while (next.length < minRows) next.push(makeEmptyRow())
      commit(next)
    },
    [rows, commit, makeEmptyRow, minRows],
  )

  const focusCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      const col = visibleColumns[colIndex]
      if (!col) return
      const key = `${rows[rowIndex]?.id ?? rowIndex}:${col.key}`
      const el = cellRefs.current[key]
      if (el) {
        el.focus()
        if ((el as HTMLInputElement).select) (el as HTMLInputElement).select?.()
      }
    },
    [rows, visibleColumns],
  )

  const handleKey = useCallback(
    (e: KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault()
          duplicateRow(rowIndex)
          return
        }
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (rowIndex === rows.length - 1) addRow()
        setTimeout(() => focusCell(rowIndex + 1, colIndex), 0)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusCell(Math.min(rows.length - 1, rowIndex + 1), colIndex)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusCell(Math.max(0, rowIndex - 1), colIndex)
        return
      }
      if (e.key === 'ArrowRight' && (e.currentTarget as HTMLInputElement).selectionStart === (e.currentTarget as HTMLInputElement).value?.length) {
        e.preventDefault()
        focusCell(rowIndex, Math.min(visibleColumns.length - 1, colIndex + 1))
        return
      }
      if (e.key === 'ArrowLeft' && (e.currentTarget as HTMLInputElement).selectionStart === 0) {
        e.preventDefault()
        focusCell(rowIndex, Math.max(0, colIndex - 1))
        return
      }
      if (e.key === 'Tab') {
        // Native tab order works fine — but if last cell, add a new row first.
        if (!e.shiftKey && rowIndex === rows.length - 1 && colIndex === visibleColumns.length - 1) {
          e.preventDefault()
          addRow()
          setTimeout(() => focusCell(rowIndex + 1, 0), 0)
        }
      }
    },
    [rows, visibleColumns, addRow, duplicateRow, focusCell],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, rowIndex: number, colIndex: number) => {
      const text = e.clipboardData.getData('text/plain')
      if (!text) return
      // Detect spreadsheet-style paste: has tab or newline
      if (!/[\t\n]/.test(text)) return // let single-value paste fall through
      e.preventDefault()
      const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length > 0 || l === '')
      const parsed = lines.map((l) => l.split('\t'))
      const next = rows.slice()
      for (let r = 0; r < parsed.length; r++) {
        const targetIndex = rowIndex + r
        if (targetIndex >= maxRows) break
        if (!next[targetIndex]) next[targetIndex] = makeEmptyRow()
        const row = { ...next[targetIndex] }
        for (let c = 0; c < parsed[r].length; c++) {
          const col = visibleColumns[colIndex + c]
          if (!col) break
          if (col.readOnly || col.compute) continue
          const raw = parsed[r][c]
          row[col.key as keyof TRow] = coerceValue(raw, col.type) as any
        }
        next[targetIndex] = row
      }
      commit(next)
    },
    [rows, visibleColumns, makeEmptyRow, commit, maxRows],
  )

  const totalsRow = useMemo(() => {
    if (!totals || totals.length === 0) return null
    const sums: Record<string, number> = {}
    for (const t of totals) sums[t.key] = 0
    for (const r of rows) {
      for (const t of totals) {
        const col = columns.find((c) => c.key === t.key)
        const v = col?.compute ? Number(col.compute(r)) : Number(r[t.key] ?? 0)
        if (Number.isFinite(v)) sums[t.key] += v
      }
    }
    return sums
  }, [rows, totals, columns])

  return (
    <div className={cn('space-y-2', className)}>
      {(label || description) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {label && <h3 className="text-sm font-semibold tracking-tight">{label}</h3>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ClipboardPaste className="h-3 w-3" /> Paste from Excel supported
            </span>
            <span className="inline-flex items-center gap-1">
              <Calculator className="h-3 w-3" /> Totals auto-calc
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/60">
                <th className="sticky left-0 z-[1] w-9 px-1 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/60 border-r border-border" />
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    style={{ minWidth: col.minWidth ?? 110, width: col.width }}
                    className={cn(
                      'px-2.5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-left border-r border-border last:border-r-0',
                      (col.align ?? (col.type === 'number' || col.type === 'money' ? 'right' : 'left')) === 'right' && 'text-right',
                      (col.align ?? '') === 'center' && 'text-center',
                    )}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="w-20 px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right bg-secondary/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No rows yet. Click <strong>+ Add row</strong> to begin.
                  </td>
                </tr>
              ) : rows.map((row, rIdx) => (
                <tr
                  key={(row as any).id ?? rIdx}
                  className={cn(
                    'border-t border-border hover:bg-secondary/30 transition-colors',
                    focused?.r === rIdx && 'bg-primary-soft/30',
                  )}
                >
                  <td className="sticky left-0 z-[1] bg-card group-hover:bg-secondary/30 w-9 px-1 py-1 text-center text-[10px] tabular-nums text-muted-foreground border-r border-border">
                    <div className="flex items-center justify-center gap-1">
                      <GripVertical className="h-3 w-3 opacity-40" />
                      <span>{rIdx + 1}</span>
                    </div>
                  </td>
                  {visibleColumns.map((col, cIdx) => {
                    const stored = (row as any)[col.key]
                    const computed = col.compute ? col.compute(row) : undefined
                    const value = computed != null ? computed : stored
                    const align = col.align ?? (col.type === 'number' || col.type === 'money' ? 'right' : 'left')
                    const id = `${(row as any).id ?? rIdx}:${col.key}`
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'p-0 border-r border-border last:border-r-0 align-middle',
                          align === 'right' && 'text-right',
                          align === 'center' && 'text-center',
                        )}
                      >
                        {col.render ? (
                          <div className="px-2.5 py-2">{col.render(row)}</div>
                        ) : col.readOnly || col.compute ? (
                          <div className={cn('px-2.5 py-2 text-sm tabular-nums', col.type === 'money' && 'font-medium')}>
                            {col.type === 'money'
                              ? formatMoney(Number(value ?? 0))
                              : value == null || value === ''
                                ? <span className="text-muted-foreground">—</span>
                                : String(value)}
                          </div>
                        ) : col.type === 'select' ? (
                          <select
                            ref={(el) => { cellRefs.current[id] = el }}
                            value={String(stored ?? '')}
                            onFocus={() => setFocused({ r: rIdx, c: cIdx })}
                            onBlur={() => setFocused((f) => (f?.r === rIdx && f?.c === cIdx ? null : f))}
                            onChange={(e) => updateCell(rIdx, col.key, e.target.value)}
                            onKeyDown={(e) => handleKey(e as any, rIdx, cIdx)}
                            disabled={disabled}
                            className={cn(
                              'w-full h-9 px-2.5 bg-transparent border-0 outline-none text-sm focus:bg-primary-soft/40',
                            )}
                          >
                            <option value="">{col.placeholder ?? '—'}</option>
                            {(col.options ?? []).map((opt) => {
                              const o = typeof opt === 'string' ? { value: opt, label: opt } : opt
                              return (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              )
                            })}
                          </select>
                        ) : (
                          <input
                            ref={(el) => { cellRefs.current[id] = el }}
                            type={col.type === 'number' || col.type === 'money' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                            inputMode={col.type === 'number' || col.type === 'money' ? 'decimal' : undefined}
                            step={col.type === 'money' ? '0.01' : col.type === 'number' ? 'any' : undefined}
                            value={stored == null ? '' : String(stored)}
                            placeholder={col.placeholder}
                            onFocus={() => setFocused({ r: rIdx, c: cIdx })}
                            onBlur={() => setFocused((f) => (f?.r === rIdx && f?.c === cIdx ? null : f))}
                            onChange={(e) =>
                              updateCell(rIdx, col.key, coerceValue(e.target.value, col.type))
                            }
                            onKeyDown={(e) => handleKey(e, rIdx, cIdx)}
                            onPaste={(e) => handlePaste(e, rIdx, cIdx)}
                            disabled={disabled}
                            className={cn(
                              'w-full h-9 px-2.5 bg-transparent border-0 outline-none text-sm tabular-nums focus:bg-primary-soft/40',
                              align === 'right' && 'text-right',
                              align === 'center' && 'text-center',
                            )}
                          />
                        )}
                      </td>
                    )
                  })}
                  <td className="w-20 px-1 py-1 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => duplicateRow(rIdx)}
                        disabled={disabled}
                        title="Duplicate row (Ctrl/Cmd+D)"
                        className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(rIdx)}
                        disabled={disabled}
                        title="Delete row"
                        className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {totals && totalsRow && (
              <tfoot>
                <tr className="bg-secondary/60 border-t-2 border-border">
                  <td className="px-2 py-2 text-right text-xs font-medium text-muted-foreground" colSpan={1}>
                    Σ
                  </td>
                  {visibleColumns.map((col) => {
                    const t = totals.find((x) => x.key === col.key)
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'px-2.5 py-2 text-sm font-semibold tabular-nums border-r border-border last:border-r-0',
                          (col.align ?? (col.type === 'number' || col.type === 'money' ? 'right' : 'left')) === 'right' && 'text-right',
                        )}
                      >
                        {t
                          ? t.format === 'money'
                            ? formatMoney(totalsRow[t.key] ?? 0)
                            : (totalsRow[t.key] ?? 0).toLocaleString('en-IN')
                          : ''}
                      </td>
                    )
                  })}
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary/30 px-3 py-2">
          <button
            type="button"
            onClick={addRow}
            disabled={disabled || rows.length >= maxRows}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add row
          </button>
          <p className="text-[11px] text-muted-foreground">
            {rows.length} row{rows.length === 1 ? '' : 's'} · Enter ↓ · Tab → · Ctrl/Cmd-D duplicates · Paste from Excel
          </p>
        </div>
      </div>
    </div>
  )
}

function coerceValue(raw: string, type?: ColumnType): any {
  if (raw == null) return ''
  const s = String(raw).trim()
  if (type === 'number' || type === 'money') {
    const cleaned = s.replace(/[, ₹$]/g, '')
    if (cleaned === '') return ''
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return s
}
