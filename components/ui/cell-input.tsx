'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Dense worksheet cell input. Used in grid/spreadsheet-style screens
 * (warehouses, quotations lines, GRN lines, inventory worksheets) where
 * column headers carry the label and rows are tight (h-7). For standalone
 * forms outside a worksheet grid, use {@link InputFloating} instead.
 */
export type CellInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  /**
   * `transparent`: no own border/background — for Excel-like layouts where
   * a wrapping <td className={wsCell}> already paints the border (see
   * lib/worksheet-styles.ts). The input fills the cell.
   */
  transparent?: boolean
  inputClassName?: string
}

export const CellInput = React.forwardRef<HTMLInputElement, CellInputProps>(
  ({ invalid, transparent, className, inputClassName, ...rest }, ref) => (
    <input
      ref={ref}
      data-cell-input
      aria-invalid={invalid || undefined}
      className={cn(
        transparent
          ? 'w-full bg-transparent outline-none text-xs'
          : cn(
              'border outline-none focus:ring-1 text-xs px-2 h-7 w-full rounded-sm',
              invalid
                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                : 'border-gray-300 bg-white focus:ring-blue-400',
            ),
        className,
        inputClassName,
      )}
      {...rest}
    />
  ),
)
CellInput.displayName = 'CellInput'

export default CellInput
