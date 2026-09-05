'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard } from '@/components/ui/erp-shared'
import { GET_USERS, GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Users, Clock, CheckCircle } from 'lucide-react'

export default function ResourcesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const { data: plansData, loading: plansLoading } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const users = usersData?.usersByOrganization?.users || []
  const plans = plansData?.productionplannings || []

  const allTasks = plans.flatMap((plan: any) => plan.tasks || [])

  const resourceData = users.map((u: any) => {
    const assignedTasks = allTasks.filter((t: any) => t.assignedTo === u.id)
    const completedTasks = assignedTasks.filter((t: any) => t.status === 'completed')
    const inProgressTasks = assignedTasks.filter((t: any) => t.status === 'in-progress')

    return {
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      totalTasks: assignedTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      utilization: assignedTasks.length > 0 ? Math.round((completedTasks.length / assignedTasks.length) * 100) : 0,
    }
  })

  const stats = {
    totalResources: users.length,
    activeResources: resourceData.filter((r: any) => r.totalTasks > 0).length,
    avgUtilization: resourceData.length > 0 ? Math.round(resourceData.reduce((sum: number, r: any) => sum + r.utilization, 0) / resourceData.length) : 0,
  }

  const columns: Column[] = [
    { key: 'name', label: 'Resource Name', sortable: true, render: v => <span className="text-sm font-medium">{v}</span> },
    { key: 'email', label: 'Email', render: v => <span className="text-sm text-muted-foreground">{v}</span> },
    { key: 'totalTasks', label: 'Total Tasks', width: '110px', render: v => <span className="font-semibold tabular-nums">{v}</span> },
    { key: 'inProgressTasks', label: 'In Progress', width: '110px', render: v => <span className="text-primary tabular-nums">{v}</span> },
    { key: 'completedTasks', label: 'Completed', width: '110px', render: v => <span className="text-emerald-600 tabular-nums">{v}</span> },
    { key: 'utilization', label: 'Utilization', width: '140px', render: v => (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-medium tabular-nums">{v}%</span>
      </div>
    )},
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Resources"
        subtitle="Manage and track resource allocation and utilization"
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Project Management' }, { label: 'Resources' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Total Resources" value={stats.totalResources} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active Resources" value={stats.activeResources} icon={<Clock className="h-5 w-5" />} variant="green" />
        <StatCard label="Avg Utilization" value={`${stats.avgUtilization}%`} icon={<CheckCircle className="h-5 w-5" />} variant="teal" />
      </StatsRow>

      <DataTable
        data={resourceData}
        columns={columns}
        loading={usersLoading || plansLoading}
        title="All Resources"
        searchable
        searchPlaceholder="Search resources…"
        emptyMessage="No resources available."
        pageSize={25}
      />
    </div>
  )
}
