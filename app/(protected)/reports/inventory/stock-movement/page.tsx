'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_STOCK_MOVEMENTS } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange } from '@/components/reports/report-shell'
import { formatNumber } from '@/lib/format-money'
import { escapeHtml } from '@/lib/pdf-download'
import { formatDate } from '@/lib/format-date'

export default function StockMovementReportPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_month')

  const { data, loading, refetch } = useQuery(GET_STOCK_MOVEMENTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const movements: any[] = data?.stockMovements ?? []
  const r = periodRange(period)
  const filtered = useMemo(
    () =>
      movements.filter((m) => inRange(m.movementDate ?? m.createdAt, r))
        .sort((a, b) => String(b.movementDate ?? '').localeCompare(String(a.movementDate ?? ''))),
    [movements, period],
  )

  const stats = useMemo(() => {
    let inflow = 0
    let outflow = 0
    for (const m of filtered) {
      const q = Number(m.quantity ?? 0)
      const t = String(m.movementType ?? '').toUpperCase()
      if (['IN', 'INWARD', 'RECEIPT', 'GRN'].includes(t)) inflow += q
      else if (['OUT', 'OUTWARD', 'ISSUE', 'CONSUMPTION'].includes(t)) outflow += q
    }
    return { inflow, outflow, net: inflow - outflow }
  }, [filtered])

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${filtered.length}</strong> movements</div>
      <div><strong>Inflow:</strong> ${formatNumber(stats.inflow)}</div>
      <div><strong>Outflow:</strong> ${formatNumber(stats.outflow)}</div>
      <div><strong>Net:</strong> ${formatNumber(stats.net)}</div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Type</th><th>Item</th><th>From</th><th>To</th><th>Reference</th><th class="num">Qty</th></tr></thead>
      <tbody>
        ${filtered.slice(0, 300).map((m: any) => `
          <tr>
            <td>${escapeHtml(m.movementDate ? formatDate(m.movementDate) : '')}</td>
            <td>${escapeHtml(m.movementType)}</td>
            <td>${escapeHtml(m.itemId)}</td>
            <td>${escapeHtml(m.fromLocation ?? '')}</td>
            <td>${escapeHtml(m.toLocation ?? '')}</td>
            <td>${escapeHtml(m.referenceModule ? `${m.referenceModule}:${m.referenceId}` : '')}</td>
            <td class="num">${formatNumber(m.quantity ?? 0)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  return (
    <ReportShell
      title="Stock Movement Report"
      description="Inbound, outbound and transfer activity over time."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="stock-movement"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Movements" value={filtered.length} />
        <Stat label="Inflow units" value={stats.inflow} tone="emerald" />
        <Stat label="Outflow units" value={stats.outflow} tone="rose" />
        <Stat label="Net change" value={stats.net} tone={stats.net >= 0 ? 'emerald' : 'rose'} />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Item</th>
              <th className="px-3 py-2.5 font-medium">From</th>
              <th className="px-3 py-2.5 font-medium">To</th>
              <th className="px-4 py-2.5 font-medium text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No movements in this period.</td></tr>
            ) : filtered.slice(0, 100).map((m: any) => (
              <tr key={m.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5">{m.movementDate ? formatDate(m.movementDate) : '—'}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center rounded-full border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase">
                    {m.movementType}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{m.itemId}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{m.fromLocation || '—'}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{m.toLocation || '—'}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatNumber(m.quantity ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'emerald' | 'rose' }) {
  const cls = tone === 'emerald'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-border bg-secondary/30'
  return (
    <div className={'rounded-xl border p-3 ' + cls}>
      <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{formatNumber(value)}</p>
    </div>
  )
}
