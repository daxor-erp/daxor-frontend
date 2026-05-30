/**
 * CRM path from flows/crm-flow.pdf (lead → opportunity → closed-won).
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { orgAdminUser } from './helpers/storage'
import { apiLogin, gql } from './helpers/graphql-api'
import {
  createLeadViaApi,
  progressLeadViaApi,
  submitLeadForApprovalViaApi,
  convertLeadToOpportunityViaApi,
  closeOpportunityWonViaApi,
} from './helpers/crm-api'
import { smokeModulePage } from './helpers/flow-pages'
import { flowTag } from './helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('CRM flow (flows/crm-flow.pdf)', () => {
  const tag = flowTag()
  let orgAdminToken = ''
  let orgId = ''
  let leadId = ''
  let opportunityId = ''

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

  test('01 — create lead (new)', async ({ request }) => {
    const created = await createLeadViaApi(request, orgAdminToken, orgId, tag)
    leadId = created.leadId
    const row = await gql<{ lead: { status: string } }>(
      request,
      `query($id: ID!) { lead(id: $id) { status } }`,
      { id: leadId },
      orgAdminToken,
    )
    expect(row.lead.status).toBe('new')
  })

  test('02 — contact & qualify lead', async ({ request }) => {
    await progressLeadViaApi(request, orgAdminToken, orgId, leadId, 'contacted')
    await progressLeadViaApi(request, orgAdminToken, orgId, leadId, 'qualified')
    const row = await gql<{ lead: { status: string } }>(
      request,
      `query($id: ID!) { lead(id: $id) { status } }`,
      { id: leadId },
      orgAdminToken,
    )
    expect(row.lead.status).toBe('qualified')
  })

  test('03 — submit lead for approval → qualified', async ({ request }) => {
    await submitLeadForApprovalViaApi(request, orgAdminToken, leadId)
    const row = await gql<{ lead: { status: string } }>(
      request,
      `query($id: ID!) { lead(id: $id) { status } }`,
      { id: leadId },
      orgAdminToken,
    )
    expect(['qualified', 'pending_approval']).toContain(row.lead.status)
  })

  test('04 — convert lead to opportunity', async ({ request }) => {
    opportunityId = await convertLeadToOpportunityViaApi(request, orgAdminToken, leadId)
    expect(opportunityId).toBeTruthy()
    const opp = await gql<{ opportunity: { stage: string } }>(
      request,
      `query($id: ID!) { opportunity(id: $id) { stage } }`,
      { id: opportunityId },
      orgAdminToken,
    )
    expect(opp.opportunity.stage).toBeTruthy()
  })

  test('05 — close opportunity won', async ({ request }) => {
    await closeOpportunityWonViaApi(request, orgAdminToken, orgId, opportunityId)
    const opp = await gql<{ opportunity: { stage: string } }>(
      request,
      `query($id: ID!) { opportunity(id: $id) { stage } }`,
      { id: opportunityId },
      orgAdminToken,
    )
    expect(opp.opportunity.stage).toBe('closed-won')
  })

  test('06 — CRM pages smoke', async ({ page }) => {
    await smokeModulePage(page, '/crm/lead-management', /Lead/i)
    await smokeModulePage(page, '/crm/opportunity-management', /Opportunit/i)
  })
})
