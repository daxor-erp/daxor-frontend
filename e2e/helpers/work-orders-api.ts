import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createWorkOrderViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
): Promise<{ id: string; docNumber: string; status: string }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{
    createWorkOrder: { id: string; docNumber: string; status: string }
  }>(
    request,
    `mutation($input: WorkOrderInput!) {
      createWorkOrder(input: $input) { id docNumber status docDate }
    }`,
    {
      input: {
        organizationId,
        docDate: today,
        status: 'DRAFT',
      },
    },
    token,
  )
  return data.createWorkOrder
}

export async function updateWorkOrderViaApi(
  request: APIRequestContext,
  token: string,
  id: string,
  organizationId: string,
  status: string,
): Promise<{ id: string; status: string }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{ updateWorkOrder: { id: string; status: string } }>(
    request,
    `mutation($id: ID!, $input: WorkOrderInput!) {
      updateWorkOrder(id: $id, input: $input) { id status }
    }`,
    {
      id,
      input: { organizationId, docDate: today, status },
    },
    token,
  )
  return data.updateWorkOrder
}
