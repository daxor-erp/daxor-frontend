/**
 * Odoo 19 Time Off (HR)
 * Docs: https://www.odoo.com/documentation/19.0/applications/hr.html
 *
 * Stages: Employee → Leave type → Enrollment → Application → Approve
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from '../helpers/storage'
import { apiLogin } from '../helpers/graphql-api'
import {
  createEmployeeMasterViaApi,
  createLeaveTypeViaApi,
  createLeaveEnrollmentViaApi,
  createLeaveApplicationViaApi,
  approveLeaveApplicationViaApi,
} from '../helpers/hr-api'
import { flowTag } from '../helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Odoo 19 — HR Time Off', () => {
  const tag = flowTag()
  let token = ''
  let orgId = ''
  let userId = ''
  let leaveTypeId = ''
  let applicationId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const session = await apiLogin(request, u.email, u.password)
    token = session.token
    orgId = session.organizationId
    userId = session.userId
  })

  test('01 Employee master', async ({ request }) => {
    const emp = await createEmployeeMasterViaApi(request, token, orgId, tag, userId)
    expect(emp.employeeCode).toBeTruthy()
  })

  test('02 Leave type + enrollment', async ({ request }) => {
    const lt = await createLeaveTypeViaApi(request, token, orgId, tag)
    leaveTypeId = lt.id
    const enr = await createLeaveEnrollmentViaApi(request, token, orgId, userId, leaveTypeId)
    expect(enr.entitledDays).toBeGreaterThan(0)
  })

  test('03 Leave application → approve', async ({ request }) => {
    const app = await createLeaveApplicationViaApi(request, token, orgId, userId, leaveTypeId)
    applicationId = app.id
    const approved = await approveLeaveApplicationViaApi(request, token, applicationId)
    expect(approved.status).toMatch(/approved/i)
  })
})
