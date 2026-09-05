'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS, GET_WORK_ORDERS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Factory, TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

export default function MEPOverallDashboard() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: plansData } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: workOrdersData } = useQuery(GET_WORK_ORDERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = plansData?.productionplannings || []
  const workOrders = workOrdersData?.workorders || []

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter((p: any) => p.status === 'ACTIVE').length,
    totalWorkOrders: workOrders.length,
    completedWorkOrders: workOrders.filter((w: any) => w.status === 'COMPLETED').length,
    totalBudget: plans.reduce((sum: number, p: any) => sum + (p.budget || 0), 0),
    totalCost: plans.reduce((sum: number, p: any) => sum + (p.actualCost || 0), 0),
    avgProgress: plans.length > 0 ? Math.round(plans.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / plans.length) : 0,
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">MEP Overall Dashboard</h1>
        <p className="erp-page-desc">Mechanical, Electrical & Plumbing production overview</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Plans', value: stats.totalPlans, icon: Factory, cls: 'text-primary bg-primary/10' },
          { label: 'Active Plans', value: stats.activePlans, icon: Clock, cls: 'text-green-600 bg-green-50' },
          { label: 'Work Orders', value: stats.totalWorkOrders, icon: CheckCircle, cls: 'text-purple-600 bg-purple-50' },
          { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, cls: 'text-orange-600 bg-orange-50' },
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
            <CardTitle className="text-sm">Budget vs Actual Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Budget</span>
                  <span className="font-semibold">{formatMoney(stats.totalBudget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary/100 h-3 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Actual Cost</span>
                  <span className="font-semibold">{formatMoney(stats.totalCost)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full ${stats.totalCost > stats.totalBudget ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${stats.totalBudget > 0 ? Math.min((stats.totalCost / stats.totalBudget) * 100, 100) : 0}%` }} />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Variance</span>
                  <span className={`text-sm font-bold ${stats.totalCost > stats.totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.totalBudget > 0 ? `${((stats.totalCost - stats.totalBudget) / stats.totalBudget * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Production Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Draft', value: plans.filter((p: any) => p.status === 'DRAFT').length, color: 'bg-gray-500' },
                { label: 'Active', value: plans.filter((p: any) => p.status === 'ACTIVE').length, color: 'bg-green-500' },
                { label: 'Completed', value: plans.filter((p: any) => p.status === 'COMPLETED').length, color: 'bg-primary/100' },
                { label: 'Cancelled', value: plans.filter((p: any) => p.status === 'CANCELLED').length, color: 'bg-red-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${stats.totalPlans > 0 ? (value / stats.totalPlans) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Production Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-xs text-gray-500">No production plans available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Doc #</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Budget</th>
                    <th className="text-left p-2">Actual</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.slice(0, 5).map((plan: any) => (
                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{plan.docNumber}</td>
                      <td className="p-2">{formatDate(plan.docDate)}</td>
                      <td className="p-2">{plan.progress || 0}%</td>
                      <td className="p-2">{formatMoney(plan.budget || 0)}</td>
                      <td className="p-2">{formatMoney(plan.actualCost || 0)}</td>
                      <td className="p-2"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{plan.status}</span></td>
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
