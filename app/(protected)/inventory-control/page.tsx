'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import {
  CREATE_INVENTORY_CONTROL,
  GET_INVENTORY_CONTROLS,
  GET_ITEMS,
  GET_WAREHOUSES,
  UPDATE_INVENTORY_CONTROL,
} from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { AdjustInventoryQuickSection } from '@/components/inventory/AdjustInventoryQuickSection'
import { AdjustInventoryWorksheetSection } from '@/components/inventory/AdjustInventoryWorksheetSection'
import { Package, Plus, RefreshCw, Save, Trash2 } from 'lucide-react'

/** Same worksheet cell styling as purchases / quotations line grids */
const cell =
  'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr =
  'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

const STOCK_STATUS_OPTS = [
  { value: '', label: 'All statuses' },
  { value: 'IN_STOCK', label: 'In stock' },
  { value: 'LOW_STOCK', label: 'Low stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
]

type Row = {
  clientKey: string
  id?: string
  itemId: string
  itemName: string
  binLocation: string
  quantity: string
  unit: string
  minStockLevel: string
  maxStockLevel: string
  reorderPoint: string
  warehouseId: string
  stockStatus?: string
  lastStockDate?: string
  createdAt?: string
  isNew?: boolean
}

function newClientKey() {
  return `new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function emptyRow(defaultWarehouseId: string): Row {
  return {
    clientKey: newClientKey(),
    itemId: '',
    itemName: '',
    binLocation: '',
    quantity: '0',
    unit: '',
    minStockLevel: '0',
    maxStockLevel: '0',
    reorderPoint: '0',
    warehouseId: defaultWarehouseId,
    isNew: true,
  }
}

function mapServerRow(r: {
  id: string
  itemId: string
  itemName: string
  binLocation: string
  quantity: number
  unit: string
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  warehouseId: string
  stockStatus?: string
  lastStockDate?: string
  createdAt?: string
}): Row {
  return {
    clientKey: r.id,
    id: r.id,
    itemId: r.itemId ?? '',
    itemName: r.itemName ?? '',
    binLocation: r.binLocation ?? '',
    quantity: String(r.quantity ?? 0),
    unit: r.unit ?? '',
    minStockLevel: String(r.minStockLevel ?? 0),
    maxStockLevel: String(r.maxStockLevel ?? 0),
    reorderPoint: String(r.reorderPoint ?? 0),
    warehouseId: r.warehouseId ?? '',
    stockStatus: r.stockStatus,
    lastStockDate: r.lastStockDate,
    createdAt: r.createdAt,
    isNew: false,
  }
}

function stockBadgeClass(status: string | undefined) {
  switch (status) {
    case 'LOW_STOCK':
      return 'bg-amber-50 text-amber-800 border border-amber-200'
    case 'OUT_OF_STOCK':
      return 'bg-red-50 text-red-700 border border-red-200'
    default:
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  }
}

export default function InventoryControlPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const { data: whData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const warehouses = whData?.warehouses ?? []

  const { data: itemData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })
  const items = itemData?.items ?? []

  const { data, loading, refetch } = useQuery(GET_INVENTORY_CONTROLS, {
    variables: {
      organizationId: orgId,
      warehouseId: warehouseFilter || undefined,
      stockStatus: statusFilter || undefined,
    },
    skip: !orgId,
  })

  useEffect(() => {
    const list = data?.inventoryControls
    if (!list) return
    setRows((prev) => {
      const pending = prev.filter((r) => r.isNew)
      return [...list.map(mapServerRow), ...pending]
    })
  }, [data?.inventoryControls])

  const [createIc] = useMutation(CREATE_INVENTORY_CONTROL, {
    onError: (e) => alert(e.message),
  })

  const [updateIc] = useMutation(UPDATE_INVENTORY_CONTROL, {
    onError: (e) => alert(e.message),
  })

  const defaultWarehouseId = warehouseFilter || warehouses[0]?.id || ''

  const setRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const pickItem = (index: number, itemId: string) => {
    const it = items.find((x: { id: string }) => x.id === itemId) as
      | { id: string; name?: string; unit?: string }
      | undefined
    setRow(index, {
      itemId,
      itemName: it?.name ?? '',
      unit: it?.unit ?? '',
    })
    setErrors((e) => ({ ...e, [`item${index}`]: '', [`unit${index}`]: '' }))
  }

  const addBlankRow = () => {
    const wh = defaultWarehouseId
    if (!wh) {
      alert('Create a warehouse first (Inventory → Warehouses).')
      return
    }
    setRows((prev) => [...prev, emptyRow(wh)])
  }

  const removeNewRow = (index: number) => {
    const r = rows[index]
    if (!r?.isNew) return
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const buildInput = (r: Row) => ({
    itemId: r.itemId,
    itemName: r.itemName.trim() || 'Item',
    binLocation: r.binLocation.trim(),
    quantity: parseFloat(r.quantity) || 0,
    unit: r.unit.trim() || 'pcs',
    minStockLevel: parseFloat(r.minStockLevel) || 0,
    maxStockLevel: parseFloat(r.maxStockLevel) || 0,
    reorderPoint: parseFloat(r.reorderPoint) || 0,
    warehouseId: r.warehouseId,
    organizationId: orgId,
  })

  const validateRow = (r: Row, index: number) => {
    const e: Record<string, string> = {}
    if (!r.itemId) e[`item${index}`] = '!'
    if (!r.binLocation.trim()) e[`bin${index}`] = '!'
    if (!r.warehouseId) e[`wh${index}`] = '!'
    setErrors((prev) => ({ ...prev, ...e }))
    return Object.keys(e).length === 0
  }

  const saveRow = async (index: number) => {
    const r = rows[index]
    if (!r || !validateRow(r, index)) return
    const input = buildInput(r)
    const key = r.clientKey
    setSavingKey(key)
    try {
      if (r.isNew || !r.id) {
        await createIc({
          variables: { input },
          onCompleted: () => {
            setRows((prev) => prev.filter((x) => x.clientKey !== key))
            refetch()
          },
        })
      } else {
        await updateIc({
          variables: { id: r.id, input },
          onCompleted: () => refetch(),
        })
      }
    } finally {
      setSavingKey(null)
    }
  }

  const fmtDate = (v?: string) => {
    if (!v) return '—'
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString()
  }

  const savedCount = rows.filter((r) => !r.isNew).length
  const newCount = rows.filter((r) => r.isNew).length

  const gridCols =
    '2rem 12rem 6rem 5rem 4rem 4rem 4rem 5rem 10rem 7rem 7rem 6rem'

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory control &amp; adjustments</h1>
          <p className="text-gray-500 mt-1">
            Bin-level stock levels, stock adjustments, and physical count worksheets — combined for one workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className={cell + ' w-[196px]'}
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            aria-label="Warehouse filter"
          >
            <option value="">All warehouses</option>
            {warehouses.map((w: { id: string; warehouseCode?: string; warehouseName?: string }) => (
              <option key={w.id} value={w.id}>
                {w.warehouseCode ? `${w.warehouseCode} — ` : ''}
                {w.warehouseName}
              </option>
            ))}
          </select>
          <select
            className={cell + ' w-[168px]'}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Stock status filter"
          >
            {STOCK_STATUS_OPTS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button type="button" size="sm" onClick={addBlankRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add row
          </Button>
        </div>
      </div>

      <section className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f3f2f1] border-b border-gray-300 text-xs text-gray-700">
          <Package className="h-4 w-4 shrink-0" />
          <span className="font-semibold">Inventory control (levels by bin)</span>
          <span className="text-gray-500">
            {loading ? 'Loading…' : `${savedCount} saved`}
            {newCount ? ` · ${newCount} new` : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1120px] grid border-gray-300" style={{ gridTemplateColumns: gridCols }}>
            {[
              '#',
              'Item',
              'Bin',
              'Qty',
              'Unit',
              'Min',
              'Max',
              'Reorder',
              'Warehouse',
              'Status',
              'Last stock',
              'Actions',
            ].map((h) => (
              <div
                key={h}
                className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-b border-r border-gray-300 bg-[#f0f0f0] last:border-r-0"
              >
                {h}
              </div>
            ))}

            {rows.map((row, i) => (
              <div key={row.clientKey} className="contents">
                <div className="border-b border-r border-gray-200 flex items-center justify-center text-[11px] text-gray-400 tabular-nums bg-[#fafafa]/80">
                  {i + 1}
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <select
                    className={errors[`item${i}`] ? cellErr : cell}
                    value={row.itemId}
                    onChange={(e) => pickItem(i, e.target.value)}
                  >
                    <option value="">— item —</option>
                    {items.map((it: { id: string; name: string }) => (
                      <option key={it.id} value={it.id}>
                        {it.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={errors[`bin${i}`] ? cellErr : cell}
                    value={row.binLocation}
                    onChange={(e) => setRow(i, { binLocation: e.target.value })}
                    placeholder="Bin"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.quantity}
                    onChange={(e) => setRow(i, { quantity: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={cell}
                    value={row.unit}
                    onChange={(e) => setRow(i, { unit: e.target.value })}
                    placeholder="pcs"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.minStockLevel}
                    onChange={(e) => setRow(i, { minStockLevel: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.maxStockLevel}
                    onChange={(e) => setRow(i, { maxStockLevel: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.reorderPoint}
                    onChange={(e) => setRow(i, { reorderPoint: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <select
                    className={errors[`wh${i}`] ? cellErr : cell}
                    value={row.warehouseId}
                    onChange={(e) => setRow(i, { warehouseId: e.target.value })}
                  >
                    <option value="">—</option>
                    {warehouses.map((w: { id: string; warehouseCode?: string; warehouseName?: string }) => (
                      <option key={w.id} value={w.id}>
                        {w.warehouseCode ? `${w.warehouseCode} — ` : ''}
                        {w.warehouseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-b border-r border-gray-200 px-2 py-1.5 flex items-center">
                  {row.isNew ? (
                    <span className="text-xs text-gray-400">—</span>
                  ) : (
                    <span
                      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${stockBadgeClass(row.stockStatus)}`}
                    >
                      {(row.stockStatus ?? 'IN_STOCK').replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <div className="border-b border-r border-gray-200 px-2 py-1.5 text-xs text-gray-600 tabular-nums">
                  {fmtDate(row.lastStockDate || row.createdAt)}
                </div>
                <div className="border-b border-gray-200 px-1 py-1 flex items-center gap-1 flex-wrap">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 text-[11px] px-2"
                    disabled={savingKey === row.clientKey}
                    onClick={() => saveRow(i)}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {savingKey === row.clientKey ? '…' : 'Save'}
                  </Button>
                  {row.isNew && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-gray-500"
                      onClick={() => removeNewRow(i)}
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!loading && orgId && rows.length === 0 && (
          <p className="text-sm text-gray-500 px-3 py-6 text-center border-t border-gray-200">
            No inventory rows yet. Add items under Inventory → Items, create a warehouse, then use Add row.
          </p>
        )}
      </section>

      <AdjustInventoryWorksheetSection organizationId={orgId} warehouses={warehouses} />

      <AdjustInventoryQuickSection organizationId={orgId} warehouses={warehouses} />
    </div>
  )
}
