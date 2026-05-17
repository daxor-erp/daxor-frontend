/**
 * Coerce a value (string ISO, numeric string epoch-ms, number, or Date) into a Date.
 * The backend serializes timestamps as numeric strings (e.g. "1778803200000")
 * which `new Date(v)` cannot parse — so we detect that case and parse as a number.
 */
export function toDate(value: unknown): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (/^-?\d+$/.test(trimmed)) {
      const d = new Date(Number(trimmed))
      return Number.isNaN(d.getTime()) ? null : d
    }
    const d = new Date(trimmed)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

export function formatDate(value: unknown, fallback = '—'): string {
  const d = toDate(value)
  return d ? d.toLocaleDateString() : fallback
}

export function formatDateTime(value: unknown, fallback = '—'): string {
  const d = toDate(value)
  return d ? d.toLocaleString() : fallback
}

/** ISO "yyyy-mm-dd" for HTML `<input type="date">`. */
export function toDateInputValue(value: unknown): string {
  const d = toDate(value)
  return d ? d.toISOString().split('T')[0] : ''
}
