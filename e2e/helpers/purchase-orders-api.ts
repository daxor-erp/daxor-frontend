import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export type PoApiResult = {
  id: string
  seqNo?: string | null
  status: string
  totalAmount: number
}

export async function createPurchaseOrderViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  productId: string,
) {
  const data = await gql<{ createPurchaseOrder: PoApiResult }>(
    request,
    `mutation($input: CreatePurchaseOrderInput!) {
      createPurchaseOrder(input: $input) { id seqNo status totalAmount }
    }`,
    {
      input: {
        vendorId,
        orderDate: new Date().toISOString(),
        items: [{ productId, productName: 'E2E Product', quantity: 5, unitPrice: 100 }],
        organizationId,
      },
    },
    token,
  )
  return data.createPurchaseOrder
}

export async function getPurchaseOrderViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    purchaseorder: {
      id: string
      status: string
      untaxedAmount: number
      taxAmount: number
      totalAmount: number
      items: Array<{ id: string; quantity: number; qtyReceived: number }>
    }
  }>(
    request,
    `query($id: ID!) {
      purchaseorder(id: $id) {
        id status untaxedAmount taxAmount totalAmount
        items { id quantity qtyReceived }
      }
    }`,
    { id },
    token,
  )
  return data.purchaseorder
}

export async function markRfqSentViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{ markPurchaseOrderRfqSent: PoApiResult }>(
    request,
    `mutation($id: ID!) { markPurchaseOrderRfqSent(id: $id) { id status totalAmount } }`,
    { id },
    token,
  )
  return data.markPurchaseOrderRfqSent
}

export async function submitPurchaseOrderViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{ submitPurchaseOrder: PoApiResult }>(
    request,
    `mutation($id: ID!) { submitPurchaseOrder(id: $id) { id status totalAmount } }`,
    { id },
    token,
  )
  return data.submitPurchaseOrder
}

export async function approvePurchaseOrderViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{ approvePurchaseOrder: PoApiResult }>(
    request,
    `mutation($id: ID!) { approvePurchaseOrder(id: $id) { id status totalAmount } }`,
    { id },
    token,
  )
  return data.approvePurchaseOrder
}

export async function confirmPurchaseOrderViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{ confirmPurchaseOrder: PoApiResult }>(
    request,
    `mutation($id: ID!) { confirmPurchaseOrder(id: $id) { id status totalAmount } }`,
    { id },
    token,
  )
  return data.confirmPurchaseOrder
}

/** Gap fix: Agreement / Source Document / Incoterms / Buyer / GST Treatment / editable Currency header fields. */
export async function createPurchaseOrderWithGapFieldsViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  productId: string,
  buyerId: string,
) {
  const data = await gql<{
    createPurchaseOrder: PoApiResult & {
      agreement?: string | null
      sourceDocument?: string | null
      incoterms?: string | null
      buyerId?: string | null
      currency: string
      gstTreatment?: string | null
    }
  }>(
    request,
    `mutation($input: CreatePurchaseOrderInput!) {
      createPurchaseOrder(input: $input) {
        id seqNo status totalAmount agreement sourceDocument incoterms buyerId currency gstTreatment
      }
    }`,
    {
      input: {
        vendorId,
        buyerId,
        currency: 'INR',
        gstTreatment: 'registered_business_regular',
        agreement: 'AGR-E2E-001',
        sourceDocument: 'SO-E2E-9001',
        incoterms: 'FOB',
        orderDate: new Date().toISOString(),
        items: [{ productId, productName: 'E2E Product', quantity: 3, unitPrice: 100 }],
        organizationId,
      },
    },
    token,
  )
  return data.createPurchaseOrder
}

/** Gap fix: Packaging concept — packagingId/packagingQty on PO lines. */
export async function createPurchaseOrderWithPackagingViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  productId: string,
  packagingId: string,
) {
  const data = await gql<{
    createPurchaseOrder: PoApiResult & { items: Array<{ packagingId?: string | null; packagingQty: number }> }
  }>(
    request,
    `mutation($input: CreatePurchaseOrderInput!) {
      createPurchaseOrder(input: $input) {
        id seqNo status totalAmount
        items { packagingId packagingQty }
      }
    }`,
    {
      input: {
        vendorId,
        orderDate: new Date().toISOString(),
        items: [{ productId, productName: 'E2E Product', quantity: 20, packagingId, packagingQty: 2, unitPrice: 100 }],
        organizationId,
      },
    },
    token,
  )
  return data.createPurchaseOrder
}

/** Gap fix: Catalog/section/note line types mixed with product lines. */
export async function createPurchaseOrderWithSectionAndNoteViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  productId: string,
) {
  const data = await gql<{
    createPurchaseOrder: PoApiResult & { items: Array<{ lineType: string; note?: string | null; lineTotal: number }> }
  }>(
    request,
    `mutation($input: CreatePurchaseOrderInput!) {
      createPurchaseOrder(input: $input) {
        id seqNo status totalAmount
        items { lineType note lineTotal }
      }
    }`,
    {
      input: {
        vendorId,
        orderDate: new Date().toISOString(),
        items: [
          { lineType: 'section', note: 'Consumables' },
          { productId, productName: 'E2E Product', quantity: 2, unitPrice: 100 },
          { lineType: 'note', note: 'Handle with care' },
        ],
        organizationId,
      },
    },
    token,
  )
  return data.createPurchaseOrder
}

/** Gap fix: standalone Print RFQ action (distinct from Send by Email). */
export async function markPurchaseOrderPrintedViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{ markPurchaseOrderPrinted: { id: string; status: string; lastPrintedAt?: string | null } }>(
    request,
    `mutation($id: ID!) { markPurchaseOrderPrinted(id: $id) { id status lastPrintedAt } }`,
    { id },
    token,
  )
  return data.markPurchaseOrderPrinted
}

/** Gap fix: Receipt Status / Billing Status / per-line qtyReceived-qtyBilled display data. */
export async function getPurchaseOrderStatusesViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    purchaseorder: {
      id: string
      receiptStatus: string
      billingStatus: string
      items: Array<{ id: string; quantity: number; qtyReceived: number; qtyBilled: number }>
    }
  }>(
    request,
    `query($id: ID!) {
      purchaseorder(id: $id) {
        id receiptStatus billingStatus
        items { id quantity qtyReceived qtyBilled }
      }
    }`,
    { id },
    token,
  )
  return data.purchaseorder
}

export async function receivePurchaseOrderViaApi(
  request: APIRequestContext,
  token: string,
  id: string,
  lines?: Array<{ lineId: string; qtyReceived: number }>,
) {
  const data = await gql<{
    receivePurchaseOrder: { id: string; status: string; receiptStatus: string; items: Array<{ id: string; qtyReceived: number }> }
  }>(
    request,
    `mutation($id: ID!, $lines: [PoReceiveLineInput!]) {
      receivePurchaseOrder(id: $id, lines: $lines) {
        id status receiptStatus items { id qtyReceived }
      }
    }`,
    { id, lines },
    token,
  )
  return data.receivePurchaseOrder
}
