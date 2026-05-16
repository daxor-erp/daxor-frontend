'use client'

import { ApprovalStatusColumn } from '@/components/approval/ApprovalStatusColumn'
import type { ApprovalBusy } from '@/components/approval/ApprovalDropdown'
import {
  PAST_ENTRY_APPROVAL_DEFS,
  type PastEntryApprovalKind,
} from '@/lib/past-entry-approval-registry'
import { findPendingApprovalRequestId, isApproverForModule, type PendingApprovalRow } from '@/services/approvalService'

export type PastEntryApprovalCellProps = {
  kind: PastEntryApprovalKind
  raw: Record<string, unknown>
  userId?: string
  moduleApprovers?: Array<{ moduleKey: string; approverUserId?: string | null }> | null
  pendingRows: PendingApprovalRow[]
  busy: ApprovalBusy
  onSendForApproval: () => void
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
}

export function PastEntryApprovalCell({
  kind,
  raw,
  userId,
  moduleApprovers,
  pendingRows,
  busy,
  onSendForApproval,
  onApprove,
  onReject,
}: PastEntryApprovalCellProps) {
  const def = PAST_ENTRY_APPROVAL_DEFS[kind]
  const n = def.normalize(raw)
  const id = String(raw.id ?? '')
  const reqId = findPendingApprovalRequestId(pendingRows, def.entityType, id)
  const showApprover = isApproverForModule(def.moduleKey, userId, moduleApprovers ?? undefined)

  return (
    <ApprovalStatusColumn
      workflowStatus={n.workflow}
      approvalRequestedAt={n.approvalRequestedAt}
      approvedAt={n.approvedAt}
      approvedBy={n.approvedBy}
      canSendForApproval={def.canSubmit(raw)}
      showApproverActions={showApprover}
      approvalRequestId={reqId}
      onSendForApproval={onSendForApproval}
      onApprove={() => {
        if (reqId) onApprove(reqId)
      }}
      onReject={() => {
        if (reqId) onReject(reqId)
      }}
      busy={busy}
    />
  )
}
