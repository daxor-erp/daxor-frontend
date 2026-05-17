'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_VENDOR_PREPAYMENTS, CREATE_VENDOR_PREPAYMENT, DELETE_VENDOR_PREPAYMENT, GET_VENDORS } from '@/gql/queries'
import { X, Save, Trash2, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
]

export default function EnterVendorPrepaymentPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    vendorId: '',
    prepaymentDate: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMethod: 'bank_transfer',
    referenceNumber: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_VENDOR_PREPAYMENTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: vendorsData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createPrepayment, { loading: saving }] = useMutation(CREATE_VENDOR_PREPAYMENT, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
    onError: err => setErrors({ submit: err.message }),
  })

  const [deletePrepayment] = useMutation(DELETE_VENDOR_PREPAYMENT, { onCompleted: () => refetch() })

  const reset = () => {
    setForm({ vendorId: '', prepaymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMethod: 'bank_transfer', referenceNumber: '', notes: '' })
    setErrors({})
  }

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!form.vendorId) e.vendorId = 'Required'
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.prepaymentDate) e.prepaymentDate = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return

    createPrepayment({
      variables: {
        input: {
          vendorId: form.vendorId,
          prepaymentDate: form.prepaymentDate,
          amount: parseFloat(form.amount),
          paymentMethod: form.paymentMethod,
          referenceNumber: form.referenceNumber || undefined,
          notes: form.notes || undefined,
          organizationId: orgId,
        }
      }
    })
  }

  const prepayments = data?.vendorPrepayments ?? []
  const vendors = vendorsData?.vendors ?? []

  const totalPrepaid = prepayments.reduce((s: number, p: any) => s + (p.amount || 0), 0)
  const totalAvailable = prepayments.filter((p: any) => p.status === 'open').reduce((s: number, p: any) => s + (p.remainingAmount || 0), 0)

  const statusColor: Record<string, string> = {
    open: 'bg-green-50 text-green-700 border-green-200',
    applied: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const columns: Column[] = [
    { key: 'prepaymentNumber', label: 'Prepayment #', width: '150px', render: v => <span className="font-mono text-xs text-gray-600">{v}</span> },
    { key: 'vendor', label: 'Vendor', render: (_v, row) => <span className="font-medium">{row.vendor?.name || '—'}</span> },
    { key: 'prepaymentDate', label: 'Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'paymentMethod', label: 'Method', width: '130px', render: v => <span className="capitalize text-gray-600">{v?.replace('_', ' ')}</span> },
    { key: 'referenceNumber', label: 'Reference', width: '120px', render: v => v || '—' },
    { key: 'amount', label: 'Amount', width: '110px', align: 'right', render: v => <span className="font-semibold">{formatMoney(v || 0)}</span> },
    { key: 'appliedAmount', label: 'Applied', width: '100px', align: 'right', render: v => <span className="text-gray-500">{formatMoney(v || 0)}</span> },
    { key: 'remainingAmount', label: 'Remaining', width: '110px', align: 'right', render: v => <span className={Number(v) > 0 ? 'font-bold text-green-600' : 'text-gray-400'}>{formatMoney(v || 0)}</span> },
    { key: 'status', label: 'Status', width: '100px', render: v => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || ''}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enter Vendor Prepayments</h1>
        <p className="text-gray-500">Record advance payments to vendors before receiving goods or invoices</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">About Prepayments</p>
          <p className="text-xs mt-1">Prepayments are advance payments made to vendors. They show as "open" until applied against a vendor bill. The remaining balance is tracked automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Prepaid', value: `${formatMoney(totalPrepaid)}`, icon: DollarSign, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Available to Apply', value: `${formatMoney(totalAvailable)}`, icon: Clock, cls: 'text-green-600 bg-green-50' },
          { label: 'Fully Applied', value: prepayments.filter((p: any) => p.status === 'applied').length, icon: CheckCircle, cls: 'text-gray-600 bg-gray-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Vendor Prepayment</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <SelectFloating label="Vendor *" value={form.vendorId} onChange={e => setF('vendorId', typeof e === 'string' ? e : e.target.value)}
                options={[{ value: '', label: 'Select vendor...' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
                error={errors.vendorId} className="h-7 text-xs" />
              <InputFloating label="Prepayment Date *" type="date" value={form.prepaymentDate} onChange={e => setF('prepaymentDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Amount *" type="number" value={form.amount} onChange={e => setF('amount', e.target.value)} error={errors.amount} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <SelectFloating label="Payment Method" value={form.paymentMethod} onChange={e => setF('paymentMethod', typeof e === 'string' ? e : e.target.value)}
                options={PAYMENT_METHODS} className="h-7 text-xs" />
              <InputFloating label="Reference # (cheque/bank ref)" value={form.referenceNumber} onChange={e => setF('referenceNumber', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Notes" value={form.notes} onChange={e => setF('notes', e.target.value)} className="h-7 text-xs" />
            </div>
            {errors.submit && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.submit}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Record Prepayment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={prepayments} columns={columns} loading={loading}
        title="Vendor Prepayments" onAdd={() => { reset(); setAdding(true) }} addLabel="New Prepayment"
        searchable emptyMessage="No prepayments recorded yet."
        actions={[{ label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this prepayment?')) deletePrepayment({ variables: { id: row.id } }) }, variant: 'ghost' }]}
      />
    </div>
  )
}
