import { expect, type Page } from '@playwright/test'

export function flowTag() {
  return `E2E-${Date.now()}`
}

/** Custom SelectFloating (portal dropdown), not native &lt;select&gt;. */
export async function selectFloatingOption(page: Page, label: string, optionMatch: string | RegExp) {
  const field = page.locator('div.relative').filter({ has: page.getByText(label, { exact: true }) }).first()
  await field.locator('.flex.items-center').first().click()
  const menu = page.locator('div.fixed').filter({ has: page.locator('input[placeholder*="Search"]') })
  await expect(menu).toBeVisible({ timeout: 10_000 })
  if (typeof optionMatch === 'string' && optionMatch.length > 2) {
    await menu.locator('input').fill(optionMatch)
  }
  await menu.getByText(optionMatch).first().click({ timeout: 15_000 })
}

export async function selectCellOption(
  page: Page,
  label: string | RegExp,
  option: { index?: number; value?: string } = { index: 1 },
) {
  const cell = page.locator('div').filter({ has: page.getByText(label) }).first()
  const select = cell.locator('select[data-cell-select]').first()
  if (option.value) {
    await select.selectOption(option.value)
  } else {
    await select.selectOption({ index: option.index ?? 1 })
  }
}

function quotationFormPanel(page: Page) {
  return page.locator('div.border-blue-300').filter({ hasText: /New quotation|Edit quotation/ })
}

export async function fillQuotationForm(page: Page, opts: {
  subject: string
  customerId?: string
  description?: string
  qty?: string
  unitPrice?: string
}) {
  const panel = quotationFormPanel(page)
  await expect(panel).toBeVisible({ timeout: 10_000 })

  const customerSelect = panel.locator('select[data-cell-select]').first()
  if (opts.customerId) {
    await customerSelect.selectOption(opts.customerId)
  } else {
    await customerSelect.selectOption({ index: 1 })
  }

  await panel.locator('input[data-cell-input][type="text"]').fill(opts.subject)

  const desc = opts.description ?? 'E2E line item'
  const qty = opts.qty ?? '2'
  const price = opts.unitPrice ?? '150'

  await panel.locator('input[placeholder="Description"]').first().fill(desc)
  const row = panel
    .locator('input[placeholder="Description"]')
    .first()
    .locator('xpath=ancestor::div[contains(@class,"grid")][1]')
  await row.locator('input[type="number"]').nth(0).fill(qty)
  await row.locator('input[type="number"]').nth(1).fill(price)
}

export async function saveQuotation(page: Page) {
  await page.getByRole('button', { name: /Save quotation/i }).click()
  await expect(
    page.getByText(/saved successfully|updated successfully/i).first(),
  ).toBeVisible({ timeout: 20_000 })
}

export async function submitQuotationForApproval(page: Page, subject: string) {
  const row = page.locator('div[role="button"]').filter({ hasText: subject }).first()
  await row.getByTitle('Send for internal approval').click()
  await expect(page.getByText(/Submitted for internal approval/i).first()).toBeVisible({ timeout: 15_000 })
}

export async function openPastEntriesFab(page: Page) {
  await page.getByRole('button', { name: 'View past entries' }).click()
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 })
}

export async function createSalesOrderFromQuotation(page: Page, quotationId: string) {
  await page.goto('/sales/enter-sales-order')
  await page.locator('#quotationStatus').selectOption('accepted')
  await page.locator('#quotationId').selectOption(quotationId)
  await page.getByRole('button', { name: /Create Sales Order/i }).click()
  await expect(page.getByText(/created successfully/i).first()).toBeVisible({ timeout: 20_000 })
}

/** Create invoice from an available sales order row (preferred E2E path). */
export async function createInvoiceFromSalesOrder(page: Page, customerName: string) {
  await page.goto('/sales/create-invoices')
  const soRow = page.locator('tr').filter({ hasText: customerName }).first()
  await soRow.getByRole('button', { name: /Generate Invoice/i }).click()
  await expect(page.locator('span.text-white', { hasText: 'New Invoice' })).toBeVisible({
    timeout: 10_000,
  })
  await page.getByRole('button', { name: /Save Invoice/i }).click()
  await expect(page.locator('tr').filter({ hasText: customerName }).first()).toBeVisible({
    timeout: 25_000,
  })
}
