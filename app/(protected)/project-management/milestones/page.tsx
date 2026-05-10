'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PRODUCTION_PLANNINGS, UPDATE_PRODUCTION_PLANNING } from '@/gql/queries'
import { Trash2, Edit, X, Save, Flag, CheckCircle } from 'lucide-react'

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

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  }

  const columns: Column[] = [
    { key: 'name', label: 'Milestone Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'planDocNumber', label: 'Plan #', width: '120px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'description', label: 'Description', render: v => <span className="text-xs text-gray-500">{v || '—'}</span> },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', width: '110px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${statusColor[v]}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Milestones</h1>
        <p className="text-gray-500">Track project milestones and deliverables</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Flag, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: Flag, cls: 'text-yellow-600 bg-yellow-50' },
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
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Milestone' : 'New Milestone'}</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
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
              <Button size="sm" onClick={handleSubmit} disabled={updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
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
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Milestone"
        searchable
        searchPlaceholder="Search milestones..."
        emptyMessage="No milestones yet. Click 'New Milestone' to create one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row), variant: 'ghost' },
        ]}
      />
    </div>
  )
}
