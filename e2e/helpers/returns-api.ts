import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createReturnAuthorizationViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  customerId: string,
  tag: string,
): Promise<{ id: string; raNumber: string; status: string; lines: Array<{ id: string }> }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{
    createReturnAuthorization: {
      id: string
      raNumber: string
      status: string
      lines: Array<{ id: string; description: string; quantity: number }>
    }
  }>(
    request,
    `mutation($input: CreateReturnAuthorizationInput!) {
      createReturnAuthorization(input: $input) {
        id raNumber status
        lines { id description quantity quantityReceived }
      }
    }`,
    {
      input: {
        organizationId,
        customerId,
        reason: 'defective',
        notes: `E2E RA ${tag}`,
        requestedDate: today,
        lines: [{ description: `Returned item ${tag}`, quantity: 1 }],
      },
    },
    token,
  )
  return data.createReturnAuthorization
}

export async function approveReturnAuthorizationViaApi(
  request: APIRequestContext,
  token: string,
  id: string,
): Promise<{ id: string; status: string }> {
  const data = await gql<{ approveReturnAuthorization: { id: string; status: string } }>(
    request,
    `mutation($id: ID!) {
      approveReturnAuthorization(id: $id) { id status approvedAt }
    }`,
    { id },
    token,
  )
  return data.approveReturnAuthorization
}

export async function receiveReturnGoodsViaApi(
  request: APIRequestContext,
  token: string,
  returnAuthorizationId: string,
  lines: Array<{ lineId: string; quantityReceived: number }>,
): Promise<{ id: string; status: string; receiptComplete: boolean }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{
    receiveReturnAuthorizationGoods: {
      id: string
      status: string
      receiptComplete: boolean
    }
  }>(
    request,
    `mutation($input: ReceiveReturnAuthorizationGoodsInput!) {
      receiveReturnAuthorizationGoods(input: $input) {
        id status receiptComplete goodsReceivedAt
      }
    }`,
    {
      input: {
        returnAuthorizationId,
        receivedDate: today,
        notes: 'E2E goods received',
        lines,
      },
    },
    token,
  )
  return data.receiveReturnAuthorizationGoods
}
