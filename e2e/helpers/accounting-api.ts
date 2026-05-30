import { expect } from '@playwright/test'
import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'
import { legacyAccountingRefCandidates } from '../../lib/accounting-ref'

export type JournalEntryRow = {
  id: string
  entryNumber: string
  referenceNumber?: string | null
  description: string
  status: string
  totalDebit: number
  totalCredit: number
  lines: Array<{ accountName: string; debit: number; credit: number }>
}

export type GeneralLedgerRow = {
  id: string
  transactionType: string
  referenceModule: string
  referenceId: string
  description: string
  amount: number
  debitAccount: string
  creditAccount: string
  status: string
}

export async function fetchJournalEntries(
  request: APIRequestContext,
  token: string,
  organizationId: string,
): Promise<JournalEntryRow[]> {
  const data = await gql<{ journalEntries: JournalEntryRow[] }>(
    request,
    `query($organizationId: String!) {
      journalEntries(organizationId: $organizationId) {
        id entryNumber referenceNumber description status totalDebit totalCredit
        lines { accountName debit credit }
      }
    }`,
    { organizationId },
    token,
  )
  return data.journalEntries
}

export async function fetchGeneralLedgers(
  request: APIRequestContext,
  token: string,
  organizationId: string,
): Promise<GeneralLedgerRow[]> {
  const data = await gql<{ generalLedgers: GeneralLedgerRow[] }>(
    request,
    `query($organizationId: String!) {
      generalLedgers(organizationId: $organizationId) {
        id transactionType referenceModule referenceId description amount
        debitAccount creditAccount status
      }
    }`,
    { organizationId },
    token,
  )
  return data.generalLedgers
}

function findJournalByRef(entries: JournalEntryRow[], ref: string) {
  return entries.find(
    (e) => e.referenceNumber === ref || e.entryNumber === ref,
  )
}

function findJournalByRefs(entries: JournalEntryRow[], refs: string[]) {
  for (const ref of refs) {
    const je = findJournalByRef(entries, ref)
    if (je) return { je, ref }
  }
  return null
}

/** Backend: invoice approval → AR-INV journal (Dr AR, Cr Revenue) + GL. */
export async function assertInvoiceRevenuePosted(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  invoiceId: string,
) {
  const inv = await gql<{
    customerinvoice: { seqNo?: string }
  }>(
    request,
    `query($id: ID!) { customerinvoice(id: $id) { seqNo } }`,
    { id: invoiceId },
    token,
  )
  const invNo = String(inv.customerinvoice?.seqNo || '').trim() || invoiceId
  const refs = legacyAccountingRefCandidates('AR-INV', invNo, invoiceId)
  const entries = await fetchJournalEntries(request, token, organizationId)
  const found = findJournalByRefs(entries, refs)
  expect(found, `Journal entry missing (tried ${refs.join(', ')})`).toBeTruthy()
  const je = found!.je
  const ref = found!.ref
  expect(je, `Journal entry ${ref} missing`).toBeTruthy()
  expect(je!.status).toBe('posted')
  expect(je!.totalDebit).toBeCloseTo(je!.totalCredit, 2)
  expect(je!.totalDebit).toBeGreaterThan(0)

  const arDebit = je!.lines.some(
    (l) => l.debit > 0 && /receivable/i.test(l.accountName),
  )
  const revenueCredit = je!.lines.some(
    (l) => l.credit > 0 && /revenue/i.test(l.accountName),
  )
  expect(arDebit, 'Expected Dr Accounts Receivable line').toBe(true)
  expect(revenueCredit, 'Expected Cr Revenue line').toBe(true)

  const gls = await fetchGeneralLedgers(request, token, organizationId)
  const glRows = gls.filter(
    (g) => g.referenceModule === 'customer_invoice' && g.referenceId === invoiceId,
  )
  expect(glRows.length, 'Expected GL rows for customer_invoice').toBeGreaterThan(0)
  expect(glRows.some((g) => g.transactionType === 'CUSTOMER_INVOICE')).toBe(true)

  return { ref, journal: je!, glCount: glRows.length }
}

/** Backend: customer payment → AR-PAY journal (Dr Cash, Cr AR) + GL. */
export async function assertCustomerPaymentPosted(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  paymentId: string,
) {
  const pay = await gql<{
    customerPayment: { paymentNumber?: string }
  }>(
    request,
    `query($id: ID!) { customerPayment(id: $id) { paymentNumber } }`,
    { id: paymentId },
    token,
  )
  const payNo = String(pay.customerPayment?.paymentNumber || '').trim() || paymentId
  const refs = legacyAccountingRefCandidates('AR-PAY', payNo, paymentId)
  const entries = await fetchJournalEntries(request, token, organizationId)
  const found = findJournalByRefs(entries, refs)
  expect(found, `Journal entry missing (tried ${refs.join(', ')})`).toBeTruthy()
  const je = found!.je
  const ref = found!.ref
  expect(je, `Journal entry ${ref} missing`).toBeTruthy()
  expect(je!.status).toBe('posted')
  expect(je!.totalDebit).toBeCloseTo(je!.totalCredit, 2)

  const cashDebit = je!.lines.some(
    (l) => l.debit > 0 && /cash/i.test(l.accountName),
  )
  const arCredit = je!.lines.some(
    (l) => l.credit > 0 && /receivable/i.test(l.accountName),
  )
  expect(cashDebit, 'Expected Dr Cash line').toBe(true)
  expect(arCredit, 'Expected Cr AR line').toBe(true)

  const gls = await fetchGeneralLedgers(request, token, organizationId)
  const glRows = gls.filter(
    (g) => g.referenceModule === 'customer_payment' && g.referenceId === paymentId,
  )
  expect(glRows.length, 'Expected GL rows for customer_payment').toBeGreaterThan(0)

  return { ref, journal: je!, glCount: glRows.length }
}

/** Backend: vendor bill approval → AP-BILL journal (Dr Expense, Cr AP) + GL. */
export async function assertVendorBillPosted(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  billId: string,
) {
  const bill = await gql<{ vendorBill: { billNumber?: string } }>(
    request,
    `query($id: ID!) { vendorBill(id: $id) { billNumber } }`,
    { id: billId },
    token,
  )
  const billNo = String(bill.vendorBill?.billNumber || '').trim() || billId
  const refs = legacyAccountingRefCandidates('AP-BILL', billNo, billId)
  const entries = await fetchJournalEntries(request, token, organizationId)
  const found = findJournalByRefs(entries, refs)
  expect(found, `Journal entry missing (tried ${refs.join(', ')})`).toBeTruthy()
  const je = found!.je
  const ref = found!.ref
  expect(je!.status).toBe('posted')
  expect(je!.totalDebit).toBeCloseTo(je!.totalCredit, 2)

  const expenseDebit = je!.lines.some(
    (l) => l.debit > 0 && /expense/i.test(l.accountName),
  )
  const apCredit = je!.lines.some(
    (l) => l.credit > 0 && /payable/i.test(l.accountName),
  )
  expect(expenseDebit, 'Expected Dr Expense line').toBe(true)
  expect(apCredit, 'Expected Cr Accounts Payable line').toBe(true)

  const gls = await fetchGeneralLedgers(request, token, organizationId)
  const glRows = gls.filter(
    (g) => g.referenceModule === 'vendor_bill' && g.referenceId === billId,
  )
  expect(glRows.length).toBeGreaterThan(0)
  expect(glRows.some((g) => g.transactionType === 'VENDOR_BILL')).toBe(true)

  return { ref, journal: je!, glCount: glRows.length }
}

/** Backend: vendor payment → AP-PAY journal (Dr AP, Cr Cash) + GL. */
export async function assertVendorPaymentPosted(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  paymentId: string,
) {
  const pay = await gql<{ vendorPayment: { paymentNumber?: string } }>(
    request,
    `query($id: ID!) { vendorPayment(id: $id) { paymentNumber } }`,
    { id: paymentId },
    token,
  )
  const payNo = String(pay.vendorPayment?.paymentNumber || '').trim() || paymentId
  const refs = legacyAccountingRefCandidates('AP-PAY', payNo, paymentId)
  const entries = await fetchJournalEntries(request, token, organizationId)
  const found = findJournalByRefs(entries, refs)
  expect(found, `Journal entry missing (tried ${refs.join(', ')})`).toBeTruthy()
  const je = found!.je
  const ref = found!.ref
  expect(je!.status).toBe('posted')

  const apDebit = je!.lines.some(
    (l) => l.debit > 0 && /payable/i.test(l.accountName),
  )
  const cashCredit = je!.lines.some(
    (l) => l.credit > 0 && /cash/i.test(l.accountName),
  )
  expect(apDebit, 'Expected Dr AP line').toBe(true)
  expect(cashCredit, 'Expected Cr Cash line').toBe(true)

  const gls = await fetchGeneralLedgers(request, token, organizationId)
  const glRows = gls.filter(
    (g) => g.referenceModule === 'vendor_payment' && g.referenceId === paymentId,
  )
  expect(glRows.length).toBeGreaterThan(0)

  return { ref, journal: je!, glCount: glRows.length }
}
