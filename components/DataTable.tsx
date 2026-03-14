'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter, Download, Trash2, Edit, Eye } from 'lucide-react'

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
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  // Filter data based on search
  const filteredData = searchQuery && !onSearch
    ? data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  // Sort data
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : filteredData

  const cellPadding = compact ? 'px-2 py-1.5' : 'px-3 py-2.5'

  return (
    <div className={`bg-white rounded-lg shadow-sm ${bordered ? 'border border-gray-300' : ''} ${className}`}>
      {/* Header */}
      {(title || description || onAdd || searchable || exportable) && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
              {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              )}
              {exportable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="h-9"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
              {onAdd && (
                <Button
                  size="sm"
                  onClick={onAdd}
                  className="h-9 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={column.key}
                  className={`${cellPadding} text-xs font-semibold text-gray-600 uppercase tracking-wide ${
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${
                    idx === 0 ? 'rounded-tl-lg' : idx === columns.length - 1 ? 'rounded-tr-lg' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className={`${cellPadding} text-xs font-semibold text-gray-600 uppercase tracking-wide text-right`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    <span className="ml-3 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    {emptyIcon || <Filter className="h-12 w-12 mb-3 opacity-30" />}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIdx) => (
                <tr
                  key={row[rowKey] || rowIdx}
                  className={`border-b border-gray-200 last:border-b-0 ${
                    striped && rowIdx % 2 === 1 ? 'bg-gray-50/50' : ''
                  } ${hoverable ? 'hover:bg-blue-50/30 transition-colors' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${cellPadding} text-sm ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className={`${cellPadding} text-right`}>
                      <div className="flex items-center justify-end gap-1">
                        {actions.map((action, actionIdx) => {
                          if (action.show && !action.show(row)) return null
                          return (
                            <Button
                              key={actionIdx}
                              variant={action.variant || 'ghost'}
                              size="sm"
                              onClick={() => action.onClick(row)}
                              className="h-7 px-2"
                            >
                              {action.icon}
                              <span className="ml-1 text-xs">{action.label}</span>
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

      {/* Footer with pagination can be added here */}
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
}
