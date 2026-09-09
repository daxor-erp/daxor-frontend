'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FormDrawer, FormSection, LineItemsEditor, ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_GOODS_RECEIPTS,
  GET_PURCHASE_ORDERS,
  GET_VENDORS,
  GET_WAREHOUSES,
  CREATE_GOODS_RECEIPT,
  UPDATE_GOODS_RECEIPT,
  POST_GOODS_RECEIPT,
  DELETE_GOODS_RECEIPT,
} from '@/gql/queries'
import { Package, Clock, CheckCircle2, Plus, Pencil, Trash2, Send } from 'lucide-react'

const BLANK_LINE = { itemId: '', itemDescription: '', orderedQty: 0, receivedQty: 0, unit: '', unitPrice: 0 }
const BLANK_FORM = {
  purchaseOrderId: '',
  vendorId: '',
  vendorName: '',
  docDate: new Date().toISOString().split('T')[0],
  warehouseId: '',
  warehouseName: '',
  notes: '',
}

type GoodsReceiptRow = {
  id: string
  docNumber?: string | null
  docDate?: string | null
  status?: string | null
  purchaseOrderId?: string | null
  purchaseOrderNumber?: string | null
  vendorId?: string | null
  vendorName?: string | null
  warehouseId?: string | null
  warehouseName?: string | null
  lineItems?: Array<{
    itemId?: string | null
    itemDescription?: string | null
    orderedQty?: number | null
    receivedQty?: number | null
    unit?: string | null
    unitPrice?: number | null
  }> | null
  notes?: string | null
  createdAt?: string | null
}

export default function GoodsReceiptsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow] = useState<GoodsReceiptRow | null>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ ...BLANK_FORM })
  const [lines, setLines] = useState([{ ...BLANK_LINE }])

  const { data, loading, error: queryError, refetch } = useQuery(GET_GOODS_RECEIPTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: poData } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: whData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const done = () => {
    void refetch()
    setDrawerOpen(false)
    setEditRow(null)
    setDelConfirm(null)
    setFormError('')
  }

  const [createGoodsReceipt, { loading: creating }] = useMutation(CREATE_GOODS_RECEIPT, {
    onCompleted: done,
    onError: (err) => setFormError(err.message),
  })
  const [updateGoodsReceipt, { loading: updating }] = useMutation(UPDATE_GOODS_RECEIPT, {
    onCompleted: done,
    onError: (err) => setFormError(err.message),
  })
  const [postGoodsReceipt] = useMutation(POST_GOODS_RECEIPT, {
    onCompleted: () => void refetch(),
    onError: (err) => alert(err.message),
  })
  const [deleteGoodsReceipt] = useMutation(DELETE_GOODS_RECEIPT, {
    onCompleted: done,
    onError: (err) => alert(err.message),
  })

  const items: GoodsReceiptRow[] = data?.goodsreceipts ?? []
  const pos: Array<{ id: string; seqNo?: string; vendorId?: string; vendorName?: string }> = poData?.purchaseorders ?? []
  const vendors: Array<{ id: string; name?: string }> = vData?.vendors ?? []
  const warehouses: Array<{ id: string; warehouseName?: string }> = whData?.warehouses ?? []
  const draft = items.filter((i) => String(i.status).toUpperCase() === 'DRAFT').length
  const posted = items.filter((i) => String(i.status).toUpperCase() === 'POSTED').length

  const setF = (k: string, v: string) =>
    setForm((p) => {
      const u: typeof p = { ...p, [k]: v }
      if (k === 'purchaseOrderId') {
        const po = pos.find((x) => x.id === v)
        if (po) {
          u.vendorId = String(po.vendorId ?? '')
          u.vendorName = po.vendorName ?? ''
        }
      }
      if (k === 'vendorId') {
        u.vendorName = vendors.find((x) => x.id === v)?.name ?? u.vendorName
      }
      if (k === 'warehouseId') {
        u.warehouseName = warehouses.find((w) => w.id === v)?.warehouseName ?? ''
      }
      return u
    })

  const openNew = () => {
    setEditRow(null)
    setFormError('')
    setForm({ ...BLANK_FORM, docDate: new Date().toISOString().split('T')[0] })
    setLines([{ ...BLANK_LINE }])
    setDrawerOpen(true)
  }

  const openEdit = (row: GoodsReceiptRow) => {
    if (!row.id || String(row.status).toUpperCase() !== 'DRAFT') return
    const raw = row.docDate ?? ''
    let ymd = new Date().toISOString().split('T')[0]
    if (raw) {
      const d = new Date(raw)
      if (!Number.isNaN(d.getTime())) ymd = d.toISOString().split('T')[0]
    }
    setEditRow(row)
    setFormError('')
    setForm({
      purchaseOrderId: row.purchaseOrderId ?? '',
      vendorId: row.vendorId ?? '',
      vendorName: row.vendorName ?? '',
      docDate: ymd,
      warehouseId: row.warehouseId ?? '',
      warehouseName: row.warehouseName ?? '',
      notes: row.notes ?? '',
    })
    setLines(
      row.lineItems?.length
        ? row.lineItems.map((l) => ({
            itemId: l.itemId ?? '',
            itemDescription: l.itemDescription ?? '',
            orderedQty: Number(l.orderedQty ?? 0),
            receivedQty: Number(l.receivedQty ?? 0),
            unit: l.unit ?? '',
            unitPrice: Number(l.unitPrice ?? 0),
          }))
        : [{ ...BLANK_LINE }],
    )
    setDrawerOpen(true)
  }

  const handleSave = () => {
    if (!orgId) {
      setFormError('Organization is required. Please sign in again.')
      return
    }
    if (!form.docDate?.trim()) {
      setFormError('Document date is required.')
      return
    }
    if (!lines.some((l) => l.itemDescription?.trim())) {
      setFormError('Add at least one item line.')
      return
    }
    if (!lines.some((l) => Number(l.receivedQty) > 0)) {
      setFormError('At least one line must have received quantity greater than zero.')
      return
    }

    const input = {
      docDate: form.docDate,
      organizationId: orgId,
      status: 'DRAFT',
      ...(form.purchaseOrderId ? { purchaseOrderId: form.purchaseOrderId } : {}),
      ...(form.vendorId ? { vendorId: form.vendorId } : {}),
      ...(form.vendorName.trim() ? { vendorName: form.vendorName.trim() } : {}),
      ...(form.warehouseId ? { warehouseId: form.warehouseId } : {}),
      ...(form.warehouseName.trim() ? { warehouseName: form.warehouseName.trim() } : {}),
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      lineItems: lines
        .filter((l) => l.itemDescription?.trim())
        .map((l) => ({
          ...(l.itemId ? { itemId: l.itemId } : {}),
          itemDescription: l.itemDescription.trim(),
          orderedQty: Number(l.orderedQty),
          receivedQty: Number(l.receivedQty),
          unitPrice: Number(l.unitPrice),
          ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
        })),
    }

    setFormError('')
    if (editRow?.id) updateGoodsReceipt({ variables: { id: editRow.id, input } })
    else createGoodsReceipt({ variables: { input } })
  }

  const saving = creating || updating

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Item *' },
    { key: 'orderedQty', header: 'Ordered', width: '80px', type: 'number' as const },
    { key: 'receivedQty', header: 'Received *', width: '90px', type: 'number' as const },
    { key: 'unit', header: 'Unit', width: '70px' },
    { key: 'unitPrice', header: 'Price', width: '90px', type: 'number' as const },
  ]

  const columns: Column[] = [
    { key: 'docNumber', label: 'Document #', width: '140px', render: (v) => <MonoCell value={v ?? '—'} /> },
    { key: 'vendorName', label: 'Vendor', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'warehouseName', label: 'Warehouse', render: (v) => <span className="text-xs">{v || '—'}</span> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'lineItems',
      label: 'Lines',
      width: '60px',
      render: (v) => <span className="text-xs">{Array.isArray(v) ? v.length : 0}</span>,
    },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v ?? 'DRAFT')} /> },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Goods Receipts"
        subtitle="Record and track goods receipt documents"
        icon={<Package className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Goods Receipts' }]}
        actions={
          <button
            onClick={openNew}
            disabled={!orgId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New Receipt
          </button>
        }
      />

      {!orgId && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
          No organization on your account. Goods receipts cannot be loaded until your profile includes an organization.
        </p>
      )}
      {queryError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">{queryError.message}</p>
      )}

      <StatsRow cols={3}>
        <StatCard label="Total" value={items.length} icon={<Package className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Posted" value={posted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Goods Receipts"
        searchable
        searchPlaceholder="Search receipts…"
        emptyMessage="No goods receipts found."
        pageSize={25}
        onRowClick={(r) => openEdit(r as GoodsReceiptRow)}
        isRowClickable={(r) => String((r as GoodsReceiptRow).status).toUpperCase() === 'DRAFT'}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r) => openEdit(r as GoodsReceiptRow),
            show: (r) => String((r as GoodsReceiptRow).status).toUpperCase() === 'DRAFT',
          },
          {
            label: 'Post',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r) => {
              const row = r as GoodsReceiptRow
              if (row.id && confirm(`Post goods receipt ${row.docNumber ?? ''}? This updates inventory.`)) {
                postGoodsReceipt({ variables: { id: row.id } })
              }
            },
            show: (r) => String((r as GoodsReceiptRow).status).toUpperCase() === 'DRAFT',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r) => setDelConfirm((r as GoodsReceiptRow).id),
            show: (r) => String((r as GoodsReceiptRow).status).toUpperCase() === 'DRAFT',
          },
        ]}
      />

      <FormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditRow(null)
          setFormError('')
        }}
        title={editRow ? `Edit ${editRow.docNumber ?? 'Goods Receipt'}` : 'New Goods Receipt'}
        size="xl"
        submitLabel={editRow ? 'Update Receipt' : 'Save Receipt'}
        onSubmit={handleSave}
        submitting={saving}
      >
        <FormSection title="Receipt Details" columns={3}>
          <SelectFloating
            label="Purchase Order"
            value={form.purchaseOrderId}
            onChange={(v) => setF('purchaseOrderId', typeof v === 'string' ? v : (v as React.ChangeEvent<HTMLSelectElement>).target.value)}
            options={[
              { value: '', label: 'No PO / manual' },
              ...pos.map((p) => ({ value: p.id, label: `${p.seqNo ?? p.id} — ${p.vendorName ?? ''}` })),
            ]}
          />
          <SelectFloating
            label="Vendor"
            value={form.vendorId}
            onChange={(v) => setF('vendorId', typeof v === 'string' ? v : (v as React.ChangeEvent<HTMLSelectElement>).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v) => ({ value: v.id, label: v.name ?? v.id }))]}
          />
          <InputFloating label="Doc Date *" type="date" value={form.docDate} onChange={(e) => setF('docDate', e.target.value)} />
          <SelectFloating
            label="Warehouse *"
            value={form.warehouseId}
            onChange={(v) => setF('warehouseId', typeof v === 'string' ? v : (v as React.ChangeEvent<HTMLSelectElement>).target.value)}
            options={[
              { value: '', label: 'Select warehouse…' },
              ...warehouses.map((w) => ({ value: w.id, label: w.warehouseName ?? w.id })),
            ]}
          />
        </FormSection>

        <FormSection title="Line Items" columns={1}>
          <LineItemsEditor columns={LINE_COLS} rows={lines} onChange={(r) => setLines(r as typeof lines)} onAddRow={() => ({ ...BLANK_LINE })} />
        </FormSection>

        <FormSection columns={1}>
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={(e) => setF('notes', e.target.value)} />
        </FormSection>

        {formError && <p className="text-xs text-red-600 px-1">{formError}</p>}
      </FormDrawer>

      {delConfirm && (
        <ConfirmDialog
          open
          onClose={() => setDelConfirm(null)}
          onConfirm={() => deleteGoodsReceipt({ variables: { id: delConfirm } })}
          title="Delete goods receipt?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          destructive
        />
      )}
    </div>
  )
}
