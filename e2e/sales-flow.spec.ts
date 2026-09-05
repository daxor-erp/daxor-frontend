/**
 * End-to-end sales path aligned with flows/sales-flow.pdf
 * (org admin: diokid@gmail.com — see .env.e2e.local)
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import {
  apiLogin,
  approveQuotationViaApi,
  approveCustomerInvoiceViaApi,
  setQuotationStatus,
  ensureCustomer,
  gql,
  submitAndApproveSalesEnquiry,
  submitAndApproveSalesOrder,
  findSalesOrderByQuotation,
  createDeliveryOrderForSo,
  transitionDeliveryOrder,
  createAndApproveDeliveryChallan,
  markInvoiceSent,
  payCustomerInvoice,
} from './helpers/graphql-api'
import {
  assertInvoiceRevenuePosted,
  assertCustomerPaymentPosted,
} from './helpers/accounting-api'
import { expectJournalRefOnPage, expectGlModuleOnPage } from './helpers/accounting-pages'
import {
  flowTag,
  fillQuotationForm,
  saveQuotation,
  submitQuotationForApproval,
  createSalesOrderFromQuotation,
  createInvoiceFromSalesOrder,
  openPastEntriesFab,
} from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Sales flow (flows/sales-flow.pdf)', () => {
  const tag = flowTag()
  const customerName = `E2E Customer ${tag}`
  const customerEmail = `e2e.${tag}@example.com`
  const enquirySubject = `E2E Enquiry ${tag}`
  const quotationSubject = `E2E Quotation ${tag}`

  let orgAdminToken = ''
  let orgId = ''
  let customerId = ''
  let enquiryId = ''
  let quotationId = ''
  let salesOrderId = ''
  let deliveryOrderId = ''
  let invoiceId = ''
  let paymentId = ''
  let invoiceTotal = 0

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    customerId = await ensureCustomer(request, orgAdminToken, orgId, customerName, customerEmail)
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  // PDF: Create Sales Enquiry
  test('01 — create sales enquiry', async ({ page, request }) => {
    const data = await gql<{ createSalesEnquiry: { id: string; enquiryNumber: string; subject: string } }>(
      request,
      `mutation($input: CreateSalesEnquiryInput!) {
        createSalesEnquiry(input: $input) { id enquiryNumber subject }
      }`,
      { input: { customerId, subject: enquirySubject, priority: 'normal' } },
      orgAdminToken,
    )
    enquiryId = data.createSalesEnquiry.id
    expect(data.createSalesEnquiry.subject).toBe(enquirySubject)

    await page.goto('/sales/sales-enquiry')
    await openPastEntriesFab(page)
    await expect(page.getByRole('dialog').getByText(enquirySubject).first()).toBeVisible({
      timeout: 20_000,
    })
  })

  // PDF: Submit for Approval → Approved → Enquiry Approved (status: won)
  test('02 — approve sales enquiry → won', async ({ request }) => {
    await submitAndApproveSalesEnquiry(request, orgAdminToken, enquiryId)
    const row = await gql<{ salesEnquiry: { status: string } }>(
      request,
      `query($id: ID!) { salesEnquiry(id: $id) { id status } }`,
      { id: enquiryId },
      orgAdminToken,
    )
    expect(row.salesEnquiry.status).toBe('won')
  })

  // PDF: Create Sales Quotation
  test('03 — create quotation', async ({ page }) => {
    await page.goto('/quotations')
    await page.getByRole('button', { name: /New quotation/i }).first().click()
    await fillQuotationForm(page, { subject: quotationSubject, customerId })
    await saveQuotation(page)
    await expect(page.getByText(quotationSubject).first()).toBeVisible()
  })

  // PDF: Submit quotation for internal approval
  test('04 — submit quotation for approval', async ({ page }) => {
    await page.goto('/quotations')
    await submitQuotationForApproval(page, quotationSubject)
  })

  // PDF: Approve → Send to Customer → Accepted
  test('05 — approve, send & accept quotation', async ({ request }) => {
    const data = await gql<{
      quotations: Array<{ id: string; subject: string; status: string }>
    }>(
      request,
      `query($organizationId: ID) {
        quotations(organizationId: $organizationId) { id subject status }
      }`,
      { organizationId: orgId },
      orgAdminToken,
    )
    const q = data.quotations.find((x) => x.subject === quotationSubject)
    expect(q?.id).toBeTruthy()
    quotationId = q!.id

    await approveQuotationViaApi(request, orgAdminToken, quotationId)
    // PDF: send to customer — use status update when SMTP is not configured (sendQuotation requires Gmail)
    await setQuotationStatus(request, orgAdminToken, quotationId, 'sent')
    await setQuotationStatus(request, orgAdminToken, quotationId, 'accepted')

    const updated = await gql<{ quotation: { status: string } }>(
      request,
      `query($id: ID!) { quotation(id: $id) { id status } }`,
      { id: quotationId },
      orgAdminToken,
    )
    expect(updated.quotation.status).toBe('accepted')
  })

  // PDF: Create Sales Order (from accepted quotation)
  test('06 — create sales order', async ({ page }) => {
    await createSalesOrderFromQuotation(page, quotationId)
  })

  // PDF: Submit SO for approval → Approved (Sales Order Active)
  test('07 — approve sales order', async ({ request }) => {
    const so = await findSalesOrderByQuotation(request, orgAdminToken, orgId, quotationId)
    salesOrderId = so.id
    await submitAndApproveSalesOrder(request, orgAdminToken, salesOrderId)
    const refreshed = await findSalesOrderByQuotation(request, orgAdminToken, orgId, quotationId)
    expect(['approved', 'active']).toContain(refreshed.status)
  })

  // PDF: Delivery order READY → DISPATCHED → DELIVERED
  test('08 — delivery order lifecycle', async ({ request }) => {
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
  })

  // PDF: Delivery challan → submit → approve
  test('09 — delivery challan approval', async ({ request }) => {
    await createAndApproveDeliveryChallan(request, orgAdminToken, orgId)
  })

  // PDF: Create Customer Invoice
  test('10 — create customer invoice', async ({ page }) => {
    await createInvoiceFromSalesOrder(page, customerName)
  })

  // PDF: Submit & approve invoice (+ GL AR-INV)
  test('11 — approve invoice & ledger', async ({ page, request }) => {
    await page.goto('/sales/create-invoices')
    const row = page.locator('tr').filter({ hasText: customerName }).first()
    const sendBtn = row.getByTitle('Send for approval')
    if (await sendBtn.isVisible().catch(() => false)) {
      await sendBtn.click()
      await page.waitForTimeout(1500)
    }

    const invData = await gql<{
      customerinvoices: Array<{ id: string; status: string; totalAmount: number }>
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
    const inv = invData.customerinvoices.find(
      (i) => ['draft', 'submitted', 'approved', 'sent'].includes(i.status),
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

    const posted = await assertInvoiceRevenuePosted(
      request,
      orgAdminToken,
      orgId,
      invoiceId,
    )
    await expectJournalRefOnPage(page, posted.ref)
    await expectGlModuleOnPage(page, { transactionType: 'CUSTOMER_INVOICE' })
  })

  // PDF: Invoice sent to customer
  test('12 — send invoice to customer', async ({ request }) => {
    await markInvoiceSent(request, orgAdminToken, invoiceId)
    const row = await gql<{ customerinvoice: { status: string } }>(
      request,
      `query($id: ID!) { customerinvoice(id: $id) { id status } }`,
      { id: invoiceId },
      orgAdminToken,
    )
    expect(row.customerinvoice.status).toBe('sent')
  })

  // PDF: Payment received → Customer payment
  test('13 — customer payment (API + UI journal/GL)', async ({ page, request }) => {
    const amount = invoiceTotal > 0 ? invoiceTotal : 300
    paymentId = await payCustomerInvoice(
      request,
      orgAdminToken,
      orgId,
      customerId,
      invoiceId,
      amount,
    )
    const posted = await assertCustomerPaymentPosted(
      request,
      orgAdminToken,
      orgId,
      paymentId,
    )
    await expectJournalRefOnPage(page, posted.ref)
    await expectGlModuleOnPage(page, { transactionType: 'CUSTOMER_PAYMENT' })
    const row = await gql<{ customerinvoice: { status: string } }>(
      request,
      `query($id: ID!) { customerinvoice(id: $id) { id status } }`,
      { id: invoiceId },
      orgAdminToken,
    )
    expect(['paid', 'partially_paid']).toContain(row.customerinvoice.status)
  })

  // Smoke all sales-related routes from the flow diagram
  test('14 — sales module pages smoke', async ({ page }) => {
    const routes: Array<{ path: string; heading: RegExp }> = [
      { path: '/sales/sales-enquiry', heading: /Sales Enquiry/i },
      { path: '/quotations', heading: /Quotation/i },
      { path: '/quotations/send', heading: /Send quotation/i },
      { path: '/sales/enter-sales-order', heading: /Sales Order/i },
      { path: '/sales/delivery-orders', heading: /Delivery Order/i },
      { path: '/sales/delivery-order', heading: /Delivery Order/i },
      { path: '/delivery-challan', heading: /Delivery Challan/i },
      { path: '/sales/create-invoices', heading: /Invoice/i },
      { path: '/sales/invoice-sales-order', heading: /Invoice Sales Order/i },
      { path: '/customers/accept-payments', heading: /Accept Customer Payment/i },
      { path: '/sales/enter-cash-sales', heading: /Cash Sales/i },
      { path: '/sales/issue-credit-memos', heading: /Credit Memo/i },
      { path: '/sales-returns', heading: /Sales Return/i },
      { path: '/sales/project', heading: /Project/i },
    ]
    for (const { path, heading } of routes) {
      await page.goto(path)
      await expect(page).not.toHaveURL(/\/login/)
      await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({
        timeout: 25_000,
      })
    }
    // /customers uses ErpListPage without an h1
    await page.goto('/customers')
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.getByRole('button', { name: /New customer/i })).toBeVisible({ timeout: 25_000 })
  })
})
