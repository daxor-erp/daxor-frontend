'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
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
    { key: 'name', label: 'Resource Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'email', label: 'Email', render: v => <span className="text-xs text-gray-500">{v}</span> },
    { key: 'totalTasks', label: 'Total Tasks', width: '110px', render: v => <span className="font-semibold">{v}</span> },
    { key: 'inProgressTasks', label: 'In Progress', width: '110px', render: v => <span className="text-blue-600">{v}</span> },
    { key: 'completedTasks', label: 'Completed', width: '110px', render: v => <span className="text-green-600">{v}</span> },
    { key: 'utilization', label: 'Utilization', width: '110px', render: v => (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-medium">{v}%</span>
      </div>
    )},
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-gray-500">Manage and track resource allocation and utilization</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Resources', value: stats.totalResources, icon: Users, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active Resources', value: stats.activeResources, icon: Clock, cls: 'text-green-600 bg-green-50' },
          { label: 'Avg Utilization', value: `${stats.avgUtilization}%`, icon: CheckCircle, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <DataTable
        data={resourceData}
        columns={columns}
        loading={usersLoading || plansLoading}
        title="Resource Allocation"
        searchable
        searchPlaceholder="Search resources..."
        emptyMessage="No resources available."
      />
    </div>
  )
}
