'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export type PermissionCheckboxProps = {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

export function PermissionCheckbox({
  checked,
  onCheckedChange,
  disabled,
  'aria-label': ariaLabel,
}: PermissionCheckboxProps) {
  return (
    <div className="flex justify-center">
      <Checkbox
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'h-4 w-4 rounded border-slate-500 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500',
        )}
        onCheckedChange={(x) => onCheckedChange(x === true)}
      />
    </div>
  )
}
