'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { GET_VENDOR_BILLS, APPROVE_VENDOR_BILL, DELETE_VENDOR_BILL } from '@/gql/queries'
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

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

  const [approveBill, { loading: approving }] = useMutation(APPROVE_VENDOR_BILL, {
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

  const statusColor: Record<string, string> = {
    draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
  }

  const columns: Column[] = [
    {
      key: 'billNumber', label: 'Bill #', width: '140px',
      render: v => <span className="font-mono text-xs text-gray-600">{v}</span>
    },
    {
      key: 'vendor', label: 'Vendor',
      render: (_v, row) => <span className="font-medium">{row.vendor?.name || '—'}</span>
    },
    {
      key: 'billDate', label: 'Bill Date', width: '110px',
      render: v => v ? formatDate(v) : '—'
    },
    {
      key: 'dueDate', label: 'Due Date', width: '110px',
      render: v => v ? formatDate(v) : '—'
    },
    {
      key: 'totalAmount', label: 'Amount', width: '120px', align: 'right',
      render: v => <span className="font-bold text-gray-800">{formatMoney(v || 0)}</span>
    },
    {
      key: 'notes', label: 'Notes',
      render: v => <span className="text-gray-500 text-xs">{v || '—'}</span>
    },
    {
      key: 'status', label: 'Status', width: '110px',
      render: v => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {v}
        </span>
      )
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approve Vendor Bills</h1>
        <p className="text-gray-500">Review and approve draft bills before payment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending Approval', value: stats.pending, icon: Clock, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Pending Value', value: `${formatMoney(stats.totalPendingValue)}`, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <DataTable
        data={draftBills}
        columns={columns}
        loading={loading}
        title="Bills Pending Approval"
        searchable
        searchPlaceholder="Search bills..."
        emptyMessage="No bills pending approval. All bills are approved or there are no bills yet."
        actions={[
          {
            label: 'Approve',
            icon: <CheckCircle className="h-3.5 w-3.5" />,
            onClick: row => {
              if (confirm(`Approve bill ${row.billNumber} for ${formatMoney(row.totalAmount)}?`)) {
                approveBill({ variables: { id: row.id } })
              }
            },
            variant: 'ghost',
          },
          {
            label: 'Reject',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: row => {
              if (confirm(`Reject and delete bill ${row.billNumber}?`)) {
                deleteBill({ variables: { id: row.id } })
              }
            },
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
