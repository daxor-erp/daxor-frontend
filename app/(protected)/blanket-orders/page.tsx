'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_BLANKET_ORDERS, GET_VENDORS,
  CREATE_BLANKET_ORDER, CONFIRM_BLANKET_ORDER, CLOSE_BLANKET_ORDER,
  CANCEL_BLANKET_ORDER, DELETE_BLANKET_ORDER, RECORD_BLANKET_CALL_OFF,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { FormDrawer, FormSection, LineItemsEditor } from '@/components/ui/form-drawer'
import { ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  FileText, Clock, CheckCircle2, Ban, Plus, CheckCheck, X, ShoppingCart, Package,
} from 'lucide-react'

const BLANK_LINE = { productName: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
const BLANK_FORM = {
  vendorId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate:   '',
  notes: '',
}

const STATUS_PIPELINE = [
  { key: 'draft',     label: 'Draft' },
  { key: 'open',      label: 'Open' },
  { key: 'closed',    label: 'Closed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function BlanketOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [callOffDrawer, setCallOffDrawer] = useState<any>(null)
  const [callOffLine, setCallOffLine]     = useState<{ lineId: string; qty: string }>({ lineId: '', qty: '' })
  const [filterStatus, setFilterStatus]   = useState('')
  const [confirm, setConfirm]             = useState<{ action: string; id: string } | null>(null)
  const [form, setForm]                   = useState({ ...BLANK_FORM })
  const [lines, setLines]                 = useState([{ ...BLANK_LINE }])

  const { data, loading, refetch } = useQuery(GET_BLANKET_ORDERS, {
    variables: { organizationId: orgId, status: filterStatus || undefined },
    skip: !orgId,
  })
  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const done = () => { refetch(); setDrawerOpen(false); setConfirm(null); setCallOffDrawer(null) }
  const err  = (e: any) => alert(e.message)

  const [createBO,   { loading: creating }]  = useMutation(CREATE_BLANKET_ORDER,      { onCompleted: done, onError: err })
  const [confirmBO]                           = useMutation(CONFIRM_BLANKET_ORDER,     { onCompleted: done, onError: err })
  const [closeBO]                             = useMutation(CLOSE_BLANKET_ORDER,       { onCompleted: done, onError: err })
  const [cancelBO]                            = useMutation(CANCEL_BLANKET_ORDER,      { onCompleted: done, onError: err })
  const [deleteBO]                            = useMutation(DELETE_BLANKET_ORDER,      { onCompleted: done, onError: err })
  const [callOff, { loading: callingOff }]   = useMutation(RECORD_BLANKET_CALL_OFF,   { onCompleted: done, onError: err })

  const all: any[] = data?.blanketOrders ?? []
  const records    = all.filter((r: any) => !filterStatus || r.status === filterStatus)
  const vendors    = vendorData?.vendors ?? []

  const stats = {
    total:     all.length,
    open:      all.filter((r: any) => r.status === 'open').length,
    committed: all.reduce((s: number, r: any) => s + Number(r.committedValue ?? 0), 0),
    total_val: all.reduce((s: number, r: any) => s + Number(r.totalValue ?? 0), 0),
  }

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleCreate = () => {
    if (!form.vendorId) return alert('Select a vendor')
    if (!lines.some(l => (l as any).productName?.trim())) return alert('Add at least one line')
    const mappedLines = lines.filter((l: any) => l.productName?.trim()).map((l: any) => ({
      productName: l.productName.trim(),
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      lineTotal: Math.round(Number(l.quantity) * Number(l.unitPrice) * 100) / 100,
    }))
    createBO({
      variables: {
        input: {
          vendorId: form.vendorId,
          organizationId: orgId,
          startDate: form.startDate,
          endDate:   form.endDate || undefined,
          notes:     form.notes || undefined,
          lines:     mappedLines,
        },
      },
    })
  }

  const handleCallOff = () => {
    if (!callOffDrawer || !callOffLine.lineId || !callOffLine.qty) return alert('Select a line and enter quantity')
    callOff({ variables: { id: callOffDrawer.id, lineId: callOffLine.lineId, qty: Number(callOffLine.qty) } })
  }

  const runConfirm = () => {
    if (!confirm) return
    const id = confirm.id
    if (confirm.action === 'confirm') confirmBO({ variables: { id } })
    if (confirm.action === 'close')   closeBO({ variables: { id } })
    if (confirm.action === 'cancel')  cancelBO({ variables: { id } })
    if (confirm.action === 'delete')  deleteBO({ variables: { id } })
  }

  const LINE_COLS = [
    { key: 'productName', header: 'Product / Description', placeholder: 'Item or service' },
    { key: 'quantity',    header: 'Qty',        width: '80px',  type: 'number' as const },
    { key: 'unitPrice',   header: 'Unit Price', width: '100px', type: 'number' as const },
    { key: 'lineTotal',   header: 'Total',      width: '100px', readOnly: true },
  ]

  const LABELS: Record<string, { title: string; desc: string; label: string; destructive?: boolean }> = {
    confirm: { title: 'Confirm Blanket Order?', desc: 'The order will become open and call-offs can be recorded.', label: 'Confirm' },
    close:   { title: 'Close Blanket Order?',   desc: 'No further call-offs will be allowed.',                     label: 'Close' },
    cancel:  { title: 'Cancel Blanket Order?',  desc: 'The order will be cancelled.',                             label: 'Cancel', destructive: true },
    delete:  { title: 'Delete Blanket Order?',  desc: 'This draft will be permanently removed.',                   label: 'Delete', destructive: true },
  }

  const columns: Column[] = [
    { key: 'boNumber',       label: 'BO #',       width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendorName',     label: 'Vendor',     render: v => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'startDate',      label: 'Start',      width: '110px', render: v => <DateCell value={v} /> },
    { key: 'endDate',        label: 'End',        width: '110px', render: v => <DateCell value={v} /> },
    { key: 'status',         label: 'Status',     width: '110px', render: v => <ErpBadge status={v} /> },
    { key: 'totalValue',     label: 'Total Value', width: '130px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'committedValue', label: 'Called Off',  width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'lines',          label: 'Lines',       width: '60px',  render: v => <span className="text-xs">{Array.isArray(v) ? v.length : 0}</span> },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Blanket Orders"
        subtitle="Long-term purchase agreements — confirm once, call off against it as needed"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Blanket Orders' }]}
        actions={
          <Button onClick={() => { setForm({ ...BLANK_FORM }); setLines([{ ...BLANK_LINE }]); setDrawerOpen(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Blanket Order
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total"       value={stats.total}     icon={<FileText      className="h-5 w-5" />} variant="slate"  onClick={() => setFilterStatus('')} />
        <StatCard label="Open"        value={stats.open}      icon={<CheckCircle2  className="h-5 w-5" />} variant="green"  onClick={() => setFilterStatus('open')} />
        <StatCard label="Total Value" value={`₹${(stats.total_val/1000).toFixed(1)}k`} icon={<ShoppingCart className="h-5 w-5" />} variant="blue" />
        <StatCard label="Called Off"  value={`₹${(stats.committed/1000).toFixed(1)}k`} icon={<Package      className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <div className="flex flex-wrap gap-1.5">
        {[{ key: '', label: 'All' }, ...STATUS_PIPELINE].map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === s.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <DataTable
        data={records} columns={columns} loading={loading}
        title="All Blanket Orders" searchable searchPlaceholder="Search by BO#, vendor…"
        emptyMessage="No blanket orders yet." pageSize={25}
        actions={[
          {
            label: 'Confirm',
            icon: <CheckCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'confirm', id: r.id }),
            show: (r: any) => r.status === 'draft',
          },
          {
            label: 'Call Off',
            icon: <Package className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setCallOffLine({ lineId: r.lines?.[0]?.id ?? '', qty: '' }); setCallOffDrawer(r) },
            show: (r: any) => r.status === 'open',
          },
          {
            label: 'Close',
            icon: <X className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'close', id: r.id }),
            show: (r: any) => r.status === 'open',
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'cancel', id: r.id }),
            show: (r: any) => r.status === 'draft',
          },
          {
            label: 'Delete',
            icon: <Clock className="h-3.5 w-3.5" />,
            onClick: (r: any) => setConfirm({ action: 'delete', id: r.id }),
            show: (r: any) => r.status === 'draft',
          },
        ]}
      />

      {/* Create Blanket Order drawer */}
      <FormDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="New Blanket Order" description="Create a long-term purchase agreement with a vendor."
        size="lg" submitLabel="Save Draft" onSubmit={handleCreate} submitting={creating}
      >
        <FormSection title="Vendor & Dates" columns={2}>
          <SelectFloating
            label="Vendor *"
            value={form.vendorId}
            onChange={v => setF('vendorId', typeof v === 'string' ? v : (v as any).target.value)}
            options={[{ value: '', label: 'Select vendor…' }, ...vendors.map((v: any) => ({ value: v.id, label: v.name }))]}
          />
          <div />
          <InputFloating label="Start Date *" type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} />
          <InputFloating label="End Date"     type="date" value={form.endDate}   onChange={e => setF('endDate', e.target.value)} />
        </FormSection>
        <FormSection title="Lines" columns={1}>
          <LineItemsEditor
            columns={LINE_COLS}
            rows={lines}
            onChange={rows => setLines(rows.map((l: any) => ({ ...l, lineTotal: Math.round(Number(l.quantity) * Number(l.unitPrice) * 100) / 100 })))}
            onAddRow={() => ({ ...BLANK_LINE })}
          />
        </FormSection>
        <FormSection columns={1}>
          <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} />
        </FormSection>
      </FormDrawer>

      {/* Call-off drawer */}
      <FormDrawer
        open={!!callOffDrawer}
        onClose={() => setCallOffDrawer(null)}
        title={`Record Call-Off — ${callOffDrawer?.boNumber ?? ''}`}
        description="Record a quantity drawn against this blanket order line."
        size="sm" submitLabel="Record Call-Off" onSubmit={handleCallOff} submitting={callingOff}
      >
        <FormSection columns={1}>
          <SelectFloating
            label="Line *"
            value={callOffLine.lineId}
            onChange={v => setCallOffLine(p => ({ ...p, lineId: typeof v === 'string' ? v : (v as any).target.value }))}
            options={[
              { value: '', label: 'Select line…' },
              ...(callOffDrawer?.lines ?? []).map((l: any) => ({
                value: l.id,
                label: `${l.productName} — ordered: ${l.orderedQty ?? 0} / ${l.quantity}`,
              })),
            ]}
          />
          <InputFloating
            label="Quantity to Call Off *"
            type="number"
            value={callOffLine.qty}
            onChange={e => setCallOffLine(p => ({ ...p, qty: e.target.value }))}
          />
        </FormSection>
      </FormDrawer>

      {confirm && LABELS[confirm.action] && (
        <ConfirmDialog
          open onClose={() => setConfirm(null)} onConfirm={runConfirm}
          title={LABELS[confirm.action].title}
          description={LABELS[confirm.action].desc}
          confirmLabel={LABELS[confirm.action].label}
          destructive={!!LABELS[confirm.action].destructive}
        />
      )}
    </div>
  )
}
