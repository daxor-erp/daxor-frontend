'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_LOAN_REPAYMENTS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { Banknote, CircleDollarSign } from 'lucide-react'

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

  const columns: Column[] = [
    {
      key: 'docNumber',
      label: 'Reference',
      width: '130px',
      render: (v, r) => <MonoCell value={v ?? r.referenceNumber ?? r.id?.slice(-6)} />,
    },
    {
      key: 'employeeName',
      label: 'Employee',
      render: (v, r) => <span className="text-sm font-medium">{v ?? r.employeeId ?? '—'}</span>,
    },
    {
      key: 'principalAmount',
      label: 'Principal',
      width: '120px',
      align: 'right',
      render: (v, r) => <AmountCell value={v ?? r.loanAmount ?? 0} />,
    },
    {
      key: 'outstandingAmount',
      label: 'Outstanding',
      width: '120px',
      align: 'right',
      render: (v, r) => <AmountCell value={v ?? r.balance ?? 0} />,
    },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <ErpBadge status={String(v ?? 'ACTIVE')} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Employee Loan Application"
        subtitle="Track loans extended to employees — principal, repayment schedule, outstanding balance."
        icon={<Banknote className="h-5 w-5" />}
        breadcrumbs={[{ label: 'HR' }, { label: 'Masters' }, { label: 'Loan Application' }]}
        actions={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/payroll/others/loan-repayment">
              <Banknote className="h-4 w-4 mr-1.5" /> Manage repayments
            </Link>
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Loan applications" value={loans.length} icon={<Banknote className="h-5 w-5" />} variant="blue" />
        <StatCard label="Total loaned" value={`₹${(totalLoaned / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="teal" />
        <StatCard label="Outstanding" value={`₹${(totalOutstanding / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      <DataTable
        data={loans}
        columns={columns}
        loading={loading}
        title="All Loans"
        searchable
        searchPlaceholder="Search loans…"
        emptyMessage="No loan applications yet. Manage repayments from Payroll."
        pageSize={25}
      />
    </div>
  )
}
