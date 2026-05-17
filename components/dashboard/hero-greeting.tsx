'use client'

import { Sparkles, Calendar, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function getGreeting(date: Date) {
  const h = date.getHours()
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export interface HeroCta {
  label: string
  href: string
}

export function HeroGreeting({
  name,
  orgName,
  primaryCta,
  secondaryCta,
  ctas,
}: {
  name?: string
  orgName?: string
  primaryCta?: HeroCta
  secondaryCta?: HeroCta
  /** Optional ordered list of CTAs. When provided, takes precedence over primaryCta/secondaryCta. First entry is styled as primary. */
  ctas?: HeroCta[]
}) {
  const resolvedCtas: HeroCta[] = ctas?.length
    ? ctas
    : [primaryCta, secondaryCta].filter(Boolean) as HeroCta[]
  const now = new Date()
  const greeting = getGreeting(now)
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="relative overflow-hidden rounded-2xl bg-grad-hero text-white elev-2">
      <div className="absolute inset-0 bg-dotgrid opacity-[0.1]" />
      <div
        className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(168 84% 45%), transparent)' }}
      />
      <div
        className="absolute -bottom-24 right-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(38 92% 55%), transparent)' }}
      />
      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Daxor ERP Workspace
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight">
            {greeting}
            {name ? `, ${name}` : ''} <span className="opacity-80">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/80">
            Here&apos;s what&apos;s happening
            {orgName ? ` at ${orgName}` : ''} today.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-white/75">
            <Calendar className="h-3.5 w-3.5" />
            {dateStr}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {resolvedCtas.map((cta, i) => (
            <Link
              key={`${cta.href}-${i}`}
              href={cta.href}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors',
                i === 0
                  ? 'bg-white font-semibold text-slate-900 hover:bg-white/90'
                  : 'border border-white/25 bg-white/5 font-medium text-white hover:bg-white/10 backdrop-blur-sm',
              )}
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ModuleTile({
  label,
  icon,
  count,
  href,
  tone = 'brand',
}: {
  label: string
  icon: React.ReactNode
  count?: number | string
  href: string
  tone?: 'brand' | 'sky' | 'emerald' | 'violet' | 'rose' | 'warn' | 'accent' | 'slate'
}) {
  const toneMap: Record<string, string> = {
    brand: 'bg-primary-soft text-primary',
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
    warn: 'bg-amber-50 text-amber-600',
    accent: 'bg-teal-50 text-teal-600',
    slate: 'bg-slate-100 text-slate-700',
  }
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 hover:elev-2 transition-all hover:-translate-y-0.5"
    >
      <div className={cn('rounded-lg p-2', toneMap[tone])}>{icon}</div>
      <div>
        <p className="text-sm font-semibold leading-tight">{label}</p>
        {count !== undefined && (
          <p className="text-xs text-muted-foreground tabular-nums mt-0.5">{count}</p>
        )}
      </div>
      <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}
