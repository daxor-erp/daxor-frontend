/**
 * Accrual AR: invoice approval (AR-INV) + customer payment (AR-PAY).
 * Verifies backend (GraphQL journal + GL) and frontend (journal / GL / payments UI).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import {
  apiLogin,
  ensureCustomer,
  createAndApproveInvoiceViaApi,
  payCustomerInvoice,
  gql,
} from './helpers/graphql-api'
import {
  assertInvoiceRevenuePosted,
  assertCustomerPaymentPosted,
} from './helpers/accounting-api'
import {
  expectJournalRefOnPage,
  expectGlModuleOnPage,
  expectRecentPaymentOnAcceptPage,
} from './helpers/accounting-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('AR accounting — backend + frontend', () => {
  const tag = flowTag()
  const customerName = `E2E AR ${tag}`
  const customerEmail = `e2e.ar.${tag}@example.com`
  const invoiceAmount = 450

  let orgAdminToken = ''
  let orgId = ''
  let customerId = ''
  let invoiceId = ''
  let paymentId = ''
  let invJournalRef = ''
  let payJournalRef = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    customerId = await ensureCustomer(
      request,
      orgAdminToken,
      orgId,
      customerName,
      customerEmail,
    )
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — backend: invoice approval posts AR-INV', async ({ request }) => {
    invoiceId = await createAndApproveInvoiceViaApi(
      request,
      orgAdminToken,
      orgId,
      customerId,
      invoiceAmount,
    )
    const inv = await gql<{ customerinvoice: { status: string; totalAmount: number } }>(
      request,
      `query($id: ID!) { customerinvoice(id: $id) { id status totalAmount } }`,
      { id: invoiceId },
      orgAdminToken,
    )
    expect(inv.customerinvoice.status).toBe('approved')

    const posted = await assertInvoiceRevenuePosted(
      request,
      orgAdminToken,
      orgId,
      invoiceId,
    )
    invJournalRef = posted.ref
  })

  test('02 — frontend: journal & GL show invoice posting', async ({ page }) => {
    await expectJournalRefOnPage(page, invJournalRef)
    await expectGlModuleOnPage(page, {
      transactionType: 'CUSTOMER_INVOICE',
      descriptionIncludes: 'Invoice',
    })
  })

  test('03 — record payment (API) + frontend receipts', async ({ page, request }) => {
    await gql(
      request,
      `mutation($id: ID!, $input: UpdateCustomerInvoiceInput!) {
        updateCustomerInvoice(id: $id, input: $input) { id status }
      }`,
      { id: invoiceId, input: { status: 'sent' } },
      orgAdminToken,
    )

    paymentId = await payCustomerInvoice(
      request,
      orgAdminToken,
      orgId,
      customerId,
      invoiceId,
      invoiceAmount,
    )

    const payments = await gql<{
      customerPayments: Array<{ id: string; paymentNumber: string; totalAmount: number }>
    }>(
      request,
      `query($organizationId: ID!) {
        customerPayments(organizationId: $organizationId, page: 1, limit: 20) {
          id paymentNumber totalAmount
        }
      }`,
      { organizationId: orgId },
      orgAdminToken,
    )
    const pay = payments.customerPayments.find((p) => p.id === paymentId)
    expect(pay?.paymentNumber).toBeTruthy()

    await expectRecentPaymentOnAcceptPage(page)
    await expect(page.getByText(pay!.paymentNumber).first()).toBeVisible({ timeout: 15_000 })
  })

  test('04 — backend: payment posts AR-PAY', async ({ request }) => {
    expect(paymentId).toBeTruthy()
    const posted = await assertCustomerPaymentPosted(request, orgAdminToken, orgId, paymentId)
    payJournalRef = posted.ref

    const inv = await gql<{ customerinvoice: { status: string } }>(
      request,
      `query($id: ID!) { customerinvoice(id: $id) { id status } }`,
      { id: invoiceId },
      orgAdminToken,
    )
    expect(inv.customerinvoice.status).toBe('paid')
  })

  test('05 — frontend: journal & GL show payment posting', async ({ page }) => {
    await expectJournalRefOnPage(page, payJournalRef)
    await expectGlModuleOnPage(page, { transactionType: 'CUSTOMER_PAYMENT' })
  })
})
