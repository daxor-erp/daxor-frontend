import type { Page } from '@playwright/test'
import { loginAs, type TestUser } from './auth'

const AUTH_FILE = 'e2e/.auth/org-admin.json'

export const orgAdminUser = (): TestUser => ({
  label: 'org admin',
  email: process.env.E2E_USER_ORG_ADMIN_EMAIL!,
  password: process.env.E2E_USER_ORG_ADMIN_PASSWORD!,
  expectedPath: '/org-admin/dashboard',
})

/** Persist login for serial sales-flow tests (fresh browser context per test otherwise). */
export async function loginAndSaveState(page: Page) {
  await loginAs(page, orgAdminUser())
  await page.context().storageState({ path: AUTH_FILE })
}

export { AUTH_FILE }
