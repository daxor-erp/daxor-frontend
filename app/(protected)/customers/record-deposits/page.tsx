'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_CLIENTS,
  GET_CUSTOMERS,
  GET_CUSTOMER_DEPOSITS,
  CREATE_CUSTOMER_DEPOSIT,
  CANCEL_CUSTOMER_DEPOSIT,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { PiggyBank, XCircle, Plus, DollarSign, Users } from 'lucide-react'

export default function RecordCustomerDepositsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formOpen, setFormOpen] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [depositDate, setDepositDate] = useState(() => new Date().toISOString().split('T')[0])
  const [depositMethod, setDepositMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const { data: depData, loading: depLoading, refetch: refetchDep } = useQuery(GET_CUSTOMER_DEPOSITS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createDeposit, { loading: saving }] = useMutation(CREATE_CUSTOMER_DEPOSIT, {
    onCompleted: () => {
      setReferenceNumber('')
      setAmount('')
      setNotes('')
      setError('')
      setFormOpen(false)
      void refetchDep()
    },
    onError: (e) => setError(e.message),
  })

  const [cancelDeposit] = useMutation(CANCEL_CUSTOMER_DEPOSIT, {
    onCompleted: () => void refetchDep(),
    onError: (e) => setError(e.message),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const deposits: any[] = depData?.customerDeposits ?? []

  const stats = {
    total: deposits.length,
    amount: deposits.reduce((s: number, d: any) => s + Number(d.amount ?? 0), 0),
    contacts: clients.length + customers.length,
  }

  const submit = () => {
    setError('')
    if (!customerId) {
      setError('Select bill-to (client or customer).')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid deposit amount.')
      return
    }
    createDeposit({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          depositDate: new Date(depositDate).toISOString(),
          depositMethod,
          referenceNumber: referenceNumber.trim() || undefined,
          amount: n,
          notes: notes.trim() || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'depositNumber', label: 'Deposit #', width: '140px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'customer',
      label: 'Bill-to',
      render: (v) => (
        <span className="text-sm">
          <span className="font-medium">{v?.name ?? '—'}</span>
          {v?.docNumber ? <span className="text-muted-foreground ml-1 text-xs">{v.docNumber}</span> : null}
        </span>
      ),
    },
    { key: 'depositDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'depositMethod',
      label: 'Method',
      width: '120px',
      render: (v) => <span className="text-xs capitalize">{String(v ?? '—').replace(/_/g, ' ')}</span>,
    },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Record Customer Deposits"
        subtitle="Record customer prepayments or on-account deposits (liability)"
        icon={<PiggyBank className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Record Deposits' }]}
        actions={
          <Button
            onClick={() => {
              setFormOpen(true)
              setError('')
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Deposit
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Deposits" value={stats.total} icon={<PiggyBank className="h-5 w-5" />} variant="slate" />
        <StatCard label="Bill-to Contacts" value={stats.contacts} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard
          label="Total Amount"
          value={`₹${(stats.amount / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="green"
        />
      </StatsRow>

      {formOpen && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              New deposit
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectFloating
              label="Bill-to *"
              value={customerId}
              onChange={(v) => {
                const next = typeof v === 'string' ? v : v.target.value
                setCustomerId(next)
                setError('')
              }}
              options={customerOptions}
            />
            <InputFloating
              label="Deposit date *"
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
            />
            <SelectFloating
              label="Method"
              value={depositMethod}
              onChange={(v) => setDepositMethod(typeof v === 'string' ? v : v.target.value)}
              options={CUSTOMER_PAYMENT_METHOD_OPTIONS}
            />
            <InputFloating
              label="Reference #"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Cheque / bank ref"
            />
            <InputFloating
              label="Amount *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <InputFloating
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={submit}
              disabled={saving || !orgId}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? 'Saving…' : 'Record deposit'}
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
        data={deposits}
        columns={columns}
        loading={depLoading}
        title="All Customer Deposits"
        searchable
        searchPlaceholder="Search deposits…"
        emptyMessage="No deposits recorded yet."
        pageSize={25}
        actions={[
          {
            label: 'Cancel',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              if (
                confirm(
                  `Cancel deposit ${r.depositNumber}? This removes it from the register (soft cancel).`,
                )
              ) {
                setError('')
                cancelDeposit({ variables: { id: r.id } })
              }
            },
          },
        ]}
      />
    </div>
  )
}
