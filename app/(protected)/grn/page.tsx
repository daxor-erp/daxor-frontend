'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_GRNS, GET_PURCHASE_ORDERS,
  CREATE_GRN, UPDATE_GRN, DELETE_GRN, SUBMIT_GRN_FOR_APPROVAL,
} from '@/gql/queries'
import { PackageCheck, Clock, CheckCircle2, Truck, Send, Trash2, Plus, Pencil } from 'lucide-react'

const BLANK_LINE = { itemDescription: '', orderedQty: 0, receivedQty: 0, unitPrice: 0, lotNumber: '', serialNumber: '' }
const BLANK_FORM = { purchaseOrderId: '', vendorName: '', receivedDate: new Date().toISOString().split('T')[0], notes: '' }

export default function GRNPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [form, setForm]             = useState({ ...BLANK_FORM })
  const [lines, setLines]           = useState([{ ...BLANK_LINE }])

  const { data, loading, refetch }  = useQuery(GET_GRNS,            { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: poData }            = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const done = () => { refetch(); setDrawerOpen(false); setEditRow(null); setDelConfirm(null) }
  const err  = (e: any) => alert(e.message)

  const [createGRN, { loading: saving }]  = useMutation(CREATE_GRN,                 { onCompleted: done, onError: err })
  const [updateGRN, { loading: updating }] = useMutation(UPDATE_GRN,                { onCompleted: done, onError: err })
  const [submitGRN]                        = useMutation(SUBMIT_GRN_FOR_APPROVAL,   { onCompleted: done, onError: err })
  const [deleteGRN]                        = useMutation(DELETE_GRN,                { onCompleted: done, onError: err })

  const records: any[] = data?.grns ?? []
  const pos: any[]     = poData?.purchaseorders ?? []

  const setF = (k: string, v: string) => setForm(p => {
    const u: any = { ...p, [k]: v }
    if (k === 'purchaseOrderId') u.vendorName = pos.find((p: any) => p.id === v)?.vendorName || ''
    return u
  })

  const openCreate = () => {
    setEditRow(null)
    setForm({ ...BLANK_FORM })
    setLines([{ ...BLANK_LINE }])
    setDrawerOpen(true)
  }

  const openEdit = (row: any) => {
    setEditRow(row)
    setForm({
      purchaseOrderId: row.purchaseOrderId ?? '',
      vendorName:      row.vendorName ?? '',
      receivedDate:    row.receivedDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      notes:           row.notes ?? '',
    })
    setLines(
      row.lineItems?.length
        ? row.lineItems.map((l: any) => ({
            itemDescription: l.itemDescription ?? '',
            orderedQty:      Number(l.orderedQty ?? 0),
            receivedQty:     Number(l.receivedQty ?? 0),
            unitPrice:       Number(l.unitPrice ?? 0),
            lotNumber:       l.lotNumber ?? '',
            serialNumber:    l.serialNumber ?? '',
          }))
        : [{ ...BLANK_LINE }]
    )
    setDrawerOpen(true)
  }

  const handleSave = () => {
    if (!form.receivedDate) return alert('Enter received date')
    if (!lines.some(l => l.itemDescription?.trim() && Number(l.receivedQty) > 0)) return alert('Add at least one received item')
    const mappedLines = lines.filter(l => l.itemDescription?.trim()).map(l => ({
      itemDescription: l.itemDescription.trim(),
      orderedQty:  Number(l.orderedQty),
      receivedQty: Number(l.receivedQty),
      unitPrice:   Number(l.unitPrice),
      ...(l.lotNumber?.trim()    ? { lotNumber: l.lotNumber.trim() }       : {}),
      ...(l.serialNumber?.trim() ? { serialNumber: l.serialNumber.trim() } : {}),
    }))

    if (editRow) {
      updateGRN({
        variables: {
          id: editRow.id,
          input: {
            receivedDate: form.receivedDate,
            ...(form.vendorName.trim() ? { vendorName: form.vendorName.trim() } : {}),
            ...(form.notes.trim()      ? { notes: form.notes.trim() }          : {}),
            lineItems: mappedLines,
          },
        },
      })
    } else {
      createGRN({
        variables: {
          input: {
            receivedDate: form.receivedDate,
            organizationId: orgId,
            ...(form.purchaseOrderId ? { purchaseOrderId: form.purchaseOrderId } : {}),
            ...(form.vendorName.trim() ? { vendorName: form.vendorName.trim() } : {}),
            ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
            lineItems: mappedLines,
          },
        },
      })
    }
  }

  const stats = {
    total:     records.length,
    draft:     records.filter((r: any) => r.status === 'draft').length,
    pending:   records.filter((r: any) => r.status === 'submitted').length,
    confirmed: records.filter((r: any) => r.status === 'confirmed').length,
  }

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Item Description' },
    { key: 'orderedQty',      header: 'Ordered',    width: '90px',  type: 'number' as const },
    { key: 'receivedQty',     header: 'Received *', width: '90px',  type: 'number' as const },
    { key: 'unitPrice',       header: 'Unit Price', width: '100px', type: 'number' as const },
    { key: 'lotNumber',       header: 'Lot #',      width: '110px' },
    { key: 'serialNumber',    header: 'Serial #',   width: '110px' },
  ]

  const columns: Column[] = [
    { key: 'grnNumber',   label: 'GRN #',    width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendorName',  label: 'Vendor',   render: v => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'receivedDate',label: 'Received', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'lineItems',   label: 'Lines',    width: '60px',  render: v => <span className="text-xs">{Array.isArray(v) ? v.length : 0}</span> },
    { key: 'status',      label: 'Status',   width: '120px', render: v => <ErpBadge status={v} /> },
    { key: 'createdAt',   label: 'Created',  width: '110px', render: v => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Goods Receipt Notes"
        subtitle="Record physical receipt of goods against purchase orders"
        icon={<PackageCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'GRN' }]}
        actions={
          <button onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New GRN
          </button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total GRNs"  value={stats.total}     icon={<Truck         className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"       value={stats.draft}     icon={<Clock         className="h-5 w-5" />} variant="amber" />
        <StatCard label="Pending"     value={stats.pending}   icon={<Send          className="h-5 w-5" />} variant="blue" />
        <StatCard label="Confirmed"   value={stats.confirmed} icon={<CheckCircle2  className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All GRNs" searchable searchPlaceholder="Search GRNs…"
        emptyMessage="No goods receipt notes yet."
        pageSize={25}
        onRowClick={(r: any) => { if (r.status === 'draft') openEdit(r) }}
        isRowClickable={(r: any) => r.status === 'draft'}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
            show: (r: any) => r.status === 'draft',
          },
          {
            label: 'Submit for Approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => submitGRN({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'draft',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => setDelConfirm(r.id),
            show: (r: any) => r.status === 'draft',
          },
        ]}
      />

      {/* Create / Edit GRN drawer */}
      <FormDrawer
        open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditRow(null) }}
        title={editRow ? `Edit GRN ${editRow.grnNumber ?? ''}` : 'New Goods Receipt Note'}
        description={editRow ? 'Update receipt details and quantities.' : 'Record physical receipt of goods. Enter lot/serial numbers for tracked items.'}
        size="lg"
        submitLabel={editRow ? 'Save Changes' : 'Save GRN'}
        onSubmit={handleSave}
        submitting={saving || updating}
      >
        <FormSection title="Receipt Details" columns={2}>
          {!editRow && (
            <SelectFloating label="Purchase Order (optional)" value={form.purchaseOrderId}
              onChange={v => setF('purchaseOrderId', typeof v === 'string' ? v : (v as any).target.value)}
              options={[{ value: '', label: 'No PO / manual receipt' }, ...pos.map((p: any) => ({ value: p.id, label: `${p.seqNo} — ${p.vendorName || ''}` }))]}
            />
          )}
          <InputFloating label="Vendor Name"    value={form.vendorName}    onChange={e => setF('vendorName', e.target.value)} />
          <InputFloating label="Received Date *" type="date" value={form.receivedDate} onChange={e => setF('receivedDate', e.target.value)} />
        </FormSection>
        <FormSection title="Received Items (with Lot / Serial)" columns={1}>
          <LineItemsEditor columns={LINE_COLS} rows={lines} onChange={(r) => setLines(r as typeof lines)} onAddRow={() => ({ ...BLANK_LINE })} />
        </FormSection>
        <FormSection columns={1}>
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      <ConfirmDialog
        open={!!delConfirm} onClose={() => setDelConfirm(null)}
        onConfirm={() => { if (delConfirm) deleteGRN({ variables: { id: delConfirm } }) }}
        title="Delete GRN?" description="This goods receipt note will be permanently deleted." confirmLabel="Delete"
      />
    </div>
  )
}
