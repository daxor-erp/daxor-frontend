'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, GET_VENDORS, GET_PROJECTS, RECEIVE_PURCHASE_ORDER, APPROVE_PURCHASE_ORDER } from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { PackageCheck, Clock, CheckCircle2, X, Inbox } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'
const today = () => new Date().toISOString().split('T')[0]

const STATUS_BADGE: Record<string, string> = {
  submitted: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  sent:     'bg-indigo-50 text-indigo-700 border-indigo-200',
  received: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function ReceiveOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: projectData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const [update, { loading: confirming }] = useMutation(RECEIVE_PURCHASE_ORDER, {
    onCompleted: () => { setSelected(null); setReceiveDate(''); setDateErr(''); refetch() },
  })
  const [approvePO] = useMutation(APPROVE_PURCHASE_ORDER, { onCompleted: () => refetch() })

  const [tab, setTab] = useState<'pending' | 'received'>('pending')
  const [selected, setSelected] = useState<any>(null)
  const [receiveDate, setReceiveDate] = useState('')
  const [dateErr, setDateErr] = useState('')

  const orders: any[] = poData?.purchaseorders ?? []
  const vendors: any[] = vendorData?.vendors ?? []
  const projects: any[] = projectData?.projects ?? []

  const getVendor  = (id: string) => vendors.find(v => v.id === id || String(v._id) === id)?.name ?? '—'
  const getProject = (id: string) => projects.find(p => p.id === id || String(p._id) === id)?.name ?? '—'

  const pending  = orders.filter(o => ['submitted', 'approved', 'sent'].includes(o.status))
  const received = orders.filter(o => o.status === 'received')

  const handleConfirm = () => {
    if (!receiveDate) { setDateErr('Required'); return }
    update({ variables: { id: selected.id } })
  }

  const rows = tab === 'pending' ? pending : received

  return (
    <PageTemplate title="Receive Orders" description="Record receipt of goods against purchase orders">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Pending Receipt', value: pending.length,  icon: Clock,        cls: 'text-amber-600 bg-amber-50' },
          { label: 'Received',        value: received.length, icon: PackageCheck, cls: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total POs',       value: orders.length,   icon: CheckCircle2, cls: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-lg">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <PackageCheck className="h-4 w-4" /> Confirm Receipt
              </span>
              <button onClick={() => { setSelected(null); setReceiveDate(''); setDateErr('') }} className="text-blue-200 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">PO #</span><span className="font-mono text-gray-700">{selected.seqNo || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Vendor</span><span className="font-medium text-gray-800">{selected.vendorName || getVendor(selected.vendorId)}</span></div>
                {selected.projectId && (
                  <div className="flex justify-between"><span className="text-gray-500">Project</span><span className="text-gray-700">{selected.projectName || getProject(selected.projectId)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-gray-500">PO Total</span><span className="font-semibold text-gray-800">{formatMoney(selected.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Order Date</span><span className="text-gray-600">{selected.orderDate ? formatDate(selected.orderDate) : '—'}</span></div>
              </div>
              <div>
                <p className={`text-xs mb-1 font-medium ${dateErr ? 'text-red-500' : 'text-gray-500'}`}>
                  Received Date *{dateErr ? ` — ${dateErr}` : ''}
                </p>
                <input type="date" value={receiveDate}
                  onChange={e => { setReceiveDate(e.target.value); setDateErr('') }}
                  className={dateErr ? cellErr : cell} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => { setSelected(null); setReceiveDate(''); setDateErr('') }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleConfirm} disabled={confirming}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white min-w-[130px]">
                <PackageCheck className="h-3.5 w-3.5 mr-1" />{confirming ? 'Saving…' : 'Mark as Received'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs + Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-300">
          {(['pending', 'received'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${tab === t ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}>
              {t === 'pending' ? `Pending (${pending.length})` : `Received (${received.length})`}
            </button>
          ))}
        </div>

        <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {[['w-8','#'],['w-24','PO #'],['flex-1','Project'],['w-28','Order Date'],['w-24','Amount'],['w-24','Status'],['w-28','']].map(([w,h]) => (
            <div key={h} className={`${w} border-r border-gray-300 last:border-r-0 px-2 py-2`}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Inbox className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">{tab === 'pending' ? 'No orders pending receipt.' : 'No received orders yet.'}</p>
          </div>
        ) : rows.map((o, idx) => (
          <div key={o.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 text-xs ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="w-8 border-r border-gray-200 flex items-center justify-center text-gray-300 py-2">{idx + 1}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2 font-mono text-gray-400">{o.seqNo || '—'}</div>
            <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium text-gray-800 truncate">{o.projectName || (o.projectId ? getProject(o.projectId) : '—')}</div>
            <div className="w-28 border-r border-gray-200 px-2 py-2 text-gray-600">{o.orderDate ? formatDate(o.orderDate) : '—'}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2 font-semibold text-gray-800">{formatMoney(o.totalAmount)}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGE[o.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {o.status}
              </span>
            </div>
            <div className="w-28 px-2 py-1.5 flex items-center gap-1">
              {tab === 'pending' && o.status === 'submitted' && (
                <Button size="sm" onClick={() => approvePO({ variables: { id: o.id } })}
                  className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2">
                  Approve
                </Button>
              )}
              {tab === 'pending' && (o.status === 'approved' || o.status === 'sent') && (
                <Button size="sm" onClick={() => { setSelected(o); setReceiveDate(today()) }}
                  className="h-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2">
                  <PackageCheck className="h-3 w-3 mr-1" /> Receive
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  )
}
