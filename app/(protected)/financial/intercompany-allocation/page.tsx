'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_INTERCOMPANY_ALLOCATIONS,
  CREATE_INTERCOMPANY_ALLOCATION,
  DELETE_INTERCOMPANY_ALLOCATION,
  POST_INTERCOMPANY_ALLOCATION,
  GET_ORGANIZATIONS,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Layers, CheckCircle2, Trash2, Send, CircleDollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const METHODS = ['FIXED_PERCENT', 'HEADCOUNT', 'REVENUE_SHARE', 'CUSTOM']

interface AllocationLineRow {
  id?: string
  targetOrganizationId: string
  targetOrganizationName?: string
  percentage: number
  amount?: number
  costCenter?: string
}

export default function IntercompanyAllocationPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    scheduleCode: '',
    name: '',
    description: '',
    sourceAccount: '',
    basisAmount: 0,
    basisDate: new Date().toISOString().slice(0, 10),
    allocationMethod: 'FIXED_PERCENT',
    lines: [] as AllocationLineRow[],
    notes: '',
  })

  const listQ = useQuery(GET_INTERCOMPANY_ALLOCATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const orgsQ = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 500, search: null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_INTERCOMPANY_ALLOCATION, {
    onCompleted: () => { listQ.refetch(); setOpen(false); resetForm(); toast.success('Allocation schedule created') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_INTERCOMPANY_ALLOCATION, {
    onCompleted: () => { listQ.refetch(); toast.success('Removed') },
    onError: (e) => toast.error(e.message),
  })
  const [postMutation] = useMutation(POST_INTERCOMPANY_ALLOCATION, {
    onCompleted: () => { listQ.refetch(); toast.success('Posted to GL') },
    onError: (e) => toast.error(e.message),
  })

  const allocations: any[] = listQ.data?.intercompanyAllocations ?? []
  const orgs: any[] = orgsQ.data?.organizations ?? []
  const orgOptions = useMemo(() => orgs.map((o: any) => ({ value: o.id, label: o.name })), [orgs])

  const stats = useMemo(() => {
    const total = allocations.reduce((s, a) => s + Number(a.totalAllocated ?? 0), 0)
    const posted = allocations.filter((a) => a.status === 'POSTED').length
    const draft = allocations.filter((a) => a.status === 'DRAFT').length
    return { total, posted, draft }
  }, [allocations])

  function resetForm() {
    setForm({
      scheduleCode: '',
      name: '',
      description: '',
      sourceAccount: '',
      basisAmount: 0,
      basisDate: new Date().toISOString().slice(0, 10),
      allocationMethod: 'FIXED_PERCENT',
      lines: [],
      notes: '',
    })
  }

  const lineColumns: LineColumn<AllocationLineRow>[] = [
    {
      key: 'targetOrganizationId',
      header: 'Target organization',
      type: 'select',
      options: [{ value: '', label: '— Select —' }, ...orgOptions],
      minWidth: 220,
    },
    { key: 'percentage', header: 'Share %', type: 'number', align: 'right', minWidth: 100 },
    {
      key: 'amount',
      header: 'Amount',
      type: 'money',
      align: 'right',
      readOnly: true,
      compute: (r) => (Number(form.basisAmount ?? 0) * Number(r.percentage ?? 0)) / 100,
      minWidth: 130,
    },
    { key: 'costCenter', header: 'Cost center', minWidth: 140 },
  ]

  const totalPct = form.lines.reduce((s, l) => s + Number(l.percentage ?? 0), 0)

  const submit = () => {
    if (!form.scheduleCode.trim() || !form.name.trim() || !form.sourceAccount.trim()) {
      return toast.error('Schedule code, name and source account are required')
    }
    if (form.lines.length === 0) return toast.error('Add at least one allocation line')
    const sum = form.lines.reduce((s, l) => s + Number(l.percentage ?? 0), 0)
    if (Math.abs(sum - 100) > 0.01) return toast.error(`Percentages must sum to 100 (currently ${sum})`)
    const cleanLines = form.lines.filter((l) => l.targetOrganizationId && Number(l.percentage) > 0)
    if (cleanLines.length === 0) return toast.error('At least one valid allocation line is required')
    createMutation({
      variables: {
        input: {
          organizationId: orgId,
          scheduleCode: form.scheduleCode.trim().toUpperCase(),
          name: form.name.trim(),
          description: form.description || undefined,
          sourceAccount: form.sourceAccount.trim(),
          basisAmount: Number(form.basisAmount),
          basisDate: form.basisDate,
          allocationMethod: form.allocationMethod,
          lines: cleanLines.map((l) => {
            const sel = orgs.find((o: any) => o.id === l.targetOrganizationId)
            return {
              targetOrganizationId: l.targetOrganizationId,
              targetOrganizationName: sel?.name,
              percentage: Number(l.percentage),
              costCenter: l.costCenter || undefined,
            }
          }),
          notes: form.notes || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'scheduleCode', label: 'Code', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Name', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'sourceAccount', label: 'Source account', width: '150px', render: (v) => <MonoCell value={v} /> },
    { key: 'basisDate', label: 'Basis date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'basisAmount', label: 'Basis amount', width: '130px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'lines', label: 'Targets', width: '90px', align: 'right', render: (v) => <span className="text-sm tabular-nums">{Array.isArray(v) ? v.length : 0}</span> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Intercompany Allocation"
        subtitle="Distribute a source amount across target organizations by % share"
        icon={<Layers className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Intercompany Allocation' }]}
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New schedule
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Schedules" value={allocations.length} icon={<Layers className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Layers className="h-5 w-5" />} variant="amber" />
        <StatCard label="Posted" value={stats.posted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total allocated" value={`₹${(stats.total / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={allocations}
        columns={columns}
        loading={listQ.loading}
        title="All Allocation Schedules"
        searchable
        searchPlaceholder="Search schedules…"
        emptyMessage="No allocation schedules found."
        pageSize={25}
        actions={[
          {
            label: 'Post',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => postMutation({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'DRAFT' || r.status === 'ACTIVE',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Delete ${r.scheduleCode}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="New allocation schedule"
        description="Define how an amount is split across target organizations."
        icon={<Layers className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Create schedule"
        footerStart={
          <span>
            Lines sum to <strong className={cn('font-semibold', Math.abs(totalPct - 100) > 0.01 ? 'text-rose-600' : 'text-emerald-700')}>{totalPct.toFixed(2)}%</strong>
          </span>
        }
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Schedule code *</Label>
              <Input value={form.scheduleCode} onChange={(e) => setForm({ ...form, scheduleCode: e.target.value.toUpperCase() })} className="font-mono" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Source account *</Label>
              <Input value={form.sourceAccount} onChange={(e) => setForm({ ...form, sourceAccount: e.target.value })} placeholder="e.g. 5100 Shared services" />
            </div>
            <div className="space-y-1.5">
              <Label>Basis amount (₹) *</Label>
              <Input type="number" min={0} step="0.01" value={form.basisAmount} onChange={(e) => setForm({ ...form, basisAmount: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Basis date *</Label>
              <Input type="date" value={form.basisDate} onChange={(e) => setForm({ ...form, basisDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Allocation method</Label>
              <select value={form.allocationMethod} onChange={(e) => setForm({ ...form, allocationMethod: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {METHODS.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
              </select>
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Allocation lines" description="Percentages must sum to 100." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<AllocationLineRow>
            columns={lineColumns}
            rows={form.lines}
            onChange={(rows) => setForm({ ...form, lines: rows })}
            buildRow={() => ({ targetOrganizationId: '', percentage: 0 })}
            totals={[{ key: 'percentage', label: '%', format: 'number' }, { key: 'amount', label: '₹', format: 'money' }]}
            minRows={1}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}
