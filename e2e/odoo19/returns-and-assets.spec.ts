/**
 * Odoo 19 Returns + Fixed Assets
 * Docs: https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp.html
 *       https://www.odoo.com/documentation/19.0/applications/finance.html
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from '../helpers/storage'
import { apiLogin, ensureCustomer } from '../helpers/graphql-api'
import {
  createReturnAuthorizationViaApi,
  approveReturnAuthorizationViaApi,
  receiveReturnGoodsViaApi,
} from '../helpers/returns-api'
import { createFixedAssetViaApi, postFixedAssetDepreciationViaApi } from '../helpers/fixed-assets-api'
import { flowTag } from '../helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Odoo 19 — Returns & Fixed Assets', () => {
  const tag = flowTag()
  let token = ''
  let orgId = ''
  let customerId = ''
  let raId = ''
  let lineId = ''
  let assetId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const session = await apiLogin(request, u.email, u.password)
    token = session.token
    orgId = session.organizationId
    customerId = await ensureCustomer(request, token, orgId, `Odoo19 RA Cust ${tag}`)
  })

  test('01 Return authorization — create (pending)', async ({ request }) => {
    const ra = await createReturnAuthorizationViaApi(request, token, orgId, customerId, tag)
    raId = ra.id
    lineId = ra.lines[0]?.id
    expect(ra.status).toBe('pending')
    expect(lineId).toBeTruthy()
  })

  test('02 Return — approve then receive goods', async ({ request }) => {
    const approved = await approveReturnAuthorizationViaApi(request, token, raId)
    expect(approved.status).toBe('approved')
    const received = await receiveReturnGoodsViaApi(request, token, raId, [
      { lineId, quantityReceived: 1 },
    ])
    expect(received.receiptComplete).toBe(true)
  })

  test('03 Fixed asset — create', async ({ request }) => {
    const asset = await createFixedAssetViaApi(request, token, orgId, tag)
    assetId = asset.id
    expect(asset.assetCode).toBeTruthy()
    expect(asset.bookValue).toBe(100000)
  })

  test('04 Fixed asset — post depreciation', async ({ request }) => {
    const dep = await postFixedAssetDepreciationViaApi(request, token, assetId)
    expect(dep.accumulatedDepreciation).toBeGreaterThan(0)
    expect(dep.bookValue).toBeLessThan(100000)
  })
})
