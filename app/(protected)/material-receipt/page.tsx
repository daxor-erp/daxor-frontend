'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_MATERIAL_RECEIPTS, GET_PURCHASE_ORDERS, GET_VENDORS, GET_WAREHOUSES,
  CREATE_MATERIAL_RECEIPT, UPDATE_MATERIAL_RECEIPT,
  SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL, CANCEL_MATERIAL_RECEIPT, DELETE_MATERIAL_RECEIPT,
} from '@/gql/queries'
import { Package, Clock, CheckCircle2, X, Trash2, Send, Plus } from 'lucide-react'

const BLANK_LINE = { itemDescription: '', orderedQty: 0, receivedQty: 0, rejectedQty: 0, unit: '', unitPrice: 0, lineTotal: 0 }
const BLANK_FORM = { purchaseOrderId: '', vendorId: '', vendorName: '', receiptDate: new Date().toISOString().split('T')[0], warehouseId: '', warehouseName: '', notes: '' }

export default function MaterialReceiptPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any>(null)
  const [confirm, setConfirm]       = useState<{ action: string; id: string } | null>(null)
  const [form, setForm]             = useState({ ...BLANK_FORM })
  const [lines, setLines]           = useState([{ ...BLANK_LINE }])

  const { data, loading, refetch }  = useQuery(GET_MATERIAL_RECEIPTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: poData }            = useQuery(GET_PURCHASE_ORDERS,   { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: vData }             = useQuery(GET_VENDORS,           { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: whData }            = useQuery(GET_WAREHOUSES,        { variables: { organizationId: orgId }, skip: !orgId })

  const done = () => { refetch(); setDrawerOpen(false); setEditRow(null); setConfirm(null) }
  const err  = (e: any) => alert(e.message)

  const [create, { loading: saving }]  = useMutation(CREATE_MATERIAL_RECEIPT,               { onCompleted: done, onError: err })
  const [update, { loading: updating }] = useMutation(UPDATE_MATERIAL_RECEIPT,              { onCompleted: done, onError: err })
  const [submit_]                       = useMutation(SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL, { onCompleted: done, onError: err })
  const [cancel_]                       = useMutation(CANCEL_MATERIAL_RECEIPT,              { onCompleted: done, onError: err })
  const [delete_]                       = useMutation(DELETE_MATERIAL_RECEIPT,              { onCompleted: done, onError: err })

  const records: any[]     = data?.materialreceipts ?? []
  const pos: any[]         = poData?.purchaseorders ?? []
  const vendors: any[]     = vData?.vendors ?? []
  const warehouses: any[]  = whData?.warehouses ?? []

  const setF = (k: string, v: string) => setForm(p => {
    const u: any = { ...p, [k]: v }
    if (k === 'purchaseOrderId') {
      const po = pos.find((x: any) => x.id === v)
      if (po) { u.vendorId = String(po.vendorId ?? ''); u.vendorName = po.vendorName ?? '' }
    }
    if (k === 'warehouseId') u.warehouseName = warehouses.find((w: any) => w.id === v)?.warehouseName || ''
    return u
  })

  const updateLines = (rows: any[]) => setLines(rows.map(l => ({
    ...l, lineTotal: Math.round(Number(l.receivedQty) * Number(l.unitPrice) * 100) / 100,
  })))

  const stats = {
    total:     records.length,
    draft:     records.filter((r: any) => r.status === 'draft').length,
    pending:   records.filter((r: any) => r.status === 'submitted').length,
    confirmed: records.filter((r: any) => r.status === 'confirmed').length,
    totalVal:  records.reduce((s: number, r: any) => s + Number(r.totalAmount ?? 0), 0),
  }

  const openCreate = () => { setForm({ ...BLANK_FORM }); setLines([{ ...BLANK_LINE }]); setEditRow(null); setDrawerOpen(true) }
  const openEdit   = (row: any) => {
    setForm({ purchaseOrderId: row.purchaseOrderId ?? '', vendorId: row.vendorId ?? '', vendorName: row.vendorName ?? '', receiptDate: row.receiptDate?.split('T')[0] ?? '', warehouseId: row.warehouseId ?? '', warehouseName: row.warehouseName ?? '', notes: row.notes ?? '' })
    setLines(row.lineItems?.length ? row.lineItems.map((l: any) => ({ ...BLANK_LINE, ...l })) : [{ ...BLANK_LINE }])
    setEditRow(row)
    setDrawerOpen(true)
  }

  const handleSave = () => {
    if (!form.receiptDate) return alert('Receipt date is required')
    if (!lines.some(l => l.itemDescription?.trim())) return alert('Add at least one item')
    const totalAmount = lines.reduce((s, l) => s + Number(l.lineTotal ?? 0), 0)
    const input = {
      receiptDate: form.receiptDate, organizationId: orgId, totalAmount,
      ...(form.purchaseOrderId ? { purchaseOrderId: form.purchaseOrderId } : {}),
      ...(form.vendorId        ? { vendorId: form.vendorId }               : {}),
      ...(form.vendorName.trim()    ? { vendorName: form.vendorName.trim() }    : {}),
      ...(form.warehouseId          ? { warehouseId: form.warehouseId }         : {}),
      ...(form.warehouseName.trim() ? { warehouseName: form.warehouseName.trim() } : {}),
      ...(form.notes.trim()         ? { notes: form.notes.trim() }              : {}),
      lineItems: lines.filter(l => l.itemDescription?.trim()).map(l => ({
        itemDescription: l.itemDescription.trim(),
        orderedQty:  Number(l.orderedQty),
        receivedQty: Number(l.receivedQty),
        rejectedQty: Number(l.rejectedQty),
        unitPrice:   Number(l.unitPrice),
        lineTotal:   Number(l.lineTotal),
        ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
      })),
    }
    if (editRow) update({ variables: { id: editRow.id, input } })
    else create({ variables: { input } })
  }

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Item' },
    { key: 'orderedQty',      header: 'Ordered',  width: '80px',  type: 'number' as const },
    { key: 'receivedQty',     header: 'Received', width: '80px',  type: 'number' as const },
    { key: 'rejectedQty',     header: 'Rejected', width: '80px',  type: 'number' as const },
    { key: 'unit',            header: 'Unit',     width: '70px' },
    { key: 'unitPrice',       header: 'Price',    width: '90px',  type: 'number' as const },
    { key: 'lineTotal',       header: 'Total',    width: '90px',  readOnly: true },
  ]

  const columns: Column[] = [
    { key: 'mrnNumber',    label: 'MRN #',      width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendorName',   label: 'Vendor',     render: v => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'receiptDate',  label: 'Received',   width: '110px', render: v => <DateCell value={v} /> },
    { key: 'warehouseName',label: 'Warehouse',  render: v => <span className="text-xs">{v || '—'}</span> },
    { key: 'status',       label: 'Status',     width: '130px', render: v => <ErpBadge status={v} /> },
    { key: 'totalAmount',  label: 'Value',      width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Material Receipts"
        subtitle="Record and manage incoming material receipts with quality inspection"
        icon={<Package className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Material Receipt' }]}
        actions={<button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> New MRN</button>}
      />

      <StatsRow cols={5}>
        <StatCard label="Total"      value={stats.total}     icon={<Package       className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"      value={stats.draft}     icon={<Clock         className="h-5 w-5" />} variant="amber" />
        <StatCard label="Pending"    value={stats.pending}   icon={<Send          className="h-5 w-5" />} variant="blue" />
        <StatCard label="Confirmed"  value={stats.confirmed} icon={<CheckCircle2  className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Value" value={`₹${(stats.totalVal/1000).toFixed(1)}k`} icon={<Package className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All Material Receipts" searchable searchPlaceholder="Search MRNs…"
        emptyMessage="No material receipts yet."
        pageSize={25}
        onRowClick={(r: any) => { if (['draft','approval_declined'].includes(r.status)) openEdit(r) }}
        isRowClickable={(r: any) => ['draft','approval_declined'].includes(r.status)}
        actions={[
          { label: 'Submit',  icon: <Send  className="h-3.5 w-3.5" />, onClick: (r: any) => submit_({ variables: { id: r.id } }), show: (r: any) => ['draft','approval_declined'].includes(r.status) },
          { label: 'Cancel',  icon: <X     className="h-3.5 w-3.5" />, onClick: (r: any) => setConfirm({ action: 'cancel', id: r.id }), show: (r: any) => !['cancelled','confirmed'].includes(r.status) },
          { label: 'Delete',  icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (r: any) => setConfirm({ action: 'delete', id: r.id }), show: (r: any) => r.status === 'draft' },
        ]}
      />

      <FormDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editRow ? `Edit MRN ${editRow.mrnNumber}` : 'New Material Receipt'}
        size="xl" submitLabel={editRow ? 'Update MRN' : 'Save MRN'}
        onSubmit={handleSave} submitting={saving || updating}
      >
        <FormSection title="Receipt Details" columns={3}>
          <SelectFloating label="Purchase Order" value={form.purchaseOrderId}
            onChange={v => setF('purchaseOrderId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'No PO / manual' }, ...pos.map((p: any) => ({ value: p.id, label: `${p.seqNo} — ${p.vendorName || ''}` }))]}
          />
          <SelectFloating label="Vendor" value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <InputFloating label="Receipt Date *" type="date" value={form.receiptDate} onChange={e => setF('receiptDate', e.target.value)} />
          <SelectFloating label="Warehouse" value={form.warehouseId}
            onChange={v => setF('warehouseId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select warehouse…' }, ...warehouses.map((w: any) => ({ value: w.id, label: w.warehouseName }))]}
          />
        </FormSection>
        <FormSection title="Line Items" columns={1}>
          <LineItemsEditor columns={LINE_COLS} rows={lines} onChange={updateLines} onAddRow={() => ({ ...BLANK_LINE })} />
        </FormSection>
        <FormSection columns={1}>
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      {confirm && (
        <ConfirmDialog
          open onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.action === 'cancel') cancel_({ variables: { id: confirm.id } })
            if (confirm.action === 'delete') delete_({ variables: { id: confirm.id } })
          }}
          title={confirm.action === 'cancel' ? 'Cancel MRN?' : 'Delete MRN?'}
          description="This action cannot be undone."
          confirmLabel={confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)}
          destructive
        />
      )}
    </div>
  )
}
