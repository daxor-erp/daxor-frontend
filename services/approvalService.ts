/**
 * Shared helpers for org-assigned approval queues (`ApprovalRequest` / `myPendingApprovalRequests`).
 * Mutations stay in components; this module keeps lookup logic reusable across modules.
 *
 * Entity type strings must match `daxor-backend/.../approval-workflow/constants.ts`.
 */

export const APPROVAL_ENTITY_SALES_ENQUIRY = 'SALES_ENQUIRY'
export const APPROVAL_ENTITY_SALES_ORDER = 'SALES_ORDER'
export const APPROVAL_ENTITY_QUOTATION = 'QUOTATION'
export const APPROVAL_ENTITY_CUSTOMER_INVOICE = 'CUSTOMER_INVOICE'
export const APPROVAL_ENTITY_SALES_RETURN = 'SALES_RETURN'
export const APPROVAL_ENTITY_DELIVERY_CHALLAN = 'DELIVERY_CHALLAN'
export const APPROVAL_ENTITY_PURCHASE_ORDER = 'PURCHASE_ORDER'
export const APPROVAL_ENTITY_VENDOR = 'VENDOR'
export const APPROVAL_ENTITY_PROJECT = 'PROJECT'
export const APPROVAL_ENTITY_VENDOR_BILL = 'VENDOR_BILL'
export const APPROVAL_ENTITY_MATERIAL_RECEIPT = 'MATERIAL_RECEIPT'
export const APPROVAL_ENTITY_GRN = 'GRN'
export const APPROVAL_ENTITY_PAYROLL_UI_RECORD = 'PAYROLL_UI_RECORD'
export const APPROVAL_ENTITY_PAYROLL_MANAGEMENT = 'PAYROLL_MANAGEMENT'

export const MODULE_KEY_SALES = 'sales'
export const MODULE_KEY_QUOTATIONS = 'quotations'
export const MODULE_KEY_PURCHASES = 'purchases'
export const MODULE_KEY_PAYABLES = 'payables'
export const MODULE_KEY_PAYROLL = 'payroll'

export type PendingApprovalRow = {
  id: string
  entityType: string
  entityId: string
  status: string
}

export function findPendingApprovalRequestId(
  rows: PendingApprovalRow[] | undefined,
  entityType: string,
  entityId: string,
): string | null {
  if (!rows?.length) return null
  const row = rows.find(
    (r) =>
      String(r.entityType) === entityType &&
      String(r.entityId) === String(entityId) &&
      String(r.status).toUpperCase() === 'PENDING',
  )
  return row ? String(row.id) : null
}

export function isApproverForModule(
  moduleKey: string,
  userId: string | undefined,
  moduleApprovers: Array<{ moduleKey: string; approverUserId?: string | null }> | undefined,
): boolean {
  if (!userId || !moduleApprovers?.length) return false
  return moduleApprovers.some(
    (m) => String(m.moduleKey) === moduleKey && String(m.approverUserId ?? '') === String(userId),
  )
}
