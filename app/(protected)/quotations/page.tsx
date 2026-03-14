'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Plus, X, Save, Trash2, FileText, Clock, CheckCircle2, Send } from 'lucide-react'

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
    }
  }
`

const GET_ITEMS = gql`
  query GetItems($organizationId: ID!) {
    items(organizationId: $organizationId, page: 1, limit: 1000) {
      id
      name
      description
      rate
      unit
    }
  }
`

const GET_QUOTATIONS = gql`
  query GetQuotations {
    quotations {
      id
      quotationNumber
      clientId {
        id
        name
        email
      }
      subject
      quotationDate
      validUntil
      totalAmount
      status
      sentAt
    }
  }
`

const CREATE_QUOTATION = gql`
  mutation CreateQuotation($input: CreateQuotationInput!) {
    createQuotation(input: $input) {
      id
      quotationNumber
    }
  }
`

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  sent: { label: 'Sent', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
  expired: { label: 'Expired', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
}

interface Line { itemId: string; desc: string; qty: string; price: string; discount: string; tax: string }
const emptyLine = (): Line => ({ itemId: '', desc: '', qty: '1', price: '0', discount: '0', tax: '0' })
const today = () => new Date().toISOString().split('T')[0]
const in30Days = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

export default function CreateQuotationsPage() {
  const { data: clientsData } = useQuery(GET_CLIENTS)
  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: '507f1f77bcf86cd799439011' }
  })
  const { data: quotationsData, loading, refetch } = useQuery(GET_QUOTATIONS)
  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_QUOTATION, {
    onCompleted: () => { setAdding(false); reset(); refetch() },
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ clientId: '', subject: '', quotationDate: today(), validUntil: in30Days(), terms: '', notes: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clients = clientsData?.clients ?? []
  const items = itemsData?.items ?? []
  const quotations = quotationsData?.quotations ?? []

  const reset = () => { 
    setForm({ clientId: '', subject: '', quotationDate: today(), validUntil: in30Days(), terms: '', notes: '' })
    setLines([emptyLine()])
    setErrors({}) 
  }
  
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => {
    const updated = lines.map((l, idx) => {
      if (idx !== i) return l
      const newLine = { ...l, [k]: v }
      // If itemId changed, auto-fill description and price
      if (k === 'itemId' && v) {
        const item = items.find((it: any) => it.id === v)
        if (item) {
          newLine.desc = item.name
          newLine.price = item.rate?.toString() || '0'
        }
      }
      return newLine
    })
    setLines(updated)
  }

  const calculateLineTotal = (l: Line) => {
    const qty = parseFloat(l.qty) || 0
    const price = parseFloat(l.price) || 0
    const discount = parseFloat(l.discount) || 0
    const tax = parseFloat(l.tax) || 0
    
    const subtotal = qty * price
    const discountAmount = subtotal * (discount / 100)
    const taxAmount = (subtotal - discountAmount) * (tax / 100)
    return subtotal - discountAmount + taxAmount
  }

  const calculateTotals = () => {
    const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0), 0)
    const discountAmount = lines.reduce((s, l) => {
      const itemSubtotal = (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0)
      return s + itemSubtotal * ((parseFloat(l.discount) || 0) / 100)
    }, 0)
    const taxAmount = lines.reduce((s, l) => {
      const itemSubtotal = (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0)
      const itemDiscount = itemSubtotal * ((parseFloat(l.discount) || 0) / 100)
      return s + (itemSubtotal - itemDiscount) * ((parseFloat(l.tax) || 0) / 100)
    }, 0)
    const totalAmount = subtotal - discountAmount + taxAmount
    return { subtotal, discountAmount, taxAmount, totalAmount }
  }

  const totals = calculateTotals()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.clientId) e.clientId = 'Required'
    if (!form.subject) e.subject = 'Required'
    if (!form.quotationDate) e.quotationDate = 'Required'
    if (!form.validUntil) e.validUntil = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
      if (!(parseFloat(l.price) >= 0)) e[`p${i}`] = '!'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    
    const lineItems = lines.map(l => ({
      itemId: l.itemId || undefined,
      description: l.desc,
      quantity: parseFloat(l.qty),
      unitPrice: parseFloat(l.price),
      discount: parseFloat(l.discount) || 0,
      tax: parseFloat(l.tax) || 0,
      total: calculateLineTotal(l)
    }))

    create({
      variables: {
        input: {
          clientId: form.clientId,
          subject: form.subject,
          quotationDate: form.quotationDate,
          validUntil: form.validUntil,
          lineItems,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
          terms: form.terms,
          notes: form.notes,
          organizationId: '507f1f77bcf86cd799439011',
        },
      },
    })
  }

  const stats = {
    total: quotations.length,
    draft: quotations.filter((q: any) => q.status === 'draft').length,
    sent: quotations.filter((q: any) => q.status === 'sent').length,
    accepted: quotations.filter((q: any) => q.status === 'accepted').length,
  }

  const getClient = (id: string) => clients.find((c: any) => c.id === id)?.name ?? id

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Create Quotations</h1>
          <p className="text-gray-500">Create and manage quotations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, cls: 'text-gray-500 bg-gray-100' },
          { label: 'Sent', value: stats.sent, icon: Send, cls: 'text-indigo-600 bg-indigo-50' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50' },
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
            <span className="text-xs font-semibold text-white">New Quotation</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          {/* Header fields grid */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            {[
              { label: 'Client *', key: 'clientId', type: 'select', opts: clients, err: errors.clientId },
              { label: 'Subject *', key: 'subject', type: 'text', err: errors.subject },
              { label: 'Quotation Date *', key: 'quotationDate', type: 'date', err: errors.quotationDate },
              { label: 'Valid Until *', key: 'validUntil', type: 'date', err: errors.validUntil },
            ].map(({ label, key, type, opts, err }: any) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-gray-500'}`}>{label}{err ? ` — ${err}` : ''}</p>
                {type === 'select' ? (
                  <select value={(form as any)[key]} onChange={e => setF(key, e.target.value)}
                    className={err ? cellErr : cell}>
                    <option value="">— select —</option>
                    {opts.map((o: any) => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
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
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 12rem 1fr 6rem 8rem 6rem 6rem 8rem 2rem' }}>
                {['#', 'Item', 'Description', 'Qty', 'Unit Price', 'Disc %', 'Tax %', 'Line Total', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>

              {/* Line rows */}
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 12rem 1fr 6rem 8rem 6rem 6rem 8rem 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <select value={l.itemId} onChange={e => setL(i, 'itemId', e.target.value)}
                      className={cell}>
                      <option value="">— select item —</option>
                      {items.map((item: any) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description"
                      className={errors[`d${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="1"
                      className={errors[`q${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00"
                      className={errors[`p${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" max="100" step="0.1" value={l.discount} onChange={e => setL(i, 'discount', e.target.value)} placeholder="0"
                      className={cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" max="100" step="0.1" value={l.tax} onChange={e => setL(i, 'tax', e.target.value)} placeholder="0"
                      className={cell} />
                  </div>
                  <div className="border-r border-gray-200 px-2 py-1 flex items-center">
                    <span className="text-xs font-medium text-gray-700">
                      ${calculateLineTotal(l).toFixed(2)}
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

            {/* Additional fields */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs mb-1 font-medium text-gray-500">Terms & Conditions</p>
                <textarea value={form.terms} onChange={e => setF('terms', e.target.value)} 
                  placeholder="Enter terms and conditions"
                  className="border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-xs px-2 py-1.5 w-full rounded-sm resize-none"
                  rows={3} />
              </div>
              <div>
                <p className="text-xs mb-1 font-medium text-gray-500">Notes</p>
                <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} 
                  placeholder="Enter additional notes"
                  className="border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-xs px-2 py-1.5 w-full rounded-sm resize-none"
                  rows={3} />
              </div>
            </div>

            {/* Totals + actions */}
            <div className="flex items-end justify-between mt-3">
              <div>
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right space-y-1">
                  <div className="flex gap-8 text-xs text-gray-500">
                    <span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-8 text-xs text-gray-500">
                    <span>Discount</span><span>-${totals.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-8 text-xs text-gray-500">
                    <span>Tax</span><span>${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-8 text-sm font-bold text-gray-800 border-t border-gray-300 pt-1">
                    <span>Total</span><span>${totals.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                    <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Quotation'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotations grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Quotations</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New Quotation
            </Button>
          )}
        </div>

        {/* Header */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-300">
          <div className="w-8 border-r border-gray-300 py-2 flex items-center justify-center text-xs text-gray-400">#</div>
          {['Quotation #', 'Client', 'Subject', 'Date', 'Valid Until', 'Amount', 'Status'].map((h, i) => (
            <div key={h} className={`border-r border-gray-300 last:border-r-0 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ${i === 0 ? 'w-28' : i === 1 ? 'flex-1' : i === 2 ? 'w-48' : i === 3 || i === 4 ? 'w-28' : i === 5 ? 'w-28' : 'w-24'}`}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No quotations yet. Click "New Quotation" to create one.</p>
          </div>
        ) : (
          quotations.map((quot: any, idx: number) => {
            const s = STATUS_CFG[quot.status] ?? STATUS_CFG.draft
            return (
              <div key={quot.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">{idx + 1}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-700 font-semibold">{quot.quotationNumber}</div>
                <div className="flex-1 border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-800 truncate">{quot.clientId.name}</div>
                <div className="w-48 border-r border-gray-200 px-2 py-2 text-xs text-gray-600 truncate">{quot.subject}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{new Date(quot.quotationDate).toLocaleDateString()}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{new Date(quot.validUntil).toLocaleDateString()}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-800">${Number(quot.totalAmount).toFixed(2)}</div>
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
