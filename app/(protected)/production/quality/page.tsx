'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_QC_INSPECTIONS,
  GET_QC_OUTCOME_SUMMARY,
  CREATE_QC_INSPECTION,
  SET_QC_OUTCOME,
  DELETE_QC_INSPECTION,
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
  Plus, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Trash2, Search, ClipboardCheck,
} from 'lucide-react'
import { formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

const SOURCE_MODULES = ['GRN', 'WORK_ORDER', 'MATERIAL_RECEIPT', 'SALES_RETURN', 'OTHER']
const OUTCOMES = ['PENDING', 'ACCEPTED', 'REJECTED', 'CONDITIONAL', 'REWORK']
const SEVERITIES = ['MINOR', 'MAJOR', 'CRITICAL']

interface DefectRow {
  id?: string
  code: string
  description?: string
  severity: string
  quantity: number
  rootCause?: string
  correctiveAction?: string
}

export default function QualityControlPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [outcomeFilter, setOutcomeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    docNumber: '',
    inspectionDate: new Date().toISOString().slice(0, 10),
    sourceModule: 'GRN',
    itemName: '',
    batchNumber: '',
    quantityInspected: 0,
    quantityPassed: 0,
    quantityFailed: 0,
    quantityReworked: 0,
    inspectorName: '',
    outcome: 'PENDING',
    defects: [] as DefectRow[],
    notes: '',
  })

  const listQ = useQuery(GET_QC_INSPECTIONS, {
    variables: { organizationId: orgId, outcome: outcomeFilter || null, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const summaryQ = useQuery(GET_QC_OUTCOME_SUMMARY, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_QC_INSPECTION, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); setOpen(false); resetForm(); toast.success('Inspection logged') },
    onError: (e) => toast.error(e.message),
  })
  const [outcomeMutation] = useMutation(SET_QC_OUTCOME, {
    onCompleted: (d) => { listQ.refetch(); summaryQ.refetch(); toast.success(`Outcome → ${d.setQCInspectionOutcome.outcome}`) },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_QC_INSPECTION, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); toast.success('Removed') },
    onError: (e) => toast.error(e.message),
  })

  const inspections: any[] = listQ.data?.qcInspections ?? []
  const summary: any[] = summaryQ.data?.qcOutcomeSummary ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return inspections
    const q = search.toLowerCase()
    return inspections.filter((i) => i.docNumber?.toLowerCase().includes(q) || i.itemName?.toLowerCase().includes(q) || i.batchNumber?.toLowerCase().includes(q))
  }, [inspections, search])

  const stats = useMemo(() => {
    const get = (o: string) => summary.find((s: any) => s.outcome === o)?.count ?? 0
    const acceptRate = inspections.length > 0
      ? Math.round((inspections.filter((i) => i.outcome === 'ACCEPTED').length / inspections.length) * 100)
      : 0
    return {
      pending: get('PENDING'),
      accepted: get('ACCEPTED'),
      rejected: get('REJECTED'),
      acceptRate,
    }
  }, [summary, inspections])

  function resetForm() {
    setForm({
      docNumber: '',
      inspectionDate: new Date().toISOString().slice(0, 10),
      sourceModule: 'GRN',
      itemName: '',
      batchNumber: '',
      quantityInspected: 0,
      quantityPassed: 0,
      quantityFailed: 0,
      quantityReworked: 0,
      inspectorName: '',
      outcome: 'PENDING',
      defects: [],
      notes: '',
    })
  }

  const defectColumns: LineColumn<DefectRow>[] = [
    { key: 'code', header: 'Defect code', minWidth: 120 },
    { key: 'description', header: 'Description', minWidth: 220 },
    { key: 'severity', header: 'Severity', type: 'select', options: SEVERITIES, minWidth: 110 },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 80 },
    { key: 'rootCause', header: 'Root cause', minWidth: 180 },
    { key: 'correctiveAction', header: 'Corrective action', minWidth: 220 },
  ]

  const submit = () => {
    if (!form.docNumber.trim() || !form.itemName.trim()) return toast.error('Doc number + item required')
    if (Number(form.quantityInspected) <= 0) return toast.error('Quantity inspected must be > 0')
    const total = Number(form.quantityPassed) + Number(form.quantityFailed) + Number(form.quantityReworked)
    if (total > Number(form.quantityInspected)) return toast.error('Pass + fail + rework cannot exceed inspected')
    createMutation({
      variables: {
        input: {
          organizationId: orgId,
          docNumber: form.docNumber.trim().toUpperCase(),
          inspectionDate: form.inspectionDate,
          sourceModule: form.sourceModule,
          itemName: form.itemName.trim(),
          batchNumber: form.batchNumber || undefined,
          quantityInspected: Number(form.quantityInspected),
          quantityPassed: Number(form.quantityPassed),
          quantityFailed: Number(form.quantityFailed),
          quantityReworked: Number(form.quantityReworked),
          inspectorName: form.inspectorName || undefined,
          outcome: form.outcome,
          defects: form.defects
            .filter((d) => d.code?.trim())
            .map((d) => ({
              code: d.code.trim().toUpperCase(),
              description: d.description || undefined,
              severity: d.severity || 'MINOR',
              quantity: Number(d.quantity ?? 1),
              rootCause: d.rootCause || undefined,
              correctiveAction: d.correctiveAction || undefined,
            })),
          notes: form.notes || undefined,
        },
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Quality Control"
        description="Inspection records, defect classification, accept/reject gates for incoming and produced goods."
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New inspection
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total" value={formatNumber(inspections.length)} icon={<ClipboardCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Accepted" value={formatNumber(stats.accepted)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Rejected" value={formatNumber(stats.rejected)} icon={<XCircle className="h-5 w-5" />} tone="rose" />
        <StatCard label="Accept rate" value={`${stats.acceptRate}%`} icon={<ShieldCheck className="h-5 w-5" />} tone="sky" />
      </div>

      <SectionCard
        title="Inspections"
        description={`${filtered.length} of ${inspections.length}`}
        action={
          <div className="flex items-center gap-2">
            <select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)} className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs">
              <option value="">All outcomes</option>
              {OUTCOMES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Doc / item / batch"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs w-56 focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No QC inspections yet</p>
            <p className="text-xs text-muted-foreground mb-3">Log inspections to gate GRN receipts, work order outputs, and customer returns.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Doc</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Source</th>
                  <th className="px-3 py-3 font-medium text-right">Inspected</th>
                  <th className="px-3 py-3 font-medium text-right">Passed</th>
                  <th className="px-3 py-3 font-medium text-right">Failed</th>
                  <th className="px-3 py-3 font-medium">Outcome</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i: any) => (
                  <tr key={i.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{i.docNumber}</td>
                    <td className="px-3 py-3 text-muted-foreground">{i.inspectionDate ? formatDate(i.inspectionDate) : '—'}</td>
                    <td className="px-3 py-3 font-medium">{i.itemName}</td>
                    <td className="px-3 py-3 text-muted-foreground">{String(i.sourceModule).replace('_', ' ')}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{Number(i.quantityInspected ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-emerald-700">{Number(i.quantityPassed ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-rose-700">{Number(i.quantityFailed ?? 0)}</td>
                    <td className="px-3 py-3"><QCOutcome status={i.outcome} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {i.outcome === 'PENDING' && (
                          <>
                            <button onClick={() => outcomeMutation({ variables: { id: i.id, outcome: 'ACCEPTED' } })} className="h-7 w-7 grid place-items-center rounded-md text-emerald-600 hover:bg-emerald-50">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => outcomeMutation({ variables: { id: i.id, outcome: 'REJECTED' } })} className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { if (confirm(`Delete ${i.docNumber}?`)) deleteMutation({ variables: { id: i.id } }) }}
                          className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                        >
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
        title="New QC inspection"
        description="Record inspection result and any defects found."
        icon={<ClipboardCheck className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Log inspection"
      >
        <FormSection title="Inspection">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Doc number *</Label>
              <Input value={form.docNumber} onChange={(e) => setForm({ ...form, docNumber: e.target.value.toUpperCase() })} className="font-mono" placeholder="QC-001" />
            </div>
            <div className="space-y-1.5">
              <Label>Inspection date *</Label>
              <Input type="date" value={form.inspectionDate} onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Source module *</Label>
              <select value={form.sourceModule} onChange={(e) => setForm({ ...form, sourceModule: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {SOURCE_MODULES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Item *</Label>
              <Input value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} placeholder="Item name" />
            </div>
            <div className="space-y-1.5">
              <Label>Batch / lot</Label>
              <Input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Inspector</Label>
              <Input value={form.inspectorName} onChange={(e) => setForm({ ...form, inspectorName: e.target.value })} />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Quantities" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={4}>
            <div className="space-y-1.5">
              <Label>Inspected *</Label>
              <Input type="number" min={0} value={form.quantityInspected} onChange={(e) => setForm({ ...form, quantityInspected: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Passed</Label>
              <Input type="number" min={0} value={form.quantityPassed} onChange={(e) => setForm({ ...form, quantityPassed: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Failed</Label>
              <Input type="number" min={0} value={form.quantityFailed} onChange={(e) => setForm({ ...form, quantityFailed: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Reworked</Label>
              <Input type="number" min={0} value={form.quantityReworked} onChange={(e) => setForm({ ...form, quantityReworked: Number(e.target.value) })} />
            </div>
          </FieldGrid>
          <div className="mt-3 space-y-1.5 max-w-xs">
            <Label>Outcome</Label>
            <select value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </FormSection>

        <FormSection title="Defects" description="Log specific defects found during inspection." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<DefectRow>
            columns={defectColumns}
            rows={form.defects}
            onChange={(rows) => setForm({ ...form, defects: rows })}
            buildRow={() => ({ code: '', severity: 'MINOR', quantity: 1 })}
            minRows={0}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}

function QCOutcome({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200'
        : s === 'CONDITIONAL' ? 'bg-sky-50 text-sky-700 border-sky-200'
          : s === 'REWORK' ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s}</span>
}
