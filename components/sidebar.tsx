'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { 
  LayoutDashboard, Users, ShoppingCart, Package, DollarSign, Warehouse,
  TrendingUp, Briefcase, UserCheck, FolderKanban,
  Building2, FileText, ChevronDown, ChevronRight, LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  /* Hidden from sidebar — restore to show Production Management (uses Factory icon)
  { 
    name: 'Production Management', 
    icon: Factory,
    subItems: [
      { name: 'Production Planning', href: '/production-planning' },
      { name: 'Work Orders', href: '/work-orders' },
      { 
        name: 'Dashboards',
        subItems: [
          { name: 'MEP Overall Dashboard', href: '/production/dashboards/mep-overall' },
          { name: 'Workshop Dashboard', href: '/production/dashboards/workshop' },
          { name: 'Plant Modules Dashboard', href: '/production/dashboards/plant-modules' },
        ]
      },
      { 
        name: 'Drawings Documents',
        subItems: [
          { name: 'Upload Drawings', href: '/production/drawings/upload' },
          { name: 'Project Documents', href: '/production/drawings/project-documents' },
        ]
      },
      { 
        name: 'Master Tables',
        subItems: [
          { name: 'Project Masters', href: '/production/masters/project-masters' },
          { name: 'Site Locations', href: '/production/masters/site-locations' },
          { name: 'Contractors', href: '/production/masters/contractors' },
        ]
      },
      { name: 'Module Wise Time Tracking', href: '/production/module-time-tracking' },
      { name: 'Scan QR Code', href: '/production/scan-qr-code' },
      { name: 'Status All Modules', href: '/production/status-all-modules' },
    ]
  },
  */
  { 
    name: 'CRM', 
    icon: Users,
    subItems: [
      { name: 'Clients', href: '/clients' },
      { name: 'Lead Management', href: '/crm/lead-management' },
      { name: 'Opportunity Management', href: '/crm/opportunity-management' },
    ]
  },
  { 
    name: 'Quotations', 
    icon: FileText,
    subItems: [
      { name: 'Create Quotations', href: '/quotations' },
      { name: 'Send Quotations', href: '/quotations/send' },
    ]
  },
  { 
    name: 'Sales', 
    icon: ShoppingCart,
    subItems: [
      { name: 'Sales Returns', href: '/sales-returns' },
      { name: 'Delivery Challan', href: '/delivery-challan' },
      { name: 'Create Invoices', href: '/sales/create-invoices' },
      { name: 'Delivery Order', href: '/sales/delivery-order' },
      { name: 'Enter Cash Sales', href: '/sales/enter-cash-sales' },
      { name: 'Enter Sales Order', href: '/sales/enter-sales-order' },
      { name: 'Invoice Sales Order', href: '/sales/invoice-sales-order' },
      { name: 'Issue Credit Memos', href: '/sales/issue-credit-memos' },
      { name: 'Project', href: '/sales/project' },
      { name: 'Sales Enquiry', href: '/sales/sales-enquiry' },
    ]
  },
  { 
    name: 'Purchases', 
    icon: Package,
    subItems: [
      { name: 'Vendors', href: '/vendors' },
      { name: 'Projects', href: '/projects' },
      { name: 'Purchase Requisition', href: '/purchases/purchase-requisition' },
      { name: 'Enter Purchase Orders', href: '/purchases/enter-purchase-orders' },
      { name: 'Receive Orders', href: '/purchases/receive-orders' },
      { name: 'Material Receipt', href: '/material-receipt' },
      { name: 'GRN', href: '/grn' },
    ]
  },
  { 
    name: 'Payables', 
    icon: DollarSign,
    subItems: [
      { name: 'Enter Bills', href: '/payables/enter-bills' },
      { name: 'Pay Bills', href: '/payables/pay-bills' },
      { name: 'Approve Vendor Payments', href: '/payables/approve-vendor-payments' },
      { name: 'Bill Purchase Orders', href: '/payables/bill-purchase-orders' },
      { name: 'Enter Vendor Credits', href: '/payables/enter-vendor-credits' },
      { name: 'Enter Vendor Prepayment', href: '/payables/enter-vendor-prepayment' },
    ]
  },
  { 
    name: 'Inventory', 
    icon: Warehouse,
    subItems: [
      { name: 'Inventory Control', href: '/inventory-control' },
      { name: 'Warehouses', href: '/warehouse' },
      { name: 'Stock Adjustments', href: '/stock-adjustments' },
      { name: 'Stock Transfers', href: '/stock-transfers' },
      { name: 'Goods Receipt', href: '/goods-receipt' },
      { name: 'GRN', href: '/grn' },
      // Consolidated into Inventory control: /inventory-control
      // { name: 'Adjust Inventory', href: '/inventory/adjust-inventory' },
      // { name: 'Adjust Inventory Worksheet', href: '/inventory/adjust-inventory-worksheet' },
      { name: 'Enter Transfer Orders', href: '/inventory/enter-transfer-orders' },
      { name: 'Equipment Masters', href: '/inventory/equipment-masters' },
      { name: 'Intercompany Transfer', href: '/inventory/intercompany-transfer' },
      { name: 'Items', href: '/inventory/items' },
      { name: 'Replenish Location by Inventory Transfer', href: '/inventory/replenish-location' },
      { name: 'Review Negative Inventory', href: '/inventory/review-negative-inventory' },
      { name: 'Stock Ledger', href: '/inventory/stock-ledger' },
    ]
  },
  { name: 'Products', href: '/products', icon: Package },
  { 
    name: 'Financial', 
    icon: TrendingUp,
    subItems: [
      { name: 'General Ledger', href: '/general-ledger' },
      { name: 'Cash & Bank', href: '/cash-bank' },
      { name: 'Chart of Accounts', href: '/financial/chart-of-accounts' },
      { name: 'Create Allocation Schedules', href: '/financial/create-allocation-schedules' },
      { name: 'Create Intercompany Allocation Schedules', href: '/financial/create-intercompany-allocation' },
      { name: 'Make Advanced Intercompany Journal Entries', href: '/financial/advanced-intercompany-journal' },
      { name: 'Make Journal Entries', href: '/financial/make-journal-entries' },
      { name: 'Make Statis', href: '/financial/make-statis' },
      { name: 'Revalue Open Currency Balances', href: '/financial/revalue-currency-balances' },
      { name: 'Set Up Budgets', href: '/financial/set-up-budgets' },
    ]
  },
  { 
    name: 'Payroll', 
    icon: Briefcase,
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
        ]
      },
      { 
        name: 'Others',
        subItems: [
          { name: 'Loan Repayment', href: '/payroll/others/loan-repayment' },
        ]
      },
      { 
        name: 'Payroll Processing',
        subItems: [
          { name: 'Pay Batch', href: '/payroll/processing/pay-batch' },
          { name: 'Payee Employee', href: '/payroll/processing/payee-employee' },
          { name: 'Retroactive Payment', href: '/payroll/processing/retroactive-payment' },
        ]
      },
      { 
        name: 'Payroll Setup',
        subItems: [
          { name: 'Pay Component', href: '/payroll/setup/pay-component' },
          { name: 'Pay Group', href: '/payroll/setup/pay-group' },
          { name: 'Employee PF', href: '/payroll/setup/employee-pf' },
          { name: 'FWL Qualification', href: '/payroll/setup/fwl-qualification' },
        ]
      },
      { 
        name: 'Payroll Workflow',
        subItems: [
          { name: 'Timesheet Pool', href: '/payroll/workflow/timesheet-pool' },
          { name: 'Payroll Runs', href: '/payroll/workflow/payroll-runs' },
        ]
      },
      { 
        name: 'Statutory Compliance',
        subItems: [
          { name: 'CPF Applied Age Group', href: '/payroll/statutory/cpf-age-group' },
          { name: 'Community Contribution Fund', href: '/payroll/statutory/community-fund' },
          { name: 'SDL Master', href: '/payroll/statutory/sdl-master' },
          { name: 'IR8A Year', href: '/payroll/statutory/ir8a-year' },
        ]
      },
    ]
  },
  { 
    name: 'HR', 
    icon: UserCheck,
    subItems: [
      { 
        name: 'Leave',
        subItems: [
          { name: 'Leave Type', href: '/hr/leave/leave-type' },
          { name: 'Employee Leave Application', href: '/hr/leave/leave-application' },
          { name: 'Employee Leave Enrollment', href: '/hr/leave/leave-enrollment' },
          { name: 'Employee Leave Reinstatement', href: '/hr/leave/leave-reinstatement' },
        ]
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
        ]
      },
    ]
  },
  /* Hidden from sidebar — restore to show Production
  { 
    name: 'Project Management', 
    icon: FolderKanban,
    subItems: [
      { name: 'Gantt Chart', href: '/project-management/gantt-chart' },
      { name: 'Milestones', href: '/project-management/milestones' },
      { name: 'Project Masters', href: '/project-management/project-masters' },
      { name: 'Reports Analytics', href: '/project-management/reports-analytics' },
      { name: 'Resources', href: '/project-management/resources' },
      { name: 'Tasks', href: '/project-management/tasks' },
    ]
  },
  /* Hidden from sidebar — restore to show Order Management
  { 
    name: 'Order Management', 
    icon: ClipboardList,
    subItems: [
      { 
        name: 'Commit Orders',
        subItems: [
          { name: 'Schedule Order', href: '/order-management/commit-orders/schedule-order' },
        ]
      },
      { name: 'Fulfill Orders', href: '/order-management/fulfill-orders' },
      { 
        name: 'Order Items',
        subItems: [
          { name: 'New Order Items', href: '/order-management/order-items/new-order-items' },
        ]
      },
      { name: 'Reallocate Items', href: '/order-management/reallocate-items' },
    ]
  },
  */
  { 
    name: 'Customers', 
    icon: Users,
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
    ]
  },
  { 
    name: 'Banks', 
    icon: Building2,
    subItems: [
      { name: 'Make Deposits', href: '/banks/make-deposits' },
      { name: 'Reconcile Account Statement', href: '/banks/reconcile-account' },
      { name: 'Reconcile Bank Statement', href: '/banks/reconcile-bank' },
      { name: 'Reconciliation Rules', href: '/banks/reconciliation-rules' },
      { name: 'Transfer Funds', href: '/banks/transfer-funds' },
      { name: 'Write Checks', href: '/banks/write-checks' },
      { name: 'Write Tax Liability', href: '/banks/write-tax-liability' },
    ]
  },
  /* Hidden from sidebar — restore to show Masters
  { 
    name: 'Masters', 
    icon: FileText,
    subItems: [
      { name: 'Bank Masters', href: '/masters/bank-masters' },
      { name: 'Classes', href: '/masters/classes' },
      { name: 'Customer Masters', href: '/masters/customer-masters' },
      { name: 'Department', href: '/masters/department' },
      { name: 'Location', href: '/masters/location' },
      { name: 'Subsidiary', href: '/masters/subsidiary' },
      { name: 'Vendor Masters', href: '/masters/vendor-masters' },
    ]
  },
  */
  { 
    name: 'Reports', 
    icon: FileText,
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
        ]
      },
      { 
        name: 'Inventory',
        subItems: [
          { name: 'Inventory Profitability', href: '/reports/inventory/profitability' },
          { name: 'Inventory Summary', href: '/reports/inventory/summary' },
          { name: 'Inventory Valuation', href: '/reports/inventory/valuation' },
          { name: 'Stock Movement Report', href: '/reports/inventory/stock-movement' },
          { name: 'Low Stock Report', href: '/reports/inventory/low-stock' },
        ]
      },
    ]
  },
  /* Hidden from sidebar — restore to show Setup
  { 
    name: 'Setup', 
    icon: Settings,
    subItems: [
      { 
        name: 'Accounting',
        subItems: [
          { name: 'Accounting List', href: '/setup/accounting/accounting-list' },
          { name: 'Expense Categories', href: '/setup/accounting/expense-categories' },
          { name: 'Tax Codes', href: '/setup/accounting/tax-codes' },
        ]
      },
      { 
        name: 'Company',
        subItems: [
          { name: 'Company Information', href: '/setup/company/company-information' },
          { name: 'Enable Features', href: '/setup/company/enable-features' },
        ]
      },
      { 
        name: 'Users Roles',
        subItems: [
          { name: 'Manage Users', href: '/setup/users-roles/manage-users' },
          { name: 'Show Role Differences', href: '/setup/users-roles/role-differences' },
        ]
      },
    ]
  },
  */
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    )
  }

  const renderMenuItem = (item: any, level = 0) => {
    const Icon = item.icon
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isOpen = openMenus.includes(item.name)
    const isActive = pathname === item.href

    if (!hasSubItems && item.href) {
      return (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: isActive ? '#2563EB' : 'transparent',
            color: isActive ? '#FFFFFF' : '#CBD5E1',
            paddingLeft: `${12 + level * 16}px`
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = '#1E293B'
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span className="text-xs">{item.name}</span>
        </Link>
      )
    }

    return (
      <div key={item.name}>
        <button
          onClick={() => toggleMenu(item.name)}
          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            color: '#CBD5E1',
            paddingLeft: `${12 + level * 16}px`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1E293B'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="text-xs">{item.name}</span>
          </div>
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.subItems.map((subItem: any) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 h-screen flex flex-col" style={{ backgroundColor: '#0F172A' }}>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#2563EB' }}>
          👋
        </div>
        <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Daxor</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {navigation.map((item) => renderMenuItem(item))}
      </nav>

      <div className="shrink-0 p-4" style={{ borderTop: '1px solid rgba(203, 213, 225, 0.1)' }}>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full cursor-pointer"
          style={{ color: '#CBD5E1', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E293B' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
