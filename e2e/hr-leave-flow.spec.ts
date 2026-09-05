/**
 * HR leave lifecycle (erp-flows/09-hr-payroll.md):
 * employee master → leave type → enrollment → application → approve.
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin } from './helpers/graphql-api'
import {
  createEmployeeMasterViaApi,
  createLeaveTypeViaApi,
  createLeaveEnrollmentViaApi,
  createLeaveApplicationViaApi,
  approveLeaveApplicationViaApi,
} from './helpers/hr-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('HR leave flow', () => {
  const tag = flowTag()
  let orgAdminToken = ''
  let orgId = ''
  let orgAdminUserId = ''
  let leaveTypeId = ''
  let leaveApplicationId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) {
      test.skip(true, 'Set E2E_USER_ORG_ADMIN_* in .env.e2e.local')
    }
    const session = await apiLogin(request, u.email, u.password)
    orgAdminToken = session.token
    orgId = session.organizationId
    orgAdminUserId = session.userId
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, orgAdminUser())
  })

  test('01 — create employee master', async ({ request }) => {
    const emp = await createEmployeeMasterViaApi(
      request,
      orgAdminToken,
      orgId,
      tag,
      orgAdminUserId,
    )
    expect(emp.id).toBeTruthy()
    expect(emp.employeeCode).toBeTruthy()
    expect(emp.status.toUpperCase()).toMatch(/ACTIVE|DRAFT|PROBATION/)
  })

  test('02 — create leave type', async ({ request }) => {
    const lt = await createLeaveTypeViaApi(request, orgAdminToken, orgId, tag)
    leaveTypeId = lt.id
    expect(lt.code).toMatch(/^AL-/)
  })

  test('03 — enroll user for leave type', async ({ request }) => {
    const enrollment = await createLeaveEnrollmentViaApi(
      request,
      orgAdminToken,
      orgId,
      orgAdminUserId,
      leaveTypeId,
    )
    expect(enrollment.id).toBeTruthy()
    expect(enrollment.entitledDays).toBe(12)
  })

  test('04 — create leave application (pending)', async ({ request }) => {
    const app = await createLeaveApplicationViaApi(
      request,
      orgAdminToken,
      orgId,
      orgAdminUserId,
      leaveTypeId,
    )
    leaveApplicationId = app.id
    expect(app.status).toMatch(/pending|submitted|draft/i)
    expect(app.totalDays).toBeGreaterThan(0)
  })

  test('05 — approve leave application', async ({ request }) => {
    const approved = await approveLeaveApplicationViaApi(
      request,
      orgAdminToken,
      leaveApplicationId,
    )
    expect(approved.status).toMatch(/approved/i)
  })

  test('06 — HR pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/hr/masters/employee-master', /Employee/i)
    await smokeModulePage(page, '/hr/leave/leave-type', /Leave/i)
    await smokeModulePage(page, '/hr/leave/leave-application', /Leave/i)
    await smokeModulePage(page, '/hr/leave/leave-enrollment', /Leave|Enrollment/i)
  })
})
