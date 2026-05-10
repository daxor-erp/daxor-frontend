'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, TrendingUp, Activity } from 'lucide-react'

export default function PlantModulesDashboard() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || []
  const allMilestones = plans.flatMap((p: any) => p.milestones || [])

  const stats = {
    totalModules: plans.length,
    activeModules: plans.filter((p: any) => p.status === 'ACTIVE').length,
    completedMilestones: allMilestones.filter((m: any) => m.status === 'completed').length,
    totalMilestones: allMilestones.length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plant Modules Dashboard</h1>
        <p className="text-gray-500">Plant module production tracking and monitoring</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Modules', value: stats.totalModules, icon: Box, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active Modules', value: stats.activeModules, icon: Activity, cls: 'text-green-600 bg-green-50' },
          { label: 'Milestones', value: stats.totalMilestones, icon: TrendingUp, cls: 'text-purple-600 bg-purple-50' },
          { label: 'Completed', value: stats.completedMilestones, icon: TrendingUp, cls: 'text-orange-600 bg-orange-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Module Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plans.slice(0, 5).map((plan: any) => (
                <div key={plan.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono">{plan.docNumber}</span>
                    <span className="font-semibold">{plan.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${plan.progress || 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Milestone Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['pending', 'completed'].map((status) => {
                const count = allMilestones.filter((m: any) => m.status === status).length
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${stats.totalMilestones > 0 ? (count / stats.totalMilestones) * 100 : 0}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Module Details</CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-xs text-gray-500">No modules available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Module #</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Tasks</th>
                    <th className="text-left p-2">Milestones</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan: any) => (
                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{plan.docNumber}</td>
                      <td className="p-2">{new Date(plan.docDate).toLocaleDateString()}</td>
                      <td className="p-2">{plan.progress || 0}%</td>
                      <td className="p-2">{(plan.tasks || []).length}</td>
                      <td className="p-2">{(plan.milestones || []).length}</td>
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
