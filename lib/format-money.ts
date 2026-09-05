/**
 * Currency formatting helpers.
 * App base currency is INR (₹). Display always uses INR for KPIs and money fields.
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
/** Company base / display currency for the ERP. */
export const DEFAULT_CURRENCY: CurrencyCode = 'INR'
export const APP_CURRENCY: CurrencyCode = DEFAULT_CURRENCY
export const APP_LOCALE = CURRENCY_META[DEFAULT_CURRENCY].locale

/** One-time: rewrite localStorage preference to INR when it was SGD/USD/etc. */
function migratePrefsToInr() {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ currency: DEFAULT_CURRENCY }))
      return
    }
    const prefs = JSON.parse(raw) as { currency?: string }
    if (prefs.currency !== DEFAULT_CURRENCY) {
      window.localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({ ...prefs, currency: DEFAULT_CURRENCY }),
      )
    }
  } catch { /* ignore */ }
}

export function getActiveCurrency(): CurrencyMeta {
  migratePrefsToInr()
  return CURRENCY_META[DEFAULT_CURRENCY]
}

/** Formats a number as INR. */
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

/** Compact INR formatter for KPI tiles (K / L / Cr). */
export function formatMoneyCompact(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  const m = getActiveCurrency()
  const abs = Math.abs(value)
  if (abs >= 1_00_00_000) return `${m.symbol}${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')}Cr`
  if (abs >= 1_00_000) return `${m.symbol}${(value / 1_00_000).toFixed(2).replace(/\.?0+$/, '')}L`
  if (abs >= 1_000) return `${m.symbol}${(value / 1_000).toFixed(1).replace(/\.?0+$/, '')}K`
  return `${m.symbol}${value.toFixed(0)}`
}

/** Plain numeric formatter using en-IN grouping. */
export function formatNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return new Intl.NumberFormat(getActiveCurrency().locale, opts).format(value)
}

export function formatAmount(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return value.toLocaleString(getActiveCurrency().locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function getCurrencySymbol(): string {
  return getActiveCurrency().symbol
}

/** @deprecated kept for back-compat — use getCurrencySymbol() instead. */
export const CURRENCY_SYMBOL = '₹'
