import { legacyAccountingRefCandidates } from './accounting-ref'

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
