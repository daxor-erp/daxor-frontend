'use client'

import { cn } from '@/lib/utils'
import { formatStatus, statusBadgeClass } from '@/lib/format-status'

type StatusBadgeProps = {
  status?: string | null
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = formatStatus(status)
  if (label === '—') {
    return <span className={cn('text-gray-400 text-xs', className)}>—</span>
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        statusBadgeClass(status),
        className,
      )}
    >
      {label}
    </span>
  )
}
