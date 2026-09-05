'use client'

/**
 * Polished form modal wrapper. Used by "Add / Edit" flows across the ERP so
 * they have consistent header, scroll behavior, sticky footer and keyboard
 * shortcuts (Esc to close, Cmd/Ctrl+S to save).
 *
 * Layout:
 *  ┌──────────────────────────────────────────┐
 *  │ icon  Title                  · subtitle │  <- gradient header
 *  ├──────────────────────────────────────────┤
 *  │                                          │
 *  │     scrollable body                      │
 *  │                                          │
 *  ├──────────────────────────────────────────┤
 *  │  Cancel               Save  ⌘S          │  <- sticky footer
 *  └──────────────────────────────────────────┘
 */

import { ReactNode, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: ReactNode
  /** Header gradient class. Defaults to brand gradient. */
  headerToneClass?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Render whole body (no padding). */
  bodyClassName?: string
  /** Body content. */
  children: ReactNode
  /** Primary action (defaults to "Save"). */
  onSubmit?: () => void
  submitLabel?: string
  submitting?: boolean
  submitDisabled?: boolean
  /** Secondary action label (defaults to "Cancel"). */
  cancelLabel?: string
  /** Hide footer entirely. */
  hideFooter?: boolean
  /** Extra footer content (e.g. error message). */
  footerStart?: ReactNode
}

const SIZE: Record<NonNullable<FormModalProps['size']>, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-4xl',
  xl: 'sm:max-w-6xl',
  full: 'sm:max-w-[96vw]',
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  headerToneClass = 'bg-grad-brand',
  size = 'md',
  bodyClassName,
  children,
  onSubmit,
  submitLabel = 'Save',
  submitting,
  submitDisabled,
  cancelLabel = 'Cancel',
  hideFooter,
  footerStart,
}: FormModalProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        onSubmit?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onSubmit])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'p-0 overflow-hidden gap-0 border-0 elev-3',
          'max-h-[92vh] flex flex-col w-[calc(100vw-2rem)]',
          SIZE[size],
        )}
      >
        {/* Header */}
        <div className={cn('relative px-6 py-4 text-white', headerToneClass)}>
          <div className="absolute inset-0 bg-dotgrid opacity-[0.08] pointer-events-none" />
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/15"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
          <div className="relative flex items-start gap-3 pr-10">
            {icon && (
              <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 grid place-items-center shrink-0 backdrop-blur-sm">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold leading-tight tracking-tight">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-0.5 text-xs text-white/85">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.()
          }}
          className="flex flex-col min-h-0 flex-1"
        >
          <div className={cn('flex-1 min-h-0 overflow-y-auto', bodyClassName ?? 'px-6 py-5')}>
            {children}
          </div>

          {!hideFooter && (
            <div className="shrink-0 border-t border-border bg-secondary/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0 text-xs text-muted-foreground">
                {footerStart}
              </div>
              <div className="flex items-center gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={submitting}>
                    {cancelLabel}
                  </Button>
                </DialogClose>
                {onSubmit && (
                  <Button
                    type="submit"
                    disabled={submitting || submitDisabled}
                    className="gap-1.5 min-w-[8rem]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {submitLabel}
                        <kbd className="hidden sm:inline-flex ml-1 select-none items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1 font-mono text-[9px] font-medium text-white/80">
                          ⌘S
                        </kbd>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Helper section component for vertical groupings inside FormModal body.
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || description) && (
        <div>
          {title && <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * 2/3/4-column field grid. Auto-stacks on mobile.
 */
export function FieldGrid({
  cols = 2,
  children,
  className,
}: {
  cols?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[cols]
  return <div className={cn('grid gap-4 grid-cols-1', colsClass, className)}>{children}</div>
}
