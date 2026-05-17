'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, GET_VENDORS, UPDATE_PURCHASE_ORDER } from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { FileText, X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'
const today = () => new Date().toISOString().split('T')[0]

const REASONS = [
  'Overcharged by vendor',
  'Goods returned to vendor',
  'Defective / damaged goods',
  'Short delivery',
  'Wrong items delivered',
  'Duplicate invoice',
  'Other',
]

export default function DebitNotePage() {
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
  const [update, { loading: issuing }] = useMutation(UPDATE_PURCHASE_ORDER, {
    onCompleted: () => { setSelected(null); resetForm(); refetch() },
  })

  const [tab, setTab] = useState<'eligible' | 'issued'>('eligible')
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState({ amount: '', reason: '', date: today(), notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const orders: any[] = poData?.purchaseorders ?? []
  const vendors: any[] = vendorData?.vendors ?? []
  const getVendor = (id: string) => vendors.find(v => v.id === id)?.name ?? id

  // Eligible = received POs (not yet cancelled — debit note raises a dispute)
  const eligible = orders.filter(o => o.status === 'received')
  // Issued = cancelled POs (debit note processed → vendor credit applied → cancelled)
  const issued = orders.filter(o => o.status === 'cancelled')

  const resetForm = () => { setForm({ amount: '', reason: '', date: today(), notes: '' }); setErrors({}) }

  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    const amt = parseFloat(form.amount)
    if (!form.amount || !(amt > 0)) e.amount = 'Enter a valid amount'
    if (amt > Number(selected?.totalAmount)) e.amount = 'Cannot exceed PO total'
    if (!form.reason) e.reason = 'Required'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleIssue = () => {
    if (!validate()) return
    update({ variables: { id: selected.id, input: { status: 'cancelled' } } })
  }

  const rows = tab === 'eligible' ? eligible : issued

  return (
    <PageTemplate title="Debit Notes" description="Raise debit notes against received purchase orders">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Eligible POs',   value: eligible.length, icon: Clock,         cls: 'text-amber-600 bg-amber-50' },
          { label: 'Debit Notes Issued', value: issued.length, icon: FileText,    cls: 'text-blue-600 bg-blue-50' },
          { label: 'Total POs',      value: orders.length,   icon: CheckCircle2,  cls: 'text-gray-500 bg-gray-100' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Issue dialog */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-lg">
              <span className="text-sm font-semibold text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Issue Debit Note</span>
              <button onClick={() => { setSelected(null); resetForm() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              {/* PO summary */}
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">PO #</span><span className="font-mono text-gray-700">{selected.seqNo || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Vendor</span><span className="font-medium text-gray-800">{getVendor(selected.vendorId)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">PO Total</span><span className="font-semibold text-gray-800">{formatMoney(selected.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Order Date</span><span className="text-gray-600">{selected.orderDate ? formatDate(selected.orderDate) : '—'}</span></div>
              </div>

              {/* Debit amount */}
              <div>
                <p className={`text-xs mb-1 font-medium ${errors.amount ? 'text-red-500' : 'text-gray-500'}`}>
                  Debit Amount *{errors.amount ? ` — ${errors.amount}` : ''}
                </p>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                  <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setF('amount', e.target.value)}
                    placeholder="0.00" className={`${errors.amount ? cellErr : cell} pl-5`} />
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className={`text-xs mb-1 font-medium ${errors.reason ? 'text-red-500' : 'text-gray-500'}`}>
                  Reason *{errors.reason ? ` — ${errors.reason}` : ''}
                </p>
                <select value={form.reason} onChange={e => setF('reason', e.target.value)} className={errors.reason ? cellErr : cell}>
                  <option value="">— select reason —</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <p className={`text-xs mb-1 font-medium ${errors.date ? 'text-red-500' : 'text-gray-500'}`}>
                  Debit Note Date *{errors.date ? ` — ${errors.date}` : ''}
                </p>
                <input type="date" value={form.date} onChange={e => setF('date', e.target.value)} className={errors.date ? cellErr : cell} />
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs mb-1 font-medium text-gray-500">Notes</p>
                <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2}
                  placeholder="Additional details…"
                  className="border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 py-1.5 w-full rounded-sm resize-none" />
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded p-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">Issuing a debit note will mark this PO as cancelled and notify the vendor of the disputed amount.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => { setSelected(null); resetForm() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleIssue} disabled={issuing} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]">
                <FileText className="h-3.5 w-3.5 mr-1" />{issuing ? 'Issuing…' : 'Issue Debit Note'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs + Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-300">
          {(['eligible', 'issued'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${tab === t ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}>
              {t === 'eligible' ? `Eligible POs (${eligible.length})` : `Issued (${issued.length})`}
            </button>
          ))}
        </div>

        <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {[['w-8','#'],['w-24','PO #'],['flex-1','Vendor'],['w-28','Order Date'],['w-24','Amount'],['w-24','Status'],['w-28','']].map(([w,h]) => (
            <div key={h} className={`${w} border-r border-gray-300 last:border-r-0 px-2 py-2`}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">{tab === 'eligible' ? 'No received POs eligible for debit notes.' : 'No debit notes issued yet.'}</p>
          </div>
        ) : rows.map((o, idx) => (
          <div key={o.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 text-xs ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="w-8 border-r border-gray-200 flex items-center justify-center text-gray-300 py-2">{idx + 1}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2 font-mono text-gray-400">{o.seqNo || '—'}</div>
            <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium text-gray-800 truncate">{getVendor(o.vendorId)}</div>
            <div className="w-28 border-r border-gray-200 px-2 py-2 text-gray-600">{o.orderDate ? formatDate(o.orderDate) : '—'}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2 font-semibold text-gray-800">{formatMoney(o.totalAmount)}</div>
            <div className="w-24 border-r border-gray-200 px-2 py-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                o.status === 'received'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                o.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                'bg-gray-100 text-gray-600 border-gray-200'
              }`}>{o.status}</span>
            </div>
            <div className="w-28 px-2 py-1.5 flex items-center">
              {tab === 'eligible' && (
                <Button size="sm" onClick={() => { setSelected(o); resetForm() }}
                  className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2">
                  <FileText className="h-3 w-3 mr-1" /> Issue
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  )
}
