'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import {
  GET_RETURN_AUTHORIZATIONS,
  APPROVE_RETURN_AUTHORIZATION,
  REJECT_RETURN_AUTHORIZATION,
  CANCEL_RETURN_AUTHORIZATION,
} from '@/gql/queries'
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

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

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  const columns: Column[] = [
    {
      key: 'raNumber',
      label: 'RA #',
      width: '130px',
      render: (v) => <span className="font-mono text-xs text-gray-700">{v}</span>,
    },
    {
      key: 'customer',
      label: 'Bill-to',
      render: (_v, row) => (
        <span className="font-medium text-gray-800">{row.customer?.name || '—'}</span>
      ),
    },
    {
      key: 'requestedDate',
      label: 'Requested',
      width: '110px',
      render: (v) => (v ? formatDate(v) : '—'),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (v) => <span className="text-gray-600 text-xs">{v || '—'}</span>,
    },
    {
      key: 'lines',
      label: 'Lines',
      render: (_v, row) => (
        <span className="text-gray-500 text-xs line-clamp-2" title={linesSummary(row.lines)}>
          {linesSummary(row.lines)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (v) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
          {v}
        </span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approve Return Authorizations</h1>
        <p className="text-gray-500">Review pending RMA requests and approve or reject them</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending approval', value: stats.pending, icon: Clock, cls: 'text-amber-600 bg-amber-50' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, cls: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm"
          >
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        data={pending}
        columns={columns}
        loading={loading || approving}
        title="Return authorizations — pending"
        searchable
        searchPlaceholder="Search RA #, customer, reason…"
        emptyMessage="No pending return authorizations. Create new requests under Customers → Issue Return Authorizations."
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
            variant: 'ghost',
          },
          {
            label: 'Reject',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (row) => {
              const reason = window.prompt('Rejection reason (optional):') ?? ''
              if (reason === null) return
              rejectRa({ variables: { id: row.id, reason: reason || undefined } })
            },
            variant: 'ghost',
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (row) => {
              if (confirm(`Cancel ${row.raNumber}? This marks the request as cancelled.`)) {
                cancelRa({ variables: { id: row.id } })
              }
            },
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
