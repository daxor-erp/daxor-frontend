/**
 * ERP surface areas surfaced in org-admin “Approvals”.
 * Mirrors top-level navigation in components/sidebar.tsx (sections that are visible, not commented out).
 * CRM is intentionally excluded — leads do not use org-assigned approver queues.
 */
export const ERP_APPROVAL_MODULES = [
  { key: 'quotations', label: 'Quotations' },
  { key: 'sales', label: 'Sales' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'payables', label: 'Payables' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'products', label: 'Products' },
  { key: 'financial', label: 'Financial' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'hr', label: 'HR' },
  { key: 'customers', label: 'Customers' },
  { key: 'banks', label: 'Banks' },
  { key: 'reports', label: 'Reports' },
] as const

export type ErpApprovalModuleKey = (typeof ERP_APPROVAL_MODULES)[number]['key']
