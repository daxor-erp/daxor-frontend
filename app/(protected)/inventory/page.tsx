'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { RUN_REORDER_SCHEDULER } from '@/gql/queries'
import { PageHeader, StatsRow, StatCard } from '@/components/ui/erp-shared'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { Button } from '@/components/ui/button'
import {
  Package, RefreshCcw, CheckCircle2, AlertCircle, ClipboardList,
  ArrowRightLeft, Layers, BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export default function InventoryPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<any>(null)

  const [runScheduler, { loading: running }] = useMutation(RUN_REORDER_SCHEDULER, {
    onCompleted: (d) => { setResult(d.runReorderScheduler); setShowConfirm(false) },
    onError: (e) => alert(e.message),
  })

  const MODULES = [
    { label: 'Stock Adjustments',  href: '/stock-adjustments',  icon: <ClipboardList className="h-6 w-6" />,  desc: 'Correct inventory counts after physical stock counts' },
    { label: 'Stock Transfers',    href: '/stock-transfers',     icon: <ArrowRightLeft className="h-6 w-6" />, desc: 'Move inventory between warehouses and bins' },
    { label: 'Goods Receipt Notes',href: '/grn',                 icon: <Package        className="h-6 w-6" />, desc: 'Record and validate incoming goods from vendors' },
    { label: 'Products',           href: '/products',            icon: <Layers         className="h-6 w-6" />, desc: 'Manage product catalog, reorder rules and valuations' },
    { label: 'Stock Ledger',       href: '/inventory/stock-ledger', icon: <BookOpen    className="h-6 w-6" />, desc: 'Full transaction history per item' },
  ]

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Manage stock levels, transfers, adjustments and automated replenishment"
        icon={<Package className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }]}
        actions={
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={running}
            variant="outline"
            className="gap-1.5"
          >
            <RefreshCcw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
            Run Reorder Scheduler
          </Button>
        }
      />

      {/* Scheduler result */}
      {result && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Reorder Scheduler Completed
          </div>
          <StatsRow cols={3}>
            <StatCard label="Products Scanned"     value={result.scanned}     icon={<Package      className="h-5 w-5" />} variant="slate" />
            <StatCard label="RFQs Created"         value={result.replenished} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
            <StatCard label="Errors"               value={result.products?.filter((p: any) => p.error).length ?? 0} icon={<AlertCircle className="h-5 w-5" />} variant={result.products?.some((p: any) => p.error) ? 'rose' : 'slate'} />
          </StatsRow>
          {result.products?.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Product</th>
                    <th className="text-right px-3 py-2 font-medium">On Hand</th>
                    <th className="text-right px-3 py-2 font-medium">Min Qty</th>
                    <th className="text-right px-3 py-2 font-medium">Ordered</th>
                    <th className="px-3 py-2 font-medium">RFQ Created</th>
                    <th className="px-3 py-2 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.products.map((p: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{p.productName}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.onHandQty}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.minQty}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.qtyToOrder}</td>
                      <td className="px-3 py-2">{p.poCreated ? <span className="text-green-600 font-medium">✓</span> : '—'}</td>
                      <td className="px-3 py-2 text-rose-600">{p.error ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(m => (
          <Link key={m.href} href={m.href}
            className="rounded-xl border bg-card p-5 hover:border-primary/40 hover:bg-muted/20 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {m.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => runScheduler({ variables: { organizationId: orgId } })}
        title="Run Reorder Scheduler?"
        description="Daxor will scan all products with reordering rules and create draft RFQs for any products below their minimum quantity. This is safe to run multiple times."
        confirmLabel={running ? 'Running…' : 'Run Scheduler'}
      />
    </div>
  )
}
