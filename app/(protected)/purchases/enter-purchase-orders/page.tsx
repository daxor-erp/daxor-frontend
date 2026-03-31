'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, CREATE_PURCHASE_ORDER, GET_VENDORS, GET_PROJECTS, GET_ITEMS, SUBMIT_PURCHASE_ORDER, APPROVE_PURCHASE_ORDER, RECEIVE_PURCHASE_ORDER } from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { Plus, X, Save, Trash2, ShoppingCart, Clock, CheckCircle2, Send, PackageCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const PO_STATUS: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted: { label: 'Submitted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:      { label: 'Sent',      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  received:  { label: 'Received',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

interface Line { desc: string; qty: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', price: '' })
const today = () => new Date().toISOString().split('T')[0]
const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

export default function EnterPurchaseOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 100 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: itemData } = useQuery(GET_ITEMS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_PURCHASE_ORDER, {
    onCompleted: () => { setAdding(false); reset(); refetch() },
  })

  const [submitPO] = useMutation(SUBMIT_PURCHASE_ORDER, { 
    onCompleted: () => refetch(),
    onError: (err) => alert(`Submit failed: ${err.message}`)
  })
  const [approvePO] = useMutation(APPROVE_PURCHASE_ORDER, { 
    onCompleted: () => refetch(),
    onError: (err) => alert(`Approve failed: ${err.message}`)
  })
  const [receivePO] = useMutation(RECEIVE_PURCHASE_ORDER, { 
    onCompleted: () => refetch(),
    onError: (err) => alert(`Receive failed: ${err.message}`)
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ vendorId: '', projectId: '', orderDate: today(), deliveryDate: '', notes: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const vendors = vendorData?.vendors ?? []
  const projects = projectData?.projects ?? []
  const items = itemData?.items ?? []
  const orders = poData?.purchaseorders ?? []

  const reset = () => { setForm({ vendorId: '', projectId: '', orderDate: today(), deliveryDate: '', notes: '' }); setLines([emptyLine()]); setErrors({}) }
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => setLines(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  const pickItem = (i: number, id: string) => {
    const it = items.find((x: any) => x.id === id)
    if (it) setLines(p => p.map((l, idx) => idx === i ? { ...l, desc: it.name, price: String(it.rate ?? '') } : l))
  }

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0), 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.vendorId) e.vendorId = 'Required'
    if (!form.orderDate) e.orderDate = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
      if (!(parseFloat(l.price) > 0)) e[`p${i}`] = '!'
    })
    setErrors(e); return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    const items = lines.map(l => ({
      itemDescription: l.desc,
      quantity: parseFloat(l.qty) || 0,
      unitPrice: parseFloat(l.price) || 0,
      lineTotal: (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0),
    }))
    create({ variables: { input: { vendorId: form.vendorId, projectId: form.projectId || undefined, orderDate: form.orderDate, deliveryDate: form.deliveryDate || undefined, notes: form.notes || undefined, items, subtotal, totalAmount: subtotal, organizationId: orgId } } })
  }

  const getVendor = (id: string) => vendors.find((v: any) => v.id === id || String(v._id) === id)?.name ?? '—'
  const getProject = (id: string) => projects.find((p: any) => p.id === id || String(p._id) === id)?.name ?? '—'

  const stats = {
    total: orders.length,
    draft: orders.filter((o: any) => o.status === 'draft').length,
    approved: orders.filter((o: any) => o.status === 'approved').length,
    received: orders.filter((o: any) => o.status === 'received').length,
  }

  return (
    <PageTemplate title="Enter Purchase Orders" description="Create and manage purchase orders">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total POs',  value: stats.total,    icon: ShoppingCart,  cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft',      value: stats.draft,    icon: Clock,         cls: 'text-gray-500 bg-gray-100' },
          { label: 'Approved',   value: stats.approved, icon: CheckCircle2,  cls: 'text-emerald-600 bg-emerald-50' },
          { label: 'Received',   value: stats.received, icon: PackageCheck,  cls: 'text-indigo-600 bg-indigo-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Inline form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white flex items-center gap-2"><ShoppingCart className="h-3.5 w-3.5" /> New Purchase Order</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          {/* Header fields */}
          <div className="grid grid-cols-5 border-b border-gray-200">
            {[
              { label: 'Vendor *', key: 'vendorId', type: 'select', opts: vendors, err: errors.vendorId },
              { label: 'Project', key: 'projectId', type: 'select', opts: projects, err: '' },
              { label: 'Order Date *', key: 'orderDate', type: 'date', err: errors.orderDate },
              { label: 'Expected Delivery', key: 'deliveryDate', type: 'date', err: '' },
              { label: 'Notes', key: 'notes', type: 'text', err: '' },
            ].map(({ label, key, type, opts, err }: any) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-gray-500'}`}>{label}{err ? ` — ${err}` : ''}</p>
                {type === 'select' ? (
                  <select value={(form as any)[key]} onChange={e => setF(key, e.target.value)} className={err ? cellErr : cell}>
                    <option value="">— select —</option>
                    {opts.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                ) : type === 'text' ? (
                  <input type="text" value={(form as any)[key]} onChange={e => setF(key, e.target.value)} placeholder="Optional notes…" className={cell} />
                ) : (
                  <input type="date" value={(form as any)[key]} onChange={e => setF(key, e.target.value)} className={err ? cellErr : cell} />
                )}
              </div>
            ))}
          </div>

          {/* Line items */}
          <div className="p-3">
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 3rem 1fr 6rem 8rem 7rem 2rem' }}>
                {['#', 'Item', 'Description', 'Qty', 'Unit Price', 'Total', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 3rem 1fr 6rem 8rem 7rem 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <select onChange={e => pickItem(i, e.target.value)} className={`${cell} px-1`}>
                      <option value="">…</option>
                      {items.map((it: any) => <option key={it.id} value={it.id}>{it.name}</option>)}
                    </select>
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description" className={errors[`d${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0" className={errors[`q${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00" className={errors[`p${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-2 py-1 flex items-center">
                    <span className="text-xs font-medium text-gray-700">${((parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-center py-1">
                    {lines.length > 1 && (
                      <button onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t border-dashed border-gray-300 px-2 py-1">
                <button onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add line
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>{saveError && <p className="text-xs text-red-500">{saveError.message}</p>}</div>
              <div className="flex items-center gap-6">
                <div className="text-right space-y-1">
                  <div className="flex gap-8 text-xs text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex gap-8 text-sm font-bold text-gray-800 border-t border-gray-300 pt-1"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                    <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save PO'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Purchase Orders</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New PO
            </Button>
          )}
        </div>
        <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {[['w-8','#'],['w-24','PO #'],['flex-1','Project'],['w-28','Order Date'],['w-28','Delivery'],['w-24','Amount'],['w-36','Notes'],['w-24','Status'],['w-32','Actions']].map(([w,h]) => (
            <div key={h} className={`${w} border-r border-gray-300 last:border-r-0 px-2 py-2`}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ShoppingCart className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No purchase orders yet. Click "New PO" to create one.</p>
          </div>
        ) : orders.map((o: any, idx: number) => {
          const s = PO_STATUS[o.status] ?? PO_STATUS.draft
          return (
            <div key={o.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors text-xs ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="w-8 border-r border-gray-200 flex items-center justify-center text-gray-300 py-2">{idx + 1}</div>
              <div className="w-24 border-r border-gray-200 px-2 py-2 font-mono text-gray-400">{o.seqNo || '—'}</div>
              <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium text-gray-800 truncate">{o.projectName || (o.projectId ? getProject(o.projectId) : '—')}</div>
              <div className="w-28 border-r border-gray-200 px-2 py-2 text-gray-600">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</div>
              <div className="w-28 border-r border-gray-200 px-2 py-2 text-gray-600">{o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : '—'}</div>
              <div className="w-24 border-r border-gray-200 px-2 py-2 font-semibold text-gray-800">
                {(() => {
                  const calc = o.totalAmount || o.items?.reduce((s: number, i: any) => s + ((i.quantity || 0) * (i.unitPrice || 0)), 0) || 0
                  return calc > 0 ? `$${Number(calc).toFixed(2)}` : `${o.items?.length || 0} item(s)`
                })()}
              </div>
              <div className="w-36 border-r border-gray-200 px-2 py-2 text-gray-500 truncate">{o.notes || '—'}</div>
              <div className="w-24 border-r border-gray-200 px-2 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.cls}`}>{s.label}</span></div>
              <div className="w-32 px-2 py-1.5 flex items-center gap-1">
                {o.status === 'draft' && (
                  <Button size="sm" onClick={() => submitPO({ variables: { id: o.id } })} className="h-6 text-xs bg-amber-500 hover:bg-amber-600 text-white px-2">Submit</Button>
                )}
                {o.status === 'submitted' && (
                  <Button size="sm" onClick={() => approvePO({ variables: { id: o.id } })} className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2">Approve</Button>
                )}
                {(o.status === 'approved' || o.status === 'sent') && (
                  <Button size="sm" onClick={() => receivePO({ variables: { id: o.id } })} className="h-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2">Receive</Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </PageTemplate>
  )
}
