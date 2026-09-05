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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, SectionPanel, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus, Wrench, Calendar, CircleDollarSign, Trash2,
  Play, CheckCircle2,
} from 'lucide-react'
import { formatMoneyCompact } from '@/lib/format-money'
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

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc', width: '120px', render: (v) => <MonoCell value={v} className="font-semibold text-foreground" /> },
    { key: 'assetName', label: 'Asset', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'maintenanceType', label: 'Type', width: '120px', render: (v) => <span className="text-sm text-muted-foreground">{String(v).replace(/_/g, ' ')}</span> },
    { key: 'priority', label: 'Priority', width: '100px', render: (v) => <ErpBadge status={String(v).toLowerCase()} /> },
    { key: 'scheduledDate', label: 'Scheduled', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'totalCost', label: 'Total Cost', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={String(v).toLowerCase()} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Asset Maintenance"
        subtitle="Preventive + corrective maintenance schedules tied to your fixed assets."
        icon={<Wrench className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Asset Maintenance' }]}
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Work Order
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Work Orders" value={rows.length} icon={<Wrench className="h-5 w-5" />} variant="blue" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Play className="h-5 w-5" />} variant="teal" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Cost" value={formatMoneyCompact(stats.totalCost)} icon={<CircleDollarSign className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      {upcoming.length > 0 && (
        <SectionPanel title="Upcoming in next 30 days" description={`${upcoming.length} scheduled`} noPadding>
          <ul className="divide-y">
            {upcoming.slice(0, 6).map((u: any) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{u.assetName} · {u.docNumber}</p>
                  <p className="text-xs text-muted-foreground">{u.maintenanceType?.replace(/_/g, ' ')} · {u.priority}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{u.scheduledDate ? formatDate(u.scheduledDate) : '—'}</span>
              </li>
            ))}
          </ul>
        </SectionPanel>
      )}

      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-card py-1.5 px-2 text-xs"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        loading={listQ.loading}
        title="All Work Orders"
        searchable
        searchPlaceholder="Search work orders…"
        emptyMessage="No maintenance work orders found."
        pageSize={25}
        actions={[
          {
            label: 'Start',
            icon: <Play className="h-3.5 w-3.5" />,
            onClick: (r: any) => startMutation({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'SCHEDULED',
          },
          {
            label: 'Complete',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => completeMutation({ variables: { id: r.id, input: {} } }),
            show: (r: any) => r.status === 'IN_PROGRESS',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Delete ${r.docNumber}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

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
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
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
            onChange={(next) => setForm({ ...form, partsUsed: next })}
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
