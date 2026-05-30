import type { MouseEvent } from 'react'

/**
 * Ignore row open when the user clicked a real control inside the row.
 * Pass `event.currentTarget` as `rowElement` when the row itself uses role="button".
 */
export function shouldIgnoreRowClick(
  event: MouseEvent,
  rowElement?: EventTarget | null,
): boolean {
  const target = event.target as HTMLElement | null
  if (!target) return true
  if (target.closest('[data-stop-row-click]')) return true

  const row = rowElement as HTMLElement | null | undefined

  if (target.closest('button, a, input, select, textarea, label, [role="combobox"], [contenteditable="true"]')) {
    return true
  }

  const roleButton = target.closest('[role="button"]')
  if (roleButton && roleButton !== row) return true

  return false
}
