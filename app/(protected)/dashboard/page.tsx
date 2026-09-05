'use client'

import Link from 'next/link'
import { Fragment, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import {
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  Package,
  Warehouse,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Truck,
  Receipt,
  ArrowRight,
  Activity,
  CircleDollarSign,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { useAiPane } from '@/contexts/AiPaneContext'
import { useDashboardPreferences } from '@/hooks/use-dashboard-preferences'
import {
  GET_CUSTOMER_INVOICES,
  GET_PURCHASE_ORDERS,
  GET_SALES_ORDERS,
  GET_CUSTOMERS,
  GET_LEADS,
  GET_LOW_STOCK_ITEMS,
  GET_VENDOR_BILLS,
  GET_QUOTATIONS_BY_ORGANIZATION,
  MY_PENDING_APPROVAL_REQUESTS,
  GET_ITEMS,
  GET_VENDORS,
} from '@/gql/queries'
import { StatCard } from '@/components/dashboard/stat-card'
import { SectionCard, PageHeader } from '@/components/dashboard/section-card'
import { HeroGreeting, ModuleTile } from '@/components/dashboard/hero-greeting'
import { cn } from '@/lib/utils'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const fmtMoney = (n: number) => formatMoneyCompact(n)
const fmtMoneyFull = (n: number) => formatMoney(n)
const fmtCount = (n: number) => formatNumber(n)

const STATUS_TONE: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  SUBMITTED: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  OVERDUE: 'bg-rose-50 text-rose-700 border-rose-200',
  PARTIAL: 'bg-sky-50 text-sky-700 border-sky-200',
  SENT: 'bg-sky-50 text-sky-700 border-sky-200',
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || 'DRAFT').toUpperCase()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        STATUS_TONE[s] || 'bg-slate-100 text-slate-700 border-slate-200',
      )}
    >
      {s}
    </span>
  )
}

function buildMonthlyBuckets(rows: Array<{ date?: string; amount?: number }>) {
  const now = new Date()
  const buckets: { key: string; label: string; total: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    buckets.push({
      key,
      label: d.toLocaleDateString(undefined, { month: 'short' }),
      total: 0,
    })
  }
  const map = new Map(buckets.map((b) => [b.key, b]))
  for (const r of rows) {
    if (!r.date) continue
    const dt = new Date(r.date)
    if (Number.isNaN(dt.getTime())) continue
    const key = `${dt.getFullYear()}-${dt.getMonth()}`
    const b = map.get(key)
    if (b) b.total += Number(r.amount ?? 0)
  }
  return buckets
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { isOpen: aiOpen } = useAiPane()
  const orgId = user?.organizationId ?? ''
  const skip = !orgId
  const prefs = useDashboardPreferences('erp')

  const invoicesQ = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const purchasesQ = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const salesQ = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const customersQ = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const leadsQ = useQuery(GET_LEADS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const lowStockQ = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const billsQ = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 50 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const quotationsQ = useQuery(GET_QUOTATIONS_BY_ORGANIZATION, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const itemsQ = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 1 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const vendorsQ = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 1 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const approvalsQ = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const invoices: any[] = invoicesQ.data?.customerinvoices ?? []
  const purchases: any[] = purchasesQ.data?.purchaseorders ?? []
  const sales: any[] = salesQ.data?.salesorders ?? []
  const customers: any[] = customersQ.data?.customers ?? []
  const leads: any[] = leadsQ.data?.leads ?? []
  const lowStock: any[] = lowStockQ.data?.lowStockItems ?? []
  const bills: any[] = billsQ.data?.vendorBills ?? []
  const quotations: any[] = quotationsQ.data?.quotationsByOrganization ?? []
  const approvals: any[] = approvalsQ.data?.myPendingApprovalRequests ?? []

  const totalRevenue = useMemo(
    () => invoices.reduce((s, i) => s + Number(i?.totalAmount ?? 0), 0),
    [invoices],
  )
  const outstanding = useMemo(
    () => invoices.reduce((s, i) => s + Number(i?.outstandingAmount ?? 0), 0),
    [invoices],
  )
  const payable = useMemo(
    () => bills.reduce((s, b) => s + Number(b?.outstandingAmount ?? 0), 0),
    [bills],
  )
  const openPos = purchases.filter((p) => !['CLOSED', 'CANCELLED'].includes(String(p?.status || '').toUpperCase())).length
  const openSos = sales.filter((s) => !['CLOSED', 'CANCELLED', 'COMPLETED'].includes(String(s?.status || '').toUpperCase())).length
  const newLeads = leads.filter((l) => ['NEW', 'CONTACTED'].includes(String(l?.status || '').toUpperCase())).length

  const revenueChart = useMemo(
    () =>
      buildMonthlyBuckets(
        invoices.map((i: any) => ({ date: i.invoiceDate, amount: i.totalAmount })),
      ),
    [invoices],
  )

  const salesPurchaseChart = useMemo(() => {
    const salesBuckets = buildMonthlyBuckets(sales.map((s: any) => ({ date: s.orderDate, amount: s.totalAmount })))
    const purchaseBuckets = buildMonthlyBuckets(
      purchases.map((p: any) => ({ date: p.orderDate, amount: p.totalAmount })),
    )
    return salesBuckets.map((b, i) => ({
      month: b.label,
      sales: b.total,
      purchases: purchaseBuckets[i]?.total ?? 0,
    }))
  }, [sales, purchases])

  const invoiceStatusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const inv of invoices) {
      const k = String(inv?.status || 'DRAFT').toUpperCase()
      counts[k] = (counts[k] ?? 0) + 1
    }
    const palette = [
      'hsl(158 64% 36%)',
      'hsl(168 84% 39%)',
      'hsl(38 92% 50%)',
      'hsl(0 70% 60%)',
      'hsl(217 91% 60%)',
      'hsl(265 80% 60%)',
    ]
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: palette[i % palette.length],
    }))
  }, [invoices])

  const recentInvoices = useMemo(
    () =>
      [...invoices]
        .sort((a: any, b: any) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
        .slice(0, 5),
    [invoices],
  )

  const conversionRate = useMemo(() => {
    if (leads.length === 0) return 0
    const converted = leads.filter((l) => String(l.status || '').toUpperCase() === 'CONVERTED').length
    return Math.round((converted / leads.length) * 100)
  }, [leads])

  const loading =
    invoicesQ.loading ||
    purchasesQ.loading ||
    salesQ.loading ||
    customersQ.loading ||
    leadsQ.loading

  const kpiCards: Record<string, React.ReactNode> = {
    'kpi-revenue': (
      <StatCard
        label="Revenue"
        value={fmtMoney(totalRevenue)}
        hint={`${invoices.length} invoices`}
        icon={<CircleDollarSign className="h-5 w-5" />}
        tone="brand"
        loading={loading}
        spark={revenueChart.map((b) => b.total)}
      />
    ),
    'kpi-receivable': (
      <StatCard
        label="Receivable"
        value={fmtMoney(outstanding)}
        hint="Outstanding from customers"
        icon={<Receipt className="h-5 w-5" />}
        tone="emerald"
        loading={loading}
      />
    ),
    'kpi-payable': (
      <StatCard
        label="Payable"
        value={fmtMoney(payable)}
        hint="Vendor bills due"
        icon={<DollarSign className="h-5 w-5" />}
        tone="rose"
        loading={loading}
      />
    ),
    'kpi-sales-orders': (
      <StatCard
        label="Sales orders"
        value={fmtCount(openSos)}
        hint={`${sales.length} total`}
        icon={<ShoppingCart className="h-5 w-5" />}
        tone="sky"
        loading={loading}
        href="/sales-orders"
      />
    ),
    'kpi-purchase-orders': (
      <StatCard
        label="Purchase orders"
        value={fmtCount(openPos)}
        hint={`${purchases.length} total`}
        icon={<Truck className="h-5 w-5" />}
        tone="violet"
        loading={loading}
        href="/purchases/enter-purchase-orders"
      />
    ),
    'kpi-conversion': (
      <StatCard
        label="Conversion"
        value={`${conversionRate}%`}
        hint={`${newLeads} new leads`}
        icon={<Target className="h-5 w-5" />}
        tone="warn"
        loading={loading}
      />
    ),
  }

  const renderSection = (id: string, spanClass: string): React.ReactNode => {
    switch (id) {
      case 'section-revenue-trend':
        return (
          <SectionCard
            className={spanClass}
            title="Revenue trend"
          description="Last 6 months of invoiced revenue"
          action={
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" /> Revenue
            </div>
          }
        >
          <div className="h-64 sm:h-72 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={revenueChart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(158 64% 36%)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(158 64% 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                <XAxis dataKey="label" stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(220 9% 46%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <RTooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid hsl(220 13% 91%)',
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: '0 8px 24px hsl(222 47% 11% / 0.08)',
                  }}
                  formatter={(v: any) => fmtMoney(Number(v))}
                />
                <Area type="monotone" dataKey="total" stroke="hsl(158 64% 36%)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        )
      case 'section-invoice-status':
        return (
        <SectionCard className={spanClass} title="Invoice status" description={`${invoices.length} total invoices`}>
          {invoiceStatusBreakdown.length === 0 ? (
            <EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices yet" />
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={invoiceStatusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      stroke="white"
                    >
                      {invoiceStatusBreakdown.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {invoiceStatusBreakdown.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className="capitalize">{s.name.toLowerCase()}</span>
                    </span>
                    <span className="font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
        )
      case 'section-sales-vs-purchases':
        return (
        <SectionCard
          className={spanClass}
          title="Sales vs purchases"
          description="Monthly comparison"
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Sales</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />Purchases</span>
            </div>
          }
        >
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <BarChart data={salesPurchaseChart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                <XAxis dataKey="month" stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(220 9% 46%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <RTooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid hsl(220 13% 91%)',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v: any) => fmtMoney(Number(v))}
                />
                <Bar dataKey="sales" fill="hsl(158 64% 36%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="purchases" fill="hsl(168 84% 39%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        )
      case 'section-low-stock':
        return (
        <SectionCard
          className={spanClass}
          title="Low stock alerts"
          description={lowStock.length ? `${lowStock.length} items need attention` : 'All items stocked'}
          action={
            <Link href="/inventory/review-negative-inventory" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View <ArrowRight className="h-3 w-3" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {lowStock.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                title="No low stock items"
                description="All inventory above reorder point."
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 6).map((it: any) => (
                <li key={it.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{it.itemName}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: <span className="tabular-nums">{it.quantity}</span> · Reorder: <span className="tabular-nums">{it.reorderPoint}</span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                      String(it.stockStatus).toUpperCase() === 'OUT_OF_STOCK'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                    )}
                  >
                    {String(it.stockStatus ?? 'low').replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        )
      case 'section-recent-invoices':
        return (
        <SectionCard
          className={spanClass}
          title="Recent invoices"
          description="Latest customer invoices"
          action={
            <Link href="/sales/create-invoices" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All invoices <ArrowRight className="h-3 w-3" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {recentInvoices.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={<Receipt className="h-5 w-5" />}
                title="No invoices yet"
                description="Create your first invoice to see it here."
                ctaLabel="Create invoice"
                ctaHref="/sales/create-invoices"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-medium">Invoice</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium text-right">Total</th>
                    <th className="px-3 py-3 font-medium text-right">Due</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3 font-medium">#{inv.seqNo ?? inv.id?.slice(-6)}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {inv.invoiceDate ? formatDate(inv.invoiceDate) : '—'}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium">
                        {fmtMoneyFull(Number(inv.totalAmount ?? 0))}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-rose-600">
                        {fmtMoneyFull(Number(inv.outstandingAmount ?? 0))}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
        )
      case 'section-my-approvals':
        return (
        <SectionCard
          className={spanClass}
          title="My approvals"
          description={approvals.length ? `${approvals.length} pending` : 'Nothing waiting'}
          action={
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
              approvals.length ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            )}>
              <ClipboardCheck className="h-3 w-3" />
              {approvals.length ? 'Action needed' : 'Clear'}
            </span>
          }
        >
          {approvals.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              title="You're all caught up"
              description="No approval requests waiting for you."
            />
          ) : (
            <ul className="space-y-2.5">
              {approvals.slice(0, 5).map((a: any) => (
                <li key={a.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight line-clamp-2">{a.title ?? 'Approval request'}</p>
                    <span className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                      Pending
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{a.moduleKey ?? '—'}</span>
                    {a.createdAt && <span>{formatDate(a.createdAt)}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        )
      case 'section-quick-access':
        return (
        <SectionCard
          className={spanClass}
          title="Quick access"
          description="Jump into a module"
          action={
            <Link href="/settings?tab=preferences" className="text-xs font-medium text-primary hover:underline">
              Customize
            </Link>
          }
        >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <ModuleTile label="Customers" icon={<Users className="h-4 w-4" />} count={fmtCount(customers.length)} href="/customers" tone="brand" />
          <ModuleTile label="Vendors" icon={<Truck className="h-4 w-4" />} count={fmtCount(vendorsQ.data?.vendors?.length ?? 0)} href="/vendors" tone="violet" />
          <ModuleTile label="Items" icon={<Package className="h-4 w-4" />} count={fmtCount(itemsQ.data?.items?.length ?? 0)} href="/inventory/items" tone="emerald" />
          <ModuleTile label="Warehouses" icon={<Warehouse className="h-4 w-4" />} href="/warehouse" tone="sky" />
          <ModuleTile label="Quotations" icon={<FileText className="h-4 w-4" />} count={fmtCount(quotations.length)} href="/quotations" tone="warn" />
          <ModuleTile label="Reports" icon={<TrendingUp className="h-4 w-4" />} href="/reports/financial/income-statement" tone="accent" />
          <ModuleTile label="Cash & Bank" icon={<DollarSign className="h-4 w-4" />} href="/cash-bank" tone="emerald" />
          <ModuleTile label="Inventory" icon={<Activity className="h-4 w-4" />} href="/inventory-control" tone="rose" />
          <ModuleTile label="Payroll" icon={<Users className="h-4 w-4" />} href="/payroll-management" tone="violet" />
          <ModuleTile label="HR" icon={<Users className="h-4 w-4" />} href="/hr/masters/employee-master" tone="sky" />
          <ModuleTile label="Banks" icon={<DollarSign className="h-4 w-4" />} href="/banks/make-deposits" tone="brand" />
          <ModuleTile label="Leads" icon={<Target className="h-4 w-4" />} count={fmtCount(leads.length)} href="/crm/lead-management" tone="warn" />
        </div>
      </SectionCard>
        )
      default:
        return null
    }
  }

  const spanClassFor = (span: 1 | 2 | 3 | undefined): string => {
    if (span === 3) return 'lg:col-span-3'
    if (span === 2) return 'lg:col-span-2'
    return ''
  }

  const visibleKpis = prefs.visibleWidgets('kpi')
  const visibleSections = prefs.visibleWidgets('section')

  const ctaRegistry: Record<string, { label: string; href: string }> = {
    'cta-new-invoice': { label: 'New invoice', href: '/sales/create-invoices' },
    'cta-new-quotation': { label: 'New quotation', href: '/quotations' },
    'cta-new-sales-order': { label: 'New sales order', href: '/sales-orders' },
    'cta-new-purchase-order': { label: 'New purchase order', href: '/purchases/enter-purchase-orders' },
    'cta-new-customer': { label: 'New customer', href: '/customers' },
    'cta-new-vendor': { label: 'New vendor', href: '/vendors' },
    'cta-new-item': { label: 'New item', href: '/inventory/items' },
    'cta-new-payment': { label: 'Receive payment', href: '/sales/receive-payments' },
    'cta-new-bill': { label: 'New vendor bill', href: '/purchases/enter-bills' },
    'cta-new-lead': { label: 'New lead', href: '/crm/lead-management' },
  }
  const heroCtas = prefs
    .visibleWidgets('heroCta')
    .map((w) => ctaRegistry[w.id])
    .filter(Boolean)

  return (
    <div className="erp-shell">
      <HeroGreeting name={user?.firstName} ctas={heroCtas} />

      <PageHeader
        title="Operational overview"
        description="Real-time KPIs and activity across your organization."
        actions={
          <Link
            href="/reports/financial/income-statement"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors"
          >
            <FileText className="h-4 w-4" />
            View reports
          </Link>
        }
      />

      {visibleKpis.length > 0 && (
        <div className={cn(
          "grid gap-3 sm:gap-4 auto-rows-fr transition-all duration-300 ease-in-out",
          aiOpen
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        )}>
          {visibleKpis.map((w) => (
            <div key={w.id} className="h-full">{kpiCards[w.id]}</div>
          ))}
        </div>
      )}

      {visibleSections.length > 0 && (
        <div className={cn(
          "grid gap-4 sm:gap-6 transition-all duration-300 ease-in-out",
          aiOpen ? "grid-cols-1 xl:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        )}>
          {visibleSections.map((w) => (
            <Fragment key={w.id}>{renderSection(w.id, spanClassFor(w.colSpan))}</Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="h-10 w-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs text-muted-foreground max-w-xs">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          {ctaLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}
