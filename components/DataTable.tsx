'use client'

import { useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { shouldIgnoreRowClick } from '@/lib/data-table-row-click'
import { InputFloating } from '@/components/ui/input-floating'
import { Plus, Search, Filter, Download, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  sendForApprovalDataTableAction,
  type SendForApprovalDataTablePresetOptions,
  type SendForApprovalOrgStatusRow,
} from '@/lib/send-for-approval'

export interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface Action<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  show?: (row: T) => boolean
  disabled?: boolean | ((row: T) => boolean)
  /** Accessible hover text (falls back to `label`). */
  tooltip?: string | ((row: T) => string | undefined)
}

/** Inline `<R …>` on an object property breaks `.tsx` parsing (treated as JSX). */
export function commonSendForApprovalAction<R extends SendForApprovalOrgStatusRow>(
  options: SendForApprovalDataTablePresetOptions<R>,
): Action<R> {
  return sendForApprovalDataTableAction(options)
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  title?: string
  description?: string
  onAdd?: () => void
  addLabel?: string
  actions?: Action<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  exportable?: boolean
  onExport?: () => void
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  rowKey?: string
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  className?: string
  pageSize?: number
  /** Open edit/view panel when user clicks a row (not action buttons or inputs). */
  onRowClick?: (row: T) => void
  /** When false, rows are not clickable even if onRowClick is set. */
  isRowClickable?: (row: T) => boolean
  /** Nest inside SectionCard — no outer card chrome or duplicate title bar chrome. */
  embedded?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  title,
  description,
  onAdd,
  addLabel = 'Add New',
  actions = [],
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  exportable = false,
  onExport,
  emptyMessage = 'No records found',
  emptyIcon,
  rowKey = 'id',
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false,
  className = '',
  pageSize = 25,
  onRowClick,
  isRowClickable,
  embedded = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [page, setPage] = useState(0)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
    setPage(0)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setPage(0)
    if (onSearch) onSearch(query)
  }

  // Filter
  const filteredData = searchQuery && !onSearch
    ? data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  // Sort
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : filteredData

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pagedData = sortedData.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const from = sortedData.length === 0 ? 0 : safePage * pageSize + 1
  const to = Math.min((safePage + 1) * pageSize, sortedData.length)

  const handleRowClick = (row: T, event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick || shouldIgnoreRowClick(event, event.currentTarget)) return
    if (isRowClickable && !isRowClickable(row)) return
    onRowClick(row)
  }

  return (
    <div
      className={cn(
        'overflow-hidden',
        embedded
          ? 'bg-transparent border-0 shadow-none rounded-none'
          : 'bg-card border border-border rounded-lg shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between gap-2 px-4 py-3 border-b',
          embedded ? 'border-border bg-secondary/30' : 'border-border bg-muted/40',
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {title && <span className="text-sm font-semibold text-foreground">{title}</span>}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
        <div className="flex items-center gap-2">
          {searchable && (
            <InputFloating
              type="text"
              label={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-8 w-52 text-xs"
            />
          )}
          {exportable && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-3.5 w-3.5 mr-1" />Export
            </Button>
          )}
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-3.5 w-3.5 mr-1" />{addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={cn('erp-table', bordered && 'border border-border')}>
          <thead>
            <tr className="border-b border-border bg-muted/70">
              <th className="w-8 border-r border-border py-2 text-center font-semibold text-muted-foreground">#</th>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap border-r border-border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground last:border-r-0',
                    column.sortable && 'cursor-pointer hover:bg-muted',
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="min-w-[10rem] px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (actions.length > 0 ? 1 : 0)}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (actions.length > 0 ? 1 : 0)}
                  className="py-10 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon || <Filter className="mb-2 h-7 w-7 opacity-30" />}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedData.map((row, rowIdx) => (
                <tr
                  key={row[rowKey] || rowIdx}
                  className={cn(
                    'border-b border-border',
                    striped && rowIdx % 2 === 1 ? 'bg-muted/40' : 'bg-card',
                    hoverable && 'transition-colors hover:bg-primary/5',
                    onRowClick && (!isRowClickable || isRowClickable(row)) && 'cursor-pointer',
                  )}
                  onClick={onRowClick ? (e) => handleRowClick(row, e) : undefined}
                  title={onRowClick && (!isRowClickable || isRowClickable(row)) ? 'Click to view or edit' : undefined}
                >
                  <td className="w-8 border-r border-border py-2 text-center text-xs text-muted-foreground/60">
                    {safePage * pageSize + rowIdx + 1}
                  </td>
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={cn(
                        'overflow-hidden border-r border-border px-3 py-2 text-sm last:border-r-0',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        !column.align && 'text-left',
                        compact && 'py-1.5',
                      )}
                    >
                      <div className="truncate">{column.render ? column.render(row[column.key], row) : row[column.key]}</div>
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-2 py-2">
                      <div className="flex min-w-[7.5rem] flex-wrap items-center justify-end gap-1">
                        {actions.map((action, actionIdx) => {
                          if (action.show && !action.show(row)) return null
                          const disabled =
                            typeof action.disabled === 'function' ? action.disabled(row) : Boolean(action.disabled)
                          const tip =
                            (typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip) ??
                            action.label
                          return (
                            <Button
                              key={actionIdx}
                              variant={action.variant || 'ghost'}
                              size="xs"
                              disabled={disabled}
                              title={tip}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!disabled) action.onClick(row)
                              }}
                              className={disabled ? 'cursor-not-allowed opacity-50' : undefined}
                            >
                              {action.icon ?? action.label}
                            </Button>
                          )
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination footer */}
      {!loading && sortedData.length > 0 && (
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            {from}–{to} of {sortedData.length} records
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage(0)}
                disabled={safePage === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              >«</button>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              ><ChevronLeft className="h-3.5 w-3.5" /></button>
              <span className="px-2 text-xs text-muted-foreground">
                Page {safePage + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              ><ChevronRight className="h-3.5 w-3.5" /></button>
              <button
                type="button"
                onClick={() => setPage(totalPages - 1)}
                disabled={safePage === totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              >»</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Common action presets
export const commonActions = {
  view: (onClick: (row: any) => void): Action => ({
    label: 'View',
    icon: <Eye className="h-3.5 w-3.5" />,
    onClick,
    variant: 'ghost',
  }),
  edit: (onClick: (row: any) => void): Action => ({
    label: 'Edit',
    icon: <Edit className="h-3.5 w-3.5" />,
    onClick,
    variant: 'ghost',
  }),
  delete: (onClick: (row: any) => void): Action => ({
    label: 'Delete',
    icon: <Trash2 className="h-3.5 w-3.5" />,
    onClick,
    variant: 'ghost',
  }),
  /** Row must include `orgApprovalStatus` when using default eligibility checks. */
  sendForApproval: commonSendForApprovalAction,
}

