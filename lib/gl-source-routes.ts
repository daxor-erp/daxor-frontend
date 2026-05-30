/** Deep links from GL referenceModule + referenceId to operational screens. */
export function glSourceRoute(
  referenceModule?: string | null,
  referenceId?: string | null,
): string | null {
  const mod = String(referenceModule ?? '').trim()
  const id = String(referenceId ?? '').trim()
  if (!mod || !id) return null

  switch (mod) {
    case 'customer_invoice':
      return `/sales/create-invoices?highlight=${encodeURIComponent(id)}`
    case 'customer_payment':
      return `/customers/accept-payments?highlight=${encodeURIComponent(id)}`
    case 'vendor_bill':
      return `/payables/enter-bills?highlight=${encodeURIComponent(id)}`
    case 'vendor_payment':
      return `/payables/pay-bills?highlight=${encodeURIComponent(id)}`
    case 'sales_return':
      return `/sales-returns?highlight=${encodeURIComponent(id)}`
    case 'vendor_credit':
      return `/payables/vendor-credits?highlight=${encodeURIComponent(id)}`
    case 'vendor_debit_note':
      return `/purchases/debit-note?highlight=${encodeURIComponent(id)}`
    case 'grn':
      return `/grn?highlight=${encodeURIComponent(id)}`
    case 'material_receipt':
      return `/material-receipt?highlight=${encodeURIComponent(id)}`
    case 'stock_adjustment':
      return `/stock-adjustments?highlight=${encodeURIComponent(id)}`
    case 'stock_transfer':
      return `/stock-transfers?highlight=${encodeURIComponent(id)}`
    case 'payroll_run':
      return `/payroll-management/${encodeURIComponent(id)}/payslips`
    case 'fixed_asset':
      return `/inventory/fixed-assets?highlight=${encodeURIComponent(id)}`
    case 'bank_transfer':
      return `/banks/transfer-funds?highlight=${encodeURIComponent(id)}`
    case 'production_planning':
      return `/production-planning?highlight=${encodeURIComponent(id)}`
    default:
      return null
  }
}

export function glSourceLabel(referenceModule?: string | null): string {
  const labels: Record<string, string> = {
    customer_invoice: 'Customer invoice',
    customer_payment: 'Customer payment',
    vendor_bill: 'Vendor bill',
    vendor_payment: 'Vendor payment',
    sales_return: 'Sales return',
    vendor_credit: 'Vendor credit',
    vendor_debit_note: 'Vendor debit note',
    grn: 'GRN',
    material_receipt: 'Material receipt',
    stock_adjustment: 'Stock adjustment',
    stock_transfer: 'Stock transfer',
    payroll_run: 'Payroll run',
    fixed_asset: 'Fixed asset',
    bank_transfer: 'Bank transfer',
    production_planning: 'Production',
  }
  return labels[String(referenceModule ?? '')] ?? String(referenceModule ?? 'Source')
}
