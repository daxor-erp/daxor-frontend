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
  GET_STOCK_ADJUSTMENTS, GET_WAREHOUSES,
  CREATE_STOCK_ADJUSTMENT, CONFIRM_STOCK_ADJUSTMENT, CANCEL_STOCK_ADJUSTMENT, DELETE_STOCK_ADJUSTMENT,
  UPDATE_STOCK_ADJUSTMENT,
} from '@/gql/queries'
import { ClipboardList, FileEdit, BadgeCheck, CalendarDays, Check, X, Trash2, Plus, Pencil } from 'lucide-react'

const ADJ_TYPES = [
  { value: 'recount',   label: 'Recount' },
  { value: 'increase',  label: 'Increase' },
  { value: 'decrease',  label: 'Decrease' },
  { value: 'write-off', label: 'Write-off' },
]

const BLANK_LINE = { itemDescription: '', currentQty: 0, adjustedQty: 0, difference: 0, unit: '' }
const BLANK_FORM = { adjDate: new Date().toISOString().split('T')[0], warehouseId: '', warehouseName: '', adjustmentType: 'recount', reason: '', notes: '' }

export default function StockAdjustmentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any>(null)
  const [confirm, setConfirm]       = useState<{ action: string; id: string } | null>(null)
  const [form, setForm]             = useState({ ...BLANK_FORM })
  const [lines, setLines]           = useState([{ ...BLANK_LINE }])

  const { data, loading, refetch }  = useQuery(GET_STOCK_ADJUSTMENTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: whData }            = useQuery(GET_WAREHOUSES,         { variables: { organizationId: orgId }, skip: !orgId })

  const done = () => { refetch(); setDrawerOpen(false); setEditRow(null); setConfirm(null) }
  const err  = (e: any) => alert(e.message)

  const [create, { loading: saving }]   = useMutation(CREATE_STOCK_ADJUSTMENT,  { onCompleted: done, onError: err })
  const [update_, { loading: updating }] = useMutation(UPDATE_STOCK_ADJUSTMENT, { onCompleted: done, onError: err })
  const [confirm_]                       = useMutation(CONFIRM_STOCK_ADJUSTMENT, { onCompleted: done, onError: err })
  const [cancel_]                        = useMutation(CANCEL_STOCK_ADJUSTMENT,  { onCompleted: done, onError: err })
  const [delete_]                        = useMutation(DELETE_STOCK_ADJUSTMENT,  { onCompleted: done, onError: err })

  const records: any[]     = data?.stockadjustments ?? []
  const warehouses: any[]  = whData?.warehouses ?? []
  const setF = (k: string, v: string) => setForm(p => {
    const u: any = { ...p, [k]: v }
    if (k === 'warehouseId') u.warehouseName = warehouses.find((w: any) => w.id === v)?.warehouseName || ''
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
      adjDate:        row.adjDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      warehouseId:    row.warehouseId ?? '',
      warehouseName:  row.warehouseName ?? '',
      adjustmentType: row.adjustmentType ?? 'recount',
      reason:         row.reason ?? '',
      notes:          row.notes ?? '',
    })
    setLines(
      row.lineItems?.length
        ? row.lineItems.map((l: any) => ({
            itemDescription: l.itemDescription ?? '',
            currentQty:      Number(l.currentQty ?? 0),
            adjustedQty:     Number(l.adjustedQty ?? 0),
            difference:      Number(l.adjustedQty ?? 0) - Number(l.currentQty ?? 0),
            unit:            l.unit ?? '',
          }))
        : [{ ...BLANK_LINE }]
    )
    setDrawerOpen(true)
  }

  const updateLines = (rows: any[]) => setLines(rows.map(l => ({
    ...l,
    difference: Number(l.adjustedQty) - Number(l.currentQty),
  })))

  const stats = {
    total:     records.length,
    draft:     records.filter((r: any) => r.status === 'draft').length,
    confirmed: records.filter((r: any) => r.status === 'confirmed').length,
    thisMonth: records.filter((r: any) => { const d = new Date(r.createdAt); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).length,
  }

  const handleSave = () => {
    if (!form.adjDate) return alert('Adjustment date is required')
    if (!lines.some(l => l.itemDescription?.trim())) return alert('Add at least one item')
    const mappedLines = lines.filter(l => l.itemDescription?.trim()).map(l => ({
      itemDescription: l.itemDescription.trim(),
      currentQty:  Number(l.currentQty),
      adjustedQty: Number(l.adjustedQty),
      difference:  Number(l.adjustedQty) - Number(l.currentQty),
      ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
    }))
    if (editRow) {
      update_({
        variables: {
          id: editRow.id,
          input: {
            adjDate: form.adjDate, adjustmentType: form.adjustmentType,
            ...(form.warehouseId ? { warehouseId: form.warehouseId, warehouseName: form.warehouseName } : {}),
            ...(form.reason.trim() ? { reason: form.reason } : {}),
            ...(form.notes.trim()  ? { notes: form.notes }  : {}),
            lineItems: mappedLines,
          },
        },
      })
    } else {
      create({
        variables: {
          input: {
            adjDate: form.adjDate, adjustmentType: form.adjustmentType,
            ...(form.warehouseId ? { warehouseId: form.warehouseId, warehouseName: form.warehouseName } : {}),
            ...(form.reason.trim() ? { reason: form.reason } : {}),
            ...(form.notes.trim()  ? { notes: form.notes }  : {}),
            organizationId: orgId,
            lineItems: mappedLines,
          },
        },
      })
    }
  }

  const LINE_COLS = [
    { key: 'itemDescription', header: 'Item Description' },
    { key: 'currentQty',      header: 'Current Qty',  width: '100px', type: 'number' as const },
    { key: 'adjustedQty',     header: 'Adjusted Qty', width: '100px', type: 'number' as const },
    { key: 'difference',      header: 'Diff',         width: '80px',  readOnly: true },
    { key: 'unit',            header: 'Unit',         width: '80px' },
  ]

  const columns: Column[] = [
    { key: 'adjNumber',      label: 'Adj #',      width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'adjDate',        label: 'Date',       width: '110px', render: v => <DateCell value={v} /> },
    { key: 'warehouseName',  label: 'Warehouse',  render: v => <span className="text-sm">{v || '—'}</span> },
    { key: 'adjustmentType', label: 'Type',       width: '100px', render: v => <span className="text-xs capitalize">{v}</span> },
    { key: 'lineItems',      label: 'Lines',      width: '60px',  render: v => <span className="text-xs">{Array.isArray(v) ? v.length : 0}</span> },
    { key: 'status',         label: 'Status',     width: '110px', render: v => <ErpBadge status={v} /> },
    { key: 'createdAt',      label: 'Created',    width: '110px', render: v => <DateCell value={v} /> },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Stock Adjustments"
        subtitle="Correct inventory quantities after physical stock counts"
        icon={<ClipboardList className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Adjustments' }]}
        actions={
          <button onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Adjustment
          </button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total"      value={stats.total}     icon={<ClipboardList className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"      value={stats.draft}     icon={<FileEdit      className="h-5 w-5" />} variant="amber" />
        <StatCard label="Confirmed"  value={stats.confirmed} icon={<BadgeCheck    className="h-5 w-5" />} variant="green" />
        <StatCard label="This Month" value={stats.thisMonth} icon={<CalendarDays  className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All Stock Adjustments" searchable searchPlaceholder="Search adjustments…"
        emptyMessage="No stock adjustments yet."
        pageSize={25}
        onRowClick={(r: any) => { if (r.status === 'draft') openEdit(r) }}
        isRowClickable={(r: any) => r.status === 'draft'}
        actions={[
          { label: 'Edit',    icon: <Pencil className="h-3.5 w-3.5" />, onClick: (r: any) => openEdit(r),                                      show: (r: any) => r.status === 'draft' },
          { label: 'Confirm', icon: <Check  className="h-3.5 w-3.5" />, onClick: (r: any) => setConfirm({ action: 'confirm', id: r.id }),      show: (r: any) => r.status === 'draft' },
          { label: 'Cancel',  icon: <X      className="h-3.5 w-3.5" />, onClick: (r: any) => setConfirm({ action: 'cancel',  id: r.id }),      show: (r: any) => r.status !== 'cancelled' },
          { label: 'Delete',  icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (r: any) => setConfirm({ action: 'delete',  id: r.id }) },
        ]}
      />

      <FormDrawer
        open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditRow(null) }}
        title={editRow ? `Edit Adjustment ${editRow.adjNumber ?? ''}` : 'New Stock Adjustment'} size="lg"
        submitLabel={editRow ? 'Save Changes' : 'Save Adjustment'} onSubmit={handleSave} submitting={saving || updating}
      >
        <FormSection title="Details" columns={3}>
          <InputFloating label="Date *"            type="date"    value={form.adjDate}         onChange={e => setF('adjDate', e.target.value)} />
          <SelectFloating label="Warehouse"        value={form.warehouseId}
            onChange={v => setF('warehouseId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'All / N/A' }, ...warehouses.map((w: any) => ({ value: w.id, label: w.warehouseName }))]}
          />
          <SelectFloating label="Adjustment Type *" value={form.adjustmentType}
            onChange={v => setF('adjustmentType', typeof v === 'string' ? v : (v as any).target.value)}
            options={ADJ_TYPES}
          />
          <InputFloating label="Reason" value={form.reason} onChange={e => setF('reason', e.target.value)} />
        </FormSection>
        <FormSection title="Items" columns={1}>
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
            const id = confirm.id
            if (confirm.action === 'confirm') confirm_({ variables: { id } })
            if (confirm.action === 'cancel')  cancel_({ variables: { id } })
            if (confirm.action === 'delete')  delete_({ variables: { id } })
          }}
          title={confirm.action === 'confirm' ? 'Confirm Adjustment?' : confirm.action === 'cancel' ? 'Cancel Adjustment?' : 'Delete Adjustment?'}
          description={confirm.action === 'confirm' ? 'Stock quantities will be updated immediately.' : 'This action cannot be undone.'}
          confirmLabel={confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)}
          destructive={confirm.action !== 'confirm'}
        />
      )}
    </div>
  )
}
