'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ASSET_MAINTENANCES,
  GET_UPCOMING_MAINTENANCE,
  CREATE_ASSET_MAINTENANCE,
  DELETE_ASSET_MAINTENANCE,
  START_ASSET_MAINTENANCE,
  COMPLETE_ASSET_MAINTENANCE,
  GET_FIXED_ASSETS,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus, Wrench, Calendar, CircleDollarSign, AlertCircle, Trash2,
  Play, CheckCircle2, Search,
} from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

const TYPES = ['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'INSPECTION']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE']

interface PartRow {
  id?: string
  itemName: string
  quantity: number
  unit: string
  costPerUnit: number
  lineTotal?: number
}

export default function AssetMaintenancePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    docNumber: '',
    assetId: '',
    assetName: '',
    assetCode: '',
    maintenanceType: 'PREVENTIVE',
    priority: 'MEDIUM',
    scheduledDate: new Date().toISOString().slice(0, 10),
    description: '',
    assignedToName: '',
    laborHours: 0,
    laborRate: 0,
    intervalDays: 0,
    partsUsed: [] as PartRow[],
    notes: '',
  })

  const listQ = useQuery(GET_ASSET_MAINTENANCES, {
    variables: { organizationId: orgId, status: statusFilter || null, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const upcomingQ = useQuery(GET_UPCOMING_MAINTENANCE, {
    variables: { organizationId: orgId, days: 30 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const assetsQ = useQuery(GET_FIXED_ASSETS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_ASSET_MAINTENANCE, {
    onCompleted: () => { listQ.refetch(); upcomingQ.refetch(); setOpen(false); resetForm(); toast.success('Work order scheduled') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_ASSET_MAINTENANCE, {
    onCompleted: () => { listQ.refetch(); upcomingQ.refetch(); toast.success('Removed') },
    onError: (e) => toast.error(e.message),
  })
  const [startMutation] = useMutation(START_ASSET_MAINTENANCE, {
    onCompleted: () => { listQ.refetch(); toast.success('Started') },
    onError: (e) => toast.error(e.message),
  })
  const [completeMutation] = useMutation(COMPLETE_ASSET_MAINTENANCE, {
    onCompleted: () => { listQ.refetch(); toast.success('Completed') },
    onError: (e) => toast.error(e.message),
  })

  const rows: any[] = listQ.data?.assetMaintenances ?? []
  const upcoming: any[] = upcomingQ.data?.upcomingMaintenance ?? []
  const assets: any[] = assetsQ.data?.fixedAssets ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => r.docNumber?.toLowerCase().includes(q) || r.assetName?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
  }, [rows, search])

  const stats = useMemo(() => {
    const totalCost = rows.reduce((s, r) => s + Number(r.totalCost ?? 0), 0)
    const completed = rows.filter((r) => r.status === 'COMPLETED').length
    const inProgress = rows.filter((r) => r.status === 'IN_PROGRESS').length
    return { totalCost, completed, inProgress }
  }, [rows])

  function resetForm() {
    setForm({
      docNumber: '',
      assetId: '',
      assetName: '',
      assetCode: '',
      maintenanceType: 'PREVENTIVE',
      priority: 'MEDIUM',
      scheduledDate: new Date().toISOString().slice(0, 10),
      description: '',
      assignedToName: '',
      laborHours: 0,
      laborRate: 0,
      intervalDays: 0,
      partsUsed: [],
      notes: '',
    })
  }

  const partsColumns: LineColumn<PartRow>[] = [
    { key: 'itemName', header: 'Part / consumable', minWidth: 180 },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 80 },
    { key: 'unit', header: 'Unit', minWidth: 80 },
    { key: 'costPerUnit', header: 'Cost / unit', type: 'money', align: 'right', minWidth: 120 },
    {
      key: 'lineTotal',
      header: 'Line total',
      type: 'money',
      align: 'right',
      readOnly: true,
      compute: (r) => Number(r.quantity ?? 0) * Number(r.costPerUnit ?? 0),
      minWidth: 130,
    },
  ]

  const submit = () => {
    if (!form.docNumber.trim() || !form.assetId) return toast.error('Doc number + asset required')
    if (!form.description.trim()) return toast.error('Description is required')
    createMutation({
      variables: {
        input: {
          organizationId: orgId,
          docNumber: form.docNumber.trim().toUpperCase(),
          assetId: form.assetId,
          assetCode: form.assetCode || undefined,
          assetName: form.assetName || undefined,
          maintenanceType: form.maintenanceType,
          priority: form.priority,
          scheduledDate: form.scheduledDate,
          description: form.description.trim(),
          assignedToName: form.assignedToName || undefined,
          laborHours: Number(form.laborHours ?? 0),
          laborRate: Number(form.laborRate ?? 0),
          intervalDays: Number(form.intervalDays) || undefined,
          partsUsed: form.partsUsed
            .filter((p) => p.itemName?.trim() && Number(p.quantity) > 0)
            .map((p) => ({
              itemName: p.itemName.trim(),
              quantity: Number(p.quantity),
              unit: p.unit || 'unit',
              costPerUnit: Number(p.costPerUnit ?? 0),
            })),
          notes: form.notes || undefined,
        },
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Asset Maintenance"
        description="Preventive + corrective maintenance schedules tied to your fixed assets."
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New work order
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total work orders" value={formatNumber(rows.length)} icon={<Wrench className="h-5 w-5" />} tone="brand" />
        <StatCard label="In progress" value={formatNumber(stats.inProgress)} icon={<Play className="h-5 w-5" />} tone="sky" />
        <StatCard label="Completed" value={formatNumber(stats.completed)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Total cost" value={formatMoneyCompact(stats.totalCost)} icon={<CircleDollarSign className="h-5 w-5" />} tone="warn" />
      </div>

      {upcoming.length > 0 && (
        <SectionCard title="Upcoming in next 30 days" description={`${upcoming.length} scheduled`} bodyClassName="p-0">
          <ul className="divide-y">
            {upcoming.slice(0, 6).map((u: any) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{u.assetName} · {u.docNumber}</p>
                  <p className="text-xs text-muted-foreground">{u.maintenanceType?.replace('_', ' ')} · {u.priority}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{u.scheduledDate ? formatDate(u.scheduledDate) : '—'}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard
        title="All work orders"
        description={`${filtered.length} of ${rows.length}`}
        action={
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs w-56 focus:ring-2 focus:ring-primary/40 outline-none" />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Wrench className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No maintenance work orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Doc</th>
                  <th className="px-3 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Priority</th>
                  <th className="px-3 py-3 font-medium">Scheduled</th>
                  <th className="px-3 py-3 font-medium text-right">Total cost</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{r.docNumber}</td>
                    <td className="px-3 py-3 font-medium">{r.assetName || '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground">{String(r.maintenanceType).replace('_', ' ')}</td>
                    <td className="px-3 py-3"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-3 py-3 text-muted-foreground">{r.scheduledDate ? formatDate(r.scheduledDate) : '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{formatMoney(r.totalCost ?? 0)}</td>
                    <td className="px-3 py-3"><MaintStatus status={r.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {r.status === 'SCHEDULED' && (
                          <button onClick={() => startMutation({ variables: { id: r.id } })} className="h-7 w-7 grid place-items-center rounded-md text-sky-600 hover:bg-sky-50" title="Start">
                            <Play className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {r.status === 'IN_PROGRESS' && (
                          <button onClick={() => completeMutation({ variables: { id: r.id, input: {} } })} className="h-7 w-7 grid place-items-center rounded-md text-emerald-600 hover:bg-emerald-50" title="Complete">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(`Delete ${r.docNumber}?`)) deleteMutation({ variables: { id: r.id } }) }} className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="Schedule maintenance"
        description="Preventive, corrective, or inspection work order against a fixed asset."
        icon={<Wrench className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Create work order"
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Doc number *</Label>
              <Input value={form.docNumber} onChange={(e) => setForm({ ...form, docNumber: e.target.value.toUpperCase() })} className="font-mono" placeholder="MNT-001" />
            </div>
            <div className="space-y-1.5">
              <Label>Asset *</Label>
              <select
                value={form.assetId}
                onChange={(e) => {
                  const a = assets.find((x: any) => x.id === e.target.value)
                  setForm({ ...form, assetId: e.target.value, assetName: a?.name ?? '', assetCode: a?.assetCode ?? '' })
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Select —</option>
                {assets.map((a: any) => <option key={a.id} value={a.id}>{a.assetCode} · {a.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Scheduled date *</Label>
              <Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select value={form.maintenanceType} onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Recurring every (days)</Label>
              <Input type="number" min={0} value={form.intervalDays} onChange={(e) => setForm({ ...form, intervalDays: Number(e.target.value) })} placeholder="0 = one-off" />
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <Label>Description *</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What needs to be done?" />
            </div>
            <div className="space-y-1.5">
              <Label>Assigned to</Label>
              <Input value={form.assignedToName} onChange={(e) => setForm({ ...form, assignedToName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Labor hours</Label>
              <Input type="number" min={0} step="0.5" value={form.laborHours} onChange={(e) => setForm({ ...form, laborHours: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Labor rate (₹/h)</Label>
              <Input type="number" min={0} step="0.01" value={form.laborRate} onChange={(e) => setForm({ ...form, laborRate: Number(e.target.value) })} />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Parts / consumables" className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<PartRow>
            columns={partsColumns}
            rows={form.partsUsed}
            onChange={(rows) => setForm({ ...form, partsUsed: rows })}
            buildRow={() => ({ itemName: '', quantity: 1, unit: 'unit', costPerUnit: 0 })}
            totals={[{ key: 'lineTotal', label: 'Parts cost', format: 'money' }]}
            minRows={0}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = String(priority || '').toUpperCase()
  const tone =
    p === 'URGENT' ? 'bg-rose-50 text-rose-700 border-rose-200'
      : p === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200'
        : p === 'MEDIUM' ? 'bg-sky-50 text-sky-700 border-sky-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{p}</span>
}

function MaintStatus({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'IN_PROGRESS' ? 'bg-sky-50 text-sky-700 border-sky-200'
        : s === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-200'
          : s === 'CANCELLED' ? 'bg-slate-100 text-slate-500 border-slate-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s.replace('_', ' ')}</span>
}
