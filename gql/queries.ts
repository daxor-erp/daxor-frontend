import { gql } from '@apollo/client'

// Auth
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        roles
        organizationId
      }
    }
  }
`

export const ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      roles
      organizationId
    }
  }
`

// Users
export const GET_USERS = gql`
  query GetUsers($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    usersByOrganization(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      users {
        id
        seqNo
        email
        firstName
        lastName
        userType
        roles
        status
        organizationId
        createdAt
      }
      total
      page
      limit
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      seqNo
      email
      firstName
      lastName
      userType
      roles
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      seqNo
      email
      firstName
      lastName
      status
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      status
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

// Organizations
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations($page: Int, $limit: Int, $search: String) {
    organizations(page: $page, limit: $limit, search: $search) {
      id
      seqNo
      name
      code
      address
      phone
      email
      status
      createdAt
    }
  }
`

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      id
      seqNo
      name
      code
      address
      phone
      email
      status
      createdAt
    }
  }
`

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      code
      status
    }
  }
`

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      id
    }
  }
`

// Items
export const GET_ITEMS = gql`
  query GetItems($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    items(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      description
      category
      unit
      rate
      organizationId
      status
      createdAt
    }
  }
`

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      seqNo
      name
      description
      category
      unit
      rate
      organizationId
      status
      createdAt
    }
  }
`

export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
      category
      status
    }
  }
`

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

// Vendors
export const GET_VENDORS = gql`
  query GetVendors($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    vendors(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      contactPerson
      email
      phone
      address
      organizationId
      status
      createdAt
    }
  }
`

export const GET_VENDOR = gql`
  query GetVendor($id: ID!) {
    vendor(id: $id) {
      id
      seqNo
      name
      contactPerson
      email
      phone
      address
      organizationId
      status
      createdAt
    }
  }
`

export const CREATE_VENDOR = gql`
  mutation CreateVendor($input: CreateVendorInput!) {
    createVendor(input: $input) {
      id
      name
      status
    }
  }
`

export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($id: ID!, $input: UpdateVendorInput!) {
    updateVendor(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id) {
      id
    }
  }
`

// Projects
export const GET_PROJECTS = gql`
  query GetProjects($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    projects(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      description
      startDate
      endDate
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      seqNo
      name
      description
      startDate
      endDate
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      status
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`

// Purchase Orders
export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    purchaseorders(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
    ) {
      id
      seqNo
      vendorId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      createdAt
    }
  }
`

export const CREATE_PURCHASE_ORDER = gql`
  mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput!) {
    createPurchaseOrder(input: $input) {
      id
      seqNo
      status
    }
  }
`

// Sales Orders
export const GET_SALES_ORDERS = gql`
  query GetSalesOrders($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    salesorders(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
    ) {
      id
      seqNo
      customerId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      createdAt
    }
  }
`

export const GET_SALES_ORDER = gql`
  query GetSalesOrder($id: ID!) {
    salesorder(id: $id) {
      id
      seqNo
      customerId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      createdAt
    }
  }
`

export const CREATE_SALES_ORDER = gql`
  mutation CreateSalesOrder($input: CreateSalesOrderInput!) {
    createSalesOrder(input: $input) {
      id
      seqNo
      status
    }
  }
`

export const UPDATE_SALES_ORDER = gql`
  mutation UpdateSalesOrder($id: ID!, $input: UpdateSalesOrderInput!) {
    updateSalesOrder(id: $id, input: $input) {
      id
      seqNo
      status
    }
  }
`

// Customer Invoices
export const GET_CUSTOMER_INVOICES = gql`
  query GetCustomerInvoices($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    customerinvoices(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
    ) {
      id
      seqNo
      customerId
      salesOrderId
      invoiceDate
      dueDate
      totalAmount
      paidAmount
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_CUSTOMER_INVOICE = gql`
  mutation CreateCustomerInvoice($input: CreateCustomerInvoiceInput!) {
    createCustomerInvoice(input: $input) {
      id
      seqNo
      status
    }
  }
`

// Cash Sales (alias for sales order with immediate payment)
export const CREATE_CASH_SALE = gql`
  mutation CreateCashSale($input: CreateSalesOrderInput!) {
    createSalesOrder(input: $input) {
      id
      seqNo
      status
      totalAmount
      orderDate
    }
  }
`

// Credit Memos (update invoice status to cancelled + record credit)
export const UPDATE_CUSTOMER_INVOICE = gql`
  mutation UpdateCustomerInvoice($id: ID!, $input: UpdateCustomerInvoiceInput!) {
    updateCustomerInvoice(id: $id, input: $input) {
      id
      seqNo
      status
      paidAmount
      totalAmount
    }
  }
`

// Attendance
export const GET_ATTENDANCES = gql`
  query GetAttendances($organizationId: ID!, $userId: ID, $page: Int, $limit: Int) {
    attendances(
      organizationId: $organizationId
      userId: $userId
      page: $page
      limit: $limit
    ) {
      id
      userId
      date
      checkIn
      checkOut
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      id
      status
    }
  }
`

// General Ledger
export const GET_GENERAL_LEDGERS = gql`
  query GetGeneralLedgers($organizationId: String!, $fiscalYear: String, $status: String) {
    generalLedgers(organizationId: $organizationId, fiscalYear: $fiscalYear, status: $status) {
      id
      transactionNumber
      transactionDate
      transactionType
      referenceModule
      referenceId
      debitAccount
      creditAccount
      amount
      currency
      description
      fiscalYear
      fiscalPeriod
      status
      createdAt
    }
  }
`

export const GET_CHART_OF_ACCOUNTS = gql`
  query GetChartOfAccounts($organizationId: String!, $accountType: String) {
    chartOfAccounts(organizationId: $organizationId, accountType: $accountType) {
      id
      accountCode
      accountName
      accountType
      parentAccount
      level
      isActive
      createdAt
    }
  }
`

export const CREATE_GENERAL_LEDGER = gql`
  mutation CreateGeneralLedger($input: GeneralLedgerInput!) {
    createGeneralLedger(input: $input) {
      id
      transactionNumber
      status
    }
  }
`

export const CREATE_CHART_OF_ACCOUNT = gql`
  mutation CreateChartOfAccount($input: ChartOfAccountsInput!) {
    createChartOfAccount(input: $input) {
      id
      accountCode
      accountName
    }
  }
`

// Cash Bank
export const GET_CASH_BANKS = gql`
  query GetCashBanks($organizationId: String!, $reconciliationStatus: String) {
    cashBanks(organizationId: $organizationId, reconciliationStatus: $reconciliationStatus) {
      id
      transactionNumber
      transactionDate
      transactionType
      bankAccount
      amount
      paymentMethod
      reconciliationStatus
      createdAt
    }
  }
`

export const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts($organizationId: String!) {
    bankAccounts(organizationId: $organizationId) {
      id
      accountNumber
      accountName
      bankName
      branchName
      currentBalance
      isActive
      createdAt
    }
  }
`

export const CREATE_CASH_BANK = gql`
  mutation CreateCashBank($input: CashBankInput!) {
    createCashBank(input: $input) {
      id
      transactionNumber
    }
  }
`

export const CREATE_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($input: BankAccountInput!) {
    createBankAccount(input: $input) {
      id
      accountNumber
      accountName
    }
  }
`

// Inventory Control
export const GET_INVENTORY_CONTROLS = gql`
  query GetInventoryControls($organizationId: String!, $warehouseId: String, $stockStatus: String) {
    inventoryControls(organizationId: $organizationId, warehouseId: $warehouseId, stockStatus: $stockStatus) {
      id
      itemId
      itemName
      binLocation
      quantity
      unit
      minStockLevel
      maxStockLevel
      reorderPoint
      warehouseId
      stockStatus
      createdAt
    }
  }
`

export const GET_LOW_STOCK_ITEMS = gql`
  query GetLowStockItems($organizationId: String!) {
    lowStockItems(organizationId: $organizationId) {
      id
      itemId
      itemName
      quantity
      reorderPoint
      stockStatus
    }
  }
`

export const CREATE_INVENTORY_CONTROL = gql`
  mutation CreateInventoryControl($input: InventoryControlInput!) {
    createInventoryControl(input: $input) {
      id
      itemName
      quantity
    }
  }
`

export const ADJUST_STOCK = gql`
  mutation AdjustStock($itemId: String!, $binLocation: String!, $quantity: Float!, $reason: String!) {
    adjustStock(itemId: $itemId, binLocation: $binLocation, quantity: $quantity, reason: $reason) {
      id
      quantity
      stockStatus
    }
  }
`

// Warehouse
export const GET_WAREHOUSES = gql`
  query GetWarehouses($organizationId: String!, $isActive: Boolean) {
    warehouses(organizationId: $organizationId, isActive: $isActive) {
      id
      warehouseCode
      warehouseName
      location
      address
      capacity
      currentUtilization
      managerName
      contactNumber
      warehouseType
      isActive
      createdAt
    }
  }
`

export const GET_WAREHOUSE_BINS = gql`
  query GetWarehouseBins($organizationId: String!, $warehouseId: String) {
    warehouseBins(organizationId: $organizationId, warehouseId: $warehouseId) {
      id
      warehouseId
      binCode
      binLocation
      binType
      capacity
      currentStock
      isAvailable
      createdAt
    }
  }
`

export const CREATE_WAREHOUSE = gql`
  mutation CreateWarehouse($input: WarehouseInput!) {
    createWarehouse(input: $input) {
      id
      warehouseCode
      warehouseName
    }
  }
`

export const CREATE_WAREHOUSE_BIN = gql`
  mutation CreateWarehouseBin($input: WarehouseBinInput!) {
    createWarehouseBin(input: $input) {
      id
      binCode
      binLocation
    }
  }
`

// Customer
export const GET_CUSTOMERS = gql`
  query GetCustomers($organizationId: String!) {
    customers(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      docNumber
    }
  }
`

// Production Planning
export const GET_PRODUCTION_PLANNINGS = gql`
  query GetProductionPlannings($organizationId: String!) {
    productionplannings(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_PRODUCTION_PLANNING = gql`
  mutation CreateProductionPlanning($input: ProductionPlanningInput!) {
    createProductionPlanning(input: $input) {
      id
      docNumber
    }
  }
`

// Work Order
export const GET_WORK_ORDERS = gql`
  query GetWorkOrders($organizationId: String!) {
    workorders(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_WORK_ORDER = gql`
  mutation CreateWorkOrder($input: WorkOrderInput!) {
    createWorkOrder(input: $input) {
      id
      docNumber
    }
  }
`

// Vendor Payment
export const GET_VENDOR_PAYMENTS = gql`
  query GetVendorPayments($organizationId: String!) {
    vendorpayments(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_VENDOR_PAYMENT = gql`
  mutation CreateVendorPayment($input: VendorPaymentInput!) {
    createVendorPayment(input: $input) {
      id
      docNumber
    }
  }
`

// Material Receipt
export const GET_MATERIAL_RECEIPTS = gql`
  query GetMaterialReceipts($organizationId: String!) {
    materialreceipts(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_MATERIAL_RECEIPT = gql`
  mutation CreateMaterialReceipt($input: MaterialReceiptInput!) {
    createMaterialReceipt(input: $input) {
      id
      docNumber
    }
  }
`

// Goods Receipt
export const GET_GOODS_RECEIPTS = gql`
  query GetGoodsReceipts($organizationId: String!) {
    goodsreceipts(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_GOODS_RECEIPT = gql`
  mutation CreateGoodsReceipt($input: GoodsReceiptInput!) {
    createGoodsReceipt(input: $input) {
      id
      docNumber
    }
  }
`

// GRN
export const GET_GRNS = gql`
  query GetGRNs($organizationId: String!) {
    grns(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_GRN = gql`
  mutation CreateGRN($input: GRNInput!) {
    createGRN(input: $input) {
      id
      docNumber
    }
  }
`

// Delivery Challan
export const GET_DELIVERY_CHALLANS = gql`
  query GetDeliveryChallans($organizationId: String!) {
    deliverychallans(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_DELIVERY_CHALLAN = gql`
  mutation CreateDeliveryChallan($input: DeliveryChallanInput!) {
    createDeliveryChallan(input: $input) {
      id
      docNumber
    }
  }
`

// Sales Return
export const GET_SALES_RETURNS = gql`
  query GetSalesReturns($organizationId: String!) {
    salesreturns(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_SALES_RETURN = gql`
  mutation CreateSalesReturn($input: SalesReturnInput!) {
    createSalesReturn(input: $input) {
      id
      docNumber
    }
  }
`

// Stock Adjustment
export const GET_STOCK_ADJUSTMENTS = gql`
  query GetStockAdjustments($organizationId: String!) {
    stockadjustments(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_STOCK_ADJUSTMENT = gql`
  mutation CreateStockAdjustment($input: StockAdjustmentInput!) {
    createStockAdjustment(input: $input) {
      id
      docNumber
    }
  }
`

// Stock Transfer
export const GET_STOCK_TRANSFERS = gql`
  query GetStockTransfers($organizationId: String!) {
    stocktransfers(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_STOCK_TRANSFER = gql`
  mutation CreateStockTransfer($input: StockTransferInput!) {
    createStockTransfer(input: $input) {
      id
      docNumber
    }
  }
`

// Payroll Management
export const GET_PAYROLL_MANAGEMENTS = gql`
  query GetPayrollManagements($organizationId: String!) {
    payrollmanagements(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_PAYROLL_MANAGEMENT = gql`
  mutation CreatePayrollManagement($input: PayrollManagementInput!) {
    createPayrollManagement(input: $input) {
      id
      docNumber
    }
  }
`

// Salary Processing
export const GET_SALARY_PROCESSINGS = gql`
  query GetSalaryProcessings($organizationId: String!) {
    salaryprocessings(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_SALARY_PROCESSING = gql`
  mutation CreateSalaryProcessing($input: SalaryProcessingInput!) {
    createSalaryProcessing(input: $input) {
      id
      docNumber
    }
  }
`

// Extraction
export const GET_EXTRACTIONS = gql`
  query GetExtractions($organizationId: String!, $status: String) {
    extractions(organizationId: $organizationId, status: $status) {
      id
      extractionNumber
      extractionDate
      rawMaterialId
      rawMaterialName
      quantity
      unit
      sourceLocation
      extractionType
      status
      createdAt
    }
  }
`

export const CREATE_EXTRACTION = gql`
  mutation CreateExtraction($input: ExtractionInput!) {
    createExtraction(input: $input) {
      id
      extractionNumber
    }
  }
`

// Raw Material Requisition
export const GET_RAW_MATERIAL_REQUISITIONS = gql`
  query GetRawMaterialRequisitions($organizationId: String!, $status: String) {
    rawMaterialRequisitions(organizationId: $organizationId, status: $status) {
      id
      requisitionNumber
      requisitionDate
      requiredDate
      rawMaterialId
      requestedQuantity
      unit
      purpose
      status
      createdAt
    }
  }
`

export const CREATE_RAW_MATERIAL_REQUISITION = gql`
  mutation CreateRawMaterialRequisition($input: RawMaterialRequisitionInput!) {
    createRawMaterialRequisition(input: $input) {
      id
      requisitionNumber
    }
  }
`
