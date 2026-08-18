'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column, Action } from '@/components/DataTable'
import {
  GET_GRNS,
  GET_PURCHASE_ORDERS,
  CREATE_GRN,
  DELETE_GRN,
  SUBMIT_GRN_FOR_APPROVAL,
} from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FileText, Plus, Minus, Save, X, Trash2, Send, Clock, CheckCircle } from 'lucide-react'

type GrnRow = {
  id: string
  grnNumber?: string | null
  vendorName?: string | null
  receivedDate?: string | null
  lineItems?: Array<{
    itemDescription: string
    orderedQty: number
    receivedQty: number
    unitPrice?: number | null
  }> | null
  notes?: string | null
  status?: string | null
  createdAt?: string | null
}

type PoRow = {
  id: string
  seqNo?: string | null
  vendorId?: string | null
  vendorName?: string | null
  status?: string | null
  items?: Array<{
    itemDescription?: string | null
    quantity?: number | null
    unitPrice?: number | null
  }> | null
}

const RECEIVABLE_PO_STATUSES = new Set(['purchase_order', 'sent', 'received', 'partially_received'])

const EMPTY_LINE = {
  itemDescription: '',
  orderedQty: '',
  receivedQty: '',
  unitPrice: '',
}

function formatDate(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}

export default function GRNPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [panelOpen, setPanelOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [poId, setPoId] = useState('')
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])

  const { data, loading, error: listError, refetch } = useQuery(GET_GRNS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: poData } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createGrn, { loading: creating }] = useMutation(CREATE_GRN, {
    onCompleted: () => {
      closePanel()
      void refetch()
    },
    onError: (e) => setFormError(e.message),
  })

  const [submitGrnForApproval] = useMutation(SUBMIT_GRN_FOR_APPROVAL, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const [deleteGrn] = useMutation(DELETE_GRN, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const grns: GrnRow[] = data?.grns ?? []
  const purchaseOrders: PoRow[] = poData?.purchaseorders ?? []

  const receivablePos = useMemo(
    () => purchaseOrders.filter((p) => p.status && RECEIVABLE_PO_STATUSES.has(String(p.status))),
    [purchaseOrders],
  )

  const stats = {
    total: grns.length,
    draft: grns.filter((g) => g.status === 'draft').length,
    pending: grns.filter((g) => g.status === 'submitted').length,
    confirmed: grns.filter((g) => g.status === 'confirmed').length,
  }

  function closePanel() {
    setPanelOpen(false)
    setFormError('')
    setPoId('')
    setReceivedDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setVendorName('')
    setLines([{ ...EMPTY_LINE }])
  }

  function applyFromPo(id: string) {
    setPoId(id)
    if (!id) {
      return
    }
    const po = receivablePos.find((p) => p.id === id)
    if (!po) return
    setVendorName(po.vendorName ? String(po.vendorName) : '')
    const its = Array.isArray(po.items) ? po.items : []
    if (its.length === 0) {
      setLines([{ ...EMPTY_LINE }])
      return
    }
    setLines(
      its.map((it) => {
        const q = it.quantity != null ? Number(it.quantity) : 0
        const up = it.unitPrice != null ? Number(it.unitPrice) : 0
        return {
          itemDescription: it.itemDescription != null ? String(it.itemDescription) : '',
          orderedQty: String(q),
          receivedQty: String(q),
          unitPrice: up ? String(up) : '',
        }
      }),
    )
  }

  function setLine(i: number, field: string, v: string) {
    setLines((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: v }
      return next
    })
  }

  function addLine() {
    setLines((p) => [...p, { ...EMPTY_LINE }])
  }

  function removeLine(i: number) {
    setLines((p) => (p.length <= 1 ? p : p.filter((_, j) => j !== i)))
  }

  function submitNew() {
    if (!orgId) {
      setFormError('Organization required')
      return
    }
    if (!receivedDate.trim()) {
      setFormError('Received date is required')
      return
    }
    const po = poId ? receivablePos.find((p) => p.id === poId) : undefined
    const mappedLines = lines.map((l) => ({
      itemDescription: (l.itemDescription || '').trim() || 'Item',
      orderedQty: parseFloat(l.orderedQty) || 0,
      receivedQty: parseFloat(l.receivedQty) || 0,
      unitPrice:
        l.unitPrice.trim() === '' ? undefined : (parseFloat(l.unitPrice) || 0),
    }))
    if (mappedLines.every((l) => l.receivedQty <= 0)) {
      setFormError('Enter received quantities (at least one line must be greater than 0).')
      return
    }
    setFormError('')
    const input: Record<string, unknown> = {
      organizationId: orgId,
      receivedDate,
      lineItems: mappedLines,
      status: 'draft',
    }
    if (notes.trim()) input.notes = notes.trim()
    if (poId && po) {
      input.purchaseOrderId = poId
      if (po.vendorId) input.vendorId = po.vendorId
    }
    if (vendorName.trim()) input.vendorName = vendorName.trim()
    createGrn({ variables: { input } })
  }

  const columns: Column<GrnRow>[] = [
    {
      key: 'grnNumber',
      label: 'GRN #',
      width: '150px',
      render: (v) => <span className="font-mono text-xs text-gray-600">{v ?? '—'}</span>,
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (v) => <span className="font-medium">{v || '—'}</span>,
    },
    {
      key: 'receivedDate',
      label: 'Received',
      width: '110px',
      render: (v) => <span>{formatDate(v as string)}</span>,
    },
    {
      key: 'lineItems',
      label: 'Lines',
      width: '80px',
      render: (v) => (
        <span className="text-gray-600">
          {Array.isArray(v) ? `${v.length} line(s)` : '—'}
        </span>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (v) => <span className="text-gray-500 text-xs line-clamp-2">{v || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (v) => {
        const s = String(v ?? '')
        let cls = 'bg-amber-50 text-amber-800 border-amber-200'
        let label = s || '—'
        if (s === 'confirmed') cls = 'bg-green-50 text-green-700 border-green-200'
        else if (s === 'submitted') cls = 'bg-sky-50 text-sky-800 border-sky-200'
        else if (s === 'approval_declined') cls = 'bg-red-50 text-red-700 border-red-200'
        if (s === 'submitted') label = 'pending approval'
        if (s === 'approval_declined') label = 'declined'
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
          >
            {label}
          </span>
        )
      },
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '168px',
      render: (_v, row) => {
        const st = String(row.status ?? '')
        const showSubmit = st === 'draft' || st === 'approval_declined'
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            {showSubmit ? (
              <CellSelect
                aria-label="GRN approval action"
                className="max-w-[160px]"
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  if (val === 'submit' && row.id) void submitGrnForApproval({ variables: { id: row.id } })
                }}
                options={[
                  { value: '', label: 'Change status…' },
                  { value: 'submit', label: 'Send for approval' },
                ]}
              />
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: (v) => <span>{formatDate(v as string)}</span>,
    },
  ]

  const actions: Action<GrnRow>[] = [
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      variant: 'ghost',
      onClick: (row) => {
        if (!row.id) return
        if (confirm('Delete this GRN?')) deleteGrn({ variables: { id: row.id } })
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Goods Receipt Notes (GRN)</h1>
          <p className="text-gray-500">
            Record goods received against purchase orders or ad hoc. GRNs can also be created when a PO is
            marked received.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setPanelOpen(true)} disabled={!orgId}>
          <Plus className="h-4 w-4 mr-2" />
          New GRN
        </Button>
      </div>

      {!orgId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your profile; GRNs cannot be loaded.
        </p>
      )}

      {listError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {listError.message}
        </p>
      )}

      {panelOpen && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New GRN (receipt)</span>
            <button type="button" onClick={closePanel} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <SelectFloating
                label="Purchase order (optional)"
                value={poId}
                onChange={(e) => applyFromPo(typeof e === 'string' ? e : e.target.value)}
                placeholder="— Ad hoc / no PO —"
                options={receivablePos.map((p) => ({
                  value: p.id,
                  label: `${p.seqNo ?? p.id} · ${p.vendorName ?? 'Vendor'} (${p.status})`,
                }))}
              />
              <InputFloating
                label="Received date"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
              <InputFloating
                label="Vendor name"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="As on documents"
              />
            </div>
            <p className="text-gray-500 text-[11px]">
              New GRNs save as <strong>draft</strong>. Use <strong>Send for approval</strong> in the list so the purchases approver can post them as confirmed.
            </p>
            <InputFloating
              label="Notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery reference, gate pass, etc."
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Line items</span>
                <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={addLine}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add line
                </Button>
              </div>
              <div className="border border-gray-300 rounded overflow-x-auto">
                <div className="grid grid-cols-[1.5fr_5rem_5rem_5rem_2rem] gap-0 bg-[#f0f0f0] border-b border-gray-300 text-[0.65rem] font-semibold text-gray-600 uppercase">
                  <div className="px-2 py-2 border-r border-gray-300">Description</div>
                  <div className="px-2 py-2 border-r border-gray-300 text-right">Ord.</div>
                  <div className="px-2 py-2 border-r border-gray-300 text-right">Rcvd</div>
                  <div className="px-2 py-2 border-r border-gray-300 text-right">Price</div>
                  <div className="px-2 py-2" />
                </div>
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.5fr_5rem_5rem_5rem_2rem] gap-0 border-b border-gray-200 last:border-b-0 bg-white"
                  >
                    <div className="px-1 py-1 border-r border-gray-200">
                      <CellInput
                        value={line.itemDescription}
                        onChange={(e) => setLine(i, 'itemDescription', e.target.value)}
                        placeholder="Item / material"
                      />
                    </div>
                    <div className="px-1 py-1 border-r border-gray-200">
                      <CellInput
                        type="number"
                        min={0}
                        step="any"
                        value={line.orderedQty}
                        onChange={(e) => setLine(i, 'orderedQty', e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div className="px-1 py-1 border-r border-gray-200">
                      <CellInput
                        type="number"
                        min={0}
                        step="any"
                        value={line.receivedQty}
                        onChange={(e) => setLine(i, 'receivedQty', e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div className="px-1 py-1 border-r border-gray-200">
                      <CellInput
                        type="number"
                        min={0}
                        step="any"
                        value={line.unitPrice}
                        onChange={(e) => setLine(i, 'unitPrice', e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="text-gray-500 hover:text-red-600 p-1"
                        aria-label="Remove line"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={creating}
                onClick={submitNew}
              >
                <Save className="h-4 w-4 mr-2" />
                {creating ? 'Saving…' : 'Save GRN'}
              </Button>
              <Button type="button" variant="outline" onClick={closePanel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total GRNs', value: stats.total, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, cls: 'text-amber-600 bg-amber-50' },
          { label: 'Pending approval', value: stats.pending, icon: Send, cls: 'text-sky-600 bg-sky-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable<GrnRow>
        data={grns}
        columns={columns}
        loading={loading}
        title="All GRNs"
        searchable
        searchPlaceholder="Search GRNs…"
        emptyMessage="No GRNs yet. Create one above or receive an approved/sent purchase order."
        actions={actions}
        rowKey="id"
      />
    </div>
  )
}
