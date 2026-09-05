'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, APPROVE_PURCHASE_ORDER, GET_VENDORS, GET_PROJECTS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Clock, FileCheck, Package, FolderKanban, CalendarDays, DollarSign, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const cell = 'border border-border bg-background outline-none focus:ring-1 focus:ring-ring text-xs px-2 h-7 w-full rounded-md'
const cellErr = 'border border-red-400 bg-red-50 outline-none text-xs px-2 h-7 w-full rounded-md'

const PENDING_STATUSES = new Set(['rfq', 'rfq_sent', 'submitted'])
const LIST_STATUSES = new Set(['rfq', 'rfq_sent', 'submitted', 'approved', 'purchase_order', 'sent', 'received', 'partially_received'])

export default function OrderRequisitionPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [approvePO, { loading: approving, error: approveError }] = useMutation(APPROVE_PURCHASE_ORDER, {
    onCompleted: () => { setSelected(null); setVendorId(''); setErrors({}); refetch() },
  })

  const [selected, setSelected] = useState<any>(null)
  const [vendorId, setVendorId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const vendors = vendorData?.vendors ?? []
  const projects = projectData?.projects ?? []
  const allPOs = (poData?.purchaseorders ?? []).filter((o: any) => LIST_STATUSES.has(o.status))

  const pending = allPOs.filter((o: any) => PENDING_STATUSES.has(o.status))
  const approved = allPOs.filter((o: any) => !PENDING_STATUSES.has(o.status))

  const getName = (id: string, list: any[]) => list.find(x => x.id === id)?.name ?? '—'

  const stats = { pending: pending.length, approved: approved.length, total: allPOs.length }

  const handleApprove = () => {
    if (!vendorId) { setErrors({ vendorId: 'Vendor is required to raise a PO' }); return }
    approvePO({ variables: { id: selected.id, vendorId } })
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'PO #', width: '140px', render: v => <MonoCell value={v} /> },
    {
      key: 'vendorId',
      label: 'Vendor',
      render: (v, r) => (
        <span className="text-sm font-medium">
          {v ? getName(v, vendors) : <span className="italic text-muted-foreground">Not assigned</span>}
        </span>
      ),
    },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '130px', render: v => <ErpBadge status={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Order Requisition"
        subtitle="Convert approved requisitions into purchase orders"
        icon={<FileCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Purchases' }, { label: 'Order Requisition' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Pending Approval" value={stats.pending} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved / Sent" value={stats.approved} icon={<FileCheck className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Orders" value={stats.total} icon={<Package className="h-5 w-5" />} variant="slate" />
      </StatsRow>

      <DataTable
        data={allPOs}
        columns={columns}
        loading={loading}
        title="All Order Requisitions"
        searchable
        searchPlaceholder="Search requisitions…"
        emptyMessage="No order requisitions found."
        pageSize={25}
        actions={[
          {
            label: 'Raise PO',
            icon: <ArrowRight className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              setSelected(r)
              setVendorId(r.vendorId || '')
            },
            show: (r: any) => PENDING_STATUSES.has(r.status),
          },
        ]}
      />

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-primary">
              <span className="text-sm font-semibold text-white flex items-center gap-2"><FileCheck className="h-4 w-4" /> Raise Purchase Order</span>
              <button onClick={() => { setSelected(null); setErrors({}) }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div><p className="text-xs text-gray-400">Requisition #</p><p className="text-sm font-mono font-semibold text-gray-800">{selected.seqNo || '—'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <FolderKanban className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div><p className="text-xs text-gray-400">Project</p><p className="text-sm font-medium text-gray-800">{selected.projectId ? getName(selected.projectId, projects) : '—'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div><p className="text-xs text-gray-400">Order Date</p><p className="text-sm text-gray-700">{selected.orderDate ? formatDate(selected.orderDate) : '—'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div><p className="text-xs text-gray-400">Amount</p><p className="text-base font-bold text-gray-800">{formatMoney(selected.totalAmount)}</p></div>
                </div>
              </div>

              <div>
                <p className={`text-xs font-medium mb-1 ${errors.vendorId ? 'text-red-500' : 'text-gray-600'}`}>
                  Assign Vendor * {errors.vendorId && `— ${errors.vendorId}`}
                </p>
                <select value={vendorId} onChange={e => { setVendorId(e.target.value); setErrors({}) }}
                  className={errors.vendorId ? cellErr : cell}>
                  <option value="">— select vendor —</option>
                  {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 border border-primary/20 rounded px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> This will mark the requisition as <strong className="ml-1">Approved</strong> and assign the vendor.
              </div>

              {approveError && <p className="text-xs text-red-500">{approveError.message}</p>}

              <div className="flex gap-2 justify-end pt-1">
                <Button variant="outline" size="sm" onClick={() => { setSelected(null); setErrors({}) }} className="h-8 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleApprove} disabled={approving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                  {approving ? 'Processing…' : 'Raise PO'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
