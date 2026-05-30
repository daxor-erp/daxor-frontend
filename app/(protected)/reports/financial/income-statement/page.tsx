'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_INCOME_STATEMENT } from '@/gql/queries'
import { ReportShell, type ReportPeriod } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { pdfMoney } from '@/lib/pdf-download'
import { StatementLinesTable, type StatementLine } from '@/lib/financial-statement-lines'

export default function IncomeStatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')

  const { data, loading, error, refetch } = useQuery(GET_INCOME_STATEMENT, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const report = data?.incomeStatement

  const buildPdf = () => {
    if (!report) return '<p>No data</p>'
    const section = (title: string, lines: StatementLine[], total: number) => `
      <div class="pdf-section">
        <div class="pdf-section-title">${title}</div>
        <table><tbody>
          ${lines.map((l) => `<tr><td>${l.accountCode} ${l.accountName}</td><td class="num">${pdfMoney(l.amount)}</td></tr>`).join('')}
          <tr style="background:#f3f4f6;font-weight:700;"><td>Total</td><td class="num">${pdfMoney(total)}</td></tr>
        </tbody></table>
      </div>`
    return `
      ${section('Revenue', report.revenueLines, report.totalRevenue)}
      ${section('Cost of goods sold', report.cogsLines, report.totalCogs)}
      <div class="pdf-meta"><strong>Gross profit:</strong> ${pdfMoney(report.grossProfit)}</div>
      ${section('Operating expenses', report.expenseLines, report.totalOperatingExpense)}
      <div class="pdf-meta"><strong>Net income:</strong> ${pdfMoney(report.netIncome)}</div>
    `
  }

  return (
    <ReportShell
      title="Income Statement"
      description="Profit & loss from posted journal entries (trial balance by account type)."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => refetch?.()}
      loading={loading}
      pdfBody={buildPdf}
      pdfFilename="income-statement"
    >
      <p className="text-xs text-muted-foreground mb-4">
        Derived from the trial balance (all posted journals) — revenue, COGS, and expense accounts only.
        Period filter applies to display only until date-scoped TB is added.
      </p>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error.message}
        </p>
      )}
      {!loading && !error && !report && (
        <p className="text-sm text-muted-foreground">No income statement data yet. Post journals to the ledger first.</p>
      )}
      {report && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Section title="Revenue" total={report.totalRevenue}>
            <StatementLinesTable lines={report.revenueLines} />
          </Section>
          <Section title="Cost of goods sold" total={report.totalCogs}>
            <StatementLinesTable lines={report.cogsLines} emptyLabel="No COGS accounts" />
            <p className="text-sm font-semibold mt-3 pt-3 border-t">
              Gross profit: {formatMoney(report.grossProfit)}
            </p>
          </Section>
          <Section title="Operating expenses" total={report.totalOperatingExpense}>
            <StatementLinesTable lines={report.expenseLines} />
            <p className="text-sm font-bold mt-3 pt-3 border-t text-emerald-700">
              Net income: {formatMoney(report.netIncome)}
            </p>
          </Section>
        </div>
      )}
    </ReportShell>
  )
}

function Section({
  title,
  total,
  children,
}: {
  title: string
  total: number
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-sm font-bold tabular-nums">{formatMoney(total)}</span>
      </div>
      {children}
    </div>
  )
}
