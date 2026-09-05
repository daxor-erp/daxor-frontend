'use client'

import { PageHeader } from '@/components/dashboard/section-card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/** Standard ERP list/detail page outer shell — use on every protected module page. */
export function ErpListPage({
  children,
  className,
  maxWidth = '1500px',
}: {
  children: ReactNode
  className?: string
  maxWidth?: string
}) {
  return (
    <div
      className={cn('erp-shell', className)}
      style={{ maxWidth }}
    >
      {children}
    </div>
  )
}

/** Page title + optional description/actions — required on every module list. */
export function ErpPageHeader(
  props: React.ComponentProps<typeof PageHeader> & { action?: React.ReactNode },
) {
  const { action, actions, ...rest } = props
  return <PageHeader {...rest} actions={actions ?? action} />
}

/** Responsive row of summary metrics (keep ≤4). */
export function ErpStatsGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const grid =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-3'
  return <div className={cn('grid gap-3', grid)}>{children}</div>
}
