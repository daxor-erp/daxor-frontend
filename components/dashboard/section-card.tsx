'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionCardProps {
  title: string
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
  return (
    <section className={cn('rounded-2xl border border-border bg-card elev-1', className)}>
      <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn(noPadding ? '' : 'p-5', bodyClassName)}>{children}</div>
    </section>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
