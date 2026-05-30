import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createLeadViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<{ leadId: string; seqNo?: string }> {
  const data = await gql<{ createLead: { id: string; seqNo?: string; status: string } }>(
    request,
    `mutation($input: LeadInput!) {
      createLead(input: $input) { id seqNo status }
    }`,
    {
      input: {
        organizationId,
        firstName: 'E2E',
        lastName: `Lead ${tag}`,
        company: `E2E Co ${tag}`,
        email: `lead.${tag}@example.com`,
        status: 'new',
        source: 'e2e',
      },
    },
    token,
  )
  return { leadId: data.createLead.id, seqNo: data.createLead.seqNo }
}

export async function progressLeadViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  leadId: string,
  status: string,
) {
  const lead = await gql<{ lead: { firstName: string; lastName: string } }>(
    request,
    `query($id: ID!) { lead(id: $id) { firstName lastName } }`,
    { id: leadId },
    token,
  )
  await gql(
    request,
    `mutation($id: ID!, $input: LeadInput!) {
      updateLead(id: $id, input: $input) { id status }
    }`,
    {
      id: leadId,
      input: {
        organizationId,
        firstName: lead.lead.firstName,
        lastName: lead.lead.lastName,
        status,
      },
    },
    token,
  )
}

export async function submitLeadForApprovalViaApi(
  request: APIRequestContext,
  token: string,
  leadId: string,
) {
  await gql(
    request,
    `mutation($id: ID!) { submitLeadForApproval(id: $id) { id status } }`,
    { id: leadId },
    token,
  )
}

export async function convertLeadToOpportunityViaApi(
  request: APIRequestContext,
  token: string,
  leadId: string,
): Promise<string> {
  const data = await gql<{ convertLeadToOpportunity: string }>(
    request,
    `mutation($id: ID!) { convertLeadToOpportunity(id: $id) }`,
    { id: leadId },
    token,
  )
  return data.convertLeadToOpportunity
}

export async function closeOpportunityWonViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  opportunityId: string,
) {
  const opp = await gql<{ opportunity: { name: string } }>(
    request,
    `query($id: ID!) { opportunity(id: $id) { name } }`,
    { id: opportunityId },
    token,
  )
  await gql(
    request,
    `mutation($id: ID!, $input: OpportunityInput!) {
      updateOpportunity(id: $id, input: $input) { id stage }
    }`,
    {
      id: opportunityId,
      input: {
        organizationId,
        name: opp.opportunity.name,
        stage: 'closed-won',
        probability: 100,
      },
    },
    token,
  )
}
