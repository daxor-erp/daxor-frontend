'use client'

/**
 * Floating bulk-actions bar that appears at the bottom of the viewport when
 * one or more rows in a list are selected. Hooked to any selection state
 * managed by the parent page.
 *
 *   const [selected, setSelected] = useState<Set<string>>(new Set())
 *   ...
 *   <BulkActionsBar
 *     count={selected.size}
 *     onClear={() => setSelected(new Set())}
 *     actions={[
 *       { label: 'Export', icon: <Download />, onClick: exportCsv },
 *       { label: 'Delete', icon: <Trash2 />, onClick: bulkDelete, tone: 'danger' },
 *     ]}
 *   />
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface BulkAction {
  label: string
  icon?: ReactNode
  onClick: () => void
  tone?: 'default' | 'danger' | 'primary'
  disabled?: boolean
}

interface BulkActionsBarProps {
  count: number
  onClear: () => void
  actions: BulkAction[]
}

export function BulkActionsBar({ count, onClear, actions }: BulkActionsBarProps) {
  if (count === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-3 duration-150">
      <div className="rounded-2xl border border-border bg-card elev-3 shadow-2xl shadow-black/15 px-3 py-2 flex items-center gap-2">
        <div className="flex items-center gap-2 pr-2 border-r border-border">
          <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-full bg-primary text-primary-foreground px-2 text-xs font-semibold tabular-nums">
            {count}
          </span>
          <span className="text-sm font-medium">selected</span>
          <button
            type="button"
            onClick={onClear}
            className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
            aria-label="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {actions.map((a, i) => (
          <button
            key={i}
            type="button"
            disabled={a.disabled}
            onClick={a.onClick}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50',
              a.tone === 'danger' && 'text-rose-700 hover:bg-rose-50',
              a.tone === 'primary' && 'bg-primary text-primary-foreground hover:opacity-90',
              (!a.tone || a.tone === 'default') && 'text-foreground hover:bg-secondary',
            )}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Compact row checkbox helper to pair with BulkActionsBar. */
export function RowCheckbox({
  checked,
  onChange,
  ariaLabel = 'Select row',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  ariaLabel?: string
}) {
  return (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
    />
  )
}
