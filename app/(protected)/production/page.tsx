'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import {
  Factory,
  Wrench,
  ClipboardList,
  MapPin,
  AlertCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PRODUCTION_PLANNINGS,
  GET_WORK_ORDERS,
  GET_SITE_LOCATIONS,
  GET_CONTRACTORS,
} from '@/gql/queries'
import { StatCard } from '@/components/dashboard/stat-card'
import { SectionCard } from '@/components/dashboard/section-card'
import { formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const ACCENT = '#378ADD'
const ACCENT_SOFT = 'rgba(55, 138, 221, 0.12)'

export default function ProductionOverviewPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const skip = !orgId

  const planningsQ = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const woQ = useQuery(GET_WORK_ORDERS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const sitesQ = useQuery(GET_SITE_LOCATIONS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const contractorsQ = useQuery(GET_CONTRACTORS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const plannings: any[] = planningsQ.data?.productionPlannings ?? []
  const workOrders: any[] = woQ.data?.workorders ?? []
  const sites: any[] = sitesQ.data?.siteLocations ?? []
  const contractors: any[] = contractorsQ.data?.contractors ?? []

  const loading = planningsQ.loading || woQ.loading

  const stats = useMemo(() => {
    const activeWO = workOrders.filter((w) => !['CLOSED', 'COMPLETED', 'CANCELLED'].includes(String(w.status || '').toUpperCase())).length
    const completedWO = workOrders.filter((w) => ['COMPLETED', 'CLOSED'].includes(String(w.status || '').toUpperCase())).length
    const activePlanning = plannings.filter((p) => !['COMPLETED', 'CANCELLED'].includes(String(p.status || '').toUpperCase())).length
    const totalBudget = plannings.reduce((s, p) => s + Number(p?.budget ?? 0), 0)
    return { activeWO, completedWO, activePlanning, totalBudget }
  }, [workOrders, plannings])

  const statusBuckets = useMemo(() => {
    const map: Record<string, number> = {}
    for (const wo of workOrders) {
      const k = String(wo.status || 'OPEN').toUpperCase()
      map[k] = (map[k] ?? 0) + 1
    }
    const palette: Record<string, string> = {
      OPEN: ACCENT,
      IN_PROGRESS: '#5BA3E5',
      ON_HOLD: '#94A3B8',
      COMPLETED: '#2F9E6A',
      CLOSED: '#2F9E6A',
      CANCELLED: '#E11D48',
      DRAFT: '#94A3B8',
    }
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: palette[name] ?? ACCENT,
    }))
  }, [workOrders])

  const monthlyWO = useMemo(() => {
    const now = new Date()
    const buckets: { key: string; label: string; total: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString(undefined, { month: 'short' }),
        total: 0,
      })
    }
    const map = new Map(buckets.map((b) => [b.key, b]))
    for (const w of workOrders) {
      if (!w.docDate) continue
      const dt = new Date(w.docDate)
      const key = `${dt.getFullYear()}-${dt.getMonth()}`
      const b = map.get(key)
      if (b) b.total += 1
    }
    return buckets
  }, [workOrders])

  return (
    <div className="erp-shell bg-white">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl text-white shadow-[0_8px_30px_-12px_rgba(55,138,221,0.45)]"
        style={{ backgroundColor: ACCENT }}
      >
        <div className="absolute inset-0 bg-dotgrid opacity-[0.1]" />
        <div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-35 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #85b9f3, transparent)' }}
        />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              <Factory className="h-3 w-3" />
              Production Management
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shop floor & manufacturing
            </h1>
            <p className="mt-1.5 text-sm text-white/85">
              Track production planning, work orders, drawings, sites and contractors in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/production-planning"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
            >
              New production plan
            </Link>
            <Link
              href="/work-orders"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Wrench className="h-4 w-4" />
              Work orders
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Active work orders"
          value={formatNumber(stats.activeWO)}
          hint={`${stats.completedWO} completed`}
          icon={<Wrench className="h-5 w-5" />}
          tone="brand"
          loading={loading}
          spark={monthlyWO.map((b) => b.total)}
        />
        <StatCard
          label="Active production plans"
          value={formatNumber(stats.activePlanning)}
          hint={`${plannings.length} total plans`}
          icon={<ClipboardList className="h-5 w-5" />}
          tone="brand"
          loading={loading}
        />
        <StatCard
          label="Planned budget"
          value={formatMoneyCompact(stats.totalBudget)}
          hint="Across all production plans"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
          loading={loading}
        />
        <StatCard
          label="Active sites"
          value={formatNumber(sites.length)}
          hint={`${contractors.length} contractors`}
          icon={<MapPin className="h-5 w-5" />}
          tone="brand"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <SectionCard
          className="border-slate-200 bg-white lg:col-span-2"
          title="Work order activity"
          description="Last 6 months"
        >
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <BarChart data={monthlyWO} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
                <RTooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                <Bar dataKey="total" fill={ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard className="border-slate-200 bg-white" title="Status mix" description={`${workOrders.length} work orders`}>
          {statusBuckets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No work orders yet.</p>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={statusBuckets} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="white">
                      {statusBuckets.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {statusBuckets.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className="capitalize">{s.name.replace('_', ' ').toLowerCase()}</span>
                    </span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* Recent work orders */}
      <SectionCard
        className="border-slate-200 bg-white"
        title="Recent work orders"
        description={`${workOrders.length} total`}
        action={
          <Link href="/work-orders" className="inline-flex items-center gap-1 text-xs font-medium text-[#378ADD] hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : workOrders.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No work orders yet</p>
            <p className="mb-3 text-xs text-muted-foreground">Create a work order to schedule production tasks.</p>
            <Link
              href="/work-orders"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              New work order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Doc #</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.slice(0, 8).map((wo: any) => (
                  <tr key={wo.id} className="border-b transition-colors last:border-0 hover:bg-[#378ADD]/5">
                    <td className="px-5 py-3 font-medium">{wo.docNumber ?? `#${wo.id.slice(-6)}`}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {wo.docDate ? formatDate(wo.docDate) : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase"
                        style={{
                          backgroundColor: ACCENT_SOFT,
                          color: ACCENT,
                          borderColor: 'rgba(55, 138, 221, 0.25)',
                        }}
                      >
                        {wo.status || 'OPEN'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {wo.createdAt ? formatDate(wo.createdAt) : '—'}
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
