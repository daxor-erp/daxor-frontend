import { gql } from '@apollo/client'

// Auth
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
    deleteVendor(id: $id)
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
      vendorName
      projectId
      projectName
      deliveryDate      subtotal
      taxAmount
      totalAmount
      status
      orderDate
      items {
        itemDescription
        quantity
        unitPrice
        lineTotal
      }
      notes
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
      totalAmount
    }
  }
`

export const UPDATE_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
    updatePurchaseOrder(id: $id, input: $input) {
      id
      seqNo
      status
      totalAmount
    }
  }
`

export const SUBMIT_PURCHASE_ORDER = gql`
  mutation SubmitPurchaseOrder($id: ID!) {
    submitPurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const APPROVE_PURCHASE_ORDER = gql`
  mutation ApprovePurchaseOrder($id: ID!) {
    approvePurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const RECEIVE_PURCHASE_ORDER = gql`
  mutation ReceivePurchaseOrder($id: ID!) {
    receivePurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const BILL_PURCHASE_ORDER = gql`
  mutation BillPurchaseOrder($id: ID!, $billDate: String!, $dueDate: String!) {
    billPurchaseOrder(id: $id, billDate: $billDate, dueDate: $dueDate) {
      id
      billNumber
      status
      totalAmount
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
      referenceModule
      referenceId
      amount
      currency
      paymentMethod
      chequeNumber
      description
      reconciliationStatus
      reconciliationDate
      organizationId
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
      accountType
      currency
      currentBalance
      isActive
      organizationId
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

export const UPDATE_WAREHOUSE = gql`
  mutation UpdateWarehouse($id: ID!, $input: WarehouseInput!) {
    updateWarehouse(id: $id, input: $input) {
      id
      warehouseCode
      warehouseName
      location
      address
      capacity
      managerName
      contactNumber
      warehouseType
      isActive
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
  query GetVendorPayments($organizationId: ID!, $vendorId: ID, $page: Int, $limit: Int) {
    vendorPayments(organizationId: $organizationId, vendorId: $vendorId, page: $page, limit: $limit) {
      id
      paymentNumber
      vendorId
      vendor {
        id
        name
      }
      paymentDate
      paymentMethod
      referenceNumber
      totalAmount
      allocations {
        billId
        amount
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_VENDOR_PAYMENT = gql`
  query GetVendorPayment($id: ID!) {
    vendorPayment(id: $id) {
      id
      paymentNumber
      vendorId
      vendor {
        id
        name
      }
      paymentDate
      paymentMethod
      referenceNumber
      totalAmount
      allocations {
        billId
        billNumber
        amount
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_PAYMENT = gql`
  mutation CreateVendorPayment($input: CreateVendorPaymentInput!) {
    createVendorPayment(input: $input) {
      id
      paymentNumber
      status
    }
  }
`

export const UPDATE_VENDOR_PAYMENT = gql`
  mutation UpdateVendorPayment($id: ID!, $input: UpdateVendorPaymentInput!) {
    updateVendorPayment(id: $id, input: $input) {
      id
      paymentNumber
      status
    }
  }
`

export const DELETE_VENDOR_PAYMENT = gql`
  mutation DeleteVendorPayment($id: ID!) {
    deleteVendorPayment(id: $id)
  }
`

// Vendor Bills
export const GET_VENDOR_BILLS = gql`
  query GetVendorBills($organizationId: ID!, $vendorId: ID, $status: String, $page: Int, $limit: Int) {
    vendorBills(organizationId: $organizationId, vendorId: $vendorId, status: $status, page: $page, limit: $limit) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
      }
      billDate
      dueDate
      subtotal
      discountAmount
      taxAmount
      totalAmount
      paidAmount
      outstandingAmount
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_VENDOR_BILL = gql`
  query GetVendorBill($id: ID!) {
    vendorBill(id: $id) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
        email
      }
      purchaseOrderId
      billDate
      dueDate
      lineItems {
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      discountAmount
      taxAmount
      totalAmount
      paidAmount
      outstandingAmount
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_OUTSTANDING_VENDOR_BILLS = gql`
  query GetOutstandingVendorBills($organizationId: ID!) {
    outstandingVendorBills(organizationId: $organizationId) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
      }
      dueDate
      totalAmount
      paidAmount
      outstandingAmount
      status
    }
  }
`

export const CREATE_VENDOR_BILL = gql`
  mutation CreateVendorBill($input: CreateVendorBillInput!) {
    createVendorBill(input: $input) {
      id
      billNumber
      status
    }
  }
`

export const UPDATE_VENDOR_BILL = gql`
  mutation UpdateVendorBill($id: ID!, $input: UpdateVendorBillInput!) {
    updateVendorBill(id: $id, input: $input) {
      id
      billNumber
      status
    }
  }
`

export const APPROVE_VENDOR_BILL = gql`
  mutation ApproveVendorBill($id: ID!) {
    approveVendorBill(id: $id) {
      id
      billNumber
      status
    }
  }
`

export const DELETE_VENDOR_BILL = gql`
  mutation DeleteVendorBill($id: ID!) {
    deleteVendorBill(id: $id)
  }
`

// Material Receipt
export const GET_MATERIAL_RECEIPTS = gql`
  query GetMaterialReceipts($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    materialreceipts(organizationId: $organizationId, page: $page, limit: $limit, status: $status) {
      id
      mrnNumber
      purchaseOrderId
      purchaseOrderNumber
      vendorId
      vendorName
      receiptDate
      warehouseId
      warehouseName
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        rejectedQty
        unit
        unitPrice
        lineTotal
      }
      totalAmount
      status
      notes
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const GET_MATERIAL_RECEIPT = gql`
  query GetMaterialReceipt($id: ID!) {
    materialreceipt(id: $id) {
      id
      mrnNumber
      purchaseOrderId
      purchaseOrderNumber
      vendorId
      vendorName
      receiptDate
      warehouseId
      warehouseName
      lineItems {
        itemId
        itemDescription
        orderedQty
        receivedQty
        rejectedQty
        unit
        unitPrice
        lineTotal
      }
      totalAmount
      status
      notes
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_MATERIAL_RECEIPT = gql`
  mutation CreateMaterialReceipt($input: CreateMaterialReceiptInput!) {
    createMaterialReceipt(input: $input) {
      id
      mrnNumber
      status
    }
  }
`

export const UPDATE_MATERIAL_RECEIPT = gql`
  mutation UpdateMaterialReceipt($id: ID!, $input: UpdateMaterialReceiptInput!) {
    updateMaterialReceipt(id: $id, input: $input) {
      id
      mrnNumber
      status
    }
  }
`

export const CONFIRM_MATERIAL_RECEIPT = gql`
  mutation ConfirmMaterialReceipt($id: ID!) {
    confirmMaterialReceipt(id: $id) {
      id
      mrnNumber
      status
    }
  }
`

export const CANCEL_MATERIAL_RECEIPT = gql`
  mutation CancelMaterialReceipt($id: ID!) {
    cancelMaterialReceipt(id: $id) {
      id
      mrnNumber
      status
    }
  }
`

export const DELETE_MATERIAL_RECEIPT = gql`
  mutation DeleteMaterialReceipt($id: ID!) {
    deleteMaterialReceipt(id: $id)
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
  query GetGRNs($organizationId: ID!, $page: Int, $limit: Int) {
    grns(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      grnNumber
      purchaseOrderId
      vendorId
      vendorName
      receivedDate
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        unitPrice
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_GRN = gql`
  mutation CreateGRN($input: CreateGRNInput!) {
    createGRN(input: $input) {
      id
      grnNumber
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
  query GetStockAdjustments($organizationId: ID!, $page: Int, $limit: Int) {
    stockadjustments(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      adjNumber
      adjDate
      warehouseId
      warehouseName
      adjustmentType
      lineItems {
        itemDescription
        currentQty
        adjustedQty
        difference
        unit
      }
      reason
      status
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_STOCK_ADJUSTMENT = gql`
  mutation CreateStockAdjustment($input: CreateStockAdjustmentInput!) {
    createStockAdjustment(input: $input) {
      id
      adjNumber
      status
    }
  }
`

export const UPDATE_STOCK_ADJUSTMENT = gql`
  mutation UpdateStockAdjustment($id: ID!, $input: UpdateStockAdjustmentInput!) {
    updateStockAdjustment(id: $id, input: $input) {
      id
      adjNumber
      status
    }
  }
`

export const CONFIRM_STOCK_ADJUSTMENT = gql`
  mutation ConfirmStockAdjustment($id: ID!) {
    confirmStockAdjustment(id: $id) {
      id
      adjNumber
      status
    }
  }
`

export const CANCEL_STOCK_ADJUSTMENT = gql`
  mutation CancelStockAdjustment($id: ID!) {
    cancelStockAdjustment(id: $id) {
      id
      adjNumber
      status
    }
  }
`

export const DELETE_STOCK_ADJUSTMENT = gql`
  mutation DeleteStockAdjustment($id: ID!) {
    deleteStockAdjustment(id: $id)
  }
`

// Stock Transfer
export const GET_STOCK_TRANSFERS = gql`
  query GetStockTransfers($organizationId: ID!, $page: Int, $limit: Int) {
    stocktransfers(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      transferNumber
      transferDate
      fromWarehouseId
      fromWarehouseName
      toWarehouseId
      toWarehouseName
      lineItems {
        itemDescription
        qty
        unit
      }
      status
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_STOCK_TRANSFER = gql`
  mutation CreateStockTransfer($input: CreateStockTransferInput!) {
    createStockTransfer(input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const UPDATE_STOCK_TRANSFER = gql`
  mutation UpdateStockTransfer($id: ID!, $input: UpdateStockTransferInput!) {
    updateStockTransfer(id: $id, input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const CONFIRM_STOCK_TRANSFER = gql`
  mutation ConfirmStockTransfer($id: ID!) {
    confirmStockTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const CANCEL_STOCK_TRANSFER = gql`
  mutation CancelStockTransfer($id: ID!) {
    cancelStockTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const DELETE_STOCK_TRANSFER = gql`
  mutation DeleteStockTransfer($id: ID!) {
    deleteStockTransfer(id: $id)
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

// Clients
export const GET_CLIENTS = gql`
  query GetClients($organizationId: ID, $page: Int, $limit: Int, $status: String, $search: String) {
    clients(organizationId: $organizationId, page: $page, limit: $limit, status: $status, search: $search) {
      id
      seqNo
      name
      email
      phone
      company
      address
      city
      state
      country
      zipCode
      website
      industry
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      seqNo
      name
      email
      phone
      company
      address
      city
      state
      country
      zipCode
      website
      industry
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_CLIENTS_BY_ORGANIZATION = gql`
  query GetClientsByOrganization($organizationId: ID!) {
    clientsByOrganization(organizationId: $organizationId) {
      id
      name
      email
      phone
      company
      status
    }
  }
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
      status
    }
  }
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      name
      email
      status
    }
  }
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

// Quotations
export const GET_QUOTATIONS = gql`
  query GetQuotations {
    quotations {
      id
      seqNo
      quotationNumber
      clientId {
        id
        name
        email
      }
      subject
      quotationDate
      validUntil
      lineItems {
        itemId
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      taxAmount
      discountAmount
      totalAmount
      terms
      notes
      status
      sentAt
      sentBy
      organizationId
      createdAt
    }
  }
`

export const GET_QUOTATION = gql`
  query GetQuotation($id: ID!) {
    quotation(id: $id) {
      id
      seqNo
      quotationNumber
      clientId {
        id
        name
        email
      }
      subject
      quotationDate
      validUntil
      lineItems {
        itemId
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      taxAmount
      discountAmount
      totalAmount
      terms
      notes
      status
      sentAt
      sentBy
      organizationId
      createdAt
    }
  }
`

export const GET_QUOTATIONS_BY_ORGANIZATION = gql`
  query GetQuotationsByOrganization($organizationId: ID!) {
    quotationsByOrganization(organizationId: $organizationId) {
      id
      quotationNumber
      clientId {
        id
        name
        email
      }
      subject
      quotationDate
      validUntil
      totalAmount
      status
      sentAt
    }
  }
`

export const GET_QUOTATIONS_BY_CLIENT = gql`
  query GetQuotationsByClient($clientId: ID!) {
    quotationsByClient(clientId: $clientId) {
      id
      quotationNumber
      subject
      quotationDate
      validUntil
      totalAmount
      status
      sentAt
    }
  }
`

export const CREATE_QUOTATION = gql`
  mutation CreateQuotation($input: CreateQuotationInput!) {
    createQuotation(input: $input) {
      id
      quotationNumber
      status
    }
  }
`

export const UPDATE_QUOTATION = gql`
  mutation UpdateQuotation($id: ID!, $input: UpdateQuotationInput!) {
    updateQuotation(id: $id, input: $input) {
      id
      quotationNumber
      status
    }
  }
`

export const DELETE_QUOTATION = gql`
  mutation DeleteQuotation($id: ID!) {
    deleteQuotation(id: $id)
  }
`

export const SEND_QUOTATION = gql`
  mutation SendQuotation($id: ID!) {
    sendQuotation(id: $id) {
      quotation {
        id
        quotationNumber
        status
        sentAt
        sentBy
      }
      emailSent
    }
  }
`

// Products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      seqNo
      name
      sku
      description
      category
      brand
      unit
      price
      costPrice
      taxRate
      minStockLevel
      maxStockLevel
      reorderPoint
      barcode
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      seqNo
      name
      sku
      description
      category
      brand
      unit
      price
      costPrice
      taxRate
      minStockLevel
      maxStockLevel
      reorderPoint
      barcode
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PRODUCTS_BY_ORGANIZATION = gql`
  query GetProductsByOrganization($organizationId: ID!) {
    productsByOrganization(organizationId: $organizationId) {
      id
      name
      sku
      price
      status
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      sku
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

// Vendor Credits
export const GET_VENDOR_CREDITS = gql`
  query GetVendorCredits($organizationId: ID!, $vendorId: ID) {
    vendorCredits(organizationId: $organizationId, vendorId: $vendorId) {
      id
      creditNumber
      vendorId
      vendor { id name }
      creditDate
      totalAmount
      appliedAmount
      remainingAmount
      reason
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_CREDIT = gql`
  mutation CreateVendorCredit($input: CreateVendorCreditInput!) {
    createVendorCredit(input: $input) {
      id
      creditNumber
      status
    }
  }
`
export const DELETE_VENDOR_CREDIT = gql`
  mutation DeleteVendorCredit($id: ID!) {
    deleteVendorCredit(id: $id)
  }
`

// Vendor Prepayments
export const GET_VENDOR_PREPAYMENTS = gql`
  query GetVendorPrepayments($organizationId: ID!, $vendorId: ID) {
    vendorPrepayments(organizationId: $organizationId, vendorId: $vendorId) {
      id
      prepaymentNumber
      vendorId
      vendor { id name }
      prepaymentDate
      amount
      appliedAmount
      remainingAmount
      paymentMethod
      referenceNumber
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_PREPAYMENT = gql`
  mutation CreateVendorPrepayment($input: CreateVendorPrepaymentInput!) {
    createVendorPrepayment(input: $input) {
      id
      prepaymentNumber
      status
    }
  }
`

export const DELETE_VENDOR_PREPAYMENT = gql`
  mutation DeleteVendorPrepayment($id: ID!) {
    deleteVendorPrepayment(id: $id)
  }
`

// Purchase Orders (extended for Bill PO)
export const GET_PURCHASE_ORDERS_FOR_BILLING = gql`
  query GetPurchaseOrdersForBilling($organizationId: ID!) {
    purchaseorders(organizationId: $organizationId, page: 1, limit: 200) {
      id
      seqNo
      vendorId
      vendorName
      projectId
      projectName
      totalAmount
      status
      orderDate
      organizationId
    }
  }
`
