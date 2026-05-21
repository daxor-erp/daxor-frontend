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

const TONE_BG: Record<StatCardTone, string> = {
  brand: 'bg-grad-brand',
  sky: 'bg-grad-sky',
  emerald: 'bg-grad-emerald',
  violet: 'bg-grad-violet',
  rose: 'bg-grad-rose',
  warn: 'bg-grad-warn',
  accent: 'bg-grad-accent',
  slate: 'bg-grad-slate',
}

const TONE_ICON_BG: Record<StatCardTone, string> = {
  brand: 'bg-primary-soft text-primary',
  sky: 'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-600',
  warn: 'bg-amber-50 text-amber-600',
  accent: 'bg-teal-50 text-teal-600',
  slate: 'bg-slate-100 text-slate-700',
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
  const Wrapper: any = href ? 'a' : 'div'
  return (
    <Wrapper
      href={href}
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all flex h-full',
        filled
          ? cn('border-transparent text-white elev-2', TONE_BG[tone])
          : 'border-border bg-card elev-1 hover:elev-2',
        href && 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0',
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col flex-1 w-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'text-[11px] font-medium uppercase tracking-wider',
                filled ? 'text-white/80' : 'text-muted-foreground',
              )}
            >
              {label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-2 min-w-0">
              <p
                className={cn(
                  'text-lg sm:text-xl xl:text-[22px] font-bold leading-tight tabular-nums min-w-0',
                  filled ? 'text-white' : 'text-foreground',
                  loading && 'animate-pulse bg-muted text-transparent rounded',
                )}
              >
                {loading ? '••••' : value}
              </p>
            </div>
            {hint && (
              <p
                className={cn(
                  'mt-1 text-xs',
                  filled ? 'text-white/70' : 'text-muted-foreground',
                )}
              >
                {hint}
              </p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'shrink-0 rounded-xl p-2.5',
                filled ? 'bg-white/15 text-white' : TONE_ICON_BG[tone],
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-3 min-h-[28px]">
          {typeof delta === 'number' ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                filled
                  ? 'bg-white/15 text-white'
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
    </Wrapper>
  )
}

function Sparkline({ values, filled }: { values: number[]; filled?: boolean }) {
  const w = 88
  const h = 28
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
  const stroke = filled ? 'rgba(255,255,255,0.9)' : 'hsl(158 64% 36%)'
  const fill = filled ? 'rgba(255,255,255,0.25)' : 'hsl(158 64% 36% / 0.18)'
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
