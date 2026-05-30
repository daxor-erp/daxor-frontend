const DOC_PREFIX_STRIP: Record<string, RegExp> = {
  'AR-INV': /^INV-/i,
  'AR-PAY': /^CPAY-/i,
  'AR-CM': /^CM-/i,
  'AR-RET': /^SALES_RETURN-/i,
  'AP-BILL': /^BILL-/i,
  'AP-PAY': /^PAY-/i,
  'AP-VDN': /^VDN-/i,
  'AP-VC': /^VC-/i,
  'INV-GRN': /^GRN-/i,
  'INV-MRN': /^MRN-/i,
  'INV-SA': /^SA-/i,
  'INV-ST': /^ST-/i,
  'PR-PAY': /^PAYROLL_MANAGEMENT-/i,
  'FA-DEP': /^FA-/i,
  'BNK-TF': /^tf-/i,
  'PRD-COMP': /^PRODUCTION_PLANNING-/i,
}

export function stripDocNumberForAccountingRef(accountingPrefix: string, docNo: string): string {
  const s = String(docNo ?? '').trim()
  if (!s) return s
  const re = DOC_PREFIX_STRIP[accountingPrefix]
  return re ? s.replace(re, '') : s
}

export function formatAccountingRef(accountingPrefix: string, docNo: string): string {
  return `${accountingPrefix}-${stripDocNumberForAccountingRef(accountingPrefix, docNo)}`
}

export function legacyAccountingRefCandidates(
  accountingPrefix: string,
  docNo: string,
  mongoId?: string,
): string[] {
  const safe = String(docNo ?? '').trim()
  const out = new Set<string>()
  if (safe) {
    out.add(formatAccountingRef(accountingPrefix, safe))
    out.add(`${accountingPrefix}-${safe}`)
  }
  if (mongoId) out.add(`${accountingPrefix}-${mongoId}`)
  return [...out]
}
