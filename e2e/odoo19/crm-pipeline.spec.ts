/**
 * Odoo 19 CRM pipeline → sale handoff
 * Docs: https://www.odoo.com/documentation/19.0/applications/sales.html
 *       (CRM: Convert opportunities into quotes)
 */
import { test, expect } from '@playwright/test'
import { orgAdminUser } from '../helpers/storage'
import { apiLogin, gql } from '../helpers/graphql-api'
import {
  createLeadViaApi,
  progressLeadViaApi,
  submitLeadForApprovalViaApi,
  convertLeadToOpportunityViaApi,
  closeOpportunityWonViaApi,
} from '../helpers/crm-api'
import { flowTag } from '../helpers/sales-pages'

test.describe.configure({ mode: 'serial', timeout: 180_000 })

test.describe('Odoo 19 — CRM pipeline', () => {
  const tag = flowTag()
  let token = ''
  let orgId = ''
  let leadId = ''
  let opportunityId = ''

  test.beforeAll(async ({ request }) => {
    const u = orgAdminUser()
    if (!u.email || !u.password) test.skip(true, 'Set E2E_USER_ORG_ADMIN_*')
    const session = await apiLogin(request, u.email, u.password)
    token = session.token
    orgId = session.organizationId
  })

  test('01 Lead — New', async ({ request }) => {
    const created = await createLeadViaApi(request, token, orgId, tag)
    leadId = created.leadId
    const row = await gql<{ lead: { status: string } }>(
      request,
      `query($id: ID!) { lead(id: $id) { status } }`,
      { id: leadId },
      token,
    )
    expect(row.lead.status).toBe('new')
  })

  test('02 Lead — Contacted → Qualified', async ({ request }) => {
    await progressLeadViaApi(request, token, orgId, leadId, 'contacted')
    await progressLeadViaApi(request, token, orgId, leadId, 'qualified')
    const row = await gql<{ lead: { status: string } }>(
      request,
      `query($id: ID!) { lead(id: $id) { status } }`,
      { id: leadId },
      token,
    )
    expect(row.lead.status).toBe('qualified')
  })

  test('03 Lead — submit for approval', async ({ request }) => {
    await submitLeadForApprovalViaApi(request, token, leadId)
  })

  test('04 Opportunity — convert from lead', async ({ request }) => {
    opportunityId = await convertLeadToOpportunityViaApi(request, token, leadId)
    expect(opportunityId).toBeTruthy()
  })

  test('05 Opportunity — mark Won (ready for quotation)', async ({ request }) => {
    await closeOpportunityWonViaApi(request, token, orgId, opportunityId)
    const opp = await gql<{ opportunity: { stage: string } }>(
      request,
      `query($id: ID!) { opportunity(id: $id) { stage } }`,
      { id: opportunityId },
      token,
    )
    expect(opp.opportunity.stage).toBe('closed-won')
  })
})
