'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function ModuleTimeTrackingPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || []

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">Module Wise Time Tracking</h1>
        <p className="erp-page-desc">Track time spent on production modules</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Modules', value: plans.length, icon: Clock },
          { label: 'Active Tracking', value: plans.filter((p: any) => p.status === 'ACTIVE').length, icon: TrendingUp },
          { label: 'Completed', value: plans.filter((p: any) => p.status === 'COMPLETED').length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className="p-2 rounded-md bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Time Tracking by Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Module #</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Tasks</th>
                  <th className="text-left p-2">Progress</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan: any) => (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{plan.docNumber}</td>
                    <td className="p-2">{formatDate(plan.docDate)}</td>
                    <td className="p-2">{(plan.tasks || []).length}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${plan.progress || 0}%` }} />
                        </div>
                        <span>{plan.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-2"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{plan.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
