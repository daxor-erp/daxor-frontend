import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function ensureVendor(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  email?: string,
): Promise<string> {
  const list = await gql<{ vendors: Array<{ id: string; name: string }> }>(
    request,
    `query($organizationId: ID!) {
      vendors(organizationId: $organizationId, page: 1, limit: 200) { id name }
    }`,
    { organizationId },
    token,
  )
  const hit = list.vendors.find((v) => v.name === name)
  if (hit) return hit.id

  const created = await gql<{ createVendor: { id: string } }>(
    request,
    `mutation($input: CreateVendorInput!) {
      createVendor(input: $input) { id }
    }`,
    {
      input: {
        name,
        email: email ?? `${name.replace(/\s+/g, '.').toLowerCase()}@e2e.example.com`,
        organizationId,
      },
    },
    token,
  )
  return created.createVendor.id
}

export async function createAndApproveVendorBillViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  totalAmount: number,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const due = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]

  const created = await gql<{ createVendorBill: { id: string; billNumber: string } }>(
    request,
    `mutation($input: CreateVendorBillInput!) {
      createVendorBill(input: $input) { id billNumber status }
    }`,
    {
      input: {
        vendorId,
        billDate: today,
        dueDate: due,
        lineItems: [
          {
            description: 'E2E vendor bill line',
            quantity: 1,
            unitPrice: totalAmount,
            total: totalAmount,
          },
        ],
        subtotal: totalAmount,
        taxAmount: 0,
        totalAmount,
        organizationId,
      },
    },
    token,
  )

  const billId = created.createVendorBill.id
  await gql(
    request,
    `mutation($id: ID!) { approveVendorBill(id: $id) { id status } }`,
    { id: billId },
    token,
  )
  return billId
}

export async function payVendorBillViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  billId: string,
  amount: number,
): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createVendorPayment: { id: string; paymentNumber: string } }>(
    request,
    `mutation($input: CreateVendorPaymentInput!) {
      createVendorPayment(input: $input) { id paymentNumber status }
    }`,
    {
      input: {
        vendorId,
        paymentDate: today,
        paymentMethod: 'bank_transfer',
        totalAmount: amount,
        allocations: [{ billId, amount }],
        organizationId,
      },
    },
    token,
  )
  return created.createVendorPayment.id
}
