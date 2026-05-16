'use client'

import { cn } from '@/lib/utils'
import {
  type RecordApprovalWorkflowStatus,
  RECORD_APPROVAL_LABELS,
  parseRecordApprovalStatus,
} from '@/lib/approval-workflow'

const tone: Record<RecordApprovalWorkflowStatus, string> = {
  DRAFT: 'border-slate-200 bg-slate-50 text-slate-700',
  PENDING_APPROVAL: 'border-amber-200 bg-amber-50 text-amber-900',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  REJECTED: 'border-red-200 bg-red-50 text-red-800',
}

export type StatusBadgeProps = {
  status: RecordApprovalWorkflowStatus | string | null | undefined
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = parseRecordApprovalStatus(status === null || status === undefined ? undefined : String(status))
  return (
    <span
      className={cn(
        'inline-flex max-w-full truncate rounded border px-2 py-0.5 text-[11px] font-medium leading-tight',
        tone[s],
        className,
      )}
      title={RECORD_APPROVAL_LABELS[s]}
    >
      {RECORD_APPROVAL_LABELS[s]}
    </span>
  )
}
