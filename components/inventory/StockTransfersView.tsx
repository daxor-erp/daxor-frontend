'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column, type Action } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_STOCK_TRANSFERS,
  GET_WAREHOUSES,
  CREATE_STOCK_TRANSFER,
  UPDATE_STOCK_TRANSFER,
  CONFIRM_STOCK_TRANSFER,
  CANCEL_STOCK_TRANSFER,
  DELETE_STOCK_TRANSFER,
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
  ArrowRightLeft,
  Pencil,
} from 'lucide-react'

const EMPTY_FORM = {
  transferDate: new Date().toISOString().split('T')[0],
  fromWarehouseId: '',
  fromWarehouseName: '',
  toWarehouseId: '',
  toWarehouseName: '',
  notes: '',
}

const EMPTY_LINE = {
  itemDescription: '',
  qty: '',
  unit: '',
}

/** Inventory receipts without a warehouse land in this bin (matches backend default). */
const MAIN_BIN_OPTION = { value: '__MAIN__', label: 'MAIN (default receipt bin)' }

type TransferRow = {
  id: string
  transferNumber?: string | null
  transferDate?: string | null
  fromWarehouseName?: string | null
  toWarehouseName?: string | null
  lineItems?: unknown[] | null
  status?: string | null
  createdAt?: string | null
}

const ACCENTS = {
  indigo: {
    panelBorder: 'border-primary/30',
    headerBg: 'bg-primary',
    headerSub: 'text-primary-foreground/80 hover:text-white',
    link: 'text-primary hover:text-primary',
    inputBorder: 'focus:border-primary/40',
    saveBtn: 'bg-primary hover:bg-primary/90',
  },
  teal: {
    panelBorder: 'border-teal-300',
    headerBg: 'bg-teal-600',
    headerSub: 'text-teal-200 hover:text-white',
    link: 'text-teal-600 hover:text-teal-800',
    inputBorder: 'focus:border-teal-400',
    saveBtn: 'bg-teal-600 hover:bg-teal-700',
  },
} as const

export type StockTransfersViewProps = {
  title: string
  description: string
  newPanelHeading: string
  tableTitle: string
  addLabel: string
  searchPlaceholder: string
  emptyMessage: string
  accent?: keyof typeof ACCENTS
  /** When true, source warehouse must be selected (e.g. replenish-from location). */
  requireFromWarehouse?: boolean
  /** When true, destination warehouse must be selected (e.g. replenish-to location). */
  requireToWarehouse?: boolean
}

export function StockTransfersView({
  title,
  description,
  newPanelHeading,
  tableTitle,
  addLabel,
  searchPlaceholder,
  emptyMessage,
  accent = 'indigo',
  requireFromWarehouse = false,
  requireToWarehouse = false,
}: StockTransfersViewProps) {
  const theme = ACCENTS[accent]
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [adding, setAdding] = useState(false)
  const [editingRow, setEditingRow] = useState<TransferRow | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const reset = () => {
    setForm({ ...EMPTY_FORM })
    setLines([{ ...EMPTY_LINE }])
    setErrors({})
    setMutationError(null)
  }

  const closeForm = () => {
    setAdding(false)
    setEditingRow(null)
    reset()
  }

  const { data, loading, error: listError, refetch } = useQuery(GET_STOCK_TRANSFERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: warehouseData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [mutationError, setMutationError] = useState<string | null>(null)

  const [createTr, { loading: saving }] = useMutation(CREATE_STOCK_TRANSFER, {
    onCompleted: () => { setMutationError(null); void refetch(); closeForm() },
    onError: (e) => setMutationError(e.message ?? 'Failed to save transfer'),
  })

  const [updateTr, { loading: updating }] = useMutation(UPDATE_STOCK_TRANSFER, {
    onCompleted: () => { setMutationError(null); void refetch(); closeForm() },
    onError: (e) => setMutationError(e.message ?? 'Failed to update transfer'),
  })

  const [confirmTr] = useMutation(CONFIRM_STOCK_TRANSFER, {
    onCompleted: () => {
      setMutationError(null)
      void refetch()
    },
    onError: (e) => setMutationError(e.message ?? 'Failed to confirm transfer'),
  })

  const [cancelTr] = useMutation(CANCEL_STOCK_TRANSFER, {
    onCompleted: () => {
      setMutationError(null)
      void refetch()
    },
    onError: (e) => setMutationError(e.message ?? 'Failed to cancel transfer'),
  })

  const [deleteTr] = useMutation(DELETE_STOCK_TRANSFER, {
    onCompleted: () => {
      setMutationError(null)
      void refetch()
    },
    onError: (e) => setMutationError(e.message ?? 'Failed to delete transfer'),
  })

  const warehouses = warehouseData?.warehouses ?? []
  const records: TransferRow[] = data?.stocktransfers ?? []

  const setF = (k: string, v: string) => {
    setForm((p) => {
      const updated = { ...p, [k]: v }
      if (k === 'fromWarehouseId') {
        if (v === MAIN_BIN_OPTION.value) {
          updated.fromWarehouseName = 'MAIN'
        } else {
          const wh = warehouses.find((w: { id: string }) => w.id === v)
          updated.fromWarehouseName = (wh as { warehouseName?: string })?.warehouseName || ''
        }
      }
      if (k === 'toWarehouseId') {
        if (v === MAIN_BIN_OPTION.value) {
          updated.toWarehouseName = 'MAIN'
        } else {
          const wh = warehouses.find((w: { id: string }) => w.id === v)
          updated.toWarehouseName = (wh as { warehouseName?: string })?.warehouseName || ''
        }
      }
      return updated
    })
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string | number) => {
    setLines((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [k]: v }
      return next
    })
  }

  const addLine = () => setLines((p) => [...p, { ...EMPTY_LINE }])
  const removeLine = (idx: number) => setLines((p) => p.filter((_, i) => i !== idx))

  const openEdit = (row: TransferRow) => {
    setEditingRow(row)
    setAdding(false)
    setMutationError(null)
    const rowAny = row as any
    setForm({
      transferDate:      rowAny.transferDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      fromWarehouseId:   rowAny.fromWarehouseId ?? '',
      fromWarehouseName: rowAny.fromWarehouseName ?? '',
      toWarehouseId:     rowAny.toWarehouseId ?? '',
      toWarehouseName:   rowAny.toWarehouseName ?? '',
      notes:             rowAny.notes ?? '',
    })
    setLines(
      Array.isArray(rowAny.lineItems) && rowAny.lineItems.length > 0
        ? rowAny.lineItems.map((l: any) => ({
            itemDescription: l.itemDescription ?? '',
            qty: String(l.qty ?? l.quantity ?? ''),
            unit: l.unit ?? '',
          }))
        : [{ ...EMPTY_LINE }]
    )
    setErrors({})
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.transferDate) e.transferDate = 'Required'
    if (lines.length === 0) e.lines = 'At least one line required'
    lines.forEach((l, i) => {
      if (!l.itemDescription.trim()) e[`line_${i}_desc`] = 'Required'
      if (!(parseFloat(String(l.qty)) > 0)) e[`line_${i}_qty`] = '!'
    })
    if (requireFromWarehouse && !String(form.fromWarehouseId ?? '').trim()) {
      e.fromWarehouseId = 'Required'
    }
    if (requireToWarehouse && !String(form.toWarehouseId ?? '').trim()) {
      e.toWarehouseId = 'Required'
    }
    const fromKey = form.fromWarehouseId || (form.fromWarehouseName === 'MAIN' ? MAIN_BIN_OPTION.value : '')
    const toKey = form.toWarehouseId || (form.toWarehouseName === 'MAIN' ? MAIN_BIN_OPTION.value : '')
    if (fromKey && toKey && fromKey === toKey) {
      e.toWarehouseId = 'Must differ from source'
    }
    if (form.fromWarehouseName && form.toWarehouseName && form.fromWarehouseName === form.toWarehouseName) {
      e.toWarehouseId = 'Must differ from source (same bin = qty only, no GL)'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    setMutationError(null)
    if (!orgId) { setMutationError('Organization is required. Please sign in again.'); return }
    if (!validate()) return
    const input: Record<string, unknown> = {
      transferDate: form.transferDate,
      lineItems: lines.map((l) => ({
        itemDescription: l.itemDescription.trim(),
        qty: parseFloat(String(l.qty)) || 0,
        ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
      })),
    }
    if (form.notes.trim()) input.notes = form.notes.trim()
    if (form.fromWarehouseId && form.fromWarehouseId !== MAIN_BIN_OPTION.value) input.fromWarehouseId = form.fromWarehouseId
    if (form.fromWarehouseName?.trim()) input.fromWarehouseName = form.fromWarehouseName.trim()
    if (form.toWarehouseId && form.toWarehouseId !== MAIN_BIN_OPTION.value) input.toWarehouseId = form.toWarehouseId
    if (form.toWarehouseName?.trim()) input.toWarehouseName = form.toWarehouseName.trim()

    if (editingRow) {
      updateTr({ variables: { id: editingRow.id, input } })
    } else {
      createTr({ variables: { input: { ...input, organizationId: orgId } } })
    }
  }

  const handleConfirm = (id: string) => {
    if (!id) return
    if (confirm('Confirm this stock transfer?')) confirmTr({ variables: { id } })
  }

  const handleCancel = (id: string) => {
    if (!id) return
    if (confirm('Cancel this transfer?')) cancelTr({ variables: { id } })
  }

  const handleDelete = (id: string) => {
    if (!id) return
    if (confirm('Delete this transfer?')) deleteTr({ variables: { id } })
  }

  const now = new Date()
  const thisMonth = records.filter((r) => {
    if (!r.createdAt) return false
    const d = new Date(r.createdAt)
    return Number.isNaN(d.getTime())
      ? false
      : d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const stats = {
    total: records.length,
    draft: records.filter((r) => r.status === 'draft').length,
    confirmed: records.filter((r) => r.status === 'confirmed').length,
    thisMonth: thisMonth.length,
  }

  const columns: Column<TransferRow>[] = [
    {
      key: 'transferNumber',
      label: 'Transfer #',
      width: '140px',
      render: (v) => <MonoCell value={v} />,
    },
    {
      key: 'transferDate',
      label: 'Date',
      width: '110px',
      render: (v) => <DateCell value={v as string} />,
    },
    {
      key: 'fromWarehouseName',
      label: 'From',
      render: (v) => <span className="text-sm">{v || '—'}</span>,
    },
    {
      key: 'toWarehouseName',
      label: 'To',
      render: (v) => <span className="text-sm">{v || '—'}</span>,
    },
    {
      key: 'lineItems',
      label: 'Lines',
      width: '64px',
      align: 'right',
      render: (v) => (
        <span className="text-sm tabular-nums">{Array.isArray(v) ? v.length : 0}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (v) => <ErpBadge status={v != null && v !== '' ? String(v) : 'draft'} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: (v) => <DateCell value={v as string} />,
    },
  ]

  const whOptions = [
    { value: '', label: 'Select warehouse…' },
    MAIN_BIN_OPTION,
    ...warehouses.map((w: { id: string; warehouseName?: string; warehouseCode?: string }) => ({
      value: w.id,
      label: w.warehouseCode
        ? `${w.warehouseCode} — ${w.warehouseName || 'Warehouse'}`
        : w.warehouseName || 'Warehouse',
    })),
  ]

  const actions: Action<TransferRow>[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-3.5 w-3.5 text-primary" />,
      onClick: (row) => { if (row.status === 'draft') openEdit(row) },
      variant: 'ghost',
      show: (row) => row.status === 'draft',
    },
    {
      label: 'Confirm',
      icon: <BadgeCheck className="h-3.5 w-3.5 text-green-600" />,
      onClick: (row) => { if (!row.id || row.status !== 'draft') return; handleConfirm(row.id) },
      variant: 'ghost',
      show: (row) => row.status === 'draft',
    },
    {
      label: 'Cancel',
      icon: <XCircle className="h-3.5 w-3.5 text-amber-600" />,
      onClick: (row) => { if (!row.id || row.status === 'cancelled') return; handleCancel(row.id) },
      variant: 'ghost',
      show: (row) => row.status !== 'cancelled',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      onClick: (row) => { if (!row.id) return; handleDelete(row.id) },
      variant: 'ghost',
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title={title}
        subtitle={description}
        icon={<ArrowRightLeft className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }, { label: title }]}
        actions={
          <Button
            onClick={() => { reset(); setEditingRow(null); setAdding(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {addLabel}
          </Button>
        }
      />

      {!orgId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your profile; transfer data cannot be loaded.
        </p>
      )}

      {listError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {listError.message}
        </p>
      )}

      {mutationError && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
          {mutationError}
        </p>
      )}

      <StatsRow cols={4}>
        <StatCard label="Total" value={stats.total} icon={<ClipboardList className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<FileEdit className="h-5 w-5" />} variant="amber" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={<BadgeCheck className="h-5 w-5" />} variant="green" />
        <StatCard label="This month" value={stats.thisMonth} icon={<CalendarDays className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      {(adding || editingRow) && (
        <div className={`bg-card border ${theme.panelBorder} rounded-lg shadow-sm overflow-hidden`}>
          <div className={`flex items-center justify-between px-4 py-2 ${theme.headerBg}`}>
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              {editingRow ? `Edit Transfer ${(editingRow as any).transferNumber ?? ''}` : newPanelHeading}
            </span>
            <button type="button" onClick={closeForm} className={theme.headerSub}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {mutationError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1.5" role="alert">
                {mutationError}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <InputFloating
                label="Transfer date *"
                type="date"
                value={form.transferDate}
                onChange={(e) => setF('transferDate', e.target.value)}
                error={errors.transferDate}
                className="h-7 text-xs"
              />
              <SelectFloating
                label={requireFromWarehouse ? 'From warehouse *' : 'From warehouse'}
                value={form.fromWarehouseId}
                onChange={(e) =>
                  setF('fromWarehouseId', typeof e === 'string' ? e : e.target.value)
                }
                options={whOptions}
                error={errors.fromWarehouseId}
                className="h-7 text-xs"
              />
              <SelectFloating
                label={requireToWarehouse ? 'To warehouse (replenish) *' : 'To warehouse'}
                value={form.toWarehouseId}
                onChange={(e) =>
                  setF('toWarehouseId', typeof e === 'string' ? e : e.target.value)
                }
                options={whOptions}
                error={errors.toWarehouseId}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Notes"
                value={form.notes}
                onChange={(e) => setF('notes', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Line items</span>
                <button
                  type="button"
                  onClick={addLine}
                  className={`flex items-center gap-1 text-xs ${theme.link}`}
                >
                  <Plus className="h-3.5 w-3.5" /> Add line
                </button>
              </div>
              {errors.lines && <p className="text-xs text-red-500 mb-1">{errors.lines}</p>}
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium">
                        Description *
                      </th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-24">
                        Qty *
                      </th>
                      <th className="text-left px-2 py-1.5 text-gray-500 font-medium w-20">
                        Unit
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="px-2 py-1">
                          <input
                            className={`w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none ${theme.inputBorder}`}
                            placeholder="Item / SKU description"
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
                            min={0}
                            step="any"
                            className={`w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none ${theme.inputBorder}`}
                            value={line.qty}
                            onChange={(e) => setLine(idx, 'qty', e.target.value)}
                          />
                          {errors[`line_${idx}_qty`] && (
                            <p className="text-red-500 text-[10px]">{errors[`line_${idx}_qty`]}</p>
                          )}
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className={`w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none ${theme.inputBorder}`}
                            placeholder="pcs"
                            value={line.unit}
                            onChange={(e) => setLine(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLine(idx)}
                              className="text-gray-400 hover:text-red-500"
                            >
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

            <p className="text-xs text-gray-500">
              Use <strong>MAIN</strong> for stock received without a warehouse. Confirm moves qty; INV-ST posts when from ≠ to.
            </p>

            <div className="flex justify-end gap-2 pt-1 border-t">
              <Button variant="outline" size="sm" type="button" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit}
                disabled={saving || updating || !orgId}
                className={`h-8 text-xs text-white ${theme.saveBtn}`}
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving || updating ? 'Saving…' : editingRow ? 'Save Changes' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable<TransferRow>
        data={records}
        columns={columns}
        loading={loading}
        title={tableTitle.startsWith('All ') ? tableTitle : `All ${tableTitle}`}
        searchable
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        pageSize={25}
        actions={actions}
        rowKey="id"
      />
    </div>
  )
}
