'use client'

import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_INVENTORY_CONTROLS, GET_WAREHOUSES, GET_LOW_STOCK_ITEMS } from '@/gql/queries'
import { ReportShell } from '@/components/reports/report-shell'
import { formatNumber } from '@/lib/format-money'
import { escapeHtml } from '@/lib/pdf-download'

export default function InventorySummaryReportPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const ctlQ = useQuery(GET_INVENTORY_CONTROLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const whQ = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const lowQ = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const stocks: any[] = ctlQ.data?.inventoryControls ?? []
  const warehouses: any[] = whQ.data?.warehouses ?? []
  const lowStock: any[] = lowQ.data?.lowStockItems ?? []

  const byWarehouse = useMemo(() => {
    const map = new Map<string, { id: string; name: string; items: number; quantity: number }>()
    const whMap = new Map<string, any>(warehouses.map((w: any) => [w.id, w]))
    for (const s of stocks) {
      const id = String(s.warehouseId ?? 'unassigned')
      const wh = whMap.get(id)
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: wh?.warehouseName ?? wh?.warehouseCode ?? (id === 'unassigned' ? 'Unassigned' : id),
          items: 0,
          quantity: 0,
        })
      }
      const r = map.get(id)!
      r.items += 1
      r.quantity += Number(s.quantity ?? 0)
    }
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity)
  }, [stocks, warehouses])

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${stocks.length}</strong> stock records</div>
      <div><strong>${warehouses.length}</strong> warehouses</div>
      <div><strong>${lowStock.length}</strong> low stock</div>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Stock by warehouse</div>
      <table>
        <thead><tr><th>Warehouse</th><th class="num">Items</th><th class="num">Quantity</th></tr></thead>
        <tbody>
          ${byWarehouse.map((w) => `
            <tr><td>${escapeHtml(w.name)}</td><td class="num">${formatNumber(w.items)}</td><td class="num">${formatNumber(w.quantity)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  return (
    <ReportShell
      title="Inventory Summary"
      description="Stock distribution and warehouse breakdown."
      onRefresh={() => { ctlQ.refetch?.(); whQ.refetch?.(); lowQ.refetch?.() }}
      loading={ctlQ.loading || whQ.loading}
      pdfBody={buildPdf}
      pdfFilename="inventory-summary"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Stock records" value={stocks.length} />
        <Stat label="Warehouses" value={warehouses.length} />
        <Stat label="Total quantity" value={stocks.reduce((s, x) => s + Number(x.quantity ?? 0), 0)} />
        <Stat label="Low stock" value={lowStock.length} tone="warn" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="erp-table">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Warehouse</th>
              <th className="px-3 py-2.5 font-medium text-right">Items</th>
              <th className="px-4 py-2.5 font-medium text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {byWarehouse.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground text-sm">No inventory data yet.</td></tr>
            ) : byWarehouse.map((w) => (
              <tr key={w.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5 font-medium">{w.name}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(w.items)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(w.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'warn' }) {
  return (
    <div className={'rounded-xl border p-3 ' + (tone === 'warn' ? 'border-amber-200 bg-amber-50' : 'border-border bg-secondary/30')}>
      <p className={'text-[11px] uppercase tracking-wider font-semibold ' + (tone === 'warn' ? 'text-amber-700' : 'text-muted-foreground')}>{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{formatNumber(value)}</p>
    </div>
  )
}
