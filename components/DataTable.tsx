'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Plus, Search, Filter, Download, Trash2, Edit, Eye } from 'lucide-react'
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

  return (
    <div className={`bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center gap-3">
          {title && <span className="text-sm font-semibold text-gray-700">{title}</span>}
          {description && <span className="text-xs text-gray-500">{description}</span>}
        </div>
        <div className="flex items-center gap-2">
          {searchable && (
            <InputFloating
              type="text"
              label={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-7 text-xs w-48"
            />
          )}
          {exportable && (
            <Button variant="outline" size="sm" onClick={onExport} className="h-7 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />Export
            </Button>
          )}
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" />{addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div>
        {/* Header Row */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-300">
          <div className="w-8 border-r border-gray-300 py-2 flex items-center justify-center text-xs text-gray-400">#</div>
          {columns.map((column, idx) => (
            <div
              key={column.key}
              className={`border-r border-gray-300 last:border-r-0 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ${
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
              }`}
              style={{ width: column.width, flex: column.width ? undefined : 1 }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-1">
                {column.label}
                {column.sortable && sortConfig?.key === column.key && (
                  <span className="text-blue-600 text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          ))}
          {actions.length > 0 && (
            <div className="min-w-[10rem] px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
              Actions
            </div>
          )}
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            {emptyIcon || <Filter className="h-8 w-8 mb-2 opacity-30" />}
            <p className="text-xs">{emptyMessage}</p>
          </div>
        ) : (
          sortedData.map((row, rowIdx) => (
            <div
              key={row[rowKey] || rowIdx}
              className={`flex border-b border-gray-200 last:border-b-0 ${
                striped && rowIdx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
              } ${hoverable ? 'hover:bg-blue-50/30 transition-colors' : ''}`}
            >
              <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">
                {rowIdx + 1}
              </div>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-r border-gray-300 last:border-r-0 px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-left whitespace-nowrap ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-blue-600 text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <div className="min-w-[10rem] px-2 py-2 flex items-center justify-end gap-1 flex-wrap">
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
                        size="sm"
                        disabled={disabled}
                        title={tip}
                        onClick={() => !disabled && action.onClick(row)}
                        className={`h-6 px-2 text-xs ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {action.icon ?? action.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-12 text-gray-400 text-sm">Loading…</td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-12 text-gray-400">
                  {emptyIcon || <Filter className="h-8 w-8 mb-2 opacity-30 mx-auto" />}
                  <p className="text-xs">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              pagedData.map((row, rowIdx) => (
                <tr
                  key={row[rowKey] || rowIdx}
                  className={`border-b border-gray-200 last:border-b-0 ${
                    striped && rowIdx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                  } ${hoverable ? 'hover:bg-blue-50/30 transition-colors' : ''}`}
                >
                  <td className="border-r border-gray-200 text-center text-xs text-gray-300 py-2 w-8">
                    {safePage * pageSize + rowIdx + 1}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`border-r border-gray-200 last:border-r-0 px-3 py-2 text-xs overflow-hidden ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="truncate">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </div>
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-end gap-1 flex-wrap min-w-[7.5rem]">
                        {actions.map((action, actionIdx) => {
                          if (action.show && !action.show(row)) return null
                          return (
                            <Button
                              key={actionIdx}
                              variant={action.variant || 'ghost'}
                              size="sm"
                              onClick={() => action.onClick(row)}
                              title={action.label}
                              className="h-6 px-2 text-xs"
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
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-400">
            {from}–{to} of {sortedData.length} records
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={safePage === 0}
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              >«</button>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              ><ChevronLeft className="h-3 w-3" /></button>
              <span className="text-xs text-gray-600 px-2">
                Page {safePage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              ><ChevronRight className="h-3 w-3" /></button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={safePage === totalPages - 1}
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
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

