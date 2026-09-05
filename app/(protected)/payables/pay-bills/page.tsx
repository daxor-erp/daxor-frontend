'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FormDrawer, FormSection } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_OUTSTANDING_VENDOR_BILLS, CREATE_VENDOR_PAYMENT,
} from '@/gql/queries'
import { DollarSign, Clock, AlertCircle, CheckCircle2, CreditCard } from 'lucide-react'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque',        label: 'Cheque' },
  { value: 'cash',          label: 'Cash' },
  { value: 'upi',           label: 'UPI' },
]

export default function PayBillsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [payDrawer, setPayDrawer] = useState<any>(null)
  const [payForm, setPayForm] = useState({ amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer', referenceNumber: '', notes: '' })

  const { data, loading, refetch } = useQuery(GET_OUTSTANDING_VENDOR_BILLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const done = () => { refetch(); setPayDrawer(null) }
  const err  = (e: any) => alert(e.message)

  const [createPayment, { loading: paying }] = useMutation(CREATE_VENDOR_PAYMENT, { onCompleted: done, onError: err })

  const records: any[] = data?.outstandingVendorBills ?? []

  const stats = {
    total:    records.length,
    overdue:  records.filter((r: any) => r.dueDate && new Date(r.dueDate) < new Date()).length,
    outstanding: records.reduce((s: number, r: any) => s + Number(r.outstandingAmount ?? 0), 0),
    payable30:   records.filter((r: any) => r.dueDate && (new Date(r.dueDate).getTime() - Date.now()) < 30 * 86400000).length,
  }

  const setP = (k: string, v: string) => setPayForm(p => ({ ...p, [k]: v }))

  const handlePay = () => {
    if (!payDrawer || !payForm.amount || !payForm.paymentDate) return alert('Fill in required fields')
    createPayment({
      variables: {
        input: {
          vendorId:        payDrawer.vendorId,
          paymentDate:     payForm.paymentDate,
          paymentMethod:   payForm.paymentMethod,
          referenceNumber: payForm.referenceNumber || undefined,
          totalAmount:     Number(payForm.amount),
          allocations:     [{ billId: payDrawer.id, amount: Number(payForm.amount) }],
          notes:           payForm.notes || undefined,
          organizationId:  orgId,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'billNumber',        label: 'Bill #',      width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendor',            label: 'Vendor',      render: (v, r) => <span className="text-sm font-medium">{v?.name || '—'}</span> },
    { key: 'dueDate',           label: 'Due Date',    width: '110px', render: (v) => {
        const overdue = v && new Date(v) < new Date()
        return (
          <div>
            <DateCell value={v} />
            {overdue && <span className="text-[10px] font-medium text-rose-600">Overdue</span>}
          </div>
        )
      }
    },
    { key: 'status',            label: 'Status',      width: '120px', render: v => <ErpBadge status={v} /> },
    { key: 'totalAmount',       label: 'Bill Total',  width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'outstandingAmount', label: 'Outstanding', width: '130px', align: 'right', render: v => <AmountCell value={v} className="text-rose-600 font-semibold" /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Pay Bills"
        subtitle="Record vendor payments against approved bills"
        icon={<CreditCard className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Pay Bills' }]}
      />

      <StatsRow cols={4}>
        <StatCard label="Outstanding Bills"  value={stats.total}    icon={<DollarSign    className="h-5 w-5" />} variant="slate" />
        <StatCard label="Due in 30 Days"     value={stats.payable30} icon={<Clock        className="h-5 w-5" />} variant="amber" />
        <StatCard label="Overdue"            value={stats.overdue}  icon={<AlertCircle   className="h-5 w-5" />} variant="rose" />
        <StatCard label="Total Outstanding"  value={`₹${(stats.outstanding/1000).toFixed(1)}k`} icon={<CheckCircle2 className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={records}
        columns={columns}
        loading={loading}
        title="Outstanding Vendor Bills"
        searchable searchPlaceholder="Search bills…"
        emptyMessage="No outstanding bills."
        pageSize={25}
        onRowClick={(r: any) => {
          setPayForm({ amount: String(r.outstandingAmount ?? ''), paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer', referenceNumber: '', notes: '' })
          setPayDrawer(r)
        }}
        actions={[{
          label: 'Pay',
          icon: <CreditCard className="h-3.5 w-3.5" />,
          onClick: (r: any) => {
            setPayForm({ amount: String(r.outstandingAmount ?? ''), paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer', referenceNumber: '', notes: '' })
            setPayDrawer(r)
          },
          show: (r: any) => ['approved','partially_paid'].includes(r.status),
        }]}
      />

      <FormDrawer
        open={!!payDrawer}
        onClose={() => setPayDrawer(null)}
        title={`Pay Bill ${payDrawer?.billNumber ?? ''}`}
        description={`Vendor: ${payDrawer?.vendor?.name ?? ''} — Outstanding: ₹${payDrawer?.outstandingAmount ?? 0}`}
        size="sm"
        submitLabel="Register Payment"
        onSubmit={handlePay}
        submitting={paying}
      >
        <FormSection columns={1}>
          <InputFloating label="Amount *"          type="number" value={payForm.amount}          onChange={e => setP('amount', e.target.value)} />
          <InputFloating label="Payment Date *"    type="date"   value={payForm.paymentDate}     onChange={e => setP('paymentDate', e.target.value)} />
          <SelectFloating label="Payment Method"   value={payForm.paymentMethod}                 onChange={v => setP('paymentMethod', typeof v === 'string' ? v : (v as any).target.value)} options={PAYMENT_METHODS} />
          <InputFloating label="Reference Number"               value={payForm.referenceNumber}  onChange={e => setP('referenceNumber', e.target.value)} />
          <InputFloating label="Notes"             multiline rows={2} value={payForm.notes}      onChange={e => setP('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>
    </div>
  )
}
