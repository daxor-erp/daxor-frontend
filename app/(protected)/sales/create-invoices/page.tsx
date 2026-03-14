'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CUSTOMER_INVOICES, CREATE_CUSTOMER_INVOICE, GET_ORGANIZATIONS, GET_SALES_ORDERS } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Plus, X, Save, Trash2, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:          { label: 'Draft',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  approved:       { label: 'Approved', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:           { label: 'Sent',     cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  partially_paid: { label: 'Partial',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:           { label: 'Paid',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:        { label: 'Overdue',  cls: 'bg-red-50 text-red-700 border-red-200' },
  cancelled:      { label: 'Cancelled',cls: 'bg-rose-50 text-rose-600 border-rose-200' },
}

interface Line { desc: string; qty: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', price: '' })
const today = () => new Date().toISOString().split('T')[0]

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

export default function CreateInvoicesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: invData, loading, refetch } = useQuery(GET_CUSTOMER_INVOICES, { variables: { organizationId: orgId, page: 1, limit: 100 }, skip: !orgId })
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 200 } })
  const { data: soData } = useQuery(GET_SALES_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_CUSTOMER_INVOICE, {
    onCompleted: () => { setAdding(false); reset(); refetch() },
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ customerId: '', salesOrderId: '', invoiceDate: today(), dueDate: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const orgs = orgsData?.organizations ?? []
  const salesOrders = soData?.salesorders ?? []
  const invoices = invData?.customerinvoices ?? []

  const reset = () => { setForm({ customerId: '', salesOrderId: '', invoiceDate: today(), dueDate: '' }); setLines([emptyLine()]); setErrors({}) }
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => setLines(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0), 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerId) e.customerId = 'Required'
    if (!form.invoiceDate) e.invoiceDate = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
      if (!(parseFloat(l.price) > 0)) e[`p${i}`] = '!'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    create({ variables: { input: { customerId: form.customerId, salesOrderId: form.salesOrderId || undefined, invoiceDate: form.invoiceDate, dueDate: form.dueDate || undefined, totalAmount: subtotal, organizationId: orgId } } })
  }

  const stats = { total: invoices.length, draft: invoices.filter((i: any) => i.status === 'draft').length, paid: invoices.filter((i: any) => i.status === 'paid').length, overdue: invoices.filter((i: any) => i.status === 'overdue').length }
  const getOrg = (id: string) => orgs.find((o: any) => o.id === id)?.name ?? id
  const getSO = (id: string) => salesOrders.find((s: any) => s.id === id)?.seqNo ?? id

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Create Invoices</h1>
          <p className="text-gray-500">Create and manage customer invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, cls: 'text-gray-500 bg-gray-100' },
          { label: 'Paid', value: stats.paid, icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50' },
          { label: 'Overdue', value: stats.overdue, icon: XCircle, cls: 'text-red-500 bg-red-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Inline form panel */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm mb-4 overflow-hidden">
          {/* Form toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Invoice</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          {/* Header fields grid */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            {[
              { label: 'Client *', key: 'customerId', type: 'select', opts: orgs, err: errors.customerId },
              { label: 'Sales Order', key: 'salesOrderId', type: 'select', opts: salesOrders.map((s: any) => ({ id: s.id, name: s.seqNo || s.id })), err: '' },
              { label: 'Invoice Date *', key: 'invoiceDate', type: 'date', err: errors.invoiceDate },
              { label: 'Due Date', key: 'dueDate', type: 'date', err: '' },
            ].map(({ label, key, type, opts, err }: any) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-gray-500'}`}>{label}{err ? ` — ${err}` : ''}</p>
                {type === 'select' ? (
                  <select value={(form as any)[key]} onChange={e => setF(key, e.target.value)}
                    className={err ? cellErr : cell}>
                    <option value="">— select —</option>
                    {opts.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                ) : (
                  <input type={type} value={(form as any)[key]} onChange={e => setF(key, e.target.value)}
                    className={err ? cellErr : cell} />
                )}
              </div>
            ))}
          </div>

          {/* Line items spreadsheet */}
          <div className="p-2">
            <div className="border border-gray-300 rounded overflow-hidden">
              {/* Line header */}
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                {['#', 'Description', 'Qty', 'Unit Price', 'Line Total', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>

              {/* Line rows */}
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description"
                      className={errors[`d${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0"
                      className={errors[`q${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00"
                      className={errors[`p${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-2 py-1 flex items-center">
                    <span className="text-xs font-medium text-gray-700">
                      ${((parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0)).toFixed(2)}
                    </span>
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

              {/* Add line row */}
              <div className="border-t border-dashed border-gray-300 px-2 py-1">
                <button onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add line
                </button>
              </div>
            </div>

            {/* Totals + actions */}
            <div className="flex items-end justify-between mt-3">
              <div>
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex gap-8 text-xs text-gray-500 mb-1">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-8 text-sm font-bold text-gray-800 border-t border-gray-300 pt-1">
                    <span>Total</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                    <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Invoice'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Invoices</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New Invoice
            </Button>
          )}
        </div>

        {/* Header */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-300">
          <div className="w-8 border-r border-gray-300 py-2 flex items-center justify-center text-xs text-gray-400">#</div>
          {['Code', 'Client', 'Sales Order', 'Invoice Date', 'Due Date', 'Total', 'Paid', 'Status'].map((h, i) => (
            <div key={h} className={`border-r border-gray-300 last:border-r-0 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ${i === 1 ? 'flex-1' : i === 0 ? 'w-24' : i === 2 ? 'w-28' : i === 3 || i === 4 ? 'w-28' : i === 5 || i === 6 ? 'w-24' : 'w-24'}`}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No invoices yet. Click "New Invoice" to create one.</p>
          </div>
        ) : (
          invoices.map((inv: any, idx: number) => {
            const s = STATUS_CFG[inv.status] ?? STATUS_CFG.draft
            return (
              <div key={inv.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">{idx + 1}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-400">{inv.seqNo || '—'}</div>
                <div className="flex-1 border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-800 truncate">{getOrg(inv.customerId)}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-500">{inv.salesOrderId ? getSO(inv.salesOrderId) : '—'}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : '—'}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-800">${Number(inv.totalAmount).toFixed(2)}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">${Number(inv.paidAmount ?? 0).toFixed(2)}</div>
                <div className="w-24 px-2 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.cls}`}>{s.label}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
