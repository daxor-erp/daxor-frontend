'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Dense worksheet cell select. Native <select> dressed to match
 * {@link CellInput} for grid/spreadsheet-style screens. Use the
 * `options` prop for simple option lists; pass `children` only when
 * you need optgroups or non-uniform option content.
 *
 * For standalone forms outside a worksheet grid, use {@link SelectFloating}.
 */
export type CellSelectOption = { value: string; label: string; disabled?: boolean }

export type CellSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  invalid?: boolean
  /** Same as {@link CellInput} `transparent` — let a wrapping td paint the cell. */
  transparent?: boolean
  options?: CellSelectOption[]
  placeholder?: string
  children?: React.ReactNode
}

export const CellSelect = React.forwardRef<HTMLSelectElement, CellSelectProps>(
  ({ invalid, transparent, className, options, placeholder, children, ...rest }, ref) => (
    <select
      ref={ref}
      data-cell-select
      aria-invalid={invalid || undefined}
      className={cn(
        transparent
          ? 'w-full bg-transparent outline-none text-xs appearance-none'
          : cn(
              'border outline-none focus:ring-1 text-xs px-2 h-7 w-full rounded-sm appearance-none bg-no-repeat',
              invalid
                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                : 'border-gray-300 bg-white focus:ring-blue-400',
            ),
        className,
      )}
      {...rest}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options
        ? options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))
        : children}
    </select>
  ),
)
CellSelect.displayName = 'CellSelect'

export default CellSelect
