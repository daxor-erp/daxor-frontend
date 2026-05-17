export type DashboardKey = 'erp' | 'admin' | 'orgAdmin'

export type WidgetCategory = 'heroCta' | 'kpi' | 'section'

export interface WidgetDef {
  id: string
  label: string
  category: WidgetCategory
  defaultHidden?: boolean
  /** lg col-span for `section` widgets (defaults to 1, max 3). KPI widgets always span 1. */
  colSpan?: 1 | 2 | 3
}

export interface DashboardManifest {
  key: DashboardKey
  label: string
  widgets: WidgetDef[]
}

export const ERP_DASHBOARD: DashboardManifest = {
  key: 'erp',
  label: 'ERP dashboard',
  widgets: [
    { id: 'cta-new-invoice', label: 'New invoice button', category: 'heroCta' },
    { id: 'cta-new-quotation', label: 'New quotation button', category: 'heroCta' },
    { id: 'cta-new-sales-order', label: 'New sales order button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-purchase-order', label: 'New purchase order button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-customer', label: 'New customer button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-vendor', label: 'New vendor button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-item', label: 'New item button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-payment', label: 'Receive payment button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-bill', label: 'New vendor bill button', category: 'heroCta', defaultHidden: true },
    { id: 'cta-new-lead', label: 'New lead button', category: 'heroCta', defaultHidden: true },
    { id: 'kpi-revenue', label: 'Revenue', category: 'kpi' },
    { id: 'kpi-receivable', label: 'Receivable', category: 'kpi' },
    { id: 'kpi-payable', label: 'Payable', category: 'kpi' },
    { id: 'kpi-sales-orders', label: 'Sales orders', category: 'kpi' },
    { id: 'kpi-purchase-orders', label: 'Purchase orders', category: 'kpi' },
    { id: 'kpi-conversion', label: 'Conversion', category: 'kpi' },
    { id: 'section-revenue-trend', label: 'Revenue trend chart', category: 'section', colSpan: 2 },
    { id: 'section-invoice-status', label: 'Invoice status chart', category: 'section', colSpan: 1 },
    { id: 'section-sales-vs-purchases', label: 'Sales vs purchases chart', category: 'section', colSpan: 2 },
    { id: 'section-low-stock', label: 'Low stock alerts', category: 'section', colSpan: 1 },
    { id: 'section-recent-invoices', label: 'Recent invoices', category: 'section', colSpan: 2 },
    { id: 'section-my-approvals', label: 'My approvals', category: 'section', colSpan: 1 },
    { id: 'section-quick-access', label: 'Quick access tiles', category: 'section', colSpan: 3 },
  ],
}

export const ADMIN_DASHBOARD: DashboardManifest = {
  key: 'admin',
  label: 'Platform admin dashboard',
  widgets: [
    { id: 'kpi-total-orgs', label: 'Total organizations', category: 'kpi' },
    { id: 'kpi-active-orgs', label: 'Active organizations', category: 'kpi' },
    { id: 'kpi-pending-orgs', label: 'Pending organizations', category: 'kpi' },
    { id: 'kpi-suspended-orgs', label: 'Suspended organizations', category: 'kpi' },
    { id: 'section-org-growth', label: 'Organization growth chart', category: 'section', colSpan: 2 },
    { id: 'section-status-mix', label: 'Status mix chart', category: 'section', colSpan: 1 },
    { id: 'section-recent-orgs', label: 'Recent organizations', category: 'section', colSpan: 2 },
    { id: 'section-new-tenants-bar', label: 'New tenants per month chart', category: 'section', colSpan: 1 },
    { id: 'section-system-health', label: 'System health', category: 'section', colSpan: 1 },
    { id: 'section-recently-active', label: 'Recently active', category: 'section', colSpan: 1 },
    { id: 'section-quick-links', label: 'Quick links', category: 'section', colSpan: 1 },
    { id: 'section-adoption-trend', label: 'Adoption trend', category: 'section', colSpan: 3 },
  ],
}

export const ORG_ADMIN_DASHBOARD: DashboardManifest = {
  key: 'orgAdmin',
  label: 'Org admin dashboard',
  widgets: [
    { id: 'kpi-users', label: 'Users', category: 'kpi' },
    { id: 'kpi-pending-users', label: 'Pending users', category: 'kpi' },
    { id: 'kpi-module-approvers', label: 'Module approvers', category: 'kpi' },
    { id: 'kpi-pending-approvals', label: 'Pending approvals', category: 'kpi' },
    { id: 'section-org-profile', label: 'Organization profile', category: 'section', colSpan: 1 },
    { id: 'section-recent-users', label: 'Recent users', category: 'section', colSpan: 2 },
    { id: 'section-approvals-inbox', label: 'Approvals in your inbox', category: 'section', colSpan: 2 },
    { id: 'section-quick-links', label: 'Quick links', category: 'section', colSpan: 1 },
  ],
}

export const MANIFESTS: Record<DashboardKey, DashboardManifest> = {
  erp: ERP_DASHBOARD,
  admin: ADMIN_DASHBOARD,
  orgAdmin: ORG_ADMIN_DASHBOARD,
}

export function getManifest(key: DashboardKey): DashboardManifest {
  return MANIFESTS[key]
}
