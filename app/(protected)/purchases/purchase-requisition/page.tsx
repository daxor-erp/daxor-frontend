'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, CREATE_PURCHASE_REQUISITION, GET_VENDORS, GET_PROJECTS, GET_ITEMS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { Plus, X, Save, Trash2, ClipboardList, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const PR_STATUS_LABEL: Record<string, string> = {
  rfq: 'Draft',
  submitted: 'Pending approval',
  approved: 'Approved',
  rejected: 'Declined',
  cancelled: 'Cancelled',
}

const PR_STATUSES = new Set(['rfq', 'submitted', 'approved', 'rejected'])

const PRIORITY = ['Low', 'Normal', 'High', 'Urgent']
interface Line { desc: string; qty: string; unit: string; reason: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', unit: 'pcs', reason: '', price: '0' })
const today = () => new Date().toISOString().split('T')[0]

export default function PurchaseRequisitionPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, error: poError, refetch } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: itemData } = useQuery(GET_ITEMS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [successMsg, setSuccessMsg] = useState('')
  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_PURCHASE_REQUISITION, {
    onCompleted: (res) => {
      setAdding(false)
      reset()
      void refetch()
      const ref = res.createPurchaseRequisition?.seqNo ?? res.createPurchaseRequisition?.id
      setSuccessMsg(`Requisition ${ref ?? ''} submitted for approval.`)
      setTimeout(() => setSuccessMsg(''), 5000)
    },
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ vendorId: '', projectId: '', requiredDate: '', priority: 'Normal', notes: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const projects = projectData?.projects ?? []
  const items = itemData?.items ?? []
  const vendors = vendorData?.vendors ?? []

  const requisitions = (poData?.purchaseorders ?? []).filter((o: { status?: string }) =>
    PR_STATUSES.has(String(o.status ?? '').toLowerCase()),
  )

  const reset = () => { setForm({ vendorId: '', projectId: '', requiredDate: '', priority: 'Normal', notes: '' }); setLines([emptyLine()]); setErrors({}) }
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => setLines(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  const pickItem = (i: number, id: string) => {
    const it = items.find((x: { id: string }) => x.id === id)
    if (it) setLines(p => p.map((l, idx) => idx === i ? { ...l, desc: it.name, unit: it.unit || 'pcs', price: String(it.rate || 0) } : l))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.requiredDate) e.requiredDate = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
    })
    setErrors(e); return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    const lineItems = lines.map(l => ({
      itemDescription: l.desc,
      quantity: parseFloat(l.qty) || 1,
      unitPrice: parseFloat(l.price) || 0,
    }))
    create({
      variables: {
        input: {
          vendorId: form.vendorId || undefined,
          projectId: form.projectId || undefined,
          deliveryDate: form.requiredDate || undefined,
          orderDate: today(),
          items: lineItems,
          notes: [form.notes, form.priority !== 'Normal' ? `Priority: ${form.priority}` : ''].filter(Boolean).join('\n') || undefined,
          organizationId: orgId,
        },
      },
    })
  }

  const stats = {
    total: requisitions.length,
    pending: requisitions.filter((r: { status?: string }) => r.status === 'submitted').length,
    approved: requisitions.filter((r: { status?: string }) => r.status === 'approved').length,
    declined: requisitions.filter((r: { status?: string }) => r.status === 'rejected').length,
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'PR #', width: '140px', render: v => <MonoCell value={v} /> },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: v => <span className="text-sm font-medium">{v || '—'}</span>,
    },
    {
      key: 'deliveryDate',
      label: 'Required By',
      width: '110px',
      render: (v, r) => <DateCell value={v ?? r.orderDate} />,
    },
    {
      key: 'items',
      label: 'Items',
      width: '80px',
      render: v => <span className="text-sm text-muted-foreground">{Array.isArray(v) && v.length > 0 ? v.length : '—'}</span>,
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      width: '120px',
      align: 'right',
      render: (v, r) => {
        const total =
          v ||
          r.items?.reduce((sum: number, i: { quantity?: number; unitPrice?: number }) => sum + ((i.quantity || 0) * (i.unitPrice || 0)), 0) ||
          0
        return total > 0 ? <AmountCell value={total} /> : <span className="text-muted-foreground">—</span>
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: v => {
        const statusKey = String(v ?? 'rfq').toLowerCase()
        return <ErpBadge status={statusKey} label={PR_STATUS_LABEL[statusKey]} />
      },
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Purchase Requisition"
        subtitle="Raise internal purchase requests for approval"
        icon={<ClipboardList className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Purchases' }, { label: 'Purchase Requisition' }]}
        actions={
          !adding ? (
            <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Requisition
            </Button>
          ) : undefined
        }
      />

      {successMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {successMsg}
        </div>
      )}

      <StatsRow cols={4}>
        <StatCard label="Total PRs" value={stats.total} icon={<ClipboardList className="h-5 w-5" />} variant="slate" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Declined" value={stats.declined} icon={<XCircle className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {adding && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5" /> New Purchase Requisition</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-200">
            {[
              { label: 'Vendor', key: 'vendorId', type: 'select', opts: vendors },
              ...(projects.length > 0
                ? [{ label: 'Project', key: 'projectId', type: 'select', opts: projects }]
                : []),
              { label: 'Required By *', key: 'requiredDate', type: 'date' },
              { label: 'Priority', key: 'priority', type: 'priority' },
              { label: 'Notes', key: 'notes', type: 'text' },
            ].map(({ label, key, type, opts }: { label: string; key: string; type: string; opts?: { id: string; name: string }[] }) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${errors[key] ? 'text-red-500' : 'text-gray-500'}`}>{label}{errors[key] ? ` — ${errors[key]}` : ''}</p>
                {type === 'select' ? (
                  <CellSelect
                    value={(form as Record<string, string>)[key]}
                    onChange={e => setF(key, e.target.value)}
                    placeholder="— select —"
                    options={(opts ?? []).map(o => ({ value: o.id, label: o.name }))}
                  />
                ) : type === 'priority' ? (
                  <CellSelect
                    value={form.priority}
                    onChange={e => setF('priority', e.target.value)}
                    options={PRIORITY.map(p => ({ value: p, label: p }))}
                  />
                ) : type === 'date' ? (
                  <CellInput type="date" value={(form as Record<string, string>)[key]} onChange={e => setF(key, e.target.value)} invalid={!!errors[key]} />
                ) : (
                  <CellInput type="text" value={(form as Record<string, string>)[key]} onChange={e => setF(key, e.target.value)} placeholder="Optional notes…" />
                )}
              </div>
            ))}
          </div>

          <div className="p-3">
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="grid bg-muted/70 border-b border-gray-300" style={{ gridTemplateColumns: '2rem 3rem 1fr 5rem 5rem 6rem 1fr 2rem' }}>
                {['#', 'Item', 'Description', 'Qty', 'Unit', 'Unit Price', 'Reason / Justification', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-primary/5" style={{ gridTemplateColumns: '2rem 3rem 1fr 5rem 5rem 6rem 1fr 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellSelect
                      className="px-1"
                      onChange={e => pickItem(i, e.target.value)}
                      placeholder="…"
                      options={items.map((it: { id: string; name: string }) => ({ value: it.id, label: it.name }))}
                    />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description" invalid={!!errors[`d${i}`]} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0" invalid={!!errors[`q${i}`]} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.unit} onChange={e => setL(i, 'unit', e.target.value)} placeholder="pcs" />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <CellInput value={l.reason} onChange={e => setL(i, 'reason', e.target.value)} placeholder="Why is this needed?" />
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
              <div className="border-t border-dashed border-gray-300 px-2 py-1">
                <button onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-primary hover:text-primary flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add line
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Saving submits this requisition for approval automatically.
              </div>
              <div className="flex gap-2">
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
                <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[130px]">
                  <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Submitting…' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={requisitions}
        columns={columns}
        loading={loading}
        title="All Purchase Requisitions"
        searchable
        searchPlaceholder="Search requisitions…"
        emptyMessage={poError ? `Error: ${poError.message}` : 'No requisitions yet. Click “New Requisition” to raise one.'}
        pageSize={25}
      />
    </div>
  )
}
