'use client'

import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCTION_PLANNINGS } from '@/gql/queries'
import { SectionCard } from '@/components/dashboard/section-card'
import { Box, TrendingUp, Activity } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const ACCENT = '#378ADD'
const ACCENT_SOFT = 'rgba(55, 138, 221, 0.12)'

export default function PlantModulesDashboard() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const plans = data?.productionplannings || data?.productionPlannings || []
  const allMilestones = plans.flatMap((p: any) => p.milestones || [])

  const stats = {
    totalModules: plans.length,
    activeModules: plans.filter((p: any) => p.status === 'ACTIVE').length,
    completedMilestones: allMilestones.filter((m: any) => m.status === 'completed').length,
    totalMilestones: allMilestones.length,
  }

  const kpis = [
    { label: 'Total Modules', value: stats.totalModules, icon: Box },
    { label: 'Active Modules', value: stats.activeModules, icon: Activity },
    { label: 'Milestones', value: stats.totalMilestones, icon: TrendingUp },
    { label: 'Completed', value: stats.completedMilestones, icon: TrendingUp },
  ]

  return (
    <div className="erp-shell bg-white">
      <div>
        <h1 className="erp-page-title">Plant Modules Dashboard</h1>
        <p className="erp-page-desc">Plant module production tracking and monitoring</p>
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
        <SectionCard className="border-slate-200 bg-white" title="Module Progress">
          <div className="space-y-3">
            {plans.slice(0, 5).map((plan: any) => (
              <div key={plan.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-mono">{plan.docNumber}</span>
                  <span className="font-semibold">{plan.progress || 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${plan.progress || 0}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            ))}
            {plans.length === 0 && <p className="text-xs text-slate-500">No modules yet</p>}
          </div>
        </SectionCard>

        <SectionCard className="border-slate-200 bg-white" title="Milestone Status">
          <div className="space-y-3">
            {['pending', 'completed'].map((status) => {
              const count = allMilestones.filter((m: any) => m.status === status).length
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${stats.totalMilestones > 0 ? (count / stats.totalMilestones) * 100 : 0}%`,
                        backgroundColor: status === 'completed' ? '#2F9E6A' : ACCENT,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="border-slate-200 bg-white" title="Module Details" bodyClassName="p-0">
        {plans.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">No modules available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Module #</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Progress</th>
                  <th className="px-3 py-3 font-medium">Tasks</th>
                  <th className="px-3 py-3 font-medium">Milestones</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan: any) => (
                  <tr key={plan.id} className="border-b last:border-0 hover:bg-[#378ADD]/5">
                    <td className="px-4 py-3 font-mono text-xs">{plan.docNumber}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatDate(plan.docDate)}</td>
                    <td className="px-3 py-3 text-xs">{plan.progress || 0}%</td>
                    <td className="px-3 py-3 text-xs">{(plan.tasks || []).length}</td>
                    <td className="px-3 py-3 text-xs">{(plan.milestones || []).length}</td>
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
