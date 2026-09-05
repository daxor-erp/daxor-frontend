'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell, ErpBadge } from '@/components/ui/erp-shared'
import { GET_CASH_BANKS, GET_BANK_ACCOUNTS, RECONCILE_CASH_BANK } from '@/gql/queries'
import { CheckCircle, CheckCircle2, ClipboardList, Clock, RefreshCw } from 'lucide-react'

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
  const doneRecent = useMemo(
    () => [...done].sort((a, b) => (b.transactionDate > a.transactionDate ? 1 : -1)).slice(0, 30),
    [done],
  )

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

  const pendingColumns: Column[] = [
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
      key: 'referenceId',
      label: 'Ref',
      width: '160px',
      render: (v, r) => <MonoCell value={`${r.referenceModule} / ${v}`} />,
    },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
  ]

  const doneColumns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'transactionDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v || '—'}</span> },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    {
      key: 'reconciliationStatus',
      label: 'Status',
      width: '130px',
      render: (v) => <ErpBadge status={v} />,
    },
    {
      key: 'reconciliationDate',
      label: 'Reconciled',
      width: '160px',
      render: (v) =>
        v ? (
          <span className="text-xs font-mono text-muted-foreground">{new Date(v).toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Reconcile Account"
        subtitle="Match register lines to your bank statement. Mark items as reconciled when they appear on the statement."
        icon={<ClipboardList className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Banks' }, { label: 'Reconcile Account' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {accountNumber && (
              <Button type="button" variant="outline" size="sm" onClick={() => refresh()}>
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1.5 ${pendingLoading || doneLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            )}
            {accountNumber && pending.length > 0 && (
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={recOne}
                onClick={() => {
                  if (confirm(`Mark all ${pending.length} pending line(s) as reconciled?`)) {
                    void reconcileAllPending()
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Reconcile all pending
              </Button>
            )}
          </div>
        }
      />

      {accountNumber && (
        <StatsRow cols={2}>
          <StatCard
            label="Pending"
            value={pending.length}
            icon={<Clock className="h-5 w-5" />}
            variant="amber"
          />
          <StatCard
            label="Reconciled"
            value={done.length}
            icon={<CheckCircle2 className="h-5 w-5" />}
            variant="green"
          />
        </StatsRow>
      )}

      <div className="rounded-xl border border-border bg-card p-4 space-y-3 mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          Account
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
              setError('')
            }}
            options={[{ value: '', label: 'Select account…' }, ...bankOptions]}
          />
        </div>
        {acctLoading && <p className="text-sm text-muted-foreground">Loading bank accounts…</p>}
      </div>

      {!accountNumber && orgId && !acctLoading && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
          Select a bank account to load unreconciled and reconciled register lines.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {accountNumber && (
        <div className="space-y-4">
          <DataTable
            data={pending}
            columns={pendingColumns}
            loading={pendingLoading}
            title="All Pending Lines"
            searchable
            searchPlaceholder="Search pending lines…"
            emptyMessage="No pending lines for this account."
            pageSize={25}
            actions={[
              {
                label: 'Reconcile',
                icon: <CheckCircle className="h-3.5 w-3.5" />,
                onClick: (r: Row) => void onReconcile(r.id),
                disabled: () => recOne,
              },
            ]}
          />

          <DataTable
            data={doneRecent}
            columns={doneColumns}
            loading={doneLoading}
            title="All Recently Reconciled"
            searchable
            searchPlaceholder="Search reconciled…"
            emptyMessage="No reconciled items yet."
            pageSize={25}
          />
        </div>
      )}
    </div>
  )
}
