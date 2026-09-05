'use client'

import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ITEMS, GET_SALES_ORDERS, GET_PURCHASE_ORDERS } from '@/gql/queries'
import { ReportShell } from '@/components/reports/report-shell'
import { formatMoney, formatNumber } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'

export default function InventoryProfitabilityPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const itemsQ = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const soQ = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const poQ = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const items: any[] = itemsQ.data?.items ?? []
  const sales: any[] = soQ.data?.salesorders ?? []
  const purchases: any[] = poQ.data?.purchaseorders ?? []

  const totals = useMemo(() => {
    const revenue = sales.reduce((s, x) => s + Number(x.totalAmount ?? 0), 0)
    const cogs = purchases.reduce((s, x) => s + Number(x.totalAmount ?? 0), 0)
    const profit = revenue - cogs
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    return { revenue, cogs, profit, margin }
  }, [sales, purchases])

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>Revenue:</strong> ${pdfMoney(totals.revenue)}</div>
      <div><strong>COGS:</strong> ${pdfMoney(totals.cogs)}</div>
      <div><strong>Gross profit:</strong> ${pdfMoney(totals.profit)}</div>
      <div><strong>Margin:</strong> ${totals.margin.toFixed(1)}%</div>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Top items by rate</div>
      <table>
        <thead><tr><th>Item</th><th>Category</th><th class="num">Rate</th></tr></thead>
        <tbody>
          ${items.slice(0, 50).map((it: any) => `
            <tr>
              <td>${escapeHtml(it.name)}</td>
              <td>${escapeHtml(it.category ?? '—')}</td>
              <td class="num">${pdfMoney(it.rate ?? 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  return (
    <ReportShell
      title="Inventory Profitability"
      description="Gross margin between sales revenue and procurement cost."
      onRefresh={() => { itemsQ.refetch?.(); soQ.refetch?.(); poQ.refetch?.() }}
      loading={itemsQ.loading || soQ.loading || poQ.loading}
      pdfBody={buildPdf}
      pdfFilename="inventory-profitability"
    >
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Revenue" value={formatMoney(totals.revenue)} tone="emerald" />
        <Stat label="COGS" value={formatMoney(totals.cogs)} tone="rose" />
        <Stat label="Gross profit" value={formatMoney(totals.profit)} tone="brand" />
        <Stat label="Margin" value={`${totals.margin.toFixed(1)}%`} tone="brand" />
      </div>
      <p className="text-sm text-muted-foreground mb-3">Top items by selling rate (catalog view):</p>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="erp-table">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Item</th>
              <th className="px-3 py-2.5 font-medium">Category</th>
              <th className="px-3 py-2.5 font-medium">Unit</th>
              <th className="px-4 py-2.5 font-medium text-right">Rate</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground text-sm">No items in catalog.</td></tr>
            ) : [...items].sort((a: any, b: any) => Number(b.rate ?? 0) - Number(a.rate ?? 0)).slice(0, 30).map((it: any) => (
              <tr key={it.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5 font-medium">{it.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{it.category || '—'}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{it.unit || '—'}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatMoney(it.rate ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'rose' | 'brand' }) {
  const cls = tone === 'emerald'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-primary/20 bg-primary-soft text-primary'
  return (
    <div className={'rounded-xl border p-4 ' + cls}>
      <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
