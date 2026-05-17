'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_VENDOR_BILLS, CREATE_VENDOR_PAYMENT, GET_VENDORS
} from '@/gql/queries'
import { X, Save, DollarSign, Clock, CheckCircle, CreditCard, AlertCircle } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
]

export default function PayBillsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  // Payment form state
  const [payingBill, setPayingBill] = useState<any>(null)
  const [payAmount, setPayAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: billsData, loading, refetch } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: vendorsData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createPayment, { loading: saving }] = useMutation(CREATE_VENDOR_PAYMENT, {
    onCompleted: () => {
      refetch()
      closeForm()
    },
    onError: err => setErrors({ submit: err.message }),
  })

  const closeForm = () => {
    setPayingBill(null)
    setPayAmount('')
    setPaymentDate(new Date().toISOString().split('T')[0])
    setPaymentMethod('bank_transfer')
    setReferenceNumber('')
    setNotes('')
    setErrors({})
  }

  const openPayForm = (bill: any) => {
    setPayingBill(bill)
    setPayAmount(bill.outstandingAmount?.toString() || '')
    setErrors({})
  }

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    const amount = parseFloat(payAmount)
    if (!payAmount || isNaN(amount) || amount <= 0) e.amount = 'Enter a valid amount'
    if (amount > payingBill.outstandingAmount) e.amount = `Cannot exceed outstanding amount (${formatMoney(payingBill.outstandingAmount)})`
    if (!paymentDate) e.date = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return

    createPayment({
      variables: {
        input: {
          vendorId: payingBill.vendorId,
          paymentDate,
          paymentMethod,
          referenceNumber: referenceNumber || undefined,
          totalAmount: amount,
          allocations: [{ billId: payingBill.id, amount }],
          notes: notes || undefined,
          organizationId: orgId,
        }
      }
    })
  }

  const bills = billsData?.vendorBills ?? []

  // Summary stats
  const totalBilled = bills.reduce((s: number, b: any) => s + (b.totalAmount || 0), 0)
  const totalPaid = bills.reduce((s: number, b: any) => s + (b.paidAmount || 0), 0)
  const totalOutstanding = bills.reduce((s: number, b: any) => s + (b.outstandingAmount || 0), 0)
  const overdueCount = bills.filter((b: any) =>
    ['approved', 'partially_paid'].includes(b.status) &&
    b.dueDate && new Date(b.dueDate) < new Date()
  ).length

  const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    submitted: 'bg-amber-50 text-amber-800 border-amber-200',
    approval_declined: 'bg-red-50 text-red-700 border-red-200',
    approved: 'bg-blue-50 text-blue-700 border-blue-200',
    partially_paid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const columns: Column[] = [
    {
      key: 'billNumber', label: 'Bill #', width: '140px',
      render: v => <span className="font-mono text-xs text-gray-600">{v}</span>
    },
    {
      key: 'vendor', label: 'Vendor',
      render: (_v, row) => <span className="font-medium">{row.vendor?.name || '—'}</span>
    },
    {
      key: 'billDate', label: 'Bill Date', width: '100px',
      render: v => v ? formatDate(v) : '—'
    },
    {
      key: 'dueDate', label: 'Due Date', width: '100px',
      render: (v, row) => {
        const overdue = ['approved', 'partially_paid'].includes(row.status) && v && new Date(v) < new Date()
        return (
          <span className={overdue ? 'text-red-600 font-semibold' : ''}>
            {v ? formatDate(v) : '—'}
            {overdue && ' ⚠'}
          </span>
        )
      }
    },
    {
      key: 'totalAmount', label: 'Bill Amount', width: '110px', align: 'right',
      render: v => <span className="font-semibold">{formatMoney(v || 0)}</span>
    },
    {
      key: 'paidAmount', label: 'Paid', width: '100px', align: 'right',
      render: v => <span className="text-green-600 font-medium">{formatMoney(v || 0)}</span>
    },
    {
      key: 'outstandingAmount', label: 'Outstanding', width: '110px', align: 'right',
      render: v => (
        <span className={Number(v) > 0 ? 'text-red-600 font-bold' : 'text-gray-400'}>
          {formatMoney(v || 0)}
        </span>
      )
    },
    {
      key: 'status', label: 'Status', width: '120px',
      render: v => {
        const s = String(v || '')
        const label =
          s === 'submitted' ? 'pending approval' : s === 'approval_declined' ? 'declined' : s.replace('_', ' ')
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[s] || statusColor.draft}`}>
            {label}
          </span>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pay Bills</h1>
        <p className="text-gray-500">View all vendor bills and record payments</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Billed', value: `${formatMoney(totalBilled)}`, icon: CreditCard, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Total Paid', value: `${formatMoney(totalPaid)}`, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Outstanding', value: `${formatMoney(totalOutstanding)}`, icon: DollarSign, cls: 'text-red-600 bg-red-50' },
          { label: 'Overdue Bills', value: overdueCount, icon: AlertCircle, cls: 'text-orange-600 bg-orange-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Payment form — slides in when a bill is selected */}
      {payingBill && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              Pay Bill: {payingBill.billNumber} — {payingBill.vendor?.name}
            </span>
            <button onClick={closeForm} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-4">
            {/* Bill summary */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded p-3 text-xs">
              <div><span className="text-gray-400">Bill Total</span><p className="font-bold text-gray-800">{formatMoney(payingBill.totalAmount)}</p></div>
              <div><span className="text-gray-400">Already Paid</span><p className="font-bold text-green-600">{formatMoney(payingBill.paidAmount)}</p></div>
              <div><span className="text-gray-400">Outstanding</span><p className="font-bold text-red-600">{formatMoney(payingBill.outstandingAmount)}</p></div>
            </div>

            {/* Payment fields */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label={`Pay Amount * (max ${formatMoney(payingBill.outstandingAmount)})`}
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                error={errors.amount}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Payment Date *"
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                error={errors.date}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Payment Method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(typeof e === 'string' ? e : e.target.value)}
                options={PAYMENT_METHODS}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Reference # (cheque/bank ref)"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            <InputFloating label="Notes" multiline rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="text-xs" />

            {errors.submit && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.submit}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={closeForm} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]">
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Processing…' : `Pay $${parseFloat(payAmount || '0').toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bills table */}
      <DataTable
        data={bills}
        columns={columns}
        loading={loading}
        title="All Vendor Bills"
        searchable
        searchPlaceholder="Search bills..."
        emptyMessage="No bills found. Create bills in Payables → Enter Bills first."
        actions={[
          {
            label: 'Pay',
            icon: <DollarSign className="h-3.5 w-3.5" />,
            onClick: row => {
              if (row.status === 'paid') return alert('This bill is already fully paid.')
              if (row.status === 'cancelled') return alert('Cannot pay a cancelled bill.')
              if (['draft', 'submitted', 'approval_declined'].includes(row.status)) {
                return alert('Bill must be approved before recording payment. Use Enter Bills to submit or approve.')
              }
              openPayForm(row)
            },
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
