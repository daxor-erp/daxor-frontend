'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_INVENTORY_CONTROLS, GET_WAREHOUSES, ADJUST_STOCK } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
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
      if (w?.id != null) m.set(String(w.id), String(w.warehouseName || w.warehouseCode || 'Warehouse'))
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

  const columns: Column<InvRow>[] = [
    {
      key: 'itemName',
      label: 'Item',
      sortable: true,
      width: '200px',
      render: (v, row) => (
        <span className="text-sm font-medium">
          {(v != null && String(v) !== '' ? String(v) : row.itemId) ?? '—'}
        </span>
      ),
    },
    {
      key: 'binLocation',
      label: 'Bin / location',
      sortable: true,
      width: '120px',
      render: (v) => <MonoCell value={v != null ? String(v) : '—'} />,
    },
    {
      key: 'warehouseId',
      label: 'Warehouse',
      width: '140px',
      render: (v) => {
        const id = v != null ? String(v) : ''
        const name = id ? warehouseNameById.get(id) : undefined
        return (
          <span className="text-sm text-muted-foreground">
            {name ? `${name}` : id || '—'}
          </span>
        )
      },
    },
    {
      key: 'quantity',
      label: 'Qty on hand',
      sortable: true,
      width: '110px',
      align: 'right',
      render: (v) => {
        const n = parseQty(v)
        return (
          <span className={`text-sm font-semibold tabular-nums ${n < 0 ? 'text-rose-700' : ''}`}>
            {formatQty(n)}
          </span>
        )
      },
    },
    {
      key: 'unit',
      label: 'Unit',
      width: '64px',
      render: (v) => <span className="text-sm text-muted-foreground">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'stockStatus',
      label: 'Status',
      width: '120px',
      render: (v) => <ErpBadge status={v != null && String(v) !== '' ? String(v) : '—'} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Review Negative Inventory"
        subtitle="Locations with quantity below zero — adjust to zero after verifying counts"
        icon={<AlertTriangle className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Review Negative' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!orgId || loading}
              onClick={() => void refetch()}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            <a
              href="/inventory-control"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Warehouse className="h-3.5 w-3.5" />
              Inventory control
            </a>
          </div>
        }
      />

      <StatsRow cols={2}>
        <StatCard label="Negative lines" value={stats.negativeLines} icon={<AlertTriangle className="h-5 w-5" />} variant="rose" />
        <StatCard label="Tracked bin lines" value={stats.trackedLocations} icon={<Package className="h-5 w-5" />} variant="slate" />
      </StatsRow>

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

      <DataTable<InvRow>
        data={tableRows}
        columns={columns}
        loading={loading}
        title="All Negative Quantities"
        searchable
        searchPlaceholder="Search item, bin, warehouse…"
        emptyMessage={
          stats.trackedLocations === 0
            ? 'No inventory control rows for this organization. Add stock in Inventory control first.'
            : 'No negative quantities. All tracked lines are at or above zero.'
        }
        pageSize={25}
        actions={[
          {
            label: adjustLoading ? 'Working…' : 'Bring to zero',
            icon: <RefreshCw className="h-3.5 w-3.5" />,
            onClick: (row) => bringToZero(row),
            show: (row) => parseQty(row.quantity) < 0,
          },
        ]}
      />
    </div>
  )
}
