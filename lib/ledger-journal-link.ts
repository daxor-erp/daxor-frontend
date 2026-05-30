import { legacyAccountingRefCandidates, formatAccountingRef } from './accounting-ref'

/** Map a general-ledger row to its posted journal entry (AR-INV, AR-PAY, etc.). */
export function resolveJournalForLedger(
  ledger: {
    referenceModule?: string | null
    referenceId?: string | null
    description?: string | null
  },
  journalEntries: Array<{
    id: string
    entryNumber?: string | null
    referenceNumber?: string | null
  }>,
): { id: string; entryNumber: string } | null {
  const mod = String(ledger.referenceModule ?? '')
  const refId = String(ledger.referenceId ?? '').trim()
  const desc = String(ledger.description ?? '')

  const refCandidates: string[] = []

  if (mod === 'customer_invoice') {
    const invFromGl = desc.match(/Invoice\s+(\S+)/i)?.[1]
    if (invFromGl) refCandidates.push(...legacyAccountingRefCandidates('AR-INV', invFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AR-INV', '', refId))
  } else if (mod === 'customer_payment') {
    const payFromGl = desc.match(/Customer payment\s+(\S+)/i)?.[1]
    if (payFromGl) refCandidates.push(...legacyAccountingRefCandidates('AR-PAY', payFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AR-PAY', '', refId))
  } else if (mod === 'vendor_bill') {
    const billFromGl = desc.match(/Vendor bill\s+(\S+)/i)?.[1]
    if (billFromGl) refCandidates.push(...legacyAccountingRefCandidates('AP-BILL', billFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AP-BILL', '', refId))
  } else if (mod === 'vendor_payment') {
    const payFromGl = desc.match(/Vendor payment\s+(\S+)/i)?.[1]
    if (payFromGl) refCandidates.push(...legacyAccountingRefCandidates('AP-PAY', payFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AP-PAY', '', refId))
  } else if (mod === 'sales_return') {
    const docFromGl = desc.match(/Sales return\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('AR-RET', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AR-RET', '', refId))
  } else if (mod === 'vendor_credit') {
    const docFromGl = desc.match(/Vendor credit\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('AP-VC', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AP-VC', '', refId))
  } else if (mod === 'grn') {
    const docFromGl = desc.match(/GRN\s+(\S+)/i)?.[1] ?? desc.match(/GRN receipt\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('INV-GRN', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('INV-GRN', '', refId))
  } else if (mod === 'material_receipt') {
    const docFromGl = desc.match(/Material receipt\s+(\S+)/i)?.[1] ?? desc.match(/MRN\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('INV-MRN', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('INV-MRN', '', refId))
  } else if (mod === 'stock_adjustment') {
    const docFromGl = desc.match(/Stock adjustment\s+(\S+)/i)?.[1] ?? desc.match(/Stock adj\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('INV-SA', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('INV-SA', '', refId))
  } else if (mod === 'payroll_run') {
    const docFromGl = desc.match(/Payroll\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('PR-PAY', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('PR-PAY', '', refId))
  } else if (mod === 'stock_transfer') {
    const docFromGl = desc.match(/Stock transfer\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('INV-ST', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('INV-ST', '', refId))
  } else if (mod === 'vendor_debit_note') {
    const docFromGl = desc.match(/Vendor debit note\s+(\S+)/i)?.[1] ?? desc.match(/Debit note\s+(\S+)/i)?.[1]
    if (docFromGl) refCandidates.push(...legacyAccountingRefCandidates('AP-VDN', docFromGl, refId))
    else if (refId) refCandidates.push(...legacyAccountingRefCandidates('AP-VDN', '', refId))
  } else if (mod === 'bank_transfer') {
    if (refId) refCandidates.push(formatAccountingRef('BNK-TF', refId), `BNK-TF-${refId}`)
  }

  for (const ref of refCandidates) {
    const je = journalEntries.find(
      (e) => e.entryNumber === ref || e.referenceNumber === ref,
    )
    if (je?.id) {
      return { id: String(je.id), entryNumber: String(je.entryNumber || ref) }
    }
  }
  return null
}
