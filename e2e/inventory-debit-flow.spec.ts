/**
 * Inventory receipt (GRN → qty + INV-GRN) and vendor debit note (AP-VDN).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  assertGrnPosted,
  assertVendorDebitNotePosted,
  assertStockTransferPosted,
} from './helpers/accounting-api'
import { ensureVendor } from './helpers/payables-api'
import {
  createConfirmedGrnViaApi,
  fetchInventoryQtyByItemName,
  createReceivedPoViaApi,
  createVendorDebitNoteViaApi,
  createAndConfirmStockTransferViaApi,
  inventoryQtyAtBin,
  createVendorDebitNoteApplyBillViaApi,
} from './helpers/inventory-ext-api'
import { createAndApproveVendorBillViaApi } from './helpers/payables-api'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Inventory & debit note extensions', () => {
  const tag = flowTag()
  const itemName = `E2E-GRN-Item-${tag}`
  const grnQty = 7
  const grnUnitPrice = 12
  const poAmount = 250
  const debitAmount = 80
  const vendorName = `E2E Vendor DN ${tag}`

  let orgAdminToken = ''
  let purchaseToken = ''
  let orgId = ''
  let vendorId = ''
  let grnId = ''
  let grnNumber = ''
  let poId = ''
  let debitNoteId = ''
  let debitNumber = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    vendorId = await ensureVendor(request, orgAdminToken, orgId, vendorName)

    const purchaseEmail = process.env.E2E_USER_PURCHASE_EMAIL
    const purchasePassword = process.env.E2E_USER_PURCHASE_PASSWORD
    if (!purchaseEmail || !purchasePassword) {
      test.skip(true, 'Set E2E_USER_PURCHASE_* in .env.e2e.local')
    }
    purchaseToken = (await apiLogin(request, purchaseEmail, purchasePassword)).token
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — GRN confirmed increases inventory qty', async ({ request }) => {
    const before = await fetchInventoryQtyByItemName(
      request,
      orgAdminToken,
      orgId,
      itemName,
    )
    const grn = await createConfirmedGrnViaApi(
      request,
      orgAdminToken,
      orgId,
      itemName,
      grnQty,
      grnUnitPrice,
    )
    grnId = grn.grnId
    grnNumber = grn.grnNumber

    const after = await fetchInventoryQtyByItemName(
      request,
      orgAdminToken,
      orgId,
      itemName,
    )
    expect(after - before).toBeCloseTo(grnQty, 2)
  })

  test('02 — GRN posts INV-GRN journal + GL', async ({ request }) => {
    await assertGrnPosted(request, orgAdminToken, orgId, grnId, grnNumber)
  })

  test('03 — vendor debit note on received PO', async ({ request }) => {
    const po = await createReceivedPoViaApi(
      request,
      purchaseToken,
      orgAdminToken,
      orgId,
      vendorId,
      poAmount,
    )
    poId = po.poId

    const dn = await createVendorDebitNoteViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      poId,
      debitAmount,
    )
    debitNoteId = dn.debitNoteId
    debitNumber = dn.debitNumber
    expect(debitNoteId).toBeTruthy()
  })

  test('04 — debit note posts AP-VDN', async ({ request }) => {
    await assertVendorDebitNotePosted(
      request,
      orgAdminToken,
      orgId,
      debitNoteId,
      debitNumber,
    )
  })

  test('05 — stock transfer moves qty between bins + INV-ST', async ({ request }) => {
    const item = `E2E-ST-${tag}`
    const qty = 4
    await createConfirmedGrnViaApi(request, orgAdminToken, orgId, item, qty, 5)
    const beforeFrom = await inventoryQtyAtBin(request, orgAdminToken, orgId, item, 'MAIN')
    const beforeTo = await inventoryQtyAtBin(request, orgAdminToken, orgId, item, 'WH-B')

    const st = await createAndConfirmStockTransferViaApi(
      request,
      orgAdminToken,
      orgId,
      item,
      qty,
    )
    await assertStockTransferPosted(request, orgAdminToken, orgId, st.transferId, st.transferNumber)

    const afterFrom = await inventoryQtyAtBin(request, orgAdminToken, orgId, item, 'MAIN')
    const afterTo = await inventoryQtyAtBin(request, orgAdminToken, orgId, item, 'WH-B')
    expect(afterFrom - beforeFrom).toBeCloseTo(-qty, 2)
    expect(afterTo - beforeTo).toBeCloseTo(qty, 2)
  })

  test('06 — debit note applies to vendor bill', async ({ request }) => {
    const billAmt = 180
    const debitAmt = 50
    const billId = await createAndApproveVendorBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billAmt,
    )
    await createVendorDebitNoteApplyBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billId,
      debitAmt,
    )
    const bill = await gql<{ vendorBill: { outstandingAmount: number; debitNotesApplied: number } }>(
      request,
      `query($id: ID!) { vendorBill(id: $id) { outstandingAmount debitNotesApplied status } }`,
      { id: billId },
      orgAdminToken,
    )
    expect(bill.vendorBill.debitNotesApplied).toBeCloseTo(debitAmt, 2)
    expect(bill.vendorBill.outstandingAmount).toBeCloseTo(billAmt - debitAmt, 2)
  })
})
