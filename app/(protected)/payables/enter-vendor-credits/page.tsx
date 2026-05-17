'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_VENDOR_CREDITS, CREATE_VENDOR_CREDIT, DELETE_VENDOR_CREDIT, GET_VENDORS } from '@/gql/queries'
import { X, Save, Trash2, CreditCard, DollarSign, CheckCircle } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const CREDIT_REASONS = [
  { value: 'returned_goods', label: 'Returned Goods' },
  { value: 'overcharge', label: 'Overcharge / Price Correction' },
  { value: 'damaged_goods', label: 'Damaged Goods' },
  { value: 'early_payment_discount', label: 'Early Payment Discount' },
  { value: 'other', label: 'Other' },
]

export default function EnterVendorCreditsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    vendorId: '',
    creditDate: new Date().toISOString().split('T')[0],
    totalAmount: '',
    reason: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_VENDOR_CREDITS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: vendorsData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createCredit, { loading: saving }] = useMutation(CREATE_VENDOR_CREDIT, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
    onError: err => setErrors({ submit: err.message }),
  })

  const [deleteCredit] = useMutation(DELETE_VENDOR_CREDIT, { onCompleted: () => refetch() })

  const reset = () => {
    setForm({ vendorId: '', creditDate: new Date().toISOString().split('T')[0], totalAmount: '', reason: '', notes: '' })
    setErrors({})
  }

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!form.vendorId) e.vendorId = 'Required'
    if (!form.totalAmount || parseFloat(form.totalAmount) <= 0) e.totalAmount = 'Enter a valid amount'
    if (!form.reason) e.reason = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return

    createCredit({
      variables: {
        input: {
          vendorId: form.vendorId,
          creditDate: form.creditDate,
          totalAmount: parseFloat(form.totalAmount),
          reason: form.reason,
          notes: form.notes || undefined,
          organizationId: orgId,
        }
      }
    })
  }

  const credits = data?.vendorCredits ?? []
  const vendors = vendorsData?.vendors ?? []
  const totalAvailable = credits.filter((c: any) => c.status === 'open').reduce((s: number, c: any) => s + (c.remainingAmount || 0), 0)

  const statusColor: Record<string, string> = {
    open: 'bg-green-50 text-green-700 border-green-200',
    applied: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const columns: Column[] = [
    { key: 'creditNumber', label: 'Credit #', width: '140px', render: v => <span className="font-mono text-xs text-gray-600">{v}</span> },
    { key: 'vendor', label: 'Vendor', render: (_v, row) => <span className="font-medium">{row.vendor?.name || '—'}</span> },
    { key: 'creditDate', label: 'Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'reason', label: 'Reason', render: v => <span className="text-gray-600 text-xs capitalize">{v?.replace(/_/g, ' ') || '—'}</span> },
    { key: 'totalAmount', label: 'Credit Amount', width: '120px', align: 'right', render: v => <span className="font-semibold text-green-700">{formatMoney(v || 0)}</span> },
    { key: 'appliedAmount', label: 'Applied', width: '100px', align: 'right', render: v => <span className="text-gray-500">{formatMoney(v || 0)}</span> },
    { key: 'remainingAmount', label: 'Remaining', width: '110px', align: 'right', render: v => <span className={Number(v) > 0 ? 'font-bold text-green-600' : 'text-gray-400'}>{formatMoney(v || 0)}</span> },
    { key: 'notes', label: 'Notes', render: v => <span className="text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'status', label: 'Status', width: '100px', render: v => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || ''}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enter Vendor Credits</h1>
        <p className="text-gray-500">Record credit notes from vendors — returned goods, overcharges, discounts</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Credits', value: credits.length, icon: CreditCard, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Available Balance', value: `${formatMoney(totalAvailable)}`, icon: DollarSign, cls: 'text-green-600 bg-green-50' },
          { label: 'Fully Applied', value: credits.filter((c: any) => c.status === 'applied').length, icon: CheckCircle, cls: 'text-gray-600 bg-gray-50' },
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
            <span className="text-xs font-semibold text-white">New Vendor Credit</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <SelectFloating
                label="Vendor *"
                value={form.vendorId}
                onChange={e => setF('vendorId', typeof e === 'string' ? e : e.target.value)}
                options={[{ value: '', label: 'Select vendor...' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
                error={errors.vendorId}
                className="h-7 text-xs"
              />
              <InputFloating label="Credit Date" type="date" value={form.creditDate} onChange={e => setF('creditDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Credit Amount *" type="number" value={form.totalAmount} onChange={e => setF('totalAmount', e.target.value)} error={errors.totalAmount} className="h-7 text-xs" />
              <SelectFloating
                label="Reason *"
                value={form.reason}
                onChange={e => setF('reason', typeof e === 'string' ? e : e.target.value)}
                options={[{ value: '', label: 'Select reason...' }, ...CREDIT_REASONS]}
                error={errors.reason}
                className="h-7 text-xs"
              />
            </div>
            <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} className="text-xs" />
            {errors.submit && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.submit}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Credit'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={credits} columns={columns} loading={loading}
        title="Vendor Credits" onAdd={() => { reset(); setAdding(true) }} addLabel="New Credit"
        searchable emptyMessage="No vendor credits yet."
        actions={[{
          label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />,
          onClick: row => { if (confirm('Delete this credit?')) deleteCredit({ variables: { id: row.id } }) },
          variant: 'ghost',
        }]}
      />
    </div>
  )
}
