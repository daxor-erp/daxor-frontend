'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_BALANCE_SHEET } from '@/gql/queries'
import { ReportShell, type ReportPeriod } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { pdfMoney } from '@/lib/pdf-download'
import { StatementLinesTable, type StatementLine } from '@/lib/financial-statement-lines'

export default function BalanceSheetPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')

  const { data, loading, error, refetch } = useQuery(GET_BALANCE_SHEET, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const report = data?.balanceSheet

  const buildPdf = () => {
    if (!report) return '<p>No data</p>'
    const block = (title: string, lines: StatementLine[], total: number) => `
      <div class="pdf-section">
        <div class="pdf-section-title">${title}</div>
        <table><tbody>
          ${lines.map((l) => `<tr><td>${l.accountCode} ${l.accountName}</td><td class="num">${pdfMoney(l.amount)}</td></tr>`).join('')}
          <tr style="background:#f3f4f6;font-weight:700;"><td>Total</td><td class="num">${pdfMoney(total)}</td></tr>
        </tbody></table>
      </div>`
    return `
      ${block('Assets', report.assetLines, report.totalAssets)}
      ${block('Liabilities', report.liabilityLines, report.totalLiabilities)}
      ${block('Equity', report.equityLines, report.totalEquity)}
      <div class="pdf-meta">
        <strong>Liabilities + equity:</strong> ${pdfMoney(report.totalLiabilitiesAndEquity)}
        · ${report.balanced ? 'Balanced' : 'Out of balance'}
      </div>
    `
  }

  return (
    <ReportShell
      title="Balance Sheet"
      description="Assets, liabilities, and equity from posted journals (trial balance)."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="balance-sheet"
    >
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error.message}
        </p>
      )}
      {!loading && !error && !report && (
        <p className="text-sm text-muted-foreground mb-4">No balance sheet data yet. Post journals to the ledger first.</p>
      )}
      {report && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase ' +
                (report.balanced
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200')
              }
            >
              {report.balanced ? 'Balanced' : 'Assets ≠ Liabilities + Equity'}
            </span>
            <span className="text-xs text-muted-foreground">
              Assets {formatMoney(report.totalAssets)} · L+E {formatMoney(report.totalLiabilitiesAndEquity)}
            </span>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex justify-between">
                <span>Assets</span>
                <span className="tabular-nums">{formatMoney(report.totalAssets)}</span>
              </h3>
              <StatementLinesTable lines={report.assetLines} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 flex justify-between">
                <span>Liabilities</span>
                <span className="tabular-nums">{formatMoney(report.totalLiabilities)}</span>
              </h3>
              <StatementLinesTable lines={report.liabilityLines} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 flex justify-between">
                <span>Equity</span>
                <span className="tabular-nums">{formatMoney(report.totalEquity)}</span>
              </h3>
              <StatementLinesTable lines={report.equityLines} emptyLabel="No equity accounts" />
            </div>
          </div>
        </>
      )}
    </ReportShell>
  )
}
