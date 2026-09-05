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
  GET_CUSTOMER_INVOICES,
  GET_CUSTOMER_REFUNDS,
  CREATE_CUSTOMER_REFUND,
  CANCEL_CUSTOMER_REFUND,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { formatMoney } from '@/lib/format-money'
import { Banknote, Undo2, Plus, DollarSign, FileText } from 'lucide-react'

export default function IssueCustomerRefundPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formOpen, setFormOpen] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [refundDate, setRefundDate] = useState(() => new Date().toISOString().split('T')[0])
  const [refundMethod, setRefundMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [customerInvoiceId, setCustomerInvoiceId] = useState('')
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

  const { data: invData, refetch: refetchInv } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 200, customerId: customerId || undefined },
    skip: !orgId || !customerId,
  })

  const { data: refundsData, loading: refundsLoading, refetch: refetchRefunds } = useQuery(GET_CUSTOMER_REFUNDS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createRefund, { loading: saving }] = useMutation(CREATE_CUSTOMER_REFUND, {
    onCompleted: () => {
      setReferenceNumber('')
      setAmount('')
      setCustomerInvoiceId('')
      setNotes('')
      setError('')
      setFormOpen(false)
      void refetchInv()
      void refetchRefunds()
    },
    onError: (e) => setError(e.message),
  })

  const [cancelRefund] = useMutation(CANCEL_CUSTOMER_REFUND, {
    onCompleted: () => {
      void refetchRefunds()
      void refetchInv()
    },
    onError: (e) => setError(e.message),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const rawInvoices = invData?.customerinvoices ?? []
  const refundableInvoices = useMemo(
    () => rawInvoices.filter((inv: { paidAmount?: number; status: string }) => {
      const paid = Number(inv.paidAmount ?? 0)
      return paid > 0.001 && !['draft', 'cancelled'].includes(inv.status)
    }),
    [rawInvoices],
  )

  const refunds: any[] = refundsData?.customerRefunds ?? []
  const totalIssued = useMemo(
    () => refunds.reduce((s: number, r: { amount: number }) => s + Number(r.amount ?? 0), 0),
    [refunds],
  )

  const handleSubmit = () => {
    setError('')
    if (!customerId) {
      setError('Select bill-to (client or customer).')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid refund amount.')
      return
    }
    if (customerInvoiceId) {
      const inv = refundableInvoices.find((i: { id: string }) => i.id === customerInvoiceId)
      if (inv && n > Number(inv.paidAmount ?? 0) + 0.01) {
        setError('Amount cannot exceed paid amount on the selected invoice.')
        return
      }
    }
    createRefund({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          refundDate: new Date(refundDate).toISOString(),
          refundMethod,
          referenceNumber: referenceNumber.trim() || undefined,
          amount: n,
          customerInvoiceId: customerInvoiceId || undefined,
          notes: notes.trim() || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'refundNumber', label: 'Refund #', width: '140px', render: (v) => <MonoCell value={v} /> },
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
    { key: 'refundDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'refundMethod',
      label: 'Method',
      width: '120px',
      render: (v) => <span className="text-xs capitalize">{String(v ?? '—').replace(/_/g, ' ')}</span>,
    },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    {
      key: 'invoice',
      label: 'Invoice',
      width: '120px',
      render: (v) => <MonoCell value={v?.seqNo} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Issue Customer Refund"
        subtitle="Record money returned to the customer; link an invoice to reduce applied payment, or leave blank for goodwill"
        icon={<Undo2 className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Issue Refund' }]}
        actions={
          <Button
            onClick={() => {
              setFormOpen(true)
              setError('')
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Refund
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Refunds" value={refunds.length} icon={<Undo2 className="h-5 w-5" />} variant="slate" />
        <StatCard
          label="Total Issued"
          value={`₹${(totalIssued / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="rose"
        />
        <StatCard
          label="Refundable Invoices"
          value={customerId ? refundableInvoices.length : '—'}
          icon={<FileText className="h-5 w-5" />}
          variant="amber"
        />
      </StatsRow>

      {formOpen && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              New refund
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
                setCustomerInvoiceId('')
                setError('')
              }}
              options={customerOptions}
            />
            <InputFloating
              label="Refund date *"
              type="date"
              value={refundDate}
              onChange={(e) => setRefundDate(e.target.value)}
            />
            <SelectFloating
              label="Method"
              value={refundMethod}
              onChange={(v) => setRefundMethod(typeof v === 'string' ? v : v.target.value)}
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
            <SelectFloating
              label="Apply to invoice"
              value={customerInvoiceId}
              onChange={(v) => setCustomerInvoiceId(typeof v === 'string' ? v : v.target.value)}
              options={[
                { value: '', label: '— None (no AR adjustment) —' },
                ...refundableInvoices.map((inv: { id: string; seqNo: string; paidAmount: number }) => ({
                  value: inv.id,
                  label: `${inv.seqNo} — paid ${formatMoney(Number(inv.paidAmount ?? 0))}`,
                })),
              ]}
            />
            <div className="sm:col-span-2">
              <InputFloating
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional reason"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !orgId}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Banknote className="h-3.5 w-3.5 mr-1.5" />
              {saving ? 'Recording…' : 'Record refund'}
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
        data={refunds}
        columns={columns}
        loading={refundsLoading}
        title="All Customer Refunds"
        searchable
        searchPlaceholder="Search refunds…"
        emptyMessage="No refunds recorded yet."
        pageSize={25}
        actions={[
          {
            label: 'Cancel',
            icon: <Undo2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              if (
                confirm(
                  `Cancel refund ${r.refundNumber}? If linked to an invoice, paid amount will be restored.`,
                )
              ) {
                setError('')
                cancelRefund({ variables: { id: r.id } })
              }
            },
          },
        ]}
      />
    </div>
  )
}
