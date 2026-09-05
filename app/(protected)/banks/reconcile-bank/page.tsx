'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell, ErpBadge } from '@/components/ui/erp-shared'
import {
  GET_BANK_ACCOUNTS,
  GET_CASH_BANKS,
  GET_BANK_STATEMENT_LINES,
  CREATE_BANK_STATEMENT_LINE,
  DELETE_BANK_STATEMENT_LINE,
  MATCH_BANK_STATEMENT_LINE,
} from '@/gql/queries'
import { CheckCircle2, Clock, FileText, Link2, Plus, RefreshCw, Trash2 } from 'lucide-react'

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
  signedAmount?: number
}

export default function ReconcileBankStatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)

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
      setFormOpen(false)
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

  const selected = useMemo(
    () => bankAccounts.find((a: { accountNumber: string }) => a.accountNumber === accountNumber),
    [bankAccounts, accountNumber],
  ) as { accountHolder?: string; accountName?: string; bankName?: string } | undefined

  const bankLines: BankLine[] = useMemo(() => (stmtData?.bankStatementLines ?? []) as BankLine[], [stmtData])
  const unmatchedBank = useMemo(() => bankLines.filter((l) => !l.isMatched), [bankLines])
  const matchedBank = useMemo(() => bankLines.filter((l) => l.isMatched).slice(0, 40), [bankLines])

  const bookPending: BookLine[] = useMemo(() => {
    const rows = (bookData?.cashBanks ?? []) as BookLine[]
    return rows.map((b) => ({ ...b, signedAmount: signedBook(b) }))
  }, [bookData])

  const bookOptionsFor = (bl: BankLine) => {
    const sl = signedLine(bl)
    return bookPending
      .filter((b) => Math.abs(signedBook(b) - sl) <= TOL)
      .map((b) => ({
        value: b.id,
        label: `${b.transactionNumber} · ${b.transactionType} · ${Math.abs(Number(b.amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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

  const unmatchedColumns: Column[] = [
    { key: 'lineDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'lineKind',
      label: 'Kind',
      width: '100px',
      render: (v) => <ErpBadge status={v} />,
    },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
    {
      key: 'bankReference',
      label: 'Ref',
      width: '120px',
      render: (v) => <MonoCell value={v || '—'} />,
    },
    {
      key: 'linkBook',
      label: 'Link to book line',
      width: '260px',
      render: (_v, row: BankLine) => {
        const opts = bookOptionsFor(row)
        return (
          <div className="min-w-[200px]" onClick={(e) => e.stopPropagation()}>
            <SelectFloating
              label=""
              value={linkByBankLine[row.id] ?? ''}
              onChange={(v) => {
                const next = typeof v === 'string' ? v : v.target.value
                setLinkByBankLine((m) => ({ ...m, [row.id]: next }))
              }}
              options={[{ value: '', label: '— Select book line —' }, ...opts]}
              className="h-8 text-xs"
            />
            {!opts.length && (
              <p className="text-[10px] text-amber-800 mt-1">No book line with matching sign and amount</p>
            )}
          </div>
        )
      },
    },
  ]

  const bookColumns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'transactionDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'transactionType',
      label: 'Type',
      width: '110px',
      render: (v) => <span className="text-xs capitalize">{String(v ?? '—').replace(/_/g, ' ')}</span>,
    },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
    {
      key: 'signedAmount',
      label: 'Amount (sign)',
      width: '130px',
      align: 'right',
      render: (v) => (
        <span className="text-sm font-mono tabular-nums">
          {Number(v ?? 0).toFixed(2)}
        </span>
      ),
    },
  ]

  const matchedColumns: Column[] = [
    { key: 'lineDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'lineKind',
      label: 'Kind',
      width: '100px',
      render: (v) => <ErpBadge status={v} />,
    },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
    {
      key: 'bankReference',
      label: 'Ref',
      width: '120px',
      render: (v) => <MonoCell value={v || '—'} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Reconcile Bank Statement"
        subtitle="Enter lines as they appear on your bank-issued statement. Link each line to a pending book entry with the same amount and direction."
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Banks' }, { label: 'Reconcile Bank' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {accountNumber && (
              <Button type="button" variant="outline" size="sm" onClick={() => refresh()}>
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1.5 ${stmtLoading || bookLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            )}
            {accountNumber && (
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setFormOpen(true)
                  setError('')
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add statement line
              </Button>
            )}
          </div>
        }
      />

      {accountNumber && (
        <StatsRow cols={3}>
          <StatCard
            label="Unmatched"
            value={unmatchedBank.length}
            icon={<Clock className="h-5 w-5" />}
            variant="amber"
          />
          <StatCard
            label="Matched"
            value={matchedBank.length}
            icon={<CheckCircle2 className="h-5 w-5" />}
            variant="green"
          />
          <StatCard
            label="Pending book"
            value={bookPending.length}
            icon={<FileText className="h-5 w-5" />}
            variant="slate"
          />
        </StatsRow>
      )}

      <div className="rounded-xl border border-border bg-card p-4 space-y-3 mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          Bank account
          {selected ? (
            <span className="text-muted-foreground font-normal">
              {' '}
              — {(selected.accountHolder || selected.accountName) ?? '—'} · {selected.bankName}
            </span>
          ) : null}
        </h2>
        <div className="max-w-xl">
          <SelectFloating
            label="Account (by holder) *"
            value={accountNumber}
            onChange={(v) => {
              const next = typeof v === 'string' ? v : v.target.value
              setAccountNumber(next)
              setLinkByBankLine({})
              setError('')
            }}
            options={[{ value: '', label: 'Select account…' }, ...bankOptions]}
          />
        </div>
        {acctLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      </div>

      {!accountNumber && orgId && !acctLoading && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
          Select a bank account to add statement lines and link them to the register.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {accountNumber && formOpen && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Add line from bank statement</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InputFloating
              label="Date *"
              type="date"
              value={lineDate}
              onChange={(e) => setLineDate(e.target.value)}
            />
            <SelectFloating
              label="Kind *"
              value={lineKind}
              onChange={(v) => setLineKind((typeof v === 'string' ? v : v.target.value) as 'credit' | 'debit')}
              options={[
                { value: 'credit', label: 'Credit (in)' },
                { value: 'debit', label: 'Debit (out)' },
              ]}
            />
            <InputFloating
              label="Amount *"
              type="number"
              value={lineAmount}
              onChange={(e) => setLineAmount(e.target.value)}
            />
            <div className="sm:col-span-2">
              <InputFloating
                label="Description (as on statement) *"
                value={lineDesc}
                onChange={(e) => setLineDesc(e.target.value)}
                placeholder="Payee / memo"
              />
            </div>
            <InputFloating
              label="Bank reference"
              value={lineRef}
              onChange={(e) => setLineRef(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <Button
            type="button"
            disabled={creating}
            onClick={addStatementLine}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {creating ? 'Adding…' : 'Add statement line'}
          </Button>
        </div>
      )}

      {accountNumber && (
        <div className="space-y-4">
          <DataTable
            data={unmatchedBank}
            columns={unmatchedColumns}
            loading={stmtLoading}
            title="All Unmatched Statement Lines"
            searchable
            searchPlaceholder="Search unmatched lines…"
            emptyMessage="No unmatched bank lines. Add lines from your bank statement above."
            pageSize={25}
            actions={[
              {
                label: 'Link',
                icon: <Link2 className="h-3.5 w-3.5" />,
                onClick: (r: BankLine) => linkToBook(r.id),
                disabled: () => matching,
              },
              {
                label: 'Delete',
                icon: <Trash2 className="h-3.5 w-3.5" />,
                variant: 'destructive',
                onClick: (r: BankLine) => {
                  if (confirm('Remove this bank statement line?')) {
                    setError('')
                    void removeLine({ variables: { id: r.id } })
                  }
                },
              },
            ]}
          />

          <DataTable
            data={bookPending}
            columns={bookColumns}
            loading={bookLoading}
            title="All Pending Book Lines"
            searchable
            searchPlaceholder="Search book lines…"
            emptyMessage="No pending book lines."
            pageSize={25}
          />

          <DataTable
            data={matchedBank}
            columns={matchedColumns}
            loading={stmtLoading}
            title="All Matched Statement Lines"
            searchable
            searchPlaceholder="Search matched…"
            emptyMessage="No matches yet."
            pageSize={25}
          />
        </div>
      )}
    </div>
  )
}
