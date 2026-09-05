'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_TRIAL_BALANCE } from '@/gql/queries'
import { ReportShell, type ReportPeriod } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'

export default function TrialBalancePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')

  const { data, loading, refetch } = useQuery(GET_TRIAL_BALANCE, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const accounts = useMemo(() => {
    const rows: any[] = data?.trialBalance ?? []
    return rows
      .map((r) => ({
        account: `${r.accountCode} — ${r.accountName}`,
        accountCode: r.accountCode,
        accountType: r.accountType,
        debit: Number(r.debit) || 0,
        credit: Number(r.credit) || 0,
      }))
      .sort((a, b) => String(a.accountCode).localeCompare(String(b.accountCode)))
  }, [data])

  const totals = accounts.reduce(
    (s, a) => ({ debit: s.debit + a.debit, credit: s.credit + a.credit }),
    { debit: 0, credit: 0 },
  )
  const balanced = Math.abs(totals.debit - totals.credit) < 0.01

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${accounts.length}</strong> accounts</div>
      <div><strong>Debit total:</strong> ${pdfMoney(totals.debit)}</div>
      <div><strong>Credit total:</strong> ${pdfMoney(totals.credit)}</div>
      <div><span class="badge" style="${balanced ? '' : 'background:#fee2e2;color:#991b1b;border-color:#fecaca;'}">${balanced ? 'Balanced' : 'Out of balance'}</span></div>
    </div>
    <table>
      <thead><tr><th>Account</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Net</th></tr></thead>
      <tbody>
        ${accounts.map((a) => `
          <tr>
            <td>${escapeHtml(a.account)}</td>
            <td class="num">${pdfMoney(a.debit)}</td>
            <td class="num">${pdfMoney(a.credit)}</td>
            <td class="num">${pdfMoney(a.debit - a.credit)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="background:#f3f4f6;font-weight:700;">
          <td>Total</td>
          <td class="num">${pdfMoney(totals.debit)}</td>
          <td class="num">${pdfMoney(totals.credit)}</td>
          <td class="num">${pdfMoney(totals.debit - totals.credit)}</td>
        </tr>
      </tfoot>
    </table>
  `

  return (
    <ReportShell
      title="Trial Balance"
      description="Debit and credit totals per account."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="trial-balance"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className={
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase ' +
          (balanced
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200')
        }>
          <span className={'h-1.5 w-1.5 rounded-full ' + (balanced ? 'bg-emerald-500' : 'bg-rose-500')} />
          {balanced ? 'Balanced' : 'Out of balance'}
        </span>
        <span className="text-xs text-muted-foreground">{accounts.length} accounts</span>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="erp-table">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Account</th>
              <th className="px-3 py-2.5 font-medium text-right">Debit</th>
              <th className="px-3 py-2.5 font-medium text-right">Credit</th>
              <th className="px-4 py-2.5 font-medium text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground text-sm">No posted journal activity yet.</td></tr>
            ) : accounts.map((a) => (
              <tr key={a.account} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5 font-medium">{a.account}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{a.debit ? formatMoney(a.debit) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{a.credit ? formatMoney(a.credit) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatMoney(a.debit - a.credit)}</td>
              </tr>
            ))}
          </tbody>
          {accounts.length > 0 && (
            <tfoot>
              <tr className="border-t bg-secondary/60">
                <td className="px-4 py-2.5 font-bold">Total</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{formatMoney(totals.debit)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-bold">{formatMoney(totals.credit)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-bold">{formatMoney(totals.debit - totals.credit)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </ReportShell>
  )
}
