/**
 * Daxor ERP — Shared design system components
 * Used across every module page for visual consistency.
 *
 * Components:
 *   PageHeader      — Page title + breadcrumb + action buttons
 *   StatCard        — KPI metric tile (icon + value + label + optional trend)
 *   StatsRow        — Responsive grid of StatCards
 *   SectionPanel    — White card panel with optional title/actions
 *   ErpBadge        — Semantic status badge (ERP-aware colour mapping)
 *   ComingSoon      — Placeholder for unbuilt pages
 *   EmptyState      — Empty list placeholder
 *   AmountCell      — Right-aligned formatted currency cell
 *   MonoCell        — Monospace reference number cell
 *   DateCell        — Formatted date cell
 */

'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Clock, Construction, ArrowUp, ArrowDown, Minus } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// PageHeader
// ─────────────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  /** Breadcrumb segments: [{label, href?}] */
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, icon, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-1 text-[11px] text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="opacity-40">/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-primary transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────

type Trend = 'up' | 'down' | 'flat'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  /** Colour variant for the icon background */
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'violet' | 'teal' | 'slate' | 'orange'
  trend?: Trend
  trendLabel?: string
  className?: string
  onClick?: () => void
}

const VARIANT_CLS: Record<NonNullable<StatCardProps['variant']>, string> = {
  blue:   'bg-blue-50   text-blue-600   dark:bg-blue-950/40   dark:text-blue-400',
  green:  'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  amber:  'bg-amber-50  text-amber-600  dark:bg-amber-950/40  dark:text-amber-400',
  rose:   'bg-rose-50   text-rose-600   dark:bg-rose-950/40   dark:text-rose-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
  teal:   'bg-teal-50   text-teal-600   dark:bg-teal-950/40   dark:text-teal-400',
  slate:  'bg-slate-100 text-slate-600  dark:bg-slate-800     dark:text-slate-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
}

export function StatCard({ label, value, icon, variant = 'blue', trend, trendLabel, className, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-card p-4 elev-1 transition-shadow',
        onClick && 'cursor-pointer hover:elev-2',
        className,
      )}
      onClick={onClick}
    >
      {icon && (
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', VARIANT_CLS[variant])}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">{value}</p>
        {trend && (
          <div
            className={cn(
              'mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
              trend === 'up' && 'stat-trend-up',
              trend === 'down' && 'stat-trend-down',
              trend === 'flat' && 'stat-trend-flat',
            )}
          >
            {trend === 'up' && <ArrowUp className="h-2.5 w-2.5" />}
            {trend === 'down' && <ArrowDown className="h-2.5 w-2.5" />}
            {trend === 'flat' && <Minus className="h-2.5 w-2.5" />}
            {trendLabel}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// StatsRow
// ─────────────────────────────────────────────────────────────────────────────

interface StatsRowProps {
  children: ReactNode
  cols?: 2 | 3 | 4 | 5 | 6
  className?: string
}

const COLS_CLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}

export function StatsRow({ children, cols = 4, className }: StatsRowProps) {
  return (
    <div className={cn('grid gap-3', COLS_CLS[cols] ?? COLS_CLS[4], className)}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionPanel
// ─────────────────────────────────────────────────────────────────────────────

interface SectionPanelProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function SectionPanel({ title, description, actions, children, className, noPadding }: SectionPanelProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card elev-1 overflow-hidden', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <div>
            {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-4')}>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ErpBadge — semantic status colours for the ERP domain
// ─────────────────────────────────────────────────────────────────────────────

type BadgeTone =
  | 'draft' | 'pending' | 'submitted'
  | 'approved' | 'confirmed' | 'active' | 'received' | 'posted' | 'paid' | 'completed' | 'done' | 'delivered'
  | 'partial' | 'in_payment' | 'overdue'
  | 'rejected' | 'cancelled' | 'locked' | 'declined' | 'lost'
  | 'rfq' | 'sent' | 'quoted' | 'won'
  | 'default'

const BADGE_TONE: Record<BadgeTone, string> = {
  draft:        'bg-slate-100    text-slate-700   border-slate-200   dark:bg-slate-800  dark:text-slate-300',
  pending:      'bg-amber-50     text-amber-700   border-amber-200   dark:bg-amber-950/40 dark:text-amber-400',
  submitted:    'bg-sky-50       text-sky-700     border-sky-200     dark:bg-sky-950/40 dark:text-sky-400',
  rfq:          'bg-slate-100    text-slate-700   border-slate-200   dark:bg-slate-800  dark:text-slate-300',
  sent:         'bg-sky-50       text-sky-700     border-sky-200     dark:bg-sky-950/40 dark:text-sky-400',
  approved:     'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  confirmed:    'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  active:       'bg-blue-50      text-blue-700    border-blue-200    dark:bg-blue-950/40 dark:text-blue-400',
  received:     'bg-teal-50      text-teal-700    border-teal-200    dark:bg-teal-950/40 dark:text-teal-400',
  posted:       'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  paid:         'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  completed:    'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  done:         'bg-emerald-50   text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  delivered:    'bg-teal-50      text-teal-700    border-teal-200    dark:bg-teal-950/40 dark:text-teal-400',
  partial:      'bg-blue-50      text-blue-700    border-blue-200    dark:bg-blue-950/40 dark:text-blue-400',
  in_payment:   'bg-violet-50    text-violet-700  border-violet-200  dark:bg-violet-950/40 dark:text-violet-400',
  overdue:      'bg-rose-50      text-rose-700    border-rose-200    dark:bg-rose-950/40 dark:text-rose-400',
  rejected:     'bg-rose-50      text-rose-700    border-rose-200    dark:bg-rose-950/40 dark:text-rose-400',
  cancelled:    'bg-rose-50      text-rose-700    border-rose-200    dark:bg-rose-950/40 dark:text-rose-400',
  locked:       'bg-slate-100    text-slate-600   border-slate-200   dark:bg-slate-800  dark:text-slate-400',
  declined:     'bg-rose-50      text-rose-700    border-rose-200    dark:bg-rose-950/40 dark:text-rose-400',
  lost:         'bg-slate-100    text-slate-600   border-slate-200',
  quoted:       'bg-sky-50       text-sky-700     border-sky-200',
  won:          'bg-emerald-50   text-emerald-700 border-emerald-200',
  default:      'bg-slate-100    text-slate-600   border-slate-200',
}

function resolveTone(status?: string | null): BadgeTone {
  if (!status) return 'default'
  const s = status.toLowerCase().replace(/-/g, '_')
  if (s in BADGE_TONE) return s as BadgeTone
  if (s.includes('partial')) return 'partial'
  if (s.includes('paid')) return 'paid'
  if (s.includes('receiv')) return 'received'
  if (s.includes('approv')) return 'approved'
  if (s.includes('reject') || s.includes('declin') || s.includes('cancel')) return 'rejected'
  return 'default'
}

function formatStatusLabel(status?: string | null): string {
  if (!status) return '—'
  return status
    .replace(/_/g, ' ')
    .replace(/rfq/i, 'RFQ')
    .replace(/po\b/i, 'PO')
    .replace(/grn\b/i, 'GRN')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface ErpBadgeProps {
  status?: string | null
  label?: string
  className?: string
}

export function ErpBadge({ status, label, className }: ErpBadgeProps) {
  const tone = resolveTone(status)
  const text = label ?? formatStatusLabel(status)
  if (text === '—') return <span className="text-xs text-muted-foreground">—</span>
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap',
        BADGE_TONE[tone],
        className,
      )}
    >
      {text}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ComingSoon
// ─────────────────────────────────────────────────────────────────────────────

interface ComingSoonProps {
  title?: string
  description?: string
  eta?: string
}

export function ComingSoon({ title = 'Coming Soon', description, eta }: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-10 w-10" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description ?? "This module is being built and will be available soon. All backend flows are ready — the UI is coming next."}
        </p>
        {eta && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            {eta}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title = 'No records yet', description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-muted-foreground/50">{icon}</div>}
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AmountCell, MonoCell, DateCell — lightweight table cell renderers
// ─────────────────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function AmountCell({ value, currency = '₹', className }: { value?: number | string | null; currency?: string; className?: string }) {
  const n = Number(value ?? 0)
  return (
    <span className={cn('tabular-nums text-right block font-medium', className)}>
      {currency}&nbsp;{fmt.format(n)}
    </span>
  )
}

export function MonoCell({ value, className }: { value?: string | null; className?: string }) {
  if (!value) return <span className="text-muted-foreground text-xs">—</span>
  return (
    <span className={cn('font-mono text-xs text-muted-foreground', className)}>{value}</span>
  )
}

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export function DateCell({ value, className }: { value?: string | null; className?: string }) {
  if (!value) return <span className="text-xs text-muted-foreground">—</span>
  try {
    return <span className={cn('text-xs', className)}>{dateFmt.format(new Date(value))}</span>
  } catch {
    return <span className="text-xs text-muted-foreground">—</span>
  }
}
