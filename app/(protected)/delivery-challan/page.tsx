'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_DELIVERY_CHALLANS,
  CREATE_DELIVERY_CHALLAN,
  SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL,
  GET_SALES_ORDERS,
} from '@/gql/queries'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerSelectOptions,
} from '@/lib/sales-customer-options'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Send, Truck, Clock, CheckCircle2 } from 'lucide-react'

function dcStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

interface ChallanLine {
  id?: string
  itemName: string
  quantity: number
  unit: string
  notes?: string
}

export default function DeliveryChallansPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    customerId: '',
    customerName: '',
    salesOrderId: '',
    salesOrderNumber: '',
    shippingAddress: '',
    vehicleNumber: '',
    driverName: '',
    notes: '',
    items: [] as ChallanLine[],
  })

  const listQ = useQuery(GET_DELIVERY_CHALLANS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const customersQ = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const sosQ = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const [createDeliveryChallan, { loading: creating }] = useMutation(CREATE_DELIVERY_CHALLAN, {
    onCompleted: () => {
      setOpen(false)
      resetForm()
      listQ.refetch()
      toast.success('Delivery challan created')
    },
    onError: (err) => toast.error(err.message),
  })

  const [submitDeliveryChallanForApproval] = useMutation(SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL, {
    onCompleted: () => {
      listQ.refetch()
      toast.success('Sent for approval')
    },
    onError: (err) => toast.error(err.message),
  })

  const items: any[] = listQ.data?.deliverychallans || []
  const customers = mapSalesCustomers(customersQ.data?.customers)
  const salesOrders: any[] = sosQ.data?.salesorders ?? []

  const customerOptions = customerSelectOptions(customers, '— Select —')
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

  const draft = items.filter((i) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(i.status).toUpperCase())).length
  const approved = items.filter((i) => String(i.status).toUpperCase() === 'APPROVED').length

  function resetForm() {
    setForm({
      docDate: new Date().toISOString().split('T')[0],
      customerId: '',
      customerName: '',
      salesOrderId: '',
      salesOrderNumber: '',
      shippingAddress: '',
      vehicleNumber: '',
      driverName: '',
      notes: '',
      items: [],
    })
  }

  const lineColumns: LineColumn<ChallanLine>[] = [
    { key: 'itemName', header: 'Item', minWidth: 180, placeholder: 'Product / item name' },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 90 },
    { key: 'unit', header: 'Unit', minWidth: 80 },
    { key: 'notes', header: 'Notes', minWidth: 160 },
  ]

  const resolveCustomerLabel = (customerId?: string | null, stored?: string | null) => {
    const fromList = customers.find((c) => c.id === customerId)?.name?.trim()
    if (fromList) return fromList
    const storedName = String(stored || '').replace(/\s*\([^)]*\)\s*$/, '').trim()
    if (storedName && storedName !== '—') return storedName
    return '—'
  }

  const onCustomerChange = (customerId: string) => {
    const name = customers.find((c) => c.id === customerId)?.name?.trim() || ''
    setForm((p) => ({
      ...p,
      customerId,
      customerName: name,
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
        next.customerName = customers.find((c) => c.id === cid)?.name?.trim() || ''
      }
      return next
    })
  }

  const submit = () => {
    if (!form.docDate) return toast.error('Document date is required')
    if (!form.customerId) return toast.error('Customer is required')
    const cleanItems = form.items.filter((i) => i.itemName?.trim() && Number(i.quantity) > 0)
    if (cleanItems.length === 0) return toast.error('Add at least one item with quantity')

    const resolvedName = resolveCustomerLabel(form.customerId, form.customerName)
    if (!resolvedName || resolvedName === '—') return toast.error('Customer name could not be resolved')

    createDeliveryChallan({
      variables: {
        input: {
          organizationId: orgId,
          docDate: form.docDate,
          customerId: form.customerId,
          customerName: resolvedName,
          salesOrderId: form.salesOrderId || undefined,
          salesOrderNumber: form.salesOrderNumber || undefined,
          shippingAddress: form.shippingAddress || undefined,
          vehicleNumber: form.vehicleNumber || undefined,
          driverName: form.driverName || undefined,
          notes: form.notes || undefined,
          items: cleanItems.map((i) => ({
            itemName: i.itemName.trim(),
            quantity: Number(i.quantity),
            unit: i.unit || 'unit',
            notes: i.notes || undefined,
          })),
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Document #', width: '130px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'customerName',
      label: 'Customer',
      render: (v, row) => (
        <span className="text-sm font-medium">{resolveCustomerLabel(row.customerId, v)}</span>
      ),
    },
    {
      key: 'salesOrderNumber',
      label: 'Sales order',
      width: '130px',
      render: (v) => <MonoCell value={v || '—'} />,
    },
    {
      key: 'items',
      label: 'Lines',
      width: '70px',
      align: 'right',
      render: (v) => <span className="text-sm tabular-nums">{Array.isArray(v) ? v.length : 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (v) => <ErpBadge status={dcStatusLabel(v)} />,
    },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Delivery Challans"
        subtitle="Goods delivery note for the customer — link a sales order and list items shipped"
        icon={<Truck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Delivery Challans' }]}
        actions={
          <Button
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Challan
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={items.length} icon={<Truck className="h-5 w-5" />} variant="slate" />
        <StatCard label="Awaiting action" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={items}
        columns={columns}
        loading={listQ.loading}
        title="All Delivery Challans"
        searchable
        searchPlaceholder="Search challans…"
        emptyMessage="No delivery challans found."
        pageSize={25}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r) => submitDeliveryChallanForApproval({ variables: { id: r.id } }),
            show: (r) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(r.status || '').toUpperCase()),
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="New Delivery Challan"
        description="Create a delivery note with customer, sales order, and item lines."
        icon={<Truck className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Save challan"
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
            <div className="space-y-1.5 sm:col-span-3">
              <Label>Shipping address</Label>
              <Input
                value={form.shippingAddress}
                onChange={(e) => setForm((p) => ({ ...p, shippingAddress: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle</Label>
              <Input
                value={form.vehicleNumber}
                onChange={(e) => setForm((p) => ({ ...p, vehicleNumber: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Driver</Label>
              <Input
                value={form.driverName}
                onChange={(e) => setForm((p) => ({ ...p, driverName: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="E2E delivery challan"
              />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Items" description="At least one line is required." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<ChallanLine>
            columns={lineColumns}
            rows={form.items}
            onChange={(rows) => setForm((p) => ({ ...p, items: rows }))}
            buildRow={() => ({ itemName: '', quantity: 1, unit: 'unit' })}
            minRows={1}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}
