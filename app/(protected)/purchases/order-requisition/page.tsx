'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, UPDATE_PURCHASE_ORDER, GET_VENDORS, GET_PROJECTS } from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Clock, FileCheck, Package, Building2, FolderKanban, CalendarDays, DollarSign, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted: { label: 'Submitted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:      { label: 'Sent',      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  received:  { label: 'Received',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none text-xs px-2 h-7 w-full rounded-sm'

export default function OrderRequisitionPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [approvePO, { loading: approving, error: approveError }] = useMutation(UPDATE_PURCHASE_ORDER, {
    onCompleted: () => { setSelected(null); setVendorId(''); setErrors({}) ; refetch() },
  })

  const [selected, setSelected] = useState<any>(null)
  const [vendorId, setVendorId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending')

  const vendors = vendorData?.vendors ?? []
  const projects = projectData?.projects ?? []
  const allPOs = poData?.purchaseorders ?? []

  const pending = allPOs.filter((o: any) => ['draft', 'submitted'].includes(o.status))
  const approved = allPOs.filter((o: any) => ['approved', 'sent', 'received'].includes(o.status))

  const getName = (id: string, list: any[]) => list.find(x => x.id === id)?.name ?? '—'

  const stats = { pending: pending.length, approved: approved.length, total: allPOs.length }

  const handleApprove = () => {
    if (!vendorId) { setErrors({ vendorId: 'Vendor is required to raise a PO' }); return }
    approvePO({ variables: { id: selected.id, input: { vendorId, status: 'approved' } } })
  }

  const POTable = ({ orders, showAction }: { orders: any[]; showAction: boolean }) => (
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-[#f0f0f0] border-b border-gray-300">
          {['#', 'PO #', 'Vendor', 'Project', 'Order Date', 'Amount', 'Status', showAction ? 'Action' : ''].filter(Boolean).map(h => (
            <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-300 last:border-r-0">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {orders.map((o, idx) => {
          const s = STATUS_CFG[o.status] ?? STATUS_CFG.draft
          return (
            <tr key={o.id} className={`border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-3 py-2 text-gray-300 border-r border-gray-200">{idx + 1}</td>
              <td className="px-3 py-2 font-mono text-gray-400 border-r border-gray-200">{o.seqNo || '—'}</td>
              <td className="px-3 py-2 font-medium text-gray-800 border-r border-gray-200">{o.vendorId ? getName(o.vendorId, vendors) : <span className="text-gray-400 italic">Not assigned</span>}</td>
              <td className="px-3 py-2 text-gray-500 border-r border-gray-200">{o.projectId ? getName(o.projectId, projects) : '—'}</td>
              <td className="px-3 py-2 text-gray-600 border-r border-gray-200">{o.orderDate ? formatDate(o.orderDate) : '—'}</td>
              <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200">{formatMoney(o.totalAmount)}</td>
              <td className="px-3 py-2 border-r border-gray-200">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.cls}`}>{s.label}</span>
              </td>
              {showAction && (
                <td className="px-3 py-2">
                  <Button size="sm" onClick={() => { setSelected(o); setVendorId(o.vendorId || '') }}
                    className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2">
                    <ArrowRight className="h-3 w-3 mr-1" /> Raise PO
                  </Button>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  return (
    <PageTemplate title="Order Requisition" description="Convert approved requisitions into purchase orders">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Pending Approval', value: stats.pending,  icon: Clock,       cls: 'text-amber-600 bg-amber-50' },
          { label: 'Approved / Sent',  value: stats.approved, icon: FileCheck,   cls: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Orders',     value: stats.total,    icon: Package,     cls: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['pending', 'approved'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab === 'pending' ? `Pending (${stats.pending})` : `Approved (${stats.approved})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">{activeTab === 'pending' ? 'Awaiting PO Conversion' : 'Converted to PO'}</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : (activeTab === 'pending' ? pending : approved).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">{activeTab === 'pending' ? 'No pending requisitions.' : 'No approved orders yet.'}</p>
          </div>
        ) : (
          <POTable orders={activeTab === 'pending' ? pending : approved} showAction={activeTab === 'pending'} />
        )}
      </div>

      {/* Raise PO panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
              <span className="text-sm font-semibold text-white flex items-center gap-2"><FileCheck className="h-4 w-4" /> Raise Purchase Order</span>
              <button onClick={() => { setSelected(null); setErrors({}) }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-4 space-y-4">
              {/* Summary */}
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

              {/* Vendor assignment */}
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

              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> This will mark the requisition as <strong className="ml-1">Approved</strong> and assign the vendor.
              </div>

              {approveError && <p className="text-xs text-red-500">{approveError.message}</p>}

              <div className="flex gap-2 justify-end pt-1">
                <Button variant="outline" size="sm" onClick={() => { setSelected(null); setErrors({}) }} className="h-8 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleApprove} disabled={approving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                  {approving ? 'Processing…' : 'Raise PO'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  )
}
