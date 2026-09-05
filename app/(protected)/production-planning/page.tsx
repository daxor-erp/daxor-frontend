'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PRODUCTION_PLANNINGS, CREATE_PRODUCTION_PLANNING, UPDATE_PRODUCTION_PLANNING, DELETE_PRODUCTION_PLANNING, GET_PROJECTS, GET_USERS } from '@/gql/queries'
import { Trash2, Edit, X, Save, FolderKanban, Plus, Minus, CheckCircle2, Clock, CircleDollarSign } from 'lucide-react'

const EMPTY_FORM = {
  docDate: new Date().toISOString().split('T')[0],
  projectId: '',
  managerId: '',
  budget: '',
  actualCost: '',
  progress: '0',
  status: 'DRAFT',
  tasks: [] as any[],
  milestones: [] as any[],
}

const EMPTY_TASK = {
  name: '',
  description: '',
  assignedTo: '',
  status: 'pending',
  priority: 'medium',
  startDate: '',
  dueDate: '',
}

const EMPTY_MILESTONE = {
  name: '',
  description: '',
  dueDate: '',
  status: 'pending',
}

export default function ProductionPlanningPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_PRODUCTION_PLANNINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createRecord, { loading: saving }] = useMutation(CREATE_PRODUCTION_PLANNING, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateRecord, { loading: updating }] = useMutation(UPDATE_PRODUCTION_PLANNING, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteRecord] = useMutation(DELETE_PRODUCTION_PLANNING, {
    onCompleted: () => refetch(),
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: any) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const addTask = () => setF('tasks', [...form.tasks, { ...EMPTY_TASK }])
  const removeTask = (idx: number) => setF('tasks', form.tasks.filter((_, i) => i !== idx))
  const updateTask = (idx: number, field: string, value: any) => {
    const updated = [...form.tasks]
    updated[idx] = { ...updated[idx], [field]: value }
    setF('tasks', updated)
  }

  const addMilestone = () => setF('milestones', [...form.milestones, { ...EMPTY_MILESTONE }])
  const removeMilestone = (idx: number) => setF('milestones', form.milestones.filter((_, i) => i !== idx))
  const updateMilestone = (idx: number, field: string, value: any) => {
    const updated = [...form.milestones]
    updated[idx] = { ...updated[idx], [field]: value }
    setF('milestones', updated)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.docDate) e.docDate = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      docDate: form.docDate,
      projectId: form.projectId || undefined,
      managerId: form.managerId || undefined,
      budget: form.budget ? parseFloat(form.budget) : undefined,
      actualCost: form.actualCost ? parseFloat(form.actualCost) : undefined,
      progress: parseFloat(form.progress),
      status: form.status,
      tasks: form.tasks.map(t => ({ ...t, assignedTo: t.assignedTo || undefined })),
      milestones: form.milestones,
      organizationId: orgId,
    }
    if (editing) {
      updateRecord({ variables: { id: editing, input } })
    } else {
      createRecord({ variables: { input } })
    }
  }

  const handleEdit = (record: any) => {
    setForm({
      docDate: record.docDate?.split('T')[0] || '',
      projectId: record.projectId || '',
      managerId: record.managerId || '',
      budget: record.budget?.toString() || '',
      actualCost: record.actualCost?.toString() || '',
      progress: record.progress?.toString() || '0',
      status: record.status || 'DRAFT',
      tasks: record.tasks || [],
      milestones: record.milestones || [],
    })
    setEditing(record.id)
    setAdding(true)
  }

  const items = data?.productionplannings || []
  const projects = projectsData?.projects || []
  const users = usersData?.usersByOrganization?.users || []

  const stats = useMemo(() => {
    const draft = items.filter((r: any) => String(r.status).toUpperCase() === 'DRAFT').length
    const active = items.filter((r: any) => String(r.status).toUpperCase() === 'ACTIVE').length
    const totalBudget = items.reduce((s: number, r: any) => s + Number(r.budget ?? 0), 0)
    return { draft, active, totalBudget }
  }, [items])

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc #', width: '150px', render: (v) => <MonoCell value={v} /> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'progress', label: 'Progress', width: '100px', render: (v) => <span className="text-sm tabular-nums">{v || 0}%</span> },
    { key: 'budget', label: 'Budget', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'actualCost', label: 'Actual Cost', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Production Planning"
        subtitle="Manage production planning with tasks and milestones"
        icon={<FolderKanban className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'Planning' }]}
        actions={
          <Button
            onClick={() => { reset(); setEditing(null); setAdding(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Plan
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Plans" value={items.length} icon={<FolderKanban className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Budget" value={`₹${(stats.totalBudget / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Record' : 'New Record'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Date *" type="date" value={form.docDate} onChange={e => setF('docDate', e.target.value)} error={errors.docDate} className="h-7 text-xs" />
              <SelectFloating label="Project" value={form.projectId} onChange={e => setF('projectId', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...projects.map((p: any) => ({ value: p.id, label: p.name }))]} className="h-7 text-xs" />
              <SelectFloating label="Manager" value={form.managerId} onChange={e => setF('managerId', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...users.map((u: any) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Budget" type="number" value={form.budget} onChange={e => setF('budget', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Actual Cost" type="number" value={form.actualCost} onChange={e => setF('actualCost', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Progress (%)" type="number" min="0" max="100" value={form.progress} onChange={e => setF('progress', e.target.value)} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.status} onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'DRAFT', label: 'Draft' }, { value: 'ACTIVE', label: 'Active' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' }]} className="h-7 text-xs" />
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">Tasks</span>
                <Button size="sm" variant="outline" onClick={addTask} className="h-6 text-xs"><Plus className="h-3 w-3 mr-1" />Add Task</Button>
              </div>
              {form.tasks.map((task: any, idx: number) => (
                <div key={idx} className="grid grid-cols-6 gap-2 mb-2 p-2 bg-muted/40 rounded">
                  <InputFloating label="Task Name" value={task.name} onChange={e => updateTask(idx, 'name', e.target.value)} className="h-6 text-xs" />
                  <SelectFloating label="Assigned To" value={task.assignedTo} onChange={e => updateTask(idx, 'assignedTo', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...users.map((u: any) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]} className="h-6 text-xs" />
                  <SelectFloating label="Status" value={task.status} onChange={e => updateTask(idx, 'status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'pending', label: 'Pending' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }, { value: 'blocked', label: 'Blocked' }]} className="h-6 text-xs" />
                  <SelectFloating label="Priority" value={task.priority} onChange={e => updateTask(idx, 'priority', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} className="h-6 text-xs" />
                  <InputFloating label="Due Date" type="date" value={task.dueDate} onChange={e => updateTask(idx, 'dueDate', e.target.value)} className="h-6 text-xs" />
                  <Button size="sm" variant="ghost" onClick={() => removeTask(idx)} className="h-6 text-xs"><Minus className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">Milestones</span>
                <Button size="sm" variant="outline" onClick={addMilestone} className="h-6 text-xs"><Plus className="h-3 w-3 mr-1" />Add Milestone</Button>
              </div>
              {form.milestones.map((milestone: any, idx: number) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mb-2 p-2 bg-muted/40 rounded">
                  <InputFloating label="Milestone Name" value={milestone.name} onChange={e => updateMilestone(idx, 'name', e.target.value)} className="h-6 text-xs" />
                  <InputFloating label="Description" value={milestone.description} onChange={e => updateMilestone(idx, 'description', e.target.value)} className="h-6 text-xs" />
                  <InputFloating label="Due Date" type="date" value={milestone.dueDate} onChange={e => updateMilestone(idx, 'dueDate', e.target.value)} className="h-6 text-xs" />
                  <Button size="sm" variant="ghost" onClick={() => removeMilestone(idx)} className="h-6 text-xs"><Minus className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Production Plans"
        searchable
        searchPlaceholder="Search plans…"
        emptyMessage="No production plans found."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: (row) => handleEdit(row) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Delete this record?')) deleteRecord({ variables: { id: row.id } }) } },
        ]}
      />
    </div>
  )
}
