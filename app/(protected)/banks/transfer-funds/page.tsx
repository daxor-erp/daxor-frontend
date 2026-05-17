'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_BANK_ACCOUNTS, GET_CASH_BANKS, TRANSFER_BANK_FUNDS } from '@/gql/queries'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

const REF_MODULE = 'bank_transfer'

type BookRow = {
  id: string
  transactionNumber: string
  transactionDate: string
  transactionType: string
  bankAccount: string
  amount: number
  currency?: string
  description: string
  referenceId: string
  referenceModule?: string
}

export default function TransferFundsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [fromNumber, setFromNumber] = useState('')
  const [toNumber, setToNumber] = useState('')
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const { data: acctData, loading: acctLoading, refetch: refetchAccts } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: txData, loading: txLoading, refetch: refetchTx } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [transfer, { loading: saving }] = useMutation(TRANSFER_BANK_FUNDS, {
    onCompleted: () => {
      setAmount('')
      setDescription('')
      setError('')
      void refetchTx()
    },
    onError: (e) => setError(e.message),
  })

  const bankAccounts = useMemo(
    () => (acctData?.bankAccounts ?? []).filter((a: { isActive?: boolean }) => a.isActive !== false),
    [acctData],
  )

  const fromOptions = useMemo(
    () =>
      bankAccounts
        .filter((a: { accountNumber: string }) => a.accountNumber !== toNumber)
        .map(
          (a: {
            accountNumber: string
            accountName: string
            accountHolder?: string
            bankName: string
            currency?: string
          }) => {
            const holder = (a.accountHolder && a.accountHolder.trim()) || a.accountName
            return {
              value: a.accountNumber,
              label: `${holder} — ${a.bankName} (${a.accountNumber}) · ${a.currency || 'USD'}`,
            }
          },
        ),
    [bankAccounts, toNumber],
  )

  const toOptions = useMemo(
    () =>
      bankAccounts
        .filter((a: { accountNumber: string }) => a.accountNumber !== fromNumber)
        .map(
          (a: {
            accountNumber: string
            accountName: string
            accountHolder?: string
            bankName: string
            currency?: string
          }) => {
            const holder = (a.accountHolder && a.accountHolder.trim()) || a.accountName
            return {
              value: a.accountNumber,
              label: `${holder} — ${a.bankName} (${a.accountNumber}) · ${a.currency || 'USD'}`,
            }
          },
        ),
    [bankAccounts, fromNumber],
  )

  const fromAcct = useMemo(
    () => bankAccounts.find((a: { accountNumber: string }) => a.accountNumber === fromNumber),
    [bankAccounts, fromNumber],
  ) as { currency?: string } | undefined

  const recentTransfers = useMemo(() => {
    const rows = (txData?.cashBanks ?? []) as BookRow[]
    const pairs = new Map<string, BookRow[]>()
    for (const t of rows) {
      if (t.referenceModule !== REF_MODULE) continue
      const id = t.referenceId
      if (!id) continue
      const list = pairs.get(id) ?? []
      list.push(t)
      pairs.set(id, list)
    }
    const list: { ref: string; date: string; fromLine: BookRow; toLine: BookRow }[] = []
    for (const [ref, lines] of pairs) {
      if (lines.length < 2) continue
      const pay = lines.find((l) => l.transactionType === 'payment')
      const rec = lines.find((l) => l.transactionType === 'receipt')
      if (!pay || !rec) continue
      const d = pay.transactionDate || rec.transactionDate
      list.push({ ref, date: d, fromLine: pay, toLine: rec })
    }
    list.sort((a, b) => (b.date > a.date ? 1 : -1))
    return list.slice(0, 25)
  }, [txData])

  const submit = () => {
    setError('')
    if (!fromNumber || !toNumber) {
      setError('Select both from and to accounts.')
      return
    }
    if (fromNumber === toNumber) {
      setError('From and to must be different accounts.')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }
    const cur = (fromAcct?.currency || 'USD').trim() || 'USD'
    transfer({
      variables: {
        input: {
          organizationId: orgId,
          transferDate: new Date(transferDate).toISOString(),
          fromAccountNumber: fromNumber,
          toAccountNumber: toNumber,
          amount: n,
          currency: cur,
          description: description.trim() || 'Inter-account transfer',
          paymentMethod: 'internal_transfer',
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeftRight className="h-8 w-8 text-slate-700" />
          Transfer funds
        </h1>
        <p className="text-gray-500 mt-1">
          Move money from one company bank account to another. This creates a matching payment and receipt in the
          register (same reference for both).
        </p>
      </div>

      {acctLoading && <p className="text-sm text-gray-500">Loading bank accounts…</p>}
      {!acctLoading && orgId && bankAccounts.length < 2 && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          You need at least two active bank accounts to transfer between them. Add accounts under Cash &amp; Bank.
        </p>
      )}

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold">Transfer</div>
        <div className="p-3 space-y-3">
          <table className="w-full border-collapse text-xs min-w-[640px]">
            <tbody>
              <tr>
                <td className={labelCell}>From account</td>
                <td className={`${cell} min-w-[300px]`} colSpan={3}>
                  <SelectFloating
                    label=""
                    value={fromNumber}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setFromNumber(next)
                      setError('')
                    }}
                    options={fromOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>To account</td>
                <td className={`${cell} min-w-[300px]`} colSpan={3}>
                  <SelectFloating
                    label=""
                    value={toNumber}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setToNumber(next)
                      setError('')
                    }}
                    options={toOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Transfer date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Amount</td>
                <td className={`${cell} ${moneyClass} w-40`}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-transparent outline-none font-mono text-right"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Description</td>
                <td className={cell} colSpan={3}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="e.g. Petty cash top-up, sweep to payroll"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-slate-800 hover:bg-slate-900 text-white"
              onClick={submit}
              disabled={saving || !orgId || bankAccounts.length < 2}
            >
              {saving ? 'Recording…' : 'Record transfer'}
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => refetchAccts()}>
              Refresh accounts
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => refetchTx()}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${txLoading ? 'animate-spin' : ''}`} />
              Refresh history
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
        </div>
      </div>

      <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-800">
          Recent inter-account transfers
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[720px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Ref / date</th>
                <th className={`${headerCell} text-left`}>From</th>
                <th className={`${headerCell} text-left`}>To (see paired receipt)</th>
                <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                <th className={`${headerCell} text-left`}>Description</th>
              </tr>
            </thead>
            <tbody>
              {!recentTransfers.length && !txLoading && (
                <tr>
                  <td colSpan={5} className={`${cell} text-center text-gray-500 py-8`}>
                    No transfers yet, or still loading.
                  </td>
                </tr>
              )}
              {txLoading && !recentTransfers.length && (
                <tr>
                  <td colSpan={5} className={`${cell} text-center text-gray-500 py-8`}>
                    Loading…
                  </td>
                </tr>
              )}
              {recentTransfers.map((p) => (
                <tr key={p.fromLine.id} className="hover:bg-gray-50">
                  <td className={`${cell} font-mono`}>
                    <div>{p.fromLine.referenceId}</div>
                    <div className="text-gray-500">
                      {p.fromLine.transactionDate
                        ? formatDate(p.fromLine.transactionDate)
                        : '—'}
                    </div>
                  </td>
                  <td className={cell}>{p.fromLine.bankAccount}</td>
                  <td className={cell}>{p.toLine.bankAccount}</td>
                  <td className={`${cell} ${moneyClass}`}>
                    {p.fromLine.currency ? `${p.fromLine.currency} ` : ''}
                    {formatMoney(Number(p.fromLine.amount ?? 0))}
                  </td>
                  <td className={cell}>{p.fromLine.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
