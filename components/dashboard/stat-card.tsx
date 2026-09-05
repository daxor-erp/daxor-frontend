'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ReactNode } from 'react'

export type StatCardTone =
  | 'brand'
  | 'sky'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'warn'
  | 'accent'
  | 'slate'

const TONE_ICON_BG: Record<StatCardTone, string> = {
  brand: 'bg-primary/10 text-primary',
  sky: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-primary/10 text-primary',
  rose: 'bg-rose-50 text-rose-700',
  warn: 'bg-amber-50 text-amber-700',
  accent: 'bg-primary/10 text-primary',
  slate: 'bg-muted text-muted-foreground',
}

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
  delta?: number | null
  icon?: ReactNode
  tone?: StatCardTone
  variant?: 'plain' | 'filled'
  loading?: boolean
  spark?: number[]
  href?: string
}

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon,
  tone = 'brand',
  variant = 'plain',
  loading,
  spark,
  href,
}: StatCardProps) {
  const filled = variant === 'filled'
  const className = cn(
    'relative flex h-full overflow-hidden rounded-lg border transition-colors',
    filled
      ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
      : 'border-border bg-card shadow-sm hover:bg-muted/30',
    href && 'cursor-pointer',
  )
  const body = (
      <div className="flex w-full flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={cn('erp-label', filled && 'text-primary-foreground/80')}>{label}</p>
            <div className="mt-1 flex min-w-0 items-baseline gap-2">
              <p
                className={cn(
                  'min-w-0 text-xl font-semibold tabular-nums leading-tight',
                  filled ? 'text-primary-foreground' : 'text-foreground',
                  loading && 'animate-pulse rounded bg-muted text-transparent',
                )}
              >
                {loading ? '••••' : value}
              </p>
            </div>
            {hint && (
              <p className={cn('mt-1 text-xs', filled ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                {hint}
              </p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'shrink-0 rounded-md p-2',
                filled ? 'bg-primary-foreground/15 text-primary-foreground' : TONE_ICON_BG[tone],
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-auto flex min-h-[24px] items-center justify-between gap-3 pt-2">
          {typeof delta === 'number' ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium',
                filled
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : delta > 0
                    ? 'stat-trend-up'
                    : delta < 0
                      ? 'stat-trend-down'
                      : 'stat-trend-flat',
              )}
            >
              {delta > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : delta < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          ) : (
            <span />
          )}
          {spark && spark.length > 0 && <Sparkline values={spark} filled={filled} />}
        </div>
      </div>
  )
  if (href) {
    return (
      <a href={href} className={className}>
        {body}
      </a>
    )
  }
  return <div className={className}>{body}</div>
}

function Sparkline({ values, filled }: { values: number[]; filled?: boolean }) {
  const w = 72
  const h = 22
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const step = w / Math.max(values.length - 1, 1)
  const path = values
    .map((v, i) => {
      const x = i * step
      const y = h - ((v - min) / range) * h
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  const stroke = filled ? 'rgba(255,255,255,0.9)' : 'hsl(var(--primary))'
  const fill = filled ? 'rgba(255,255,255,0.25)' : 'hsl(var(--primary) / 0.15)'
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
