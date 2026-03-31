'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { GET_GRNS } from '@/gql/queries'
import { PackageCheck, FileText, CheckCircle } from 'lucide-react'

export default function GRNPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading } = useQuery(GET_GRNS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const grns = data?.grns ?? []

  const columns: Column[] = [
    { key: 'grnNumber', label: 'GRN #', width: '150px', render: v => <span className="font-mono text-xs text-gray-600">{v}</span> },
    { key: 'vendorName', label: 'Vendor', render: v => <span className="font-medium">{v || '—'}</span> },
    { key: 'receivedDate', label: 'Received Date', width: '130px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: 'lineItems', label: 'Items', width: '100px',
      render: (v) => <span className="text-gray-600">{Array.isArray(v) ? `${v.length} item(s)` : '—'}</span>
    },
    { key: 'notes', label: 'Notes', render: v => <span className="text-gray-500 text-xs">{v || '—'}</span> },
    {
      key: 'status', label: 'Status', width: '110px',
      render: v => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${v === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{v}</span>
    },
    { key: 'createdAt', label: 'Created', width: '120px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goods Receipt Notes (GRN)</h1>
        <p className="text-gray-500">Auto-generated when a Purchase Order is marked as received</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total GRNs', value: grns.length, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Confirmed', value: grns.filter((g: any) => g.status === 'confirmed').length, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'This Month', value: grns.filter((g: any) => g.createdAt && new Date(g.createdAt).getMonth() === new Date().getMonth()).length, icon: PackageCheck, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <DataTable
        data={grns}
        columns={columns}
        loading={loading}
        title="All GRNs"
        searchable
        searchPlaceholder="Search GRNs..."
        emptyMessage="No GRNs yet. GRNs are auto-created when a PO is marked as Received."
      />
    </div>
  )
}
