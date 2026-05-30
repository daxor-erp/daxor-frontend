import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createItemViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  rate = 10,
): Promise<string> {
  const data = await gql<{ createItem: { id: string } }>(
    request,
    `mutation($input: CreateItemInput!) {
      createItem(input: $input) { id name }
    }`,
    {
      input: {
        organizationId,
        name,
        unit: 'EA',
        rate,
        status: 'active',
        category: 'inventory',
      },
    },
    token,
  )
  return data.createItem.id
}

export async function createAndConfirmStockAdjustmentViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  itemDescription: string,
  qtyIncrease: number,
): Promise<{ adjustmentId: string; adjNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createStockAdjustment: { id: string; adjNumber: string } }>(
    request,
    `mutation($input: CreateStockAdjustmentInput!) {
      createStockAdjustment(input: $input) { id adjNumber status }
    }`,
    {
      input: {
        organizationId,
        adjDate: today,
        warehouseName: 'MAIN',
        adjustmentType: 'increase',
        reason: 'E2E recount',
        lineItems: [
          {
            itemDescription,
            currentQty: 0,
            adjustedQty: qtyIncrease,
            difference: qtyIncrease,
            unit: 'EA',
          },
        ],
      },
    },
    token,
  )
  const id = created.createStockAdjustment.id
  await gql(
    request,
    `mutation($id: ID!) { confirmStockAdjustment(id: $id) { id status } }`,
    { id },
    token,
  )
  return {
    adjustmentId: id,
    adjNumber: created.createStockAdjustment.adjNumber,
  }
}
