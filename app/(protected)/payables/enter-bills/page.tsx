'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_VENDOR_BILLS, CREATE_VENDOR_BILL, UPDATE_VENDOR_BILL,
  APPROVE_VENDOR_BILL, SUBMIT_VENDOR_BILL_FOR_APPROVAL, DELETE_VENDOR_BILL, GET_VENDORS, GET_ITEMS
} from '@/gql/queries'
import { Trash2, Edit, X, Save, Plus, CheckCircle, FileText, Clock, DollarSign } from 'lucide-react'

const EMPTY_LINE = { itemId: '', description: '', quantity: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 }

const EMPTY_FORM = {
  vendorId: '',
  billDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  notes: '',
}

export default function EnterBillsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [lineItems, setLineItems] = useState([{ ...EMPTY_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, error, refetch } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const { data: vendorsData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const [createBill, { loading: saving }] = useMutation(CREATE_VENDOR_BILL, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateBill, { loading: updating }] = useMutation(UPDATE_VENDOR_BILL, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [approveBill] = useMutation(APPROVE_VENDOR_BILL, {
    onCompleted: () => refetch(),
  })

  const [submitBillForApproval] = useMutation(SUBMIT_VENDOR_BILL_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const [deleteBill] = useMutation(DELETE_VENDOR_BILL, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({ ...EMPTY_FORM })
    setLineItems([{ ...EMPTY_LINE }])
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const updateLine = (i: number, k: string, v: string | number) => {
    setLineItems(prev => {
      const lines = [...prev]
      lines[i] = { ...lines[i], [k]: v }
      // recalculate total
      const qty = k === 'quantity' ? Number(v) : Number(lines[i].quantity)
      const price = k === 'unitPrice' ? Number(v) : Number(lines[i].unitPrice)
      const disc = k === 'discount' ? Number(v) : Number(lines[i].discount)
      const tax = k === 'tax' ? Number(v) : Number(lines[i].tax)
      const subtotal = qty * price
      const discAmt = subtotal * (disc / 100)
      const taxAmt = (subtotal - discAmt) * (tax / 100)
      lines[i].total = Math.round((subtotal - discAmt + taxAmt) * 100) / 100
      return lines
    })
  }

  const addLine = () => setLineItems(p => [...p, { ...EMPTY_LINE }])
  const removeLine = (i: number) => setLineItems(p => p.filter((_, idx) => idx !== i))

  const totals = lineItems.reduce((acc, l) => ({
    subtotal: acc.subtotal + (Number(l.quantity) * Number(l.unitPrice)),
    discount: acc.discount + (Number(l.quantity) * Number(l.unitPrice) * (Number(l.discount) / 100)),
    tax: acc.tax + ((Number(l.quantity) * Number(l.unitPrice) - Number(l.quantity) * Number(l.unitPrice) * (Number(l.discount) / 100)) * (Number(l.tax) / 100)),
    total: acc.total + Number(l.total),
  }), { subtotal: 0, discount: 0, tax: 0, total: 0 })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.vendorId) e.vendorId = 'Required'
    if (!form.billDate) e.billDate = 'Required'
    if (!form.dueDate) e.dueDate = 'Required'
    if (lineItems.length === 0 || !lineItems[0].description) e.lines = 'At least one line item required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      vendorId: form.vendorId,
      billDate: form.billDate,
      dueDate: form.dueDate,
      notes: form.notes,
      lineItems: lineItems.map(l => ({
        description: l.description,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        discount: Number(l.discount),
        tax: Number(l.tax),
        total: Number(l.total),
      })),
      subtotal: Math.round(totals.subtotal * 100) / 100,
      discountAmount: Math.round(totals.discount * 100) / 100,
      taxAmount: Math.round(totals.tax * 100) / 100,
      totalAmount: Math.round(totals.total * 100) / 100,
      organizationId: orgId,
    }
    if (editing) {
      const { organizationId, ...updateInput } = input as any
      updateBill({ variables: { id: editing, input: updateInput } })
    } else {
      createBill({ variables: { input } })
    }
  }

  const bills = data?.vendorBills ?? []
  const vendors = vendorsData?.vendors ?? []
  const items = itemsData?.items ?? []

  const handleItemSelect = (lineIndex: number, itemId: string) => {
    const item = items.find((i: any) => i.id === itemId)
    if (!item) return
    setLineItems(prev => {
      const lines = [...prev]
      lines[lineIndex] = {
        ...lines[lineIndex],
        itemId,
        description: item.name,
        unitPrice: item.rate || 0,
        total: Math.round((Number(lines[lineIndex].quantity) * (item.rate || 0)) * 100) / 100,
      }
      return lines
    })
  }

  const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    submitted: 'bg-amber-50 text-amber-800 border-amber-200',
    approval_declined: 'bg-red-50 text-red-700 border-red-200',
    approved: 'bg-blue-50 text-blue-700 border-blue-200',
    partially_paid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const statusDisplay = (s: string) => {
    const x = (s || '').toLowerCase()
    if (x === 'submitted') return 'pending approval'
    if (x === 'approval_declined') return 'declined'
    return x.replace('_', ' ')
  }

  const stats = {
    total: bills.length,
    outstanding: bills.filter((b: any) => ['approved', 'partially_paid'].includes(b.status)).length,
    paid: bills.filter((b: any) => b.status === 'paid').length,
    totalOwed: bills.filter((b: any) => b.status !== 'paid' && b.status !== 'cancelled')
      .reduce((s: number, b: any) => s + (b.outstandingAmount || 0), 0),
  }

  const columns: Column[] = [
    { key: 'billNumber', label: 'Bill #', width: '130px', render: v => <span className="font-mono text-xs text-gray-600">{v}</span> },
    { key: 'vendor', label: 'Vendor', render: (_v, row) => <span className="font-medium">{row.vendor?.name || '—'}</span> },
    { key: 'billDate', label: 'Bill Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'totalAmount', label: 'Total', width: '110px', align: 'right', render: v => <span className="font-semibold">${Number(v).toFixed(2)}</span> },
    { key: 'paidAmount', label: 'Paid', width: '100px', align: 'right', render: v => <span className="text-green-600">${Number(v).toFixed(2)}</span> },
    { key: 'outstandingAmount', label: 'Outstanding', width: '110px', align: 'right', render: v => <span className="font-semibold text-red-600">${Number(v).toFixed(2)}</span> },
    {
      key: 'status', label: 'Status', width: '130px',
      render: (v) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[String(v)] || statusColor.draft}`}>
          {statusDisplay(String(v))}
        </span>
      ),
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '168px',
      render: (_v, row: any) => {
        const st = String(row.status || '')
        const showSubmit = st === 'draft' || st === 'approval_declined'
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            {showSubmit ? (
              <select
                aria-label="Vendor bill approval action"
                className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2"
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  if (val === 'submit') submitBillForApproval({ variables: { id: row.id } })
                }}
              >
                <option value="">Change status…</option>
                <option value="submit">Send for approval</option>
              </select>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enter Bills</h1>
        <p className="text-gray-500">Record vendor invoices (Accounts Payable)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Bills', value: stats.total, icon: FileText, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Outstanding', value: stats.outstanding, icon: Clock, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Paid', value: stats.paid, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Total Owed', value: `$${stats.totalOwed.toFixed(2)}`, icon: DollarSign, cls: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Bill' : 'New Vendor Bill'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-4">
            {/* Header fields */}
            <div className="grid grid-cols-3 gap-3">
              <SelectFloating
                label="Vendor *"
                value={form.vendorId}
                onChange={e => setF('vendorId', typeof e === 'string' ? e : e.target.value)}
                options={[{ value: '', label: 'Select vendor...' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
                error={errors.vendorId}
                className="h-7 text-xs"
              />
              <InputFloating label="Bill Date *" type="date" value={form.billDate} onChange={e => setF('billDate', e.target.value)} error={errors.billDate} className="h-7 text-xs" />
              <InputFloating label="Due Date *" type="date" value={form.dueDate} onChange={e => setF('dueDate', e.target.value)} error={errors.dueDate} className="h-7 text-xs" />
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Line Items</span>
                {errors.lines && <span className="text-xs text-red-500">{errors.lines}</span>}
              </div>
              <table className="w-full text-xs border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-600 w-40">Item</th>
                    <th className="text-left p-2 font-medium text-gray-600">Description</th>
                    <th className="text-right p-2 font-medium text-gray-600 w-20">Qty</th>
                    <th className="text-right p-2 font-medium text-gray-600 w-24">Unit Price</th>
                    <th className="text-right p-2 font-medium text-gray-600 w-20">Disc %</th>
                    <th className="text-right p-2 font-medium text-gray-600 w-20">Tax %</th>
                    <th className="text-right p-2 font-medium text-gray-600 w-24">Total</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((line, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="p-1">
                        <select
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                          value={line.itemId}
                          onChange={e => handleItemSelect(i, e.target.value)}
                        >
                          <option value="">— select item —</option>
                          {items.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1"><input className="w-full border border-gray-200 rounded px-2 py-1 text-xs" value={line.description} onChange={e => updateLine(i, 'description', e.target.value)} placeholder="Description" /></td>
                      <td className="p-1"><input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right" type="number" value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)} /></td>
                      <td className="p-1"><input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right" type="number" value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', e.target.value)} /></td>
                      <td className="p-1"><input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right" type="number" value={line.discount} onChange={e => updateLine(i, 'discount', e.target.value)} /></td>
                      <td className="p-1"><input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right" type="number" value={line.tax} onChange={e => updateLine(i, 'tax', e.target.value)} /></td>
                      <td className="p-1 text-right font-semibold pr-2">${line.total.toFixed(2)}</td>
                      <td className="p-1"><button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-600"><X className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addLine} className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                <Plus className="h-3.5 w-3.5" /> Add Line
              </button>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-${totals.discount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${totals.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-sm border-t pt-1"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
              </div>
            </div>

            <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} className="text-xs" />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update Bill' : 'Save Bill'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={bills}
        columns={columns}
        loading={loading}
        title={error ? `Error: ${error.message}` : 'All Bills'}
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Bill"
        searchable
        searchPlaceholder="Search bills..."
        emptyMessage="No bills yet. Click 'New Bill' to record a vendor invoice."
        actions={[
          {
            label: 'Approve',
            icon: <CheckCircle className="h-3.5 w-3.5" />,
            show: (row) => row.status === 'draft',
            onClick: row => { if (confirm('Approve this bill without routing through the approver queue?')) approveBill({ variables: { id: row.id } }) },
            variant: 'ghost',
          },
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => { setEditing(row.id); setAdding(true) }, variant: 'ghost' },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: row => { if (confirm('Delete this bill?')) deleteBill({ variables: { id: row.id } }) },
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
