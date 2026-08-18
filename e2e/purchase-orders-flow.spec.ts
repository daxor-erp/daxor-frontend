/**
 * Purchase Order overhaul flow (Phase 3): RFQ -> submitted -> approved -> purchase_order
 * -> sent -> received, with Product-based lines and computed tax totals.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import { createVendorViaApi } from './helpers/vendors-api'
import { createProductViaApi } from './helpers/products-api'
import {
  createPurchaseOrderViaApi,
  getPurchaseOrderViaApi,
  markRfqSentViaApi,
  submitPurchaseOrderViaApi,
  approvePurchaseOrderViaApi,
  confirmPurchaseOrderViaApi,
  receivePurchaseOrderViaApi,
  createPurchaseOrderWithGapFieldsViaApi,
  createPurchaseOrderWithPackagingViaApi,
  createPurchaseOrderWithSectionAndNoteViaApi,
  markPurchaseOrderPrintedViaApi,
  getPurchaseOrderStatusesViaApi,
} from './helpers/purchase-orders-api'
import { updateProductPackagingAndReorderingViaApi } from './helpers/products-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Purchase Orders flow (RFQ -> Purchase Order lifecycle)', () => {
  const tag = flowTag()

  let orgAdminToken = ''
  let orgId = ''
  let orgAdminUserId = ''
  let vendorId = ''
  let productId = ''
  let poId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    orgAdminUserId = session.userId

    const vendor = await createVendorViaApi(request, orgAdminToken, orgId, tag)
    vendorId = vendor.id
    const product = await createProductViaApi(request, orgAdminToken, orgId, tag)
    productId = product.id
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create PO starts as rfq with computed totals', async ({ request }) => {
    const po = await createPurchaseOrderViaApi(request, orgAdminToken, orgId, vendorId, productId)
    poId = po.id
    expect(po.seqNo).toMatch(/^PO-/)
    expect(po.status).toBe('rfq')
    expect(po.totalAmount).toBe(500) // 5 * 100, no tax configured

    const full = await getPurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(full.untaxedAmount).toBe(500)
    expect(full.items.length).toBe(1)
  })

  test('02 — markRfqSent then submit for approval', async ({ request }) => {
    const sent = await markRfqSentViaApi(request, orgAdminToken, poId)
    expect(sent.status).toBe('rfq_sent')
    const submitted = await submitPurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(submitted.status).toBe('submitted')
  })

  test('03 — approve then confirm into a formal Purchase Order', async ({ request }) => {
    const approved = await approvePurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(approved.status).toBe('approved')
    const confirmed = await confirmPurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(confirmed.status).toBe('purchase_order')
  })

  test('04 — receive the PO (full receipt) transitions to received', async ({ request }) => {
    const received = await receivePurchaseOrderViaApi(request, orgAdminToken, poId)
    expect(received.status).toBe('received')
    expect(received.receiptStatus).toBe('received')
    expect(received.items[0].qtyReceived).toBe(5)
  })

  test('05 — purchase orders page smoke: list renders and RFQ dialog opens', async ({ page }) => {
    await smokeModulePage(page, '/purchases/enter-purchase-orders', /Purchase Orders/i)
    await page.getByRole('button', { name: /New RFQ/i }).click()
    await expect(page.getByRole('dialog').filter({ hasText: 'New RFQ' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Products', { exact: true })).toBeVisible()
  })

  test('06 — gap fix: Agreement / Source Document / Incoterms / Buyer / GST Treatment / Currency header fields persist', async ({ request }) => {
    const po = await createPurchaseOrderWithGapFieldsViaApi(request, orgAdminToken, orgId, vendorId, productId, orgAdminUserId)
    expect(po.currency).toBe('USD')
    expect(po.gstTreatment).toBe('registered_business_regular')
    expect(po.agreement).toBe('AGR-E2E-001')
    expect(po.sourceDocument).toBe('SO-E2E-9001')
    expect(po.incoterms).toBe('FOB')
    expect(po.buyerId).toBe(orgAdminUserId)
  })

  test('07 — gap fix: Packaging — packagingId/packagingQty persist on PO lines', async ({ request }) => {
    const withPkg = await updateProductPackagingAndReorderingViaApi(request, orgAdminToken, productId)
    const packagingId = withPkg.packagings[0].id
    const po = await createPurchaseOrderWithPackagingViaApi(request, orgAdminToken, orgId, vendorId, productId, packagingId)
    expect(po.items[0].packagingId).toBe(packagingId)
    expect(po.items[0].packagingQty).toBe(2)
  })

  test('08 — gap fix: Catalog/section/note line types mix with product lines without affecting totals', async ({ request }) => {
    const po = await createPurchaseOrderWithSectionAndNoteViaApi(request, orgAdminToken, orgId, vendorId, productId)
    expect(po.items.length).toBe(3)
    expect(po.items[0].lineType).toBe('section')
    expect(po.items[0].lineTotal).toBe(0)
    expect(po.items[1].lineType).toBe('product')
    expect(po.items[2].lineType).toBe('note')
    expect(po.items[2].note).toBe('Handle with care')
    expect(po.totalAmount).toBe(200) // only the product line (2 * 100) counts
  })

  test('09 — gap fix: standalone Print RFQ action records lastPrintedAt without changing status', async ({ request }) => {
    const printed = await markPurchaseOrderPrintedViaApi(request, orgAdminToken, poId)
    expect(printed.lastPrintedAt).toBeTruthy()
    expect(printed.status).toBe('received') // status from step 04 — unaffected by printing
  })

  test('10 — gap fix: Receipt Status / Billing Status and per-line qty are queryable for list/detail display', async ({ request }) => {
    const statuses = await getPurchaseOrderStatusesViaApi(request, orgAdminToken, poId)
    expect(statuses.receiptStatus).toBe('received')
    expect(statuses.items[0].qtyReceived).toBe(5)
    expect(statuses.items[0].quantity).toBe(5)
  })

  test('11 — gap fix UI: Other Information header fields and Print RFQ render in the RFQ form/list', async ({ page }) => {
    await smokeModulePage(page, '/purchases/enter-purchase-orders', /Purchase Orders/i)
    await page.getByRole('button', { name: /New RFQ/i }).click()
    await expect(page.getByRole('dialog').filter({ hasText: 'New RFQ' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Other Information')).toBeVisible()
    await expect(page.getByLabel('Agreement')).toBeVisible()
    await expect(page.getByLabel('Source document')).toBeVisible()
    await expect(page.getByLabel('Incoterms')).toBeVisible()
  })
})
