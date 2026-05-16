'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RecordApprovalWorkflowStatus } from '@/lib/approval-workflow'

export type ApprovalBusy = 'send' | 'approve' | 'reject' | null

export type ApprovalDropdownProps = {
  workflowStatus: RecordApprovalWorkflowStatus
  canSendForApproval: boolean
  /** Assignee has a pending `ApprovalRequest` row for this entity */
  showApproverActions: boolean
  approvalRequestId: string | null
  onSendForApproval: () => void
  onViewStatus: () => void
  onApprove: () => void
  onReject: () => void
  busy: ApprovalBusy
  disabled?: boolean
}

export function ApprovalDropdown({
  workflowStatus,
  canSendForApproval,
  showApproverActions,
  approvalRequestId,
  onSendForApproval,
  onViewStatus,
  onApprove,
  onReject,
  busy,
  disabled,
}: ApprovalDropdownProps) {
  const hasApproveReject =
    showApproverActions && approvalRequestId != null && workflowStatus === 'PENDING_APPROVAL'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-7 gap-1 px-2 text-[10px]"
        >
          Actions
          <ChevronDown className="h-3 w-3 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canSendForApproval ? (
          <DropdownMenuItem
            disabled={busy !== null}
            onSelect={(e) => {
              e.preventDefault()
              onSendForApproval()
            }}
          >
            {busy === 'send' ? 'Sending…' : 'Send for approval'}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            onViewStatus()
          }}
        >
          View status
        </DropdownMenuItem>
        {hasApproveReject ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={busy !== null}
              onSelect={(e) => {
                e.preventDefault()
                onApprove()
              }}
            >
              {busy === 'approve' ? 'Approving…' : 'Approve'}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={busy !== null}
              className="text-red-600 focus:text-red-600"
              onSelect={(e) => {
                e.preventDefault()
                onReject()
              }}
            >
              {busy === 'reject' ? 'Rejecting…' : 'Reject'}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
