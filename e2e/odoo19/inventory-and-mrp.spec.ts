/**
 * Odoo 19 Inventory + Manufacturing
 * Docs: https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp.html
 *
 * Inventory: receipt (GRN), adjustment, internal transfer
 * Manufacturing: BOM → production completion
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from '../helpers/storage'
import { apiLogin } from '../helpers/graphql-api'
import {
  createConfirmedGrnViaApi,
  fetchInventoryQtyByItemName,
  createAndConfirmStockTransferViaApi,
  inventoryQtyAtBin,
} from '../helpers/inventory-ext-api'
import { createAndConfirmStockAdjustmentViaApi } from '../helpers/inventory-flow-api'
import {
  assertGrnPosted,
  assertStockAdjustmentPosted,
  assertStockTransferPosted,
  assertProductionCompletedPosted,
} from '../helpers/accounting-api'
import {
  createActiveBomViaApi,
  createAndCompleteProductionPlanViaApi,
  ensureProductionItem,
} from '../helpers/production-api'
import { flowTag } from '../helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 240_000 })

test.describe('Odoo 19 — Inventory & Manufacturing', () => {
  const tag = flowTag()
  const itemName = `Odoo19-INV-${tag}`
  const fgName = `Odoo19-FG-${tag}`
  const grnQty = 10
  const actualCost = 750

  let token = ''
  let orgId = ''
  let grnId = ''
  let grnNumber = ''
  let itemId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const session = await apiLogin(request, u.email, u.password)
    token = session.token
    orgId = session.organizationId
  })

  test('01 Receipt — validate GRN increases on-hand qty', async ({ request }) => {
    const grn = await createConfirmedGrnViaApi(request, token, orgId, itemName, grnQty, 15)
    grnId = grn.grnId
    grnNumber = grn.grnNumber
    const qty = await fetchInventoryQtyByItemName(request, token, orgId, itemName)
    expect(qty).toBeGreaterThanOrEqual(grnQty)
  })

  test('02 Receipt — posts inventory journal', async ({ request }) => {
    await assertGrnPosted(request, token, orgId, grnId, grnNumber)
  })

  test('03 Inventory adjustment — increase + post', async ({ request }) => {
    const adj = await createAndConfirmStockAdjustmentViaApi(request, token, orgId, itemName, 3)
    expect(adj.adjustmentId).toBeTruthy()
    await assertStockAdjustmentPosted(request, token, orgId, adj.adjustmentId, adj.adjNumber)
  })

  test('04 Internal transfer — MAIN → WH-B', async ({ request }) => {
    const transferItem = `Odoo19-ST-${tag}`
    const qty = 4
    await createConfirmedGrnViaApi(request, token, orgId, transferItem, qty, 5)
    const beforeFrom = await inventoryQtyAtBin(request, token, orgId, transferItem, 'MAIN')
    const xfer = await createAndConfirmStockTransferViaApi(request, token, orgId, transferItem, qty)
    expect(xfer.transferId).toBeTruthy()
    const afterFrom = await inventoryQtyAtBin(request, token, orgId, transferItem, 'MAIN')
    expect(afterFrom).toBeLessThanOrEqual(beforeFrom)
    await assertStockTransferPosted(request, token, orgId, xfer.transferId, xfer.transferNumber)
  })

  test('05 Manufacturing — active BOM then complete MO', async ({ request }) => {
    itemId = await ensureProductionItem(request, token, orgId, fgName)
    await createActiveBomViaApi(request, token, orgId, tag, itemId, fgName)
    const plan = await createAndCompleteProductionPlanViaApi(
      request,
      token,
      orgId,
      tag,
      actualCost,
    )
    expect(plan.docNumber).toBeTruthy()
    await assertProductionCompletedPosted(request, token, orgId, plan.planId, plan.docNumber)
  })
})
