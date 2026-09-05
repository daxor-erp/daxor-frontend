/**
 * Odoo 19 Procure-to-Pay
 * Docs: https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/purchase/manage_deals/rfq.html
 *
 * Official stages:
 *   1. Create RFQ (Purchase › Requests for Quotation › New)
 *   2. Send by Email → RFQ Sent
 *   3. Confirm Order → Purchase Order
 *   4. Receive Products → stock updated
 *   5. Vendor bill → payment
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from '../helpers/storage'
import { apiLogin } from '../helpers/graphql-api'
import { createVendorViaApi } from '../helpers/vendors-api'
import { createProductViaApi } from '../helpers/products-api'
import {
  createPurchaseOrderViaApi,
  getPurchaseOrderViaApi,
  markRfqSentViaApi,
  submitPurchaseOrderViaApi,
  approvePurchaseOrderViaApi,
  confirmPurchaseOrderViaApi,
  receivePurchaseOrderViaApi,
} from '../helpers/purchase-orders-api'
import {
  ensureVendorBankForPayments,
  createAndApproveVendorBillViaApi,
  payVendorBillViaApi,
} from '../helpers/payables-api'
import { assertVendorBillPosted, assertVendorPaymentPosted } from '../helpers/accounting-api'
import { flowTag } from '../helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 240_000 })

test.describe('Odoo 19 — Procure-to-Pay', () => {
  const tag = flowTag()
  const billAmount = 500

  let orgAdminToken = ''
  let purchaseToken = ''
  let orgId = ''
  let vendorId = ''
  let productId = ''
  let poId = ''
  let billId = ''
  let paymentId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const admin = await apiLogin(request, u.email, u.password)
    orgAdminToken = admin.token
    orgId = admin.organizationId

    const purchaseEmail = process.env.E2E_USER_PURCHASE_EMAIL
    const purchasePassword = process.env.E2E_USER_PURCHASE_PASSWORD
    if (!purchaseEmail || !purchasePassword) test.skip(true, 'Set E2E_USER_PURCHASE_*')
    purchaseToken = (await apiLogin(request, purchaseEmail, purchasePassword)).token

    vendorId = (await createVendorViaApi(request, orgAdminToken, orgId, `P2P-${tag}`)).id
    await ensureVendorBankForPayments(request, orgAdminToken, orgId, vendorId, tag)
    productId = (await createProductViaApi(request, orgAdminToken, orgId, `P2P-${tag}`)).id
  })

  test('01 RFQ — create request for quotation', async ({ request }) => {
    const po = await createPurchaseOrderViaApi(request, purchaseToken, orgId, vendorId, productId)
    poId = po.id
    expect(po.status).toBe('rfq')
    expect(po.seqNo).toMatch(/^PO-/)
    const full = await getPurchaseOrderViaApi(request, purchaseToken, poId)
    expect(full.items.length).toBeGreaterThan(0)
  })

  test('02 RFQ Sent — send RFQ to vendor', async ({ request }) => {
    const sent = await markRfqSentViaApi(request, purchaseToken, poId)
    expect(sent.status).toBe('rfq_sent')
  })

  test('03 Confirm Order — RFQ becomes Purchase Order', async ({ request }) => {
    // Daxor adds internal approval between RFQ Sent and Confirm (Odoo Confirm is direct).
    const submitted = await submitPurchaseOrderViaApi(request, purchaseToken, poId)
    expect(submitted.status).toBe('submitted')
    const approved = await approvePurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(approved.status).toBe('approved')
    const confirmed = await confirmPurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(confirmed.status).toBe('purchase_order')
  })

  test('04 Receive Products — validate receipt / stock in', async ({ request }) => {
    const received = await receivePurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(received.status).toBe('received')
    expect(received.receiptStatus).toBe('received')
    expect(received.items[0].qtyReceived).toBeGreaterThan(0)
  })

  test('05 Vendor bill — create & approve (AP)', async ({ request }) => {
    billId = await createAndApproveVendorBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billAmount,
    )
    expect(billId).toBeTruthy()
    await assertVendorBillPosted(request, orgAdminToken, orgId, billId)
  })

  test('06 Vendor payment — settle bill (cycle complete)', async ({ request }) => {
    paymentId = await payVendorBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billId,
      billAmount,
    )
    expect(paymentId).toBeTruthy()
    await assertVendorPaymentPosted(request, orgAdminToken, orgId, paymentId)
  })
})
