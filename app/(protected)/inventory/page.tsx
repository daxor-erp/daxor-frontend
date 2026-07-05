'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { Package, AlertTriangle, Warehouse, Boxes } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PRODUCTS,
  GET_LOW_STOCK_ITEMS,
  GET_WAREHOUSES,
  GET_ITEMS,
} from '@/gql/queries'
import { cn } from '@/lib/utils'

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  loading,
}: {
  label: string
  value: string | number
  hint?: string
  icon: typeof Package
  href?: string
  loading?: boolean
}) {
  const body = (
    <div
      className={cn(
        'flex min-h-[140px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow',
        href && 'hover:border-teal-200 hover:shadow-md cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">
          {loading ? '—' : value}
        </p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{body}</Link>
  }
  return body
}

export default function InventoryOverviewPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const skip = !orgId

  const productsQ = useQuery(GET_PRODUCTS, { skip, fetchPolicy: 'cache-and-network' })
  const lowStockQ = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
  })
  const warehousesQ = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId, isActive: true },
    skip,
    fetchPolicy: 'cache-and-network',
  })
  const itemsQ = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip,
    fetchPolicy: 'cache-and-network',
  })

  const products = productsQ.data?.products ?? []
  const lowStock = lowStockQ.data?.lowStockItems ?? []
  const warehouses = warehousesQ.data?.warehouses ?? []
  const totalItems = itemsQ.data?.items?.length ?? 0

  const loading =
    productsQ.loading || lowStockQ.loading || warehousesQ.loading || itemsQ.loading

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Inventory Overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Summary of products, stock levels, and warehouse activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Products"
          value={products.length}
          hint="Active product catalog"
          icon={Package}
          href="/inventory/products"
          loading={loading}
        />
        <MetricCard
          label="Stock Items"
          value={totalItems}
          hint="Items tracked in inventory"
          icon={Boxes}
          loading={loading}
        />
        <MetricCard
          label="Low Stock Alerts"
          value={lowStock.length}
          hint="Items below reorder point"
          icon={AlertTriangle}
          loading={loading}
        />
        <MetricCard
          label="Warehouses"
          value={warehouses.length}
          hint="Active warehouse locations"
          icon={Warehouse}
          loading={loading}
        />
      </div>
    </div>
  )
}
