import { formatMoney } from '@/lib/format-money'

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

const ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'revenue', 'expense', 'other'] as const

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

function accountTypeForLine(
  line: JournalLineLike,
  typeByCode: Map<string, string>,
): string {
  const code = String(line.accountCode ?? '').trim()
  if (code && typeByCode.has(code)) return typeByCode.get(code)!
  const name = String(line.accountName ?? '').toLowerCase()
  if (/revenue/i.test(name)) return 'revenue'
  if (/payable/i.test(name)) return 'liability'
  if (/receivable/i.test(name)) return 'asset'
  if (/expense/i.test(name)) return 'expense'
  if (/cash|bank/i.test(name)) return 'asset'
  return 'other'
}

function emptyByType(): Record<string, number> {
  return Object.fromEntries(ACCOUNT_TYPES.map((t) => [t, 0]))
}

function addToBucket(bucket: Record<string, number>, type: string, amount: number) {
  const key = ACCOUNT_TYPES.includes(type as (typeof ACCOUNT_TYPES)[number]) ? type : 'other'
  bucket[key] = (bucket[key] ?? 0) + amount
}

export function formatTypeBreakdown(byType: Record<string, number>): string {
  const parts = ACCOUNT_TYPES.filter((t) => (byType[t] ?? 0) > 0.009).map(
    (t) => `${t.charAt(0).toUpperCase() + t.slice(1)} ${formatMoney(byType[t])}`,
  )
  return parts.length ? parts.join(' · ') : '—'
}

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
  const typeByCode = new Map<string, string>()
  for (const a of accounts) {
    const code = String(a.accountCode ?? '').trim()
    if (code) typeByCode.set(code, String(a.accountType ?? 'other').toLowerCase())
  }

  const postedOnly = opts?.postedOnly !== false
  const debitByType = emptyByType()
  const creditByType = emptyByType()

  let journalDebit = 0
  let journalCredit = 0
  let entryCount = 0

  for (const e of entries) {
    if (postedOnly && String(e.status ?? '').toLowerCase() !== 'posted') continue
    entryCount += 1

    for (const line of e.lines ?? []) {
      const d = Number(line.debit) || 0
      const c = Number(line.credit) || 0
      const t = accountTypeForLine(line, typeByCode)
      if (d > 0) {
        journalDebit += d
        addToBucket(debitByType, t, d)
      }
      if (c > 0) {
        journalCredit += c
        addToBucket(creditByType, t, c)
      }
    }
  }

  return {
    entryCount,
    journalDebit,
    journalCredit,
    debitByType,
    creditByType,
    balanced: Math.abs(journalDebit - journalCredit) < 0.02,
    hasArAccount: findAccountCodesByRole(accounts, 'ar').size > 0,
    hasApAccount: findAccountCodesByRole(accounts, 'ap').size > 0,
  }
}

export function sumOutstanding(
  rows: Array<{ outstandingAmount?: number | null; status?: string | null }>,
  openStatuses: string[],
): number {
  let total = 0
  for (const r of rows) {
    const st = String(r.status ?? '').toLowerCase()
    if (!openStatuses.includes(st)) continue
    total += Number(r.outstandingAmount) || 0
  }
  return Math.round(total * 100) / 100
}

/** Combined summary for General Ledger page. */
export function summarizeLedgerPage(
  ledgers: GeneralLedgerRowLike[],
  journals: JournalEntryLike[],
  accounts: ChartAccountLike[],
  subledger?: {
    customerInvoices?: Array<{ outstandingAmount?: number | null; status?: string | null }>
    vendorBills?: Array<{ outstandingAmount?: number | null; status?: string | null }>
  },
) {
  const gl = summarizeGeneralLedger(ledgers, accounts)
  const je = summarizeJournalEntries(journals, accounts, { postedOnly: true })

  const openReceivable = sumOutstanding(subledger?.customerInvoices ?? [], [
    'approved',
    'sent',
    'partially_paid',
    'overdue',
  ])
  const openPayable = sumOutstanding(subledger?.vendorBills ?? [], [
    'approved',
    'partially_paid',
  ])

  return {
    transactionCount: gl.transactionCount,
    postedCount: gl.postedCount,
    ledgerMovement: gl.ledgerMovement,
    journalDebit: je.journalDebit,
    journalCredit: je.journalCredit,
    journalBalanced: je.balanced,
    debitByType: je.debitByType,
    creditByType: je.creditByType,
    openReceivable,
    openPayable,
    hasArAccount: gl.hasArAccount,
    hasApAccount: gl.hasApAccount,
  }
}

/** Summary for Make Journal Entries page (includes open AR/AP). */
export function summarizeJournalPage(
  entries: JournalEntryLike[],
  accounts: ChartAccountLike[],
  subledger?: {
    customerInvoices?: Array<{ outstandingAmount?: number | null; status?: string | null }>
    vendorBills?: Array<{ outstandingAmount?: number | null; status?: string | null }>
  },
  opts?: { postedOnly?: boolean },
) {
  const je = summarizeJournalEntries(entries, accounts, opts)
  const openReceivable = sumOutstanding(subledger?.customerInvoices ?? [], [
    'approved',
    'sent',
    'partially_paid',
    'overdue',
  ])
  const openPayable = sumOutstanding(subledger?.vendorBills ?? [], ['approved', 'partially_paid'])

  return {
    entryCount: je.entryCount,
    journalDebit: je.journalDebit,
    journalCredit: je.journalCredit,
    journalBalanced: je.balanced,
    debitByType: je.debitByType,
    creditByType: je.creditByType,
    openReceivable,
    openPayable,
    hasArAccount: je.hasArAccount,
    hasApAccount: je.hasApAccount,
  }
}
