/**
 * Customers & banks from flows/customers-banks-flow.pdf.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  ensureCustomer,
  createCustomerDepositViaApi,
  createBankAccountViaApi,
} from './helpers/customers-banks-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Customers & banks flow (flows/customers-banks-flow.pdf)', () => {
  const tag = flowTag()
  const customerName = `E2E Bank Customer ${tag}`
  const customerEmail = `e2e.bank.${tag}@example.com`
  const depositAmount = 150

  let orgAdminToken = ''
  let orgId = ''
  let customerId = ''
  let depositId = ''
  let bankAccountId = ''

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

  test('01 — customer registered', async ({ request }) => {
    const row = await gql<{ customer: { id: string; name: string; status: string } }>(
      request,
      `query($id: ID!) { customer(id: $id) { id name status } }`,
      { id: customerId },
      orgAdminToken,
    )
    expect(row.customer.name).toContain('E2E Bank Customer')
    expect(row.customer.status).toBeTruthy()
  })

  test('02 — record customer deposit (confirmed)', async ({ request }) => {
    const dep = await createCustomerDepositViaApi(
      request,
      orgAdminToken,
      orgId,
      customerId,
      depositAmount,
    )
    depositId = dep.depositId
    const row = await gql<{ customerDeposit: { status: string; amount: number } }>(
      request,
      `query($id: ID!) { customerDeposit(id: $id) { status amount } }`,
      { id: depositId },
      orgAdminToken,
    )
    expect(row.customerDeposit.status).toBe('confirmed')
    expect(row.customerDeposit.amount).toBeCloseTo(depositAmount, 2)
  })

  test('03 — create bank account', async ({ request }) => {
    const bank = await createBankAccountViaApi(request, orgAdminToken, orgId, tag)
    bankAccountId = bank.bankAccountId
    expect(bankAccountId).toBeTruthy()
  })

  test('04 — customers & cash-bank pages smoke', async ({ page }) => {
    // /customers uses ErpListPage without an h1 — assert primary CTA instead
    await page.goto('/customers')
    await expect(page.getByRole('button', { name: /New customer/i })).toBeVisible({ timeout: 25_000 })
    await smokeModulePage(page, '/customers/accept-payments', /Payment|Accept/i)
    await smokeModulePage(page, '/cash-bank', /Cash|Bank/i)
  })
})
