'use client'

import { PageHeader } from '@/components/dashboard/section-card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/** Standard ERP list/detail page outer shell (matches delivery orders, dashboard modules). */
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
      className={cn('mx-auto w-full space-y-6 min-w-0 p-4 sm:p-6 lg:p-8', className)}
      style={{ maxWidth }}
    >
      {children}
    </div>
  )
}

export function ErpPageHeader(props: React.ComponentProps<typeof PageHeader>) {
  return <PageHeader {...props} />
}

/** Responsive row of summary metrics. */
export function ErpStatsGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const grid =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-3'
  return <div className={cn('grid gap-3 sm:gap-4', grid)}>{children}</div>
}
