'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_RETURN_AUTHORIZATIONS,
  APPROVE_RETURN_AUTHORIZATION,
  REJECT_RETURN_AUTHORIZATION,
  CANCEL_RETURN_AUTHORIZATION,
} from '@/gql/queries'
import { CheckCircle, XCircle, Clock, Ban, RotateCcw } from 'lucide-react'

function linesSummary(lines: { description: string; quantity: number }[] | undefined) {
  if (!lines?.length) return '—'
  return lines
    .map((l) => `${l.description.slice(0, 40)}${l.description.length > 40 ? '…' : ''} × ${l.quantity}`)
    .join(' · ')
}

export default function ApproveReturnAuthorizationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading, refetch: refetchPending } = useQuery(GET_RETURN_AUTHORIZATIONS, {
    variables: { organizationId: orgId, status: 'pending', page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: allData, refetch: refetchAll } = useQuery(GET_RETURN_AUTHORIZATIONS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const refresh = () => {
    void refetchPending()
    void refetchAll()
  }

  const [approveRa, { loading: approving }] = useMutation(APPROVE_RETURN_AUTHORIZATION, {
    onCompleted: refresh,
  })

  const [rejectRa] = useMutation(REJECT_RETURN_AUTHORIZATION, {
    onCompleted: refresh,
  })

  const [cancelRa] = useMutation(CANCEL_RETURN_AUTHORIZATION, {
    onCompleted: refresh,
  })

  const pending = data?.returnAuthorizations ?? []
  const all = allData?.returnAuthorizations ?? []

  const stats = {
    pending: all.filter((r: { status: string }) => r.status === 'pending').length,
    approved: all.filter((r: { status: string }) => r.status === 'approved').length,
    rejected: all.filter((r: { status: string }) => r.status === 'rejected').length,
  }

  const columns: Column[] = [
    { key: 'raNumber', label: 'RA #', width: '130px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'customer',
      label: 'Bill-to',
      render: (_v, row) => (
        <span className="text-sm font-medium">{row.customer?.name || '—'}</span>
      ),
    },
    {
      key: 'requestedDate',
      label: 'Requested',
      width: '110px',
      render: (v) => <DateCell value={v} />,
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span>,
    },
    {
      key: 'lines',
      label: 'Lines',
      render: (_v, row) => (
        <span className="text-muted-foreground text-xs line-clamp-2" title={linesSummary(row.lines)}>
          {linesSummary(row.lines)}
        </span>
      ),
    },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Approve Return Authorizations"
        subtitle="Review pending RMA requests and approve or reject them"
        icon={<RotateCcw className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Approve Returns' }]}
      />

      <StatsRow cols={3}>
        <StatCard
          label="Pending Approval"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          variant="amber"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="green"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
          variant="rose"
        />
      </StatsRow>

      <DataTable
        data={pending}
        columns={columns}
        loading={loading || approving}
        title="All Pending Return Authorizations"
        searchable
        searchPlaceholder="Search RA #, customer, reason…"
        emptyMessage="No pending return authorizations. Create new requests under Customers → Issue Return Authorizations."
        pageSize={25}
        actions={[
          {
            label: 'Approve',
            icon: <CheckCircle className="h-3.5 w-3.5" />,
            onClick: (row) => {
              if (
                confirm(
                  `Approve return authorization ${row.raNumber} for ${row.customer?.name || 'customer'}?`,
                )
              ) {
                approveRa({ variables: { id: row.id } })
              }
            },
          },
          {
            label: 'Reject',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (row) => {
              const reason = window.prompt('Rejection reason (optional):') ?? ''
              if (reason === null) return
              rejectRa({ variables: { id: row.id, reason: reason || undefined } })
            },
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (row) => {
              if (confirm(`Cancel ${row.raNumber}? This marks the request as cancelled.`)) {
                cancelRa({ variables: { id: row.id } })
              }
            },
          },
        ]}
      />
    </div>
  )
}
