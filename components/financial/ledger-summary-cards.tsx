'use client'

import { formatMoney } from '@/lib/format-money'
import { formatTypeBreakdown } from '@/lib/ledger-totals'
import { ArrowDownLeft, ArrowUpRight, Scale, Wallet, Landmark, Layers } from 'lucide-react'

export type LedgerSummary = {
  transactionCount?: number
  entryCount?: number
  postedCount?: number
  ledgerMovement?: number
  journalDebit?: number
  journalCredit?: number
  journalBalanced?: boolean
  debitByType?: Record<string, number>
  creditByType?: Record<string, number>
  openReceivable?: number
  openPayable?: number
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

  const journalDebit = summary.journalDebit ?? 0
  const journalCredit = summary.journalCredit ?? 0
  const movement = summary.ledgerMovement ?? 0
  const debitBreakdown = formatTypeBreakdown(summary.debitByType ?? {})
  const creditBreakdown = formatTypeBreakdown(summary.creditByType ?? {})
  const totalsMatch = Math.abs(journalDebit - journalCredit) < 0.02

  if (variant === 'journal') {
    const cards = [
      {
        label: countLabel,
        value: String(count),
        sub: 'All entries in list',
        icon: Scale,
        cls: 'text-slate-600 bg-slate-50',
      },
      {
        label: totalsMatch ? 'Balanced activity' : 'Total debits',
        value: formatMoney(journalDebit),
        sub: totalsMatch
          ? `Credits match (double-entry) · ${debitBreakdown}`
          : debitBreakdown,
        icon: ArrowDownLeft,
        cls: 'text-blue-600 bg-blue-50',
      },
      ...(totalsMatch
        ? []
        : [
            {
              label: 'Total credits',
              value: formatMoney(journalCredit),
              sub: creditBreakdown,
              icon: ArrowUpRight,
              cls: 'text-indigo-600 bg-indigo-50',
            },
          ]),
      {
        label: 'Open receivable',
        value: formatMoney(summary.openReceivable ?? 0),
        sub: 'Unpaid customer invoices',
        icon: Wallet,
        cls: 'text-emerald-600 bg-emerald-50',
      },
      {
        label: 'Open payable',
        value: formatMoney(summary.openPayable ?? 0),
        sub: 'Unpaid vendor bills',
        icon: Landmark,
        cls: 'text-amber-600 bg-amber-50',
      },
    ]
    return <CardGrid cards={cards} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
  }

  const cards = [
    {
      label: countLabel,
      value: String(count),
      sub: summary.postedCount != null ? `${summary.postedCount} posted GL rows` : undefined,
      icon: Scale,
      cls: 'text-slate-600 bg-slate-50',
    },
    {
      label: 'GL movement',
      value: formatMoney(movement),
      sub: 'One amount per row (Dr and Cr are paired)',
      icon: Layers,
      cls: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Debit side (journal)',
      value: formatMoney(journalDebit),
      sub: debitBreakdown,
      icon: ArrowDownLeft,
      cls: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Credit side (journal)',
      value: formatMoney(journalCredit),
      sub: totalsMatch
        ? `Equals debits (balanced books) · ${creditBreakdown}`
        : creditBreakdown,
      icon: ArrowUpRight,
      cls: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Open receivable',
      value: formatMoney(summary.openReceivable ?? 0),
      sub: summary.hasArAccount ? 'Subledger: unpaid invoices' : 'No AR in chart',
      icon: Wallet,
      cls: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Open payable',
      value: formatMoney(summary.openPayable ?? 0),
      sub: summary.hasApAccount ? 'Subledger: unpaid vendor bills' : 'No AP in chart',
      icon: Landmark,
      cls: 'text-amber-600 bg-amber-50',
    },
  ]

  return <CardGrid cards={cards} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
}

function CardGrid({
  cards,
  cols,
}: {
  cards: Array<{
    label: string
    value: string
    sub?: string
    icon: typeof Scale
    cls: string
  }>
  cols: string
}) {
  return (
    <div className={`grid gap-3 ${cols}`}>
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
