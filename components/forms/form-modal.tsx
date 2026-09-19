'use client'

/**
 * Shared form modal for Add / Edit flows across the ERP.
 * Clean white card design: title + circular close, scrollable body, sticky footer.
 * Esc closes · Cmd/Ctrl+S saves.
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
  /** @deprecated Kept for call-site compatibility; blue gradient header removed. */
  headerToneClass?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  bodyClassName?: string
  children: ReactNode
  onSubmit?: () => void
  submitLabel?: string
  submitting?: boolean
  submitDisabled?: boolean
  cancelLabel?: string
  hideFooter?: boolean
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
          'gap-0 overflow-hidden border border-slate-200/90 bg-white p-0 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.18)]',
          'max-h-[92vh] flex w-[calc(100vw-2rem)] flex-col rounded-2xl sm:rounded-2xl',
          SIZE[size],
        )}
      >
        {/* Header — white, title left, circular close right */}
        <div className="relative shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-4 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </DialogClose>

          <div className="flex items-start gap-3 pr-12">
            {icon ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0 pt-0.5">
              <DialogTitle className="text-lg font-semibold leading-tight tracking-tight text-slate-900">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="mt-1 text-sm text-slate-500">
                  {description}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">{title}</DialogDescription>
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
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            className={cn(
              'min-h-0 flex-1 overflow-y-auto bg-white',
              bodyClassName ?? 'px-5 py-5 sm:px-6',
            )}
          >
            {children}
          </div>

          {!hideFooter && (
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0 flex-1 text-xs text-slate-500">{footerStart}</div>
              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    className="h-11 rounded-xl border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-50 sm:h-10"
                  >
                    {cancelLabel}
                  </Button>
                </DialogClose>
                {onSubmit && (
                  <Button
                    type="submit"
                    disabled={submitting || submitDisabled}
                    className="h-11 min-w-[9rem] gap-1.5 rounded-xl px-5 font-semibold shadow-md shadow-primary/20 sm:h-10"
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
                        <kbd className="ml-1 hidden select-none items-center rounded border border-white/25 bg-black/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/90 sm:inline-flex">
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
          {title && (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </h4>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
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
  return <div className={cn('grid grid-cols-1 gap-4', colsClass, className)}>{children}</div>
}
