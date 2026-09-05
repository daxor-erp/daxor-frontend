'use client'

import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CASH_BANKS, GET_BANK_ACCOUNTS, CREATE_CASH_BANK, CREATE_BANK_ACCOUNT } from '@/gql/queries'
import { InputFloating } from '@/components/ui/input-floating'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FilePen, Building2, ChevronDown, ChevronRight, Plus, CheckCircle2, Clock, DollarSign } from 'lucide-react'

const REF_MODULE = 'bank_check'

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'savings', label: 'Savings' },
  { value: 'od', label: 'Overdraft' },
  { value: 'other', label: 'Other' },
]

const emptyNewBank = {
  accountHolder: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  branchName: '',
  accountType: 'current',
  currency: 'INR',
}

type CashBankRow = {
  id: string
  transactionNumber: string
  bankAccount: string
  transactionDate: string
  transactionType: string
  paymentMethod: string
  referenceId: string
  referenceModule?: string
  description: string
  amount: number
  currency?: string
  chequeNumber?: string | null
  reconciliationStatus: string
  accountHolder?: string
}

export default function WriteChecksPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [accountNumber, setAccountNumber] = useState('')
  const [checkDate, setCheckDate] = useState(() => new Date().toISOString().split('T')[0])
  const [checkNumber, setCheckNumber] = useState('')
  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [error, setError] = useState('')
  const [showAddBank, setShowAddBank] = useState(false)
  const [newBank, setNewBank] = useState({ ...emptyNewBank })
  const [formOpen, setFormOpen] = useState(false)

  const { data: acctData, loading: acctLoading, refetch: refetchAccounts } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: txData, loading: txLoading, refetch: refetchTx } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createBankAccount, { loading: savingBank }] = useMutation(CREATE_BANK_ACCOUNT, {
    onCompleted: (data) => {
      const num = data?.createBankAccount?.accountNumber
      if (num) setAccountNumber(num)
      setNewBank({ ...emptyNewBank })
      setShowAddBank(false)
      setError('')
      void refetchAccounts()
    },
    onError: (e) => setError(e.message),
  })

  const [createLine, { loading: saving }] = useMutation(CREATE_CASH_BANK, {
    onCompleted: () => {
      setCheckNumber('')
      setPayee('')
      setAmount('')
      setMemo('')
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

  const selectedAcct = useMemo(
    () => bankAccounts.find((a: { accountNumber: string }) => a.accountNumber === accountNumber),
    [bankAccounts, accountNumber],
  ) as
    | {
        accountNumber: string
        currency?: string
        accountName?: string
        accountHolder?: string
        bankName?: string
      }
    | undefined

  const holderByAccountNumber = useMemo(() => {
    const m = new Map<string, string>()
    for (const a of bankAccounts as { accountNumber: string; accountHolder?: string; accountName: string }[]) {
      m.set(a.accountNumber, (a.accountHolder && a.accountHolder.trim()) || a.accountName)
    }
    return m
  }, [bankAccounts])

  const checks: CashBankRow[] = useMemo(() => {
    const rows = (txData?.cashBanks ?? []) as CashBankRow[]
    return rows
      .filter((t) => t.referenceModule === REF_MODULE)
      .map((d) => ({ ...d, accountHolder: holderByAccountNumber.get(d.bankAccount) ?? '—' }))
  }, [txData, holderByAccountNumber])

  const stats = {
    total: checks.length,
    pending: checks.filter((d) => d.reconciliationStatus !== 'RECONCILED').length,
    reconciled: checks.filter((d) => d.reconciliationStatus === 'RECONCILED').length,
    amount: checks.reduce((s, d) => s + Number(d.amount ?? 0), 0),
  }

  const buildDescription = () => {
    const p = payee.trim()
    const m = memo.trim()
    if (p && m) return `Check to ${p} — ${m}`
    if (p) return `Check to ${p}`
    if (m) return m
    return 'Bank check'
  }

  const submit = () => {
    setError('')
    if (!accountNumber) {
      setError('Select a bank account.')
      return
    }
    const chk = checkNumber.trim()
    if (!chk) {
      setError('Enter a check number.')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid amount.')
      return
    }
    createLine({
      variables: {
        input: {
          organizationId: orgId,
          transactionDate: new Date(checkDate).toISOString(),
          transactionType: 'payment',
          bankAccount: accountNumber,
          referenceModule: REF_MODULE,
          referenceId: `chk-${chk}`,
          amount: n,
          currency: selectedAcct?.currency || 'INR',
          paymentMethod: 'cheque',
          chequeNumber: chk,
          description: buildDescription(),
        },
      },
    })
  }

  const submitNewBank = () => {
    setError('')
    if (!newBank.accountNumber.trim() || !newBank.accountName.trim() || !newBank.bankName.trim()) {
      setError('Account holder, account name, account number, and bank name are required.')
      return
    }
    createBankAccount({
      variables: {
        input: {
          organizationId: orgId,
          accountHolder: newBank.accountHolder.trim() || newBank.accountName.trim(),
          accountName: newBank.accountName.trim(),
          accountNumber: newBank.accountNumber.trim(),
          bankName: newBank.bankName.trim(),
          branchName: newBank.branchName.trim() || 'Main',
          accountType: newBank.accountType || 'current',
          currency: newBank.currency?.trim() || 'INR',
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'accountHolder', label: 'Account holder', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'bankAccount', label: 'Account #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'transactionDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'chequeNumber', label: 'Check #', width: '110px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'referenceId', label: 'Ref', width: '120px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'reconciliationStatus', label: 'Status', width: '130px', render: (v) => <ErpBadge status={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Write Checks"
        subtitle="Record a check drawn on a company bank account"
        icon={<FilePen className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Banks' }, { label: 'Write Checks' }]}
        actions={
          <Button
            onClick={() => {
              setFormOpen(true)
              setError('')
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Check
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Checks" value={stats.total} icon={<FilePen className="h-5 w-5" />} variant="slate" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Reconciled" value={stats.reconciled} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard
          label="Total Amount"
          value={`₹${(stats.amount / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="rose"
        />
      </StatsRow>

      {formOpen && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              New check
              {selectedAcct ? (
                <span className="text-muted-foreground font-normal">
                  — {(selectedAcct.accountHolder || selectedAcct.accountName) ?? '—'} · {selectedAcct.bankName}
                </span>
              ) : null}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Close
            </Button>
          </div>

          <div className="rounded border border-border bg-muted/40 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setShowAddBank((s) => !s)
                setError('')
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium hover:bg-muted/80"
            >
              {showAddBank ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Plus className="h-4 w-4" />
              Add bank account
            </button>
            {showAddBank && (
              <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border bg-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <InputFloating
                    label="Account holder *"
                    value={newBank.accountHolder}
                    onChange={(e) => setNewBank((b) => ({ ...b, accountHolder: e.target.value }))}
                  />
                  <InputFloating
                    label="Account name (alias) *"
                    value={newBank.accountName}
                    onChange={(e) => setNewBank((b) => ({ ...b, accountName: e.target.value }))}
                  />
                  <InputFloating
                    label="Account number *"
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank((b) => ({ ...b, accountNumber: e.target.value }))}
                  />
                  <InputFloating
                    label="Bank name *"
                    value={newBank.bankName}
                    onChange={(e) => setNewBank((b) => ({ ...b, bankName: e.target.value }))}
                  />
                  <InputFloating
                    label="Branch"
                    value={newBank.branchName}
                    onChange={(e) => setNewBank((b) => ({ ...b, branchName: e.target.value }))}
                    placeholder="Main"
                  />
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground block mb-0.5">Type</label>
                      <select
                        className="w-full h-9 text-xs border rounded-md px-2 bg-background"
                        value={newBank.accountType}
                        onChange={(e) => setNewBank((b) => ({ ...b, accountType: e.target.value }))}
                      >
                        {ACCOUNT_TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <InputFloating
                        label="Currency"
                        value={newBank.currency}
                        onChange={(e) => setNewBank((b) => ({ ...b, currency: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" disabled={!orgId || savingBank} onClick={submitNewBank}>
                    {savingBank ? 'Saving…' : 'Save bank account'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewBank({ ...emptyNewBank })
                      setShowAddBank(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {acctLoading && <p className="text-sm text-muted-foreground">Loading bank accounts…</p>}
          {!acctLoading && orgId && bankAccounts.length === 0 && (
            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-medium">No active bank account found.</p>
              <p className="mt-1">
                Add a bank account above or in{' '}
                <Link href="/cash-bank" className="underline font-medium">
                  Cash &amp; Bank
                </Link>
                .
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectFloating
              label="Pay from (account) *"
              value={accountNumber}
              onChange={(v) => {
                const next = typeof v === 'string' ? v : v.target.value
                setAccountNumber(next)
                setError('')
              }}
              options={[{ value: '', label: 'Select account…' }, ...bankOptions]}
            />
            <InputFloating label="Check date *" type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} />
            <InputFloating label="Check # *" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
            <InputFloating label="Pay to" value={payee} onChange={(e) => setPayee(e.target.value)} placeholder="Vendor or person" />
            <InputFloating label="Amount *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <InputFloating label="Memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>

          <Button
            type="button"
            onClick={submit}
            disabled={saving || !orgId || bankAccounts.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? 'Saving…' : 'Record check'}
          </Button>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5">
              {error}
            </p>
          )}
        </div>
      )}

      <DataTable
        data={checks}
        columns={columns}
        loading={txLoading}
        title="All Checks"
        searchable
        searchPlaceholder="Search checks…"
        emptyMessage="No checks recorded yet."
        pageSize={25}
      />
    </div>
  )
}
