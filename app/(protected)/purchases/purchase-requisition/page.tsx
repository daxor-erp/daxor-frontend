'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, CREATE_PURCHASE_ORDER, GET_VENDORS, GET_PROJECTS, GET_ITEMS } from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { Plus, X, Save, Trash2, ClipboardList, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted: { label: 'Submitted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

const PRIORITY = ['Low', 'Normal', 'High', 'Urgent']
interface Line { desc: string; qty: string; unit: string; reason: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', unit: 'pcs', reason: '', price: '0' })
const today = () => new Date().toISOString().split('T')[0]

export default function PurchaseRequisitionPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, error: poError, refetch } = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 100 }, skip: !orgId })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: itemData } = useQuery(GET_ITEMS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_PURCHASE_ORDER, {
    onCompleted: () => { setAdding(false); reset(); refetch() },
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ vendorId: '', projectId: '', requiredDate: '', priority: 'Normal', notes: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const projects = projectData?.projects ?? []
  const items = itemData?.items ?? []
  const vendors = vendorData?.vendors ?? []
  // PRs = draft POs (internal requests not yet converted to real POs)
  const requisitions = (poData?.purchaseorders ?? []).filter((o: any) => o.status === 'draft' || o.status === 'submitted')

  const reset = () => { setForm({ vendorId: '', projectId: '', requiredDate: '', priority: 'Normal', notes: '' }); setLines([emptyLine()]); setErrors({}) }
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => setLines(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  const pickItem = (i: number, id: string) => {
    const it = items.find((x: any) => x.id === id)
    if (it) setLines(p => p.map((l, idx) => idx === i ? { ...l, desc: it.name, unit: it.unit || 'pcs', price: String(it.rate || 0) } : l))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.requiredDate) e.requiredDate = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
    })
    setErrors(e); return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    const items = lines.map(l => ({
      itemDescription: l.desc,
      quantity: parseFloat(l.qty) || 1,
      unitPrice: parseFloat(l.price) || 0,
      lineTotal: (parseFloat(l.qty) || 1) * (parseFloat(l.price) || 0),
    }))
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
    create({ variables: { input: {
      vendorId: form.vendorId || undefined,
      projectId: form.projectId || undefined,
      orderDate: today(),
      items,
      subtotal,
      totalAmount: subtotal,
      organizationId: orgId,
    } } })
  }

  const getProject = (id: string) => {
    if (!id) return '—'
    const found = projects.find((p: any) => p.id === id || String(p._id) === id)
    return found?.name ?? `(ID: ${id.slice(-6)})`
  }

  const stats = {
    total: requisitions.length,
    pending: requisitions.filter((r: any) => r.status === 'submitted').length,
    approved: (poData?.purchaseorders ?? []).filter((o: any) => o.status === 'approved').length,
  }

  return (
    <PageTemplate title="Purchase Requisition" description="Raise internal purchase requests for approval">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total PRs',  value: stats.total,    icon: ClipboardList, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Pending',    value: stats.pending,  icon: Clock,         cls: 'text-amber-600 bg-amber-50' },
          { label: 'Approved',   value: stats.approved, icon: CheckCircle2,  cls: 'text-emerald-600 bg-emerald-50' },
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
            <span className="text-xs font-semibold text-white flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5" /> New Purchase Requisition</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-200">
            {[
              { label: 'Vendor', key: 'vendorId', type: 'select', opts: vendors },
              { label: 'Project', key: 'projectId', type: 'select', opts: projects },
              { label: 'Required By *', key: 'requiredDate', type: 'date' },
              { label: 'Priority', key: 'priority', type: 'priority' },
              { label: 'Notes', key: 'notes', type: 'text' },
            ].map(({ label, key, type, opts }: any) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${errors[key] ? 'text-red-500' : 'text-gray-500'}`}>{label}{errors[key] ? ` — ${errors[key]}` : ''}</p>
                {type === 'select' ? (
                  <CellSelect
                    value={(form as any)[key]}
                    onChange={e => setF(key, e.target.value)}
                    placeholder="— select —"
                    options={opts.map((o: any) => ({ value: o.id, label: o.name }))}
                  />
                ) : type === 'priority' ? (
                  <CellSelect
                    value={form.priority}
                    onChange={e => setF('priority', e.target.value)}
                    options={PRIORITY.map(p => ({ value: p, label: p }))}
                  />
                ) : type === 'date' ? (
                  <CellInput type="date" value={(form as any)[key]} onChange={e => setF(key, e.target.value)} invalid={!!errors[key]} />
                ) : (
                  <CellInput type="text" value={(form as any)[key]} onChange={e => setF(key, e.target.value)} placeholder="Optional notes…" />
                )}
              </div>
            ))}
          </div>

          {/* Line items */}
          <div className="p-3">
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 3rem 1fr 5rem 5rem 6rem 1fr 2rem' }}>
                {['#', 'Item', 'Description', 'Qty', 'Unit', 'Unit Price', 'Reason / Justification', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 3rem 1fr 5rem 5rem 6rem 1fr 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellSelect
                      className="px-1"
                      onChange={e => pickItem(i, e.target.value)}
                      placeholder="…"
                      options={items.map((it: any) => ({ value: it.id, label: it.name }))}
                    />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description" invalid={!!errors[`d${i}`]} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0" invalid={!!errors[`q${i}`]} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.unit} onChange={e => setL(i, 'unit', e.target.value)} placeholder="pcs" />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.reason} onChange={e => setL(i, 'reason', e.target.value)} placeholder="Why is this needed?" />
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

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> This requisition will be submitted for approval before a PO is raised.
              </div>
              <div className="flex gap-2">
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
                <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]">
                  <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Submitting…' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Purchase Requisitions</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New Requisition
            </Button>
          )}
        </div>
        <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {[['w-8','#'],['w-24','PR #'],['flex-1','Project'],['w-32','Vendor'],['w-28','Required By'],['w-32','Items'],['w-24','Amount'],['w-24','Status']].map(([w,h]) => (
            <div key={h} className={`${w} border-r border-gray-300 last:border-r-0 px-2 py-2`}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : requisitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ClipboardList className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">{poError ? `Error: ${poError.message}` : 'No requisitions yet. Click "New Requisition" to raise one.'}</p>
          </div>
        ) : requisitions.map((r: any, idx: number) => {
          const s = STATUS_CFG[r.status] ?? STATUS_CFG.draft
          const projectName = r.projectId ? getProject(r.projectId) : '—'
          const itemCount = r.items?.length ?? 0
          return (
            <div key={r.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors text-xs ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="w-8 border-r border-gray-200 flex items-center justify-center text-gray-300 py-2">{idx + 1}</div>
              <div className="w-24 border-r border-gray-200 px-2 py-2 font-mono text-gray-400">{r.seqNo || '—'}</div>
              <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium text-gray-800">{projectName}</div>
              <div className="w-32 border-r border-gray-200 px-2 py-2 text-gray-600">{r.vendorName || '—'}</div>
              <div className="w-28 border-r border-gray-200 px-2 py-2 text-gray-600">{r.orderDate ? formatDate(r.orderDate) : '—'}</div>
              <div className="w-32 border-r border-gray-200 px-2 py-2 text-gray-600">{itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : '—'}</div>
              <div className="w-24 border-r border-gray-200 px-2 py-2 font-semibold text-gray-800">
                {(() => {
                  const total = r.totalAmount || r.items?.reduce((s: number, i: any) => s + ((i.quantity || 0) * (i.unitPrice || 0)), 0) || 0
                  return total > 0 ? `${formatMoney(total)}` : '—'
                })()}
              </div>
              <div className="w-24 px-2 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.cls}`}>{s.label}</span></div>
            </div>
          )
        })}
      </div>
    </PageTemplate>
  )
}
