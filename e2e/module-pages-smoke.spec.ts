/**
 * Visits every static protected page under app/(protected).
 * Failures report as: [frontend:<group>/<name>] <href> — <reason>
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { assertModulePageLoads } from './helpers/flow-pages'
import { MODULE_PAGES, moduleGroups } from './helpers/module-pages'

test.describe.configure({ mode: 'serial', timeout: 900_000 })

test.describe('Frontend pages smoke (all protected routes)', () => {
  test.beforeAll(() => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    expect(MODULE_PAGES.length).toBeGreaterThanOrEqual(150)
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  for (const group of moduleGroups()) {
    test(`smoke — ${group} (${MODULE_PAGES.filter((p) => p.group === group).length} pages)`, async ({
      page,
    }) => {
      const pages = MODULE_PAGES.filter((p) => p.group === group)
      expect(pages.length).toBeGreaterThan(0)
      const failures: string[] = []

      for (const mod of pages) {
        try {
          await assertModulePageLoads(page, mod.href, `${mod.group}/${mod.name}`)
        } catch (err) {
          failures.push((err as Error).message)
        }
      }

      expect(
        failures,
        [
          `${failures.length}/${pages.length} page(s) failed in group "${group}":`,
          ...failures,
        ].join('\n'),
      ).toEqual([])
    })
  }
})
