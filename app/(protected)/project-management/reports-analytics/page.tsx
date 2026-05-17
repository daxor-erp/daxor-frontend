'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS, GET_PROJECTS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function ReportsAnalyticsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: plansData, loading: plansLoading } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const plans = plansData?.productionplannings || []
  const projects = projectsData?.projects || []

  const allTasks = plans.flatMap((p: any) => p.tasks || [])
  const allMilestones = plans.flatMap((p: any) => p.milestones || [])

  const totalBudget = plans.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
  const totalActualCost = plans.reduce((sum: number, p: any) => sum + (p.actualCost || 0), 0)
  const avgProgress = plans.length > 0 ? Math.round(plans.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / plans.length) : 0

  const taskStats = {
    total: allTasks.length,
    completed: allTasks.filter((t: any) => t.status === 'completed').length,
    inProgress: allTasks.filter((t: any) => t.status === 'in-progress').length,
    pending: allTasks.filter((t: any) => t.status === 'pending').length,
    blocked: allTasks.filter((t: any) => t.status === 'blocked').length,
  }

  const milestoneStats = {
    total: allMilestones.length,
    completed: allMilestones.filter((m: any) => m.status === 'completed').length,
    pending: allMilestones.filter((m: any) => m.status === 'pending').length,
  }

  const projectStats = {
    total: projects.length,
    active: projects.filter((p: any) => p.status === 'active').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    inactive: projects.filter((p: any) => p.status === 'inactive').length,
  }

  const budgetVariance = totalBudget > 0 ? Math.round(((totalActualCost - totalBudget) / totalBudget) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500">Project performance insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Actual Cost', value: `$${totalActualCost.toLocaleString()}`, icon: TrendingUp, cls: 'text-green-600 bg-green-50' },
          { label: 'Budget Variance', value: `${budgetVariance > 0 ? '+' : ''}${budgetVariance}%`, icon: BarChart3, cls: budgetVariance > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: CheckCircle, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Active', value: projectStats.active, total: projectStats.total, color: 'bg-green-500' },
                { label: 'Completed', value: projectStats.completed, total: projectStats.total, color: 'bg-blue-500' },
                { label: 'Inactive', value: projectStats.inactive, total: projectStats.total, color: 'bg-gray-400' },
              ].map(({ label, value, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{value} / {total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Completed', value: taskStats.completed, total: taskStats.total, color: 'bg-green-500' },
                { label: 'In Progress', value: taskStats.inProgress, total: taskStats.total, color: 'bg-blue-500' },
                { label: 'Pending', value: taskStats.pending, total: taskStats.total, color: 'bg-yellow-500' },
                { label: 'Blocked', value: taskStats.blocked, total: taskStats.total, color: 'bg-red-500' },
              ].map(({ label, value, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{value} / {total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestone Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Milestone Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Completed', value: milestoneStats.completed, total: milestoneStats.total, color: 'bg-green-500' },
                { label: 'Pending', value: milestoneStats.pending, total: milestoneStats.total, color: 'bg-yellow-500' },
              ].map(({ label, value, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{value} / {total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Production Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Production Plans Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Plans</span>
                <span className="text-2xl font-bold">{plans.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Tasks</span>
                <span className="text-2xl font-bold">{taskStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Milestones</span>
                <span className="text-2xl font-bold">{milestoneStats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Production Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {plansLoading ? (
            <p className="text-xs text-gray-500">Loading...</p>
          ) : plans.length === 0 ? (
            <p className="text-xs text-gray-500">No plans available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Doc #</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Budget</th>
                    <th className="text-left p-2">Actual Cost</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.slice(0, 5).map((plan: any) => (
                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{plan.docNumber}</td>
                      <td className="p-2">{formatDate(plan.docDate)}</td>
                      <td className="p-2">{plan.progress || 0}%</td>
                      <td className="p-2">${(plan.budget || 0).toLocaleString()}</td>
                      <td className="p-2">${(plan.actualCost || 0).toLocaleString()}</td>
                      <td className="p-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{plan.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
