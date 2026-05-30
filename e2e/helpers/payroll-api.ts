import type { APIRequestContext } from '@playwright/test'
import { gql, approveEntityViaApi } from './graphql-api'

export async function createPayrollRunViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<{ payrollRunId: string; docNumber: string }> {
  const start = new Date()
  start.setDate(1)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
  const toIso = (d: Date) => d.toISOString().split('T')[0]

  const data = await gql<{ createPayrollManagement: { id: string; docNumber: string } }>(
    request,
    `mutation($input: PayrollManagementInput!) {
      createPayrollManagement(input: $input) { id docNumber status }
    }`,
    {
      input: {
        organizationId,
        docDate: toIso(new Date()),
        title: `E2E Payroll ${tag}`,
        payPeriodStart: toIso(start),
        payPeriodEnd: toIso(end),
        status: 'DRAFT',
      },
    },
    token,
  )
  return {
    payrollRunId: data.createPayrollManagement.id,
    docNumber: data.createPayrollManagement.docNumber,
  }
}

export async function submitAndApprovePayrollViaApi(
  request: APIRequestContext,
  token: string,
  payrollRunId: string,
) {
  await gql(
    request,
    `mutation($id: ID!) { submitPayrollManagementForApproval(id: $id) { id status } }`,
    { id: payrollRunId },
    token,
  )
  await approveEntityViaApi(request, token, payrollRunId, 'payroll run')
}

export async function computePayrollRunViaApi(
  request: APIRequestContext,
  token: string,
  payrollRunId: string,
): Promise<number> {
  const data = await gql<{ computePayrollRun: Array<{ id: string }> }>(
    request,
    `mutation($payrollRunId: ID!) {
      computePayrollRun(payrollRunId: $payrollRunId) { id netPay }
    }`,
    { payrollRunId },
    token,
  )
  return data.computePayrollRun.length
}
