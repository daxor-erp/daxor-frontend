'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { GET_PROJECTS } from '@/gql/queries'

export default function ProductionProjectMastersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const projects = data?.projects ?? []

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '120px', render: v => <span className="font-mono text-xs">{v || '—'}</span> },
    { key: 'name', label: 'Project Name', sortable: true },
    { key: 'description', label: 'Description', render: v => <span className="text-xs text-gray-500">{v || '—'}</span> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'endDate', label: 'End Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', width: '100px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${v === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Masters</h1>
        <p className="text-gray-500">Production project master data</p>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        title="All Projects"
        searchable
        searchPlaceholder="Search projects..."
        emptyMessage="No projects available."
      />
    </div>
  )
}
