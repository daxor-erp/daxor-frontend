import { expect, type Page } from '@playwright/test'

export type TestUser = {
  label: string
  email: string
  password: string
  /** Substring expected in post-login URL (e.g. /org-admin/dashboard) */
  expectedPath?: string
}

export async function loginAs(page: Page, user: TestUser) {
  await page.goto('/login')
  await page.locator('#email').fill(user.email)
  await page.locator('#password').fill(user.password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 20_000 })

  if (user.expectedPath) {
    const url = page.url()
    if (!url.includes(user.expectedPath)) {
      // Some org admins may land on /dashboard if role mapping differs
      const fallback = user.expectedPath.includes('org-admin') ? '/dashboard' : null
      if (!fallback || !url.includes(fallback)) {
        await expect(page).toHaveURL(new RegExp(user.expectedPath.replace(/\//g, '\\/')), {
          timeout: 15_000,
        })
      }
    }
  }

  const token = await page.evaluate(() => localStorage.getItem('token'))
  expect(token, `${user.label} should have auth token`).toBeTruthy()

  const storedUser = await page.evaluate(() => localStorage.getItem('user'))
  expect(storedUser, `${user.label} should have user in localStorage`).toBeTruthy()
  const parsed = JSON.parse(storedUser!) as { email?: string }
  expect(parsed.email?.toLowerCase()).toBe(user.email.toLowerCase())
}

export function usersFromEnv(): TestUser[] {
  const defs: Array<{
    label: string
    emailKey: string
    passwordKey: string
    expectedPath?: string
  }> = [
    {
      label: 'tenant org admin',
      emailKey: 'E2E_USER_ORG_ADMIN_EMAIL',
      passwordKey: 'E2E_USER_ORG_ADMIN_PASSWORD',
      expectedPath: '/org-admin/dashboard',
    },
    {
      label: 'standard user',
      emailKey: 'E2E_USER_STANDARD_EMAIL',
      passwordKey: 'E2E_USER_STANDARD_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'new user',
      emailKey: 'E2E_USER_NEW_EMAIL',
      passwordKey: 'E2E_USER_NEW_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'super admin',
      emailKey: 'E2E_USER_SUPER_ADMIN_EMAIL',
      passwordKey: 'E2E_USER_SUPER_ADMIN_PASSWORD',
      expectedPath: '/admin/dashboard',
    },
    {
      label: 'erp admin',
      emailKey: 'E2E_USER_ERP_ADMIN_EMAIL',
      passwordKey: 'E2E_USER_ERP_ADMIN_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'sales manager',
      emailKey: 'E2E_USER_SALES_EMAIL',
      passwordKey: 'E2E_USER_SALES_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'finance manager',
      emailKey: 'E2E_USER_FINANCE_EMAIL',
      passwordKey: 'E2E_USER_FINANCE_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'hr manager',
      emailKey: 'E2E_USER_HR_EMAIL',
      passwordKey: 'E2E_USER_HR_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'inventory manager',
      emailKey: 'E2E_USER_INVENTORY_EMAIL',
      passwordKey: 'E2E_USER_INVENTORY_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'purchase manager',
      emailKey: 'E2E_USER_PURCHASE_EMAIL',
      passwordKey: 'E2E_USER_PURCHASE_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'production manager',
      emailKey: 'E2E_USER_PRODUCTION_EMAIL',
      passwordKey: 'E2E_USER_PRODUCTION_PASSWORD',
      expectedPath: '/dashboard',
    },
    {
      label: 'warehouse supervisor',
      emailKey: 'E2E_USER_WAREHOUSE_EMAIL',
      passwordKey: 'E2E_USER_WAREHOUSE_PASSWORD',
      expectedPath: '/dashboard',
    },
  ]

  return defs
    .map((d) => ({
      label: d.label,
      email: process.env[d.emailKey] ?? '',
      password: process.env[d.passwordKey] ?? '',
      expectedPath: d.expectedPath,
    }))
    .filter((u) => u.email && u.password)
}
