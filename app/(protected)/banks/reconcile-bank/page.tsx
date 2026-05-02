'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_BANK_ACCOUNTS,
  GET_CASH_BANKS,
  GET_BANK_STATEMENT_LINES,
  CREATE_BANK_STATEMENT_LINE,
  DELETE_BANK_STATEMENT_LINE,
  MATCH_BANK_STATEMENT_LINE,
} from '@/gql/queries'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { FileText, Link2, RefreshCw, Trash2 } from 'lucide-react'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

const TOL = 0.01

function signedBook(t: { transactionType: string; amount: number }): number {
  const ty = (t.transactionType || '').toLowerCase()
  if (ty === 'payment' || ty === 'payout' || ty === 'withdrawal' || ty === 'fee') {
    return -Math.abs(Number(t.amount ?? 0))
  }
  return Math.abs(Number(t.amount ?? 0))
}

function signedLine(line: { lineKind: string; amount: number }): number {
  return line.lineKind === 'debit' ? -Math.abs(Number(line.amount ?? 0)) : Math.abs(Number(line.amount ?? 0))
}

type BankLine = {
  id: string
  lineDate: string
  amount: number
  lineKind: string
  description: string
  bankReference?: string | null
  isMatched: boolean
  matchedCashBankId?: string | null
}

type BookLine = {
  id: string
  transactionNumber: string
  transactionDate: string
  transactionType: string
  amount: number
  description: string
}

export default function ReconcileBankStatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState('')

  const [lineDate, setLineDate] = useState(() => new Date().toISOString().split('T')[0])
  const [lineKind, setLineKind] = useState<'credit' | 'debit'>('credit')
  const [lineAmount, setLineAmount] = useState('')
  const [lineDesc, setLineDesc] = useState('')
  const [lineRef, setLineRef] = useState('')

  const [linkByBankLine, setLinkByBankLine] = useState<Record<string, string>>({})

  const { data: acctData, loading: acctLoading } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: stmtData, loading: stmtLoading, refetch: refetchStmt } = useQuery(GET_BANK_STATEMENT_LINES, {
    variables: { organizationId: orgId, bankAccount: accountNumber, onlyUnmatched: false },
    skip: !orgId || !accountNumber,
  })

  const { data: bookData, loading: bookLoading, refetch: refetchBook } = useQuery(GET_CASH_BANKS, {
    variables: {
      organizationId: orgId,
      reconciliationStatus: 'PENDING',
      bankAccount: accountNumber,
    },
    skip: !orgId || !accountNumber,
  })

  const [createLine, { loading: creating }] = useMutation(CREATE_BANK_STATEMENT_LINE, {
    onCompleted: () => {
      setLineAmount('')
      setLineDesc('')
      setLineRef('')
      setError('')
      void refetchStmt()
    },
    onError: (e) => setError(e.message),
  })

  const [removeLine] = useMutation(DELETE_BANK_STATEMENT_LINE, {
    onCompleted: () => {
      setError('')
      void refetchStmt()
    },
    onError: (e) => setError(e.message),
  })

  const [matchLine, { loading: matching }] = useMutation(MATCH_BANK_STATEMENT_LINE, {
    onCompleted: () => {
      setError('')
      void refetchStmt()
      void refetchBook()
    },
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

  const bankLines: BankLine[] = useMemo(() => (stmtData?.bankStatementLines ?? []) as BankLine[], [stmtData])
  const unmatchedBank = useMemo(() => bankLines.filter((l) => !l.isMatched), [bankLines])
  const matchedBank = useMemo(() => bankLines.filter((l) => l.isMatched).slice(0, 40), [bankLines])

  const bookPending: BookLine[] = useMemo(() => (bookData?.cashBanks ?? []) as BookLine[], [bookData])

  const bookOptionsFor = (bl: BankLine) => {
    const sl = signedLine(bl)
    return bookPending
      .filter((b) => Math.abs(signedBook(b) - sl) <= TOL)
      .map((b) => ({
        value: b.id,
        label: `${b.transactionNumber} · ${b.transactionType} · ${formatMoney(Math.abs(Number(b.amount)))}`,
      }))
  }

  const addStatementLine = () => {
    setError('')
    const n = parseFloat(lineAmount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid positive amount.')
      return
    }
    if (!lineDesc.trim()) {
      setError('Description is required.')
      return
    }
    createLine({
      variables: {
        input: {
          organizationId: orgId,
          bankAccount: accountNumber,
          lineDate: new Date(lineDate).toISOString(),
          amount: n,
          lineKind,
          description: lineDesc.trim(),
          bankReference: lineRef.trim() || undefined,
        },
      },
    })
  }

  const linkToBook = (bankLineId: string) => {
    const cashBankId = linkByBankLine[bankLineId]
    if (!cashBankId) {
      setError('Choose a matching book line.')
      return
    }
    setError('')
    matchLine({ variables: { bankStatementLineId: bankLineId, cashBankId } })
  }

  const refresh = () => {
    setError('')
    void refetchStmt()
    void refetchBook()
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-sky-800" />
          Reconcile bank statement
        </h1>
        <p className="text-gray-500 mt-1">
          Enter lines as they appear on your bank-issued statement (credit = money in, debit = money out). Link each
          line to a pending book entry with the same amount and direction to mark it reconciled.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold">Bank account</div>
        <div className="p-3">
          <table className="w-full border-collapse text-xs min-w-[400px]">
            <tbody>
              <tr>
                <td className={labelCell}>Account</td>
                <td className={`${cell} min-w-[360px]`}>
                  <SelectFloating
                    label=""
                    value={accountNumber}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setAccountNumber(next)
                      setLinkByBankLine({})
                      setError('')
                    }}
                    options={bankOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {acctLoading && <p className="text-xs text-gray-500 mt-2">Loading…</p>}
        </div>
      </div>

      {!accountNumber && orgId && !acctLoading && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Select a bank account to add statement lines and link them to the register.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
      )}

      {accountNumber && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => refresh()}>
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1 ${stmtLoading || bookLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50/80 p-3 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Add line from bank statement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-gray-500">Date</label>
                <input
                  type="date"
                  className="w-full h-9 border rounded-md px-2 font-mono"
                  value={lineDate}
                  onChange={(e) => setLineDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Kind</label>
                <select
                  className="w-full h-9 border rounded-md px-2"
                  value={lineKind}
                  onChange={(e) => setLineKind(e.target.value as 'credit' | 'debit')}
                >
                  <option value="credit">Credit (in)</option>
                  <option value="debit">Debit (out)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full h-9 border rounded-md px-2 text-right font-mono"
                  placeholder="0.00"
                  value={lineAmount}
                  onChange={(e) => setLineAmount(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-500">Description (as on statement)</label>
                <input
                  className="w-full h-9 border rounded-md px-2"
                  value={lineDesc}
                  onChange={(e) => setLineDesc(e.target.value)}
                  placeholder="Payee / memo"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Bank reference</label>
                <input
                  className="w-full h-9 border rounded-md px-2 font-mono"
                  value={lineRef}
                  onChange={(e) => setLineRef(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs bg-slate-800 hover:bg-slate-900"
              disabled={creating}
              onClick={addStatementLine}
            >
              {creating ? 'Adding…' : 'Add statement line'}
            </Button>
          </div>

          <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
            <div className="px-3 py-2 bg-amber-50 border-b border-amber-200 text-sm font-semibold text-amber-950">
              Unmatched statement lines ({unmatchedBank.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs min-w-[960px]">
                <thead>
                  <tr>
                    <th className={`${headerCell} text-left`}>Date</th>
                    <th className={`${headerCell} text-left`}>Kind</th>
                    <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                    <th className={`${headerCell} text-left`}>Description</th>
                    <th className={`${headerCell} text-left`}>Ref</th>
                    <th className={`${headerCell} text-left min-w-[220px]`}>Link to book line</th>
                    <th className={`${headerCell} text-center w-24`} />
                  </tr>
                </thead>
                <tbody>
                  {!unmatchedBank.length && !stmtLoading && (
                    <tr>
                      <td colSpan={7} className={`${cell} text-center text-gray-500 py-8`}>
                        No unmatched bank lines. Add lines from your bank statement above.
                      </td>
                    </tr>
                  )}
                  {stmtLoading && (
                    <tr>
                      <td colSpan={7} className={`${cell} text-center text-gray-500 py-8`}>
                        Loading…
                      </td>
                    </tr>
                  )}
                  {unmatchedBank.map((bl) => {
                    const opts = bookOptionsFor(bl)
                    return (
                      <tr key={bl.id} className="hover:bg-gray-50">
                        <td className={`${cell} font-mono`}>
                          {bl.lineDate ? new Date(bl.lineDate).toLocaleDateString() : '—'}
                        </td>
                        <td className={cell}>{bl.lineKind}</td>
                        <td className={`${cell} ${moneyClass}`}>{formatMoney(Number(bl.amount ?? 0))}</td>
                        <td className={cell}>{bl.description}</td>
                        <td className={`${cell} font-mono`}>{bl.bankReference || '—'}</td>
                        <td className={cell}>
                          <SelectFloating
                            label=""
                            value={linkByBankLine[bl.id] ?? ''}
                            onChange={(v) => {
                              const next = typeof v === 'string' ? v : v.target.value
                              setLinkByBankLine((m) => ({ ...m, [bl.id]: next }))
                            }}
                            options={[{ value: '', label: '— Select book line —' }, ...opts]}
                            className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                          />
                          {!opts.length && (
                            <p className="text-[10px] text-amber-800 mt-1">No book line with matching sign and amount</p>
                          )}
                        </td>
                        <td className={`${cell} text-center`}>
                          <div className="flex flex-col gap-1 items-stretch">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px]"
                              disabled={matching}
                              onClick={() => linkToBook(bl.id)}
                            >
                              <Link2 className="h-3 w-3 mr-0.5" />
                              Link
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 text-[11px] text-red-700"
                              onClick={() => {
                                if (confirm('Remove this bank statement line?')) {
                                  setError('')
                                  void removeLine({ variables: { id: bl.id } })
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-0.5" />
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
              <div className="px-3 py-2 bg-gray-50 border-b text-sm font-semibold">Pending register lines (book)</div>
              <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className={`${headerCell} text-left`}>#</th>
                      <th className={`${headerCell} text-left`}>Date</th>
                      <th className={`${headerCell} text-left`}>Type</th>
                      <th className={`${headerCell} ${moneyClass}`}>Amount (sign)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!bookPending.length && !bookLoading && (
                      <tr>
                        <td colSpan={4} className={`${cell} text-center text-gray-500 py-6`}>
                          No pending book lines
                        </td>
                      </tr>
                    )}
                    {bookPending.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className={`${cell} font-mono`}>{b.transactionNumber}</td>
                        <td className={`${cell} font-mono`}>
                          {b.transactionDate ? new Date(b.transactionDate).toLocaleDateString() : '—'}
                        </td>
                        <td className={cell}>{b.transactionType}</td>
                        <td className={`${cell} font-mono ${moneyClass}`}>{signedBook(b).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
              <div className="px-3 py-2 bg-gray-50 border-b text-sm font-semibold">Recently matched (statement)</div>
              <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className={`${headerCell} text-left`}>Date</th>
                      <th className={`${headerCell} text-left`}>Kind</th>
                      <th className={`${headerCell} ${moneyClass}`}>Amt</th>
                      <th className={`${headerCell} text-left`}>Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!matchedBank.length && (
                      <tr>
                        <td colSpan={4} className={`${cell} text-center text-gray-500 py-6`}>
                          No matches yet
                        </td>
                      </tr>
                    )}
                    {matchedBank.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className={`${cell} font-mono`}>
                          {m.lineDate ? new Date(m.lineDate).toLocaleDateString() : '—'}
                        </td>
                        <td className={cell}>{m.lineKind}</td>
                        <td className={`${cell} ${moneyClass}`}>{formatMoney(Number(m.amount))}</td>
                        <td className={`${cell} font-mono`}>{m.bankReference || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
