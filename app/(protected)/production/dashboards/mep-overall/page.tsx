'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS, GET_WORK_ORDERS } from '@/gql/queries'
import { SectionCard } from '@/components/dashboard/section-card'
import { Factory, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

const ACCENT = '#378ADD'
const ACCENT_SOFT = 'rgba(55, 138, 221, 0.12)'

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

  const plans = plansData?.productionplannings || plansData?.productionPlannings || []
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

  const kpis = [
    { label: 'Total Plans', value: stats.totalPlans, icon: Factory },
    { label: 'Active Plans', value: stats.activePlans, icon: Clock },
    { label: 'Work Orders', value: stats.totalWorkOrders, icon: CheckCircle },
    { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp },
  ]

  return (
    <div className="erp-shell bg-white">
      <div>
        <h1 className="erp-page-title">MEP Overall Dashboard</h1>
        <p className="erp-page-desc">Mechanical, Electrical & Plumbing production overview</p>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard className="border-slate-200 bg-white" title="Budget vs Actual Cost">
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>Budget</span>
                <span className="font-semibold">{formatMoney(stats.totalBudget)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100">
                <div className="h-3 rounded-full" style={{ width: '100%', backgroundColor: ACCENT }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>Actual Cost</span>
                <span className="font-semibold">{formatMoney(stats.totalCost)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${stats.totalCost > stats.totalBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${stats.totalBudget > 0 ? Math.min((stats.totalCost / stats.totalBudget) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-xs text-slate-500">Variance</span>
              <span className={`text-sm font-bold ${stats.totalCost > stats.totalBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
                {stats.totalBudget > 0 ? `${(((stats.totalCost - stats.totalBudget) / stats.totalBudget) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="border-slate-200 bg-white" title="Production Status">
          <div className="space-y-3">
            {[
              { label: 'Draft', value: plans.filter((p: any) => p.status === 'DRAFT').length, color: '#94A3B8' },
              { label: 'Active', value: plans.filter((p: any) => p.status === 'ACTIVE').length, color: ACCENT },
              { label: 'Completed', value: plans.filter((p: any) => p.status === 'COMPLETED').length, color: '#2F9E6A' },
              { label: 'Cancelled', value: plans.filter((p: any) => p.status === 'CANCELLED').length, color: '#E11D48' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${stats.totalPlans > 0 ? (value / stats.totalPlans) * 100 : 0}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="border-slate-200 bg-white" title="Recent Production Plans" bodyClassName="p-0">
        {plans.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">No production plans available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Doc #</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Progress</th>
                  <th className="px-3 py-3 font-medium">Budget</th>
                  <th className="px-3 py-3 font-medium">Actual</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.slice(0, 5).map((plan: any) => (
                  <tr key={plan.id} className="border-b last:border-0 hover:bg-[#378ADD]/5">
                    <td className="px-4 py-3 font-mono text-xs">{plan.docNumber}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatDate(plan.docDate)}</td>
                    <td className="px-3 py-3 text-xs">{plan.progress || 0}%</td>
                    <td className="px-3 py-3 text-xs">{formatMoney(plan.budget || 0)}</td>
                    <td className="px-3 py-3 text-xs">{formatMoney(plan.actualCost || 0)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                        style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
                      >
                        {plan.status}
                      </span>
                    </td>
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
