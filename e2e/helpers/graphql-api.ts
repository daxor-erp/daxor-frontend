import type { APIRequestContext } from '@playwright/test'

const API_URL = process.env.E2E_GRAPHQL_URL || 'http://localhost:4000/graphql'

type GqlPayload<T> = { data?: T; errors?: Array<{ message: string }> }

export async function gql<T>(
  request: APIRequestContext,
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await request.post(API_URL, {
    headers,
    data: { query, variables },
  })
  const json = (await res.json()) as GqlPayload<T>
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  if (!json.data) throw new Error('GraphQL response missing data')
  return json.data
}

export async function apiLogin(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<{ token: string; userId: string; organizationId: string }> {
  const data = await gql<{
    login: { token: string; user: { id: string; organizationId?: string | null } }
  }>(
    request,
    `mutation Login($input: LoginInput!) {
      login(input: $input) { token user { id organizationId } }
    }`,
    { input: { email, password } },
  )
  const orgId = data.login.user.organizationId
  if (!orgId) throw new Error('User has no organizationId')
  return {
    token: data.login.token,
    userId: data.login.user.id,
    organizationId: String(orgId),
  }
}

type ApprovalRow = {
  id: string
  entityType: string
  entityId: string
  moduleKey: string
  status: string
}

async function findPendingApprovalForEntity(
  request: APIRequestContext,
  token: string,
  entityId: string,
): Promise<ApprovalRow | undefined> {
  const id = String(entityId)
  const match = (rows: ApprovalRow[]) =>
    rows.find((r) => String(r.entityId) === id && r.status === 'PENDING')

  const assignee = await gql<{ myPendingApprovalRequests: ApprovalRow[] }>(
    request,
    `query { myPendingApprovalRequests { id entityType entityId moduleKey status } }`,
    undefined,
    token,
  )
  const fromAssignee = match(assignee.myPendingApprovalRequests)
  if (fromAssignee) return fromAssignee

  const mine = await gql<{ myApprovalRequests: ApprovalRow[] }>(
    request,
    `query {
      myApprovalRequests(status: PENDING, role: ANY, limit: 100) {
        id entityType entityId moduleKey status
      }
    }`,
    undefined,
    token,
  )
  return match(mine.myApprovalRequests)
}

export async function approveEntityViaApi(
  request: APIRequestContext,
  token: string,
  entityId: string,
  label = 'entity',
) {
  const req = await findPendingApprovalForEntity(request, token, entityId)
  if (!req) throw new Error(`No pending approval for ${label} ${entityId}`)
  await gql(
    request,
    `mutation($id: ID!) {
      resolveApprovalRequest(id: $id, decision: APPROVED) { id status }
    }`,
    { id: req.id },
    token,
  )
}

export async function approveQuotationViaApi(
  request: APIRequestContext,
  token: string,
  quotationId: string,
) {
  await approveEntityViaApi(request, token, quotationId, 'quotation')
}

export async function submitAndApproveSalesEnquiry(
  request: APIRequestContext,
  token: string,
  enquiryId: string,
) {
  await gql(
    request,
    `mutation($id: ID!) { submitSalesEnquiryForApproval(id: $id) { id status } }`,
    { id: enquiryId },
    token,
  )
  await approveEntityViaApi(request, token, enquiryId, 'sales enquiry')
  await gql(
    request,
    `mutation($id: ID!, $input: UpdateSalesEnquiryInput!) {
      updateSalesEnquiry(id: $id, input: $input) { id status }
    }`,
    { id: enquiryId, input: { status: 'won' } },
    token,
  )
}

export async function sendQuotationViaApi(
  request: APIRequestContext,
  token: string,
  quotationId: string,
) {
  await gql<{
    sendQuotation: { quotation: { id: string; status: string } }
  }>(
    request,
    `mutation($id: ID!) {
      sendQuotation(id: $id) { quotation { id status } emailSent }
    }`,
    { id: quotationId },
    token,
  )
}

export async function submitAndApproveSalesOrder(
  request: APIRequestContext,
  token: string,
  salesOrderId: string,
) {
  await gql(
    request,
    `mutation($id: ID!) { submitSalesOrder(id: $id) { id status } }`,
    { id: salesOrderId },
    token,
  )
  await approveEntityViaApi(request, token, salesOrderId, 'sales order')
}

export async function findSalesOrderByQuotation(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  quotationId: string,
): Promise<{ id: string; totalAmount: number; status: string }> {
  const data = await gql<{
    salesorders: Array<{ id: string; quotationId?: string | null; totalAmount: number; status: string }>
  }>(
    request,
    `query($organizationId: ID!) {
      salesorders(organizationId: $organizationId, page: 1, limit: 100) {
        id quotationId totalAmount status
      }
    }`,
    { organizationId },
    token,
  )
  const so = data.salesorders.find((s) => String(s.quotationId) === String(quotationId))
  if (!so) throw new Error(`No sales order for quotation ${quotationId}`)
  return so
}

export async function createDeliveryOrderForSo(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  customerId: string,
  salesOrderId: string,
  docSuffix: string,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{ createDeliveryOrder: { id: string } }>(
    request,
    `mutation($input: CreateDeliveryOrderInput!) {
      createDeliveryOrder(input: $input) { id docNumber status }
    }`,
    {
      input: {
        organizationId,
        docNumber: `DO-E2E-${docSuffix}`,
        salesOrderId,
        customerId,
        deliveryDate: today,
        status: 'READY',
        items: [{ itemName: 'E2E shipment line', quantity: 1, unit: 'unit' }],
      },
    },
    token,
  )
  return data.createDeliveryOrder.id
}

export async function transitionDeliveryOrder(
  request: APIRequestContext,
  token: string,
  deliveryOrderId: string,
  status: string,
) {
  await gql(
    request,
    `mutation($id: ID!, $status: String!) {
      transitionDeliveryOrderStatus(id: $id, status: $status) { id status }
    }`,
    { id: deliveryOrderId, status },
    token,
  )
}

export async function createAndApproveDeliveryChallan(
  request: APIRequestContext,
  token: string,
  organizationId: string,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createDeliveryChallan: { id: string } }>(
    request,
    `mutation($input: DeliveryChallanInput!) {
      createDeliveryChallan(input: $input) { id status }
    }`,
    { input: { organizationId, docDate: today } },
    token,
  )
  const id = created.createDeliveryChallan.id
  await gql(
    request,
    `mutation($id: ID!) { submitDeliveryChallanForApproval(id: $id) { id status } }`,
    { id },
    token,
  )
  await approveEntityViaApi(request, token, id, 'delivery challan')
  return id
}

export async function markInvoiceSent(
  request: APIRequestContext,
  token: string,
  invoiceId: string,
) {
  await gql(
    request,
    `mutation($id: ID!, $input: UpdateCustomerInvoiceInput!) {
      updateCustomerInvoice(id: $id, input: $input) { id status }
    }`,
    { id: invoiceId, input: { status: 'sent' } },
    token,
  )
}

export async function payCustomerInvoice(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  customerId: string,
  invoiceId: string,
  amount: number,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{ createCustomerPayment: { id: string } }>(
    request,
    `mutation($input: CreateCustomerPaymentInput!) {
      createCustomerPayment(input: $input) { id paymentNumber totalAmount }
    }`,
    {
      input: {
        organizationId,
        customerId,
        paymentDate: today,
        paymentMethod: 'bank_transfer',
        totalAmount: amount,
        allocations: [{ invoiceId, amount }],
      },
    },
    token,
  )
  return data.createCustomerPayment.id
}

export async function createAndApproveInvoiceViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  customerId: string,
  totalAmount: number,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createCustomerInvoice: { id: string } }>(
    request,
    `mutation($input: CreateCustomerInvoiceInput!) {
      createCustomerInvoice(input: $input) { id status totalAmount }
    }`,
    {
      input: {
        organizationId,
        customerId,
        invoiceDate: today,
        totalAmount,
      },
    },
    token,
  )
  const id = created.createCustomerInvoice.id
  await gql(
    request,
    `mutation($id: ID!) { submitCustomerInvoiceForApproval(id: $id) { id status } }`,
    { id },
    token,
  )
  await approveCustomerInvoiceViaApi(request, token, id)
  return id
}

export async function setQuotationStatus(
  request: APIRequestContext,
  token: string,
  id: string,
  status: string,
) {
  await gql(
    request,
    `mutation($id: ID!, $input: UpdateQuotationInput!) {
      updateQuotation(id: $id, input: $input) { id status }
    }`,
    { id, input: { status } },
    token,
  )
}

export async function approveCustomerInvoiceViaApi(
  request: APIRequestContext,
  token: string,
  invoiceId: string,
) {
  await approveEntityViaApi(request, token, invoiceId, 'invoice')
}

export async function ensureCustomer(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  email: string,
): Promise<string> {
  const existing = await gql<{
    customers: Array<{ id: string; name: string }>
  }>(
    request,
    `query($organizationId: String!) {
      customers(organizationId: $organizationId) { id name email }
    }`,
    { organizationId },
    token,
  )
  const found = existing.customers.find((c) => c.name === name)
  if (found) return found.id

  const created = await gql<{
    createCustomer: { id: string }
  }>(
    request,
    `mutation($input: CreateCustomerInput!) {
      createCustomer(input: $input) { id name }
    }`,
    {
      input: {
        name,
        email,
        organizationId,
        invoiceBillable: true,
      },
    },
    token,
  )
  return created.createCustomer.id
}

export async function listJournalReferences(
  request: APIRequestContext,
  token: string,
  organizationId: string,
): Promise<string[]> {
  const data = await gql<{
    journalEntries: Array<{ referenceNumber?: string | null; description: string }>
  }>(
    request,
    `query($organizationId: String!) {
      journalEntries(organizationId: $organizationId) {
        referenceNumber
        description
      }
    }`,
    { organizationId },
    token,
  )
  return data.journalEntries
    .map((j) => j.referenceNumber || j.description)
    .filter(Boolean) as string[]
}
