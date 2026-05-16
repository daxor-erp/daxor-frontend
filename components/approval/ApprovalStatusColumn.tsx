'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ApprovalDropdown, type ApprovalBusy } from '@/components/approval/ApprovalDropdown'
import { StatusBadge } from '@/components/approval/StatusBadge'
import {
  type RecordApprovalWorkflowStatus,
  RECORD_APPROVAL_LABELS,
  parseRecordApprovalStatus,
} from '@/lib/approval-workflow'

export type ApprovalStatusColumnProps = {
  workflowStatus: RecordApprovalWorkflowStatus | string | null | undefined
  approvalRequestedAt?: string | null
  approvedAt?: string | null
  approvedBy?: string | null
  canSendForApproval: boolean
  showApproverActions: boolean
  approvalRequestId: string | null
  onSendForApproval: () => void
  onApprove: () => void
  onReject: () => void
  busy: ApprovalBusy
}

export function ApprovalStatusColumn({
  workflowStatus,
  approvalRequestedAt,
  approvedAt,
  approvedBy,
  canSendForApproval,
  showApproverActions,
  approvalRequestId,
  onSendForApproval,
  onApprove,
  onReject,
  busy,
}: ApprovalStatusColumnProps) {
  const [statusOpen, setStatusOpen] = useState(false)
  const s = parseRecordApprovalStatus(workflowStatus === null || workflowStatus === undefined ? undefined : String(workflowStatus))

  return (
    <div className="flex flex-col items-start gap-1.5 min-w-[140px]">
      <StatusBadge status={s} />
      <ApprovalDropdown
        workflowStatus={s}
        canSendForApproval={canSendForApproval}
        showApproverActions={showApproverActions}
        approvalRequestId={approvalRequestId}
        onSendForApproval={onSendForApproval}
        onViewStatus={() => setStatusOpen(true)}
        onApprove={onApprove}
        onReject={onReject}
        busy={busy}
        disabled={busy !== null}
      />

      <AlertDialog open={statusOpen} onOpenChange={setStatusOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approval status</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-2 text-left text-xs text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Workflow:</span> {RECORD_APPROVAL_LABELS[s]}
            </p>
            <p>
              <span className="font-medium text-slate-900">Sent for approval:</span>{' '}
              {approvalRequestedAt ? new Date(approvalRequestedAt).toLocaleString() : '—'}
            </p>
            <p>
              <span className="font-medium text-slate-900">Decision at:</span>{' '}
              {approvedAt ? new Date(approvedAt).toLocaleString() : '—'}
            </p>
            <p>
              <span className="font-medium text-slate-900">Decided by (user id):</span> {approvedBy ?? '—'}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Close</AlertDialogCancel>
            <AlertDialogAction type="button" onClick={() => setStatusOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
