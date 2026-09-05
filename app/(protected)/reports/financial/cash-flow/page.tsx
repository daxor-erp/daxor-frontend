'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_CASH_BANKS } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'
import { formatDate } from '@/lib/format-date'

export default function CashFlowPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_month')

  const { data, loading, refetch } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const txns: any[] = data?.cashBanks ?? []
  const r = periodRange(period)
  const filtered = useMemo(() => txns.filter((t) => inRange(t.transactionDate ?? t.createdAt, r)), [txns, period])

  const flow = useMemo(() => {
    let inflow = 0
    let outflow = 0
    for (const t of filtered) {
      const amt = Number(t.amount ?? 0)
      const ty = String(t.transactionType ?? '').toUpperCase()
      const isIn = ['RECEIPT', 'DEPOSIT', 'CREDIT', 'IN', 'INFLOW'].includes(ty)
      const isOut = ['PAYMENT', 'WITHDRAWAL', 'DEBIT', 'OUT', 'OUTFLOW'].includes(ty)
      if (isIn) inflow += amt
      else if (isOut) outflow += amt
      else inflow += amt
    }
    return { inflow, outflow, net: inflow - outflow }
  }, [filtered])

  const buildPdf = () => `
    <div class="pdf-section">
      <div class="pdf-section-title">Summary</div>
      <table>
        <tbody>
          <tr><td>Cash inflows</td><td class="num">${pdfMoney(flow.inflow)}</td></tr>
          <tr><td>Cash outflows</td><td class="num">(${pdfMoney(flow.outflow)})</td></tr>
          <tr style="background:#ecfdf5;border-top:2px solid #059669;"><td><strong>Net change in cash</strong></td><td class="num"><strong>${pdfMoney(flow.net)}</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Transactions (${filtered.length})</div>
      <table>
        <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th>Description</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${filtered.slice(0, 200).map((t: any) => `
            <tr>
              <td>${escapeHtml(t.transactionDate ? formatDate(t.transactionDate) : '')}</td>
              <td>${escapeHtml(t.transactionType)}</td>
              <td>${escapeHtml(t.transactionNumber)}</td>
              <td>${escapeHtml(t.description ?? '')}</td>
              <td class="num">${pdfMoney(t.amount ?? 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  return (
    <ReportShell
      title="Cash Flow Statement"
      description="Cash inflows, outflows and net change for the selected period."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="cash-flow"
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Summary label="Cash inflows" value={flow.inflow} tone="emerald" />
        <Summary label="Cash outflows" value={flow.outflow} tone="rose" />
        <Summary label="Net change in cash" value={flow.net} tone="brand" />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="erp-table">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Reference</th>
              <th className="px-3 py-2.5 font-medium">Description</th>
              <th className="px-4 py-2.5 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">No transactions in this period.</td></tr>
            ) : filtered.map((t: any) => (
              <tr key={t.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5">{t.transactionDate ? formatDate(t.transactionDate) : '—'}</td>
                <td className="px-3 py-2.5"><span className="inline-flex items-center rounded-full border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase">{t.transactionType}</span></td>
                <td className="px-3 py-2.5 font-mono text-xs">{t.transactionNumber}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{t.description || '—'}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatMoney(t.amount ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function Summary({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'rose' | 'brand' }) {
  const cls = tone === 'emerald'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-primary/20 bg-primary-soft text-primary'
  return (
    <div className={'rounded-xl border p-4 ' + cls}>
      <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{formatMoney(value)}</p>
    </div>
  )
}
