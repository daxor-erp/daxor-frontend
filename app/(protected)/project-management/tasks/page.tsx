'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PRODUCTION_PLANNINGS, UPDATE_PRODUCTION_PLANNING, GET_PROJECTS, GET_USERS } from '@/gql/queries'
import { Trash2, Edit, X, Save, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const EMPTY_FORM = {
  name: '',
  description: '',
  assignedTo: '',
  status: 'pending',
  priority: 'medium',
  startDate: '',
  dueDate: '',
  projectId: '',
}

export default function TasksPage() {
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

  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
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

    const tasks = editing 
      ? plan.tasks.map((t: any) => t.id === editing.taskId ? { ...form, id: editing.taskId } : t)
      : [...(plan.tasks || []), form]

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
          tasks,
          milestones: plan.milestones || [],
          organizationId: orgId,
        },
      },
    })
  }

  const handleEdit = (task: any) => {
    setForm({
      name: task.name || '',
      description: task.description || '',
      assignedTo: task.assignedTo || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      startDate: task.startDate?.split('T')[0] || '',
      dueDate: task.dueDate?.split('T')[0] || '',
      projectId: task.planId || '',
    })
    setEditing({ taskId: task.id, planId: task.planId })
    setAdding(true)
  }

  const handleDelete = (task: any) => {
    if (!confirm('Delete this task?')) return
    const plan = data?.productionplannings?.find((p: any) => p.id === task.planId)
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
          tasks: plan.tasks.filter((t: any) => t.id !== task.id),
          milestones: plan.milestones || [],
          organizationId: orgId,
        },
      },
    })
  }

  const plans = data?.productionplannings || []
  const projects = projectsData?.projects || []
  const users = usersData?.usersByOrganization?.users || []

  const allTasks = plans.flatMap((plan: any) =>
    (plan.tasks || []).map((task: any) => ({ ...task, planId: plan.id, planDocNumber: plan.docNumber }))
  )

  const stats = {
    total: allTasks.length,
    pending: allTasks.filter((t: any) => t.status === 'pending').length,
    inProgress: allTasks.filter((t: any) => t.status === 'in-progress').length,
    completed: allTasks.filter((t: any) => t.status === 'completed').length,
  }

  const priorityColor: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    blocked: 'bg-red-100 text-red-700',
  }

  const columns: Column[] = [
    { key: 'name', label: 'Task Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'planDocNumber', label: 'Plan #', width: '120px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'assignedTo', label: 'Assigned To', width: '150px', render: v => {
      const u = users.find((user: any) => user.id === v)
      return u ? `${u.firstName} ${u.lastName}` : '—'
    }},
    { key: 'status', label: 'Status', width: '110px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${statusColor[v]}`}>{v}</span> },
    { key: 'priority', label: 'Priority', width: '100px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${priorityColor[v]}`}>{v}</span> },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: v => v ? formatDate(v) : '—' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-gray-500">Manage project tasks and assignments</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: CheckCircle, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: Clock, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Task' : 'New Task'}</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Task Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <SelectFloating label="Production Plan *" value={form.projectId} onChange={e => setF('projectId', typeof e === 'string' ? e : e.target.value)} options={plans.map((p: any) => ({ value: p.id, label: p.docNumber }))} error={errors.projectId} className="h-7 text-xs" />
            </div>
            <InputFloating label="Description" multiline rows={2} value={form.description} onChange={e => setF('description', e.target.value)} className="text-xs" />
            <div className="grid grid-cols-4 gap-3">
              <SelectFloating label="Assigned To" value={form.assignedTo} onChange={e => setF('assignedTo', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...users.map((u: any) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.status} onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'pending', label: 'Pending' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }, { value: 'blocked', label: 'Blocked' }]} className="h-7 text-xs" />
              <SelectFloating label="Priority" value={form.priority} onChange={e => setF('priority', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} className="h-7 text-xs" />
              <InputFloating label="Due Date" type="date" value={form.dueDate} onChange={e => setF('dueDate', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{updating ? 'Saving…' : editing ? 'Update' : 'Save Task'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={allTasks}
        columns={columns}
        loading={loading}
        title="All Tasks"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Task"
        searchable
        searchPlaceholder="Search tasks..."
        emptyMessage="No tasks yet. Click 'New Task' to create one."
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row), variant: 'ghost' },
        ]}
      />
    </div>
  )
}
