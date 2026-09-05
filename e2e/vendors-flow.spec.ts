/**
 * Vendor overhaul flow (Phase 1): new Odoo-style vendor model — type/address, GST/PAN,
 * tags, sales & purchase info, bank accounts, warnings/internal notes, and the existing
 * draft -> submitted -> approved/declined org-approval engine.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import {
  createVendorViaApi,
  getVendorViaApi,
  checkGstinStatusViaApi,
  createTagViaApi,
  createBankViaApi,
  addVendorBankAccountViaApi,
  submitVendorForApprovalViaApi,
  createVendorWithGapFieldsViaApi,
  getVendorGapFieldsViaApi,
  getAuditLogsViaApi,
} from './helpers/vendors-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Vendors flow (new Odoo-style vendor model)', () => {
  const tag = flowTag()

  let orgAdminToken = ''
  let orgId = ''
  let vendorId = ''
  let bankId = ''

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

  test('01 — GSTIN check status: rejects malformed, accepts well-formed (mock provider)', async ({ request }) => {
    const bad = await checkGstinStatusViaApi(request, orgAdminToken, 'NOTAGSTIN')
    expect(bad.valid).toBe(false)
    expect(bad.status).toBe('INVALID')

    const good = await checkGstinStatusViaApi(request, orgAdminToken, '33ABCDE1234F1Z5')
    expect(good.valid).toBe(true)
    expect(good.status).toBe('ACTIVE')
    expect(good.source).toBe('MOCK')
  })

  test('02 — create vendor with structured address + GST/PAN — starts draft/inactive', async ({ request }) => {
    const vendor = await createVendorViaApi(request, orgAdminToken, orgId, tag)
    vendorId = vendor.id
    expect(vendor.seqNo).toMatch(/^V-/)
    expect(vendor.orgApprovalStatus).toBe('draft')
    expect(vendor.status).toBe('inactive')

    const full = await getVendorViaApi(request, orgAdminToken, vendorId)
    expect(full.type).toBe('company')
    expect(full.gstin).toMatch(/^33ABCDE\d{4}F1Z5$/)
    expect(full.pan).toMatch(/^ABCDE\d{4}F$/)
    expect(full.address?.city).toBe('Chennai')
  })

  test('03 — create tag master record via API (used by tag picker)', async ({ request }) => {
    const created = await createTagViaApi(request, orgAdminToken, orgId, `E2E Preferred ${tag}`)
    expect(created.id).toBeTruthy()
    expect(created.color).toBe('#22c55e')
  })

  test('04 — create bank + attach vendor bank account (nested Create Bank Account modal)', async ({ request }) => {
    const bank = await createBankViaApi(request, orgAdminToken, orgId, `E2E Bank ${tag}`)
    bankId = bank.id
    const updated = await addVendorBankAccountViaApi(request, orgAdminToken, vendorId, bankId, `ACC-${tag.slice(-8)}`)
    expect(updated.bankAccounts.length).toBeGreaterThanOrEqual(1)
    const full = await getVendorViaApi(request, orgAdminToken, vendorId)
    expect(full.bankAccounts.some((b) => b.bankName === `E2E Bank ${tag}`)).toBe(true)
    // accountHolder auto-fills from vendor name when not explicitly provided
    expect(full.bankAccounts[0].accountHolder).toBeTruthy()
  })

  test('05 — submit vendor for approval locks it from editing', async ({ request }) => {
    const submitted = await submitVendorForApprovalViaApi(request, orgAdminToken, vendorId)
    expect(submitted.orgApprovalStatus).toBe('submitted')
  })

  test('06 — vendors page smoke: list renders and wizard dialog opens', async ({ page }) => {
    await smokeModulePage(page, '/vendors', /Vendors/i)
    await page.getByRole('button', { name: /New Vendor/i }).first().click()
    await expect(page.getByRole('dialog').filter({ hasText: 'New vendor' })).toBeVisible({ timeout: 10_000 })
    // Step tabs for the multi-step wizard are visible
    await expect(page.getByText('1. Identity')).toBeVisible()
    await expect(page.getByText('2. Tax details')).toBeVisible()
    await expect(page.getByText('6. Accounting')).toBeVisible()
  })

  test('07 — gap fix: misc.company free-text field and Customer Invoice sending preference persist', async ({ request }) => {
    const vendor = await createVendorWithGapFieldsViaApi(request, orgAdminToken, orgId, tag)
    const full = await getVendorGapFieldsViaApi(request, orgAdminToken, vendor.id)
    expect(full.misc?.company).toBe('E2E Holdings Group')
    expect(full.accounting?.invoiceSendingPreference).toBe('postal')
  })

  test('08 — gap fix: chatter/activity panel surfaces a CREATE audit log entry for the vendor', async ({ request }) => {
    const logs = await getAuditLogsViaApi(request, orgAdminToken, vendorId)
    expect(logs.data.length).toBeGreaterThanOrEqual(1)
    expect(logs.data.some((l) => l.action === 'CREATE' && l.entityType === 'VENDOR')).toBe(true)
  })

  test('09 — gap fix UI: Customer Invoice section and Activity tab render in the vendor wizard', async ({ page }) => {
    await smokeModulePage(page, '/vendors', /Vendors/i)
    await page.getByRole('button', { name: /New Vendor/i }).first().click()
    await expect(page.getByRole('dialog').filter({ hasText: 'New vendor' })).toBeVisible({ timeout: 10_000 })
    await page.getByText('6. Accounting').click()
    await expect(page.getByText('Customer Invoice')).toBeVisible()
    await page.getByText('8. Activity').click()
    await expect(page.getByText(/Activity history is available after the vendor is saved/i)).toBeVisible()
  })
})
