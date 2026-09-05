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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus, ShieldCheck, CheckCircle2, XCircle,
  Trash2, ClipboardCheck,
} from 'lucide-react'

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

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'inspectionDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'itemName', label: 'Item', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'sourceModule', label: 'Source', width: '130px', render: (v) => <span className="text-sm text-muted-foreground">{String(v || '').replace('_', ' ')}</span> },
    { key: 'quantityInspected', label: 'Inspected', width: '100px', align: 'right', render: (v) => <span className="text-sm tabular-nums">{Number(v ?? 0)}</span> },
    { key: 'quantityPassed', label: 'Passed', width: '90px', align: 'right', render: (v) => <span className="text-sm tabular-nums text-emerald-700">{Number(v ?? 0)}</span> },
    { key: 'quantityFailed', label: 'Failed', width: '90px', align: 'right', render: (v) => <span className="text-sm tabular-nums text-rose-700">{Number(v ?? 0)}</span> },
    { key: 'outcome', label: 'Outcome', width: '120px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Quality Control"
        subtitle="Inspection records, defect classification, accept/reject gates for incoming and produced goods"
        icon={<ClipboardCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'Quality' }]}
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New inspection
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={inspections.length} icon={<ClipboardCheck className="h-5 w-5" />} variant="slate" />
        <StatCard label="Accepted" value={stats.accepted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle className="h-5 w-5" />} variant="rose" />
        <StatCard label="Accept rate" value={`${stats.acceptRate}%`} icon={<ShieldCheck className="h-5 w-5" />} variant="blue" />
      </StatsRow>

      <div className="flex justify-end">
        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs"
        >
          <option value="">All outcomes</option>
          {OUTCOMES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <DataTable
        data={inspections}
        columns={columns}
        loading={listQ.loading}
        title="All Inspections"
        searchable
        searchPlaceholder="Search doc / item / batch…"
        emptyMessage="No QC inspections found."
        pageSize={25}
        actions={[
          {
            label: 'Accept',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => outcomeMutation({ variables: { id: r.id, outcome: 'ACCEPTED' } }),
            show: (r: any) => r.outcome === 'PENDING',
          },
          {
            label: 'Reject',
            icon: <XCircle className="h-3.5 w-3.5" />,
            onClick: (r: any) => outcomeMutation({ variables: { id: r.id, outcome: 'REJECTED' } }),
            show: (r: any) => r.outcome === 'PENDING',
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
