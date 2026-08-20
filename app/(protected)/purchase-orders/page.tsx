'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PURCHASE_ORDERS, GET_VENDORS, GET_WAREHOUSES,
  CREATE_PURCHASE_ORDER, UPDATE_PURCHASE_ORDER,
  SUBMIT_PURCHASE_ORDER, APPROVE_PURCHASE_ORDER,
  CONFIRM_PURCHASE_ORDER, CANCEL_PURCHASE_ORDER,
  LOCK_PURCHASE_ORDER, BILL_PURCHASE_ORDER, DUPLICATE_PURCHASE_ORDER,
  RECEIVE_PURCHASE_ORDER,
  UNLOCK_PURCHASE_ORDER,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import {
  PageHeader, StatsRow, StatCard, ErpBadge,
  AmountCell, MonoCell, DateCell,
} from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart, FileText, Clock, CheckCircle2,
  Package, ReceiptText, Copy, Lock, Ban, FileCheck,
  Send, Plus, Pencil, Unlock, Truck, ThumbsUp,
} from 'lucide-react'

const BLANK_LINE = { productName: '', quantity: 1, unitPrice: 0, discountPercent: 0 }

const BLANK_FORM = {
  vendorId: '',
  orderDate: new Date().toISOString().split('T')[0],
  expectedArrival: '',
  currency: 'INR',
  notes: '',
  deliverToLocationId: '',
}

const STATUS_PIPELINE = [
  { key: 'rfq',                label: 'RFQ' },
  { key: 'rfq_sent',           label: 'RFQ Sent' },
  { key: 'submitted',          label: 'Submitted' },
  { key: 'approved',           label: 'Approved' },
  { key: 'purchase_order',     label: 'Confirmed' },
  { key: 'sent',               label: 'PO Sent' },
  { key: 'partially_received', label: 'Partial Receipt' },
  { key: 'received',           label: 'Received' },
  { key: 'billed',             label: 'Billed' },
]

export default function PurchaseOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  // Drawers
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [editRow, setEditRow]         = useState<any>(null)   // null = create, object = edit
  const [billDrawer, setBillDrawer]   = useState<any>(null)
  const [receiveDrawer, setReceiveDrawer] = useState<any>(null)
  const [confirm, setConfirm]         = useState<{ action: string; id: string } | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  // Form state
  const [form, setForm]       = useState({ ...BLANK_FORM })
  const [lines, setLines]     = useState([{ ...BLANK_LINE }])
  const [billForm, setBillForm] = useState({ billDate: '', dueDate: '' })
  // Receive: per-line qty input keyed by line id
  const [receiveQtys, setReceiveQtys] = useState<Record<string, number>>({})

  const { data, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: warehouseData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const done = () => { refetch(); setDrawerOpen(false); setEditRow(null); setConfirm(null); setBillDrawer(null); setReceiveDrawer(null) }
  const err  = (e: any) => alert(e.message)

  const [createPO,    { loading: creating }]  = useMutation(CREATE_PURCHASE_ORDER,    { onCompleted: done, onError: err })
  const [updatePO,    { loading: updating }]  = useMutation(UPDATE_PURCHASE_ORDER,    { onCompleted: done, onError: err })
  const [submitPO]                            = useMutation(SUBMIT_PURCHASE_ORDER,    { onCompleted: done, onError: err })
  const [approvePO]                           = useMutation(APPROVE_PURCHASE_ORDER,   { onCompleted: done, onError: err })
  const [confirmPO]                           = useMutation(CONFIRM_PURCHASE_ORDER,   { onCompleted: done, onError: err })
  const [cancelPO]                            = useMutation(CANCEL_PURCHASE_ORDER,    { onCompleted: done, onError: err })
  const [lockPO]                              = useMutation(LOCK_PURCHASE_ORDER,      { onCompleted: done, onError: err })
  const [unlockPO]                            = useMutation(UNLOCK_PURCHASE_ORDER,    { onCompleted: done, onError: err })
  const [billPO,      { loading: billing }]   = useMutation(BILL_PURCHASE_ORDER,      { onCompleted: done, onError: err })
  const [duplicatePO]                         = useMutation(DUPLICATE_PURCHASE_ORDER, { onCompleted: done, onError: err })
  const [receivePO,   { loading: receiving }] = useMutation(RECEIVE_PURCHASE_ORDER,   { onCompleted: done, onError: err })

  const records: any[] = (data?.purchaseorders ?? []).filter(
    (r: any) => !filterStatus || r.status === filterStatus
  )

  const stats = {
    total:    data?.purchaseorders?.length ?? 0,
    rfq:      data?.purchaseorders?.filter((r: any) => ['rfq','rfq_sent','submitted'].includes(r.status)).length ?? 0,
    active:   data?.purchaseorders?.filter((r: any) => ['purchase_order','sent','partially_received'].includes(r.status)).length ?? 0,
    received: data?.purchaseorders?.filter((r: any) => r.status === 'received').length ?? 0,
    billed:   data?.purchaseorders?.filter((r: any) => r.status === 'billed').length ?? 0,
  }

  const vendors    = vendorData?.vendors    ?? []
  const warehouses = warehouseData?.warehouses ?? []

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  // Open create drawer
  const openCreate = () => {
    setEditRow(null)
    setForm({ ...BLANK_FORM })
    setLines([{ ...BLANK_LINE }])
    setDrawerOpen(true)
  }

  // Open edit drawer (only for rfq / rfq_sent)
  const openEdit = (row: any) => {
    setEditRow(row)
    setForm({
      vendorId: row.vendorId ?? '',
      orderDate: row.orderDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      expectedArrival: row.expectedArrival?.split('T')[0] ?? '',
      currency: row.currency ?? 'INR',
      notes: row.notes ?? '',
      deliverToLocationId: row.deliverToLocationId ?? '',
    })
    setLines(
      row.items?.length
        ? row.items.map((i: any) => ({
            productName: i.productName ?? i.itemDescription ?? '',
            quantity: Number(i.quantity ?? 1),
            unitPrice: Number(i.unitPrice ?? 0),
            discountPercent: Number(i.discountPercent ?? 0),
          }))
        : [{ ...BLANK_LINE }]
    )
    setDrawerOpen(true)
  }

  // Open receive drawer
  const openReceive = (row: any) => {
    const initial: Record<string, number> = {}
    for (const item of (row.items ?? [])) {
      const remaining = Number(item.quantity ?? 0) - Number(item.qtyReceived ?? 0)
      initial[item.id] = Math.max(0, remaining)
    }
    setReceiveQtys(initial)
    setReceiveDrawer(row)
  }

  const handleSave = () => {
    if (!form.vendorId) return alert('Select a vendor')
    if (!lines.some(l => l.productName.trim())) return alert('Add at least one item')
    const mappedLines = lines.filter(l => l.productName.trim()).map(l => ({
      productName: l.productName.trim(),
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      discountPercent: Number(l.discountPercent),
    }))
    if (editRow) {
      updatePO({
        variables: {
          id: editRow.id,
          input: { ...form, items: mappedLines },
        },
      })
    } else {
      createPO({
        variables: {
          input: { ...form, organizationId: orgId, items: mappedLines },
        },
      })
    }
  }

  const handleReceive = () => {
    if (!receiveDrawer) return
    const lines = (receiveDrawer.items ?? [])
      .map((item: any) => ({ lineId: item.id, qtyReceived: Number(receiveQtys[item.id] ?? 0) }))
      .filter((l: any) => l.qtyReceived > 0)
    if (!lines.length) return alert('Enter at least one received quantity')
    receivePO({ variables: { id: receiveDrawer.id, lines } })
  }

  const runConfirm = () => {
    if (!confirm) return
    const id = confirm.id
    if (confirm.action === 'submit')    submitPO({ variables: { id } })
    if (confirm.action === 'approve')   approvePO({ variables: { id } })
    if (confirm.action === 'confirm')   confirmPO({ variables: { id } })
    if (confirm.action === 'cancel')    cancelPO({ variables: { id } })
    if (confirm.action === 'lock')      lockPO({ variables: { id } })
    if (confirm.action === 'unlock')    unlockPO({ variables: { id } })
    if (confirm.action === 'duplicate') duplicatePO({ variables: { id } })
  }

  const handleBill = () => {
    if (!billDrawer || !billForm.billDate || !billForm.dueDate) return alert('Enter bill date and due date')
    billPO({ variables: { id: billDrawer.id, billDate: billForm.billDate, dueDate: billForm.dueDate } })
  }

  const LINE_COLS = [
    { key: 'productName',     header: 'Product / Description', placeholder: 'Item name' },
    { key: 'quantity',        header: 'Qty',       width: '80px',  type: 'number' as const },
    { key: 'unitPrice',       header: 'Unit Price', width: '100px', type: 'number' as const },
    { key: 'discountPercent', header: 'Disc %',    width: '70px',  type: 'number' as const },
  ]

  const columns: Column[] = [
    { key: 'seqNo',      label: 'PO #',     width: '130px', render: v => <MonoCell value={v} /> },
    { key: 'vendorName', label: 'Vendor',   render: (v, r) => <span className="text-sm font-medium">{v || r.vendor?.name || '—'}</span> },
    { key: 'orderDate',  label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'expectedArrival', label: 'Expected', width: '110px', render: v => <DateCell value={v} /> },
    {
      key: 'status',
      label: 'Status',
      width: '150px',
      render: (v, r) => (
        <div className="space-y-0.5">
          <ErpBadge status={v} />
          <div className="text-[10px] text-muted-foreground">{r.receiptStatus !== 'not_received' ? r.receiptStatus?.replace(/_/g,' ') : ''}</div>
        </div>
      )
    },
    { key: 'totalAmount', label: 'Total',  width: '120px', align: 'right', render: (v, r) => <AmountCell value={v} currency={r.currency === 'INR' ? '₹' : r.currency} /> },
    { key: 'billingStatus', label: 'Billing', width: '110px', render: v => v ? <ErpBadge status={v} /> : null },
  ]

  const CONFIRM_LABELS: Record<string, { title: string; desc: string; label: string; destructive?: boolean }> = {
    submit:    { title: 'Submit for Approval?',         desc: 'This RFQ will be sent to the approver.',               label: 'Submit' },
    approve:   { title: 'Approve Purchase Order?',      desc: 'The PO will be marked approved.',                      label: 'Approve' },
    confirm:   { title: 'Confirm as Purchase Order?',   desc: 'The RFQ will become a confirmed PO.',                  label: 'Confirm' },
    cancel:    { title: 'Cancel Purchase Order?',       desc: 'This cannot be undone if goods were received.',        label: 'Cancel', destructive: true },
    lock:      { title: 'Lock Purchase Order?',         desc: 'Locked POs cannot be edited without unlocking.',       label: 'Lock' },
    unlock:    { title: 'Unlock Purchase Order?',       desc: 'The PO will be unlocked for editing.',                 label: 'Unlock' },
    duplicate: { title: 'Duplicate this PO?',           desc: 'A new draft RFQ will be created with the same lines.', label: 'Duplicate' },
  }

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage RFQs, purchase orders, receipts and vendor bills"
        icon={<ShoppingCart className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Purchase Orders' }]}
        actions={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New RFQ
          </Button>
        }
      />

      <StatsRow cols={5}>
        <StatCard label="Total POs"      value={stats.total}    icon={<FileText     className="h-5 w-5" />} variant="slate"  onClick={() => setFilterStatus('')} />
        <StatCard label="RFQ / Draft"    value={stats.rfq}      icon={<Clock        className="h-5 w-5" />} variant="amber"  onClick={() => setFilterStatus('rfq')} />
        <StatCard label="In Progress"    value={stats.active}   icon={<ShoppingCart className="h-5 w-5" />} variant="blue"   onClick={() => setFilterStatus('purchase_order')} />
        <StatCard label="Received"       value={stats.received} icon={<Package      className="h-5 w-5" />} variant="green"  onClick={() => setFilterStatus('received')} />
        <StatCard label="Billed"         value={stats.billed}   icon={<ReceiptText  className="h-5 w-5" />} variant="violet" onClick={() => setFilterStatus('billed')} />
      </StatsRow>

      {/* Pipeline filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {[{ key: '', label: 'All' }, ...STATUS_PIPELINE].map(s => (
          <button
            key={s.key}
            onClick={() => setFilterStatus(s.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === s.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <DataTable
        data={records}
        columns={columns}
        loading={loading}
        title={filterStatus ? `Filtered: ${filterStatus.replace(/_/g,' ')}` : 'All Purchase Orders'}
        searchable
        searchPlaceholder="Search by PO#, vendor…"
        emptyMessage="No purchase orders found."
        pageSize={25}
        onRowClick={(r: any) => { if (['rfq','rfq_sent'].includes(r.status)) openEdit(r) }}
        isRowClickable={(r: any) => ['rfq','rfq_sent'].includes(r.status)}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
            show: (r: any) => ['rfq','rfq_sent'].includes(r.status),
          },
          {
            label: 'Submit',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'submit', id: r.id }),
            show: (r: any) => ['rfq','rfq_sent'].includes(r.status),
          },
          {
            label: 'Approve',
            icon: <ThumbsUp className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'approve', id: r.id }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Confirm PO',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'confirm', id: r.id }),
            show: (r: any) => r.status === 'approved',
          },
          {
            label: 'Receive Products',
            icon: <Truck className="h-3.5 w-3.5" />,
            onClick: (r: any) => openReceive(r),
            show: (r: any) => ['purchase_order','sent','partially_received'].includes(r.status),
          },
          {
            label: 'Bill PO',
            icon: <FileCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setBillForm({ billDate: '', dueDate: '' }); setBillDrawer(r) },
            show: (r: any) => ['received','partially_received','purchase_order','sent'].includes(r.status),
          },
          {
            label: 'Duplicate',
            icon: <Copy className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'duplicate', id: r.id }),
          },
          {
            label: 'Lock',
            icon: <Lock className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'lock', id: r.id }),
            show: (r: any) => ['purchase_order','sent','received','billed'].includes(r.status),
          },
          {
            label: 'Unlock',
            icon: <Unlock className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'unlock', id: r.id }),
            show: (r: any) => r.status === 'locked',
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'cancel', id: r.id }),
            show: (r: any) => !['cancelled','locked','billed'].includes(r.status),
          },
        ]}
      />

      {/* Create / Edit RFQ drawer */}
      <FormDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditRow(null) }}
        title={editRow ? `Edit RFQ ${editRow.seqNo ?? ''}` : 'New Request for Quotation'}
        description={editRow ? 'Update the RFQ details. Only allowed while status is RFQ or RFQ Sent.' : 'Create a draft RFQ. Submit it for approval to convert to a Purchase Order.'}
        size="lg"
        submitLabel={editRow ? 'Save Changes' : 'Save RFQ'}
        onSubmit={handleSave}
        submitting={creating || updating}
      >
        <FormSection title="Vendor & Dates" columns={2}>
          <SelectFloating
            label="Vendor *"
            value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <SelectFloating
            label="Deliver To"
            value={form.deliverToLocationId}
            onChange={v => setF('deliverToLocationId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select warehouse…' }, ...warehouses.map((w: any) => ({ value: w.id, label: w.warehouseName }))]}
          />
          <InputFloating label="Order Date *"      type="date" value={form.orderDate}       onChange={e => setF('orderDate', e.target.value)} />
          <InputFloating label="Expected Arrival"  type="date" value={form.expectedArrival} onChange={e => setF('expectedArrival', e.target.value)} />
          <InputFloating label="Currency" value={form.currency} onChange={e => setF('currency', e.target.value)} />
        </FormSection>
        <FormSection title="Items" columns={1}>
          <LineItemsEditor
            columns={LINE_COLS}
            rows={lines}
            onChange={(r) => setLines(r as typeof lines)}
            onAddRow={() => ({ ...BLANK_LINE })}
          />
        </FormSection>
        <FormSection title="Notes" columns={1}>
          <InputFloating label="Internal notes" multiline rows={3} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      {/* Receive Products drawer */}
      <FormDrawer
        open={!!receiveDrawer}
        onClose={() => setReceiveDrawer(null)}
        title={`Receive Products — ${receiveDrawer?.seqNo ?? ''}`}
        description="Enter quantities received for each line. Leave 0 to skip a line (creates backorder)."
        size="md"
        submitLabel="Validate Receipt"
        onSubmit={handleReceive}
        submitting={receiving}
      >
        <FormSection title="Line Quantities" columns={1}>
          {(receiveDrawer?.items ?? []).map((item: any) => {
            const remaining = Math.max(0, Number(item.quantity ?? 0) - Number(item.qtyReceived ?? 0))
            return (
              <div key={item.id} className="grid grid-cols-[1fr_100px_100px] gap-3 items-end">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{item.productName || item.itemDescription}</p>
                  <p className="text-xs text-muted-foreground">Ordered: {item.quantity} | Already received: {item.qtyReceived ?? 0} | Remaining: {remaining}</p>
                </div>
                <InputFloating
                  label="Qty to Receive"
                  type="number"
                  value={String(receiveQtys[item.id] ?? remaining)}
                  onChange={e => setReceiveQtys(p => ({ ...p, [item.id]: Number(e.target.value) }))}
                />
              </div>
            )
          })}
        </FormSection>
      </FormDrawer>

      {/* Bill PO drawer */}
      <FormDrawer
        open={!!billDrawer}
        onClose={() => setBillDrawer(null)}
        title={`Bill PO ${billDrawer?.seqNo ?? ''}`}
        description="Create a vendor bill from the received quantities on this PO."
        size="sm"
        submitLabel="Create Bill"
        onSubmit={handleBill}
        submitting={billing}
      >
        <FormSection columns={1}>
          <InputFloating label="Bill Date *"  type="date" value={billForm.billDate} onChange={e => setBillForm(p => ({ ...p, billDate: e.target.value }))} />
          <InputFloating label="Due Date *"   type="date" value={billForm.dueDate}  onChange={e => setBillForm(p => ({ ...p, dueDate: e.target.value }))} />
        </FormSection>
      </FormDrawer>

      {/* Confirm dialog */}
      {confirm && CONFIRM_LABELS[confirm.action] && (
        <ConfirmDialog
          open
          onClose={() => setConfirm(null)}
          onConfirm={runConfirm}
          title={CONFIRM_LABELS[confirm.action].title}
          description={CONFIRM_LABELS[confirm.action].desc}
          confirmLabel={CONFIRM_LABELS[confirm.action].label}
          destructive={!!CONFIRM_LABELS[confirm.action].destructive}
        />
      )}
    </div>
  )
}
