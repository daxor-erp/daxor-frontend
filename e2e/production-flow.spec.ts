/**
 * Production path from flows/production-flow.pdf (BOM → plan complete → PRD-COMP).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  ensureProductionItem,
  createActiveBomViaApi,
  createAndCompleteProductionPlanViaApi,
} from './helpers/production-api'
import { assertProductionCompletedPosted } from './helpers/accounting-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Production flow (flows/production-flow.pdf)', () => {
  const tag = flowTag()
  const itemName = `E2E-FG-${tag}`
  const actualCost = 750

  let orgAdminToken = ''
  let orgId = ''
  let itemId = ''
  let bomId = ''
  let planId = ''
  let docNumber = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    itemId = await ensureProductionItem(request, orgAdminToken, orgId, itemName)
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create active BOM', async ({ request }) => {
    const bom = await createActiveBomViaApi(
      request,
      orgAdminToken,
      orgId,
      tag,
      itemId,
      itemName,
    )
    bomId = bom.bomId
    const row = await gql<{ billOfMaterials: { status: string; totalCost: number } }>(
      request,
      `query($id: ID!) { billOfMaterials(id: $id) { status totalCost } }`,
      { id: bomId },
      orgAdminToken,
    )
    expect(row.billOfMaterials.status).toMatch(/active|ACTIVE/i)
    expect(Number(row.billOfMaterials.totalCost)).toBeGreaterThan(0)
  })

  test('02 — complete production plan', async ({ request }) => {
    const plan = await createAndCompleteProductionPlanViaApi(
      request,
      orgAdminToken,
      orgId,
      tag,
      actualCost,
    )
    planId = plan.planId
    docNumber = plan.docNumber
    const row = await gql<{ productionplanning: { status: string; actualCost: number } }>(
      request,
      `query($id: ID!) { productionplanning(id: $id) { status actualCost } }`,
      { id: planId },
      orgAdminToken,
    )
    expect(row.productionplanning.status).toBe('completed')
    expect(Number(row.productionplanning.actualCost)).toBeCloseTo(actualCost, 2)
  })

  test('03 — PRD-COMP journal posted', async ({ request }) => {
    await assertProductionCompletedPosted(request, orgAdminToken, orgId, planId, docNumber)
  })

  test('04 — production pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/production-planning', /Production/i)
    await smokeModulePage(page, '/production/bom', /BOM|Bill of Materials/i)
  })
})
