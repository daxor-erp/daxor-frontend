'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_DELIVERY_ORDERS,
  CREATE_DELIVERY_ORDER,
  DELETE_DELIVERY_ORDER,
  TRANSITION_DELIVERY_STATUS,
  CANCEL_DELIVERY_ORDER,
  GET_CUSTOMERS,
  GET_SALES_ORDERS,
} from '@/gql/queries'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { DataTable, type Column } from '@/components/DataTable'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatStatus } from '@/lib/format-status'
import {
  Plus, Truck, Package, CheckCircle2, Trash2, Send, Ban,
} from 'lucide-react'
import { formatNumber } from '@/lib/format-money'

const STATUSES = ['DRAFT', 'READY', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED']

interface DeliveryRow {
  id?: string
  itemId?: string
  itemName: string
  quantity: number
  unit: string
  notes?: string
}

export default function DeliveryOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [form, setForm] = useState({
    docNumber: '',
    customerId: '',
    customerName: '',
    salesOrderId: '',
    deliveryDate: new Date().toISOString().slice(0, 10),
    expectedArrival: '',
    shippingAddress: '',
    carrier: '',
    trackingNumber: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    items: [] as DeliveryRow[],
    notes: '',
  })

  const listQ = useQuery(GET_DELIVERY_ORDERS, {
    variables: { organizationId: orgId, status: statusFilter || null, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const customersQ = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const sosQ = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_DELIVERY_ORDER, {
    onCompleted: () => { listQ.refetch(); setOpen(false); resetForm(); toast.success('Delivery order created') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_DELIVERY_ORDER, {
    onCompleted: () => { listQ.refetch(); toast.success('Removed') },
    onError: (e) => toast.error(e.message),
  })
  const [cancelMutation] = useMutation(CANCEL_DELIVERY_ORDER, {
    onCompleted: () => { listQ.refetch(); toast.success('Delivery order cancelled') },
    onError: (e) => toast.error(e.message),
  })
  const [transitionMutation] = useMutation(TRANSITION_DELIVERY_STATUS, {
    onCompleted: (d) => {
      listQ.refetch()
      toast.success(`Status → ${formatStatus(d.transitionDeliveryOrderStatus.status)}`)
    },
    onError: (e) => toast.error(e.message),
  })

  const docs: any[] = listQ.data?.deliveryOrders ?? []
  const customers: any[] = customersQ.data?.customers ?? []
  const salesOrders: any[] = sosQ.data?.salesorders ?? []

  const stats = useMemo(() => {
    const dispatched = docs.filter((d) => ['DISPATCHED', 'IN_TRANSIT'].includes(String(d.status).toUpperCase())).length
    const delivered = docs.filter((d) => String(d.status).toUpperCase() === 'DELIVERED').length
    const totalQty = docs.reduce((s, d) => s + Number(d.totalQuantity ?? 0), 0)
    return { dispatched, delivered, totalQty }
  }, [docs])

  function resetForm() {
    setForm({
      docNumber: '',
      customerId: '',
      customerName: '',
      salesOrderId: '',
      deliveryDate: new Date().toISOString().slice(0, 10),
      expectedArrival: '',
      shippingAddress: '',
      carrier: '',
      trackingNumber: '',
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      items: [],
      notes: '',
    })
  }

  const lineColumns: LineColumn<DeliveryRow>[] = [
    { key: 'itemName', header: 'Item', minWidth: 180, placeholder: 'Item description' },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 90 },
    { key: 'unit', header: 'Unit', minWidth: 80 },
    { key: 'notes', header: 'Notes', minWidth: 180 },
  ]

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc #', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'customerName', label: 'Customer', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'deliveryDate', label: 'Delivery Date', width: '120px', render: (v) => <DateCell value={v} /> },
    { key: 'carrier', label: 'Carrier', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'trackingNumber', label: 'Tracking', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'totalQuantity', label: 'Qty', width: '80px', align: 'right', render: (v) => <span className="tabular-nums text-sm">{Number(v ?? 0)}</span> },
    { key: 'status', label: 'Status', width: '130px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  const submit = () => {
    if (!form.docNumber.trim()) return toast.error('Doc number required')
    if (form.items.length === 0) return toast.error('Add at least one item')
    const cleanItems = form.items.filter((i) => i.itemName?.trim() && Number(i.quantity) > 0)
    if (cleanItems.length === 0) return toast.error('At least one valid item is required')
    createMutation({
      variables: {
        input: {
          organizationId: orgId,
          docNumber: form.docNumber.trim().toUpperCase(),
          customerId: form.customerId || undefined,
          customerName: form.customerName || undefined,
          salesOrderId: form.salesOrderId || undefined,
          deliveryDate: form.deliveryDate,
          expectedArrival: form.expectedArrival || undefined,
          shippingAddress: form.shippingAddress || undefined,
          carrier: form.carrier || undefined,
          trackingNumber: form.trackingNumber || undefined,
          vehicleNumber: form.vehicleNumber || undefined,
          driverName: form.driverName || undefined,
          driverPhone: form.driverPhone || undefined,
          items: cleanItems.map((i) => ({
            itemName: i.itemName.trim(),
            quantity: Number(i.quantity),
            unit: i.unit || 'unit',
            notes: i.notes || undefined,
          })),
          notes: form.notes || undefined,
        },
      },
    })
  }

  return (
    <div className="erp-shell">
      <PageHeader
        title="Delivery Orders"
        subtitle="Track shipments — from preparation through dispatch, transit, and customer signature."
        icon={<Truck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Delivery Orders' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-2 text-xs"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Delivery
            </Button>
          </div>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={formatNumber(docs.length)} icon={<Truck className="h-5 w-5" />} variant="blue" />
        <StatCard label="Dispatched / In Transit" value={formatNumber(stats.dispatched)} icon={<Send className="h-5 w-5" />} variant="violet" />
        <StatCard label="Delivered" value={formatNumber(stats.delivered)} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Units Shipped" value={formatNumber(stats.totalQty)} icon={<Package className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      <DataTable
        data={docs}
        columns={columns}
        loading={listQ.loading}
        title="All Delivery Orders"
        searchable
        searchPlaceholder="Search deliveries…"
        emptyMessage="No delivery orders found."
        pageSize={25}
        actions={[
          {
            label: 'Mark Ready',
            icon: <Package className="h-3.5 w-3.5" />,
            onClick: (r: any) => transitionMutation({ variables: { id: r.id, status: 'READY' } }),
            show: (r: any) => String(r.status).toUpperCase() === 'DRAFT',
          },
          {
            label: 'Dispatch',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => transitionMutation({ variables: { id: r.id, status: 'DISPATCHED' } }),
            show: (r: any) => String(r.status).toUpperCase() === 'READY',
          },
          {
            label: 'Mark Delivered',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => transitionMutation({ variables: { id: r.id, status: 'DELIVERED' } }),
            show: (r: any) => ['DISPATCHED', 'IN_TRANSIT'].includes(String(r.status).toUpperCase()),
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              if (confirm(`Cancel delivery order ${r.docNumber}? If already dispatched, stock will be reversed.`)) {
                cancelMutation({ variables: { id: r.id } })
              }
            },
            show: (r: any) => !['DELIVERED', 'CANCELLED'].includes(String(r.status).toUpperCase()),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              if (confirm(`Delete ${r.docNumber}?`)) deleteMutation({ variables: { id: r.id } })
            },
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="New delivery order"
        description="Create a shipment document — items, customer, carrier, tracking."
        icon={<Truck className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Create delivery"
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Doc number *</Label>
              <Input value={form.docNumber} onChange={(e) => setForm({ ...form, docNumber: e.target.value.toUpperCase() })} className="font-mono" placeholder="DO-001" />
            </div>
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <select
                value={form.customerId}
                onChange={(e) => {
                  const c = customers.find((x: any) => x.id === e.target.value)
                  setForm({ ...form, customerId: e.target.value, customerName: c?.name ?? '' })
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Select —</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Sales order (optional)</Label>
              <select
                value={form.salesOrderId}
                onChange={(e) => setForm({ ...form, salesOrderId: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {salesOrders.map((s: any) => <option key={s.id} value={s.id}>SO #{s.seqNo ?? s.id.slice(-6)}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Delivery date *</Label>
              <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Expected arrival</Label>
              <Input type="date" value={form.expectedArrival} onChange={(e) => setForm({ ...form, expectedArrival: e.target.value })} />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Logistics" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Carrier</Label>
              <Input value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} placeholder="DTDC / BlueDart / In-house" />
            </div>
            <div className="space-y-1.5">
              <Label>Tracking number</Label>
              <Input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle</Label>
              <Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} className="font-mono" placeholder="KA-01-AB-1234" />
            </div>
            <div className="space-y-1.5">
              <Label>Driver name</Label>
              <Input value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Driver phone</Label>
              <Input value={form.driverPhone} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <Label>Shipping address</Label>
              <Input value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Items" description="Add the items being shipped." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<DeliveryRow>
            columns={lineColumns}
            rows={form.items}
            onChange={(rows) => setForm({ ...form, items: rows })}
            buildRow={() => ({ itemName: '', quantity: 1, unit: 'unit' })}
            totals={[{ key: 'quantity', label: 'Total', format: 'number' }]}
            minRows={1}
            maxRows={100}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}
