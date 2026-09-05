'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_GENERAL_LEDGERS, GET_JOURNAL_ENTRIES } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'
import { Search } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function GeneralLedgerReportPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')
  const [search, setSearch] = useState('')

  const glQ = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const jeQ = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const ledgers: any[] = glQ.data?.generalLedgers ?? []
  const journals: any[] = jeQ.data?.journalEntries ?? []
  const r = periodRange(period)

  const rows = useMemo(() => {
    const out: any[] = []
    for (const je of journals) {
      if (!inRange(je.date ?? je.transactionDate ?? je.createdAt, r)) continue
      const lines: any[] = je.lines ?? je.entries ?? []
      for (const line of lines) {
        out.push({
          date: je.date ?? je.transactionDate ?? je.createdAt,
          reference: je.referenceNumber ?? je.docNumber ?? je.id?.slice(-6),
          account: line.accountName ?? line.account ?? line.accountId ?? '—',
          description: line.description ?? je.description ?? '',
          debit: Number(line.debit ?? 0),
          credit: Number(line.credit ?? 0),
        })
      }
    }
    return out.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
  }, [journals, period])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (r) =>
        (r.account || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.reference || '').toLowerCase().includes(q),
    )
  }, [rows, search])

  const totals = useMemo(
    () => filtered.reduce((s, r) => ({ debit: s.debit + r.debit, credit: s.credit + r.credit }), { debit: 0, credit: 0 }),
    [filtered],
  )

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${ledgers.length}</strong> ledger accounts</div>
      <div><strong>${filtered.length}</strong> journal lines</div>
      <div><strong>Debit total:</strong> ${pdfMoney(totals.debit)}</div>
      <div><strong>Credit total:</strong> ${pdfMoney(totals.credit)}</div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th class="num">Debit</th><th class="num">Credit</th></tr></thead>
      <tbody>
        ${filtered.slice(0, 500).map((r) => `
          <tr>
            <td>${escapeHtml(r.date ? formatDate(r.date) : '')}</td>
            <td>${escapeHtml(r.reference)}</td>
            <td>${escapeHtml(r.account)}</td>
            <td>${escapeHtml(r.description)}</td>
            <td class="num">${r.debit ? pdfMoney(r.debit) : ''}</td>
            <td class="num">${r.credit ? pdfMoney(r.credit) : ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  return (
    <ReportShell
      title="General Ledger"
      description="Journal entries grouped by account"
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => { glQ.refetch?.(); jeQ.refetch?.() }}
      loading={glQ.loading || jeQ.loading}
      pdfBody={buildPdf}
      pdfFilename="general-ledger"
      toolbar={
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter account, ref…"
            className="rounded-lg border border-border bg-secondary/40 py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-48 sm:w-56"
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Accounts" value={ledgers.length} />
        <Stat label="Entries" value={filtered.length} />
        <Stat label="Debits" value={formatMoney(totals.debit)} />
        <Stat label="Credits" value={formatMoney(totals.credit)} />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="erp-table">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Ref</th>
              <th className="px-3 py-2.5 font-medium">Account</th>
              <th className="px-3 py-2.5 font-medium">Description</th>
              <th className="px-3 py-2.5 font-medium text-right">Debit</th>
              <th className="px-4 py-2.5 font-medium text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No journal entries in this period.</td></tr>
            ) : filtered.slice(0, 100).map((r, i) => (
              <tr key={i} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5">{r.date ? formatDate(r.date) : '—'}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{r.reference}</td>
                <td className="px-3 py-2.5 font-medium">{r.account}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.description || '—'}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.debit ? formatMoney(r.debit) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{r.credit ? formatMoney(r.credit) : <span className="text-muted-foreground">—</span>}</td>
              </tr>
            ))}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="border-t bg-secondary/60">
                <td colSpan={4} className="px-4 py-2.5 text-right font-semibold">Total</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{formatMoney(totals.debit)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-bold">{formatMoney(totals.credit)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {filtered.length > 100 && (
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Showing first 100 of {filtered.length} rows · Download PDF for the full report.
        </p>
      )}
    </ReportShell>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}
