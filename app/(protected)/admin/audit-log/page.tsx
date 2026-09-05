'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_AUDIT_LOGS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Activity, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function AuditLogPage() {
  const [page, setPage] = useState(1)
  const limit = 50
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')

  const { data, loading } = useQuery(GET_AUDIT_LOGS, {
    variables: { page, limit, entityType: entityType || null, action: action || null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const result = data?.auditLogs ?? { data: [], total: 0, page: 1, pages: 0 }
  const rows: any[] = result.data ?? []

  const stats = useMemo(() => {
    const creates = rows.filter((r) => r.action === 'CREATE').length
    const updates = rows.filter((r) => r.action === 'UPDATE').length
    const deletes = rows.filter((r) => r.action === 'DELETE').length
    return { total: result.total ?? rows.length, creates, updates, deletes }
  }, [rows, result.total])

  const columns: Column[] = [
    {
      key: 'createdAt',
      label: 'When',
      width: '160px',
      render: (v) => (v ? <span className="text-sm text-muted-foreground whitespace-nowrap">{new Date(v).toLocaleString()}</span> : '—'),
    },
    {
      key: 'userId',
      label: 'User',
      width: '90px',
      render: (v) => <MonoCell value={v ? String(v).slice(-6) : '—'} />,
    },
    { key: 'action', label: 'Action', width: '100px', render: (v) => <ErpBadge status={String(v)} /> },
    { key: 'entityType', label: 'Entity', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    {
      key: 'entityId',
      label: 'Entity ID',
      width: '110px',
      render: (v) => <MonoCell value={v ? String(v).slice(-8) : '—'} />,
    },
    {
      key: 'ipAddress',
      label: 'IP',
      render: (v, r) => (
        <span className="text-xs text-muted-foreground truncate max-w-[12rem] block" title={r.userAgent || ''}>
          {v || '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Audit Log"
        subtitle="Every create / update / delete tracked across the platform."
        icon={<Activity className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Log' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={entityType}
              onChange={(e) => { setEntityType(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-card py-2 px-2 text-xs focus:ring-2 focus:ring-primary/40"
            >
              <option value="">All entities</option>
              {['User', 'Organization', 'CustomerInvoice', 'PurchaseOrder', 'SalesOrder', 'Vendor', 'Customer', 'Item', 'Quotation'].map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <select
              value={action}
              onChange={(e) => { setAction(e.target.value); setPage(1) }}
              className="rounded-lg border border-border bg-card py-2 px-2 text-xs focus:ring-2 focus:ring-primary/40"
            >
              <option value="">All actions</option>
              {['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (result.pages ?? 0) || loading}
              className="gap-1"
            >
              Next <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total entries" value={stats.total} icon={<Activity className="h-5 w-5" />} variant="slate" />
        <StatCard label="Creates (page)" value={stats.creates} icon={<ShieldAlert className="h-5 w-5" />} variant="green" />
        <StatCard label="Updates (page)" value={stats.updates} icon={<ShieldAlert className="h-5 w-5" />} variant="blue" />
        <StatCard label="Deletes (page)" value={stats.deletes} icon={<ShieldAlert className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        title="All Audit Entries"
        description={`Page ${result.page ?? page} of ${result.pages ?? 0}`}
        searchable
        searchPlaceholder="Search action / entity / user…"
        emptyMessage="No audit entries. As users perform actions, they'll appear here."
        pageSize={50}
      />
    </div>
  )
}
