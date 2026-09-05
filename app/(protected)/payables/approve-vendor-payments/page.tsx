'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { GET_VENDOR_BILLS, APPROVE_VENDOR_BILL, DELETE_VENDOR_BILL } from '@/gql/queries'
import { CheckCircle, XCircle, Clock, FileText, CheckCheck } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

export default function ApproveVendorPaymentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading, refetch } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, status: 'draft', page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: allData } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [approveBill] = useMutation(APPROVE_VENDOR_BILL, {
    onCompleted: () => refetch(),
  })

  const [deleteBill] = useMutation(DELETE_VENDOR_BILL, {
    onCompleted: () => refetch(),
  })

  const draftBills = data?.vendorBills ?? []
  const allBills = allData?.vendorBills ?? []

  const stats = {
    pending: allBills.filter((b: any) => b.status === 'draft').length,
    approved: allBills.filter((b: any) => b.status === 'approved').length,
    totalPendingValue: allBills
      .filter((b: any) => b.status === 'draft')
      .reduce((s: number, b: any) => s + (b.totalAmount || 0), 0),
  }

  const columns: Column[] = [
    { key: 'billNumber', label: 'Bill #', width: '140px', render: v => <MonoCell value={v} /> },
    {
      key: 'vendor',
      label: 'Vendor',
      render: (_v, row) => <span className="text-sm font-medium">{row.vendor?.name || '—'}</span>,
    },
    { key: 'billDate', label: 'Bill Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    {
      key: 'notes',
      label: 'Notes',
      render: v => <span className="text-xs text-muted-foreground">{v || '—'}</span>,
    },
    { key: 'status', label: 'Status', width: '110px', render: v => <ErpBadge status={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Approve Vendor Bills"
        subtitle="Review and approve draft bills before payment"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Approve Vendor Payments' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Pending Approval" value={stats.pending} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
        <StatCard label="Pending Value" value={`₹${(stats.totalPendingValue / 1000).toFixed(1)}k`} icon={<FileText className="h-5 w-5" />} variant="blue" />
      </StatsRow>

      <DataTable
        data={draftBills}
        columns={columns}
        loading={loading}
        title="All Bills Pending Approval"
        searchable
        searchPlaceholder="Search bills…"
        emptyMessage="No bills pending approval. All bills are approved or there are no bills yet."
        pageSize={25}
        actions={[
          {
            label: 'Approve',
            icon: <CheckCheck className="h-3.5 w-3.5" />,
            onClick: (row: any) => {
              if (confirm(`Approve bill ${row.billNumber} for ${formatMoney(row.totalAmount)}?`)) {
                approveBill({ variables: { id: row.id } })
              }
            },
            show: (row: any) => row.status === 'draft',
          },
          {
            label: 'Reject',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (row: any) => {
              if (confirm(`Reject and delete bill ${row.billNumber}?`)) {
                deleteBill({ variables: { id: row.id } })
              }
            },
            show: (row: any) => row.status === 'draft',
          },
        ]}
      />
    </div>
  )
}
