'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_INVENTORY_CONTROLS, GET_WAREHOUSES, ADJUST_STOCK } from '@/gql/queries'
import { DataTable, Column } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, Warehouse, RefreshCw } from 'lucide-react'

type InvRow = {
  id?: string | null
  itemId?: string | null
  itemName?: string | null
  binLocation?: string | null
  quantity?: number | null
  unit?: string | null
  warehouseId?: string | null
  stockStatus?: string | null
  reorderPoint?: number | null
}

function parseQty(q: unknown): number {
  if (typeof q === 'number' && Number.isFinite(q)) return q
  const n = parseFloat(String(q ?? ''))
  return Number.isFinite(n) ? n : 0
}

function formatQty(q: number): string {
  return Number.isFinite(q) ? q.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'
}

function stableInventoryRowKey(row: InvRow): string {
  if (row.id != null && String(row.id) !== '') return String(row.id)
  return `${row.itemId ?? ''}:${row.binLocation ?? ''}`
}

export default function ReviewNegativeInventoryPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { data, loading, error: listError, refetch } = useQuery(GET_INVENTORY_CONTROLS, {
    variables: { organizationId: orgId, warehouseId: undefined, stockStatus: undefined },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: whData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [adjustStock, { loading: adjustLoading }] = useMutation(ADJUST_STOCK, {
    onCompleted: () => {
      setMutationError(null)
      void refetch()
    },
    onError: (e) => {
      setMutationError(e.message ?? 'Adjustment failed')
    },
  })

  const warehouseNameById = useMemo(() => {
    const m = new Map<string, string>()
    const list = whData?.warehouses ?? []
    for (const w of list) {
      if (w?.id != null) m.set(String(w.id), String(w.warehouseName ?? w.id))
    }
    return m
  }, [whData])

  const allRows: InvRow[] = data?.inventoryControls ?? []

  const negativeRows = useMemo(
    () => allRows.filter((r) => parseQty(r.quantity) < 0),
    [allRows],
  )

  const stats = useMemo(
    () => ({
      negativeLines: negativeRows.length,
      trackedLocations: allRows.length,
    }),
    [negativeRows.length, allRows.length],
  )

  const tableRows: InvRow[] = useMemo(
    () =>
      negativeRows.map((r) => ({
        ...r,
        id: stableInventoryRowKey(r),
      })),
    [negativeRows],
  )

  const bringToZero = (row: InvRow) => {
    if (adjustLoading) return
    setMutationError(null)
    const itemId = row.itemId != null ? String(row.itemId) : ''
    const binLocation = row.binLocation != null ? String(row.binLocation) : ''
    const current = parseQty(row.quantity)
    if (!itemId || !binLocation) {
      setMutationError('This row is missing item or bin location; fix it in Inventory control.')
      return
    }
    if (current >= 0) return
    const delta = -current
    if (
      !confirm(
        `Add ${formatQty(delta)} ${row.unit ?? ''} to bring "${row.itemName ?? itemId}" at ${binLocation} from ${formatQty(current)} to 0?`,
      )
    ) {
      return
    }
    adjustStock({
      variables: {
        itemId,
        binLocation,
        quantity: delta,
        reason: 'Review negative inventory: adjustment to zero',
        organizationId: orgId,
      },
    })
  }

  const statusStyle = (s: string | null | undefined) => {
    const v = String(s ?? '').toUpperCase()
    if (v === 'NEGATIVE') return 'bg-red-50 text-red-800 border-red-200'
    if (v === 'OUT_OF_STOCK') return 'bg-amber-50 text-amber-800 border-amber-200'
    if (v === 'LOW_STOCK') return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const columns: Column<InvRow>[] = [
    {
      key: 'itemName',
      label: 'Item',
      sortable: true,
      width: '200px',
      render: (v, row) => (
        <span className="font-medium text-gray-800">
          {(v != null && String(v) !== '' ? String(v) : row.itemId) ?? '—'}
        </span>
      ),
    },
    {
      key: 'binLocation',
      label: 'Bin / location',
      sortable: true,
      width: '120px',
      render: (v) => <span className="font-mono text-xs text-gray-700">{v != null ? String(v) : '—'}</span>,
    },
    {
      key: 'warehouseId',
      label: 'Warehouse',
      width: '140px',
      render: (v) => {
        const id = v != null ? String(v) : ''
        const name = id ? warehouseNameById.get(id) : undefined
        return (
          <span className="text-xs text-gray-700">
            {name ? (
              <>
                {name}
                <span className="text-gray-400"> ({id})</span>
              </>
            ) : (
              id || '—'
            )}
          </span>
        )
      },
    },
    {
      key: 'quantity',
      label: 'Qty on hand',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (v) => {
        const n = parseQty(v)
        return (
          <span className={`font-semibold ${n < 0 ? 'text-red-700' : 'text-gray-800'}`}>
            {formatQty(n)}
          </span>
        )
      },
    },
    {
      key: 'unit',
      label: 'Unit',
      width: '64px',
      render: (v) => <span className="text-gray-600">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'stockStatus',
      label: 'Status',
      width: '120px',
      render: (v) => {
        const label = v != null && String(v) !== '' ? String(v) : '—'
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${statusStyle(label)}`}
          >
            {label}
          </span>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review negative inventory</h1>
        <p className="text-gray-500">
          Locations with quantity below zero. Use an adjustment to bring a line to zero after you have verified
          counts (creates an inventory movement record).
        </p>
      </div>

      {!orgId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your profile; inventory cannot be loaded.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-md bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Negative quantity lines</p>
            <p className="text-lg font-bold text-gray-800">{stats.negativeLines}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-md bg-blue-50">
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">All tracked bin lines</p>
            <p className="text-lg font-bold text-gray-800">{stats.trackedLocations}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          disabled={!orgId || loading}
          onClick={() => void refetch()}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Refresh
        </Button>
        <a
          href="/inventory-control"
          className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
        >
          <Warehouse className="h-3.5 w-3.5" />
          Open inventory control worksheet
        </a>
      </div>

      <DataTable<InvRow>
        data={tableRows}
        columns={columns}
        loading={loading}
        title="Negative on-hand quantities"
        searchable
        searchPlaceholder="Search item, bin, warehouse…"
        emptyMessage={
          stats.trackedLocations === 0
            ? 'No inventory control rows for this organization. Add stock in Inventory control first.'
            : 'No negative quantities. All tracked lines are at or above zero.'
        }
        actions={[
          {
            label: adjustLoading ? 'Working…' : 'Bring to zero',
            icon: <RefreshCw className="h-3.5 w-3.5" />,
            onClick: (row) => bringToZero(row),
            variant: 'ghost',
            show: (row) => parseQty(row.quantity) < 0,
          },
        ]}
      />
    </div>
  )
}
