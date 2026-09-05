'use client'

import { cn } from '@/lib/utils'
import { formatStatus, statusBadgeClass } from '@/lib/format-status'

type StatusBadgeProps = {
  status?: string | null
  className?: string
  /** Override auto label from formatStatus. */
  label?: string
}

export function StatusBadge({ status, className, label }: StatusBadgeProps) {
  const resolved = label ?? formatStatus(status)
  if (resolved === '—') {
    return <span className={cn('text-xs text-muted-foreground', className)}>—</span>
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
        statusBadgeClass(status),
        className,
      )}
    >
      {resolved}
    </span>
  )
}
