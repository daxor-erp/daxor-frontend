/**
 * FormDrawer — right-side slide-in panel for create/edit forms.
 * ConfirmDialog — modal confirmation for destructive actions.
 * Used across every ERP module page.
 */
'use client'

import { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// FormDrawer
// ─────────────────────────────────────────────────────────────────────────────

interface FormDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  /** Width class — defaults to sm:max-w-xl (600px) */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: ReactNode
  /** Primary action label */
  submitLabel?: string
  onSubmit?: () => void
  submitting?: boolean
  /** Show a secondary action (e.g. "Save & New") */
  secondaryLabel?: string
  onSecondary?: () => void
  /** Whether the footer is shown at all */
  showFooter?: boolean
  className?: string
}

const SIZE_CLS: Record<NonNullable<FormDrawerProps['size']>, string> = {
  sm:   'sm:max-w-md',
  md:   'sm:max-w-xl',
  lg:   'sm:max-w-2xl',
  xl:   'sm:max-w-4xl',
  full: 'sm:max-w-full',
}

export function FormDrawer({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  submitLabel = 'Save',
  onSubmit,
  submitting = false,
  secondaryLabel,
  onSecondary,
  showFooter = true,
  className,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className={cn(
          'flex flex-col p-0 gap-0',
          SIZE_CLS[size],
          'w-full',
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/30 px-6 py-4 shrink-0">
          <div className="min-w-0">
            <SheetHeader className="p-0 space-y-0.5 text-left">
              <SheetTitle className="text-base font-semibold leading-tight">{title}</SheetTitle>
              {description && (
                <SheetDescription className="text-xs text-muted-foreground">
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 h-7 w-7 shrink-0 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-6 py-3 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            {secondaryLabel && onSecondary && (
              <Button variant="outline" size="sm" onClick={onSecondary} disabled={submitting}>
                {secondaryLabel}
              </Button>
            )}
            {onSubmit && (
              <Button
                size="sm"
                onClick={onSubmit}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[5rem]"
              >
                {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {submitting ? 'Saving…' : submitLabel}
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmDialog
// ─────────────────────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              destructive && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
          >
            {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FormSection — groups related fields inside a FormDrawer
// ─────────────────────────────────────────────────────────────────────────────

interface FormSectionProps {
  title?: string
  children: ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

const SECTION_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
}

export function FormSection({ title, children, columns = 2, className }: FormSectionProps) {
  return (
    <div className={cn('mb-5 last:mb-0', className)}>
      {title && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      <div className={cn('grid gap-3', SECTION_COLS[columns] ?? SECTION_COLS[2])}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LineItemsEditor — reusable inline spreadsheet for PO/Bill/Invoice lines
// ─────────────────────────────────────────────────────────────────────────────

export interface LineItemColumn {
  key: string
  header: string
  width?: string
  type?: 'text' | 'number'
  readOnly?: boolean
  placeholder?: string
}

interface LineItemsEditorProps {
  columns: LineItemColumn[]
  rows: Record<string, any>[]
  onChange: (rows: Record<string, any>[]) => void
  onAddRow?: () => Record<string, any>
  canRemove?: boolean
  addLabel?: string
  className?: string
}

export function LineItemsEditor({
  columns,
  rows,
  onChange,
  onAddRow,
  canRemove = true,
  addLabel = '+ Add line',
  className,
}: LineItemsEditorProps) {
  const setCell = (rowIdx: number, key: string, value: string | number) => {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [key]: value } : r))
    onChange(next)
  }

  const removeRow = (idx: number) => onChange(rows.filter((_, i) => i !== idx))

  const addRow = () => {
    const blank = onAddRow ? onAddRow() : columns.reduce((acc, c) => ({ ...acc, [c.key]: c.type === 'number' ? 0 : '' }), {})
    onChange([...rows, blank])
  }

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="grid bg-muted/40 border-b border-border" style={{ gridTemplateColumns: `${columns.map(c => c.width || '1fr').join(' ')} 2rem` }}>
        {columns.map(c => (
          <div key={c.key} className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground truncate">
            {c.header}
          </div>
        ))}
        <div />
      </div>
      {/* Rows */}
      {rows.length === 0 && (
        <div className="px-3 py-4 text-center text-xs text-muted-foreground">No lines yet.</div>
      )}
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid border-b border-border last:border-b-0 hover:bg-muted/20 group"
          style={{ gridTemplateColumns: `${columns.map(c => c.width || '1fr').join(' ')} 2rem` }}
        >
          {columns.map(c => (
            <div key={c.key} className="px-1 py-1">
              {c.readOnly ? (
                <span className="block px-2 py-1.5 text-xs text-muted-foreground">{row[c.key] ?? '—'}</span>
              ) : (
                <input
                  type={c.type === 'number' ? 'number' : 'text'}
                  placeholder={c.placeholder ?? c.header}
                  value={row[c.key] ?? ''}
                  onChange={e => setCell(rowIdx, c.key, c.type === 'number' ? Number(e.target.value) : e.target.value)}
                  className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-xs focus:border-primary/60 focus:bg-card focus:outline-none focus:ring-0 transition-colors"
                />
              )}
            </div>
          ))}
          <div className="flex items-center justify-center">
            {canRemove && rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(rowIdx)}
                className="h-5 w-5 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
                aria-label="Remove line"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      ))}
      {/* Add row */}
      <button
        type="button"
        onClick={addRow}
        className="w-full px-3 py-2 text-left text-xs text-primary hover:bg-primary/5 transition-colors border-t border-dashed border-border"
      >
        {addLabel}
      </button>
    </div>
  )
}
