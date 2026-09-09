'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_SALES_RETURNS,
  CREATE_SALES_RETURN,
  SUBMIT_SALES_RETURN_FOR_APPROVAL,
  GET_SALES_ORDERS,
  GET_CUSTOMER_INVOICES,
} from '@/gql/queries'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
} from '@/lib/sales-customer-options'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell, AmountCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Send, RotateCcw, Clock, CheckCircle2 } from 'lucide-react'

const REASONS = [
  'Returned goods',
  'Damaged goods',
  'Wrong item shipped',
  'Customer cancelled',
  'Quality issue',
  'Other',
]

function srStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

interface ReturnLine {
  id?: string
  itemName: string
  quantity: number
  unit: string
  unitPrice: number
  amount?: number
  notes?: string
}

export default function SalesReturnsPage() {
  const { user: authUser } = useAuth()
  const orgId = authUser?.organizationId || ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    docDate: new Date().toISOString().slice(0, 10),
    customerId: '',
    customerName: '',
    salesOrderId: '',
    salesOrderNumber: '',
    customerInvoiceId: '',
    customerInvoiceNumber: '',
    reason: '',
    notes: '',
    items: [] as ReturnLine[],
  })

  const listQ = useQuery(GET_SALES_RETURNS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const customersQ = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const sosQ = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    errorPolicy: 'ignore',
  })
  const invQ = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    errorPolicy: 'ignore',
  })

  const [createSalesReturn, { loading: creating }] = useMutation(CREATE_SALES_RETURN, {
    onCompleted: () => {
      setOpen(false)
      resetForm()
      listQ.refetch()
      toast.success('Sales return saved as Draft')
    },
    onError: (e) => toast.error(e.message),
  })

  const [submitSalesReturnForApproval] = useMutation(SUBMIT_SALES_RETURN_FOR_APPROVAL, {
    onCompleted: () => {
      listQ.refetch()
      toast.success('Sent for approval')
    },
    onError: (e) => toast.error(e.message),
  })

  const items: any[] = listQ.data?.salesreturns || []
  const customers = mapSalesCustomers(customersQ.data?.customers)
  const salesOrders: any[] = sosQ.data?.salesorders ?? []
  const invoices: any[] = invQ.data?.customerinvoices ?? []

  const customerOptions = useMemo(
    () => [
      { value: '', label: '— Select —' },
      ...customers.map((c) => ({ value: c.id, label: c.name })),
    ],
    [customers],
  )
  const soOptions = useMemo(
    () => [
      { value: '', label: '— Optional —' },
      ...salesOrders.map((so: any) => ({
        value: String(so.id),
        label: so.seqNo || String(so.id).slice(-6),
      })),
    ],
    [salesOrders],
  )
  const invoiceOptions = useMemo(() => {
    const filtered = form.customerId
      ? invoices.filter((inv: any) => String(inv.customerId) === form.customerId)
      : invoices
    return [
      { value: '', label: '— Optional —' },
      ...filtered.map((inv: any) => ({
        value: String(inv.id),
        label: `${inv.seqNo || 'INV'} — ₹${Number(inv.totalAmount || 0).toLocaleString('en-IN')}`,
      })),
    ]
  }, [invoices, form.customerId])

  const draft = items.filter((i) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(i.status).toUpperCase())).length
  const approved = items.filter((i) => String(i.status).toUpperCase() === 'APPROVED').length

  function resetForm() {
    setForm({
      docDate: new Date().toISOString().slice(0, 10),
      customerId: '',
      customerName: '',
      salesOrderId: '',
      salesOrderNumber: '',
      customerInvoiceId: '',
      customerInvoiceNumber: '',
      reason: '',
      notes: '',
      items: [],
    })
  }

  const lineColumns: LineColumn<ReturnLine>[] = [
    { key: 'itemName', header: 'Item', minWidth: 180, placeholder: 'Product / item name' },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 90 },
    { key: 'unit', header: 'Unit', minWidth: 80 },
    { key: 'unitPrice', header: 'Unit price', type: 'money', align: 'right', minWidth: 110 },
    {
      key: 'amount',
      header: 'Amount',
      type: 'money',
      align: 'right',
      readOnly: true,
      compute: (r) => Number(r.quantity || 0) * Number(r.unitPrice || 0),
      minWidth: 120,
    },
    { key: 'notes', header: 'Notes', minWidth: 140 },
  ]

  const onCustomerChange = (customerId: string) => {
    const name = customers.find((c) => c.id === customerId)?.name?.trim() || ''
    setForm((p) => ({
      ...p,
      customerId,
      customerName: name,
      customerInvoiceId: '',
      customerInvoiceNumber: '',
    }))
  }

  const onSalesOrderChange = (salesOrderId: string) => {
    const so = salesOrders.find((s: any) => String(s.id) === salesOrderId)
    setForm((p) => {
      const next = {
        ...p,
        salesOrderId,
        salesOrderNumber: so?.seqNo || '',
      }
      if (so?.customerId) {
        const cid = String(so.customerId)
        next.customerId = cid
        next.customerName = customers.find((c) => c.id === cid)?.name?.trim() || p.customerName
      }
      return next
    })
  }

  const onInvoiceChange = (customerInvoiceId: string) => {
    const inv = invoices.find((i: any) => String(i.id) === customerInvoiceId)
    setForm((p) => {
      const next = {
        ...p,
        customerInvoiceId,
        customerInvoiceNumber: inv?.seqNo || '',
      }
      if (inv?.customerId) {
        const cid = String(inv.customerId)
        next.customerId = cid
        next.customerName = customers.find((c) => c.id === cid)?.name?.trim() || p.customerName
      }
      return next
    })
  }

  const submit = () => {
    if (!form.docDate) return toast.error('Document date is required')
    if (!form.customerId) return toast.error('Customer is required')
    if (!form.reason.trim()) return toast.error('Reason is required')
    const cleanItems = form.items.filter((i) => i.itemName?.trim() && Number(i.quantity) > 0)
    if (cleanItems.length === 0) return toast.error('Add at least one item with quantity')

    const mapped = cleanItems.map((i) => {
      const quantity = Number(i.quantity)
      const unitPrice = Number(i.unitPrice || 0)
      return {
        itemName: i.itemName.trim(),
        quantity,
        unit: i.unit || 'unit',
        unitPrice,
        amount: quantity * unitPrice,
        notes: i.notes || undefined,
      }
    })
    const totalAmount = mapped.reduce((s, i) => s + i.amount, 0)

    createSalesReturn({
      variables: {
        input: {
          organizationId: orgId,
          docDate: form.docDate,
          customerId: form.customerId,
          customerName: form.customerName || undefined,
          salesOrderId: form.salesOrderId || undefined,
          salesOrderNumber: form.salesOrderNumber || undefined,
          customerInvoiceId: form.customerInvoiceId || undefined,
          customerInvoiceNumber: form.customerInvoiceNumber || undefined,
          reason: form.reason.trim(),
          notes: form.notes || undefined,
          totalAmount,
          items: mapped,
        },
      },
    })
  }

  const resolveCustomer = (row: any) => {
    const fromList = customers.find((c) => c.id === row.customerId)?.name
    if (fromList) return fromList
    const stored = String(row.customerName || '').replace(/\s*\([^)]*\)\s*$/, '').trim()
    return stored || '—'
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Document #', width: '120px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'customerName',
      label: 'Customer',
      render: (_v, row) => <span className="text-sm font-medium">{resolveCustomer(row)}</span>,
    },
    {
      key: 'salesOrderNumber',
      label: 'Sales order',
      width: '130px',
      render: (v) => <MonoCell value={v || '—'} />,
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span>,
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (v) => <ErpBadge status={srStatusLabel(v)} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Sales Returns"
        subtitle="Record goods returned by the customer — link SO/invoice, list items, then approve"
        icon={<RotateCcw className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Sales Returns' }]}
        actions={
          <Button
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Return
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={items.length} icon={<RotateCcw className="h-5 w-5" />} variant="slate" />
        <StatCard label="Awaiting action" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={items}
        columns={columns}
        loading={listQ.loading}
        title="All Sales Returns"
        searchable
        searchPlaceholder="Search returns…"
        emptyMessage="No sales returns found."
        pageSize={25}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r) => submitSalesReturnForApproval({ variables: { id: r.id } }),
            show: (r) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(r.status || '').toUpperCase()),
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="New Sales Return"
        description="Capture customer, reason, and returned items. Saves as Draft."
        icon={<RotateCcw className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Save return"
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Doc date *</Label>
              <Input
                type="date"
                value={form.docDate}
                onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Customer *</Label>
              <select
                value={form.customerId}
                onChange={(e) => onCustomerChange(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {customerOptions.map((o) => (
                  <option key={o.value || 'empty'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Reason *</Label>
              <select
                value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Select —</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Sales order</Label>
              <select
                value={form.salesOrderId}
                onChange={(e) => onSalesOrderChange(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {soOptions.map((o) => (
                  <option key={o.value || 'empty'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Related invoice</Label>
              <select
                value={form.customerInvoiceId}
                onChange={(e) => onInvoiceChange(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {invoiceOptions.map((o) => (
                  <option key={o.value || 'empty'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Returned items" description="At least one line is required." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<ReturnLine>
            columns={lineColumns}
            rows={form.items}
            onChange={(rows) => setForm((p) => ({ ...p, items: rows }))}
            buildRow={() => ({ itemName: '', quantity: 1, unit: 'unit', unitPrice: 0 })}
            totals={[{ key: 'amount', label: '₹', format: 'money' }]}
            minRows={1}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}
