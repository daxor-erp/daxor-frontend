'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_VENDOR_BILLS, CREATE_VENDOR_BILL, UPDATE_VENDOR_BILL,
  APPROVE_VENDOR_BILL, SUBMIT_VENDOR_BILL_FOR_APPROVAL, DELETE_VENDOR_BILL, GET_VENDORS,
  RECONCILE_VENDOR_BILL, APPLY_VENDOR_CREDIT,
} from '@/gql/queries'
import { FileText, Clock, CheckCircle2, DollarSign, Trash2, Send, CheckCheck, Plus, CreditCard, Minus } from 'lucide-react'

const BLANK_LINE = { description: '', quantity: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 }
const BLANK_FORM = { vendorId: '', billDate: new Date().toISOString().split('T')[0], dueDate: '', notes: '' }

function computeLines(lines: any[]) {
  return lines.map(l => {
    const base = Number(l.quantity) * Number(l.unitPrice)
    const afterDisc = base * (1 - Number(l.discount) / 100)
    const total = afterDisc * (1 + Number(l.tax) / 100)
    return { ...l, total: Math.round(total * 100) / 100 }
  })
}

export default function EnterBillsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editRow, setEditRow]       = useState<any>(null)
  const [form, setForm]             = useState({ ...BLANK_FORM })
  const [lines, setLines]           = useState([{ ...BLANK_LINE }])
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [creditDrawer, setCreditDrawer] = useState<any>(null)
  const [creditAmount, setCreditAmount]  = useState('')

  const { data, loading, refetch } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const done = () => { refetch(); setDrawerOpen(false); setEditRow(null); setDelConfirm(null); setCreditDrawer(null); setCreditAmount('') }
  const err  = (e: any) => alert(e.message)

  const [createBill, { loading: saving }]  = useMutation(CREATE_VENDOR_BILL,               { onCompleted: done, onError: err })
  const [updateBill, { loading: updating }] = useMutation(UPDATE_VENDOR_BILL,              { onCompleted: done, onError: err })
  const [approveBill]                       = useMutation(APPROVE_VENDOR_BILL,             { onCompleted: done, onError: err })
  const [submitBill]                        = useMutation(SUBMIT_VENDOR_BILL_FOR_APPROVAL, { onCompleted: done, onError: err })
  const [deleteBill]                        = useMutation(DELETE_VENDOR_BILL,              { onCompleted: done, onError: err })
  const [reconcileBill]                     = useMutation(RECONCILE_VENDOR_BILL,           { onCompleted: done, onError: err })
  const [applyCredit, { loading: applying }] = useMutation(APPLY_VENDOR_CREDIT,           { onCompleted: done, onError: err })

  const records: any[] = data?.vendorBills ?? []
  const vendors: any[] = vData?.vendors ?? []

  const stats = {
    total:    records.length,
    draft:    records.filter((r: any) => r.status === 'draft').length,
    pending:  records.filter((r: any) => r.status === 'submitted').length,
    approved: records.filter((r: any) => r.status === 'approved').length,
    outstanding: records.reduce((s: number, r: any) => s + Number(r.outstandingAmount ?? 0), 0),
  }

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const openCreate = () => {
    setForm({ ...BLANK_FORM })
    setLines([{ ...BLANK_LINE }])
    setEditRow(null)
    setDrawerOpen(true)
  }

  const openEdit = (row: any) => {
    setForm({ vendorId: row.vendorId ?? '', billDate: row.billDate?.split('T')[0] ?? '', dueDate: row.dueDate?.split('T')[0] ?? '', notes: row.notes ?? '' })
    setLines(row.lineItems?.length ? row.lineItems.map((l: any) => ({ ...l })) : [{ ...BLANK_LINE }])
    setEditRow(row)
    setDrawerOpen(true)
  }

  const handleSave = () => {
    const computed = computeLines(lines)
    const subtotal    = computed.reduce((s, l) => s + l.unitPrice * l.quantity * (1 - l.discount / 100), 0)
    const taxAmount   = computed.reduce((s, l) => s + l.unitPrice * l.quantity * (1 - l.discount / 100) * (l.tax / 100), 0)
    const totalAmount = computed.reduce((s, l) => s + l.total, 0)
    const input = {
      vendorId: form.vendorId, billDate: form.billDate, dueDate: form.dueDate,
      lineItems: computed, subtotal, taxAmount, totalAmount, notes: form.notes,
      organizationId: orgId,
    }
    if (editRow) updateBill({ variables: { id: editRow.id, input } })
    else createBill({ variables: { input } })
  }

  const LINE_COLS = [
    { key: 'description', header: 'Description' },
    { key: 'quantity',    header: 'Qty',      width: '70px',  type: 'number' as const },
    { key: 'unitPrice',   header: 'Price',    width: '90px',  type: 'number' as const },
    { key: 'discount',    header: 'Disc %',   width: '70px',  type: 'number' as const },
    { key: 'tax',         header: 'Tax %',    width: '70px',  type: 'number' as const },
    { key: 'total',       header: 'Total',    width: '90px',  readOnly: true },
  ]

  const columns: Column[] = [
    { key: 'billNumber',       label: 'Bill #',       width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendor',           label: 'Vendor',       render: (v, r) => <span className="text-sm font-medium">{v?.name || '—'}</span> },
    { key: 'billDate',         label: 'Bill Date',    width: '110px', render: v => <DateCell value={v} /> },
    { key: 'dueDate',          label: 'Due Date',     width: '110px', render: v => <DateCell value={v} /> },
    { key: 'status',           label: 'Status',       width: '130px', render: v => <ErpBadge status={v} /> },
    { key: 'totalAmount',      label: 'Total',        width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'outstandingAmount',label: 'Outstanding',  width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Vendor Bills"
        subtitle="Record and manage accounts payable invoices from vendors"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Enter Bills' }]}
        actions={<Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4 mr-1.5" /> New Bill</Button>}
      />

      <StatsRow cols={5}>
        <StatCard label="Total Bills"   value={stats.total}    icon={<FileText     className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"         value={stats.draft}    icon={<Clock        className="h-5 w-5" />} variant="amber" />
        <StatCard label="Pending"       value={stats.pending}  icon={<Send         className="h-5 w-5" />} variant="blue" />
        <StatCard label="Approved"      value={stats.approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Outstanding"   value={`₹${(stats.outstanding/1000).toFixed(1)}k`} icon={<DollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={records}
        columns={columns}
        loading={loading}
        title="All Vendor Bills"
        searchable searchPlaceholder="Search bills…"
        emptyMessage="No vendor bills found."
        pageSize={25}
        onRowClick={(r: any) => { if (['draft','approval_declined'].includes(r.status)) openEdit(r) }}
        isRowClickable={(r: any) => ['draft','approval_declined'].includes(r.status)}
        actions={[
          {
            label: 'Submit',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => submitBill({ variables: { id: r.id } }),
            show: (r: any) => ['draft','approval_declined'].includes(r.status),
          },
          {
            label: 'Approve',
            icon: <CheckCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => approveBill({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'draft',
          },
          {
            label: 'Reconcile (Mark Paid)',
            icon: <CreditCard className="h-3.5 w-3.5" />,
            onClick: (r: any) => reconcileBill({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'in_payment',
          },
          {
            label: 'Apply Credit',
            icon: <Minus className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setCreditDrawer(r); setCreditAmount('') },
            show: (r: any) => ['approved','in_payment','partially_paid'].includes(r.status),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => setDelConfirm(r.id),
            show: (r: any) => ['draft','approval_declined'].includes(r.status),
          },
        ]}
      />

      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editRow ? `Edit Bill ${editRow.billNumber}` : 'New Vendor Bill'}
        size="lg"
        submitLabel={editRow ? 'Update Bill' : 'Save Bill'}
        onSubmit={handleSave}
        submitting={saving || updating}
      >
        <FormSection title="Bill Details" columns={2}>
          <SelectFloating
            label="Vendor *"
            value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <div />
          <InputFloating label="Bill Date *" type="date" value={form.billDate} onChange={e => setF('billDate', e.target.value)} />
          <InputFloating label="Due Date *"  type="date" value={form.dueDate}  onChange={e => setF('dueDate',  e.target.value)} />
        </FormSection>
        <FormSection title="Line Items" columns={1}>
          <LineItemsEditor columns={LINE_COLS} rows={lines} onChange={r => setLines(computeLines(r))} onAddRow={() => ({ ...BLANK_LINE })} />
        </FormSection>
        <FormSection title="Notes" columns={1}>
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      <ConfirmDialog
        open={!!delConfirm}
        onClose={() => setDelConfirm(null)}
        onConfirm={() => { if (delConfirm) deleteBill({ variables: { id: delConfirm } }) }}
        title="Delete Vendor Bill?"
        description="This bill will be permanently deleted."
        confirmLabel="Delete"
      />

      {/* Apply Outstanding Credit drawer */}
      <FormDrawer
        open={!!creditDrawer}
        onClose={() => setCreditDrawer(null)}
        title={`Apply Credit — ${creditDrawer?.billNumber ?? ''}`}
        description="Apply a vendor debit note or prepayment credit against this bill's outstanding balance."
        size="sm"
        submitLabel="Apply Credit"
        onSubmit={() => {
          if (!creditDrawer || !creditAmount || Number(creditAmount) <= 0) return alert('Enter a positive credit amount')
          applyCredit({ variables: { id: creditDrawer.id, amount: Number(creditAmount) } })
        }}
        submitting={applying}
      >
        <FormSection columns={1}>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Outstanding: <strong>₹{Number(creditDrawer?.outstandingAmount ?? 0).toLocaleString()}</strong></div>
            <div>Debit notes applied so far: <strong>₹{Number(creditDrawer?.debitNotesApplied ?? 0).toLocaleString()}</strong></div>
          </div>
          <InputFloating
            label="Credit Amount to Apply *"
            type="number"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
          />
        </FormSection>
      </FormDrawer>
    </div>
  )
}
