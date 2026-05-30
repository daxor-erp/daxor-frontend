/**
 * Purchases & payables (flows/purchases-payables-flow.pdf):
 * vendor → vendor bill → approve → AP-BILL → pay bill → AP-PAY
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  assertVendorBillPosted,
  assertVendorPaymentPosted,
} from './helpers/accounting-api'
import {
  ensureVendor,
  createAndApproveVendorBillViaApi,
  payVendorBillViaApi,
} from './helpers/payables-api'
import { expectJournalRefOnPage, expectGlModuleOnPage } from './helpers/accounting-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Payables flow (purchases-payables-flow.pdf)', () => {
  const tag = flowTag()
  const vendorName = `E2E Vendor ${tag}`
  const billAmount = 320

  let orgAdminToken = ''
  let orgId = ''
  let vendorId = ''
  let billId = ''
  let paymentId = ''
  let billJournalRef = ''
  let payJournalRef = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    vendorId = await ensureVendor(request, orgAdminToken, orgId, vendorName)
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create vendor master', async () => {
    expect(vendorId).toBeTruthy()
  })

  test('02 — create & approve vendor bill (API)', async ({ request }) => {
    billId = await createAndApproveVendorBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billAmount,
    )
    const bill = await gql<{ vendorBill: { status: string; totalAmount: number } }>(
      request,
      `query($id: ID!) { vendorBill(id: $id) { status totalAmount } }`,
      { id: billId },
      orgAdminToken,
    )
    expect(bill.vendorBill.status).toBe('approved')
    expect(bill.vendorBill.totalAmount).toBe(billAmount)
  })

  test('03 — backend: bill posts AP-BILL', async ({ request }) => {
    const posted = await assertVendorBillPosted(request, orgAdminToken, orgId, billId)
    billJournalRef = posted.ref
  })

  test('04 — frontend: journal & GL show bill posting', async ({ page }) => {
    await expectJournalRefOnPage(page, billJournalRef)
    await expectGlModuleOnPage(page, { transactionType: 'VENDOR_BILL' })
  })

  test('05 — pay vendor bill (API)', async ({ request }) => {
    paymentId = await payVendorBillViaApi(
      request,
      orgAdminToken,
      orgId,
      vendorId,
      billId,
      billAmount,
    )
    expect(paymentId).toBeTruthy()
  })

  test('06 — backend: payment posts AP-PAY', async ({ request }) => {
    const posted = await assertVendorPaymentPosted(
      request,
      orgAdminToken,
      orgId,
      paymentId,
    )
    payJournalRef = posted.ref
  })

  test('07 — frontend: journal & GL show payment posting', async ({ page }) => {
    await expectJournalRefOnPage(page, payJournalRef)
    await expectGlModuleOnPage(page, { transactionType: 'VENDOR_PAYMENT' })
  })

  test('08 — payables pages smoke', async ({ page }) => {
    await page.goto('/payables/enter-bills')
    await expect(page.getByRole('heading', { name: /Enter Bills|Vendor Bills/i })).toBeVisible({
      timeout: 20_000,
    })

    await page.goto('/payables/pay-bills')
    await expect(page.getByRole('heading', { name: /Pay Bills/i })).toBeVisible({
      timeout: 20_000,
    })

    await page.goto('/general-ledger')
    await expect(page.getByText('Accounts payable')).toBeVisible({ timeout: 15_000 })
  })
})
