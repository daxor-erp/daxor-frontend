/**
 * Inventory path from flows/inventory-flow.pdf (GRN, adjustment, transfer).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import { assertGrnPosted, assertStockAdjustmentPosted } from './helpers/accounting-api'
import {
  createConfirmedGrnViaApi,
  fetchInventoryQtyByItemName,
  createAndConfirmStockTransferViaApi,
  inventoryQtyAtBin,
} from './helpers/inventory-ext-api'
import { createAndConfirmStockAdjustmentViaApi } from './helpers/inventory-flow-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Inventory flow (flows/inventory-flow.pdf)', () => {
  const tag = flowTag()
  const itemName = `E2E-INV-${tag}`
  const grnQty = 5
  const adjQty = 3
  const transferQty = 2

  let orgAdminToken = ''
  let orgId = ''
  let grnId = ''
  let grnNumber = ''
  let adjId = ''
  let adjNumber = ''

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

  test('01 — GRN confirmed increases inventory', async ({ request }) => {
    const grn = await createConfirmedGrnViaApi(
      request,
      orgAdminToken,
      orgId,
      itemName,
      grnQty,
      8,
    )
    grnId = grn.grnId
    grnNumber = grn.grnNumber
    const qty = await fetchInventoryQtyByItemName(request, orgAdminToken, orgId, itemName)
    expect(qty).toBeGreaterThanOrEqual(grnQty - 0.01)
  })

  test('02 — GRN posts INV-GRN', async ({ request }) => {
    await assertGrnPosted(request, orgAdminToken, orgId, grnId, grnNumber)
  })

  test('03 — stock adjustment increase + INV-SA', async ({ request }) => {
    const adj = await createAndConfirmStockAdjustmentViaApi(
      request,
      orgAdminToken,
      orgId,
      itemName,
      adjQty,
    )
    adjId = adj.adjustmentId
    adjNumber = adj.adjNumber
    await assertStockAdjustmentPosted(request, orgAdminToken, orgId, adjId, adjNumber)
    const qty = await fetchInventoryQtyByItemName(request, orgAdminToken, orgId, itemName)
    expect(qty).toBeGreaterThanOrEqual(grnQty + adjQty - 0.01)
  })

  test('04 — stock transfer MAIN → WH-B', async ({ request }) => {
    const beforeTo = await inventoryQtyAtBin(request, orgAdminToken, orgId, itemName, 'WH-B')
    const st = await createAndConfirmStockTransferViaApi(
      request,
      orgAdminToken,
      orgId,
      itemName,
      transferQty,
    )
    expect(st.fromBin).toBe('MAIN')
    const afterTo = await inventoryQtyAtBin(request, orgAdminToken, orgId, itemName, 'WH-B')
    expect(afterTo - beforeTo).toBeCloseTo(transferQty, 2)
  })

  test('05 — inventory module pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/goods-receipt', /Goods Receipt|GRN/i)
    await smokeModulePage(page, '/stock-transfers', /Stock transfer/i)
    await smokeModulePage(page, '/stock-adjustments', /Stock Adjustment|Adjustment/i)
  })
})
