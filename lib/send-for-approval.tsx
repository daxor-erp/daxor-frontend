'use client'

import { Send } from 'lucide-react'
import type { Action } from '@/components/DataTable'

/**
 * Backend `orgApprovalStatus` values where the record may be submitted again
 * (vendor master and similar org-gated workflows).
 */
export const ORG_APPROVAL_ELIGIBLE_FOR_SEND_STATUSES = ['draft', 'approval_declined'] as const

export type OrgApprovalEligibleForSendStatus = (typeof ORG_APPROVAL_ELIGIBLE_FOR_SEND_STATUSES)[number]

export function isOrgApprovalEligibleForSend(orgApprovalStatus: string | null | undefined): boolean {
  const key = String(orgApprovalStatus ?? '').toLowerCase()
  return (ORG_APPROVAL_ELIGIBLE_FOR_SEND_STATUSES as readonly string[]).includes(key)
}

export type SendForApprovalOrgStatusRow = {
  id: string
  orgApprovalStatus?: string | null
}

export type SendForApprovalDataTablePresetOptions<R extends SendForApprovalOrgStatusRow> = {
  /**
   * Noun shown in default tooltips ("vendor", "purchase order", …).
   * @example "vendor"
   */
  entityLabel?: string
  /** Shown while row is eligible to open the approval sheet */
  eligibleTooltip?: string | ((row: R) => string)
  /** Shown while the send action is disabled (e.g. already pending approval) */
  blockedTooltip?: string | ((row: R) => string)
  /** Called when the user clicks Send from the row */
  onOpenSheet: (row: R) => void
}

const DEFAULT_BLOCKED = 'An approval request is already pending'

/**
 * Builds a {@link Action} preset for tables that mirror vendor-style `orgApprovalStatus`
 * and open a module-specific approval sheet elsewhere.
 *
 * Pair with {@link useSendForApprovalSheet} and your module sheet (e.g. `VendorSendForApprovalSheet`).
 */
export function sendForApprovalDataTableAction<R extends SendForApprovalOrgStatusRow>(
  options: SendForApprovalDataTablePresetOptions<R>,
): Action<R> {
  const noun = options.entityLabel ?? 'record'
  const defaultEligible = `Choose approvers and send this ${noun} for approval`

  return {
    label: 'Send for Approval',
    tooltip: (row) => {
      if (!isOrgApprovalEligibleForSend(row.orgApprovalStatus)) {
        if (typeof options.blockedTooltip === 'function') return options.blockedTooltip(row)
        return options.blockedTooltip ?? DEFAULT_BLOCKED
      }
      if (typeof options.eligibleTooltip === 'function') return options.eligibleTooltip(row)
      return options.eligibleTooltip ?? defaultEligible
    },
    disabled: (row) => !isOrgApprovalEligibleForSend(row.orgApprovalStatus),
    icon: <Send className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} />,
    onClick: (row) => options.onOpenSheet(row),
    variant: 'ghost',
  }
}
