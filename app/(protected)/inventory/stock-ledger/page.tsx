'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_STOCK_MOVEMENTS, GET_ITEMS } from '@/gql/queries'
import { DataTable, Column } from '@/components/DataTable'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { BookOpen, RefreshCw, ArrowRightLeft, Hash } from 'lucide-react'

type MovementRow = {
  id?: string | null
  itemId?: string | null
  movementType?: string | null
  fromLocation?: string | null
  toLocation?: string | null
  quantity?: number | null
  unit?: string | null
  referenceModule?: string | null
  referenceId?: string | null
  movementDate?: string | null
  notes?: string | null
  organizationId?: string | null
  createdAt?: string | null
}

function parseQty(q: unknown): number {
  if (typeof q === 'number' && Number.isFinite(q)) return q
  const n = parseFloat(String(q ?? ''))
  return Number.isFinite(n) ? n : 0
}

function formatQty(q: number): string {
  if (!Number.isFinite(q)) return '—'
  return q.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

function formatLedgerDate(iso: string | null | undefined): string {
  if (iso == null || String(iso).trim() === '') return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function movementTypeStyle(t: string): string {
  const u = t.toUpperCase()
  if (u === 'IN' || u === 'RECEIPT') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (u === 'OUT' || u === 'ISSUE') return 'bg-rose-50 text-rose-800 border-rose-200'
  if (u === 'ADJUSTMENT' || u === 'ADJUST') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (u === 'TRANSFER') return 'bg-blue-50 text-blue-800 border-blue-200'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

export default function StockLedgerPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [itemFilter, setItemFilter] = useState('')

  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'cache-first',
  })

  const { data, loading, error: listError, refetch } = useQuery(GET_STOCK_MOVEMENTS, {
    variables: {
      organizationId: orgId,
      itemId: itemFilter.trim() !== '' ? itemFilter.trim() : null,
    },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rawRows: MovementRow[] = data?.stockMovements ?? []

  const rows: MovementRow[] = useMemo(
    () =>
      rawRows.map((r, i) => ({
        ...r,
        id: r.id != null && String(r.id) !== '' ? String(r.id) : `row-${i}`,
      })),
    [rawRows],
  )

  const itemOptions = useMemo(() => {
    const items = itemsData?.items ?? []
    return [
      { value: '', label: 'All items' },
      ...items.map((it: { id?: string; name?: string }) => ({
        value: String(it.id ?? ''),
        label: String(it.name ?? it.id ?? ''),
      })),
    ]
  }, [itemsData])

  const stats = useMemo(() => {
    const byType = new Map<string, number>()
    for (const r of rows) {
      const k = r.movementType != null && String(r.movementType).trim() !== ''
        ? String(r.movementType).toUpperCase()
        : '—'
      byType.set(k, (byType.get(k) ?? 0) + 1)
    }
    return { total: rows.length, byType }
  }, [rows])

  const columns: Column<MovementRow>[] = [
    {
      key: 'movementDate',
      label: 'Date / time',
      sortable: true,
      width: '170px',
      render: (v) => (
        <span className="text-xs text-gray-800 tabular-nums">{formatLedgerDate(v as string)}</span>
      ),
    },
    {
      key: 'movementType',
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (v) => {
        const label = v != null && String(v) !== '' ? String(v) : '—'
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${movementTypeStyle(label)}`}
          >
            {label}
          </span>
        )
      },
    },
    {
      key: 'itemId',
      label: 'Item',
      sortable: true,
      width: '180px',
      render: (v) => (
        <span className="font-mono text-xs text-gray-800">{v != null && String(v) !== '' ? String(v) : '—'}</span>
      ),
    },
    {
      key: 'fromLocation',
      label: 'From',
      width: '100px',
      render: (v) => <span className="text-xs text-gray-700">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'toLocation',
      label: 'To',
      width: '100px',
      render: (v) => <span className="text-xs text-gray-700">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'quantity',
      label: 'Qty',
      sortable: true,
      width: '90px',
      align: 'right',
      render: (v) => {
        const n = parseQty(v)
        const color = n < 0 ? 'text-rose-700' : n > 0 ? 'text-emerald-800' : 'text-gray-800'
        return <span className={`text-xs font-semibold tabular-nums ${color}`}>{formatQty(n)}</span>
      },
    },
    {
      key: 'unit',
      label: 'Unit',
      width: '64px',
      render: (v) => <span className="text-xs text-gray-600">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'referenceModule',
      label: 'Ref. module',
      width: '120px',
      render: (v) => <span className="text-xs text-gray-600">{v != null && String(v) !== '' ? String(v) : '—'}</span>,
    },
    {
      key: 'referenceId',
      label: 'Ref. ID',
      width: '100px',
      render: (v) => (
        <span className="font-mono text-[10px] text-gray-500 truncate block max-w-[6rem]">
          {v != null && String(v) !== '' ? String(v) : '—'}
        </span>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (v) => {
        const s = v != null ? String(v).trim() : ''
        if (!s) return <span className="text-xs text-gray-400">—</span>
        const short = s.length > 80 ? `${s.slice(0, 80)}…` : s
        return <span title={s} className="text-xs text-gray-700">{short}</span>
      },
    },
  ]

  const topTypes = useMemo(() => Array.from(stats.byType.entries()).slice(0, 4), [stats.byType])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock ledger</h1>
        <p className="text-gray-500">
          Chronological log of inventory movements (receipts, issues, adjustments, transfers) for your organization.
        </p>
      </div>

      {!orgId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your profile; ledger data cannot be loaded.
        </p>
      )}

      {listError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {listError.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
        <div className="w-full sm:w-72">
          <SelectFloating
            label="Filter by item"
            value={itemFilter}
            onChange={(e) => setItemFilter(typeof e === 'string' ? e : e.target.value)}
            options={itemOptions}
            className="h-8 text-xs"
          />
        </div>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-md bg-slate-50">
            <BookOpen className="h-4 w-4 text-slate-700" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Movements shown</p>
            <p className="text-lg font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
        {topTypes.map(([label, count]) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm"
          >
            <div className="p-2 rounded-md bg-blue-50">
              <Hash className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{count}</p>
            </div>
          </div>
        ))}
        {topTypes.length === 0 && stats.total === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm sm:col-span-3">
            <div className="p-2 rounded-md bg-gray-50">
              <ArrowRightLeft className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Tip</p>
              <p className="text-sm text-gray-600">
                Movements appear when you post inventory adjustments or other modules record stock movement.
              </p>
            </div>
          </div>
        )}
      </div>

      <DataTable<MovementRow>
        data={rows}
        columns={columns}
        loading={loading}
        title="Movement lines (newest first)"
        searchable
        searchPlaceholder="Search type, item, location, reference, notes…"
        emptyMessage={
          itemFilter
            ? 'No movements for the selected item.'
            : 'No stock movements recorded yet for this organization.'
        }
        rowKey="id"
      />
    </div>
  )
}
