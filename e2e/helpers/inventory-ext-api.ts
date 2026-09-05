import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createConfirmedGrnViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  itemDescription: string,
  receivedQty: number,
  unitPrice: number,
): Promise<{ grnId: string; grnNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createGRN: { id: string; grnNumber: string } }>(
    request,
    `mutation($input: CreateGRNInput!) {
      createGRN(input: $input) { id grnNumber status }
    }`,
    {
      input: {
        organizationId,
        receivedDate: today,
        status: 'confirmed',
        lineItems: [
          {
            itemDescription,
            orderedQty: receivedQty,
            receivedQty,
            unitPrice,
          },
        ],
      },
    },
    token,
  )
  return {
    grnId: created.createGRN.id,
    grnNumber: created.createGRN.grnNumber,
  }
}

export async function fetchInventoryQtyByItemName(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  itemName: string,
): Promise<number> {
  const data = await gql<{
    inventoryControls: Array<{ itemName: string; quantity: number }>
  }>(
    request,
    `query($organizationId: String!) {
      inventoryControls(organizationId: $organizationId) {
        itemName
        quantity
      }
    }`,
    { organizationId },
    token,
  )
  const rows = data.inventoryControls.filter((r) => r.itemName === itemName)
  return rows.reduce((s, r) => s + Number(r.quantity || 0), 0)
}

export async function createReceivedPoViaApi(
  request: APIRequestContext,
  submitterToken: string,
  approverToken: string,
  organizationId: string,
  vendorId: string,
  totalAmount: number,
): Promise<{ poId: string; seqNo: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createPurchaseOrder: { id: string; seqNo: string } }>(
    request,
    `mutation($input: CreatePurchaseOrderInput!) {
      createPurchaseOrder(input: $input) { id seqNo status }
    }`,
    {
      input: {
        vendorId,
        organizationId,
        orderDate: today,
        items: [
          {
            itemDescription: 'E2E PO line',
            productName: 'E2E PO line',
            quantity: 1,
            unitPrice: totalAmount,
          },
        ],
      },
    },
    submitterToken,
  )
  const poId = created.createPurchaseOrder.id
  await gql(
    request,
    `mutation($id: ID!) { markPurchaseOrderRfqSent(id: $id) { id status } }`,
    { id: poId },
    submitterToken,
  )
  await gql(
    request,
    `mutation($id: ID!) { submitPurchaseOrder(id: $id) { id status } }`,
    { id: poId },
    submitterToken,
  )
  // Approver must differ from submitter (segregation of duties).
  await gql(
    request,
    `mutation($id: ID!) { approvePurchaseOrder(id: $id) { id status } }`,
    { id: poId },
    approverToken,
  )
  await gql(
    request,
    `mutation($id: ID!) { confirmPurchaseOrder(id: $id) { id status } }`,
    { id: poId },
    approverToken,
  )
  await gql(
    request,
    `mutation($id: ID!) { receivePurchaseOrder(id: $id) { id status } }`,
    { id: poId },
    approverToken,
  )
  return { poId, seqNo: created.createPurchaseOrder.seqNo }
}

export async function createAndConfirmStockTransferViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  itemDescription: string,
  qty: number,
): Promise<{ transferId: string; transferNumber: string; fromBin: string; toBin: string }> {
  const today = new Date().toISOString().split('T')[0]
  const fromBin = 'MAIN'
  const toBin = 'WH-B'
  const created = await gql<{ createStockTransfer: { id: string; transferNumber: string } }>(
    request,
    `mutation($input: CreateStockTransferInput!) {
      createStockTransfer(input: $input) { id transferNumber status }
    }`,
    {
      input: {
        organizationId,
        transferDate: today,
        fromWarehouseName: fromBin,
        toWarehouseName: toBin,
        lineItems: [{ itemDescription, qty, unit: 'EA' }],
      },
    },
    token,
  )
  const id = created.createStockTransfer.id
  await gql(
    request,
    `mutation($id: ID!) { confirmStockTransfer(id: $id) { id status } }`,
    { id },
    token,
  )
  return {
    transferId: id,
    transferNumber: created.createStockTransfer.transferNumber,
    fromBin,
    toBin,
  }
}

export async function inventoryQtyAtBin(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  itemName: string,
  binLocation: string,
): Promise<number> {
  const data = await gql<{
    inventoryControls: Array<{ itemName: string; binLocation: string; quantity: number }>
  }>(
    request,
    `query($organizationId: String!) {
      inventoryControls(organizationId: $organizationId) {
        itemName binLocation quantity
      }
    }`,
    { organizationId },
    token,
  )
  return data.inventoryControls
    .filter((r) => r.itemName === itemName && r.binLocation === binLocation)
    .reduce((s, r) => s + Number(r.quantity || 0), 0)
}

export async function createVendorDebitNoteApplyBillViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  billId: string,
  totalAmount: number,
): Promise<{ debitNoteId: string; debitNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createVendorDebitNote: { id: string; debitNumber: string } }>(
    request,
    `mutation($input: CreateVendorDebitNoteInput!) {
      createVendorDebitNote(input: $input) { id debitNumber status appliedAmount remainingAmount }
    }`,
    {
      input: {
        vendorId,
        vendorBillId: billId,
        organizationId,
        debitDate: today,
        totalAmount,
        reason: 'E2E apply to bill',
      },
    },
    token,
  )
  return {
    debitNoteId: created.createVendorDebitNote.id,
    debitNumber: created.createVendorDebitNote.debitNumber,
  }
}

export async function createVendorDebitNoteViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  vendorId: string,
  purchaseOrderId: string,
  totalAmount: number,
): Promise<{ debitNoteId: string; debitNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{
    createVendorDebitNote: { id: string; debitNumber: string }
  }>(
    request,
    `mutation($input: CreateVendorDebitNoteInput!) {
      createVendorDebitNote(input: $input) { id debitNumber status }
    }`,
    {
      input: {
        vendorId,
        purchaseOrderId,
        organizationId,
        debitDate: today,
        totalAmount,
        reason: 'E2E debit note',
      },
    },
    token,
  )
  return {
    debitNoteId: created.createVendorDebitNote.id,
    debitNumber: created.createVendorDebitNote.debitNumber,
  }
}
