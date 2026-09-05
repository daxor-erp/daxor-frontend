/**
 * Work orders (erp-flows/13-manufacturing-bom-mrp.md): create → update status.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import { createWorkOrderViaApi, updateWorkOrderViaApi } from './helpers/work-orders-api'
import { smokeModulePage } from './helpers/flow-pages'

test.describe.configure({ mode: 'serial', timeout: 120_000 })

test.describe('Work orders flow', () => {
  let orgAdminToken = ''
  let orgId = ''
  let workOrderId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create work order (draft)', async ({ request }) => {
    const wo = await createWorkOrderViaApi(request, orgAdminToken, orgId)
    workOrderId = wo.id
    expect(wo.docNumber).toBeTruthy()
    expect(wo.status).toMatch(/draft|open|pending/i)
  })

  test('02 — update work order status', async ({ request }) => {
    const updated = await updateWorkOrderViaApi(
      request,
      orgAdminToken,
      workOrderId,
      orgId,
      'IN_PROGRESS',
    )
    expect(updated.status).toBe('IN_PROGRESS')
  })

  test('03 — work orders page smoke', async ({ page }) => {
    await smokeModulePage(page, '/work-orders', /Work Order/i)
  })
})
