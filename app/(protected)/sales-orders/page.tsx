'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_SALES_ORDERS, CREATE_SALES_ORDER, UPDATE_SALES_ORDER,
  SUBMIT_SALES_ORDER, APPROVE_SALES_ORDER, REJECT_SALES_ORDER,
  CREATE_INVOICE_FROM_SALES_ORDER,
} from '@/gql/queries'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerSelectOptions,
} from '@/lib/sales-customer-options'
import { DataTable, type Column } from '@/components/DataTable'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag, FileText, Clock, CheckCircle2, Package,
  Ban, Send, Plus, ThumbsUp, ThumbsDown, ReceiptText,
} from 'lucide-react'

const BLANK_LINE = { itemDescription: '', quantity: 1, unitPrice: 0, lineTotal: 0 }

const BLANK_FORM = {
  customerId: '',
  orderDate:  new Date().toISOString().split('T')[0],
  deliveryDate: '',
  invoicingPolicy: 'ordered_quantities',
  notes: '',
}

const STATUS_PIPELINE = [
  { key: 'draft',     label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'approved',  label: 'Approved' },
  { key: 'active',    label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function SalesOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [invoiceDrawer, setInvoiceDrawer] = useState<any>(null)
  const [invoiceForm, setInvoiceForm]     = useState({ invoiceDate: new Date().toISOString().split('T')[0], dueDate: '' })
  const [filterStatus, setFilterStatus] = useState('')
  const [confirm, setConfirm] = useState<{ action: string; id: string } | null>(null)
  const [form, setForm]   = useState({ ...BLANK_FORM })
  const [lines, setLines] = useState([{ ...BLANK_LINE }])

  const { data, loading, refetch } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId ?? '' },
    skip: !orgId,
  })

  const done = () => { refetch(); setDrawerOpen(false); setConfirm(null); setInvoiceDrawer(null) }
  const err  = (e: any) => alert(e.message)

  const [createSO, { loading: creating }]         = useMutation(CREATE_SALES_ORDER,               { onCompleted: done, onError: err })
  const [submitSO]                                 = useMutation(SUBMIT_SALES_ORDER,               { onCompleted: done, onError: err })
  const [approveSO]                                = useMutation(APPROVE_SALES_ORDER,              { onCompleted: done, onError: err })
  const [rejectSO]                                 = useMutation(REJECT_SALES_ORDER,               { onCompleted: done, onError: err })
  const [updateSO]                                 = useMutation(UPDATE_SALES_ORDER,               { onCompleted: done, onError: err })
  const [createInvoice, { loading: invoicing }]    = useMutation(CREATE_INVOICE_FROM_SALES_ORDER,  { onCompleted: done, onError: err })

  const all: any[]     = data?.salesorders ?? []
  const records        = all.filter((r: any) => !filterStatus || r.status === filterStatus)
  const customers      = mapSalesCustomers(customersData?.customers)

  // Build id→name lookup for display
  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))

  const stats = {
    total:     all.length,
    draft:     all.filter((r: any) => r.status === 'draft').length,
    active:    all.filter((r: any) => ['approved','active'].includes(r.status)).length,
    completed: all.filter((r: any) => r.status === 'completed').length,
    cancelled: all.filter((r: any) => r.status === 'cancelled').length,
  }

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const computeLines = (rows: any[]) => rows.map(l => ({
    ...l,
    lineTotal: Math.round(Number(l.quantity) * Number(l.unitPrice) * 100) / 100,
  }))

  const handleCreate = () => {
    if (!form.customerId) return alert('Select a customer')
    if (!lines.some(l => l.itemDescription?.trim())) return alert('Add at least one item')
    const computed = computeLines(lines.filter(l => l.itemDescription?.trim()))
    const subtotal  = computed.reduce((s, l) => s + Number(l.lineTotal), 0)
    createSO({
      variables: {
        input: {
          customerId: form.customerId,
          orderDate: form.orderDate,
          deliveryDate: form.deliveryDate || undefined,
          invoicingPolicy: form.invoicingPolicy,
          subtotal,
          taxAmount: 0,
          totalAmount: subtotal,
          organizationId: orgId,
          items: computed.map(l => ({
            itemDescription: l.itemDescription.trim(),
            quantity: Number(l.quantity),
            unitPrice: Number(l.unitPrice),
            lineTotal: Number(l.lineTotal),
          })),
        },
      },
    })
  }

  const handleCreateInvoice = () => {
    if (!invoiceDrawer || !invoiceForm.invoiceDate) return alert('Enter invoice date')
    createInvoice({
      variables: {
        salesOrderId: invoiceDrawer.id,
        invoiceDate: invoiceForm.invoiceDate,
        dueDate: invoiceForm.dueDate || undefined,
      },
    })
  }

  const runConfirm = () => {
    if (!confirm) return
    const id = confirm.id
    if (confirm.action === 'submit')   submitSO({ variables: { id } })
    if (confirm.action === 'approve')  approveSO({ variables: { id } })
    if (confirm.action === 'reject')   rejectSO({ variables: { id } })
    if (confirm.action === 'complete') updateSO({ variables: { id, input: { status: 'completed' } } })
    if (confirm.action === 'cancel')   updateSO({ variables: { id, input: { status: 'cancelled' } } })
  }

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Description',  placeholder: 'Item / service' },
    { key: 'quantity',        header: 'Qty',           width: '80px',  type: 'number' as const },
    { key: 'unitPrice',       header: 'Unit Price',    width: '100px', type: 'number' as const },
    { key: 'lineTotal',       header: 'Line Total',    width: '100px', readOnly: true },
  ]

  const LABELS: Record<string, { title: string; desc: string; label: string; destructive?: boolean }> = {
    submit:   { title: 'Submit for Approval?',  desc: 'The SO will be sent to the approver.',        label: 'Submit' },
    approve:  { title: 'Approve Sales Order?',  desc: 'The SO will be marked approved.',             label: 'Approve' },
    reject:   { title: 'Reject Sales Order?',   desc: 'The SO will be sent back as rejected.',       label: 'Reject', destructive: true },
    complete: { title: 'Mark as Completed?',    desc: 'Confirm this order is fully delivered and invoiced.', label: 'Complete' },
    cancel:   { title: 'Cancel Sales Order?',   desc: 'The order will be cancelled permanently.',    label: 'Cancel', destructive: true },
  }

  const columns: Column[] = [
    { key: 'seqNo',       label: 'SO #',       width: '130px', render: v => <MonoCell value={v} /> },
    { key: 'customerId',  label: 'Customer',   render: (v) => <span className="text-sm font-medium">{customerMap[v] ?? (String(v ?? '').slice(-8) || '—')}</span> },
    { key: 'orderDate',   label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'status',      label: 'Status',     width: '130px', render: v => <ErpBadge status={v} /> },
    { key: 'invoicingPolicy', label: 'Policy', width: '110px', render: v => <span className="text-[11px] text-muted-foreground">{v === 'delivered_quantities' ? 'On Delivery' : 'On Order'}</span> },
    { key: 'totalAmount', label: 'Total',      width: '130px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'cashSale',    label: 'Cash Sale',  width: '90px',  render: v => v ? <ErpBadge status="active" label="Cash" /> : null },
    { key: 'createdAt',   label: 'Created',    width: '110px', render: v => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Sales Orders"
        subtitle="Track and manage all customer orders through their full lifecycle"
        icon={<ShoppingBag className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Sales Orders' }]}
        actions={
          <Button onClick={() => { setForm({ ...BLANK_FORM }); setLines([{ ...BLANK_LINE }]); setDrawerOpen(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Sales Order
          </Button>
        }
      />

      <StatsRow cols={5}>
        <StatCard label="Total"     value={stats.total}     icon={<FileText      className="h-5 w-5" />} variant="slate"  onClick={() => setFilterStatus('')} />
        <StatCard label="Draft"     value={stats.draft}     icon={<Clock         className="h-5 w-5" />} variant="amber"  onClick={() => setFilterStatus('draft')} />
        <StatCard label="Active"    value={stats.active}    icon={<ShoppingBag   className="h-5 w-5" />} variant="blue"   onClick={() => setFilterStatus('approved')} />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2  className="h-5 w-5" />} variant="green"  onClick={() => setFilterStatus('completed')} />
        <StatCard label="Cancelled" value={stats.cancelled} icon={<Ban           className="h-5 w-5" />} variant="rose"   onClick={() => setFilterStatus('cancelled')} />
      </StatsRow>

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
        title="All Sales Orders"
        searchable
        searchPlaceholder="Search by SO#, customer…"
        emptyMessage="No sales orders found."
        pageSize={25}
        actions={[
          {
            label: 'Submit',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'submit', id: r.id }),
            show: (r: any) => r.status === 'draft' && !r.cashSale,
          },
          {
            label: 'Approve',
            icon: <ThumbsUp className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'approve', id: r.id }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Reject',
            icon: <ThumbsDown className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'reject', id: r.id }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Create Invoice',
            icon: <ReceiptText className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setInvoiceForm({ invoiceDate: new Date().toISOString().split('T')[0], dueDate: '' }); setInvoiceDrawer(r) },
            show: (r: any) => ['approved','active'].includes(r.status),
          },
          {
            label: 'Complete',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'complete', id: r.id }),
            show: (r: any) => r.status === 'active',
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'cancel', id: r.id }),
            show: (r: any) => !['cancelled','completed','refunded'].includes(r.status),
          },
        ]}
      />

      {/* New SO drawer */}
      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New Sales Order"
        description="Create a draft sales order. Submit for approval to proceed."
        size="lg"
        submitLabel="Save Sales Order"
        onSubmit={handleCreate}
        submitting={creating}
      >
        <FormSection title="Customer & Dates" columns={2}>
          <SelectFloating
            label="Customer *"
            value={form.customerId}
            onChange={v => setF('customerId', typeof v === 'string' ? v : (v as any).target.value)}
            options={customerSelectOptions(customers)}
          />
          <SelectFloating
            label="Invoicing Policy"
            value={form.invoicingPolicy}
            onChange={v => setF('invoicingPolicy', typeof v === 'string' ? v : (v as any).target.value)}
            options={[
              { value: 'ordered_quantities',   label: 'Ordered Quantities (invoice on order)' },
              { value: 'delivered_quantities',  label: 'Delivered Quantities (invoice on delivery)' },
            ]}
          />
          <InputFloating label="Order Date *"   type="date" value={form.orderDate}    onChange={e => setF('orderDate', e.target.value)} />
          <InputFloating label="Delivery Date"  type="date" value={form.deliveryDate} onChange={e => setF('deliveryDate', e.target.value)} />
        </FormSection>
        <FormSection title="Items" columns={1}>
          <LineItemsEditor
            columns={LINE_COLS}
            rows={lines}
            onChange={r => setLines(computeLines(r))}
            onAddRow={() => ({ ...BLANK_LINE })}
          />
        </FormSection>
      </FormDrawer>

      {/* Create Invoice drawer */}
      <FormDrawer
        open={!!invoiceDrawer}
        onClose={() => setInvoiceDrawer(null)}
        title={`Create Invoice — ${invoiceDrawer?.seqNo ?? ''}`}
        description="Create a customer invoice from this sales order."
        size="sm"
        submitLabel="Create Invoice"
        onSubmit={handleCreateInvoice}
        submitting={invoicing}
      >
        <FormSection columns={1}>
          <InputFloating label="Invoice Date *" type="date" value={invoiceForm.invoiceDate} onChange={e => setInvoiceForm(p => ({ ...p, invoiceDate: e.target.value }))} />
          <InputFloating label="Due Date"       type="date" value={invoiceForm.dueDate}     onChange={e => setInvoiceForm(p => ({ ...p, dueDate: e.target.value }))} />
        </FormSection>
      </FormDrawer>

      {confirm && LABELS[confirm.action] && (
        <ConfirmDialog
          open onClose={() => setConfirm(null)} onConfirm={runConfirm}
          title={LABELS[confirm.action].title}
          description={LABELS[confirm.action].desc}
          confirmLabel={LABELS[confirm.action].label}
          destructive={!!LABELS[confirm.action].destructive}
        />
      )}
    </div>
  )
}
