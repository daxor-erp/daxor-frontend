'use client'

import { useQuery } from '@apollo/client'
import { GET_VENDOR_PAYMENTS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { CreditCard, CheckCircle2, Clock } from 'lucide-react'

export default function VendorPaymentsPage() {
  const { user } = useAuth()

  const { data, loading } = useQuery(GET_VENDOR_PAYMENTS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const items: any[] = data?.vendorpayments || []
  const active = items.filter((i) => String(i.status || 'Active').toLowerCase() === 'active').length
  const draft = items.filter((i) => String(i.status || '').toLowerCase() === 'draft').length

  const columns: Column[] = [
    {
      key: 'docNumber',
      label: 'Document #',
      width: '140px',
      render: (v, r) => <MonoCell value={v || r.transactionNumber || r.warehouseCode || '—'} />,
    },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v || 'Active')} /> },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Vendor Payments"
        subtitle="Manage vendor payments"
        icon={<CreditCard className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Vendor Payments' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Total Records" value={items.length} icon={<CreditCard className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Draft" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Vendor Payments"
        searchable
        searchPlaceholder="Search payments…"
        emptyMessage="No vendor payments found."
        pageSize={25}
      />
    </div>
  )
}
