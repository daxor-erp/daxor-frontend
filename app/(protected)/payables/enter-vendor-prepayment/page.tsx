'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { FormDrawer, FormSection } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { GET_VENDOR_PREPAYMENTS, CREATE_VENDOR_PREPAYMENT, DELETE_VENDOR_PREPAYMENT, GET_VENDORS } from '@/gql/queries'
import { Banknote, DollarSign, CheckCircle2, Trash2, Plus } from 'lucide-react'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque',        label: 'Cheque' },
  { value: 'cash',          label: 'Cash' },
  { value: 'upi',           label: 'UPI' },
]

export default function VendorPrepaymentPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [form, setForm] = useState({ vendorId: '', prepaymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMethod: 'bank_transfer', referenceNumber: '', notes: '' })

  const { data, loading, refetch } = useQuery(GET_VENDOR_PREPAYMENTS, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: vData }            = useQuery(GET_VENDORS,             { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const done = () => { refetch(); setDrawerOpen(false); setDelConfirm(null) }
  const err  = (e: any) => alert(e.message)

  const [createPre, { loading: saving }] = useMutation(CREATE_VENDOR_PREPAYMENT, { onCompleted: done, onError: err })
  const [deletePre]                       = useMutation(DELETE_VENDOR_PREPAYMENT, { onCompleted: done, onError: err })

  const records: any[] = data?.vendorPrepayments ?? []
  const vendors: any[] = vData?.vendors ?? []
  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const stats = {
    total:     records.length,
    open:      records.filter((r: any) => r.status === 'open').length,
    available: records.filter((r: any) => r.status === 'open').reduce((s: number, r: any) => s + Number(r.remainingAmount ?? 0), 0),
    applied:   records.filter((r: any) => r.status === 'applied').length,
  }

  const columns: Column[] = [
    { key: 'prepaymentNumber',label: 'Prepay #',    width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendor',          label: 'Vendor',      render: v => <span className="text-sm font-medium">{v?.name || '—'}</span> },
    { key: 'prepaymentDate',  label: 'Date',        width: '110px', render: v => <DateCell value={v} /> },
    { key: 'paymentMethod',   label: 'Method',      width: '130px', render: v => <span className="text-xs capitalize">{String(v ?? '').replace(/_/g,' ')}</span> },
    { key: 'status',          label: 'Status',      width: '110px', render: v => <ErpBadge status={v} /> },
    { key: 'amount',          label: 'Amount',      width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'remainingAmount', label: 'Remaining',   width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Vendor Prepayments"
        subtitle="Record advance payments made to vendors before invoice"
        icon={<Banknote className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Prepayments' }]}
        actions={<button onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> New Prepayment</button>}
      />

      <StatsRow cols={4}>
        <StatCard label="Total"             value={stats.total}    icon={<Banknote     className="h-5 w-5" />} variant="slate" />
        <StatCard label="Open"              value={stats.open}     icon={<DollarSign   className="h-5 w-5" />} variant="amber" />
        <StatCard label="Available to Apply" value={`₹${(stats.available/1000).toFixed(1)}k`} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Fully Applied"     value={stats.applied}  icon={<CheckCircle2 className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All Vendor Prepayments" searchable searchPlaceholder="Search prepayments…"
        emptyMessage="No prepayments recorded."
        pageSize={25}
        actions={[{
          label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />,
          onClick: (r: any) => setDelConfirm(r.id),
          show: (r: any) => r.status === 'open',
        }]}
      />

      <FormDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="New Vendor Prepayment" size="sm"
        submitLabel="Record Prepayment" submitting={saving}
        onSubmit={() => {
          if (!form.vendorId || !form.amount) return alert('Select vendor and enter amount')
          createPre({ variables: { input: { ...form, amount: Number(form.amount), organizationId: orgId, referenceNumber: form.referenceNumber || undefined } } })
        }}
      >
        <FormSection columns={1}>
          <SelectFloating label="Vendor *" value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <InputFloating label="Prepayment Date *" type="date"   value={form.prepaymentDate}  onChange={e => setF('prepaymentDate', e.target.value)} />
          <InputFloating label="Amount *"          type="number" value={form.amount}           onChange={e => setF('amount', e.target.value)} />
          <SelectFloating label="Payment Method" value={form.paymentMethod}
            onChange={v => setF('paymentMethod', typeof v === 'string' ? v : (v as any).target.value)}
            options={PAYMENT_METHODS}
          />
          <InputFloating label="Reference Number"               value={form.referenceNumber} onChange={e => setF('referenceNumber', e.target.value)} />
          <InputFloating label="Notes" multiline rows={2}        value={form.notes}           onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      <ConfirmDialog
        open={!!delConfirm} onClose={() => setDelConfirm(null)}
        onConfirm={() => { if (delConfirm) deletePre({ variables: { id: delConfirm } }) }}
        title="Delete Prepayment?" description="This prepayment record will be deleted." confirmLabel="Delete"
      />
    </div>
  )
}
