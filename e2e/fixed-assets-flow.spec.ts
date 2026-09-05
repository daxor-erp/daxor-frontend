/**
 * Fixed assets (erp-flows/12-fixed-assets-maintenance.md):
 * create asset → post depreciation period.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import {
  createFixedAssetViaApi,
  postFixedAssetDepreciationViaApi,
} from './helpers/fixed-assets-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Fixed assets flow', () => {
  const tag = flowTag()
  let orgAdminToken = ''
  let orgId = ''
  let assetId = ''
  let acquisitionCost = 0

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

  test('01 — create fixed asset', async ({ request }) => {
    const asset = await createFixedAssetViaApi(request, orgAdminToken, orgId, tag)
    assetId = asset.id
    acquisitionCost = asset.bookValue
    expect(asset.assetCode).toMatch(/^FA-/)
    expect(asset.bookValue).toBe(100000)
  })

  test('02 — post depreciation', async ({ request }) => {
    const posted = await postFixedAssetDepreciationViaApi(request, orgAdminToken, assetId)
    expect(posted.accumulatedDepreciation).toBeGreaterThan(0)
    expect(posted.bookValue).toBeLessThan(acquisitionCost)
  })

  test('03 — fixed assets pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/financial/fixed-assets', /Asset|Fixed/i)
    await smokeModulePage(page, '/financial/asset-maintenance', /Asset|Maintenance/i)
  })
})
