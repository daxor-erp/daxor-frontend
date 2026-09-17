'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_GENERAL_LEDGERS, GET_JOURNAL_ENTRIES } from '@/gql/queries'
import { ReportShell, type ReportPeriod, periodRange, inRange, PERIOD_LABELS } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'
import { Search } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

type LedgerRow = {
  date: string
  reference: string
  account: string
  description: string
  debit: number
  credit: number
}

export default function GeneralLedgerReportPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')
  const [search, setSearch] = useState('')

  const glQ = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const jeQ = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { organizationId: orgId, status: 'posted' },
    skip: !orgId,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  })

  const ledgers: any[] = glQ.data?.generalLedgers ?? []
  const journals: any[] = jeQ.data?.journalEntries ?? []
  const r = periodRange(period)

  const rows = useMemo(() => {
    const out: LedgerRow[] = []

    // Primary: posted GL transactions (same source Income Statement ultimately reflects via journals,
    // but GL list is already returning data on this page). Avoid double-counting JE + GL pairs.
    for (const gl of ledgers) {
      const date = gl.transactionDate ?? gl.createdAt
      if (!inRange(date, r)) continue
      const amt = Number(gl.amount ?? 0)
      const ref = gl.transactionNumber ?? gl.id?.slice?.(-6) ?? '—'
      const desc = gl.description ?? gl.transactionType ?? ''
      if (gl.debitAccount) {
        out.push({
          date: String(date ?? ''),
          reference: ref,
          account: String(gl.debitAccount),
          description: desc,
          debit: amt,
          credit: 0,
        })
      }
      if (gl.creditAccount) {
        out.push({
          date: String(date ?? ''),
          reference: ref,
          account: String(gl.creditAccount),
          description: desc,
          debit: 0,
          credit: amt,
        })
      }
    }

    // Fallback: multi-line journals only when no GL rows for the period
    if (out.length === 0) {
      for (const je of journals) {
        if (!inRange(je.entryDate ?? je.postedAt ?? je.createdAt, r)) continue
        const lines: any[] = je.lines ?? []
        for (const line of lines) {
          out.push({
            date: String(je.entryDate ?? je.postedAt ?? je.createdAt ?? ''),
            reference: String(je.referenceNumber ?? je.entryNumber ?? je.seqNo ?? je.id?.slice?.(-6) ?? '—'),
            account: String(line.accountName ?? line.accountCode ?? '—'),
            description: String(line.description ?? je.description ?? ''),
            debit: Number(line.debit ?? 0),
            credit: Number(line.credit ?? 0),
          })
        }
      }
    }

    return out.sort((a, b) => String(b.date).localeCompare(String(a.date)))
  }, [ledgers, journals, period])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (row) =>
        row.account.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.reference.toLowerCase().includes(q),
    )
  }, [rows, search])

  const totals = useMemo(
    () => filtered.reduce((s, row) => ({ debit: s.debit + row.debit, credit: s.credit + row.credit }), { debit: 0, credit: 0 }),
    [filtered],
  )

  const uniqueAccounts = useMemo(() => new Set(filtered.map((row) => row.account)).size, [filtered])

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${uniqueAccounts}</strong> accounts</div>
      <div><strong>${filtered.length}</strong> ledger lines</div>
      <div><strong>Debit total:</strong> ${pdfMoney(totals.debit)}</div>
      <div><strong>Credit total:</strong> ${pdfMoney(totals.credit)}</div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th class="num">Debit</th><th class="num">Credit</th></tr></thead>
      <tbody>
        ${filtered.slice(0, 500).map((row) => `
          <tr>
            <td>${escapeHtml(row.date ? formatDate(row.date) : '')}</td>
            <td>${escapeHtml(row.reference)}</td>
            <td>${escapeHtml(row.account)}</td>
            <td>${escapeHtml(row.description)}</td>
            <td class="num">${row.debit ? pdfMoney(row.debit) : ''}</td>
            <td class="num">${row.credit ? pdfMoney(row.credit) : ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const queryError = glQ.error || jeQ.error

  return (
    <ReportShell
      title="General Ledger"
      description="Posted ledger lines by account for the selected period."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => { void glQ.refetch?.(); void jeQ.refetch?.() }}
      loading={glQ.loading || jeQ.loading}
      pdfBody={buildPdf}
      pdfFilename="general-ledger"
      pdfSubtitle={PERIOD_LABELS[period]}
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
      {queryError && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {queryError.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground mb-4">
        Showing posted GL activity for {PERIOD_LABELS[period]}.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Accounts" value={uniqueAccounts} />
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
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No ledger lines in this period.</td></tr>
            ) : filtered.slice(0, 100).map((row, i) => (
              <tr key={`${row.reference}-${row.account}-${i}`} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5">{row.date ? formatDate(row.date) : '—'}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{row.reference}</td>
                <td className="px-3 py-2.5 font-medium">{row.account}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{row.description || '—'}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{row.debit ? formatMoney(row.debit) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{row.credit ? formatMoney(row.credit) : <span className="text-muted-foreground">—</span>}</td>
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
