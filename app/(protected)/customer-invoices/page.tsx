'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_CUSTOMER_INVOICES, GET_CUSTOMERS,
  SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL, SYNC_CUSTOMER_INVOICE_ACCOUNTING,
  APPLY_CUSTOMER_CREDIT_MEMO, UPDATE_CUSTOMER_INVOICE,
  APPROVE_CUSTOMER_INVOICE, RECONCILE_CUSTOMER_INVOICE,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import {
  ReceiptText, Clock, CheckCircle2, AlertCircle, DollarSign,
  Send, RefreshCcw, Minus, ThumbsUp, CreditCard, Ban,
} from 'lucide-react'

const BLANK_LINE = { itemDescription: '', quantity: 1, unitPrice: 0, lineTotal: 0 }

const STATUS_PIPELINE = [
  { key: 'draft',           label: 'Draft' },
  { key: 'submitted',       label: 'Submitted' },
  { key: 'approved',        label: 'Approved' },
  { key: 'sent',            label: 'Sent' },
  { key: 'in_payment',      label: 'In Payment' },
  { key: 'partially_paid',  label: 'Partial' },
  { key: 'paid',            label: 'Paid' },
  { key: 'overdue',         label: 'Overdue' },
]

const AGING_BUCKETS = [
  { label: '0–30 days',  days: 30,  variant: 'green'  as const },
  { label: '31–60 days', days: 60,  variant: 'amber'  as const },
  { label: '61–90 days', days: 90,  variant: 'orange' as const },
  { label: '90+ days',   days: 999, variant: 'rose'   as const },
]

function daysOverdue(dueDate: string | null): number {
  if (!dueDate) return 0
  const diff = (Date.now() - new Date(dueDate).getTime()) / 86_400_000
  return Math.max(0, Math.floor(diff))
}

export default function CustomerInvoicesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [filterStatus, setFilterStatus]   = useState('')
  const [editDrawer, setEditDrawer]       = useState<any>(null)
  const [creditDrawer, setCreditDrawer]   = useState<any>(null)
  const [creditForm, setCreditForm]       = useState({ creditAmount: '', reason: '' })
  const [editForm, setEditForm]           = useState({ invoiceDate: '', dueDate: '' })
  const [editLines, setEditLines]         = useState([{ ...BLANK_LINE }])
  const [confirm, setConfirm]             = useState<{ action: string; id: string } | null>(null)

  const { data, loading, refetch } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: !orgId,
  })

  const done = () => { refetch(); setCreditDrawer(null); setConfirm(null); setEditDrawer(null) }
  const err  = (e: any) => alert(e.message)

  const [submitInv, { loading: submitting }]    = useMutation(SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL, { onCompleted: done, onError: err })
  const [syncAcct]                              = useMutation(SYNC_CUSTOMER_INVOICE_ACCOUNTING,     { onCompleted: done, onError: err })
  const [creditMemo, { loading: crediting }]    = useMutation(APPLY_CUSTOMER_CREDIT_MEMO,          { onCompleted: done, onError: err })
  const [updateInv,  { loading: updating }]     = useMutation(UPDATE_CUSTOMER_INVOICE,             { onCompleted: done, onError: err })
  const [approveInv]                            = useMutation(APPROVE_CUSTOMER_INVOICE,            { onCompleted: done, onError: err })
  const [reconcileInv]                          = useMutation(RECONCILE_CUSTOMER_INVOICE,          { onCompleted: done, onError: err })
  const [cancelInv]                             = useMutation(UPDATE_CUSTOMER_INVOICE,             { onCompleted: done, onError: err })

  const all: any[] = data?.customerinvoices ?? []

  const totalOutstanding = all.reduce((s: number, r: any) => s + Number(r.outstandingAmount ?? 0), 0)
  const totalOverdue     = all
    .filter((r: any) => r.dueDate && daysOverdue(r.dueDate) > 0 && !['paid','cancelled'].includes(r.status))
    .reduce((s: number, r: any) => s + Number(r.outstandingAmount ?? 0), 0)

  const stats = {
    total:     all.length,
    pending:   all.filter((r: any) => ['draft','submitted','approved','sent'].includes(r.status)).length,
    paid:      all.filter((r: any) => r.status === 'paid').length,
    overdue:   all.filter((r: any) => r.status === 'overdue' || (r.dueDate && daysOverdue(r.dueDate) > 0 && !['paid','cancelled'].includes(r.status))).length,
    inPayment: all.filter((r: any) => r.status === 'in_payment').length,
  }

  const records = all.filter((r: any) => !filterStatus || r.status === filterStatus)

  // Open edit drawer for draft invoices
  const openEdit = (row: any) => {
    setEditForm({
      invoiceDate: row.invoiceDate?.split('T')[0] ?? '',
      dueDate:     row.dueDate?.split('T')[0] ?? '',
    })
    setEditLines(
      row.items?.length
        ? row.items.map((i: any) => ({
            itemDescription: i.itemDescription ?? '',
            quantity:  Number(i.quantity ?? 1),
            unitPrice: Number(i.unitPrice ?? 0),
            lineTotal: Number(i.lineTotal ?? 0),
          }))
        : [{ ...BLANK_LINE }]
    )
    setEditDrawer(row)
  }

  const handleEditSave = () => {
    if (!editDrawer || !editForm.invoiceDate) return alert('Enter invoice date')
    const computedLines = editLines
      .filter(l => l.itemDescription?.trim())
      .map(l => ({
        itemDescription: l.itemDescription.trim(),
        quantity:  Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        lineTotal: Math.round(Number(l.quantity) * Number(l.unitPrice) * 100) / 100,
      }))
    const subtotal    = computedLines.reduce((s, l) => s + l.lineTotal, 0)
    const totalAmount = subtotal
    updateInv({
      variables: {
        id: editDrawer.id,
        input: {
          invoiceDate:  editForm.invoiceDate,
          dueDate:      editForm.dueDate || undefined,
          items:        computedLines,
          subtotal,
          totalAmount,
        },
      },
    })
  }

  const handleCredit = () => {
    if (!creditDrawer || !creditForm.creditAmount) return alert('Enter credit amount')
    creditMemo({ variables: { id: creditDrawer.id, creditAmount: Number(creditForm.creditAmount), reason: creditForm.reason || undefined } })
  }

  const runConfirm = () => {
    if (!confirm) return
    const id = confirm.id
    if (confirm.action === 'submit')    submitInv({ variables: { id } })
    if (confirm.action === 'approve')   approveInv({ variables: { id } })
    if (confirm.action === 'reconcile') reconcileInv({ variables: { id } })
    if (confirm.action === 'sync')      syncAcct({ variables: { id } })
    if (confirm.action === 'cancel')    cancelInv({ variables: { id, input: { status: 'cancelled' } } })
  }

  const CONFIRM_LABELS: Record<string, { title: string; desc: string; label: string; destructive?: boolean }> = {
    approve:   { title: 'Approve Invoice?',          desc: 'The invoice will be posted to the general ledger.',   label: 'Approve & Post' },
    reconcile: { title: 'Mark as Paid (Reconcile)?', desc: 'The invoice will move from In Payment to Paid.',      label: 'Mark Paid' },
    sync:      { title: 'Sync Accounting?',          desc: 'Accounting entries will be re-synced for this invoice.', label: 'Sync' },
    cancel:    { title: 'Cancel Invoice?',           desc: 'The invoice will be cancelled and cannot be paid.',    label: 'Cancel Invoice', destructive: true },
  }

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Description' },
    { key: 'quantity',        header: 'Qty',       width: '80px',  type: 'number' as const },
    { key: 'unitPrice',       header: 'Unit Price', width: '100px', type: 'number' as const },
    { key: 'lineTotal',       header: 'Total',      width: '100px', readOnly: true },
  ]

  const columns: Column[] = [
    { key: 'seqNo',           label: 'Invoice #', width: '130px', render: v => <MonoCell value={v} /> },
    { key: 'customerId',      label: 'Customer',  render: v => <span className="text-sm">{String(v ?? '').slice(-8) || '—'}</span> },
    { key: 'invoiceDate',     label: 'Date',      width: '110px', render: v => <DateCell value={v} /> },
    { key: 'dueDate',         label: 'Due',       width: '110px', render: (v, r) => {
        const d = daysOverdue(v)
        return (
          <div>
            <DateCell value={v} />
            {d > 0 && !['paid','cancelled'].includes(r.status) && (
              <span className="text-[10px] text-rose-600 font-medium">{d}d overdue</span>
            )}
          </div>
        )
      }
    },
    { key: 'status',          label: 'Status',    width: '130px', render: v => <ErpBadge status={v} /> },
    { key: 'totalAmount',     label: 'Total',     width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'paidAmount',      label: 'Paid',      width: '110px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'outstandingAmount', label: 'Balance', width: '120px', align: 'right', render: (v, r) => (
        <AmountCell value={v} className={Number(v) > 0 && r.status !== 'paid' ? 'text-rose-600' : undefined} />
      )
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Customer Invoices"
        subtitle="Manage AR invoices, track payments and outstanding balances"
        icon={<ReceiptText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Finance' }, { label: 'Customer Invoices' }]}
      />

      <StatsRow cols={5}>
        <StatCard label="Total Invoices"  value={stats.total}     icon={<ReceiptText   className="h-5 w-5" />} variant="slate"  onClick={() => setFilterStatus('')} />
        <StatCard label="Pending"         value={stats.pending}   icon={<Clock         className="h-5 w-5" />} variant="amber"  onClick={() => setFilterStatus('sent')} />
        <StatCard label="In Payment"      value={stats.inPayment} icon={<DollarSign    className="h-5 w-5" />} variant="violet" onClick={() => setFilterStatus('in_payment')} />
        <StatCard label="Paid"            value={stats.paid}      icon={<CheckCircle2  className="h-5 w-5" />} variant="green"  onClick={() => setFilterStatus('paid')} />
        <StatCard label="Overdue"         value={stats.overdue}   icon={<AlertCircle   className="h-5 w-5" />} variant="rose"   onClick={() => setFilterStatus('overdue')} />
      </StatsRow>

      {/* AR Aging */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AGING_BUCKETS.map((b, i) => {
          const prevDays = i === 0 ? 0 : AGING_BUCKETS[i - 1].days
          const amount = all
            .filter((r: any) => {
              if (['paid','cancelled'].includes(r.status)) return false
              const d = daysOverdue(r.dueDate)
              return d > prevDays && d <= b.days
            })
            .reduce((s: number, r: any) => s + Number(r.outstandingAmount ?? 0), 0)
          return (
            <StatCard key={b.label} label={b.label} value={`₹${(amount / 1000).toFixed(1)}k`} variant={b.variant} />
          )
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[{ key: '', label: 'All' }, ...STATUS_PIPELINE].map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === s.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <DataTable
        data={records}
        columns={columns}
        loading={loading}
        title="Customer Invoices"
        searchable
        searchPlaceholder="Search by invoice#, customer…"
        emptyMessage="No invoices found."
        pageSize={25}
        onRowClick={(r: any) => { if (['draft','approval_declined'].includes(r.status)) openEdit(r) }}
        isRowClickable={(r: any) => ['draft','approval_declined'].includes(r.status)}
        actions={[
          {
            label: 'Edit',
            icon: <ReceiptText className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
            show: (r: any) => ['draft','approval_declined'].includes(r.status),
          },
          {
            label: 'Submit',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'submit', id: r.id }),
            show: (r: any) => ['draft','approval_declined'].includes(r.status),
          },
          {
            label: 'Approve & Post',
            icon: <ThumbsUp className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'approve', id: r.id }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Sync Accounting',
            icon: <RefreshCcw className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'sync', id: r.id }),
            show: (r: any) => ['approved','sent'].includes(r.status),
          },
          {
            label: 'Reconcile (Mark Paid)',
            icon: <CreditCard className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'reconcile', id: r.id }),
            show: (r: any) => r.status === 'in_payment',
          },
          {
            label: 'Credit Memo',
            icon: <Minus className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setCreditForm({ creditAmount: '', reason: '' }); setCreditDrawer(r) },
            show: (r: any) => ['approved','sent','partially_paid'].includes(r.status),
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'cancel', id: r.id }),
            show: (r: any) => !['cancelled','paid'].includes(r.status),
          },
        ]}
      />

      {/* Edit Invoice drawer (draft only) */}
      <FormDrawer
        open={!!editDrawer}
        onClose={() => setEditDrawer(null)}
        title={`Edit Invoice ${editDrawer?.seqNo ?? ''}`}
        description="Edit draft invoice details and line items before posting."
        size="lg"
        submitLabel="Save Changes"
        onSubmit={handleEditSave}
        submitting={updating}
      >
        <FormSection title="Invoice Details" columns={2}>
          <InputFloating label="Invoice Date *" type="date" value={editForm.invoiceDate} onChange={e => setEditForm(p => ({ ...p, invoiceDate: e.target.value }))} />
          <InputFloating label="Due Date"       type="date" value={editForm.dueDate}     onChange={e => setEditForm(p => ({ ...p, dueDate: e.target.value }))} />
        </FormSection>
        <FormSection title="Line Items" columns={1}>
          <LineItemsEditor
            columns={LINE_COLS}
            rows={editLines}
            onChange={rows => setEditLines((rows as typeof editLines).map(l => ({
              ...l,
              lineTotal: Math.round(Number(l.quantity) * Number(l.unitPrice) * 100) / 100,
            })))}
            onAddRow={() => ({ ...BLANK_LINE })}
          />
        </FormSection>
      </FormDrawer>

      {/* Credit Memo drawer */}
      <FormDrawer
        open={!!creditDrawer}
        onClose={() => setCreditDrawer(null)}
        title={`Credit Memo — ${creditDrawer?.seqNo ?? ''}`}
        description="Issue a partial or full credit against this invoice."
        size="sm"
        submitLabel="Issue Credit"
        onSubmit={handleCredit}
        submitting={crediting}
      >
        <FormSection columns={1}>
          <InputFloating
            label="Credit Amount *"
            type="number"
            value={creditForm.creditAmount}
            onChange={e => setCreditForm(p => ({ ...p, creditAmount: e.target.value }))}
          />
          <SelectFloating
            label="Reason"
            value={creditForm.reason}
            onChange={v => setCreditForm(p => ({ ...p, reason: typeof v === 'string' ? v : (v as any).target.value }))}
            options={[
              { value: '', label: 'Select reason…' },
              { value: 'returned_goods',         label: 'Returned Goods' },
              { value: 'overcharge',             label: 'Overcharge / Price Error' },
              { value: 'damaged_goods',          label: 'Damaged Goods' },
              { value: 'early_payment_discount', label: 'Early Payment Discount' },
              { value: 'other',                  label: 'Other' },
            ]}
          />
        </FormSection>
      </FormDrawer>

      {/* Confirm dialogs */}
      {confirm && CONFIRM_LABELS[confirm.action] && (
        <ConfirmDialog
          open onClose={() => setConfirm(null)} onConfirm={runConfirm}
          title={CONFIRM_LABELS[confirm.action].title}
          description={CONFIRM_LABELS[confirm.action].desc}
          confirmLabel={CONFIRM_LABELS[confirm.action].label}
          destructive={!!(CONFIRM_LABELS[confirm.action] as any).destructive}
        />
      )}
    </div>
  )
}
