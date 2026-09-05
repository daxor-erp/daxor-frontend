'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_GOODS_RECEIPTS,
  CREATE_GOODS_RECEIPT,
  UPDATE_GOODS_RECEIPT,
  DELETE_GOODS_RECEIPT,
} from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Plus, Save, X, Pencil, Trash2, Package, Clock, CheckCircle2 } from 'lucide-react'

type GoodsReceiptRow = {
  id: string
  docNumber?: string | null
  docDate?: string | null
  status?: string | null
  createdAt?: string | null
}

export default function GoodsReceiptsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    status: 'DRAFT',
    organizationId: orgId,
  })

  useEffect(() => {
    if (!orgId) return
    setForm((p) => ({ ...p, organizationId: orgId }))
  }, [orgId])

  const { data, loading, error: queryError, refetch } = useQuery(GET_GOODS_RECEIPTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  function closePanel() {
    setPanelOpen(false)
    setEditingId(null)
    setFormError('')
    setForm({
      docDate: new Date().toISOString().split('T')[0],
      status: 'DRAFT',
      organizationId: orgId,
    })
  }

  const [createGoodsReceipt, { loading: creating }] = useMutation(CREATE_GOODS_RECEIPT, {
    onCompleted: () => { closePanel(); void refetch() },
    onError: (err) => setFormError(err.message),
  })

  const [updateGoodsReceipt, { loading: updating }] = useMutation(UPDATE_GOODS_RECEIPT, {
    onCompleted: () => { closePanel(); void refetch() },
    onError: (err) => setFormError(err.message),
  })

  const [deleteGoodsReceipt] = useMutation(DELETE_GOODS_RECEIPT, {
    onCompleted: () => void refetch(),
    onError: (err) => alert(err.message),
  })

  const items: GoodsReceiptRow[] = data?.goodsreceipts ?? []
  const draft = items.filter((i) => String(i.status).toUpperCase() === 'DRAFT').length
  const posted = items.filter((i) => String(i.status).toUpperCase() === 'POSTED').length

  const openNew = () => {
    setEditingId(null)
    setFormError('')
    setForm({
      docDate: new Date().toISOString().split('T')[0],
      status: 'DRAFT',
      organizationId: orgId,
    })
    setPanelOpen(true)
  }

  const openEdit = (row: GoodsReceiptRow) => {
    if (!row.id) return
    const raw = row.docDate ?? ''
    let ymd = ''
    if (raw) {
      const d = new Date(raw)
      if (!Number.isNaN(d.getTime())) ymd = d.toISOString().split('T')[0]
    }
    if (!ymd) ymd = new Date().toISOString().split('T')[0]
    setEditingId(row.id)
    setFormError('')
    setForm({
      docDate: ymd,
      status: row.status != null && row.status !== '' ? String(row.status) : 'DRAFT',
      organizationId: orgId,
    })
    setPanelOpen(true)
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
    const input = { docDate: form.docDate, status: form.status, organizationId: orgId }
    setFormError('')
    if (editingId) updateGoodsReceipt({ variables: { id: editingId, input } })
    else createGoodsReceipt({ variables: { input } })
  }

  const saving = creating || updating

  const columns: Column[] = [
    { key: 'docNumber', label: 'Document #', width: '140px', render: (v) => <MonoCell value={v ?? '—'} /> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
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
          <Button onClick={openNew} disabled={!orgId} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Receipt
          </Button>
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

      {panelOpen && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit Goods Receipt' : 'New Goods Receipt'}</span>
            <button type="button" onClick={closePanel} className="text-primary-foreground/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <InputFloating label="Doc Date *" type="date" value={form.docDate} onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))} className="h-7 text-xs" />
              <SelectFloating
                label="Status"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: typeof e === 'string' ? e : e.target.value }))}
                options={[
                  { value: 'DRAFT', label: 'DRAFT' },
                  { value: 'POSTED', label: 'POSTED' },
                  { value: 'CANCELLED', label: 'CANCELLED' },
                ]}
                className="h-7 text-xs"
              />
            </div>
            {formError && <p className="text-xs text-red-600">{formError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={closePanel}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1" /> {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Goods Receipts"
        searchable
        searchPlaceholder="Search receipts…"
        emptyMessage="No goods receipts found."
        pageSize={25}
        onRowClick={openEdit}
        actions={[
          { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: (r) => openEdit(r) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (r) => { if (r.id && confirm('Delete this goods receipt?')) deleteGoodsReceipt({ variables: { id: r.id } }) } },
        ]}
      />
    </div>
  )
}
