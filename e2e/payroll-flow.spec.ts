/**
 * Payroll path from flows/payroll-flow.pdf (run → approve → compute).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  createPayrollRunViaApi,
  submitAndApprovePayrollViaApi,
  computePayrollRunViaApi,
} from './helpers/payroll-api'
import { assertPayrollRunPosted } from './helpers/accounting-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Payroll flow (flows/payroll-flow.pdf)', () => {
  const tag = flowTag()
  let orgAdminToken = ''
  let orgId = ''
  let payrollRunId = ''
  let docNumber = ''
  let payslipCount = 0

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

  test('01 — create payroll management (draft)', async ({ request }) => {
    const run = await createPayrollRunViaApi(request, orgAdminToken, orgId, tag)
    payrollRunId = run.payrollRunId
    docNumber = run.docNumber
    const row = await gql<{ payrollmanagement: { status: string } }>(
      request,
      `query($id: ID!) { payrollmanagement(id: $id) { status payPeriodStart payPeriodEnd } }`,
      { id: payrollRunId },
      orgAdminToken,
    )
    expect(row.payrollmanagement.status).toMatch(/draft|DRAFT/i)
  })

  test('02 — submit & approve payroll run', async ({ request }) => {
    await submitAndApprovePayrollViaApi(request, orgAdminToken, payrollRunId)
    const row = await gql<{ payrollmanagement: { status: string } }>(
      request,
      `query($id: ID!) { payrollmanagement(id: $id) { status } }`,
      { id: payrollRunId },
      orgAdminToken,
    )
    expect(row.payrollmanagement.status).toMatch(/approved|APPROVED/i)
  })

  test('03 — compute payroll run', async ({ request }) => {
    try {
      payslipCount = await computePayrollRunViaApi(request, orgAdminToken, payrollRunId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!msg.includes('gross is zero') && !msg.includes('No employees')) {
        throw e
      }
      payslipCount = 0
    }
    const row = await gql<{ payrollmanagement: { status: string } }>(
      request,
      `query($id: ID!) { payrollmanagement(id: $id) { status } }`,
      { id: payrollRunId },
      orgAdminToken,
    )
    expect(row.payrollmanagement.status).toMatch(/computed|COMPUTED/i)
  })

  test('04 — PR-PAY journal when gross pay > 0', async ({ request }) => {
    const slips = await gql<{ payslipsByRun: Array<{ grossEarnings: number }> }>(
      request,
      `query($id: String!) { payslipsByRun(payrollRunId: $id) { grossEarnings } }`,
      { id: payrollRunId },
      orgAdminToken,
    )
    const gross = slips.payslipsByRun.reduce((s, p) => s + Number(p.grossEarnings || 0), 0)
    if (gross < 0.01) {
      test.skip(true, 'No gross earnings on payslips — PR-PAY not posted')
    }
    await assertPayrollRunPosted(request, orgAdminToken, orgId, payrollRunId, docNumber)
  })

  test('05 — payroll pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/payroll-management', /Payroll/i)
    await smokeModulePage(page, '/payroll/workflow/payroll-runs', /Payroll|Run/i)
  })
})
