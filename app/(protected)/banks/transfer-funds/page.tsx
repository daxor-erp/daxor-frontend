'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_BANK_ACCOUNTS, GET_CASH_BANKS, TRANSFER_BANK_FUNDS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { ArrowLeftRight, Plus, Building2, DollarSign, Landmark } from 'lucide-react'

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

type TransferRow = {
  id: string
  ref: string
  date: string
  fromAccount: string
  toAccount: string
  amount: number
  currency?: string
  description: string
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
  const [formOpen, setFormOpen] = useState(false)

  const { data: acctData, loading: acctLoading } = useQuery(GET_BANK_ACCOUNTS, {
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
      setFormOpen(false)
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

  const recentTransfers: TransferRow[] = useMemo(() => {
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
    const list: TransferRow[] = []
    for (const [ref, lines] of pairs) {
      if (lines.length < 2) continue
      const pay = lines.find((l) => l.transactionType === 'payment')
      const rec = lines.find((l) => l.transactionType === 'receipt')
      if (!pay || !rec) continue
      const d = pay.transactionDate || rec.transactionDate
      list.push({
        id: pay.id,
        ref,
        date: d,
        fromAccount: pay.bankAccount,
        toAccount: rec.bankAccount,
        amount: Number(pay.amount ?? 0),
        currency: pay.currency,
        description: pay.description || '',
      })
    }
    list.sort((a, b) => (b.date > a.date ? 1 : -1))
    return list.slice(0, 25)
  }, [txData])

  const stats = {
    total: recentTransfers.length,
    amount: recentTransfers.reduce((s, t) => s + Number(t.amount ?? 0), 0),
    accounts: bankAccounts.length,
  }

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

  const columns: Column[] = [
    { key: 'ref', label: 'Ref', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'date', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'fromAccount', label: 'From', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'toAccount', label: 'To', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Transfer Funds"
        subtitle="Move money between company bank accounts"
        icon={<ArrowLeftRight className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Banks' }, { label: 'Transfer Funds' }]}
        actions={
          <Button
            onClick={() => {
              setFormOpen(true)
              setError('')
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Transfer
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Recent Transfers" value={stats.total} icon={<ArrowLeftRight className="h-5 w-5" />} variant="slate" />
        <StatCard label="Bank Accounts" value={stats.accounts} icon={<Landmark className="h-5 w-5" />} variant="blue" />
        <StatCard
          label="Transferred"
          value={`₹${(stats.amount / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="green"
        />
      </StatsRow>

      {formOpen && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              New transfer
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Close
            </Button>
          </div>

          {acctLoading && <p className="text-sm text-muted-foreground">Loading bank accounts…</p>}
          {!acctLoading && orgId && bankAccounts.length < 2 && (
            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-medium">You need at least two active bank accounts to transfer between them.</p>
              <p className="mt-1">Add accounts under Cash &amp; Bank.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectFloating
              label="From account *"
              value={fromNumber}
              onChange={(v) => {
                const next = typeof v === 'string' ? v : v.target.value
                setFromNumber(next)
                setError('')
              }}
              options={[{ value: '', label: 'Select account…' }, ...fromOptions]}
            />
            <SelectFloating
              label="To account *"
              value={toNumber}
              onChange={(v) => {
                const next = typeof v === 'string' ? v : v.target.value
                setToNumber(next)
                setError('')
              }}
              options={[{ value: '', label: 'Select account…' }, ...toOptions]}
            />
            <InputFloating
              label="Transfer date *"
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            />
            <InputFloating
              label="Amount *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="sm:col-span-2">
              <InputFloating
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Petty cash top-up, sweep to payroll"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={submit}
              disabled={saving || !orgId || bankAccounts.length < 2}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? 'Recording…' : 'Record transfer'}
            </Button>
          </div>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5">
              {error}
            </p>
          )}
        </div>
      )}

      <DataTable
        data={recentTransfers}
        columns={columns}
        loading={txLoading}
        title="All Transfers"
        searchable
        searchPlaceholder="Search transfers…"
        emptyMessage="No transfers recorded yet."
        pageSize={25}
      />
    </div>
  )
}
