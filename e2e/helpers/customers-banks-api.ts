import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'
import { ensureCustomer } from './graphql-api'

export { ensureCustomer }

export async function createCustomerDepositViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  customerId: string,
  amount: number,
): Promise<{ depositId: string; depositNumber: string }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{
    createCustomerDeposit: { id: string; depositNumber: string; status: string; amount: number }
  }>(
    request,
    `mutation($input: CreateCustomerDepositInput!) {
      createCustomerDeposit(input: $input) {
        id depositNumber status amount
      }
    }`,
    {
      input: {
        organizationId,
        customerId,
        depositDate: today,
        depositMethod: 'bank_transfer',
        amount,
        notes: 'E2E deposit',
      },
    },
    token,
  )
  return {
    depositId: data.createCustomerDeposit.id,
    depositNumber: data.createCustomerDeposit.depositNumber,
  }
}

export async function createBankAccountViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<{ bankAccountId: string }> {
  const data = await gql<{ createBankAccount: { id: string; accountNumber: string } }>(
    request,
    `mutation($input: BankAccountInput!) {
      createBankAccount(input: $input) { id accountNumber accountName }
    }`,
    {
      input: {
        organizationId,
        accountNumber: `E2E-${tag.slice(-8)}`,
        accountName: `E2E Operating ${tag}`,
        bankName: 'E2E Bank',
        branchName: 'Main',
        accountType: 'checking',
        currency: 'USD',
        openingBalance: 1000,
      },
    },
    token,
  )
  return { bankAccountId: data.createBankAccount.id }
}
