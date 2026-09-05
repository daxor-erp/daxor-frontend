/**
 * Frontend A–Z UX / form edge cases (Playwright).
 * Complements backend test-edge-cases-az.ts — clear [frontend-edge:…] errors.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'

test.describe.configure({ mode: 'serial', timeout: 300_000 })

test.describe('Frontend A–Z edge cases', () => {
  test.beforeAll(() => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
  })

  // A — Auth empty / invalid
  test('A — login rejects empty credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('A — login rejects wrong password with error message', async ({ page }) => {
    const u = orgAdminUser()
    await page.goto('/login')
    await page.locator('#email').fill(u.email)
    await page.locator('#password').fill('WrongPassword!!!')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })
    await expect(
      page.getByText(/login failed|invalid|incorrect|unauthorized|wrong/i).first(),
    ).toBeVisible({ timeout: 10_000 })
  })

  // B — Protected route bounce
  test('B — unauthenticated visit to /vendors redirects to login', async ({ page }) => {
    await page.goto('/vendors')
    await expect(page).toHaveURL(/\/login/, { timeout: 20_000 })
  })

  test('B — unauthenticated visit to /org-admin/dashboard redirects to login', async ({ page }) => {
    await page.goto('/org-admin/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 20_000 })
  })

  // C–Z — Authenticated UI edges
  test('C-Z — authenticated module edges', async ({ page }) => {
    await loginAs(page, orgAdminUser())
    const failures: string[] = []

    const run = async (letter: string, name: string, fn: () => Promise<void>) => {
      try {
        await fn()
      } catch (err) {
        failures.push(`[frontend-edge:${letter}] ${name}: ${(err as Error).message}`)
      }
    }

    // C — Dashboard loads after login
    await run('C', 'dashboard loads', async () => {
      await page.goto('/dashboard')
      await expect(page).not.toHaveURL(/\/login/)
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // D — Deep link unknown route does not crash app shell
    await run('D', 'unknown route keeps shell or 404 without fatal overlay', async () => {
      await page.goto('/this-route-does-not-exist-edge-xyz')
      const fatal = page.getByText(/Unhandled Runtime Error|Application error/i)
      await expect(fatal).toHaveCount(0)
    })

    // E — Vendors page: create dialog open/cancel (no dirty crash)
    await run('E', 'vendors wizard opens and closes', async () => {
      await page.goto('/vendors')
      await expect(page.getByRole('heading', { name: /Vendors/i }).first()).toBeVisible({
        timeout: 25_000,
      })
      const createBtn = page.getByRole('button', { name: /new|create|add/i }).first()
      if (await createBtn.isVisible().catch(() => false)) {
        await createBtn.click()
        const dialog = page.getByRole('dialog').first()
        await expect(dialog).toBeVisible({ timeout: 10_000 })
        const cancel = dialog.getByRole('button', { name: /cancel|close|×/i }).first()
        if (await cancel.isVisible().catch(() => false)) await cancel.click()
        else await page.keyboard.press('Escape')
      }
    })

    // F — Products page loads masters
    await run('F', 'products / categories / uom pages', async () => {
      for (const href of ['/products', '/products/categories', '/products/uom']) {
        await page.goto(href)
        await expect(page).not.toHaveURL(/\/login/)
        await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({
          timeout: 25_000,
        })
      }
    })

    // G — Purchase orders list
    await run('G', 'purchase orders page', async () => {
      await page.goto('/purchases/enter-purchase-orders')
      await expect(page.getByRole('heading', { name: /Purchase/i }).first()).toBeVisible({
        timeout: 25_000,
      })
    })

    // H — Sales enquiry / quotations
    await run('H', 'sales enquiry + quotations', async () => {
      await page.goto('/sales/sales-enquiry')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/quotations')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // I — Inventory stock pages
    await run('I', 'stock adjustments + transfers', async () => {
      await page.goto('/stock-adjustments')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/stock-transfers')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // J — Journals / GL
    await run('J', 'general ledger + journal entries', async () => {
      await page.goto('/general-ledger')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/financial/make-journal-entries')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // K — Customers returns pages
    await run('K', 'return authorization pages', async () => {
      await page.goto('/customers/issue-return-authorizations')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/customers/approve-returns')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // L — Leave HR pages
    await run('L', 'leave type + application', async () => {
      await page.goto('/hr/leave/leave-type')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/hr/leave/leave-application')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // M — Fixed assets
    await run('M', 'fixed assets page', async () => {
      await page.goto('/financial/fixed-assets')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // N — Payables enter bills
    await run('N', 'payables enter bills', async () => {
      await page.goto('/payables/enter-bills')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // O — Org admin approvals
    await run('O', 'org-admin approvals', async () => {
      await page.goto('/org-admin/approvals')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // P — Reports do not crash
    await run('P', 'trial balance + aged receivable', async () => {
      await page.goto('/reports/financial/trial-balance')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/reports/financial/aged-receivable')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // Q — CRM lead/opportunity
    await run('Q', 'CRM pages', async () => {
      await page.goto('/crm/lead-management')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
      await page.goto('/crm/opportunity-management')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // R — Rapid navigation stress (no crash)
    await run('R', 'rapid nav between modules', async () => {
      for (const href of ['/vendors', '/products', '/customers', '/dashboard', '/payables/enter-bills']) {
        await page.goto(href, { waitUntil: 'domcontentloaded' })
      }
      await expect(page.getByText(/Unhandled Runtime Error|Application error/i)).toHaveCount(0)
    })

    // S — Settings page
    await run('S', 'settings page', async () => {
      await page.goto('/settings')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // T — Work orders
    await run('T', 'work orders', async () => {
      await page.goto('/work-orders')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // U — Warehouse
    await run('U', 'warehouse', async () => {
      await page.goto('/warehouse')
      await expect(page.locator('main, [role="main"], nav').first()).toBeVisible({ timeout: 25_000 })
    })

    // V — Browser back after login stays authenticated
    await run('V', 'history back stays authenticated', async () => {
      await page.goto('/dashboard')
      await page.goto('/vendors')
      await page.goBack()
      await expect(page).not.toHaveURL(/\/login/)
    })

    // W — Logout / clear session if UI exposes it (soft)
    await run('W', 'token present in localStorage while logged in', async () => {
      const token = await page.evaluate(() => localStorage.getItem('token'))
      expect(token).toBeTruthy()
    })

    // X — XSS reflection guard on search if present
    await run('X', 'search input does not execute script', async () => {
      await page.goto('/vendors')
      const search = page.getByPlaceholder(/search/i).first()
      if (await search.isVisible().catch(() => false)) {
        await search.fill('<script>window.__xss=1</script>')
        const flagged = await page.evaluate(() => (window as any).__xss === 1)
        expect(flagged).toBeFalsy()
      }
    })

    // Y — Concurrent tab auth (same storage)
    await run('Y', 'new page same context still authenticated', async () => {
      const p2 = await page.context().newPage()
      await p2.goto('/dashboard')
      await expect(p2).not.toHaveURL(/\/login/)
      await p2.close()
    })

    // Z — No fatal toast after suite
    await run('Z', 'no fatal error toast left open', async () => {
      await expect(page.getByText(/Unhandled Runtime Error|Application error/i)).toHaveCount(0)
    })

    expect(failures, failures.join('\n')).toEqual([])
  })
})
