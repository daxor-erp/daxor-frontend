/**
 * Odoo 19 Quote-to-Cash
 * Docs: https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations.html
 *
 * Official stages:
 *   1. Quotation
 *   2. Sales order (when quotation accepted)
 *   3. Delivery (if applicable)
 *   4. Invoice
 *   5. Payment
 *
 * Delivered invoicing:
 *   https://www.odoo.com/documentation/19.0/applications/sales/sales/invoicing/invoicing_policy.html
 */
import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers/auth'
import { orgAdminUser } from '../helpers/storage'
import {
  apiLogin,
  gql,
  ensureCustomer,
  submitAndApproveSalesEnquiry,
  approveQuotationViaApi,
  setQuotationStatus,
  findSalesOrderByQuotation,
  submitAndApproveSalesOrder,
  createDeliveryOrderForSo,
  transitionDeliveryOrder,
  approveCustomerInvoiceViaApi,
  payCustomerInvoice,
  markInvoiceSent,
} from '../helpers/graphql-api'
import {
  fillQuotationForm,
  saveQuotation,
  flowTag,
  createSalesOrderFromQuotation,
  createInvoiceFromSalesOrder,
  submitQuotationForApproval,
} from '../helpers/sales-pages'
import { assertInvoiceRevenuePosted, assertCustomerPaymentPosted } from '../helpers/accounting-api'

test.describe.configure({ mode: 'serial', timeout: 240_000 })

test.describe('Odoo 19 — Quote-to-Cash', () => {
  const tag = flowTag()
  const customerName = `Odoo19 Customer ${tag}`
  const quotationSubject = `Odoo19 Quote ${tag}`

  let orgAdminToken = ''
  let orgId = ''
  let customerId = ''
  let quotationId = ''
  let salesOrderId = ''
  let deliveryOrderId = ''
  let invoiceId = ''
  let invoiceTotal = 0

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    customerId = await ensureCustomer(request, orgAdminToken, orgId, customerName)
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 Quotation — create draft (Sales › Quotations)', async ({ page, request }) => {
    const enq = await gql<{ createSalesEnquiry: { id: string } }>(
      request,
      `mutation($input: CreateSalesEnquiryInput!) {
        createSalesEnquiry(input: $input) { id status }
      }`,
      { input: { customerId, subject: `Odoo19 Enquiry ${tag}`, priority: 'normal' } },
      orgAdminToken,
    )
    await submitAndApproveSalesEnquiry(request, orgAdminToken, enq.createSalesEnquiry.id)

    await page.goto('/quotations')
    await page.getByRole('button', { name: /New quotation/i }).first().click()
    await fillQuotationForm(page, { subject: quotationSubject, customerId, unitPrice: '150', qty: '2' })
    await saveQuotation(page)
    await expect(page.getByText(quotationSubject).first()).toBeVisible({ timeout: 20_000 })

    const list = await gql<{
      quotations: Array<{ id: string; subject?: string | null; status: string }>
    }>(
      request,
      `query($organizationId: ID!) {
        quotations(organizationId: $organizationId, page: 1, limit: 50) {
          id subject status
        }
      }`,
      { organizationId: orgId },
      orgAdminToken,
    )
    const q = list.quotations.find((r) => r.subject === quotationSubject)
    expect(q?.id).toBeTruthy()
    quotationId = q!.id
    expect(['draft', 'submitted']).toContain(q!.status)
  })

  test('02 Quotation — approve → send → customer accepts', async ({ page, request }) => {
    await page.goto('/quotations')
    await submitQuotationForApproval(page, quotationSubject)

    await approveQuotationViaApi(request, orgAdminToken, quotationId)
    // Prefer status updates when SMTP/Gmail is not configured
    await setQuotationStatus(request, orgAdminToken, quotationId, 'sent')
    await setQuotationStatus(request, orgAdminToken, quotationId, 'accepted')

    const q = await gql<{ quotation: { status: string } }>(
      request,
      `query($id: ID!) { quotation(id: $id) { status } }`,
      { id: quotationId },
      orgAdminToken,
    )
    expect(q.quotation.status).toBe('accepted')
  })

  test('03 Sales order — confirm from accepted quotation', async ({ page, request }) => {
    await createSalesOrderFromQuotation(page, quotationId)
    const so = await findSalesOrderByQuotation(request, orgAdminToken, orgId, quotationId)
    salesOrderId = so.id
    expect(so.id).toBeTruthy()
    await submitAndApproveSalesOrder(request, orgAdminToken, salesOrderId)
    const refreshed = await findSalesOrderByQuotation(request, orgAdminToken, orgId, quotationId)
    expect(['approved', 'active']).toContain(refreshed.status)
  })

  test('04 Delivery — dispatch then validate', async ({ request }) => {
    deliveryOrderId = await createDeliveryOrderForSo(
      request,
      orgAdminToken,
      orgId,
      customerId,
      salesOrderId,
      tag,
    )
    await transitionDeliveryOrder(request, orgAdminToken, deliveryOrderId, 'DISPATCHED')
    await transitionDeliveryOrder(request, orgAdminToken, deliveryOrderId, 'DELIVERED')
    const row = await gql<{ deliveryOrder: { status: string } }>(
      request,
      `query($id: ID!) { deliveryOrder(id: $id) { status } }`,
      { id: deliveryOrderId },
      orgAdminToken,
    )
    expect(row.deliveryOrder.status).toBe('DELIVERED')
  })

  test('05 Invoice — after delivery (Invoice what is delivered)', async ({ page, request }) => {
    await createInvoiceFromSalesOrder(page, customerName)

    const invData = await gql<{
      customerinvoices: Array<{ id: string; status: string; totalAmount: number; customerId?: string }>
    }>(
      request,
      `query($organizationId: ID!) {
        customerinvoices(organizationId: $organizationId, page: 1, limit: 50) {
          id status totalAmount customerId
        }
      }`,
      { organizationId: orgId },
      orgAdminToken,
    )
    const inv =
      invData.customerinvoices.find((i) => String(i.customerId) === String(customerId)) ||
      invData.customerinvoices.find((i) =>
        ['draft', 'submitted', 'approved', 'sent'].includes(i.status),
      )
    expect(inv?.id).toBeTruthy()
    invoiceId = inv!.id
    invoiceTotal = inv!.totalAmount

    if (inv!.status === 'draft') {
      await gql(
        request,
        `mutation($id: ID!) { submitCustomerInvoiceForApproval(id: $id) { id status } }`,
        { id: invoiceId },
        orgAdminToken,
      )
    }
    if (!['approved', 'sent', 'paid', 'partially_paid'].includes(inv!.status)) {
      await approveCustomerInvoiceViaApi(request, orgAdminToken, invoiceId)
    }
    await assertInvoiceRevenuePosted(request, orgAdminToken, orgId, invoiceId)
  })

  test('06 Payment — settle invoice (cycle complete)', async ({ request }) => {
    await markInvoiceSent(request, orgAdminToken, invoiceId)
    const paymentId = await payCustomerInvoice(
      request,
      orgAdminToken,
      orgId,
      customerId,
      invoiceId,
      invoiceTotal,
    )
    expect(paymentId).toBeTruthy()
    await assertCustomerPaymentPosted(request, orgAdminToken, orgId, paymentId)

    const row = await gql<{ customerinvoice: { status: string } }>(
      request,
      `query($id: ID!) { customerinvoice(id: $id) { status } }`,
      { id: invoiceId },
      orgAdminToken,
    )
    expect(['paid', 'partially_paid']).toContain(row.customerinvoice.status)
  })
})
