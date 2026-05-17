/**
 * Curated GraphQL operations used by the in-app API tester. Kept as plain
 * strings (not gql tags) so the editor can show them as-is and the user can
 * tweak them inline before running.
 *
 * `org` placeholder is auto-replaced with the current user's organizationId.
 */

export interface GqlPreset {
  group: string
  name: string
  query: string
  variables?: Record<string, unknown>
}

export const GQL_PRESETS: GqlPreset[] = [
  // Auth / identity
  {
    group: 'Auth',
    name: 'Me',
    query: `query Me {
  me { id email firstName lastName roles organizationId }
}`,
  },
  // Organizations + users
  {
    group: 'Org & users',
    name: 'List organizations',
    query: `query Orgs($page: Int, $limit: Int) {
  organizations(page: $page, limit: $limit) {
    id name code email status createdAt
  }
}`,
    variables: { page: 1, limit: 25 },
  },
  {
    group: 'Org & users',
    name: 'Users in my organization',
    query: `query Users($organizationId: ID!, $page: Int, $limit: Int) {
  usersByOrganization(organizationId: $organizationId, page: $page, limit: $limit) {
    users { id email firstName lastName roles status }
    total page limit
  }
}`,
    variables: { organizationId: '{{org}}', page: 1, limit: 50 },
  },
  // Masters
  {
    group: 'Masters',
    name: 'Customers',
    query: `query Customers($organizationId: String!) {
  customers(organizationId: $organizationId) {
    id name email phone status createdAt
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Masters',
    name: 'Vendors',
    query: `query Vendors($organizationId: ID!) {
  vendors(organizationId: $organizationId) { id name email phone status }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Masters',
    name: 'Items',
    query: `query Items($organizationId: ID!) {
  items(organizationId: $organizationId) { id name category unit rate status }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Sales
  {
    group: 'Sales',
    name: 'Sales orders',
    query: `query SO($organizationId: ID!) {
  salesorders(organizationId: $organizationId) { id seqNo totalAmount status orderDate }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Sales',
    name: 'Customer invoices',
    query: `query Inv($organizationId: ID!) {
  customerinvoices(organizationId: $organizationId) {
    id seqNo totalAmount paidAmount outstandingAmount status invoiceDate
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Sales',
    name: 'Quotations',
    query: `query Q { quotations { id seqNo subject totalAmount status } }`,
  },
  {
    group: 'Sales',
    name: 'Delivery orders',
    query: `query DO($organizationId: ID!) {
  deliveryOrders(organizationId: $organizationId) {
    id docNumber customerName deliveryDate status totalQuantity
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Purchases
  {
    group: 'Purchases',
    name: 'Purchase orders',
    query: `query PO($organizationId: ID!) {
  purchaseorders(organizationId: $organizationId) {
    id seqNo vendorName totalAmount status orderDate
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Purchases',
    name: 'Vendor bills',
    query: `query Bills($organizationId: ID!) {
  vendorBills(organizationId: $organizationId) {
    id billNumber billDate dueDate totalAmount outstandingAmount status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Inventory
  {
    group: 'Inventory',
    name: 'Inventory controls',
    query: `query IC($organizationId: String!) {
  inventoryControls(organizationId: $organizationId) {
    id itemName quantity stockStatus warehouseId
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Inventory',
    name: 'Low stock items',
    query: `query Low($organizationId: String!) {
  lowStockItems(organizationId: $organizationId) {
    id itemName quantity reorderPoint stockStatus
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Inventory',
    name: 'Warehouses',
    query: `query WH($organizationId: String!) {
  warehouses(organizationId: $organizationId) { id warehouseCode warehouseName location isActive }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Finance
  {
    group: 'Finance',
    name: 'Cash & bank',
    query: `query CB($organizationId: String!) {
  cashBanks(organizationId: $organizationId) {
    id transactionNumber transactionDate transactionType amount currency
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Finance',
    name: 'Journal entries',
    query: `query JE { journalEntries { id docNumber date description status } }`,
  },
  {
    group: 'Finance',
    name: 'Tax rates',
    query: `query Tax($organizationId: ID!) {
  taxRates(organizationId: $organizationId) {
    id code name ratePercent taxType appliesTo status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Finance',
    name: 'Fixed assets',
    query: `query FA($organizationId: ID!) {
  fixedAssets(organizationId: $organizationId) {
    id assetCode name category acquisitionCost bookValue status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Finance',
    name: 'Intercompany allocations',
    query: `query IA($organizationId: ID!) {
  intercompanyAllocations(organizationId: $organizationId) {
    id scheduleCode name basisAmount totalAllocated status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Production / QC / Maintenance
  {
    group: 'Production',
    name: 'Work orders',
    query: `query WO($organizationId: String!) {
  workorders(organizationId: $organizationId) { id docNumber docDate status }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Production',
    name: 'Bill of materials',
    query: `query BOM($organizationId: ID!) {
  billsOfMaterials(organizationId: $organizationId) {
    id bomCode parentItemName totalCost status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Production',
    name: 'QC inspections',
    query: `query QC($organizationId: ID!) {
  qcInspections(organizationId: $organizationId) {
    id docNumber itemName outcome quantityPassed quantityFailed
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'Production',
    name: 'Asset maintenance',
    query: `query AM($organizationId: ID!) {
  assetMaintenances(organizationId: $organizationId) {
    id docNumber assetName maintenanceType priority scheduledDate status totalCost
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // HR
  {
    group: 'HR',
    name: 'Employees',
    query: `query Emp($organizationId: ID!) {
  employeeMasters(organizationId: $organizationId) {
    id employeeCode firstName lastName designation status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'HR',
    name: 'HR masters (SHIFT)',
    query: `query HR($organizationId: ID!, $kind: String!) {
  hrMasters(organizationId: $organizationId, kind: $kind) {
    id code name active metadataJson
  }
}`,
    variables: { organizationId: '{{org}}', kind: 'SHIFT' },
  },
  {
    group: 'HR',
    name: 'Timesheets',
    query: `query TS($organizationId: ID!) {
  timesheetEntries(organizationId: $organizationId) {
    id entryDate hours billable status
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // CRM
  {
    group: 'CRM',
    name: 'Leads',
    query: `query L($organizationId: String!) {
  leads(organizationId: $organizationId) {
    id firstName lastName company email status estimatedValue
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  {
    group: 'CRM',
    name: 'Opportunities',
    query: `query O($organizationId: String!) {
  opportunities(organizationId: $organizationId) {
    id name accountName stage amount
  }
}`,
    variables: { organizationId: '{{org}}' },
  },
  // Notifications
  {
    group: 'Notifications',
    name: 'My notifications',
    query: `query N { myNotifications(limit: 20) { id kind severity title message isRead createdAt } }`,
  },
  {
    group: 'Notifications',
    name: 'Unread count',
    query: `query U { myUnreadNotificationCount }`,
  },
  {
    group: 'Notifications',
    name: 'Pending approvals',
    query: `query A { myPendingApprovalRequests { id title moduleKey entityType requesterDisplayName createdAt } }`,
  },
  // Audit log
  {
    group: 'Admin',
    name: 'Audit log',
    query: `query Audit($page: Int, $limit: Int) {
  auditLogs(page: $page, limit: $limit) {
    data { id action entityType entityId userId createdAt }
    total page pages
  }
}`,
    variables: { page: 1, limit: 50 },
  },
  // Global search
  {
    group: 'Admin',
    name: 'Global search',
    query: `query Search($organizationId: ID!, $query: String!) {
  globalSearch(organizationId: $organizationId, query: $query, limitPerKind: 5) {
    id kind title subtitle link
  }
}`,
    variables: { organizationId: '{{org}}', query: 'a' },
  },
]

/** Curated health-check battery — read-only ops we expect to succeed quickly. */
export interface HealthCheck {
  name: string
  group: string
  query: string
  variables?: Record<string, unknown>
}

export const HEALTH_CHECKS: HealthCheck[] = [
  { group: 'Identity', name: 'me', query: `query { me { id email roles organizationId } }` },
  { group: 'Org', name: 'organizations', query: `query { organizations(page: 1, limit: 5) { id name } }` },
  { group: 'Masters', name: 'customers', query: `query($o: String!) { customers(organizationId: $o) { id name } }`, variables: { o: '{{org}}' } },
  { group: 'Masters', name: 'vendors', query: `query($o: ID!) { vendors(organizationId: $o, page: 1, limit: 5) { id name } }`, variables: { o: '{{org}}' } },
  { group: 'Masters', name: 'items', query: `query($o: ID!) { items(organizationId: $o, page: 1, limit: 5) { id name } }`, variables: { o: '{{org}}' } },
  { group: 'Sales', name: 'sales orders', query: `query($o: ID!) { salesorders(organizationId: $o) { id seqNo } }`, variables: { o: '{{org}}' } },
  { group: 'Sales', name: 'customer invoices', query: `query($o: ID!) { customerinvoices(organizationId: $o) { id seqNo } }`, variables: { o: '{{org}}' } },
  { group: 'Sales', name: 'delivery orders', query: `query($o: ID!) { deliveryOrders(organizationId: $o) { id docNumber } }`, variables: { o: '{{org}}' } },
  { group: 'Sales', name: 'quotations', query: `query { quotations { id seqNo } }` },
  { group: 'Purchases', name: 'purchase orders', query: `query($o: ID!) { purchaseorders(organizationId: $o) { id seqNo } }`, variables: { o: '{{org}}' } },
  { group: 'Purchases', name: 'vendor bills', query: `query($o: ID!) { vendorBills(organizationId: $o) { id billNumber } }`, variables: { o: '{{org}}' } },
  { group: 'Inventory', name: 'inventory controls', query: `query($o: String!) { inventoryControls(organizationId: $o) { id itemName } }`, variables: { o: '{{org}}' } },
  { group: 'Inventory', name: 'low stock items', query: `query($o: String!) { lowStockItems(organizationId: $o) { id itemName } }`, variables: { o: '{{org}}' } },
  { group: 'Inventory', name: 'warehouses', query: `query($o: String!) { warehouses(organizationId: $o) { id warehouseCode } }`, variables: { o: '{{org}}' } },
  { group: 'Finance', name: 'cash & bank', query: `query($o: String!) { cashBanks(organizationId: $o) { id transactionNumber } }`, variables: { o: '{{org}}' } },
  { group: 'Finance', name: 'journal entries', query: `query { journalEntries { id docNumber } }` },
  { group: 'Finance', name: 'tax rates', query: `query($o: ID!) { taxRates(organizationId: $o) { id code } }`, variables: { o: '{{org}}' } },
  { group: 'Finance', name: 'fixed assets', query: `query($o: ID!) { fixedAssets(organizationId: $o) { id assetCode } }`, variables: { o: '{{org}}' } },
  { group: 'Finance', name: 'intercompany allocations', query: `query($o: ID!) { intercompanyAllocations(organizationId: $o) { id scheduleCode } }`, variables: { o: '{{org}}' } },
  { group: 'Finance', name: 'intercompany journals', query: `query($o: ID!) { intercompanyJournalEntries(originatingOrganizationId: $o) { id docNumber } }`, variables: { o: '{{org}}' } },
  { group: 'HR', name: 'employee masters', query: `query($o: ID!) { employeeMasters(organizationId: $o) { id employeeCode } }`, variables: { o: '{{org}}' } },
  { group: 'HR', name: 'hr masters (SHIFT)', query: `query($o: ID!, $k: String!) { hrMasters(organizationId: $o, kind: $k) { id code } }`, variables: { o: '{{org}}', k: 'SHIFT' } },
  { group: 'HR', name: 'timesheet entries', query: `query($o: ID!) { timesheetEntries(organizationId: $o) { id entryDate } }`, variables: { o: '{{org}}' } },
  { group: 'Production', name: 'work orders', query: `query($o: String!) { workorders(organizationId: $o) { id docNumber } }`, variables: { o: '{{org}}' } },
  { group: 'Production', name: 'BOMs', query: `query($o: ID!) { billsOfMaterials(organizationId: $o) { id bomCode } }`, variables: { o: '{{org}}' } },
  { group: 'Production', name: 'QC inspections', query: `query($o: ID!) { qcInspections(organizationId: $o) { id docNumber } }`, variables: { o: '{{org}}' } },
  { group: 'Production', name: 'asset maintenance', query: `query($o: ID!) { assetMaintenances(organizationId: $o) { id docNumber } }`, variables: { o: '{{org}}' } },
  { group: 'CRM', name: 'leads', query: `query($o: String!) { leads(organizationId: $o) { id firstName } }`, variables: { o: '{{org}}' } },
  { group: 'CRM', name: 'opportunities', query: `query($o: String!) { opportunities(organizationId: $o) { id name } }`, variables: { o: '{{org}}' } },
  { group: 'Notif', name: 'my notifications', query: `query { myNotifications(limit: 5) { id kind } }` },
  { group: 'Notif', name: 'unread count', query: `query { myUnreadNotificationCount }` },
  { group: 'Notif', name: 'pending approvals', query: `query { myPendingApprovalRequests { id title } }` },
  { group: 'Admin', name: 'audit logs', query: `query { auditLogs(page: 1, limit: 5) { total } }` },
  { group: 'Admin', name: 'global search', query: `query($o: ID!) { globalSearch(organizationId: $o, query: "a", limitPerKind: 3) { id kind } }`, variables: { o: '{{org}}' } },
]
