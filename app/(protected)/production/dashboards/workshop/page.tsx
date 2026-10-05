'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { SectionCard } from '@/components/dashboard/section-card'
import { Wrench, Users, Clock, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const ACCENT = '#378ADD'
const ACCENT_SOFT = 'rgba(55, 138, 221, 0.12)'

export default function WorkshopDashboard() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || data?.productionPlannings || []
  const allTasks = plans.flatMap((p: any) => p.tasks || [])

  const stats = {
    totalTasks: allTasks.length,
    inProgress: allTasks.filter((t: any) => t.status === 'in-progress').length,
    completed: allTasks.filter((t: any) => t.status === 'completed').length,
    blocked: allTasks.filter((t: any) => t.status === 'blocked').length,
  }

  const kpis = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: Wrench },
    { label: 'In Progress', value: stats.inProgress, icon: Clock },
    { label: 'Completed', value: stats.completed, icon: CheckCircle },
    { label: 'Blocked', value: stats.blocked, icon: Users },
  ]

  return (
    <div className="erp-shell bg-white">
      <div>
        <h1 className="erp-page-title">Workshop Dashboard</h1>
        <p className="erp-page-desc">Workshop operations and task tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="rounded-md p-2" style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-lg font-bold text-slate-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionCard className="border-slate-200 bg-white" title="Task Distribution by Priority">
        <div className="space-y-3">
          {['critical', 'high', 'medium', 'low'].map((priority) => {
            const count = allTasks.filter((t: any) => t.priority === priority).length
            const color =
              priority === 'critical' ? '#E11D48' : priority === 'high' ? '#F59E0B' : priority === 'medium' ? ACCENT : '#94A3B8'
            return (
              <div key={priority}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="capitalize">{priority}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard className="border-slate-200 bg-white" title="Active Workshop Tasks" bodyClassName="p-0">
        {allTasks.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">No tasks available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {allTasks.slice(0, 10).map((task: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-[#378ADD]/5">
                    <td className="px-4 py-3 text-xs">{task.name}</td>
                    <td className="px-3 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={
                          task.status === 'completed'
                            ? { backgroundColor: 'rgba(47,158,106,0.12)', color: '#2F9E6A' }
                            : task.status === 'in-progress'
                              ? { backgroundColor: ACCENT_SOFT, color: ACCENT }
                              : { backgroundColor: 'rgba(245,158,11,0.12)', color: '#B45309' }
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs capitalize">{task.priority}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
