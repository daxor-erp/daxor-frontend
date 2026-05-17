/**
 * Currency formatting helpers. App-wide default is INR (₹) using the en-IN locale,
 * which formats large numbers in the Indian numbering system (lakhs/crores).
 */

export const APP_CURRENCY = 'INR' as const
export const APP_LOCALE = 'en-IN' as const

/** Formats a number as INR currency, e.g. 1,23,456.78 → ₹1,23,456.78 */
export function formatMoney(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return new Intl.NumberFormat(APP_LOCALE, {
    style: 'currency',
    currency: APP_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value)
}

/** Compact currency formatter for KPI tiles. Examples: ₹1.2L, ₹3.4Cr. */
export function formatMoneyCompact(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  const abs = Math.abs(value)
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')}Cr`
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2).replace(/\.?0+$/, '')}L`
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1).replace(/\.?0+$/, '')}K`
  return `₹${value.toFixed(0)}`
}

/** Plain numeric formatter using en-IN grouping (1,23,456). */
export function formatNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return new Intl.NumberFormat(APP_LOCALE, opts).format(value)
}

/** Bare number (no currency symbol, 2 decimals) — kept for back-compat. */
export function formatAmount(n: number | null | undefined): string {
  const value = Number.isFinite(Number(n)) ? Number(n) : 0
  return value.toLocaleString(APP_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const CURRENCY_SYMBOL = '₹'
