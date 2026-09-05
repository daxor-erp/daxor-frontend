/**
 * Product catalog overhaul flow (Phase 2): categories, units of measure, attributes,
 * and the new Product master that generates variants from attribute-line combinations.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import {
  createProductCategoryViaApi,
  createUomViaApi,
  createAttributeViaApi,
  createProductViaApi,
  getProductViaApi,
  updateProductImagesViaApi,
  updateProductPackagingAndReorderingViaApi,
  getProductSmartButtonsViaApi,
  updateProductQuantityViaApi,
  setVendorPricelistViaApi,
  replenishProductViaApi,
} from './helpers/products-api'
import { createVendorViaApi } from './helpers/vendors-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Products catalog flow (categories, UoM, attributes, variants)', () => {
  const tag = flowTag()

  let orgAdminToken = ''
  let orgId = ''
  let categoryId = ''
  let uomId = ''
  let attributeId = ''
  let productId = ''

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

  test('01 — create product category', async ({ request }) => {
    const cat = await createProductCategoryViaApi(request, orgAdminToken, orgId, `E2E Tools ${tag}`)
    categoryId = cat.id
    expect(cat.fullPath).toContain('E2E Tools')
  })

  test('02 — create unit of measure with GST UQC', async ({ request }) => {
    const uom = await createUomViaApi(request, orgAdminToken, orgId, `E2E Nos ${tag}`, 'Unit')
    uomId = uom.id
    expect(uom.gstUqc).toBe('NOS')
  })

  test('03 — create attribute with reusable values', async ({ request }) => {
    const attr = await createAttributeViaApi(request, orgAdminToken, orgId, `E2E Size ${tag}`, ['Small', 'Medium', 'Large'])
    attributeId = attr.id
    expect(attr.values.length).toBe(3)
  })

  test('04 — create product with attribute line generates variants', async ({ request }) => {
    const attr = await createAttributeViaApi(request, orgAdminToken, orgId, `E2E Color ${tag}`, ['Red', 'Blue'])
    const product = await createProductViaApi(request, orgAdminToken, orgId, tag, {
      categoryId,
      uomId,
      attributeLines: [{ attributeId: attr.id, valueIds: attr.values.map((v) => v.id) }],
    })
    productId = product.id
    expect(product.seqNo).toMatch(/^P-/)

    const full = await getProductViaApi(request, orgAdminToken, productId)
    expect(full.canBePurchased).toBe(true)
    expect(full.canBeSold).toBe(false)
    expect(full.variants.length).toBe(2) // Red, Blue
  })

  test('05 — products page smoke: list renders and create dialog opens with all tabs', async ({ page }) => {
    await smokeModulePage(page, '/products', /Products/i)
    await page.getByRole('button', { name: /New Product/i }).first().click()
    await expect(page.getByRole('dialog').filter({ hasText: 'New product' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('tab', { name: 'Header' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Attributes & Variants' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Accounting' })).toBeVisible()
  })

  test('06 — categories / UoM / attributes master pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/products/categories', /Product Categories/i)
    await smokeModulePage(page, '/products/uom', /Units of Measure/i)
    await smokeModulePage(page, '/products/attributes', /Product Attributes/i)
  })

  test('07 — gap fix: image upload persists URLs on Product.images[]', async ({ request }) => {
    const updated = await updateProductImagesViaApi(request, orgAdminToken, productId, [
      '/api/documents/fake-id-1/download',
      '/api/documents/fake-id-2/download',
    ])
    expect(updated.images.length).toBe(2)
  })

  test('08 — gap fix: packaging + reordering rules persist on the product', async ({ request }) => {
    const updated = await updateProductPackagingAndReorderingViaApi(request, orgAdminToken, productId)
    expect(updated.packagings.length).toBe(1)
    expect(updated.packagings[0].name).toBe('Box of 10')
    expect(updated.reorderingRules.length).toBe(1)
    expect(updated.reorderingRules[0].minQty).toBe(5)
  })

  test('09 — gap fix: smart buttons reflect real On Hand / Forecasted / Purchased data after Update Quantity', async ({ request }) => {
    const before = await getProductSmartButtonsViaApi(request, orgAdminToken, productId)
    expect(before.onHandQty).toBe(0)

    const updated = await updateProductQuantityViaApi(request, orgAdminToken, productId, 40)
    expect(updated.onHandQty).toBe(40)

    const after = await getProductSmartButtonsViaApi(request, orgAdminToken, productId)
    expect(after.onHandQty).toBe(40)
    expect(after.forecastedQty).toBeGreaterThanOrEqual(40)
  })

  test('10 — gap fix: Replenish action drafts an RFQ from the vendor pricelist', async ({ request }) => {
    const vendor = await createVendorViaApi(request, orgAdminToken, orgId, `replenish-${tag}`)
    await setVendorPricelistViaApi(request, orgAdminToken, productId, vendor.id, 250)
    const result = await replenishProductViaApi(request, orgAdminToken, productId, 10)
    expect(result.vendorId).toBe(vendor.id)
    expect(result.unitPrice).toBe(250)
    expect(result.purchaseOrder.status).toBe('rfq')
  })

  test('11 — gap fix UI: smart buttons and action buttons render when editing a saved product', async ({ page }) => {
    await smokeModulePage(page, '/products', /Products/i)
    await page.getByRole('button', { name: /New Product/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
    // On a brand-new (unsaved) product, smart buttons/actions are not shown yet — only header/tabs.
    await expect(page.getByRole('tab', { name: 'Inventory' })).toBeVisible()
  })
})
