'use client'

import { useQuery } from '@apollo/client'
import { GET_CUSTOMER_INVOICES } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { entityRefLabel } from '@/lib/format-status'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerDisplayName,
} from '@/lib/sales-customer-options'

export default function InvoiceSalesOrderPage() {
  const { user } = useAuth()
  const organizationId = user?.organizationId || ''

  const { data: invData, loading: invLoading } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !organizationId,
  })
  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId },
    skip: !organizationId,
  })
  const invoices = invData?.customerinvoices ?? []
  const customers = mapSalesCustomers(customersData?.customers)
  const getCustomerDisplay = (id: string) => customerDisplayName(customers, id)

  const stats = {
    invoices: invoices.length,
    draft: invoices.filter((i: any) => i.status === 'draft').length,
    paid: invoices.filter((i: any) => i.status === 'paid').length,
    overdue: invoices.filter((i: any) => i.status === 'overdue').length,
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Invoice #', width: '120px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'customerId',
      label: 'Customer',
      render: (_v, r: any) => (
        <span className="text-sm font-medium">{getCustomerDisplay(r.customerId || r.clientId)}</span>
      ),
    },
    {
      key: 'salesOrderId',
      label: 'Sales Order',
      width: '130px',
      render: (_v, r: any) => <MonoCell value={entityRefLabel(r.salesOrderSeqNo, r.salesOrderNumber)} />,
    },
    { key: 'invoiceDate', label: 'Invoice Date', width: '120px', render: (v) => <DateCell value={v} /> },
    { key: 'dueDate', label: 'Due Date', width: '120px', render: (v) => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Total', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'paidAmount', label: 'Paid', width: '120px', align: 'right', render: (v) => <AmountCell value={v ?? 0} /> },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Invoice Sales Order"
        subtitle="View generated sales invoices"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Invoice Sales Order' }]}
      />

      <StatsRow cols={4}>
        <StatCard label="Total Invoices" value={stats.invoices} icon={<FileText className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Paid" value={stats.paid} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Overdue" value={stats.overdue} icon={<AlertCircle className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={invoices}
        columns={columns}
        loading={invLoading}
        title="All Sales Invoices"
        searchable
        searchPlaceholder="Search invoices…"
        emptyMessage="No invoices generated yet."
        pageSize={25}
      />
    </div>
  )
}
