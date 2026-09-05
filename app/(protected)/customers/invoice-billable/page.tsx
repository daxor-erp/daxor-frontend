'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { GET_CUSTOMERS, UPDATE_CUSTOMER } from '@/gql/queries'
import { FileSpreadsheet, RefreshCw, Users, CheckCircle2, XCircle } from 'lucide-react'

export default function InvoiceBillableCustomersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [error, setError] = useState('')

  const { data, loading, refetch } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
    onError: (e) => setError(e.message),
    onCompleted: () => {
      setError('')
      void refetch()
    },
  })

  const customers = data?.customers ?? []

  const billableCount = useMemo(
    () => customers.filter((c: { invoiceBillable?: boolean }) => c.invoiceBillable !== false).length,
    [customers],
  )

  const toggleBillable = (id: string, next: boolean) => {
    updateCustomer({
      variables: { id, input: { invoiceBillable: next } },
    })
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc #', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Name', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span>,
    },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={v} /> },
    {
      key: 'invoiceBillable',
      label: 'Invoice billable',
      width: '140px',
      align: 'center',
      render: (_v, row) => {
        const on = row.invoiceBillable !== false
        return (
          <div className="inline-flex items-center justify-center gap-2 py-0.5">
            <Switch
              checked={on}
              disabled={updating}
              onCheckedChange={(v) => toggleBillable(row.id, v)}
              aria-label={`Invoice billable for ${row.name}`}
            />
            <span className="text-[10px] text-muted-foreground w-8">{on ? 'Yes' : 'No'}</span>
          </div>
        )
      },
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Invoice Billable Customers"
        subtitle="Control which registered customers appear in invoice billing workflows. Non-billable customers stay in the register but are excluded from billable selections."
        icon={<FileSpreadsheet className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Invoice Billable' }]}
        actions={
          <Button type="button" variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard
          label="Registered"
          value={customers.length}
          icon={<Users className="h-5 w-5" />}
          variant="slate"
        />
        <StatCard
          label="Invoice Billable"
          value={billableCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <StatCard
          label="Not Billable"
          value={customers.length - billableCount}
          icon={<XCircle className="h-5 w-5" />}
          variant="amber"
        />
      </StatsRow>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5">{error}</p>
      )}

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        title="All Customers"
        searchable
        searchPlaceholder="Search name, doc #, email…"
        emptyMessage="No customers found."
        pageSize={25}
      />
    </div>
  )
}
