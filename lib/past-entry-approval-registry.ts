import type { RecordApprovalWorkflowStatus } from '@/lib/approval-workflow'
import { parseRecordApprovalStatus } from '@/lib/approval-workflow'
import {
  APPROVAL_ENTITY_CUSTOMER_INVOICE,
  APPROVAL_ENTITY_DELIVERY_CHALLAN,
  APPROVAL_ENTITY_GRN,
  APPROVAL_ENTITY_MATERIAL_RECEIPT,
  APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
  APPROVAL_ENTITY_PAYROLL_UI_RECORD,
  APPROVAL_ENTITY_PROJECT,
  APPROVAL_ENTITY_PURCHASE_ORDER,
  APPROVAL_ENTITY_QUOTATION,
  APPROVAL_ENTITY_SALES_ENQUIRY,
  APPROVAL_ENTITY_SALES_ORDER,
  APPROVAL_ENTITY_SALES_RETURN,
  APPROVAL_ENTITY_VENDOR,
  APPROVAL_ENTITY_VENDOR_BILL,
  MODULE_KEY_PAYABLES,
  MODULE_KEY_PAYROLL,
  MODULE_KEY_PURCHASES,
  MODULE_KEY_QUOTATIONS,
  MODULE_KEY_SALES,
} from '@/services/approvalService'

export type PastEntryApprovalKind =
  | 'sales_enquiry'
  | 'quotation'
  | 'sales_order'
  | 'customer_invoice'
  | 'sales_return'
  | 'delivery_challan'
  | 'vendor_bill'
  | 'purchase_order'
  | 'vendor'
  | 'project'
  | 'material_receipt'
  | 'grn'
  | 'payroll_management'
  | 'payroll_ui_record'

export type NormalizedPastApproval = {
  workflow: RecordApprovalWorkflowStatus
  approvalRequestedAt?: string | null
  approvedAt?: string | null
  approvedBy?: string | null
}

function gs(raw: Record<string, unknown>, key: string): string {
  return String(raw[key] ?? '').trim()
}

function normalizeLowerLifecycle(raw: Record<string, unknown>): NormalizedPastApproval {
  const s = gs(raw, 'status').toLowerCase()
  if (s === 'submitted') return { workflow: 'PENDING_APPROVAL' }
  if (s === 'draft') return { workflow: 'DRAFT' }
  if (s === 'rejected' || s === 'approval_declined') return { workflow: 'REJECTED' }
  if (
    s === 'approved' ||
    s === 'sent' ||
    s === 'active' ||
    s === 'received' ||
    s === 'completed' ||
    s === 'confirmed' ||
    s === 'paid' ||
    s === 'partially_paid'
  ) {
    return { workflow: 'APPROVED' }
  }
  return { workflow: 'APPROVED' }
}

function normalizeUpperLifecycle(raw: Record<string, unknown>): NormalizedPastApproval {
  const u = gs(raw, 'status').toUpperCase()
  if (u === 'DRAFT') return { workflow: 'DRAFT' }
  if (u === 'APPROVAL_DECLINED') return { workflow: 'REJECTED' }
  if (u === 'SUBMITTED') return { workflow: 'PENDING_APPROVAL' }
  if (u === 'APPROVED') return { workflow: 'APPROVED' }
  return { workflow: 'APPROVED' }
}

function normalizeOrgApprovalField(raw: Record<string, unknown>): NormalizedPastApproval {
  const ap = gs(raw, 'orgApprovalStatus').toLowerCase()
  if (ap === '' || ap === 'draft') return { workflow: 'DRAFT' }
  if (ap === 'approved') return { workflow: 'APPROVED' }
  if (ap === 'submitted') return { workflow: 'PENDING_APPROVAL' }
  if (ap === 'approval_declined') return { workflow: 'REJECTED' }
  return { workflow: 'APPROVED' }
}

function normalizePayrollUi(raw: Record<string, unknown>): NormalizedPastApproval {
  const s = gs(raw, 'approvalStatus').toLowerCase()
  if (s === 'none' || s === '') return { workflow: 'DRAFT' }
  if (s === 'pending') return { workflow: 'PENDING_APPROVAL' }
  if (s === 'approved') return { workflow: 'APPROVED' }
  if (s === 'declined') return { workflow: 'REJECTED' }
  return { workflow: 'DRAFT' }
}

function normalizePayrollManagement(raw: Record<string, unknown>): NormalizedPastApproval {
  const u = gs(raw, 'status').toUpperCase()
  if (u === 'DRAFT' || u === 'PENDING_REVIEW') return { workflow: 'DRAFT' }
  if (u === 'APPROVAL_DECLINED') return { workflow: 'REJECTED' }
  if (u === 'SUBMITTED') return { workflow: 'PENDING_APPROVAL' }
  if (u === 'APPROVED') return { workflow: 'APPROVED' }
  return { workflow: 'APPROVED' }
}

function normalizeSalesEnquiry(raw: Record<string, unknown>): NormalizedPastApproval {
  const workflow = parseRecordApprovalStatus(gs(raw, 'approvalStatus'))
  return {
    workflow,
    approvalRequestedAt: raw.approvalRequestedAt as string | undefined | null,
    approvedAt: raw.approvedAt as string | undefined | null,
    approvedBy: raw.approvedBy as string | undefined | null,
  }
}

function normalizeQuotation(raw: Record<string, unknown>): NormalizedPastApproval {
  const s = gs(raw, 'status').toLowerCase()
  if (s === 'draft') return { workflow: 'DRAFT' }
  if (s === 'approval_declined') return { workflow: 'REJECTED' }
  if (s === 'submitted') return { workflow: 'PENDING_APPROVAL' }
  return { workflow: 'APPROVED' }
}

export const PAST_ENTRY_APPROVAL_DEFS: Record<
  PastEntryApprovalKind,
  {
    entityType: string
    moduleKey: string
    normalize: (raw: Record<string, unknown>) => NormalizedPastApproval
    canSubmit: (raw: Record<string, unknown>) => boolean
  }
> = {
  sales_enquiry: {
    entityType: APPROVAL_ENTITY_SALES_ENQUIRY,
    moduleKey: MODULE_KEY_SALES,
    normalize: normalizeSalesEnquiry,
    canSubmit: (raw) => {
      const w = normalizeSalesEnquiry(raw).workflow
      return w === 'DRAFT' || w === 'REJECTED'
    },
  },
  quotation: {
    entityType: APPROVAL_ENTITY_QUOTATION,
    moduleKey: MODULE_KEY_QUOTATIONS,
    normalize: normalizeQuotation,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'approval_declined'
    },
  },
  sales_order: {
    entityType: APPROVAL_ENTITY_SALES_ORDER,
    moduleKey: MODULE_KEY_SALES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      if (raw.cashSale === true) return false
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'rejected'
    },
  },
  customer_invoice: {
    entityType: APPROVAL_ENTITY_CUSTOMER_INVOICE,
    moduleKey: MODULE_KEY_SALES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'approval_declined'
    },
  },
  sales_return: {
    entityType: APPROVAL_ENTITY_SALES_RETURN,
    moduleKey: MODULE_KEY_SALES,
    normalize: normalizeUpperLifecycle,
    canSubmit: (raw) => {
      const u = gs(raw, 'status').toUpperCase()
      return u === 'DRAFT' || u === 'APPROVAL_DECLINED'
    },
  },
  delivery_challan: {
    entityType: APPROVAL_ENTITY_DELIVERY_CHALLAN,
    moduleKey: MODULE_KEY_SALES,
    normalize: normalizeUpperLifecycle,
    canSubmit: (raw) => {
      const u = gs(raw, 'status').toUpperCase()
      return u === 'DRAFT' || u === 'APPROVAL_DECLINED'
    },
  },
  vendor_bill: {
    entityType: APPROVAL_ENTITY_VENDOR_BILL,
    moduleKey: MODULE_KEY_PAYABLES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'approval_declined'
    },
  },
  purchase_order: {
    entityType: APPROVAL_ENTITY_PURCHASE_ORDER,
    moduleKey: MODULE_KEY_PURCHASES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'rejected'
    },
  },
  vendor: {
    entityType: APPROVAL_ENTITY_VENDOR,
    moduleKey: MODULE_KEY_PURCHASES,
    normalize: normalizeOrgApprovalField,
    canSubmit: (raw) => {
      const ap = gs(raw, 'orgApprovalStatus').toLowerCase()
      return ap === 'draft' || ap === 'approval_declined'
    },
  },
  project: {
    entityType: APPROVAL_ENTITY_PROJECT,
    moduleKey: MODULE_KEY_PURCHASES,
    normalize: normalizeOrgApprovalField,
    canSubmit: (raw) => {
      const ap = gs(raw, 'orgApprovalStatus').toLowerCase()
      return ap === 'draft' || ap === 'approval_declined'
    },
  },
  material_receipt: {
    entityType: APPROVAL_ENTITY_MATERIAL_RECEIPT,
    moduleKey: MODULE_KEY_PURCHASES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'approval_declined'
    },
  },
  grn: {
    entityType: APPROVAL_ENTITY_GRN,
    moduleKey: MODULE_KEY_PURCHASES,
    normalize: normalizeLowerLifecycle,
    canSubmit: (raw) => {
      const s = gs(raw, 'status').toLowerCase()
      return s === 'draft' || s === 'approval_declined'
    },
  },
  payroll_management: {
    entityType: APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
    moduleKey: MODULE_KEY_PAYROLL,
    normalize: normalizePayrollManagement,
    canSubmit: (raw) => {
      const u = gs(raw, 'status').toUpperCase()
      return u === 'DRAFT' || u === 'APPROVAL_DECLINED' || u === 'PENDING_REVIEW'
    },
  },
  payroll_ui_record: {
    entityType: APPROVAL_ENTITY_PAYROLL_UI_RECORD,
    moduleKey: MODULE_KEY_PAYROLL,
    normalize: normalizePayrollUi,
    canSubmit: (raw) => {
      const s = gs(raw, 'approvalStatus').toLowerCase()
      return s === 'none' || s === '' || s === 'declined'
    },
  },
}
