/**
 * Single source of truth for ERP navigation used by both the Sidebar (vertical)
 * and the TopNavbar (horizontal). Each item has a moduleKey for permission
 * filtering — see filterNavigationByModuleView in erp-module-access.ts.
 */

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Warehouse,
  TrendingUp,
  Briefcase,
  UserCheck,
  Building2,
  FileText,
  Factory,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  name: string
  href?: string
  icon?: LucideIcon
  moduleKey?: string
  subItems?: NavItem[]
}

export const NAVIGATION: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, moduleKey: 'dashboard' },
  {
    name: 'AI Assistant',
    icon: Sparkles,
    moduleKey: 'dashboard',
    subItems: [
      { name: 'AI Overview', href: '/ai-assistant' },
      { name: 'CRM Assistant', href: '/ai-assistant/crm' },
      { name: 'Finance Assistant', href: '/ai-assistant/finance' },
      { name: 'HR Assistant', href: '/ai-assistant/hr' },
      { name: 'Inventory Assistant', href: '/ai-assistant/inventory' },
      { name: 'Payroll Assistant', href: '/ai-assistant/payroll' },
      { name: 'Sales Assistant', href: '/ai-assistant/sales' },
    ],
  },
  {
    name: 'Production',
    icon: Factory,
    moduleKey: 'production',
    subItems: [
      { name: 'Overview', href: '/production' },
      { name: 'Production Planning', href: '/production-planning' },
      { name: 'Work Orders', href: '/work-orders' },
      { name: 'Bill of Materials (BOM)', href: '/production/bom' },
      { name: 'Quality Control', href: '/production/quality' },
      { name: 'MEP Overall Dashboard', href: '/production/dashboards/mep-overall' },
      { name: 'Workshop Dashboard', href: '/production/dashboards/workshop' },
      { name: 'Plant Modules Dashboard', href: '/production/dashboards/plant-modules' },
      { name: 'Upload Drawings', href: '/production/drawings/upload' },
      { name: 'Project Documents', href: '/production/drawings/project-documents' },
      { name: 'Project Masters', href: '/production/masters/project-masters' },
      { name: 'Site Locations', href: '/production/masters/site-locations' },
      { name: 'Contractors', href: '/production/masters/contractors' },
      { name: 'Module Time Tracking', href: '/production/module-time-tracking' },
      { name: 'Scan QR Code', href: '/production/scan-qr-code' },
      { name: 'Status All Modules', href: '/production/status-all-modules' },
    ],
  },
  {
    name: 'CRM',
    icon: Users,
    moduleKey: 'crm',
    subItems: [
      { name: 'Clients', href: '/clients' },
      { name: 'Lead Management', href: '/crm/lead-management' },
      { name: 'Opportunity Management', href: '/crm/opportunity-management' },
    ],
  },
  {
    name: 'Quotations',
    icon: FileText,
    moduleKey: 'quotations',
    subItems: [
      { name: 'Create Quotations', href: '/quotations' },
      { name: 'Send Quotations', href: '/quotations/send' },
    ],
  },
  {
    name: 'Sales',
    icon: ShoppingCart,
    moduleKey: 'sales',
    subItems: [
      { name: 'Sales Returns', href: '/sales-returns' },
      { name: 'Delivery Challan', href: '/delivery-challan' },
      { name: 'Delivery Orders', href: '/sales/delivery-orders' },
      { name: 'Create Invoices', href: '/sales/create-invoices' },
      { name: 'Delivery Order', href: '/sales/delivery-order' },
      { name: 'Enter Cash Sales', href: '/sales/enter-cash-sales' },
      { name: 'Enter Sales Order', href: '/sales/enter-sales-order' },
      { name: 'Invoice Sales Order', href: '/sales/invoice-sales-order' },
      { name: 'Issue Credit Memos', href: '/sales/issue-credit-memos' },
      { name: 'Project', href: '/sales/project' },
      { name: 'Sales Enquiry', href: '/sales/sales-enquiry' },
    ],
  },
  {
    name: 'Purchases',
    icon: Package,
    moduleKey: 'purchases',
    subItems: [
      { name: 'Vendors', href: '/vendors' },
      { name: 'Projects', href: '/projects' },
      { name: 'Purchase Requisition', href: '/purchases/purchase-requisition' },
      { name: 'Enter Purchase Orders', href: '/purchases/enter-purchase-orders' },
      { name: 'Receive Orders', href: '/purchases/receive-orders' },
      { name: 'Material Receipt', href: '/material-receipt' },
      { name: 'GRN', href: '/grn' },
    ],
  },
  {
    name: 'Payables',
    icon: DollarSign,
    moduleKey: 'payables',
    subItems: [
      { name: 'Enter Bills', href: '/payables/enter-bills' },
      { name: 'Pay Bills', href: '/payables/pay-bills' },
      { name: 'Approve Vendor Payments', href: '/payables/approve-vendor-payments' },
      { name: 'Bill Purchase Orders', href: '/payables/bill-purchase-orders' },
      { name: 'Enter Vendor Credits', href: '/payables/enter-vendor-credits' },
      { name: 'Enter Vendor Prepayment', href: '/payables/enter-vendor-prepayment' },
    ],
  },
  {
    name: 'Inventory',
    icon: Warehouse,
    moduleKey: 'inventory',
    subItems: [
      { name: 'Inventory Control', href: '/inventory-control' },
      { name: 'Warehouses', href: '/warehouse' },
      { name: 'Stock Adjustments', href: '/stock-adjustments' },
      { name: 'Stock Transfers', href: '/stock-transfers' },
      { name: 'Goods Receipt', href: '/goods-receipt' },
      { name: 'GRN', href: '/grn' },
      { name: 'Enter Transfer Orders', href: '/inventory/enter-transfer-orders' },
      { name: 'Equipment Masters', href: '/inventory/equipment-masters' },
      { name: 'Intercompany Transfer', href: '/inventory/intercompany-transfer' },
      { name: 'Items', href: '/inventory/items' },
      { name: 'Replenish Location', href: '/inventory/replenish-location' },
      { name: 'Review Negative Inventory', href: '/inventory/review-negative-inventory' },
      { name: 'Stock Ledger', href: '/inventory/stock-ledger' },
    ],
  },
  {
    name: 'Products',
    icon: Package,
    moduleKey: 'products',
    subItems: [
      { name: 'All Products', href: '/products' },
      { name: 'Categories', href: '/products/categories' },
      { name: 'Units of Measure', href: '/products/uom' },
      { name: 'Attributes', href: '/products/attributes' },
    ],
  },
  { name: 'Documents', href: '/documents', icon: FileText, moduleKey: 'documents' },
  {
    name: 'Financial',
    icon: TrendingUp,
    moduleKey: 'financial',
    subItems: [
      { name: 'General Ledger', href: '/general-ledger' },
      { name: 'Cash & Bank', href: '/cash-bank' },
      { name: 'Chart of Accounts', href: '/financial/chart-of-accounts' },
      { name: 'Tax Rates (GST)', href: '/financial/tax-rates' },
      { name: 'Fixed Assets', href: '/financial/fixed-assets' },
      { name: 'Asset Maintenance', href: '/financial/asset-maintenance' },
      { name: 'Intercompany Allocation', href: '/financial/intercompany-allocation' },
      { name: 'Intercompany Journal', href: '/financial/intercompany-journal' },
      { name: 'Create Allocation Schedules', href: '/financial/create-allocation-schedules' },
      { name: 'Create Intercompany Allocation', href: '/financial/create-intercompany-allocation' },
      { name: 'Advanced Intercompany Journal', href: '/financial/advanced-intercompany-journal' },
      { name: 'Make Journal Entries', href: '/financial/make-journal-entries' },
      { name: 'Revalue Open Currency Balances', href: '/financial/revalue-currency-balances' },
      { name: 'Set Up Budgets', href: '/financial/set-up-budgets' },
    ],
  },
  {
    name: 'Payroll',
    icon: Briefcase,
    moduleKey: 'payroll',
    subItems: [
      { name: 'Payroll Management', href: '/payroll-management' },
      { name: 'Salary Processing', href: '/salary-processing' },
      {
        name: 'Data Preparation',
        subItems: [
          { name: 'Overview', href: '/payroll/data-preparation' },
          { name: 'Yard Data', href: '/payroll/data-preparation/yard-data' },
          { name: 'Biometric Data', href: '/payroll/data-preparation/biometric-data' },
          { name: 'Manual Entry', href: '/payroll/data-preparation/manual-entry' },
        ],
      },
      {
        name: 'Others',
        subItems: [{ name: 'Loan Repayment', href: '/payroll/others/loan-repayment' }],
      },
      {
        name: 'Payroll Processing',
        subItems: [
          { name: 'Pay Batch', href: '/payroll/processing/pay-batch' },
          { name: 'Payee Employee', href: '/payroll/processing/payee-employee' },
          { name: 'Retroactive Payment', href: '/payroll/processing/retroactive-payment' },
        ],
      },
      {
        name: 'Payroll Setup',
        subItems: [
          { name: 'Pay Component', href: '/payroll/setup/pay-component' },
          { name: 'Pay Group', href: '/payroll/setup/pay-group' },
          { name: 'Employee PF', href: '/payroll/setup/employee-pf' },
          { name: 'FWL Qualification', href: '/payroll/setup/fwl-qualification' },
        ],
      },
      {
        name: 'Payroll Workflow',
        subItems: [
          { name: 'Timesheet Pool', href: '/payroll/workflow/timesheet-pool' },
          { name: 'Payroll Runs', href: '/payroll/workflow/payroll-runs' },
        ],
      },
      {
        name: 'Statutory Compliance',
        subItems: [
          { name: 'CPF Applied Age Group', href: '/payroll/statutory/cpf-age-group' },
          { name: 'Community Contribution Fund', href: '/payroll/statutory/community-fund' },
          { name: 'SDL Master', href: '/payroll/statutory/sdl-master' },
          { name: 'IR8A Year', href: '/payroll/statutory/ir8a-year' },
        ],
      },
    ],
  },
  {
    name: 'HR',
    icon: UserCheck,
    moduleKey: 'hr',
    subItems: [
      { name: 'Timesheets', href: '/hr/timesheets' },
      {
        name: 'Leave',
        subItems: [
          { name: 'Leave Type', href: '/hr/leave/leave-type' },
          { name: 'Employee Leave Application', href: '/hr/leave/leave-application' },
          { name: 'Employee Leave Enrollment', href: '/hr/leave/leave-enrollment' },
          { name: 'Employee Leave Reinstatement', href: '/hr/leave/leave-reinstatement' },
        ],
      },
      {
        name: 'Masters',
        subItems: [
          { name: 'Employee Master', href: '/hr/masters/employee-master' },
          { name: 'Career Progress Salary', href: '/hr/masters/career-progress-salary' },
          { name: 'Asset Name List', href: '/hr/masters/asset-name-list' },
          { name: 'Asset Issue to Employee', href: '/hr/masters/asset-issue' },
          { name: 'Employee Loan Application', href: '/hr/masters/loan-application' },
          { name: 'Calendar Masters', href: '/hr/masters/calendar-masters' },
          { name: 'FWL Qualification', href: '/hr/masters/fwl-qualification' },
          { name: 'Shift Master', href: '/hr/masters/shift-master' },
          { name: 'Employee Exit Process', href: '/hr/masters/exit-process' },
        ],
      },
    ],
  },
  {
    name: 'Customers',
    icon: Users,
    moduleKey: 'customers',
    subItems: [
      { name: 'Customer Registration', href: '/customers' },
      { name: 'Accept Customer Payments', href: '/customers/accept-payments' },
      { name: 'Approve Return Authorizations', href: '/customers/approve-returns' },
      { name: 'Assess Finance Charges', href: '/customers/assess-finance-charges' },
      { name: 'Generate Price Lists', href: '/customers/generate-price-lists' },
      { name: 'Generate Statements', href: '/customers/generate-statements' },
      { name: 'Individual Price List', href: '/customers/individual-price-list' },
      { name: 'Invoice Billable Customers', href: '/customers/invoice-billable' },
      { name: 'Issue Customer Refund', href: '/customers/issue-refund' },
      { name: 'Issue Return Authorizations', href: '/customers/issue-return-authorizations' },
      { name: 'Print Individual Statement', href: '/customers/print-statement' },
      { name: 'Receive Returned Order', href: '/customers/receive-returned-order' },
      { name: 'Record Customer Deposits', href: '/customers/record-deposits' },
      { name: 'Refund Cash Sales', href: '/customers/refund-cash-sales' },
    ],
  },
  {
    name: 'Banks',
    icon: Building2,
    moduleKey: 'banks',
    subItems: [
      { name: 'Make Deposits', href: '/banks/make-deposits' },
      { name: 'Reconcile Account Statement', href: '/banks/reconcile-account' },
      { name: 'Reconcile Bank Statement', href: '/banks/reconcile-bank' },
      { name: 'Reconciliation Rules', href: '/banks/reconciliation-rules' },
      { name: 'Transfer Funds', href: '/banks/transfer-funds' },
      { name: 'Write Checks', href: '/banks/write-checks' },
      { name: 'Write Tax Liability', href: '/banks/write-tax-liability' },
    ],
  },
  {
    name: 'Reports',
    icon: FileText,
    moduleKey: 'reports',
    subItems: [
      {
        name: 'Financial',
        subItems: [
          { name: 'Income Statement', href: '/reports/financial/income-statement' },
          { name: 'Balance Sheet', href: '/reports/financial/balance-sheet' },
          { name: 'Cash Flow Statement', href: '/reports/financial/cash-flow' },
          { name: 'General Ledger', href: '/reports/financial/general-ledger' },
          { name: 'Trial Balance', href: '/reports/financial/trial-balance' },
          { name: 'Transaction Detail', href: '/reports/financial/transaction-detail' },
        ],
      },
      {
        name: 'Inventory',
        subItems: [
          { name: 'Inventory Profitability', href: '/reports/inventory/profitability' },
          { name: 'Inventory Summary', href: '/reports/inventory/summary' },
          { name: 'Inventory Valuation', href: '/reports/inventory/valuation' },
          { name: 'Stock Movement', href: '/reports/inventory/stock-movement' },
          { name: 'Low Stock', href: '/reports/inventory/low-stock' },
        ],
      },
    ],
  },
  {
    name: 'Tenants',
    icon: Building2,
    moduleKey: 'dashboard',
    subItems: [
      { name: 'Sub-tenants', href: '/admin/sub-tenants' },
    ],
  },
]
