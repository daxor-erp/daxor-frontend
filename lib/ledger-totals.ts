export type ChartAccountLike = {
  accountCode?: string | null
  accountName?: string | null
  accountType?: string | null
  isActive?: boolean | null
}

export type GeneralLedgerRowLike = {
  amount?: number | null
  debitAccount?: string | null
  creditAccount?: string | null
  status?: string | null
}

export type JournalLineLike = {
  accountCode?: string | null
  accountName?: string | null
  debit?: number | null
  credit?: number | null
}

export type JournalEntryLike = {
  status?: string | null
  totalDebit?: number | null
  totalCredit?: number | null
  lines?: JournalLineLike[] | null
}

export function findAccountCodesByRole(
  accounts: ChartAccountLike[],
  role: 'ar' | 'ap',
): Set<string> {
  const def =
    role === 'ar'
      ? { accountType: 'asset', namePatterns: [/accounts receivable/i, /^ar$/i] }
      : { accountType: 'liability', namePatterns: [/accounts payable/i, /^ap$/i] }

  const codes = new Set<string>()
  for (const a of accounts) {
    if (a.isActive === false) continue
    const name = String(a.accountName ?? '')
    const type = String(a.accountType ?? '').toLowerCase()
    const code = String(a.accountCode ?? '').trim()
    if (!code) continue
    if (
      def.namePatterns.some((p) => p.test(name)) &&
      (!def.accountType || type === def.accountType)
    ) {
      codes.add(code)
    }
  }
  return codes
}

function roleNameMatch(name: string, isAr: boolean): boolean {
  if (isAr) return /accounts receivable/i.test(name) || /^ar$/i.test(name)
  return /accounts payable/i.test(name) || /^ap$/i.test(name)
}

function journalLineInRole(line: JournalLineLike, role: 'ar' | 'ap', codes: Set<string>): boolean {
  const code = String(line.accountCode ?? '').trim()
  if (code && codes.has(code)) return true
  const name = String(line.accountName ?? '')
  return roleNameMatch(name, role === 'ar')
}

/**
 * GL table rows are one amount per balanced Dr/Cr pair (same value on both sides).
 * Use journal entries for true line-level debit vs credit totals.
 */
export function summarizeGeneralLedger(
  ledgers: GeneralLedgerRowLike[],
  accounts: ChartAccountLike[],
) {
  const arCodes = findAccountCodesByRole(accounts, 'ar')
  const apCodes = findAccountCodesByRole(accounts, 'ap')

  let ledgerMovement = 0
  let netReceivable = 0
  let netPayable = 0
  let postedCount = 0

  for (const r of ledgers) {
    const amt = Number(r.amount) || 0
    if (String(r.status ?? '').toUpperCase() === 'POSTED' || r.status === 'posted') {
      postedCount += 1
    }
    ledgerMovement += amt

    const debit = String(r.debitAccount ?? '')
    const credit = String(r.creditAccount ?? '')
    if (arCodes.has(debit)) netReceivable += amt
    if (arCodes.has(credit)) netReceivable -= amt
    if (apCodes.has(credit)) netPayable += amt
    if (apCodes.has(debit)) netPayable -= amt
  }

  return {
    transactionCount: ledgers.length,
    postedCount,
    ledgerMovement,
    netReceivable,
    netPayable,
    hasArAccount: arCodes.size > 0,
    hasApAccount: apCodes.size > 0,
  }
}

export function summarizeJournalEntries(
  entries: JournalEntryLike[],
  accounts: ChartAccountLike[],
  opts?: { postedOnly?: boolean },
) {
  const arCodes = findAccountCodesByRole(accounts, 'ar')
  const apCodes = findAccountCodesByRole(accounts, 'ap')
  const postedOnly = opts?.postedOnly !== false

  let journalDebit = 0
  let journalCredit = 0
  let netReceivable = 0
  let netPayable = 0
  let entryCount = 0

  for (const e of entries) {
    if (postedOnly && String(e.status ?? '').toLowerCase() !== 'posted') continue
    entryCount += 1

    for (const line of e.lines ?? []) {
      const d = Number(line.debit) || 0
      const c = Number(line.credit) || 0
      journalDebit += d
      journalCredit += c
      if (journalLineInRole(line, 'ar', arCodes)) netReceivable += d - c
      if (journalLineInRole(line, 'ap', apCodes)) netPayable += c - d
    }
  }

  return {
    entryCount,
    journalDebit,
    journalCredit,
    netReceivable,
    netPayable,
    balanced: Math.abs(journalDebit - journalCredit) < 0.02,
    hasArAccount: arCodes.size > 0,
    hasApAccount: apCodes.size > 0,
  }
}

/** Combined summary for General Ledger page (movement + journal line totals). */
export function summarizeLedgerPage(
  ledgers: GeneralLedgerRowLike[],
  journals: JournalEntryLike[],
  accounts: ChartAccountLike[],
) {
  const gl = summarizeGeneralLedger(ledgers, accounts)
  const je = summarizeJournalEntries(journals, accounts, { postedOnly: true })
  return {
    transactionCount: gl.transactionCount,
    postedCount: gl.postedCount,
    ledgerMovement: gl.ledgerMovement,
    journalDebit: je.journalDebit,
    journalCredit: je.journalCredit,
    journalBalanced: je.balanced,
    netReceivable: je.netReceivable,
    netPayable: je.netPayable,
    hasArAccount: gl.hasArAccount && je.hasArAccount,
    hasApAccount: gl.hasApAccount && je.hasApAccount,
  }
}
