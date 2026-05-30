import { expect, type Page } from '@playwright/test'

/** Navigate and assert a module page loads (heading visible). */
export async function smokeModulePage(
  page: Page,
  href: string,
  heading: RegExp,
) {
  await page.goto(href)
  await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({
    timeout: 25_000,
  })
}
