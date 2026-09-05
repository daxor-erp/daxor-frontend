'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { GET_PROJECTS } from '@/gql/queries'
import { FolderKanban, CheckCircle2 } from 'lucide-react'

export default function ProductionProjectMastersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const projects = data?.projects ?? []
  const active = projects.filter((p: any) => p.status === 'active').length

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '120px', render: v => <MonoCell value={v || '—'} /> },
    { key: 'name', label: 'Project Name', sortable: true, render: v => <span className="text-sm font-medium">{v}</span> },
    { key: 'description', label: 'Description', render: v => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'endDate', label: 'End Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '100px', render: v => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Project Masters"
        subtitle="Production project master data"
        icon={<FolderKanban className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'Masters' }, { label: 'Project Masters' }]}
      />

      <StatsRow cols={2}>
        <StatCard label="Total Projects" value={projects.length} icon={<FolderKanban className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        title="All Projects"
        searchable
        searchPlaceholder="Search projects…"
        emptyMessage="No projects available."
        pageSize={25}
      />
    </div>
  )
}
