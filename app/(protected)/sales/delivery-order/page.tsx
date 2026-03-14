'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SALES_ORDERS, UPDATE_SALES_ORDER, GET_ORGANIZATIONS, GET_PROJECTS } from '@/gql/queries'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Truck, PackageCheck, Clock, CheckCircle2, Building2, FolderKanban, CalendarDays, DollarSign, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const SO_STATUS: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted: { label: 'Submitted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  active:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Delivered', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

export default function DeliveryOrderPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: soData, loading, refetch } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 200 } })
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

  const orgs: any[] = orgsData?.organizations ?? []
  const projects: any[] = projectsData?.projects ?? []
  const allOrders: any[] = soData?.salesorders ?? []

  const pending = allOrders.filter(o => ['approved', 'active'].includes(o.status))
  const delivered = allOrders.filter(o => o.status === 'completed')

  const getName = (id: string, list: any[]) => list.find(x => x.id === id)?.name ?? '—'

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

  const OrderTable = ({ orders, showAction }: { orders: any[]; showAction: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          {['Order #', 'Customer', 'Project', 'Order Date', 'Amount', 'Status', showAction ? 'Action' : ''].filter(Boolean).map(h => (
            <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(o => {
          const s = SO_STATUS[o.status] ?? SO_STATUS.draft
          return (
            <TableRow key={o.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="pl-6 font-mono text-xs text-gray-400">{o.seqNo || '—'}</TableCell>
              <TableCell className="text-sm font-medium text-gray-800">{getName(o.customerId, orgs)}</TableCell>
              <TableCell className="text-sm text-gray-500">{o.projectId ? getName(o.projectId, projects) : '—'}</TableCell>
              <TableCell className="text-sm text-gray-600">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</TableCell>
              <TableCell className="text-sm font-semibold text-gray-800">${Number(o.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>{s.label}</span>
              </TableCell>
              {showAction && (
                <TableCell>
                  <Button size="sm" onClick={() => setSelected(o)}
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Truck className="h-3 w-3 mr-1" /> Deliver
                  </Button>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Delivery Order</h1>
          <p className="text-gray-500">Process and track sales order deliveries</p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending Delivery', value: stats.pending,   icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Delivered',        value: stats.delivered, icon: PackageCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Orders',     value: stats.total,     icon: Truck,        color: 'text-blue-600',    bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${bg} p-2 rounded-lg`}><Icon className={`h-5 w-5 ${color}`} /></div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['pending', 'delivered'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab === 'pending' ? `Pending (${stats.pending})` : `Delivered (${stats.delivered})`}
          </button>
        ))}
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-base font-semibold text-gray-800">
            {activeTab === 'pending' ? 'Orders Awaiting Delivery' : 'Delivered Orders'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading…</div>
          ) : (activeTab === 'pending' ? pending : delivered).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Truck className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">{activeTab === 'pending' ? 'No orders pending delivery.' : 'No delivered orders yet.'}</p>
            </div>
          ) : (
            <OrderTable orders={activeTab === 'pending' ? pending : delivered} showAction={activeTab === 'pending'} />
          )}
        </CardContent>
      </Card>

      {/* Delivery Confirmation Dialog */}
      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="bg-blue-50 p-1.5 rounded-md"><Truck className="h-4 w-4 text-blue-600" /></div>
              Confirm Delivery
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <form onSubmit={handleDeliver} className="space-y-5 pt-1">
              {/* Order summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order #</p>
                      <p className="text-sm font-semibold font-mono text-gray-800">{selected.seqNo || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Customer</p>
                      <p className="text-sm font-medium text-gray-800">{getName(selected.customerId, orgs)}</p>
                    </div>
                  </div>
                  {selected.projectId && (
                    <div className="flex items-start gap-2">
                      <FolderKanban className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Project</p>
                        <p className="text-sm font-medium text-gray-800">{getName(selected.projectId, projects)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Amount</p>
                      <p className="text-base font-bold text-gray-800">${Number(selected.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
