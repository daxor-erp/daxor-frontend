'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Plus, Search, Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTS } from '@/gql/queries'
import { formatMoney } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function InventoryProductsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const { data, loading } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
  })

  const products: any[] = data?.products ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        String(p.name ?? '').toLowerCase().includes(q) ||
        String(p.sku ?? '').toLowerCase().includes(q) ||
        String(p.category ?? '').toLowerCase().includes(q),
    )
  }, [products, search])

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <Link href="/inventory/products/new">
          <Button className="h-9 gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-medium">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <span>Products</span>
        </div>
        <div className="ml-auto flex min-w-[200px] max-w-md flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 sm:max-w-xs">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <span className="text-xs text-slate-500 tabular-nums">
          {filtered.length} / {products.length}
        </span>
      </div>

      {/* Product grid */}
      <div className="flex-1 p-4 sm:p-6">
        {loading && products.length === 0 ? (
          <p className="text-sm text-slate-500">Loading products…</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="text-sm font-medium text-slate-700">No products found</p>
            <p className="mt-1 text-xs text-slate-500">Create your first product to get started.</p>
            <Link href="/inventory/products/new" className="mt-4">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/inventory/products/${product.id}`}
                className="group flex min-h-[120px] flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-1">
                  <Star className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-teal-500" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold uppercase leading-snug text-slate-800">
                  {product.name}
                </p>
                <div className="mt-auto space-y-0.5 pt-3 text-[11px] text-slate-600">
                  <p>
                    Price:{' '}
                    <span className="font-medium text-slate-800">
                      {formatMoney(Number(product.price ?? 0))}
                    </span>
                  </p>
                  <p>
                    Unit:{' '}
                    <span className="font-medium text-slate-800">{product.unit ?? '—'}</span>
                  </p>
                  <p className="capitalize">
                    Status:{' '}
                    <span
                      className={cn(
                        'font-medium',
                        product.status === 'active' ? 'text-teal-700' : 'text-slate-600',
                      )}
                    >
                      {product.status ?? 'active'}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
