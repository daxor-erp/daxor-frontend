import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createFixedAssetViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<{ id: string; assetCode: string; status: string; bookValue: number }> {
  const today = new Date().toISOString().split('T')[0]
  const code = `FA-${tag.slice(-8)}`.toUpperCase()
  const data = await gql<{
    createFixedAsset: {
      id: string
      assetCode: string
      status: string
      bookValue: number
      acquisitionCost: number
    }
  }>(
    request,
    `mutation($input: CreateFixedAssetInput!) {
      createFixedAsset(input: $input) {
        id assetCode status bookValue acquisitionCost accumulatedDepreciation
      }
    }`,
    {
      input: {
        organizationId,
        assetCode: code,
        name: `E2E Laptop ${tag}`,
        category: 'COMPUTER',
        purchaseDate: today,
        acquisitionCost: 100000,
        salvageValue: 10000,
        usefulLifeMonths: 36,
        depreciationMethod: 'STRAIGHT_LINE',
        status: 'ACTIVE',
        notes: 'E2E fixed asset',
      },
    },
    token,
  )
  return data.createFixedAsset
}

export async function postFixedAssetDepreciationViaApi(
  request: APIRequestContext,
  token: string,
  assetId: string,
): Promise<{ id: string; accumulatedDepreciation: number; bookValue: number }> {
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1)
  const periodEndDate = periodEnd.toISOString().split('T')[0]
  const data = await gql<{
    postFixedAssetDepreciation: {
      id: string
      accumulatedDepreciation: number
      bookValue: number
    }
  }>(
    request,
    `mutation($id: ID!, $input: PostDepreciationInput!) {
      postFixedAssetDepreciation(id: $id, input: $input) {
        id accumulatedDepreciation bookValue status
      }
    }`,
    {
      id: assetId,
      input: { periodEndDate, notes: 'E2E depreciation' },
    },
    token,
  )
  return data.postFixedAssetDepreciation
}
