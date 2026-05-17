'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_CUSTOMER_INVOICES, GET_VENDOR_BILLS } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'

export default function IncomeStatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')

  const invQ = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const billsQ = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const invoices: any[] = invQ.data?.customerinvoices ?? []
  const bills: any[] = billsQ.data?.vendorBills ?? []
  const r = periodRange(period)

  const filtered = useMemo(() => {
    const inv = invoices.filter((i) => inRange(i.invoiceDate ?? i.createdAt, r))
    const bl = bills.filter((b) => inRange(b.billDate ?? b.createdAt, r))
    return { inv, bl }
  }, [invoices, bills, period])

  const totals = useMemo(() => {
    const revenue = filtered.inv.reduce((s, i) => s + Number(i.totalAmount ?? 0), 0)
    const tax = filtered.inv.reduce((s, i) => s + Number(i.taxAmount ?? 0), 0)
    const cogs = filtered.bl.reduce((s, b) => s + Number(b.subtotal ?? b.totalAmount ?? 0), 0)
    const opex = 0 // placeholder until expense module exists
    const gross = revenue - tax - cogs
    const net = gross - opex
    return { revenue, tax, cogs, opex, gross, net }
  }, [filtered])

  const buildPdf = () => `
    <div class="pdf-section">
      <div class="pdf-section-title">Revenue</div>
      <table>
        <tbody>
          <tr><td>Total sales revenue</td><td class="num">${pdfMoney(totals.revenue)}</td></tr>
          <tr><td>Less: GST / taxes collected</td><td class="num">(${pdfMoney(totals.tax)})</td></tr>
          <tr style="background:#f3f4f6;"><td><strong>Net revenue</strong></td><td class="num"><strong>${pdfMoney(totals.revenue - totals.tax)}</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Cost of goods sold</div>
      <table>
        <tbody>
          <tr><td>Vendor bills (procurement)</td><td class="num">${pdfMoney(totals.cogs)}</td></tr>
          <tr style="background:#f3f4f6;"><td><strong>Gross profit</strong></td><td class="num"><strong>${pdfMoney(totals.gross)}</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Operating expenses</div>
      <table>
        <tbody>
          <tr><td>Operating expenses</td><td class="num">${pdfMoney(totals.opex)}</td></tr>
          <tr style="background:#ecfdf5;border-top:2px solid #059669;"><td><strong>Net income</strong></td><td class="num"><strong>${pdfMoney(totals.net)}</strong></td></tr>
        </tbody>
      </table>
    </div>
  `

  return (
    <ReportShell
      title="Income Statement"
      description="Profit & loss summary for the selected period."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => {
        invQ.refetch?.()
        billsQ.refetch?.()
      }}
      loading={invQ.loading || billsQ.loading}
      pdfBody={buildPdf}
      pdfFilename="income-statement"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Section title="Revenue" rows={[
          { label: 'Total sales revenue', value: totals.revenue, strong: true },
          { label: 'Less: taxes collected', value: -totals.tax },
          { label: 'Net revenue', value: totals.revenue - totals.tax, divider: true, strong: true },
        ]} />
        <Section title="Cost of goods sold" rows={[
          { label: 'Vendor bills', value: totals.cogs },
          { label: 'Gross profit', value: totals.gross, divider: true, strong: true },
        ]} />
        <Section title="Operating expenses" rows={[
          { label: 'Operating expenses', value: totals.opex, hint: 'No expense module yet' },
          { label: 'Net income', value: totals.net, divider: true, strong: true, accent: true },
        ]} />
      </div>
    </ReportShell>
  )
}

function Section({ title, rows }: { title: string; rows: Array<{ label: string; value: number; strong?: boolean; divider?: boolean; accent?: boolean; hint?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={i} className={r.divider ? 'pt-2 mt-2 border-t border-border' : ''}>
            <div className="flex items-center justify-between gap-2">
              <span className={'text-sm ' + (r.strong ? 'font-semibold' : '')}>{r.label}</span>
              <span className={
                'tabular-nums text-sm ' +
                (r.strong ? 'font-bold ' : '') +
                (r.accent ? 'text-emerald-700' : r.value < 0 ? 'text-rose-700' : '')
              }>
                {r.value < 0 ? `(${formatMoney(Math.abs(r.value))})` : formatMoney(r.value)}
              </span>
            </div>
            {r.hint && <p className="text-[11px] text-muted-foreground mt-0.5">{r.hint}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
