import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'
import { createItemViaApi } from './inventory-flow-api'

export async function createActiveBomViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
  parentItemId: string,
  parentItemName: string,
): Promise<{ bomId: string; bomCode: string }> {
  const data = await gql<{ createBillOfMaterials: { id: string; bomCode: string; status: string } }>(
    request,
    `mutation($input: CreateBOMInput!) {
      createBillOfMaterials(input: $input) { id bomCode status totalCost }
    }`,
    {
      input: {
        organizationId,
        parentItemId,
        parentItemName,
        bomCode: `BOM-E2E-${tag}`,
        version: '1',
        quantityProduced: 1,
        unit: 'EA',
        status: 'ACTIVE',
        laborCost: 50,
        overheadCost: 25,
        components: [
          {
            itemName: `Component ${tag}`,
            quantity: 2,
            unit: 'EA',
            scrapPercent: 0,
            standardCost: 15,
          },
        ],
      },
    },
    token,
  )
  return { bomId: data.createBillOfMaterials.id, bomCode: data.createBillOfMaterials.bomCode }
}

export async function createAndCompleteProductionPlanViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
  actualCost: number,
): Promise<{ planId: string; docNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const created = await gql<{ createProductionPlanning: { id: string; docNumber: string } }>(
    request,
    `mutation($input: ProductionPlanningInput!) {
      createProductionPlanning(input: $input) { id docNumber status }
    }`,
    {
      input: {
        organizationId,
        docDate: today,
        budget: actualCost,
        status: 'draft',
        tasks: [
          {
            name: `E2E task ${tag}`,
            status: 'completed',
            priority: 'medium',
          },
        ],
      },
    },
    token,
  )
  const id = created.createProductionPlanning.id
  const updated = await gql<{ updateProductionPlanning: { id: string; docNumber: string; status: string } }>(
    request,
    `mutation($id: ID!, $input: ProductionPlanningInput!) {
      updateProductionPlanning(id: $id, input: $input) { id docNumber status }
    }`,
    {
      id,
      input: {
        organizationId,
        docDate: today,
        status: 'completed',
        actualCost,
        progress: 100,
      },
    },
    token,
  )
  return {
    planId: id,
    docNumber: updated.updateProductionPlanning.docNumber || created.createProductionPlanning.docNumber,
  }
}

export async function ensureProductionItem(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
) {
  return createItemViaApi(request, token, organizationId, name, 100)
}
