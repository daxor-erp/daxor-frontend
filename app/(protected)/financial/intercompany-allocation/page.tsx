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
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Layers, CheckCircle2, Trash2, Send } from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

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
    return { total, posted }
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
    if (Math.abs(sum - 100) > 0.01) return toast.error(`Percentages must sum to 100 (currently {formatMoney(sum)})`)
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

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Intercompany Allocation"
        description="Distribute a source amount across target organizations by % share. Posts to intercompany journal on approval."
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New schedule
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Schedules" value={formatNumber(allocations.length)} icon={<Layers className="h-5 w-5" />} tone="brand" />
        <StatCard label="Posted" value={formatNumber(stats.posted)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Total allocated" value={formatMoneyCompact(stats.total)} icon={<Layers className="h-5 w-5" />} tone="warn" />
      </div>

      <SectionCard title="Schedules" bodyClassName="p-0">
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : allocations.length === 0 ? (
          <div className="p-10 text-center">
            <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No allocation schedules</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Source account</th>
                  <th className="px-3 py-3 font-medium">Basis date</th>
                  <th className="px-3 py-3 font-medium text-right">Basis amount</th>
                  <th className="px-3 py-3 font-medium text-right">Targets</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a: any) => (
                  <tr key={a.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{a.scheduleCode}</td>
                    <td className="px-3 py-3 font-medium">{a.name}</td>
                    <td className="px-3 py-3 font-mono text-xs">{a.sourceAccount}</td>
                    <td className="px-3 py-3 text-muted-foreground">{a.basisDate ? formatDate(a.basisDate) : '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(a.basisAmount ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{a.lines?.length ?? 0}</td>
                    <td className="px-3 py-3"><AllocStatus status={a.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {(a.status === 'DRAFT' || a.status === 'ACTIVE') && (
                          <button onClick={() => postMutation({ variables: { id: a.id } })} className="h-7 w-7 grid place-items-center rounded-md text-emerald-600 hover:bg-emerald-50" title="Post">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(`Delete ${a.scheduleCode}?`)) deleteMutation({ variables: { id: a.id } }) }} className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50">
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

function AllocStatus({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'POSTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'REVERSED' ? 'bg-rose-50 text-rose-700 border-rose-200'
        : s === 'ACTIVE' ? 'bg-sky-50 text-sky-700 border-sky-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s}</span>
}
