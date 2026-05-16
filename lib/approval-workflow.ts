/** Mirrors backend `RecordApprovalWorkflowStatus` — use for all ERP approval columns. */
export type RecordApprovalWorkflowStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'

export const RECORD_APPROVAL_LABELS: Record<RecordApprovalWorkflowStatus, string> = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export function parseRecordApprovalStatus(raw: string | null | undefined): RecordApprovalWorkflowStatus {
  const u = String(raw ?? '').toUpperCase()
  if (
    u === 'DRAFT' ||
    u === 'PENDING_APPROVAL' ||
    u === 'APPROVED' ||
    u === 'REJECTED'
  ) {
    return u as RecordApprovalWorkflowStatus
  }
  return 'DRAFT'
}
