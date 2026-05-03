'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_STOCK_ADJUSTMENTS,
  GET_WAREHOUSES,
  CREATE_STOCK_ADJUSTMENT,
  CONFIRM_STOCK_ADJUSTMENT,
  CANCEL_STOCK_ADJUSTMENT,
  DELETE_STOCK_ADJUSTMENT,
} from '@/gql/queries'
import {
  ClipboardList,
  FileEdit,
  BadgeCheck,
  XCircle,
  Trash2,
  X,
  Save,
  Plus,
  Minus,
  CalendarDays,
} from 'lucide-react'

const STATUS_MAP: Record<string, string> = {
  draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const ADJ_TYPES = ['recount', 'increase', 'decrease', 'write-off']

const EMPTY_FORM = {
  adjDate: new Date().toISOString().split('T')[0],
  warehouseId: '',
  warehouseName: '',
  adjustmentType: 'recount',
  reason: '',
  notes: '',
}

const EMPTY_LINE = {
  itemDescription: '',
  currentQty: 0,
  adjustedQty: 0,
  difference: 0,
  unit: '',
}

export default function StockAdjustmentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_STOCK_ADJUSTMENTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const { data: warehouseData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createAdj, { loading: saving }] = useMutation(CREATE_STOCK_ADJUSTMENT, {
    onCompleted: () => { refetch(); closeForm() },
    onError: (e) => alert(e.message),
  })

  const [confirmAdj] = useMutation(CONFIRM_STOCK_ADJUSTMENT, {
    onCompleted: () => refetch(),
    onError: (e) => alert(e.message),
  })

  const [cancelAdj] = useMutation(CANCEL_STOCK_ADJUSTMENT, {
    onCompleted: () => refetch(),
    onError: (e) => alert(e.message),
  })

  const [deleteAdj] = useMutation(DELETE_STOCK_ADJUSTMENT, {
    onCompleted: () => refetch(),
    onError: (e) => alert(e.message),
  })

  const reset = () => {
    setForm({ ...EMPTY_FORM })
    setLines([{ ...EMPTY_LINE }])
    setErrors({})
  }

  const closeForm = () => { setAdding(false); reset() }

  const setF = (k: string, v: string) => {
    setForm(p => {
      const updated = { ...p, [k]: v }
      if (k === 'warehouseId') {
        const wh = warehouses.find((w: any) => w.id === v)
        updated.warehouseName = wh?.warehouseName || ''
      }
      return updated
    })
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string | number) => {
    setLines(prev => {
      const updated = [...prev]
      const line = { ...updated[idx], [k]: v }
      if (k === 'adjustedQty' || k === 'currentQty') {
        const adj = k === 'adjustedQty' ? Number(v) : Number(line.adjustedQty)
        const cur = k === 'currentQty' ? Number(v) : Number(line.currentQty)
        line.difference = adj - cur
      }
      updated[idx] = line
      return updated
    })
  }

  const addLine = () => setLines(p => [...p, { ...EMPTY_LINE }])
  const removeLine = (idx: number) => setLines(p => p.filter((_, i) => i !== idx))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.adjDate) e.adjDate = 'Required'
    if (!form.adjustmentType) e.adjustmentType = 'Required'
    if (lines.length === 0) e.lines = 'At least one line item required'
    lines.forEach((l, i) => {
      if (!l.itemDescription.trim()) e[`line_${i}_desc`] = 'Required'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input: Record<string, unknown> = {
      adjDate: form.adjDate,
      adjustmentType: form.adjustmentType,
      organizationId: orgId,
      lineItems: lines.map((l) => ({
        itemDescription: l.itemDescription.trim(),
        currentQty: Number(l.currentQty),
        adjustedQty: Number(l.adjustedQty),
        difference: Number(l.adjustedQty) - Number(l.currentQty),
        ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
      })),
    }
    if (form.reason.trim()) input.reason = form.reason.trim()
    if (form.notes.trim()) input.notes = form.notes.trim()
    if (form.warehouseId) {
      input.warehouseId = form.warehouseId
      const name = form.warehouseName?.trim()
      if (name) input.warehouseName = name
    }
    createAdj({ variables: { input } })
  }

  const handleConfirm = (id: string) => {
    if (confirm('Confirm this stock adjustment?')) confirmAdj({ variables: { id } })
  }

  const handleCancel = (id: string) => {
    if (confirm('Cancel this stock adjustment?')) cancelAdj({ variables: { id } })
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this stock adjustment?')) deleteAdj({ variables: { id } })
  }

  const records = data?.stockadjustments ?? []
  const warehouses = warehouseData?.warehouses ?? []

  const now = new Date()
  const thisMonth = records.filter((r: any) => {
    if (!r.createdAt) return false
    const d = new Date(r.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const stats = {
    total: records.length,
    draft: records.filter((r: any) => r.status === 'draft').length,
    confirmed: records.filter((r: any) => r.status === 'confirmed').length,
    thisMonth: thisMonth.length,
  }

  const columns: Column[] = [
    {
      key: 'adjNumber',
      label: 'Adj #',
      width: '140px',
      render: v => <span className="font-mono text-xs text-gray-600">{v || '—'}</span>,
    },
    {
      key: 'adjDate',
      label: 'Date',
      width: '110px',
      render: v => <span className="text-xs text-gray-600">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
    },
    {
      key: 'warehouseName',
      label: 'Warehouse',
      render: v => <span className="text-xs text-gray-700">{v || '—'}</span>,
    },
    {
      key: 'adjustmentType',
      label: 'Type',
      width: '100px',
      render: v => <span className="text-xs capitalize text-gray-700">{v || '—'}</span>,
    },
    {
      key: 'lineItems',
      label: 'Items',
      width: '70px',
      render: v => <span className="text-xs text-gray-600">{Array.isArray(v) ? v.length : 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: v => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_MAP[v] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: v => <span className="text-xs text-gray-500">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Adjustments</h1>
        <p className="text-gray-500">Correct inventory quantities after physical stock counts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: ClipboardList, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: FileEdit, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: BadgeCheck, cls: 'text-green-600 bg-green-50' },
          { label: 'This Month', value: stats.thisMonth, icon: CalendarDays, cls: 'text-purple-600 bg-purple-50' },
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

      {/* Inline form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Stock Adjustment</span>
            <button onClick={closeForm} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="Adjustment Date *"
                type="date"
                value={form.adjDate}
                onChange={e => setF('adjDate', e.target.value)}
                error={errors.adjDate}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Warehouse"
                value={form.warehouseId}
                onChange={e => setF('warehouseId', typeof e === 'string' ? e : e.target.value)}
                options={[
                  { value: '', label: 'Select warehouse...' },
                  ...warehouses.map((w: any) => ({ value: w.id, label: w.warehouseName })),
                ]}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Adjustment Type *"
                value={form.adjustmentType}
                onChange={e => setF('adjustmentType', typeof e === 'string' ? e : e.target.value)}
                options={ADJ_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Reason"
                value={form.reason}
                onChange={e => setF('reason', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Line Items</span>
                <button
                  onClick={addLine}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Line
                </button>
              </div>
              {errors.lines && <p className="text-xs text-red-500 mb-1">{errors.lines}</p>}
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium">Item Description *</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">Current Qty</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">Adjusted Qty</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">Difference</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-20">Unit</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="px-2 py-1">
                          <input
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                            placeholder="Item description"
                            value={line.itemDescription}
                            onChange={e => setLine(idx, 'itemDescription', e.target.value)}
                          />
                          {errors[`line_${idx}_desc`] && (
                            <p className="text-red-500 text-[10px]">{errors[`line_${idx}_desc`]}</p>
                          )}
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                            value={line.currentQty}
                            onChange={e => setLine(idx, 'currentQty', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                            value={line.adjustedQty}
                            onChange={e => setLine(idx, 'adjustedQty', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <span
                            className={`text-xs font-medium ${line.difference > 0 ? 'text-green-600' : line.difference < 0 ? 'text-red-600' : 'text-gray-500'}`}
                          >
                            {line.difference > 0 ? '+' : ''}{line.difference}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                            placeholder="pcs"
                            value={line.unit}
                            onChange={e => setLine(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          {lines.length > 1 && (
                            <button onClick={() => removeLine(idx)} className="text-gray-400 hover:text-red-500">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div>
              <InputFloating
                label="Notes"
                multiline
                rows={2}
                value={form.notes}
                onChange={e => setF('notes', e.target.value)}
                className="text-xs min-h-[50px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t">
              <Button variant="outline" size="sm" onClick={closeForm} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={saving}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={records}
        columns={columns}
        loading={loading}
        title="All Stock Adjustments"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Adjustment"
        searchable
        searchPlaceholder="Search adjustments..."
        emptyMessage="No stock adjustments yet."
        actions={[
          {
            label: 'Confirm',
            icon: <BadgeCheck className="h-3.5 w-3.5" />,
            onClick: (row: any) => handleConfirm(row.id),
            variant: 'ghost',
            show: (row: any) => row.status === 'draft',
          },
          {
            label: 'Cancel',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (row: any) => handleCancel(row.id),
            variant: 'ghost',
            show: (row: any) => row.status !== 'cancelled',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row: any) => handleDelete(row.id),
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
