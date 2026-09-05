/**
 * Sales returns (erp-flows/07-returns-credit-notes.md):
 * create RA → approve → receive returned goods.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, ensureCustomer } from './helpers/graphql-api'
import {
  createReturnAuthorizationViaApi,
  approveReturnAuthorizationViaApi,
  receiveReturnGoodsViaApi,
} from './helpers/returns-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Returns / return-authorization flow', () => {
  const tag = flowTag()
  let orgAdminToken = ''
  let orgId = ''
  let customerId = ''
  let raId = ''
  let lineId = ''

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
      `E2E RA Customer ${tag}`,
      `ra.${tag.slice(-8)}@example.com`,
    )
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create return authorization (pending)', async ({ request }) => {
    const ra = await createReturnAuthorizationViaApi(
      request,
      orgAdminToken,
      orgId,
      customerId,
      tag,
    )
    raId = ra.id
    lineId = ra.lines[0]?.id
    expect(ra.raNumber).toMatch(/^RA-/)
    expect(ra.status).toBe('pending')
    expect(lineId).toBeTruthy()
  })

  test('02 — approve return authorization', async ({ request }) => {
    const approved = await approveReturnAuthorizationViaApi(request, orgAdminToken, raId)
    expect(approved.status).toBe('approved')
  })

  test('03 — receive returned goods', async ({ request }) => {
    const received = await receiveReturnGoodsViaApi(request, orgAdminToken, raId, [
      { lineId, quantityReceived: 1 },
    ])
    expect(received.receiptComplete).toBe(true)
  })

  test('04 — returns pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/customers/issue-return-authorizations', /Return/i)
    await smokeModulePage(page, '/customers/approve-returns', /Return/i)
    await smokeModulePage(page, '/customers/receive-returned-order', /Return|Receive/i)
    await smokeModulePage(page, '/sales-returns', /Return/i)
  })
})
