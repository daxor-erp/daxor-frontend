'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_CUSTOMER_INVOICES, GET_VENDOR_BILLS, GET_CASH_BANKS } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'
import { formatDate } from '@/lib/format-date'

type Row = {
  date: string
  reference: string
  type: 'Invoice' | 'Bill' | 'Cash/Bank'
  description: string
  amount: number
}

export default function TransactionDetailPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_quarter')

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
  const cashQ = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const r = periodRange(period)
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    for (const i of invQ.data?.customerinvoices ?? []) {
      if (!inRange(i.invoiceDate ?? i.createdAt, r)) continue
      out.push({
        date: i.invoiceDate ?? i.createdAt,
        reference: `INV-${i.seqNo ?? i.id?.slice(-6)}`,
        type: 'Invoice',
        description: `Customer invoice · status ${String(i.status ?? '').toLowerCase()}`,
        amount: Number(i.totalAmount ?? 0),
      })
    }
    for (const b of billsQ.data?.vendorBills ?? []) {
      if (!inRange(b.billDate ?? b.createdAt, r)) continue
      out.push({
        date: b.billDate ?? b.createdAt,
        reference: b.billNumber ?? b.id?.slice(-6),
        type: 'Bill',
        description: `Vendor bill · ${b.vendor?.name ?? '—'}`,
        amount: -Number(b.totalAmount ?? 0),
      })
    }
    for (const c of cashQ.data?.cashBanks ?? []) {
      if (!inRange(c.transactionDate ?? c.createdAt, r)) continue
      const amt = Number(c.amount ?? 0)
      const t = String(c.transactionType ?? '').toUpperCase()
      const sign = ['PAYMENT', 'WITHDRAWAL', 'DEBIT', 'OUT', 'OUTFLOW'].includes(t) ? -1 : 1
      out.push({
        date: c.transactionDate ?? c.createdAt,
        reference: c.transactionNumber ?? c.id?.slice(-6),
        type: 'Cash/Bank',
        description: c.description ?? c.transactionType ?? '',
        amount: sign * amt,
      })
    }
    return out.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
  }, [invQ.data, billsQ.data, cashQ.data, period])

  const total = rows.reduce((s, r) => s + r.amount, 0)

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${rows.length}</strong> transactions</div>
      <div><strong>Net amount:</strong> ${pdfMoney(total)}</div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th>Description</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${rows.slice(0, 300).map((r) => `
          <tr>
            <td>${escapeHtml(r.date ? formatDate(r.date) : '')}</td>
            <td>${escapeHtml(r.type)}</td>
            <td>${escapeHtml(r.reference)}</td>
            <td>${escapeHtml(r.description)}</td>
            <td class="num">${pdfMoney(r.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  return (
    <ReportShell
      title="Transaction Detail"
      description="All financial transactions in the selected period."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => { invQ.refetch?.(); billsQ.refetch?.(); cashQ.refetch?.() }}
      loading={invQ.loading || billsQ.loading || cashQ.loading}
      pdfBody={buildPdf}
      pdfFilename="transaction-detail"
    >
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
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">No transactions in this period.</td></tr>
            ) : rows.slice(0, 100).map((r, i) => (
              <tr key={i} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5">{r.date ? formatDate(r.date) : '—'}</td>
                <td className="px-3 py-2.5">
                  <span className={
                    'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ' +
                    (r.type === 'Invoice'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : r.type === 'Bill'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200')
                  }>{r.type}</span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{r.reference}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.description || '—'}</td>
                <td className={'px-4 py-2.5 text-right tabular-nums font-medium ' + (r.amount < 0 ? 'text-rose-600' : '')}>
                  {r.amount < 0 ? `(${formatMoney(Math.abs(r.amount))})` : formatMoney(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t bg-secondary/60">
                <td colSpan={4} className="px-4 py-2.5 text-right font-bold">Net total</td>
                <td className={'px-4 py-2.5 text-right tabular-nums font-bold ' + (total < 0 ? 'text-rose-600' : 'text-emerald-700')}>
                  {formatMoney(total)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {rows.length > 100 && (
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Showing first 100 of {rows.length} rows · Download PDF for the full report.
        </p>
      )}
    </ReportShell>
  )
}
