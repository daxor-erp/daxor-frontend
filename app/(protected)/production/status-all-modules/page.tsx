'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

export default function StatusAllModulesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700'
      case 'ACTIVE': return 'bg-green-100 text-green-700'
      case 'COMPLETED': return 'bg-blue-100 text-blue-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const stats = {
    total: plans.length,
    draft: plans.filter((p: any) => p.status === 'DRAFT').length,
    active: plans.filter((p: any) => p.status === 'ACTIVE').length,
    completed: plans.filter((p: any) => p.status === 'COMPLETED').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Status All Modules</h1>
        <p className="text-gray-500">Overview of all production module statuses</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Modules', value: stats.total, icon: Activity, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, cls: 'text-gray-600 bg-gray-50' },
          { label: 'Active', value: stats.active, icon: AlertCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, cls: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {plans.map((plan: any) => (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">{plan.docNumber}</CardTitle>
                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(plan.status)}`}>{plan.status}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{plan.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getProgressColor(plan.progress || 0)}`} style={{ width: `${plan.progress || 0}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-semibold">{formatDate(plan.docDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Tasks</p>
                    <p className="font-semibold">{(plan.tasks || []).length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Milestones</p>
                    <p className="font-semibold">{(plan.milestones || []).length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Budget</p>
                    <p className="font-semibold">{formatMoney(plan.budget || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && <p className="text-center text-gray-500">Loading modules...</p>}
      {!loading && plans.length === 0 && <p className="text-center text-gray-500">No modules available</p>}
    </div>
  )
}
