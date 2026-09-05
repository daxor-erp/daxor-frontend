'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionCardProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  noPadding?: boolean
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  noPadding,
}: SectionCardProps) {
  const showHeader = Boolean(title || description || action)
  return (
    <section className={cn('rounded-lg border border-border bg-card shadow-sm', className)}>
      {showHeader && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <h3 className="erp-section-title">{title}</h3>}
            {description && <p className="erp-meta mt-0.5">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn(noPadding ? '' : 'p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  action,
  meta,
}: {
  title: string
  description?: string
  actions?: ReactNode
  /** Alias for `actions` (skill / older call sites). */
  action?: ReactNode
  meta?: ReactNode
}) {
  const end = actions ?? action
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="erp-page-title">{title}</h1>
        {description && <p className="erp-page-desc">{description}</p>}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
      {end && <div className="flex flex-wrap items-center gap-2">{end}</div>}
    </div>
  )
}
