'use client'

import { formatMoney } from '@/lib/format-money'
import { ArrowDownLeft, ArrowUpRight, Scale, Wallet, Landmark, Layers } from 'lucide-react'

export type LedgerSummary = {
  transactionCount?: number
  entryCount?: number
  postedCount?: number
  ledgerMovement?: number
  journalDebit?: number
  journalCredit?: number
  journalBalanced?: boolean
  /** @deprecated use ledgerMovement / journalDebit */
  totalDebit?: number
  /** @deprecated use journalCredit */
  totalCredit?: number
  netReceivable: number
  netPayable: number
  hasArAccount?: boolean
  hasApAccount?: boolean
}

export function LedgerSummaryCards({
  summary,
  variant = 'ledger',
}: {
  summary: LedgerSummary
  variant?: 'ledger' | 'journal'
}) {
  const countLabel = variant === 'journal' ? 'Posted entries' : 'GL transactions'
  const count =
    variant === 'journal'
      ? summary.entryCount ?? 0
      : summary.transactionCount ?? 0

  const journalDebit = summary.journalDebit ?? summary.totalDebit ?? 0
  const journalCredit = summary.journalCredit ?? summary.totalCredit ?? 0
  const movement = summary.ledgerMovement ?? summary.totalDebit ?? 0

  const cards =
    variant === 'ledger'
      ? [
          {
            label: countLabel,
            value: String(count),
            sub:
              summary.postedCount != null ? `${summary.postedCount} posted rows` : undefined,
            icon: Scale,
            cls: 'text-slate-600 bg-slate-50',
          },
          {
            label: 'GL movement',
            value: formatMoney(movement),
            sub: 'Sum of paired Dr/Cr amounts (equal on both sides per row)',
            icon: Layers,
            cls: 'text-violet-600 bg-violet-50',
          },
          {
            label: 'Journal debits',
            value: formatMoney(journalDebit),
            sub: 'Sum of all posted journal line debits',
            icon: ArrowDownLeft,
            cls: 'text-blue-600 bg-blue-50',
          },
          {
            label: 'Journal credits',
            value: formatMoney(journalCredit),
            sub: summary.journalBalanced === false ? 'Out of balance' : 'Should match debits when balanced',
            icon: ArrowUpRight,
            cls: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Accounts receivable',
            value: formatMoney(summary.netReceivable),
            sub: summary.hasArAccount ? 'Net AR from journal lines' : 'No AR account in chart',
            icon: Wallet,
            cls: 'text-emerald-600 bg-emerald-50',
          },
          {
            label: 'Accounts payable',
            value: formatMoney(summary.netPayable),
            sub: summary.hasApAccount ? 'Net AP from journal lines' : 'No AP account in chart',
            icon: Landmark,
            cls: 'text-amber-600 bg-amber-50',
          },
        ]
      : [
          {
            label: countLabel,
            value: String(count),
            sub: 'All entries in list',
            icon: Scale,
            cls: 'text-slate-600 bg-slate-50',
          },
          {
            label: 'Total debits',
            value: formatMoney(journalDebit),
            sub: 'Sum of line debits',
            icon: ArrowDownLeft,
            cls: 'text-blue-600 bg-blue-50',
          },
          {
            label: 'Total credits',
            value: formatMoney(journalCredit),
            sub: summary.journalBalanced === false ? 'Not balanced' : 'Balanced entries',
            icon: ArrowUpRight,
            cls: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Accounts receivable',
            value: formatMoney(summary.netReceivable),
            sub: summary.hasArAccount ? 'Net AR lines' : 'No AR account',
            icon: Wallet,
            cls: 'text-emerald-600 bg-emerald-50',
          },
          {
            label: 'Accounts payable',
            value: formatMoney(summary.netPayable),
            sub: summary.hasApAccount ? 'Net AP lines' : 'No AP account',
            icon: Landmark,
            cls: 'text-amber-600 bg-amber-50',
          },
        ]

  return (
    <div
      className={`grid gap-3 ${
        variant === 'ledger'
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      }`}
    >
      {cards.map(({ label, value, sub, icon: Icon, cls }) => (
        <div
          key={label}
          className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3 shadow-sm"
        >
          <div className={`p-2 rounded-md shrink-0 ${cls.split(' ')[1]}`}>
            <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-base font-bold text-gray-800 tabular-nums truncate">{value}</p>
            {sub && <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
