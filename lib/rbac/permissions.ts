export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ERP_ADMIN: 'ERP_ADMIN',
  EXTRACTION_MANAGER: 'EXTRACTION_MANAGER',
  PRODUCTION_MANAGER: 'PRODUCTION_MANAGER',
  PURCHASE_MANAGER: 'PURCHASE_MANAGER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  QUALITY_MANAGER: 'QUALITY_MANAGER',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  HR_PAYROLL_MANAGER: 'HR_PAYROLL_MANAGER',
  SALES_MANAGER: 'SALES_MANAGER',
  WAREHOUSE_SUPERVISOR: 'WAREHOUSE_SUPERVISOR',
  ASSET_MANAGER: 'ASSET_MANAGER',
} as const

export const RESOURCES = {
  EXTRACTION: 'extraction',
  PRODUCTION: 'production',
  PURCHASE_REQUEST: 'purchase_request',
  STOCK: 'stock',
  QUALITY: 'quality',
  TRANSACTION: 'transaction',
  EMPLOYEE: 'employee',
  PAYSLIP: 'payslip',
  PRODUCTION_PLANNING: 'production_planning',
  WORK_ORDER: 'work_order',
  VENDOR: 'vendor',
  PURCHASE_ORDER: 'purchase_order',
  VENDOR_PAYMENT: 'vendor_payment',
  MATERIAL_RECEIPT: 'material_receipt',
  INVENTORY_CONTROL: 'inventory_control',
  INVENTORY_RETURN: 'inventory_return',
  INTERNAL_ORDER: 'internal_order',
  STOCK_ADJUSTMENT: 'stock_adjustment',
  STOCK_TRANSFER: 'stock_transfer',
  GOODS_RECEIPT: 'goods_receipt',
  IP_INSPECTION: 'ip_inspection',
  GRN: 'grn',
  EXCISE_INVOICE: 'excise_invoice',
  GENERAL_LEDGER: 'general_ledger',
  CASH_BANK: 'cash_bank',
  PAYROLL_MANAGEMENT: 'payroll_management',
  SALARY_PROCESSING: 'salary_processing',
  SALES_PIPELINE: 'sales_pipeline',
  WAREHOUSE: 'warehouse',
  SALES_ORDER: 'sales_order',
  SALES_ENQUIRY: 'sales_enquiry',
  SALES_RETURN: 'sales_return',
  CUSTOMER: 'customer',
  CUSTOMER_INVOICE: 'customer_invoice',
  DELIVERY_CHALLAN: 'delivery_challan',
  JOB_APPLICANT: 'job_applicant',
  FIXED_ASSET: 'fixed_asset',
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  AUDIT_LOG: 'audit_log',
  ORGANIZATION: 'organization',
} as const

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

const ALL_ACTIONS = [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE]
const READ_ONLY = [ACTIONS.READ]

export const ROLE_PERMISSIONS: Record<string, { resource: string; actions: string[] }[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(RESOURCES).map(resource => ({
    resource,
    actions: ALL_ACTIONS
  })),
  
  [ROLES.ERP_ADMIN]: [
    { resource: RESOURCES.USER, actions: ALL_ACTIONS },
    { resource: RESOURCES.ROLE, actions: ALL_ACTIONS },
    { resource: RESOURCES.PERMISSION, actions: ALL_ACTIONS },
    { resource: RESOURCES.AUDIT_LOG, actions: READ_ONLY },
    { resource: RESOURCES.ORGANIZATION, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
  ],
  
  [ROLES.EXTRACTION_MANAGER]: [
    { resource: RESOURCES.EXTRACTION, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK, actions: READ_ONLY },
  ],
  
  [ROLES.PRODUCTION_MANAGER]: [
    { resource: RESOURCES.PRODUCTION, actions: ALL_ACTIONS },
    { resource: RESOURCES.PRODUCTION_PLANNING, actions: ALL_ACTIONS },
    { resource: RESOURCES.WORK_ORDER, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK, actions: READ_ONLY },
  ],
  
  [ROLES.PURCHASE_MANAGER]: [
    { resource: RESOURCES.PURCHASE_REQUEST, actions: ALL_ACTIONS },
    { resource: RESOURCES.VENDOR, actions: ALL_ACTIONS },
    { resource: RESOURCES.PURCHASE_ORDER, actions: ALL_ACTIONS },
    { resource: RESOURCES.VENDOR_PAYMENT, actions: READ_ONLY },
    { resource: RESOURCES.MATERIAL_RECEIPT, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK, actions: READ_ONLY },
  ],
  
  [ROLES.INVENTORY_MANAGER]: [
    { resource: RESOURCES.STOCK, actions: ALL_ACTIONS },
    { resource: RESOURCES.INVENTORY_CONTROL, actions: ALL_ACTIONS },
    { resource: RESOURCES.INVENTORY_RETURN, actions: ALL_ACTIONS },
    { resource: RESOURCES.INTERNAL_ORDER, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK_ADJUSTMENT, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK_TRANSFER, actions: ALL_ACTIONS },
    { resource: RESOURCES.WAREHOUSE, actions: READ_ONLY },
  ],
  
  [ROLES.QUALITY_MANAGER]: [
    { resource: RESOURCES.QUALITY, actions: ALL_ACTIONS },
    { resource: RESOURCES.GOODS_RECEIPT, actions: ALL_ACTIONS },
    { resource: RESOURCES.IP_INSPECTION, actions: ALL_ACTIONS },
    { resource: RESOURCES.GRN, actions: ALL_ACTIONS },
    { resource: RESOURCES.EXCISE_INVOICE, actions: READ_ONLY },
    { resource: RESOURCES.STOCK, actions: READ_ONLY },
    { resource: RESOURCES.MATERIAL_RECEIPT, actions: READ_ONLY },
  ],
  
  [ROLES.FINANCE_MANAGER]: [
    { resource: RESOURCES.TRANSACTION, actions: ALL_ACTIONS },
    { resource: RESOURCES.GENERAL_LEDGER, actions: ALL_ACTIONS },
    { resource: RESOURCES.CASH_BANK, actions: ALL_ACTIONS },
    ...Object.values(RESOURCES)
      .filter(r => !['user', 'role', 'permission'].includes(r))
      .map(resource => ({ resource, actions: READ_ONLY }))
  ],
  
  [ROLES.HR_PAYROLL_MANAGER]: [
    { resource: RESOURCES.EMPLOYEE, actions: ALL_ACTIONS },
    { resource: RESOURCES.PAYSLIP, actions: ALL_ACTIONS },
    { resource: RESOURCES.PAYROLL_MANAGEMENT, actions: ALL_ACTIONS },
    { resource: RESOURCES.SALARY_PROCESSING, actions: ALL_ACTIONS },
    { resource: RESOURCES.JOB_APPLICANT, actions: ALL_ACTIONS },
  ],
  
  [ROLES.SALES_MANAGER]: [
    { resource: RESOURCES.SALES_PIPELINE, actions: ALL_ACTIONS },
    { resource: RESOURCES.SALES_ORDER, actions: ALL_ACTIONS },
    { resource: RESOURCES.SALES_ENQUIRY, actions: ALL_ACTIONS },
    { resource: RESOURCES.SALES_RETURN, actions: ALL_ACTIONS },
    { resource: RESOURCES.CUSTOMER, actions: ALL_ACTIONS },
    { resource: RESOURCES.CUSTOMER_INVOICE, actions: ALL_ACTIONS },
    { resource: RESOURCES.DELIVERY_CHALLAN, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK, actions: READ_ONLY },
  ],
  
  [ROLES.WAREHOUSE_SUPERVISOR]: [
    { resource: RESOURCES.WAREHOUSE, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK, actions: ALL_ACTIONS },
    { resource: RESOURCES.STOCK_TRANSFER, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
  ],
  
  [ROLES.ASSET_MANAGER]: [
    { resource: RESOURCES.FIXED_ASSET, actions: ALL_ACTIONS },
    { resource: RESOURCES.TRANSACTION, actions: READ_ONLY },
  ],
}

export const hasPermission = (
  userRoles: string[] | undefined,
  resource: string,
  action: string
): boolean => {
  if (!userRoles || userRoles.length === 0) return false
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true
  
  for (const roleName of userRoles) {
    const permissions = ROLE_PERMISSIONS[roleName]
    if (!permissions) continue
    
    const permission = permissions.find(p => p.resource === resource)
    if (permission && permission.actions.includes(action)) {
      return true
    }
  }
  
  return false
}

export const canAccessRoute = (userRoles: string[] | undefined, route: string): boolean => {
  if (!userRoles || userRoles.length === 0) return false
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true
  
  const routeResourceMap: Record<string, string> = {
    '/extraction': RESOURCES.EXTRACTION,
    '/production': RESOURCES.PRODUCTION,
    '/production-planning': RESOURCES.PRODUCTION_PLANNING,
    '/work-orders': RESOURCES.WORK_ORDER,
    '/purchase-requests': RESOURCES.PURCHASE_REQUEST,
    '/vendors': RESOURCES.VENDOR,
    '/purchase-orders': RESOURCES.PURCHASE_ORDER,
    '/vendor-payments': RESOURCES.VENDOR_PAYMENT,
    '/material-receipts': RESOURCES.MATERIAL_RECEIPT,
    '/stock': RESOURCES.STOCK,
    '/inventory-control': RESOURCES.INVENTORY_CONTROL,
    '/inventory-returns': RESOURCES.INVENTORY_RETURN,
    '/internal-orders': RESOURCES.INTERNAL_ORDER,
    '/stock-adjustments': RESOURCES.STOCK_ADJUSTMENT,
    '/stock-transfers': RESOURCES.STOCK_TRANSFER,
    '/quality': RESOURCES.QUALITY,
    '/goods-receipts': RESOURCES.GOODS_RECEIPT,
    '/ip-inspections': RESOURCES.IP_INSPECTION,
    '/grn': RESOURCES.GRN,
    '/excise-invoices': RESOURCES.EXCISE_INVOICE,
    '/transactions': RESOURCES.TRANSACTION,
    '/general-ledger': RESOURCES.GENERAL_LEDGER,
    '/cash-bank': RESOURCES.CASH_BANK,
    '/employees': RESOURCES.EMPLOYEE,
    '/payslips': RESOURCES.PAYSLIP,
    '/payroll-management': RESOURCES.PAYROLL_MANAGEMENT,
    '/salary-processing': RESOURCES.SALARY_PROCESSING,
    '/payroll/others/loan-repayment': RESOURCES.PAYROLL_MANAGEMENT,
    '/sales-pipeline': RESOURCES.SALES_PIPELINE,
    '/warehouse': RESOURCES.WAREHOUSE,
    '/sales-orders': RESOURCES.SALES_ORDER,
    '/sales-enquiries': RESOURCES.SALES_ENQUIRY,
    '/sales-returns': RESOURCES.SALES_RETURN,
    '/customers': RESOURCES.CUSTOMER,
    '/customer-invoices': RESOURCES.CUSTOMER_INVOICE,
    '/delivery-challans': RESOURCES.DELIVERY_CHALLAN,
    '/job-applicants': RESOURCES.JOB_APPLICANT,
    '/assets': RESOURCES.FIXED_ASSET,
    '/users': RESOURCES.USER,
    '/roles': RESOURCES.ROLE,
  }
  
  const resource = routeResourceMap[route]
  if (!resource) return true
  
  return hasPermission(userRoles, resource, ACTIONS.READ)
}
