/**
 * Backend module GraphQL smoke — one list/query per apps/api/src/modules/*.
 * Failures report as: [backend:<module>] GraphQL <query> failed: <message>
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import {
  BACKEND_MODULES,
  backendModulesSkipped,
  backendModulesToSmoke,
} from './helpers/backend-modules'

const API_URL = process.env.E2E_GRAPHQL_URL || 'http://localhost:4000/graphql'

test.describe.configure({ mode: 'serial', timeout: 600_000 })

test.describe('Backend modules GraphQL smoke', () => {
  let token = ''
  let organizationId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    token = session.token
    organizationId = session.organizationId
  })

  test('catalog lists every backend module folder', () => {
    expect(BACKEND_MODULES.length).toBeGreaterThanOrEqual(90)
    const skipped = backendModulesSkipped()
    // Skipped modules are documented — still counted in catalog
    expect(skipped.every((m) => m.skipReason)).toBe(true)
  })

  test('every smokeable module list/query succeeds', async ({ request }) => {
    const modules = backendModulesToSmoke()
    expect(modules.length).toBeGreaterThanOrEqual(80)

    const failures: string[] = []

    for (const mod of modules) {
      const variables = mod.usesOrganizationId ? { organizationId } : undefined
      try {
        const res = await request.post(API_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: { query: mod.smokeQuery, variables },
        })

        if (!res.ok()) {
          failures.push(
            `[backend:${mod.module}] HTTP ${res.status()} calling ${mod.queryName} — ${API_URL}`,
          )
          continue
        }

        const json = (await res.json()) as {
          data?: Record<string, unknown> | null
          errors?: Array<{ message: string }>
        }

        if (json.errors?.length) {
          const msg = json.errors.map((e) => e.message).join('; ')
          failures.push(
            `[backend:${mod.module}] GraphQL ${mod.queryName} failed: ${msg}`,
          )
          continue
        }

        if (!json.data || !(mod.queryName! in json.data)) {
          failures.push(
            `[backend:${mod.module}] GraphQL ${mod.queryName} returned no data field`,
          )
        }
      } catch (err) {
        failures.push(
          `[backend:${mod.module}] GraphQL ${mod.queryName} threw: ${(err as Error).message}`,
        )
      }
    }

    expect(
      failures,
      [
        `${failures.length}/${modules.length} backend module(s) failed:`,
        ...failures,
        '',
        'Skipped (need fixtures / no schema):',
        ...backendModulesSkipped().map((m) => `  - ${m.module}: ${m.skipReason}`),
      ].join('\n'),
    ).toEqual([])
  })
})
