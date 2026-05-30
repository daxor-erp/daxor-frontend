import { test, expect } from '@playwright/test'
import { loginAs, usersFromEnv } from './helpers/auth'

const users = usersFromEnv()

test.describe('User login', () => {
  test.beforeAll(() => {
    if (users.length === 0) {
      throw new Error(
        'No E2E credentials. Copy .env.e2e.example to .env.e2e.local or export E2E_USER_* env vars.',
      )
    }
  })

  for (const user of users) {
    test(`${user.label} (${user.email}) can sign in`, async ({ page }) => {
      await loginAs(page, user)
      await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 15_000 })
    })
  }

  test('invalid password shows error', async ({ page }) => {
    const sample = users[0]
    await page.goto('/login')
    await page.locator('#email').fill(sample.email)
    await page.locator('#password').fill('definitely-wrong-password-xyz')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 })
    await expect(page.getByText(/login failed|invalid|incorrect|unauthorized/i).first()).toBeVisible({
      timeout: 10_000,
    })
  })
})
