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
