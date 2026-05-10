'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import {
  CREATE_WAREHOUSE,
  CREATE_WAREHOUSE_BIN,
  GET_WAREHOUSE_BINS,
  GET_WAREHOUSES,
  UPDATE_WAREHOUSE,
  UPDATE_WAREHOUSE_BIN,
} from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Layers, MapPin, Plus, RefreshCw, Save, Trash2 } from 'lucide-react'

const cell =
  'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr =
  'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

const WH_TYPES = [
  'main',
  'storage',
  'distribution',
  'transit',
  'cold',
  'quarantine',
  'yard',
  'other',
]

function newClientKey(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

type WhRow = {
  clientKey: string
  id?: string
  warehouseCode: string
  warehouseName: string
  location: string
  address: string
  capacity: string
  currentUtilization: string
  managerName: string
  contactNumber: string
  warehouseType: string
  isActive: string
  createdAt?: string
  isNew?: boolean
}

function emptyWarehouseRow(): WhRow {
  return {
    clientKey: newClientKey('wh'),
    warehouseCode: '',
    warehouseName: '',
    location: '',
    address: '',
    capacity: '0',
    currentUtilization: '0',
    managerName: '',
    contactNumber: '',
    warehouseType: 'main',
    isActive: 'true',
    isNew: true,
  }
}

function mapWarehouseServer(w: {
  id: string
  warehouseCode: string
  warehouseName: string
  location: string
  address: string
  capacity: number
  currentUtilization?: number
  managerName: string
  contactNumber: string
  warehouseType: string
  isActive?: boolean
  createdAt?: string
}): WhRow {
  return {
    clientKey: w.id,
    id: w.id,
    warehouseCode: w.warehouseCode ?? '',
    warehouseName: w.warehouseName ?? '',
    location: w.location ?? '',
    address: w.address ?? '',
    capacity: String(w.capacity ?? 0),
    currentUtilization: String(w.currentUtilization ?? 0),
    managerName: w.managerName ?? '',
    contactNumber: w.contactNumber ?? '',
    warehouseType: w.warehouseType ?? 'main',
    isActive: w.isActive !== false ? 'true' : 'false',
    createdAt: w.createdAt,
    isNew: false,
  }
}

type BinRow = {
  clientKey: string
  id?: string
  warehouseId: string
  binCode: string
  binLocation: string
  binType: string
  capacity: string
  isAvailable: string
  currentStock?: number
  createdAt?: string
  isNew?: boolean
}

function emptyBinRow(warehouseId: string): BinRow {
  return {
    clientKey: newClientKey('bin'),
    warehouseId,
    binCode: '',
    binLocation: '',
    binType: 'pick',
    capacity: '0',
    isAvailable: 'true',
    isNew: true,
  }
}

function mapBinServer(b: {
  id: string
  warehouseId: string
  binCode: string
  binLocation: string
  binType: string
  capacity: number
  currentStock?: number
  isAvailable?: boolean
  createdAt?: string
}): BinRow {
  return {
    clientKey: b.id,
    id: b.id,
    warehouseId: b.warehouseId ?? '',
    binCode: b.binCode ?? '',
    binLocation: b.binLocation ?? '',
    binType: b.binType ?? '',
    capacity: String(b.capacity ?? 0),
    isAvailable: b.isAvailable !== false ? 'true' : 'false',
    currentStock: b.currentStock ?? 0,
    createdAt: b.createdAt,
    isNew: false,
  }
}

const BIN_TYPES = ['pick', 'bulk', 'staging', 'receive', 'ship', 'hold', 'other']

export default function WarehousesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [activeOnly, setActiveOnly] = useState(false)
  const [whRows, setWhRows] = useState<WhRow[]>([])
  const [whErrors, setWhErrors] = useState<Record<string, string>>({})
  const [whSavingKey, setWhSavingKey] = useState<string | null>(null)

  const [binWarehouseId, setBinWarehouseId] = useState('')
  const [binRows, setBinRows] = useState<BinRow[]>([])
  const [binErrors, setBinErrors] = useState<Record<string, string>>({})
  const [binSavingKey, setBinSavingKey] = useState<string | null>(null)

  const {
    data: whData,
    loading: whLoading,
    refetch: refetchWh,
  } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId, isActive: activeOnly ? true : undefined },
    skip: !orgId,
  })

  const warehouses = whData?.warehouses ?? []

  useEffect(() => {
    const list = whData?.warehouses
    if (!list) return
    setWhRows((prev) => {
      const pending = prev.filter((r) => r.isNew)
      return [...list.map(mapWarehouseServer), ...pending]
    })
  }, [whData?.warehouses])

  useEffect(() => {
    if (warehouses.length === 0) {
      setBinWarehouseId('')
      return
    }
    const stillThere = warehouses.some((w: { id: string }) => w.id === binWarehouseId)
    if (!binWarehouseId || !stillThere) {
      setBinWarehouseId(warehouses[0].id)
    }
  }, [warehouses, binWarehouseId])

  const {
    data: binsData,
    loading: binsLoading,
    refetch: refetchBins,
  } = useQuery(GET_WAREHOUSE_BINS, {
    variables: { organizationId: orgId, warehouseId: binWarehouseId || undefined },
    skip: !orgId || !binWarehouseId,
  })

  useEffect(() => {
    const list = binsData?.warehouseBins
    if (!list) return
    setBinRows((prev) => {
      const pending = prev.filter((r) => r.isNew)
      return [...list.map(mapBinServer), ...pending]
    })
  }, [binsData?.warehouseBins])

  const [createWh] = useMutation(CREATE_WAREHOUSE, { onError: (e) => alert(e.message) })
  const [updateWh] = useMutation(UPDATE_WAREHOUSE, { onError: (e) => alert(e.message) })
  const [createBin] = useMutation(CREATE_WAREHOUSE_BIN, { onError: (e) => alert(e.message) })
  const [updateBin] = useMutation(UPDATE_WAREHOUSE_BIN, { onError: (e) => alert(e.message) })

  const setWhRow = (index: number, patch: Partial<WhRow>) => {
    setWhRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const validateWh = (r: WhRow, index: number) => {
    const e: Record<string, string> = {}
    if (!r.warehouseName.trim()) e[`wn${index}`] = '!'
    if (!r.location.trim()) e[`loc${index}`] = '!'
    if (!r.managerName.trim()) e[`mgr${index}`] = '!'
    if (!r.contactNumber.trim()) e[`ph${index}`] = '!'
    setWhErrors((prev) => ({ ...prev, ...e }))
    return Object.keys(e).length === 0
  }

  const buildWhInput = (r: WhRow) => ({
    warehouseName: r.warehouseName.trim(),
    location: r.location.trim(),
    address: r.address.trim() || '—',
    capacity: parseFloat(r.capacity) || 0,
    managerName: r.managerName.trim(),
    contactNumber: r.contactNumber.trim(),
    warehouseType: r.warehouseType.trim() || 'main',
    organizationId: orgId,
    isActive: r.isActive !== 'false',
    currentUtilization: parseFloat(r.currentUtilization) || 0,
  })

  const saveWhRow = async (index: number) => {
    const r = whRows[index]
    if (!r || !validateWh(r, index)) return
    const input = buildWhInput(r)
    const key = r.clientKey
    setWhSavingKey(key)
    try {
      if (r.isNew || !r.id) {
        await createWh({
          variables: { input },
          onCompleted: () => {
            setWhRows((prev) => prev.filter((x) => x.clientKey !== key))
            refetchWh()
          },
        })
      } else {
        await updateWh({
          variables: { id: r.id, input },
          onCompleted: () => refetchWh(),
        })
      }
    } finally {
      setWhSavingKey(null)
    }
  }

  const removeNewWh = (index: number) => {
    const r = whRows[index]
    if (!r?.isNew) return
    setWhRows((prev) => prev.filter((_, i) => i !== index))
  }

  const addWhRow = () => setWhRows((prev) => [...prev, emptyWarehouseRow()])

  const setBinRow = (index: number, patch: Partial<BinRow>) => {
    setBinRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const validateBin = (r: BinRow, index: number) => {
    const e: Record<string, string> = {}
    if (!r.binCode.trim()) e[`bc${index}`] = '!'
    if (!r.binLocation.trim()) e[`bl${index}`] = '!'
    setBinErrors((prev) => ({ ...prev, ...e }))
    return Object.keys(e).length === 0
  }

  const buildBinInput = (r: BinRow) => ({
    warehouseId: binWarehouseId,
    binCode: r.binCode.trim(),
    binLocation: r.binLocation.trim(),
    binType: r.binType.trim() || 'pick',
    capacity: parseFloat(r.capacity) || 0,
    organizationId: orgId,
    isAvailable: r.isAvailable !== 'false',
  })

  const saveBinRow = async (index: number) => {
    if (!binWarehouseId) {
      alert('Choose a warehouse for bins.')
      return
    }
    const r = binRows[index]
    if (!r || !validateBin(r, index)) return
    const input = buildBinInput(r)
    const key = r.clientKey
    setBinSavingKey(key)
    try {
      if (r.isNew || !r.id) {
        await createBin({
          variables: { input },
          onCompleted: () => {
            setBinRows((prev) => prev.filter((x) => x.clientKey !== key))
            refetchBins()
          },
        })
      } else {
        await updateBin({
          variables: { id: r.id, input },
          onCompleted: () => refetchBins(),
        })
      }
    } finally {
      setBinSavingKey(null)
    }
  }

  const removeNewBin = (index: number) => {
    const r = binRows[index]
    if (!r?.isNew) return
    setBinRows((prev) => prev.filter((_, i) => i !== index))
  }

  const addBinRow = () => {
    if (!binWarehouseId) {
      alert('Create a warehouse first, then pick it above.')
      return
    }
    setBinRows((prev) => [...prev, emptyBinRow(binWarehouseId)])
  }

  const fmtDate = (v?: string) => {
    if (!v) return '—'
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString()
  }

  const whGridCols =
    '2rem 6rem 9rem 7rem 10rem 5rem 5rem 7rem 7rem 7rem 5rem 6rem 6rem'

  const binGridCols = '2rem 8rem 8rem 7rem 5rem 5rem 5rem 6rem 6rem'

  const whSaved = whRows.filter((r) => !r.isNew).length
  const whNew = whRows.filter((r) => r.isNew).length

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-gray-500 mt-1">
            Sites and storage locations; bins define pick faces and bulk zones inside each warehouse.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Active only
          </label>
          <Button type="button" variant="outline" size="sm" onClick={() => refetchWh()} disabled={whLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${whLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button type="button" size="sm" onClick={addWhRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add warehouse row
          </Button>
        </div>
      </div>

      {/* Warehouses worksheet */}
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f3f2f1] border-b border-gray-300 text-xs text-gray-700">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="font-semibold">Warehouse worksheet</span>
          <span className="text-gray-500">
            {whLoading ? 'Loading…' : `${whSaved} saved`}
            {whNew ? ` · ${whNew} new` : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1180px] grid" style={{ gridTemplateColumns: whGridCols }}>
            {[
              '#',
              'Code',
              'Name',
              'Location',
              'Address',
              'Capacity',
              'Util.',
              'Manager',
              'Contact',
              'Type',
              'Active',
              'Created',
              'Actions',
            ].map((h) => (
              <div
                key={h}
                className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-b border-r border-gray-300 bg-[#f0f0f0] last:border-r-0"
              >
                {h}
              </div>
            ))}

            {whRows.map((row, i) => (
              <div key={row.clientKey} className="contents">
                <div className="border-b border-r border-gray-200 flex items-center justify-center text-[11px] text-gray-400 tabular-nums bg-[#fafafa]/80">
                  {i + 1}
                </div>
                <div className="border-b border-r border-gray-200 px-2 py-1 flex items-center min-h-[28px] bg-[#fbfbfb]">
                  {row.isNew ? (
                    <span
                      className="text-[11px] text-gray-400 italic"
                      title="Generated on save (e.g. WH0001)"
                    >
                      Auto
                    </span>
                  ) : (
                    <span className="text-xs font-mono tabular-nums text-gray-800">{row.warehouseCode}</span>
                  )}
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={whErrors[`wn${i}`] ? cellErr : cell}
                    value={row.warehouseName}
                    onChange={(e) => setWhRow(i, { warehouseName: e.target.value })}
                    placeholder="Main DC"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={whErrors[`loc${i}`] ? cellErr : cell}
                    value={row.location}
                    onChange={(e) => setWhRow(i, { location: e.target.value })}
                    placeholder="City / zone"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={cell}
                    value={row.address}
                    onChange={(e) => setWhRow(i, { address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.capacity}
                    onChange={(e) => setWhRow(i, { capacity: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={cell}
                    value={row.currentUtilization}
                    onChange={(e) => setWhRow(i, { currentUtilization: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={whErrors[`mgr${i}`] ? cellErr : cell}
                    value={row.managerName}
                    onChange={(e) => setWhRow(i, { managerName: e.target.value })}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className={whErrors[`ph${i}`] ? cellErr : cell}
                    value={row.contactNumber}
                    onChange={(e) => setWhRow(i, { contactNumber: e.target.value })}
                    placeholder="Phone"
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <select
                    className={cell}
                    value={row.warehouseType}
                    onChange={(e) => setWhRow(i, { warehouseType: e.target.value })}
                  >
                    {WH_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <select
                    className={cell}
                    value={row.isActive}
                    onChange={(e) => setWhRow(i, { isActive: e.target.value })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="border-b border-r border-gray-200 px-2 py-1.5 text-xs text-gray-600">
                  {fmtDate(row.createdAt)}
                </div>
                <div className="border-b border-gray-200 px-1 py-1 flex items-center gap-1 flex-wrap">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 text-[11px] px-2"
                    disabled={whSavingKey === row.clientKey}
                    onClick={() => saveWhRow(i)}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {whSavingKey === row.clientKey ? '…' : 'Save'}
                  </Button>
                  {row.isNew && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-gray-500"
                      onClick={() => removeNewWh(i)}
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
        {!whLoading && orgId && whRows.length === 0 && (
          <p className="text-sm text-gray-500 px-3 py-6 text-center border-t border-gray-200">
            No warehouses yet. Use Add warehouse row — warehouse codes are assigned automatically when you save (WH0001, WH0002, …).
          </p>
        )}
      </div>

      {/* Bins worksheet */}
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#f3f2f1] border-b border-gray-300 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 shrink-0" />
            <span className="font-semibold">Warehouse bins</span>
            <span className="text-gray-500">
              {binsLoading ? 'Loading…' : binWarehouseId ? `${binRows.filter((r) => !r.isNew).length} bins` : '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className={cell + ' min-w-[220px]'}
              value={binWarehouseId}
              onChange={(e) => setBinWarehouseId(e.target.value)}
              aria-label="Warehouse for bins"
            >
              <option value="">— select warehouse —</option>
              {warehouses.map((w: { id: string; warehouseCode?: string; warehouseName?: string }) => (
                <option key={w.id} value={w.id}>
                  {(w.warehouseCode ? `${w.warehouseCode} — ` : '') + (w.warehouseName ?? w.id)}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchBins()}
              disabled={binsLoading || !binWarehouseId}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${binsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button type="button" size="sm" onClick={addBinRow} disabled={!binWarehouseId}>
              <Plus className="h-4 w-4 mr-2" />
              Add bin row
            </Button>
          </div>
        </div>

        {!binWarehouseId ? (
          <p className="text-sm text-gray-500 px-3 py-8 text-center">
            Select a warehouse to view and edit bins.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[880px] grid" style={{ gridTemplateColumns: binGridCols }}>
                {['#', 'Bin code', 'Location', 'Type', 'Capacity', 'Stock', 'Avail.', 'Created', 'Actions'].map(
                  (h) => (
                    <div
                      key={h}
                      className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-b border-r border-gray-300 bg-[#f0f0f0] last:border-r-0"
                    >
                      {h}
                    </div>
                  ),
                )}

                {binRows.map((row, i) => (
                  <div key={row.clientKey} className="contents">
                    <div className="border-b border-r border-gray-200 flex items-center justify-center text-[11px] text-gray-400 tabular-nums bg-[#fafafa]/80">
                      {i + 1}
                    </div>
                    <div className="border-b border-r border-gray-200 p-0">
                      <input
                        className={binErrors[`bc${i}`] ? cellErr : cell}
                        value={row.binCode}
                        onChange={(e) => setBinRow(i, { binCode: e.target.value })}
                        placeholder="A-01-02"
                      />
                    </div>
                    <div className="border-b border-r border-gray-200 p-0">
                      <input
                        className={binErrors[`bl${i}`] ? cellErr : cell}
                        value={row.binLocation}
                        onChange={(e) => setBinRow(i, { binLocation: e.target.value })}
                        placeholder="Aisle / slot"
                      />
                    </div>
                    <div className="border-b border-r border-gray-200 p-0">
                      <select
                        className={cell}
                        value={row.binType}
                        onChange={(e) => setBinRow(i, { binType: e.target.value })}
                      >
                        {BIN_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border-b border-r border-gray-200 p-0">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        className={cell}
                        value={row.capacity}
                        onChange={(e) => setBinRow(i, { capacity: e.target.value })}
                      />
                    </div>
                    <div className="border-b border-r border-gray-200 px-2 py-1.5 text-xs text-gray-700 tabular-nums flex items-center">
                      {row.isNew ? '—' : row.currentStock ?? 0}
                    </div>
                    <div className="border-b border-r border-gray-200 p-0">
                      <select
                        className={cell}
                        value={row.isAvailable}
                        onChange={(e) => setBinRow(i, { isAvailable: e.target.value })}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="border-b border-r border-gray-200 px-2 py-1.5 text-xs text-gray-600">
                      {fmtDate(row.createdAt)}
                    </div>
                    <div className="border-b border-gray-200 px-1 py-1 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 text-[11px] px-2"
                        disabled={binSavingKey === row.clientKey}
                        onClick={() => saveBinRow(i)}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        {binSavingKey === row.clientKey ? '…' : 'Save'}
                      </Button>
                      {row.isNew && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-gray-500"
                          onClick={() => removeNewBin(i)}
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
            {!binsLoading && binRows.length === 0 && (
              <p className="text-sm text-gray-500 px-3 py-6 text-center border-t border-gray-200">
                No bins for this warehouse. Add bin rows (bin code must be unique).
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
