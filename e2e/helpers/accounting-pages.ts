import { expect, type Page } from '@playwright/test'

function tableSearchInput(page: Page, sectionTitle: string | RegExp) {
  return page
    .locator('div')
    .filter({ has: page.getByText(sectionTitle) })
    .locator('input[type="text"]')
    .first()
}

/** Frontend: journal entries list shows posted AR-INV / AR-PAY. */
export async function expectJournalRefOnPage(page: Page, ref: string) {
  await page.goto('/financial/make-journal-entries')
  await expect(page.getByRole('heading', { name: /Make Journal Entries/i })).toBeVisible({
    timeout: 20_000,
  })
  const search = tableSearchInput(page, 'All Journal Entries')
  if (await search.isVisible().catch(() => false)) {
    await search.fill(ref)
    await page.waitForTimeout(600)
  }
  const row = page.locator('table tbody tr').filter({ hasText: ref }).first()
  await expect(row).toBeVisible({ timeout: 20_000 })
  await expect(row.getByText('posted')).toBeVisible()
}

/** Frontend: general ledger shows automated customer invoice / payment rows. */
export async function expectGlModuleOnPage(
  page: Page,
  opts: { transactionType?: string; descriptionIncludes?: string },
) {
  await page.goto('/general-ledger')
  await expect(page.getByRole('heading', { name: /General Ledger/i })).toBeVisible({
    timeout: 20_000,
  })
  if (opts.transactionType) {
    const search = tableSearchInput(page, 'All Transactions')
    if (await search.isVisible().catch(() => false)) {
      await search.fill(opts.transactionType)
      await page.waitForTimeout(600)
    }
    await expect(
      page.locator('table tbody tr').filter({ hasText: opts.transactionType }).first(),
    ).toBeVisible({ timeout: 20_000 })
  }
  if (opts.descriptionIncludes) {
    await expect(
      page.locator('table tbody tr').filter({ hasText: opts.descriptionIncludes }).first(),
    ).toBeVisible({ timeout: 20_000 })
  }
}

/** Frontend: record payment on Accept Customer Payments (triggers backend posting). */
export async function recordPaymentForCustomer(
  page: Page,
  customerName: string,
  payAmount: string,
) {
  await page.goto('/customers/accept-payments')
  await expect(page.getByRole('heading', { name: /Accept Customer Payments/i })).toBeVisible()

  const billToRow = page.locator('tr').filter({ hasText: 'Bill-to' }).first()
  await billToRow.locator('.flex.items-center').first().click()
  const menu = page.locator('div.fixed').filter({ has: page.locator('input') }).last()
  await expect(menu).toBeVisible({ timeout: 10_000 })
  await menu.locator('input').fill(customerName)
  const escaped = customerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  await menu
    .locator('div')
    .filter({ hasText: new RegExp(escaped) })
    .filter({ hasNotText: /^Create:/ })
    .first()
    .click({ timeout: 15_000 })

  const payInput = page.locator('table tbody input[type="number"]').first()
  await expect(payInput).toBeVisible({ timeout: 20_000 })
  await payInput.fill(payAmount)

  await page.getByRole('button', { name: /Record payment/i }).click()
  await page.waitForTimeout(2500)
}

/** Frontend: recent payments table shows a receipt after payment. */
export async function expectRecentPaymentOnAcceptPage(page: Page) {
  await page.goto('/customers/accept-payments')
  await expect(page.getByText('Recent customer payments')).toBeVisible()
  await expect(page.locator('table tbody tr').nth(0)).toBeVisible({ timeout: 15_000 })
}
