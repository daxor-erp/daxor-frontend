import type { ErpApprovalModuleKey } from '@/lib/erp-approval-modules'

/** Normalize pathname for moduleWorkspaceRecords routePath matching. */
export function normalizeRoutePath(pathname: string): string {
	const p = pathname?.trim() || '/'
	if (p === '/') return p
	return p.replace(/\/+$/, '') || '/'
}

/**
 * Maps the current URL to an org-admin Approvals module key (see ERP_APPROVAL_MODULES).
 * CRM is excluded (returns null). Used for generic page-level approval drafts.
 */
export function approvalModuleKeyForPath(pathname: string): ErpApprovalModuleKey | null {
	const p = normalizeRoutePath(pathname)

	if (!p || p === '/dashboard') return null
	if (p.startsWith('/admin') || p.startsWith('/org-admin')) return null
	if (p.startsWith('/clients') || p.startsWith('/crm')) return null

	if (p.startsWith('/quotations')) return 'quotations'

	if (p.startsWith('/sales') || p.startsWith('/sales-returns') || p.startsWith('/delivery-challan')) {
		return 'sales'
	}

	if (
		p.startsWith('/vendors') ||
		p.startsWith('/projects') ||
		p.startsWith('/purchases') ||
		p.startsWith('/material-receipt') ||
		p.startsWith('/grn')
	) {
		return 'purchases'
	}

	if (p.startsWith('/payables')) return 'payables'

	if (
		p.startsWith('/inventory-control') ||
		p.startsWith('/warehouse') ||
		p.startsWith('/stock-adjustments') ||
		p.startsWith('/stock-transfers') ||
		p.startsWith('/goods-receipt') ||
		p.startsWith('/inventory/')
	) {
		return 'inventory'
	}

	if (p === '/products' || p.startsWith('/products/')) return 'products'

	if (p.startsWith('/general-ledger') || p.startsWith('/cash-bank') || p.startsWith('/financial')) {
		return 'financial'
	}

	if (p.startsWith('/payroll-management') || p.startsWith('/salary-processing') || p.startsWith('/payroll')) {
		return 'payroll'
	}

	if (p.startsWith('/hr')) return 'hr'

	if (p.startsWith('/customers')) return 'customers'

	if (p.startsWith('/banks')) return 'banks'

	if (p.startsWith('/reports')) return 'reports'

	if (
		p.startsWith('/production') ||
		p.startsWith('/project-management') ||
		p.startsWith('/production-planning') ||
		p.startsWith('/work-orders')
	) {
		return 'reports'
	}

	return null
}
