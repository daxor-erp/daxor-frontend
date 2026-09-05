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
import { GET_VENDOR_CREDITS, CREATE_VENDOR_CREDIT, DELETE_VENDOR_CREDIT, GET_VENDORS } from '@/gql/queries'
import { CreditCard, DollarSign, CheckCircle2, Trash2, Plus } from 'lucide-react'

const CREDIT_REASONS = [
  { value: 'returned_goods',         label: 'Returned Goods' },
  { value: 'overcharge',             label: 'Overcharge' },
  { value: 'damaged_goods',          label: 'Damaged Goods' },
  { value: 'early_payment_discount', label: 'Early Payment Discount' },
  { value: 'other',                  label: 'Other' },
]

export default function VendorCreditsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [form, setForm] = useState({ vendorId: '', creditDate: new Date().toISOString().split('T')[0], totalAmount: '', reason: 'returned_goods', notes: '' })

  const { data, loading, refetch } = useQuery(GET_VENDOR_CREDITS, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: vData }            = useQuery(GET_VENDORS,         { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const done = () => { refetch(); setDrawerOpen(false); setDelConfirm(null) }
  const err  = (e: any) => alert(e.message)

  const [createCredit, { loading: saving }] = useMutation(CREATE_VENDOR_CREDIT, { onCompleted: done, onError: err })
  const [deleteCredit]                       = useMutation(DELETE_VENDOR_CREDIT, { onCompleted: done, onError: err })

  const records: any[] = data?.vendorCredits ?? []
  const vendors: any[] = vData?.vendors ?? []
  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const stats = {
    total:     records.length,
    open:      records.filter((r: any) => r.status === 'open').length,
    available: records.filter((r: any) => r.status === 'open').reduce((s: number, r: any) => s + Number(r.remainingAmount ?? 0), 0),
    applied:   records.filter((r: any) => r.status === 'applied').length,
  }

  const columns: Column[] = [
    { key: 'creditNumber',   label: 'Credit #',   width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendor',         label: 'Vendor',     render: (v) => <span className="text-sm font-medium">{v?.name || '—'}</span> },
    { key: 'creditDate',     label: 'Date',       width: '110px', render: v => <DateCell value={v} /> },
    { key: 'reason',         label: 'Reason',     render: v => <span className="text-xs capitalize">{String(v ?? '').replace(/_/g, ' ')}</span> },
    { key: 'status',         label: 'Status',     width: '110px', render: v => <ErpBadge status={v} /> },
    { key: 'totalAmount',    label: 'Amount',     width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'remainingAmount',label: 'Remaining',  width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Vendor Credits"
        subtitle="Record credit notes received from vendors"
        icon={<CreditCard className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Vendor Credits' }]}
        actions={<button onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> New Credit</button>}
      />

      <StatsRow cols={4}>
        <StatCard label="Total Credits"    value={stats.total}    icon={<CreditCard   className="h-5 w-5" />} variant="slate" />
        <StatCard label="Open"             value={stats.open}     icon={<DollarSign   className="h-5 w-5" />} variant="amber" />
        <StatCard label="Available Balance" value={`₹${(stats.available/1000).toFixed(1)}k`} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Applied"          value={stats.applied}  icon={<CheckCircle2 className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All Vendor Credits" searchable searchPlaceholder="Search credits…"
        emptyMessage="No vendor credits recorded."
        pageSize={25}
        actions={[{
          label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />,
          onClick: (r: any) => setDelConfirm(r.id),
          show: (r: any) => r.status === 'open',
        }]}
      />

      <FormDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="New Vendor Credit" size="sm"
        submitLabel="Save Credit" onSubmit={() => {
          if (!form.vendorId || !form.totalAmount) return alert('Fill required fields')
          createCredit({ variables: { input: { ...form, totalAmount: Number(form.totalAmount), organizationId: orgId } } })
        }}
        submitting={saving}
      >
        <FormSection columns={1}>
          <SelectFloating label="Vendor *" value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <InputFloating label="Credit Date *"   type="date"   value={form.creditDate}   onChange={e => setF('creditDate', e.target.value)} />
          <InputFloating label="Credit Amount *" type="number" value={form.totalAmount}  onChange={e => setF('totalAmount', e.target.value)} />
          <SelectFloating label="Reason" value={form.reason}
            onChange={v => setF('reason', typeof v === 'string' ? v : (v as any).target.value)}
            options={CREDIT_REASONS}
          />
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      <ConfirmDialog
        open={!!delConfirm} onClose={() => setDelConfirm(null)}
        onConfirm={() => { if (delConfirm) deleteCredit({ variables: { id: delConfirm } }) }}
        title="Delete Vendor Credit?" description="This credit note will be deleted." confirmLabel="Delete"
      />
    </div>
  )
}
