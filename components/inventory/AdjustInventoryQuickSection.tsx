'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { DataTable, Column, Action } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_STOCK_ADJUSTMENTS,
  CREATE_STOCK_ADJUSTMENT,
  CONFIRM_STOCK_ADJUSTMENT,
  CANCEL_STOCK_ADJUSTMENT,
  DELETE_STOCK_ADJUSTMENT,
} from '@/gql/queries'
import { StatusBadge } from '@/components/ui/status-badge'
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
import {
  ADJ_TYPES,
  EMPTY_ADJ_FORM,
  EMPTY_ADJ_LINE,
  AdjFormState,
  AdjLineState,
  buildCreateStockAdjustmentInput,
  formatAdjDate,
} from '@/components/inventory/stock-adjustment-shared'

const STATUS_MAP: Record<string, string> = {
  draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

type WarehouseOpt = { id: string; warehouseName?: string; warehouseCode?: string }

type AdjRow = {
  id: string
  adjNumber?: string | null
  adjDate?: string | null
  warehouseName?: string | null
  adjustmentType?: string | null
  lineItems?: unknown[] | null
  status?: string | null
  createdAt?: string | null
}

type Props = {
  organizationId: string
  warehouses: WarehouseOpt[]
}

export function AdjustInventoryQuickSection({ organizationId: orgId, warehouses }: Props) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<AdjFormState>({ ...EMPTY_ADJ_FORM })
  const [lines, setLines] = useState<AdjLineState[]>([{ ...EMPTY_ADJ_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_STOCK_ADJUSTMENTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createAdj, { loading: saving }] = useMutation(CREATE_STOCK_ADJUSTMENT, {
    onCompleted: () => {
      void refetch()
      closeForm()
    },
    onError: (e) => alert(e.message),
  })

  const [confirmAdj] = useMutation(CONFIRM_STOCK_ADJUSTMENT, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const [cancelAdj] = useMutation(CANCEL_STOCK_ADJUSTMENT, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const [deleteAdj] = useMutation(DELETE_STOCK_ADJUSTMENT, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const reset = () => {
    setForm({ ...EMPTY_ADJ_FORM })
    setLines([{ ...EMPTY_ADJ_LINE }])
    setErrors({})
  }

  const closeForm = () => {
    setAdding(false)
    reset()
  }

  const setF = (k: keyof AdjFormState, v: string) => {
    setForm((p) => {
      const updated = { ...p, [k]: v }
      if (k === 'warehouseId') {
        const wh = warehouses.find((w) => w.id === v)
        updated.warehouseName = wh?.warehouseName || ''
      }
      return updated
    })
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const setLine = (idx: number, k: keyof AdjLineState, v: string | number) => {
    setLines((prev) => {
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

  const addLine = () => setLines((p) => [...p, { ...EMPTY_ADJ_LINE }])
  const removeLine = (idx: number) => setLines((p) => (p.length <= 1 ? p : p.filter((_, i) => i !== idx)))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.adjDate) e.adjDate = 'Required'
    if (!form.adjustmentType) e.adjustmentType = 'Required'
    if (lines.length === 0) e.lines = 'At least one line item required'
    lines.forEach((l, i) => {
      if (!l.itemDescription.trim()) e[`line_${i}_desc`] = 'Required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    createAdj({ variables: { input: buildCreateStockAdjustmentInput(form, lines, orgId) } })
  }

  const records: AdjRow[] = data?.stockadjustments ?? []

  const now = new Date()
  const stats = {
    total: records.length,
    draft: records.filter((r) => r.status === 'draft').length,
    confirmed: records.filter((r) => r.status === 'confirmed').length,
    thisMonth: records.filter((r) => {
      if (!r.createdAt) return false
      const d = new Date(r.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
  }

  const columns: Column<AdjRow>[] = [
    {
      key: 'adjNumber',
      label: 'Adj #',
      width: '140px',
      render: (v) => <span className="font-mono text-xs text-gray-600">{v ?? '—'}</span>,
    },
    {
      key: 'adjDate',
      label: 'Date',
      width: '110px',
      render: (v) => (
        <span className="text-xs text-gray-600">{formatAdjDate(v as string)}</span>
      ),
    },
    {
      key: 'warehouseName',
      label: 'Warehouse',
      render: (v) => <span className="text-xs text-gray-700">{v || '—'}</span>,
    },
    {
      key: 'adjustmentType',
      label: 'Type',
      width: '100px',
      render: (v) => (
        <span className="text-xs capitalize text-gray-700">{v ? String(v) : '—'}</span>
      ),
    },
    {
      key: 'lineItems',
      label: 'Items',
      width: '70px',
      render: (v) => (
        <span className="text-xs text-gray-600">{Array.isArray(v) ? v.length : 0}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (v) => <StatusBadge status={v != null && v !== '' ? String(v) : undefined} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: (v) => (
        <span className="text-xs text-gray-500">{formatAdjDate(v as string)}</span>
      ),
    },
  ]

  const actions: Action<AdjRow>[] = [
    {
      label: 'Confirm',
      icon: <BadgeCheck className="h-3.5 w-3.5 text-green-600" />,
      onClick: (row) => {
        if (!row.id) return
        if (confirm('Confirm this stock adjustment?')) confirmAdj({ variables: { id: row.id } })
      },
      variant: 'ghost',
      show: (row) => row.status === 'draft',
    },
    {
      label: 'Cancel',
      icon: <XCircle className="h-3.5 w-3.5 text-amber-600" />,
      onClick: (row) => {
        if (!row.id) return
        if (confirm('Cancel this adjustment?')) cancelAdj({ variables: { id: row.id } })
      },
      variant: 'ghost',
      show: (row) => row.status !== 'cancelled' && row.status != null,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      onClick: (row) => {
        if (!row.id) return
        if (confirm('Delete this adjustment?')) deleteAdj({ variables: { id: row.id } })
      },
      variant: 'ghost',
    },
  ]

  if (!orgId) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-4 text-sm text-amber-800 bg-amber-50/80">
        Sign in with an organization to use stock adjustments.
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden space-y-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Adjust inventory</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create adjustments, confirm postings, and track drafts — same data as{' '}
            <span className="font-medium">Stock adjustments</span> in the sidebar.
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => { reset(); setAdding(true) }}>
          <Plus className="h-4 w-4 mr-1" />
          New adjustment
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total', value: stats.total, icon: ClipboardList, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: FileEdit, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: BadgeCheck, cls: 'text-green-600 bg-green-50' },
          { label: 'This month', value: stats.thisMonth, icon: CalendarDays, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="border border-gray-200 rounded-md p-2 flex items-center gap-2">
            <div className={`p-1.5 rounded ${cls.split(' ')[1]}`}>
              <Icon className={`h-3.5 w-3.5 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{label}</p>
              <p className="text-base font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50/30">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New stock adjustment</span>
            <button type="button" onClick={closeForm} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputFloating
                label="Adjustment date *"
                type="date"
                value={form.adjDate}
                onChange={(e) => setF('adjDate', e.target.value)}
                error={errors.adjDate}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Warehouse"
                value={form.warehouseId}
                onChange={(e) =>
                  setF('warehouseId', typeof e === 'string' ? e : e.target.value)
                }
                options={[
                  { value: '', label: 'Optional…' },
                  ...warehouses.map((w) => ({
                    value: w.id,
                    label: w.warehouseCode
                      ? `${w.warehouseCode} — ${w.warehouseName || 'Warehouse'}`
                      : w.warehouseName || 'Warehouse',
                  })),
                ]}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Adjustment type *"
                value={form.adjustmentType}
                onChange={(e) =>
                  setF('adjustmentType', typeof e === 'string' ? e : e.target.value)
                }
                options={ADJ_TYPES.map((t) => ({
                  value: t,
                  label: t.charAt(0).toUpperCase() + t.slice(1),
                }))}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Reason"
                value={form.reason}
                onChange={(e) => setF('reason', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Line items</span>
                <button
                  type="button"
                  onClick={addLine}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-3.5 w-3.5" /> Add line
                </button>
              </div>
              {errors.lines && <p className="text-xs text-red-500 mb-1">{errors.lines}</p>}
              <div className="border border-gray-200 rounded overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium">Item *</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">Current</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">Adjusted</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-20">Diff</th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-20">Unit</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="px-2 py-1">
                          <input
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                            placeholder="Description"
                            value={line.itemDescription}
                            onChange={(e) => setLine(idx, 'itemDescription', e.target.value)}
                          />
                          {errors[`line_${idx}_desc`] && (
                            <p className="text-red-500 text-[10px]">{errors[`line_${idx}_desc`]}</p>
                          )}
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                            value={line.currentQty}
                            onChange={(e) => setLine(idx, 'currentQty', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                            value={line.adjustedQty}
                            onChange={(e) => setLine(idx, 'adjustedQty', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <span
                            className={`text-xs font-medium ${line.difference > 0 ? 'text-green-600' : line.difference < 0 ? 'text-red-600' : 'text-gray-500'}`}
                          >
                            {line.difference > 0 ? '+' : ''}
                            {line.difference}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                            placeholder="pcs"
                            value={line.unit}
                            onChange={(e) => setLine(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          {lines.length > 1 && (
                            <button type="button" onClick={() => removeLine(idx)} className="text-gray-400 hover:text-red-500">
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

            <InputFloating
              label="Notes"
              multiline
              rows={2}
              value={form.notes}
              onChange={(e) => setF('notes', e.target.value)}
              className="text-xs min-h-[50px]"
            />

            <div className="flex justify-end gap-2 pt-1 border-t border-gray-200">
              <Button variant="outline" size="sm" type="button" onClick={closeForm} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                type="button"
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

      <DataTable<AdjRow>
        data={records}
        columns={columns}
        loading={loading}
        title="Recent adjustments"
        searchable
        searchPlaceholder="Search…"
        emptyMessage="No adjustments yet. Use New adjustment above."
        actions={actions}
        rowKey="id"
        className="border border-gray-200 rounded-md"
      />
    </div>
  )
}
