'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SALES_ORDERS, UPDATE_SALES_ORDER, GET_PROJECTS } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Truck, PackageCheck, Clock, CheckCircle2, Building2, FolderKanban, DollarSign, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerDisplayName,
} from '@/lib/sales-customer-options'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell, AmountCell } from '@/components/ui/erp-shared'

export default function DeliveryOrderPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: soData, loading, refetch } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [deliver, { loading: delivering, error: deliverError }] = useMutation(UPDATE_SALES_ORDER, {
    onCompleted: () => { setSelected(null); setDeliveryDate(''); refetch() },
  })

  const [selected, setSelected] = useState<any>(null)
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab] = useState<'pending' | 'delivered'>('pending')

  const customers = mapSalesCustomers(customersData?.customers)
  const projects: any[] = projectsData?.projects ?? []
  const allOrders: any[] = soData?.salesorders ?? []

  const pending = allOrders.filter(o => ['draft', 'submitted', 'approved', 'active'].includes(o.status))
  const delivered = allOrders.filter(o => o.status === 'completed')
  const rows = activeTab === 'pending' ? pending : delivered

  const getProjectName = (id: string) => projects.find((x) => x.id === id)?.name ?? '—'
  const getCustomerDisplay = (id: string) => customerDisplayName(customers, id)

  const stats = {
    pending: pending.length,
    delivered: delivered.length,
    total: allOrders.length,
  }

  const handleDeliver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    deliver({
      variables: {
        id: selected.id,
        input: { status: 'completed' },
      },
    })
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Order #', width: '130px', render: v => <MonoCell value={v || '—'} /> },
    {
      key: 'customerId',
      label: 'Customer',
      render: (_v, r) => <span className="text-sm font-medium">{getCustomerDisplay(r.customerId || r.clientId || '')}</span>,
    },
    {
      key: 'projectId',
      label: 'Project',
      render: v => <span className="text-sm text-muted-foreground">{v ? getProjectName(v) : '—'}</span>,
    },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: v => <AmountCell value={v || 0} /> },
    { key: 'status', label: 'Status', width: '120px', render: v => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Delivery Order"
        subtitle="Process and track sales order deliveries"
        icon={<Truck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Delivery Order' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Pending Delivery" value={stats.pending}   icon={<Clock        className="h-5 w-5" />} variant="amber" />
        <StatCard label="Delivered"         value={stats.delivered} icon={<PackageCheck className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Orders"      value={stats.total}     icon={<Truck        className="h-5 w-5" />} variant="blue" />
      </StatsRow>

      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg w-fit">
        {(['pending', 'delivered'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'pending' ? `Pending (${stats.pending})` : `Delivered (${stats.delivered})`}
          </button>
        ))}
      </div>

      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        title={activeTab === 'pending' ? 'All Pending Deliveries' : 'All Delivered Orders'}
        searchable
        searchPlaceholder="Search orders…"
        emptyMessage={activeTab === 'pending' ? 'No orders pending delivery.' : 'No delivered orders yet.'}
        pageSize={25}
        actions={
          activeTab === 'pending'
            ? [{
                label: 'Deliver',
                icon: <Truck className="h-3.5 w-3.5" />,
                onClick: (r: any) => setSelected(r),
              }]
            : undefined
        }
      />

      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="bg-primary/10 p-1.5 rounded-md"><Truck className="h-4 w-4 text-primary" /></div>
              Confirm Delivery
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <form onSubmit={handleDeliver} className="space-y-5 pt-1">
              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Order #</p>
                      <p className="text-sm font-semibold font-mono">{selected.seqNo || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="text-sm font-medium">{getCustomerDisplay(selected.customerId || selected.clientId)}</p>
                    </div>
                  </div>
                  {selected.projectId && (
                    <div className="flex items-start gap-2">
                      <FolderKanban className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Project</p>
                        <p className="text-sm font-medium">{getProjectName(selected.projectId)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Order Amount</p>
                      <p className="text-base font-bold">{formatMoney(selected.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Delivery Date <span className="text-red-500">*</span></Label>
                <Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-700">This will mark the order as <strong>Delivered</strong> and close it.</p>
              </div>

              {deliverError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{deliverError.message}</p>}

              <DialogFooter className="pt-1">
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button type="submit" disabled={delivering} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]">
                  {delivering ? 'Processing…' : 'Confirm Delivery'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
