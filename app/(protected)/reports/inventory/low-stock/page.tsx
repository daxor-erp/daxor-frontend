'use client'

import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_LOW_STOCK_ITEMS } from '@/gql/queries'
import { ReportShell } from '@/components/reports/report-shell'
import { formatNumber } from '@/lib/format-money'
import { escapeHtml } from '@/lib/pdf-download'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function LowStockReportPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { data, loading, refetch } = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const items: any[] = data?.lowStockItems ?? []
  const oos = items.filter((i) => String(i.stockStatus ?? '').toUpperCase() === 'OUT_OF_STOCK').length

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${items.length}</strong> items below reorder point</div>
      <div><strong>${oos}</strong> out of stock</div>
    </div>
    <table>
      <thead><tr><th>Item</th><th class="num">Quantity</th><th class="num">Reorder point</th><th>Status</th></tr></thead>
      <tbody>
        ${items.map((it) => `
          <tr>
            <td>${escapeHtml(it.itemName)}</td>
            <td class="num">${formatNumber(it.quantity ?? 0)}</td>
            <td class="num">${formatNumber(it.reorderPoint ?? 0)}</td>
            <td>${escapeHtml(String(it.stockStatus ?? '').replace('_', ' '))}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  return (
    <ReportShell
      title="Low Stock Report"
      description="Items at or below their reorder point."
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="low-stock"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold">All items above reorder point</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Nothing needs replenishment right now. Refresh to re-check.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">Below reorder point</p>
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-amber-900">{items.length - oos}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">Out of stock</p>
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-rose-900">{oos}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Item</th>
                  <th className="px-3 py-2.5 font-medium text-right">Quantity</th>
                  <th className="px-3 py-2.5 font-medium text-right">Reorder point</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: any) => {
                  const isOos = String(it.stockStatus ?? '').toUpperCase() === 'OUT_OF_STOCK'
                  return (
                    <tr key={it.id} className="border-t hover:bg-secondary/30">
                      <td className="px-4 py-2.5 font-medium">{it.itemName}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(it.quantity ?? 0)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{formatNumber(it.reorderPoint ?? 0)}</td>
                      <td className="px-4 py-2.5">
                        <span className={
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ' +
                          (isOos
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200')
                        }>{String(it.stockStatus ?? 'low').replace('_', ' ')}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ReportShell>
  )
}
