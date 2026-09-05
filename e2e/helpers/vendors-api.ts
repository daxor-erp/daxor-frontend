import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export type VendorApiResult = {
  id: string
  seqNo?: string | null
  orgApprovalStatus: string
  status: string
}

export async function createVendorViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<VendorApiResult> {
  const data = await gql<{ createVendor: VendorApiResult }>(
    request,
    `mutation($input: CreateVendorInput!) {
      createVendor(input: $input) {
        id seqNo orgApprovalStatus status
      }
    }`,
    {
      input: {
        type: 'company',
        name: `E2E Vendor ${tag}`,
        address: { street: '1 Test Street', city: 'Chennai', zip: '600001', country: 'India' },
        gstTreatment: 'registered_business_regular',
        // Unique per run — GSTIN is unique per org
        gstin: `33ABCDE${tag.replace(/\D/g, '').slice(-4).padStart(4, '0')}F1Z5`,
        pan: `ABCDE${tag.replace(/\D/g, '').slice(-4).padStart(4, '0')}F`,
        phone: '9876543210',
        email: `e2e.vendor.${tag}@example.com`,
        organizationId,
      },
    },
    token,
  )
  return data.createVendor
}

export async function getVendorViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    vendor: {
      id: string
      name: string
      type: string
      gstin?: string | null
      pan?: string | null
      address?: { street?: string | null; city?: string | null; zip?: string | null; country?: string | null } | null
      orgApprovalStatus: string
      status: string
      bankAccounts: Array<{ id: string; accountNumber: string; bankName?: string | null; accountHolder?: string | null }>
    }
  }>(
    request,
    `query($id: ID!) {
      vendor(id: $id) {
        id name type gstin pan
        address { street city zip country }
        orgApprovalStatus status
        bankAccounts { id accountNumber bankName accountHolder }
      }
    }`,
    { id },
    token,
  )
  return data.vendor
}

export async function checkGstinStatusViaApi(request: APIRequestContext, token: string, gstin: string) {
  const data = await gql<{
    checkGstinStatus: { gstin: string; valid: boolean; status: string; message: string; source: string }
  }>(
    request,
    `query($gstin: String!) {
      checkGstinStatus(gstin: $gstin) { gstin valid status message source }
    }`,
    { gstin },
    token,
  )
  return data.checkGstinStatus
}

export async function createTagViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
) {
  const data = await gql<{ createTag: { id: string; name: string; color: string } }>(
    request,
    `mutation($input: CreateTagInput!) {
      createTag(input: $input) { id name color category isActive }
    }`,
    { input: { name, color: '#22c55e', category: 'Vendor Type', organizationId } },
    token,
  )
  return data.createTag
}

export async function createBankViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
) {
  const data = await gql<{ createBank: { id: string; name: string } }>(
    request,
    `mutation($input: CreateBankInput!) {
      createBank(input: $input) { id name bankIdentifierCode }
    }`,
    { input: { name, bankIdentifierCode: 'HDFC0000123', organizationId } },
    token,
  )
  return data.createBank
}

export async function addVendorBankAccountViaApi(
  request: APIRequestContext,
  token: string,
  vendorId: string,
  bankId: string,
  accountNumber: string,
) {
  const data = await gql<{
    addVendorBankAccount: { id: string; bankAccounts: Array<{ id: string; accountNumber: string }> }
  }>(
    request,
    `mutation($vendorId: ID!, $input: VendorBankAccountInput!) {
      addVendorBankAccount(vendorId: $vendorId, input: $input) {
        id
        bankAccounts { id accountNumber bankName accountHolder sendMoney }
      }
    }`,
    { vendorId, input: { accountNumber, bankId, currency: 'INR', sendMoney: true } },
    token,
  )
  return data.addVendorBankAccount
}

/** Gap fix: misc.company free-text field + accounting.invoiceSendingPreference (Customer Invoice section). */
export async function createVendorWithGapFieldsViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
) {
  const data = await gql<{ createVendor: VendorApiResult }>(
    request,
    `mutation($input: CreateVendorInput!) {
      createVendor(input: $input) { id seqNo orgApprovalStatus status }
    }`,
    {
      input: {
        type: 'company',
        name: `E2E GapFields Vendor ${tag}`,
        misc: { company: 'E2E Holdings Group' },
        accounting: { invoiceSendingPreference: 'postal' },
        organizationId,
      },
    },
    token,
  )
  return data.createVendor
}

export async function getVendorGapFieldsViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    vendor: { id: string; misc?: { company?: string | null } | null; accounting?: { invoiceSendingPreference: string } | null }
  }>(
    request,
    `query($id: ID!) {
      vendor(id: $id) {
        id
        misc { company }
        accounting { invoiceSendingPreference }
      }
    }`,
    { id },
    token,
  )
  return data.vendor
}

/** Gap fix: chatter/activity panel — surfaces AuditLog entries (not just approval history). */
export async function getAuditLogsViaApi(request: APIRequestContext, token: string, entityId: string) {
  const data = await gql<{
    auditLogs: { data: Array<{ id: string; action: string; entityType: string; user?: { email?: string | null } | null }> }
  }>(
    request,
    `query($entityType: String!, $entityId: ID!, $limit: Int) {
      auditLogs(entityType: $entityType, entityId: $entityId, limit: $limit) {
        data { id action entityType user { email } }
      }
    }`,
    { entityType: 'VENDOR', entityId, limit: 50 },
    token,
  )
  return data.auditLogs
}

export async function submitVendorForApprovalViaApi(
  request: APIRequestContext,
  token: string,
  vendorId: string,
  assigneeApproverUserIds?: string[],
) {
  const data = await gql<{ submitVendorForApproval: VendorApiResult }>(
    request,
    `mutation($id: ID!, $assigneeApproverUserIds: [ID!]) {
      submitVendorForApproval(id: $id, assigneeApproverUserIds: $assigneeApproverUserIds) {
        id orgApprovalStatus status
      }
    }`,
    { id: vendorId, assigneeApproverUserIds },
    token,
  )
  return data.submitVendorForApproval
}
