'use client'

import { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type TableRowAction = {
  key: string
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
  /** Renders in destructive style (delete / cancel). */
  destructive?: boolean
  hidden?: boolean
}

/**
 * Dense ERP row actions: at most one primary CTA + overflow menu.
 * Stops click bubbling so row-open handlers don't fire.
 */
export function TableRowActions({
  primary,
  items,
  className,
}: {
  primary?: TableRowAction | null
  items?: TableRowAction[]
  className?: string
}) {
  const menu = (items ?? []).filter((a) => !a.hidden)
  const showPrimary = primary && !primary.hidden

  if (!showPrimary && menu.length === 0) return null

  return (
    <div
      className={cn('inline-flex items-center justify-end gap-1', className)}
      onClick={(e) => e.stopPropagation()}
    >
      {showPrimary && (
        <Button
          type="button"
          size="xs"
          variant="default"
          disabled={primary.disabled}
          title={primary.label}
          onClick={primary.onClick}
          className="max-w-[9.5rem] shrink-0"
        >
          {primary.icon}
          <span className="truncate">{primary.label}</span>
        </Button>
      )}
      {menu.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="xs"
              variant="outline"
              className="h-7 w-7 px-0"
              title="More actions"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[11rem]">
            {menu.map((item, i) => {
              const prev = menu[i - 1]
              const showSep = i > 0 && Boolean(item.destructive) && !prev?.destructive
              return (
                <div key={item.key}>
                  {showSep && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    disabled={item.disabled}
                    className={cn(
                      'gap-2 text-sm cursor-pointer',
                      item.destructive && 'text-destructive focus:text-destructive',
                    )}
                    onSelect={(e) => {
                      e.preventDefault()
                      if (!item.disabled) item.onClick()
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </DropdownMenuItem>
                </div>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
