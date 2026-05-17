'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '@/gql/queries'
import { Trash2, Edit, X, Save, FolderKanban } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const EMPTY_FORM = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'active',
}

export default function ProjectMastersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createProject, { loading: saving }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => refetch(),
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      name: form.name,
      description: form.description || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      organizationId: orgId,
    }
    if (editing) {
      updateProject({ variables: { id: editing, input: { ...input, status: form.status } } })
    } else {
      createProject({ variables: { input } })
    }
  }

  const handleEdit = (project: any) => {
    setForm({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      status: project.status || 'active',
    })
    setEditing(project.id)
    setAdding(true)
  }

  const projects = data?.projects ?? []

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '120px', render: v => <span className="font-mono text-xs text-gray-500">{v || '—'}</span> },
    { key: 'name', label: 'Project Name', sortable: true, render: v => <span className="font-medium text-gray-800">{v}</span> },
    { key: 'description', label: 'Description', render: v => <span className="text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'endDate', label: 'End Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'status', label: 'Status', width: '110px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${v === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Masters</h1>
        <p className="text-gray-500">Manage project master data</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Project Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.status} onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'completed', label: 'Completed' }]} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Start Date" type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="End Date" type="date" value={form.endDate} onChange={e => setF('endDate', e.target.value)} className="h-7 text-xs" />
            </div>
            <InputFloating label="Description" multiline rows={2} value={form.description} onChange={e => setF('description', e.target.value)} className="text-xs min-h-[50px]" />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        title="All Projects"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Project"
        searchable
        searchPlaceholder="Search projects..."
        emptyMessage="No projects yet. Click 'New Project' to create one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this project?')) deleteProject({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
