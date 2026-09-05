'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PRODUCTION_PLANNINGS, UPDATE_PRODUCTION_PLANNING } from '@/gql/queries'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Trash2, Edit, X, Save, Flag, CheckCircle, Plus } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  description: '',
  dueDate: '',
  status: 'pending',
  projectId: '',
}

export default function MilestonesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [updateRecord, { loading: updating }] = useMutation(UPDATE_PRODUCTION_PLANNING, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}); setEditing(null) }
  const setF = (k: string, v: any) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.projectId) e.projectId = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const plan = data?.productionplannings?.find((p: any) => p.id === form.projectId)
    if (!plan) return

    const milestones = editing 
      ? plan.milestones.map((m: any) => m.id === editing.milestoneId ? { ...form, id: editing.milestoneId } : m)
      : [...(plan.milestones || []), form]

    updateRecord({
      variables: {
        id: plan.id,
        input: {
          docDate: plan.docDate,
          projectId: plan.projectId,
          managerId: plan.managerId,
          budget: plan.budget,
          actualCost: plan.actualCost,
          progress: plan.progress,
          status: plan.status,
          tasks: plan.tasks || [],
          milestones,
          organizationId: orgId,
        },
      },
    })
  }

  const handleEdit = (milestone: any) => {
    setForm({
      name: milestone.name || '',
      description: milestone.description || '',
      dueDate: milestone.dueDate?.split('T')[0] || '',
      status: milestone.status || 'pending',
      projectId: milestone.planId || '',
    })
    setEditing({ milestoneId: milestone.id, planId: milestone.planId })
    setAdding(true)
  }

  const handleDelete = (milestone: any) => {
    if (!confirm('Delete this milestone?')) return
    const plan = data?.productionplannings?.find((p: any) => p.id === milestone.planId)
    if (!plan) return

    updateRecord({
      variables: {
        id: plan.id,
        input: {
          docDate: plan.docDate,
          projectId: plan.projectId,
          managerId: plan.managerId,
          budget: plan.budget,
          actualCost: plan.actualCost,
          progress: plan.progress,
          status: plan.status,
          tasks: plan.tasks || [],
          milestones: plan.milestones.filter((m: any) => m.id !== milestone.id),
          organizationId: orgId,
        },
      },
    })
  }

  const plans = data?.productionplannings || []

  const allMilestones = plans.flatMap((plan: any) =>
    (plan.milestones || []).map((milestone: any) => ({ ...milestone, planId: plan.id, planDocNumber: plan.docNumber }))
  )

  const stats = {
    total: allMilestones.length,
    pending: allMilestones.filter((m: any) => m.status === 'pending').length,
    completed: allMilestones.filter((m: any) => m.status === 'completed').length,
  }

  const columns: Column[] = [
    { key: 'name', label: 'Milestone Name', sortable: true, render: v => <span className="text-sm font-medium">{v}</span> },
    { key: 'planDocNumber', label: 'Plan #', width: '120px', render: v => <MonoCell value={v} /> },
    { key: 'description', label: 'Description', render: v => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: v => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Milestones"
        subtitle="Track project milestones and deliverables"
        icon={<Flag className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Project Management' }, { label: 'Milestones' }]}
        actions={
          <Button onClick={() => { reset(); setAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Milestone
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={stats.total} icon={<Flag className="h-5 w-5" />} variant="blue" />
        <StatCard label="Pending" value={stats.pending} icon={<Flag className="h-5 w-5" />} variant="amber" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {adding && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Milestone' : 'New Milestone'}</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Milestone Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <SelectFloating label="Production Plan *" value={form.projectId} onChange={e => setF('projectId', typeof e === 'string' ? e : e.target.value)} options={plans.map((p: any) => ({ value: p.id, label: p.docNumber }))} error={errors.projectId} className="h-7 text-xs" />
            </div>
            <InputFloating label="Description" multiline rows={2} value={form.description} onChange={e => setF('description', e.target.value)} className="text-xs" />
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Due Date" type="date" value={form.dueDate} onChange={e => setF('dueDate', e.target.value)} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.status} onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }]} className="h-7 text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={updating} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{updating ? 'Saving…' : editing ? 'Update' : 'Save Milestone'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={allMilestones}
        columns={columns}
        loading={loading}
        title="All Milestones"
        searchable
        searchPlaceholder="Search milestones…"
        emptyMessage="No milestones yet. Click 'New Milestone' to create one."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row) },
        ]}
      />
    </div>
  )
}
