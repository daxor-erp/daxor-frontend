'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wrench, Users, Clock, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function WorkshopDashboard() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || []
  const allTasks = plans.flatMap((p: any) => p.tasks || [])

  const stats = {
    totalTasks: allTasks.length,
    inProgress: allTasks.filter((t: any) => t.status === 'in-progress').length,
    completed: allTasks.filter((t: any) => t.status === 'completed').length,
    blocked: allTasks.filter((t: any) => t.status === 'blocked').length,
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">Workshop Dashboard</h1>
        <p className="erp-page-desc">Workshop operations and task tracking</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks', value: stats.totalTasks, icon: Wrench, cls: 'text-primary bg-primary/10' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, cls: 'text-orange-600 bg-orange-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Blocked', value: stats.blocked, icon: Users, cls: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Task Distribution by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['critical', 'high', 'medium', 'low'].map((priority) => {
              const count = allTasks.filter((t: any) => t.priority === priority).length
              return (
                <div key={priority}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{priority}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${priority === 'critical' ? 'bg-red-500' : priority === 'high' ? 'bg-orange-500' : priority === 'medium' ? 'bg-primary/100' : 'bg-gray-400'}`} style={{ width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Workshop Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {allTasks.length === 0 ? (
            <p className="text-xs text-gray-500">No tasks available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Task</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allTasks.slice(0, 10).map((task: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{task.name}</td>
                      <td className="p-2"><span className={`px-2 py-0.5 rounded ${task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'in-progress' ? 'bg-primary/10 text-primary' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span></td>
                      <td className="p-2"><span className="capitalize">{task.priority}</span></td>
                      <td className="p-2">{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
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
