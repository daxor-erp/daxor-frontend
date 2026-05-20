/**
 * Currency formatting helpers. Active currency comes from user preferences
 * (`localStorage['daxor:preferences'].currency`). Defaults to INR.
 */

export type CurrencyCode = 'INR' | 'USD' | 'SGD' | 'MYR'

interface CurrencyMeta {
  code: CurrencyCode
  symbol: string
  locale: string
  compact: 'INDIAN' | 'WESTERN'
}

const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', compact: 'INDIAN' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', compact: 'WESTERN' },
  SGD: { code: 'SGD', symbol: 'S$', locale: 'en-SG', compact: 'WESTERN' },
  MYR: { code: 'MYR', symbol: 'RM', locale: 'en-MY', compact: 'WESTERN' },
}

const PREFS_KEY = 'daxor:preferences'
const DEFAULT_CURRENCY: CurrencyCode = 'INR'

export function getActiveCurrency(): CurrencyMeta {
  if (typeof window === 'undefined') return CURRENCY_META[DEFAULT_CURRENCY]
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    const code = raw ? (JSON.parse(raw) as { currency?: string }).currency : undefined
    if (code && code in CURRENCY_META) return CURRENCY_META[code as CurrencyCode]
  } catch { /* fall through */ }
  return CURRENCY_META[DEFAULT_CURRENCY]
}

export const APP_CURRENCY: CurrencyCode = DEFAULT_CURRENCY
export const APP_LOCALE = CURRENCY_META[DEFAULT_CURRENCY].locale

/** Formats a number using the active currency. */
export function formatMoney(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  const m = getActiveCurrency()
  return new Intl.NumberFormat(m.locale, {
    style: 'currency',
    currency: m.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value)
}

/** Compact currency formatter for KPI tiles. INR → L/Cr, others → K/M/B. */
export function formatMoneyCompact(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  const m = getActiveCurrency()
  const abs = Math.abs(value)
  if (m.compact === 'INDIAN') {
    if (abs >= 1_00_00_000) return `${m.symbol}${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')}Cr`
    if (abs >= 1_00_000) return `${m.symbol}${(value / 1_00_000).toFixed(2).replace(/\.?0+$/, '')}L`
    if (abs >= 1_000) return `${m.symbol}${(value / 1_000).toFixed(1).replace(/\.?0+$/, '')}K`
    return `${m.symbol}${value.toFixed(0)}`
  }
  if (abs >= 1_000_000_000) return `${m.symbol}${(value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')}B`
  if (abs >= 1_000_000) return `${m.symbol}${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (abs >= 1_000) return `${m.symbol}${(value / 1_000).toFixed(1).replace(/\.?0+$/, '')}K`
  return `${m.symbol}${value.toFixed(0)}`
}

/** Plain numeric formatter using the active locale grouping. */
export function formatNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return new Intl.NumberFormat(getActiveCurrency().locale, opts).format(value)
}

export function formatAmount(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return value.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function getCurrencySymbol(): string {
  return getActiveCurrency().symbol
}

/** @deprecated kept for back-compat — use getCurrencySymbol() instead. */
export const CURRENCY_SYMBOL = '₹'
