'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CASH_BANKS, GET_BANK_ACCOUNTS, RECONCILE_CASH_BANK } from '@/gql/queries'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { CheckCircle, ClipboardList, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

type Row = {
  id: string
  transactionNumber: string
  transactionDate: string
  transactionType: string
  bankAccount: string
  amount: number
  currency?: string
  description: string
  paymentMethod: string
  referenceId: string
  referenceModule: string
  reconciliationStatus: string
  reconciliationDate?: string | null
}

export default function ReconcileAccountStatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState('')

  const { data: acctData, loading: acctLoading } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: pendingData, loading: pendingLoading, refetch: refetchPending } = useQuery(
    GET_CASH_BANKS,
    {
      variables: {
        organizationId: orgId,
        reconciliationStatus: 'PENDING',
        bankAccount: accountNumber,
      },
      skip: !orgId || !accountNumber,
    },
  )

  const { data: doneData, loading: doneLoading, refetch: refetchDone } = useQuery(GET_CASH_BANKS, {
    variables: {
      organizationId: orgId,
      reconciliationStatus: 'RECONCILED',
      bankAccount: accountNumber,
    },
    skip: !orgId || !accountNumber,
  })

  const [reconcile, { loading: recOne }] = useMutation(RECONCILE_CASH_BANK, {
    onError: (e) => setError(e.message),
  })

  const bankAccounts = useMemo(
    () => (acctData?.bankAccounts ?? []).filter((a: { isActive?: boolean }) => a.isActive !== false),
    [acctData],
  )

  const bankOptions = useMemo(
    () =>
      bankAccounts.map(
        (a: {
          accountNumber: string
          accountName: string
          accountHolder?: string
          bankName: string
        }) => {
          const holder = (a.accountHolder && a.accountHolder.trim()) || a.accountName
          return {
            value: a.accountNumber,
            label: `${holder} — ${a.accountName} (${a.bankName} · ${a.accountNumber})`,
          }
        },
      ),
    [bankAccounts],
  )

  const selected = useMemo(
    () => bankAccounts.find((a: { accountNumber: string }) => a.accountNumber === accountNumber),
    [bankAccounts, accountNumber],
  ) as { accountHolder?: string; accountName?: string; bankName?: string; currency?: string } | undefined

  const pending: Row[] = useMemo(
    () => (pendingData?.cashBanks ?? []) as Row[],
    [pendingData],
  )
  const done: Row[] = useMemo(() => (doneData?.cashBanks ?? []) as Row[], [doneData])
  const doneRecent = useMemo(() => [...done].sort((a, b) => (b.transactionDate > a.transactionDate ? 1 : -1)).slice(0, 30), [done])

  const refresh = () => {
    setError('')
    void refetchPending()
    void refetchDone()
  }

  const onReconcile = async (id: string) => {
    setError('')
    await reconcile({ variables: { id } })
    await refresh()
  }

  const reconcileAllPending = async () => {
    if (!pending.length) return
    setError('')
    try {
      for (const p of pending) {
        await reconcile({ variables: { id: p.id } })
      }
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reconcile failed')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-slate-700" />
          Reconcile account statement
        </h1>
        <p className="text-gray-500 mt-1">
          Match register lines to your bank statement. Mark items as reconciled when they appear on the statement.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Account &amp; period</span>
          <span className="opacity-90">
            {selected ? (selected.accountHolder || selected.accountName) : '—'}
          </span>
        </div>
        <div className="p-3">
          <table className="w-full border-collapse text-xs min-w-[480px]">
            <tbody>
              <tr>
                <td className={labelCell}>Account holder &amp; account</td>
                <td className={`${cell} min-w-[360px]`} colSpan={2}>
                  <SelectFloating
                    label=""
                    value={accountNumber}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setAccountNumber(next)
                      setError('')
                    }}
                    options={bankOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {acctLoading && <p className="text-xs text-gray-500 mt-2">Loading bank accounts…</p>}
        </div>
      </div>

      {!accountNumber && orgId && !acctLoading && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Select a bank account to load unreconciled and reconciled register lines.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
      )}

      {accountNumber && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => refresh()}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1 ${pendingLoading || doneLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            {pending.length > 0 && (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-slate-800 hover:bg-slate-900"
                onClick={() => {
                  if (confirm(`Mark all ${pending.length} pending line(s) as reconciled?`)) {
                    void reconcileAllPending()
                  }
                }}
                disabled={recOne}
              >
                Reconcile all pending
              </Button>
            )}
          </div>

          <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
            <div className="px-3 py-2 bg-amber-50 border-b border-amber-200 text-sm font-semibold text-amber-950">
              Pending reconciliation ({pending.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs min-w-[900px]">
                <thead>
                  <tr>
                    <th className={`${headerCell} text-left`}>#</th>
                    <th className={`${headerCell} text-left`}>Date</th>
                    <th className={`${headerCell} text-left`}>Type</th>
                    <th className={`${headerCell} text-left`}>Description</th>
                    <th className={`${headerCell} text-left`}>Ref</th>
                    <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                    <th className={`${headerCell} text-center w-32`} />
                  </tr>
                </thead>
                <tbody>
                  {!pending.length && !pendingLoading && (
                    <tr>
                      <td colSpan={7} className={`${cell} text-center text-gray-500 py-8`}>
                        No pending lines for this account.
                      </td>
                    </tr>
                  )}
                  {pendingLoading && (
                    <tr>
                      <td colSpan={7} className={`${cell} text-center text-gray-500 py-8`}>
                        Loading…
                      </td>
                    </tr>
                  )}
                  {pending.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className={`${cell} font-mono`}>{d.transactionNumber}</td>
                      <td className={`${cell} font-mono`}>
                        {d.transactionDate ? formatDate(d.transactionDate) : '—'}
                      </td>
                      <td className={cell}>{d.transactionType}</td>
                      <td className={cell}>{d.description}</td>
                      <td className={`${cell} font-mono`}>
                        {d.referenceModule} / {d.referenceId}
                      </td>
                      <td className={`${cell} ${moneyClass}`}>
                        {d.currency ? `${d.currency} ` : ''}
                        {formatMoney(Number(d.amount ?? 0))}
                      </td>
                      <td className={`${cell} text-center`}>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px]"
                          disabled={recOne}
                          onClick={() => onReconcile(d.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Reconciled
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-800">
              Recently reconciled (last 30)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs min-w-[800px]">
                <thead>
                  <tr>
                    <th className={`${headerCell} text-left`}>#</th>
                    <th className={`${headerCell} text-left`}>Date</th>
                    <th className={`${headerCell} text-left`}>Description</th>
                    <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                    <th className={`${headerCell} text-left`}>Reconciled</th>
                  </tr>
                </thead>
                <tbody>
                  {!doneRecent.length && !doneLoading && (
                    <tr>
                      <td colSpan={5} className={`${cell} text-center text-gray-500 py-6`}>
                        No reconciled items yet.
                      </td>
                    </tr>
                  )}
                  {doneLoading && !doneRecent.length && (
                    <tr>
                      <td colSpan={5} className={`${cell} text-center text-gray-500 py-6`}>
                        Loading…
                      </td>
                    </tr>
                  )}
                  {doneRecent.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className={`${cell} font-mono`}>{d.transactionNumber}</td>
                      <td className={`${cell} font-mono`}>
                        {d.transactionDate ? formatDate(d.transactionDate) : '—'}
                      </td>
                      <td className={cell}>{d.description}</td>
                      <td className={`${cell} ${moneyClass} text-slate-800`}>
                        {d.currency ? `${d.currency} ` : ''}
                        {formatMoney(Number(d.amount ?? 0))}
                      </td>
                      <td className={`${cell} font-mono`}>
                        {d.reconciliationDate
                          ? new Date(d.reconciliationDate).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
