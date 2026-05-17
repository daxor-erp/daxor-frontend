'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function GanttChartPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || []

  const allTasks = plans.flatMap((plan: any) =>
    (plan.tasks || []).map((task: any) => ({
      ...task,
      planDocNumber: plan.docNumber,
      planId: plan.id,
    }))
  ).filter((task: any) => task.startDate && task.dueDate)

  const getDatePosition = (date: string, minDate: Date, maxDate: Date, width: number) => {
    const taskDate = new Date(date).getTime()
    const min = minDate.getTime()
    const max = maxDate.getTime()
    return ((taskDate - min) / (max - min)) * width
  }

  const getTaskWidth = (startDate: string, dueDate: string, minDate: Date, maxDate: Date, width: number) => {
    const start = new Date(startDate).getTime()
    const end = new Date(dueDate).getTime()
    const min = minDate.getTime()
    const max = maxDate.getTime()
    return ((end - start) / (max - min)) * width
  }

  const minDate = allTasks.length > 0 
    ? new Date(Math.min(...allTasks.map((t: any) => new Date(t.startDate).getTime())))
    : new Date()
  
  const maxDate = allTasks.length > 0
    ? new Date(Math.max(...allTasks.map((t: any) => new Date(t.dueDate).getTime())))
    : new Date()

  const timelineWidth = 800
  const monthsInRange = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

  const statusColor: Record<string, string> = {
    pending: '#FCD34D',
    'in-progress': '#60A5FA',
    completed: '#34D399',
    blocked: '#F87171',
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gantt Chart</h1>
        <p className="text-gray-500">Visual timeline of project tasks and milestones</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Task Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-xs text-gray-500">Loading...</p>
          ) : allTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No tasks with dates available</p>
              <p className="text-xs text-gray-400 mt-1">Add tasks with start and due dates to see the Gantt chart</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Timeline Header */}
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-48 font-semibold">Task</span>
                <div className="flex-1 flex justify-between" style={{ width: `${timelineWidth}px` }}>
                  <span>{minDate.toLocaleDateString()}</span>
                  <span>{maxDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {allTasks.map((task: any, idx: number) => {
                  const left = getDatePosition(task.startDate, minDate, maxDate, timelineWidth)
                  const width = getTaskWidth(task.startDate, task.dueDate, minDate, maxDate, timelineWidth)
                  
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-48 text-xs truncate" title={task.name}>
                        <div className="font-medium">{task.name}</div>
                        <div className="text-gray-400 text-[10px]">{task.planDocNumber}</div>
                      </div>
                      <div className="flex-1 relative h-8 bg-gray-100 rounded" style={{ width: `${timelineWidth}px` }}>
                        <div
                          className="absolute top-1 h-6 rounded flex items-center px-2 text-white text-[10px] font-medium"
                          style={{
                            left: `${left}px`,
                            width: `${Math.max(width, 40)}px`,
                            backgroundColor: statusColor[task.status] || '#94A3B8',
                          }}
                          title={`${task.name}\n${formatDate(task.startDate)} - ${formatDate(task.dueDate)}\nStatus: ${task.status}`}
                        >
                          <span className="truncate">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex gap-4 text-xs">
                <span className="font-semibold">Status:</span>
                {Object.entries(statusColor).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks', value: allTasks.length },
          { label: 'Pending', value: allTasks.filter((t: any) => t.status === 'pending').length },
          { label: 'In Progress', value: allTasks.filter((t: any) => t.status === 'in-progress').length },
          { label: 'Completed', value: allTasks.filter((t: any) => t.status === 'completed').length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
