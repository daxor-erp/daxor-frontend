'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_LOAN_REPAYMENTS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { Banknote, CircleDollarSign, ArrowRight } from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'

export default function LoanApplicationPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { data, loading } = useQuery(GET_LOAN_REPAYMENTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const loans: any[] = data?.loanRepayments ?? []
  const totalOutstanding = loans.reduce((s, l) => s + Number(l.outstandingAmount ?? l.balance ?? 0), 0)
  const totalLoaned = loans.reduce((s, l) => s + Number(l.principalAmount ?? l.loanAmount ?? 0), 0)

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Employee Loan Application"
        description="Track loans extended to employees — principal, repayment schedule, outstanding balance."
        actions={
          <Link href="/payroll/others/loan-repayment" className="inline-flex items-center gap-1.5 rounded-lg bg-grad-brand text-white px-3 py-2 text-sm font-semibold hover:opacity-95">
            <Banknote className="h-4 w-4" /> Manage repayments
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Loan applications" value={formatNumber(loans.length)} icon={<Banknote className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total loaned" value={formatMoneyCompact(totalLoaned)} icon={<CircleDollarSign className="h-5 w-5" />} tone="sky" />
        <StatCard label="Outstanding" value={formatMoneyCompact(totalOutstanding)} icon={<CircleDollarSign className="h-5 w-5" />} tone="warn" />
      </div>

      <SectionCard title="Active loans" description={`${loans.length} record${loans.length === 1 ? '' : 's'}`} bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : loans.length === 0 ? (
          <div className="p-10 text-center">
            <Banknote className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No loan applications yet</p>
            <p className="text-xs text-muted-foreground mb-3">Loan applications are tracked alongside the repayment schedules in Payroll.</p>
            <Link href="/payroll/others/loan-repayment" className="inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90">
              Open loan repayment <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-3 py-3 font-medium">Employee</th>
                  <th className="px-3 py-3 font-medium text-right">Principal</th>
                  <th className="px-3 py-3 font-medium text-right">Outstanding</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.slice(0, 100).map((l: any) => (
                  <tr key={l.id ?? l._id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs">{l.docNumber ?? l.referenceNumber ?? l.id?.slice(-6)}</td>
                    <td className="px-3 py-3">{l.employeeName ?? l.employeeId ?? '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(Number(l.principalAmount ?? l.loanAmount ?? 0))}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-rose-600">{formatMoney(Number(l.outstandingAmount ?? l.balance ?? 0))}</td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        String(l.status).toUpperCase() === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200',
                      )}>{l.status ?? 'ACTIVE'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
