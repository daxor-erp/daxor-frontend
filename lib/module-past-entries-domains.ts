/**
 * Maps the current pathname to which domain list queries should populate the
 * global “past entries” (eye) dialog — aligned with visible sidebar routes.
 * CRM list routes remain for history browsing; approval UI skips CRM rows on the client.
 */
import { payrollUiCategoryForPath } from '@/lib/payroll-ui-category'

export type PastDomainKey =
  | 'sales_enquiries'
  | 'sales_orders'
  | 'customer_invoices'
  | 'sales_returns'
  | 'delivery_challans'
  | 'clients'
  | 'leads'
  | 'opportunities'
  | 'quotations_org'
  | 'vendors'
  | 'projects'
  | 'purchase_orders'
  | 'vendor_bills'
  | 'material_receipts'
  | 'grns'
  | 'customers_registry'
  | 'items_catalog'
  | 'warehouses'
  | 'inventory_controls'
  | 'general_ledgers'
  | 'cash_banks'
  | 'chart_accounts'
  | 'bank_accounts'
  | 'payroll_managements'
  | 'payroll_ui'

/** Domains whose list rows use the org approval workflow (past entries dialog). */
export const PAST_ENTRY_APPROVAL_DOMAIN_KEYS: ReadonlySet<PastDomainKey> = new Set([
  'sales_enquiries',
  'sales_orders',
  'customer_invoices',
  'sales_returns',
  'delivery_challans',
  'quotations_org',
  'vendors',
  'projects',
  'purchase_orders',
  'vendor_bills',
  'material_receipts',
  'grns',
  'payroll_managements',
  'payroll_ui',
])

export function pastEntryDomainsUseApprovalInbox(domains: Set<PastDomainKey>): boolean {
  for (const k of domains) {
    if (PAST_ENTRY_APPROVAL_DOMAIN_KEYS.has(k)) return true
  }
  return false
}

export function resolvePastEntryDomains(pathname: string): Set<PastDomainKey> {
  const p = pathname || ''
  const d = new Set<PastDomainKey>()

  if (p === '/sales/sales-enquiry' || p.startsWith('/sales/sales-enquiry/')) {
    d.add('sales_enquiries')
    return d
  }

  if (p.startsWith('/sales/')) {
    d.add('sales_orders')
    d.add('customer_invoices')
  }

  if (p.startsWith('/sales-returns')) {
    d.add('sales_returns')
  }

  if (p.startsWith('/delivery-challan')) {
    d.add('delivery_challans')
  }

  if (p.startsWith('/clients')) {
    d.add('clients')
  }

  if (p.startsWith('/crm/lead-management')) {
    d.add('leads')
  }

  if (p.startsWith('/crm/opportunity-management')) {
    d.add('opportunities')
  }

  if (p.startsWith('/quotations')) {
    d.add('quotations_org')
  }

  if (p.startsWith('/vendors')) {
    d.add('vendors')
  }

  if (p.startsWith('/projects')) {
    d.add('projects')
  }

  if (p.startsWith('/purchases/')) {
    d.add('purchase_orders')
  }

  if (p.startsWith('/payables/')) {
    d.add('vendor_bills')
  }

  if (p.startsWith('/customers')) {
    d.add('customers_registry')
  }

  if (p.startsWith('/inventory/items') || p === '/products' || p.startsWith('/products/')) {
    d.add('items_catalog')
  }

  if (p.startsWith('/warehouse')) {
    d.add('warehouses')
  }

  if (p.startsWith('/material-receipt')) {
    d.add('material_receipts')
  }

  if (p.startsWith('/grn')) {
    d.add('grns')
  }

  if (
    p.startsWith('/inventory-control') ||
    p.startsWith('/stock-adjustments') ||
    p.startsWith('/stock-transfers') ||
    p.startsWith('/goods-receipt') ||
    p.startsWith('/inventory/')
  ) {
    d.add('inventory_controls')
  }

  if (p.startsWith('/general-ledger')) {
    d.add('general_ledgers')
  }

  if (p.startsWith('/cash-bank')) {
    d.add('cash_banks')
  }

  if (p.startsWith('/financial/')) {
    if (p.includes('chart-of-accounts')) {
      d.add('chart_accounts')
    } else {
      d.add('general_ledgers')
    }
  }

  if (p.startsWith('/banks/')) {
    d.add('bank_accounts')
  }

  if (p === '/payroll-management' || p.startsWith('/payroll-management/')) {
    d.add('payroll_managements')
  }

  if (payrollUiCategoryForPath(p) != null) {
    d.add('payroll_ui')
  }

  return d
}
